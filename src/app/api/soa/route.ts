import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { findSensitiveIdentifier } from "@/lib/leadGuard";
import { sendLeadEmail } from "@/lib/notify";
import { getPrismaClient } from "@/lib/prisma";
import { appendAgentEvent } from "@/lib/agentEvents";
import { RETENTION_POLICY_YEARS } from "@/lib/compliance/policy";
import { evaluateSoaTiming } from "@/lib/compliance/soaTiming";
import { ensureSoaTables } from "@/lib/compliance/soaDb";
import {
  SOA_AGENT,
  SOA_FORM_VERSION,
  discussionStageForSelections,
  isSoaProductKey,
  normalizeZip,
  soaProductLabel,
  validateSoaSubmission,
  type SoaProductKey,
  type SoaSubmissionInput,
} from "@/lib/compliance/soaForm";

/**
 * Accepts a signed Scope of Appointment.
 *
 * Two decisions worth stating plainly:
 *
 * 1. The signature timestamp is taken from the server, never from the client.
 *    It is the anchor of the 48-hour calculation, so a wrong or spoofed browser
 *    clock must not be able to manufacture a compliant-looking record.
 *
 * 2. A submission inside 48 hours is stored, not rejected. The CMS model form
 *    has a reason field for exactly this case; refusing the record would leave
 *    the appointment with no documentation at all, which is strictly worse. The
 *    row is written with soaTimingValid=false so the call gatekeeper still
 *    blocks the plan-specific discussion until the agent resolves it.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
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

/** Store a salted hash for audit provenance rather than the raw address. */
function hashIp(ip: string): string {
  const salt = process.env.SOA_IP_SALT?.trim() || "ve-soa";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function trimmed(value: unknown): string {
  return String(value ?? "").trim();
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter || 60) } },
    );
  }

  let body: SoaSubmissionInput;
  try {
    body = (await req.json()) as SoaSubmissionInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const errors = validateSoaSubmission(body);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  // Screen every free-text field. The SOA never needs an SSN or MBI, so any
  // appearance of one is either a mistake or an attempt to park it here.
  const freeText: Record<string, string> = {
    beneficiaryFirstName: trimmed(body.beneficiaryFirstName),
    beneficiaryLastName: trimmed(body.beneficiaryLastName),
    streetAddress: trimmed(body.streetAddress),
    addressLine2: trimmed(body.addressLine2),
    city: trimmed(body.city),
    county: trimmed(body.county),
    representativeName: trimmed(body.representativeName),
    representativeRelationship: trimmed(body.representativeRelationship),
    under48HourReason: trimmed(body.under48HourReason),
  };
  for (const [field, value] of Object.entries(freeText)) {
    const sensitive = findSensitiveIdentifier(value);
    if (sensitive) {
      return NextResponse.json(
        { ok: false, errors: [{ field, message: sensitive }] },
        { status: 400 },
      );
    }
  }

  const productKeys = (
    Array.isArray(body.productKeys) ? body.productKeys.filter(isSoaProductKey) : []
  ) as SoaProductKey[];
  const discussionStage = discussionStageForSelections(productKeys);

  // Server-authoritative signature time.
  const signedAt = new Date();
  const appointmentAt = new Date(trimmed(body.appointmentAt));

  const timing = evaluateSoaTiming({
    discussionStage,
    soaOnFile: true,
    soaSignedAt: signedAt.toISOString(),
    appointmentAt: appointmentAt.toISOString(),
    // Not asserted from a public form. Declaring an election-period exception is
    // an agent determination, not something a web submission may self-certify.
    isElectionPeriodFinal4Days: false,
    // Resolves the CY2027 marketing boundary in the beneficiary's time zone.
    state: trimmed(body.state),
    now: signedAt,
  });

  const hoursBefore = (appointmentAt.getTime() - signedAt.getTime()) / 3_600_000;
  const under48HourReason = trimmed(body.under48HourReason);

  // Mirrors the model form: the reason field becomes required inside 48 hours.
  if (timing.required && timing.reason === "less_than_48_hours" && !under48HourReason) {
    return NextResponse.json(
      {
        ok: false,
        needsUnder48HourReason: true,
        hoursBeforeAppointment: Number(hoursBefore.toFixed(2)),
        errors: [
          {
            field: "under48HourReason",
            message:
              "This appointment is less than 48 hours away. Tell us briefly why, so the agent can document it.",
          },
        ],
      },
      { status: 400 },
    );
  }

  const retentionUntil = new Date(signedAt);
  retentionUntil.setFullYear(retentionUntil.getFullYear() + RETENTION_POLICY_YEARS);

  const record = {
    id: randomUUID(),
    formVersion: SOA_FORM_VERSION,
    beneficiaryFirstName: trimmed(body.beneficiaryFirstName),
    beneficiaryLastName: trimmed(body.beneficiaryLastName),
    beneficiaryPhone: trimmed(body.beneficiaryPhone) || null,
    streetAddress: trimmed(body.streetAddress) || null,
    addressLine2: trimmed(body.addressLine2) || null,
    city: trimmed(body.city) || null,
    zip: normalizeZip(body.zip),
    county: trimmed(body.county) || null,
    state: trimmed(body.state) || null,
    preferredLanguage: trimmed(body.preferredLanguage) || "English",
    productKeysJson: JSON.stringify(productKeys),
    discussionStage,
    initialContactMethod: trimmed(body.initialContactMethod),
    agentName: SOA_AGENT.name,
    agentNpn: SOA_AGENT.npn,
    signature: trimmed(body.signature),
    signedAt,
    appointmentAt,
    hoursBeforeAppointment: Number(hoursBefore.toFixed(2)),
    soaTimingValid: timing.valid,
    soaTimingReason: timing.reason,
    under48HourReason: under48HourReason || null,
    isAuthorizedRepresentative: body.isAuthorizedRepresentative === true,
    representativeName: trimmed(body.representativeName) || null,
    representativeRelationship: trimmed(body.representativeRelationship) || null,
    sourceRoute: "/scope-of-appointment",
    userAgent: req.headers.get("user-agent")?.slice(0, 300) || null,
    ipHash: hashIp(ip),
    retentionUntil,
  };

  let persisted = false;
  try {
    await ensureSoaTables();
    const prisma = getPrismaClient();
    if (prisma) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "SoaSubmission" (
          "id","formVersion","beneficiaryFirstName","beneficiaryLastName","beneficiaryPhone",
          "streetAddress","addressLine2","city","zip","county","state","preferredLanguage",
          "productKeysJson","discussionStage","initialContactMethod","agentName","agentNpn",
          "signature","signedAt","appointmentAt","hoursBeforeAppointment","soaTimingValid",
          "soaTimingReason","under48HourReason","isAuthorizedRepresentative","representativeName",
          "representativeRelationship","sourceRoute","userAgent","ipHash","retentionUntil"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31
        )`,
        record.id,
        record.formVersion,
        record.beneficiaryFirstName,
        record.beneficiaryLastName,
        record.beneficiaryPhone,
        record.streetAddress,
        record.addressLine2,
        record.city,
        record.zip,
        record.county,
        record.state,
        record.preferredLanguage,
        record.productKeysJson,
        record.discussionStage,
        record.initialContactMethod,
        record.agentName,
        record.agentNpn,
        record.signature,
        record.signedAt,
        record.appointmentAt,
        record.hoursBeforeAppointment,
        record.soaTimingValid,
        record.soaTimingReason,
        record.under48HourReason,
        record.isAuthorizedRepresentative,
        record.representativeName,
        record.representativeRelationship,
        record.sourceRoute,
        record.userAgent,
        record.ipHash,
        record.retentionUntil,
      );
      persisted = true;
    }
  } catch (error) {
    console.error("soa_persist_failed", { message: (error as Error)?.message });
  }

  // Notify the agent regardless of persistence, so a storage outage never means
  // a silently lost SOA.
  const productLines = productKeys.map((key) => `- ${soaProductLabel(key)}`).join("\n");
  try {
    await sendLeadEmail({
      topic: `SOA signed — ${record.beneficiaryFirstName} ${record.beneficiaryLastName}`,
      county: record.county || record.zip,
      contactMethod: record.initialContactMethod,
      message: [
        `Scope of Appointment signed (${SOA_FORM_VERSION})`,
        persisted ? "" : "WARNING: not persisted to database — capture manually.",
        "",
        `Beneficiary: ${record.beneficiaryFirstName} ${record.beneficiaryLastName}`,
        record.beneficiaryPhone ? `Phone: ${record.beneficiaryPhone}` : "",
        `ZIP: ${record.zip}${record.county ? ` (${record.county})` : ""}`,
        "",
        "Products to discuss:",
        productLines,
        "",
        `Appointment: ${appointmentAt.toISOString()}`,
        `Signed: ${signedAt.toISOString()}`,
        `Hours before appointment: ${record.hoursBeforeAppointment}`,
        `48-hour rule: ${timing.valid ? "SATISFIED" : `NOT SATISFIED (${timing.reason})`}`,
        under48HourReason ? `Reason given: ${under48HourReason}` : "",
        record.isAuthorizedRepresentative
          ? `Authorized representative: ${record.representativeName} (${record.representativeRelationship})`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
      receivedAtIso: signedAt.toISOString(),
    });
  } catch (error) {
    console.error("soa_notify_failed", { message: (error as Error)?.message });
  }

  await appendAgentEvent({
    event_type: "compliance_check",
    status: "ok",
    summary: `SOA signed for ${record.zip}, stage ${discussionStage}, timing ${timing.reason}`,
    route: "/api/soa",
    compliance_result: timing.valid ? "pass" : "review",
    meta: {
      formVersion: SOA_FORM_VERSION,
      discussionStage,
      soaTimingReason: timing.reason,
      hoursBeforeAppointment: record.hoursBeforeAppointment,
      persisted,
    },
  }).catch(() => {});

  return NextResponse.json({
    ok: true,
    persisted,
    soaTimingValid: timing.valid,
    soaTimingReason: timing.reason,
    hoursBeforeAppointment: record.hoursBeforeAppointment,
  });
}
