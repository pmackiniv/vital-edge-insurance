import { DATA_SHARING_RECIPIENT } from "@/lib/leadConsent";
import { evaluateSoaTiming } from "@/lib/compliance/soaTiming";
import { isMaOwnerOnlyStage, isMedicareProduct, isStageRecordingRequired, normalizeDiscussionStage } from "@/lib/compliance/policy";

export type ComplianceSeverity = "high" | "medium";

export type ComplianceFindingCode =
  | "MISSING_TPMO_DISCLOSURE"
  | "PLAN_STEERING_WITHOUT_SOA"
  | "GOVERNMENT_ENDORSEMENT_IMPLICATION"
  | "MISSING_CALL_RECORDING_ACK"
  | "ACA_SUBSIDY_GUARANTEE"
  | "MA_DISCUSSION_RESTRICTED_TO_OWNER"
  | "MISSING_RECORDING_CONSENT_FOR_REQUIRED_STAGE"
  | "PLAN_DISCUSSION_WITHOUT_VALID_SOA"
  | "MISSING_LEAD_TRANSFER_DISCLOSURE"
  | "MISSING_DATA_SHARE_ENTITY_LIST";

export type ComplianceFinding = {
  code: ComplianceFindingCode;
  severity: ComplianceSeverity;
  message: string;
};

export type GatekeeperInput = {
  channel?: string;
  product?: string;
  audience?: string;
  discussionStage?: string;
  actorRole?: string;
  requiresOwnerPatrick?: boolean;
  soaOnFile?: boolean;
  soaRequestedAt?: string;
  soaSignedAt?: string;
  appointmentAt?: string;
  isElectionPeriodFinal4Days?: boolean;
  callRecordingAck?: boolean;
  callRecordingConsent?: boolean;
  leadTransferDisclosureAck?: boolean;
  dataSharingEntities?: string[];
  text: string;
  requiredDisclosureSet?: string[];
};

export type GatekeeperResult = {
  ok: boolean;
  status: "pass" | "block";
  findings: ComplianceFinding[];
  normalizedText: string;
};

const DEFAULT_TPMO_DISCLOSURE =
  "We do not offer every plan available in your area. Any information we provide is limited to plans we offer in your area. We are not connected with or endorsed by the U.S. government or the federal Medicare program.";

const PLAN_STEERING_PATTERNS: RegExp[] = [
  /\b(best|better|recommend(?:ed)?|suggest(?:ed)?)\b.{0,30}\b(plan|option|carrier)\b/i,
  /\b(which|what)\b.{0,15}\bplan\b.{0,20}\b(should i|do i)\b/i,
  /\b(compare|comparison)\b.{0,20}\b(plan|carrier)s?\b/i,
  /\b(lowest|cheapest)\b.{0,20}\bpremium\b/i,
  /\bplan[-\s]?specific\b/i,
];

const GOVERNMENT_ENDORSEMENT_PATTERNS: RegExp[] = [
  /\b(endorsed by|approved by|authorized by|partner(?:ed)? with)\b.{0,50}\b(medicare|u\.?\s*s\.?\s*government|federal medicare program)\b/i,
  /\bofficial\b.{0,30}\b(medicare|government)\b/i,
];

const ACA_GUARANTEE_PATTERNS: RegExp[] = [
  /\bguarantee(?:d)?\b.{0,20}\b(subsidy|tax credit|premium)\b/i,
  /\byou (will|ll)\b.{0,20}\b(get|receive)\b.{0,20}\b(subsidy|tax credit)\b/i,
  /\b100%\b.{0,20}\b(subsidy|premium reduction)\b/i,
];

