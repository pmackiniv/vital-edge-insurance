import { NextResponse } from "next/server";
import { appendAgentEvent } from "@/lib/agentEvents";
import { resolveAgentActor } from "@/lib/agentAuth";
import { evaluateCompliance } from "@/lib/compliance/gatekeeper";
import { ensureComplianceTables } from "@/lib/compliance/db";
import {
  CALL_RECORDING_POLICY_VERSION,
  RETENTION_POLICY_YEARS,
  TPMO_POLICY_VERSION,
  isMaOwnerOnlyStage,
  isMedicareProduct,
  isStageRecordingRequired,
  normalizeDiscussionStage,
} from "@/lib/compliance/policy";
import { getPersistenceMode, getPrismaClient } from "@/lib/prisma";
import { getTpmoCounts } from "@/lib/tpmo/tpmoCounts";

type CallStartRequest = {
  callId?: string;
  product?: string;
  discussionStage?: string;
  zip?: string;
  planYear?: number;
  callRecordingConsent?: boolean;
  callRecordingActive?: boolean;
  soaOnFile?: boolean;
  soaRequestedAt?: string;
  soaSignedAt?: string;
  appointmentAt?: string;
  isElectionPeriodFinal4Days?: boolean;
  cfuConfirmed?: boolean;
  beneficiaryInitiated?: boolean;
  disclaimerRead?: boolean;
  spokenText?: string;
};

type ApiFinding = {
  code: string;
  severity: "high" | "medium";
  message: string;
};

function parseJson(value: unknown): any {
  return JSON.parse(JSON.stringify(value));
}

