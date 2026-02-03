import { NextResponse } from "next/server";
import { findSensitiveIdentifier } from "@/lib/leadGuard";
import { sendLeadEmail } from "@/lib/notify";
import { syncLeadToNotion } from "@/lib/notionLead";

type LeadPayload = {
  topic?: string;
  county?: string;
  contactMethod?: string;
  message?: string;
  consent?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    const contactMethod = body.contactMethod?.trim() || "";

    if (!body.consent || !contactMethod) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const topic = body.topic?.trim() || "General inquiry";
    const county = body.county?.trim() || "";
    const message = body.message?.trim() || "";

    const sensitiveError = findSensitiveIdentifier(message);
    if (sensitiveError) {
      return NextResponse.json({ ok: false, error: sensitiveError }, { status: 400 });
    }

    const receivedAtIso = new Date().toISOString();
    const payload = {
      topic,
      county,
      contactMethod,
      message,
      receivedAtIso,
    };

    const notifications: {
      email: { status: "sent" | "failed" | "skipped"; reason?: string };
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
      sms_attempted: smsAttempted,
      sms_success: smsSuccess,
      sms_error_code: smsErrorCode ?? null,
      sms_reason: notifications.sms.reason ?? null,
    });

    const notionResult = await syncLeadToNotion(payload);
    if (notionResult.status !== "skipped") {
      console.info("lead_notion", { status: notionResult.status, reason: notionResult.status === "sent" ? null : notionResult.reason });
    }

    const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, source: "Website" }),
        });
        if (!webhookRes.ok) {
          console.warn("lead_webhook", { status: webhookRes.status });
        }
      } catch (webhookErr) {
        console.warn("lead_webhook", { error: webhookErr instanceof Error ? webhookErr.message : String(webhookErr) });
      }
    }

    const responseMessage =
      emailSuccess && !smsSuccess && smsAttempted
        ? "Got it, Patrick will follow up. We'll respond by email or phone."
        : "Got it, Patrick will follow up.";

    return NextResponse.json({ ok: true, message: responseMessage, notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