function normalizeForComparison(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isMedicare(product?: string): boolean {
  return isMedicareProduct(product);
}

function isAca(product?: string): boolean {
  const normalized = (product || "").toLowerCase();
  return normalized.includes("aca") || normalized.includes("marketplace");
}

function shouldRequireTpmoDisclosure(input: GatekeeperInput): boolean {
  const required = (input.requiredDisclosureSet || []).map((x) => x.toLowerCase().trim());
  if (required.includes("tpmo")) return true;
  if (!isMedicare(input.product)) return false;

  const channel = (input.channel || "").toLowerCase().trim();
  if (!channel) return true;
  // Internal/admin routes can omit public marketing disclosure text.
  if (channel === "internal" || channel === "admin") return false;
  return true;
}

function hasGovernmentEndorsementImplication(text: string): boolean {
  const scrubbed = text
    .replace(/not connected with or endorsed by[^.]*\./gi, " ")
    .replace(/not endorsed by[^.]*\./gi, " ");
  return GOVERNMENT_ENDORSEMENT_PATTERNS.some((pattern) => pattern.test(scrubbed));
}

function hasPlanSteering(text: string): boolean {
  return PLAN_STEERING_PATTERNS.some((pattern) => pattern.test(text));
}

function hasTpmoDisclosure(text: string, configuredDisclosure: string): boolean {
  const normalizedText = normalizeForComparison(text);
  const normalizedDisclosure = normalizeForComparison(configuredDisclosure);
  if (normalizedText.includes(normalizedDisclosure)) return true;

  const requiredFragments = [
    "we do not offer every plan available in your area",
    "any information we provide is limited to plans we offer in your area",
    "not connected with or endorsed by the u.s. government or the federal medicare program",
  ];

  return requiredFragments.every((fragment) => normalizedText.includes(fragment));
}

export function evaluateCompliance(input: GatekeeperInput): GatekeeperResult {
  const text = String(input.text || "").trim();
  const normalizedText = text;
  const findings: ComplianceFinding[] = [];
  const stage = normalizeDiscussionStage(input.discussionStage);
  const requiredDisclosures = new Set((input.requiredDisclosureSet || []).map((x) => x.toLowerCase().trim()));

  if (!text) {
    return { ok: true, status: "pass", findings, normalizedText };
  }

  const tpmoDisclosure = (process.env.CMS_TPMO_DISCLAIMER || DEFAULT_TPMO_DISCLOSURE).trim();

  if (shouldRequireTpmoDisclosure(input) && !hasTpmoDisclosure(text, tpmoDisclosure)) {
    findings.push({
      code: "MISSING_TPMO_DISCLOSURE",
      severity: "high",
      message: "Medicare marketing/discussion content must include the TPMO disclosure.",
    });
  }

  if (isMedicare(input.product) && hasPlanSteering(text) && input.soaOnFile !== true) {
    findings.push({
      code: "PLAN_STEERING_WITHOUT_SOA",
      severity: "high",
      message: "Plan-specific Medicare steering is blocked when Scope of Appointment is not on file.",
    });
  }

  if (hasGovernmentEndorsementImplication(text)) {
    findings.push({
      code: "GOVERNMENT_ENDORSEMENT_IMPLICATION",
      severity: "high",
      message: "Content cannot imply endorsement by the U.S. government or Medicare.",
    });
  }

  const channel = (input.channel || "").toLowerCase().trim();
  if (isMedicare(input.product) && channel === "call_task" && input.callRecordingAck !== true) {
    findings.push({
      code: "MISSING_CALL_RECORDING_ACK",
      severity: "high",
      message: "Medicare call-task workflows require recording acknowledgment before handoff.",
    });
  }

  if (
    isMedicare(input.product)
    && isStageRecordingRequired(stage)
    && input.callRecordingConsent !== true
    && input.callRecordingAck !== true
  ) {
    findings.push({
      code: "MISSING_RECORDING_CONSENT_FOR_REQUIRED_STAGE",
      severity: "high",
      message: "Marketing/sales/enrollment plan stages require recording consent before proceeding.",
    });
  }

  if (isMaOwnerOnlyStage(stage, input.product) || input.requiresOwnerPatrick === true) {
    if (input.actorRole !== "owner") {
      findings.push({
        code: "MA_DISCUSSION_RESTRICTED_TO_OWNER",
        severity: "high",
        message: "Medicare Advantage plan discussions and enrollment are restricted to Patrick.",
      });
    }
  }

  const soaTiming = evaluateSoaTiming({
    discussionStage: stage,
    soaOnFile: input.soaOnFile,
    soaRequestedAt: input.soaRequestedAt,
    soaSignedAt: input.soaSignedAt,
    appointmentAt: input.appointmentAt,
    isElectionPeriodFinal4Days: input.isElectionPeriodFinal4Days,
  });
  if (soaTiming.required && !soaTiming.valid) {
    findings.push({
      code: "PLAN_DISCUSSION_WITHOUT_VALID_SOA",
      severity: "high",
      message: "Plan discussion/enrollment requires a valid Scope of Appointment timing state.",
    });
  }

  if (requiredDisclosures.has("lead_transfer") && input.leadTransferDisclosureAck !== true) {
    findings.push({
      code: "MISSING_LEAD_TRANSFER_DISCLOSURE",
      severity: "high",
      message: "Lead-generation disclosures must state transfer to a licensed agent.",
    });
  }

  if (requiredDisclosures.has("data_share_entities")) {
    const entities = Array.isArray(input.dataSharingEntities) ? input.dataSharingEntities : [];
    const normalizedEntities = entities.map((entity) => entity.trim().toLowerCase());
    if (!entities.length || !normalizedEntities.includes(DATA_SHARING_RECIPIENT.toLowerCase())) {
      findings.push({
        code: "MISSING_DATA_SHARE_ENTITY_LIST",
        severity: "high",
        message: "Data-sharing consent must include the list of authorized recipient entities.",
      });
    }
  }

  if (isAca(input.product) && ACA_GUARANTEE_PATTERNS.some((pattern) => pattern.test(text))) {
    findings.push({
      code: "ACA_SUBSIDY_GUARANTEE",
      severity: "high",
      message: "ACA content cannot guarantee subsidy eligibility or premium outcomes.",
    });
  }

  if (findings.length > 0) {
    return { ok: false, status: "block", findings, normalizedText };
  }

  return { ok: true, status: "pass", findings, normalizedText };
}