function zip5(value: string | undefined): string {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

function requiredActionForFindings(findings: ApiFinding[]): string {
  if (findings.some((finding) => finding.code === "MA_DISCUSSION_RESTRICTED_TO_OWNER")) {
    return "schedule_with_patrick";
  }
  if (findings.some((finding) => finding.code === "MISSING_RECORDING_CONSENT_FOR_REQUIRED_STAGE")) {
    return "obtain_recording_consent";
  }
  if (findings.some((finding) => finding.code === "PLAN_DISCUSSION_WITHOUT_VALID_SOA")) {
    return "collect_valid_soa";
  }
  if (findings.some((finding) => finding.code === "MISSING_TPMO_DISCLOSURE")) {
    return "deliver_tpmo_disclosure";
  }
  if (findings.some((finding) => finding.code === "MISSING_LEAD_TRANSFER_DISCLOSURE")) {
    return "capture_lead_transfer_disclosure";
  }
  if (findings.some((finding) => finding.code === "MISSING_DATA_SHARE_ENTITY_LIST")) {
    return "capture_data_share_entities";
  }
  return "resolve_compliance_findings";
}

export async function POST(req: Request) {
  const actorAuth = resolveAgentActor(req);
  if (!actorAuth.ok) {
    return NextResponse.json(actorAuth.body, { status: actorAuth.status });
  }

  let body: CallStartRequest;
  try {
    body = (await req.json()) as CallStartRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const callId = (body.callId || "").trim();
  if (!callId) {
    return NextResponse.json({ ok: false, error: "Missing required field: callId." }, { status: 400 });
  }

  const persistenceMode = getPersistenceMode();
  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is required for call compliance auditing.", persistenceMode },
      { status: 503 },
    );
  }

  await ensureComplianceTables();

  const product = (body.product || "Medicare").trim();
  const stage = normalizeDiscussionStage(body.discussionStage);
  const zip = zip5(body.zip);
  const planYear = Number(body.planYear) || new Date().getFullYear();
  const recordingRequired = isStageRecordingRequired(stage);
  const maOwnerRequired = isMaOwnerOnlyStage(stage, product);
  const retentionUntil = new Date(Date.now() + RETENTION_POLICY_YEARS * 365 * 24 * 60 * 60 * 1000);

  const shouldComputeTpmo = isMedicareProduct(product) && stage !== "appointment_setting" && stage !== "general_service";
  let tpmoResult: Awaited<ReturnType<typeof getTpmoCounts>> | null = null;
  if (shouldComputeTpmo) {
    tpmoResult = await getTpmoCounts({
      zip,
      planYear,
      context: {
        callId,
        channel: "call",
        discussionStage: stage,
        actorId: actorAuth.actor.actorId,
        actorRole: actorAuth.actor.actorRole,
        callRecordingConsent: body.callRecordingConsent === true,
        soaOnFile: body.soaOnFile === true,
        cfuConfirmed: body.cfuConfirmed === true,
        beneficiaryInitiated: body.beneficiaryInitiated === true,
      },
    });
  }

  const compliance = evaluateCompliance({
    channel: "call",
    product,
    discussionStage: stage,
    actorRole: actorAuth.actor.actorRole,
    requiresOwnerPatrick: maOwnerRequired,
    soaOnFile: body.soaOnFile,
    soaRequestedAt: body.soaRequestedAt,
    soaSignedAt: body.soaSignedAt,
    appointmentAt: body.appointmentAt,
    isElectionPeriodFinal4Days: body.isElectionPeriodFinal4Days,
    callRecordingConsent: body.callRecordingConsent,
    callRecordingAck: body.callRecordingConsent,
    text: (body.spokenText || "").trim() || (tpmoResult && tpmoResult.ok ? tpmoResult.disclaimer : "Call-stage compliance check."),
    requiredDisclosureSet: shouldComputeTpmo ? ["tpmo"] : [],
  });

  const findings: ApiFinding[] = [...compliance.findings];
  if (shouldComputeTpmo && tpmoResult && !tpmoResult.ok) {
    findings.push({
      code: "MISSING_TPMO_DISCLOSURE",
      severity: "high",
      message: tpmoResult.error,
    });
  }

  const requiredAction = findings.length > 0 ? requiredActionForFindings(findings) : null;
  const allowed = findings.length === 0;

  await prisma.callComplianceAudit.create({
    data: {
      callId,
      product,
      discussionStage: stage,
      actorId: actorAuth.actor.actorId,
      actorRole: actorAuth.actor.actorRole,
      recordingRequired,
      callRecordingConsent: body.callRecordingConsent === true,
      callRecordingActive: body.callRecordingActive === true,
      zip: zip || null,
      planYear,
      orgCount: tpmoResult && tpmoResult.ok ? tpmoResult.org_count : null,
      planCount: tpmoResult && tpmoResult.ok ? tpmoResult.plan_count : null,
      disclaimerText: tpmoResult && tpmoResult.ok ? tpmoResult.disclaimer : null,
      disclaimerVariant: tpmoResult && tpmoResult.ok && tpmoResult.represents_all_plans ? "all_plans" : "limited_plans",
      cfuConfirmed: body.cfuConfirmed === true,
      soaOnFile: body.soaOnFile === true,
      soaRequestedAt: body.soaRequestedAt ? new Date(body.soaRequestedAt) : null,
      soaSignedAt: body.soaSignedAt ? new Date(body.soaSignedAt) : null,
      appointmentAt: body.appointmentAt ? new Date(body.appointmentAt) : null,
      soaTimingValid: !findings.some((finding) => finding.code === "PLAN_DISCUSSION_WITHOUT_VALID_SOA"),
      callRecorded: body.callRecordingActive === true,
      retentionUntil,
      sourceRoute: "/api/compliance/call-start",
      allowed,
      blockCode: findings[0]?.code || null,
      requiredOwner: maOwnerRequired,
      requestContextJson: parseJson({
        actorCredential: actorAuth.actor.credential,
        beneficiaryInitiated: body.beneficiaryInitiated === true,
        disclaimerRead: body.disclaimerRead === true,
        tpmoPolicyVersion: TPMO_POLICY_VERSION,
        callRecordingPolicyVersion: CALL_RECORDING_POLICY_VERSION,
        requiredAction,
      }),
    },
  });

  await appendAgentEvent({
    event_type: "compliance_check",
    status: allowed ? "ok" : "failed",
    summary: `Call-stage compliance ${allowed ? "pass" : "block"} (${product} / ${stage})`,
    route: "/api/compliance/call-start",
    compliance_result: allowed ? "pass" : "block",
    meta: {
      callId,
      actorRole: actorAuth.actor.actorRole,
      recordingRequired,
      requiredAction,
      findingCodes: findings.map((finding) => finding.code),
    },
  });

  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        callId,
        stage,
        maOwnerRequired,
        findings,
        requiredAction,
        persistenceMode,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    callId,
    stage,
    maOwnerRequired,
    recordingRequired,
    nextAllowedStage: stage,
    soaStatus: {
      onFile: body.soaOnFile === true,
      timingValid: true,
    },
    tpmo: tpmoResult && tpmoResult.ok
      ? {
          zip: tpmoResult.zip,
          org_count: tpmoResult.org_count,
          plan_count: tpmoResult.plan_count,
          organizations: tpmoResult.organizations,
          disclaimer: tpmoResult.disclaimer,
        }
      : null,
    persistenceMode,
  });
}
