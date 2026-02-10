import { NextResponse } from "next/server";
import { findSensitiveIdentifier } from "@/lib/leadGuard";
import { sendLeadEmail } from "@/lib/notify";
import { syncLeadToNotion } from "@/lib/notionLead";
import { site } from "@/lib/site";
import { appendAgentEvent } from "@/lib/agentEvents";
import { DATA_SHARING_RECIPIENT, validateLeadConsent } from "@/lib/leadConsent";
import { ensureComplianceTables } from "@/lib/compliance/db";
import { getPrismaClient } from "@/lib/prisma";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

type LeadPayload = {
  topic?: string;
  county?: string;
  productInterest?: string;
  contactMethod?: string;
  message?: string;
  consent?: boolean;
  dataSharingConsent?: boolean;
  dataSharingRecipient?: string;
  dataSharingEntities?: string[];
  leadTransferDisclosureAck?: boolean;
  beneficiaryInitiated?: boolean;
  intent?: boolean;
};

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true };
}

function extractZipFromMessage(message: string): string {
  const match = message.match(/\b\d{5}\b/);
  return match?.[0] || "";
}

export async function POST(req: Request) {
  const startMs = Date.now();
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(ip);
    if (!rate.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter || 60) } },
      );
    }

    const body = (await req.json()) as LeadPayload;
    const contactMethod = body.contactMethod?.trim() || "";
    const dataSharingEntities = Array.isArray(body.dataSharingEntities) ? body.dataSharingEntities : [];
    const leadRequestId = `lead_${Date.now()}`;

    const consentError = validateLeadConsent({
      consent: body.consent,
      dataSharingConsent: body.dataSharingConsent,
      dataSharingRecipient: body.dataSharingRecipient,
      dataSharingEntities,
      leadTransferDisclosureAck: body.leadTransferDisclosureAck,
    });
    if (consentError || !contactMethod) {
      await appendAgentEvent({
        event_type: "lead_received",
        status: "failed",
        summary: "Lead blocked: missing consent or contact method",
        route: "/api/leads",
        compliance_result: "block",
        meta: {
          hasContactMethod: Boolean(contactMethod),
          consent: body.consent === true,
          dataSharingConsent: body.dataSharingConsent === true,
          dataSharingRecipient: body.dataSharingRecipient || "",
          leadTransferDisclosureAck: body.leadTransferDisclosureAck === true,
          dataSharingEntities,
        },
      });
      return NextResponse.json(
        { ok: false, error: consentError || "Missing required fields." },
        { status: 400 },
      );
    }

    const topic = body.topic?.trim() || "General inquiry";
    const county = body.county?.trim() || "";
    const productInterest = body.productInterest?.trim() || "";
    const message = body.message?.trim() || "";
    const zip = extractZipFromMessage(message);
    const intent = body.intent !== false;
    const beneficiaryInitiated = body.beneficiaryInitiated !== false;
    const dataSharingConsentAt = new Date().toISOString();
    const dataSharingRecipient = DATA_SHARING_RECIPIENT;

    const sensitiveError = findSensitiveIdentifier(message);
    if (sensitiveError) {
      await appendAgentEvent({
        event_type: "lead_received",
        status: "failed",
        summary: `Lead blocked for sensitive identifiers (${topic})`,
        route: "/api/leads",
        compliance_result: "block",
        meta: {
          topic,
          county,
          zip,
        },
      });
      return NextResponse.json({ ok: false, error: sensitiveError }, { status: 400 });
    }

    const receivedAtIso = new Date().toISOString();
    const payload = {
      leadRequestId,
      topic,
      county,
      productInterest,
      contactMethod,
      message,
      receivedAtIso,
      dataSharingConsentAt,
      dataSharingRecipient,
    };

    await appendAgentEvent({
      event_type: "lead_received",
      status: "ok",
      summary: `${topic} lead captured`,
      route: "/api/leads",
      compliance_result: "pass",
      meta: {
        topic,
        county,
        zip,
        intent,
        beneficiaryInitiated,
        dataSharingConsent: true,
        dataSharingRecipient,
        leadTransferDisclosureAck: body.leadTransferDisclosureAck === true,
        dataSharingEntities,
      },
    });

    const prisma = getPrismaClient();
    if (prisma) {
      await ensureComplianceTables();
      await prisma.leadDisclosureAudit.create({
        data: {
          leadRequestId,
          leadTransferDisclosureAck: body.leadTransferDisclosureAck === true,
          dataSharingConsent: body.dataSharingConsent === true,
          dataSharingEntitiesJson: JSON.parse(JSON.stringify(dataSharingEntities)) as any,
          beneficiaryInitiated,
          sourceRoute: "/api/leads",
          zip: zip || null,
          productInterest: productInterest || null,
        },
      });
    }

    const notifications: {
      email: { status: "sent" | "failed" | "skipped"; reason?: string; provider?: "smtp" | "formsubmit" };
      sms: { status: "sent" | "failed" | "skipped"; reason?: string; errorCode?: number };
    } = {
      email: { status: "skipped" },
      sms: { status: "skipped", reason: "sms_disabled" },
    };

    notifications.email = await sendLeadEmail(payload);
    // SMS intentionally disabled (email-only mode).

    const emailAttempted = notifications.email.status !== "skipped";
    const emailSuccess = notifications.email.status === "sent";
    const smsAttempted = notifications.sms.status !== "skipped";
    const smsSuccess = notifications.sms.status === "sent";
    const smsErrorCode = notifications.sms.status === "failed" ? (notifications.sms as { errorCode?: number }).errorCode : undefined;

    console.info("lead_notifications", {
      email_attempted: emailAttempted,
      email_success: emailSuccess,
      email_reason: notifications.email.reason,
      email_provider: notifications.email.provider ?? null,
      sms_attempted: smsAttempted,
      sms_success: smsSuccess,
      sms_error_code: smsErrorCode ?? null,
      sms_reason: notifications.sms.reason ?? null,
    });

    const notionResult = intent ? await syncLeadToNotion(payload) : { status: "skipped", reason: "intent_false" };
    if (notionResult.status !== "skipped") {
      console.info("lead_notion", { status: notionResult.status, reason: notionResult.status === "sent" ? null : notionResult.reason });
    }

    const elapsedMs = Date.now() - startMs;
    console.info("lead_request", {
      elapsed_ms: elapsedMs,
      topic,
      county,
      has_contact: Boolean(contactMethod),
      message_length: message.length,
      consent: body.consent === true,
      intent,
    });

    const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            source: "Website",
            dataSharingConsent: true,
            leadTransferDisclosureAck: body.leadTransferDisclosureAck === true,
            dataSharingEntities,
          }),
        });
        if (!webhookRes.ok) {
          console.warn("lead_webhook", { status: webhookRes.status });
        }
      } catch (webhookErr) {
        console.warn("lead_webhook", { error: webhookErr instanceof Error ? webhookErr.message : String(webhookErr) });
      }
    }

    const responseMessage =
      emailSuccess
        ? "Got it, Patrick will follow up."
        : `We received your request. If you don't hear back within an hour, please call us at ${site.phoneDisplay}.`;

    return NextResponse.json({
      ok: true,
      leadRequestId,
      message: responseMessage,
      notifications,
      notion: { status: notionResult.status, reason: notionResult.status === "sent" ? undefined : notionResult.reason },
      email: { status: notifications.email.status, reason: notifications.email.reason, provider: notifications.email.provider },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
