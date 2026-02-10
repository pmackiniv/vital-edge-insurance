export const TPMO_POLICY_VERSION = "2026-02-07-ma-owner-v1";
export const CALL_RECORDING_POLICY_VERSION = "2026-02-07-call-stage-v1";
export const RETENTION_POLICY_YEARS = 10;

export type DiscussionStage =
  | "appointment_setting"
  | "general_service"
  | "marketing"
  | "sales"
  | "enrollment"
  | "plan_discussion"
  | "ma_plan_discussion"
  | "ma_enrollment"
  | "medigap_plan_discussion";

const RECORDING_REQUIRED_STAGES = new Set<string>([
  "marketing",
  "sales",
  "enrollment",
  "plan_discussion",
  "ma_plan_discussion",
  "ma_enrollment",
]);

const SOA_REQUIRED_STAGES = new Set<string>([
  "plan_discussion",
  "ma_plan_discussion",
  "ma_enrollment",
  "medigap_plan_discussion",
  "enrollment",
]);

function normalizeProduct(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function normalizeDiscussionStage(stage?: string): string {
  return String(stage || "general_service")
    .toLowerCase()
    .trim()
    .replace(/[ -]+/g, "_");
}

export function isStageRecordingRequired(stage?: string): boolean {
  return RECORDING_REQUIRED_STAGES.has(normalizeDiscussionStage(stage));
}

export function requiresSoaByStage(stage?: string): boolean {
  return SOA_REQUIRED_STAGES.has(normalizeDiscussionStage(stage));
}

export function isMedicareProduct(product?: string): boolean {
  return normalizeProduct(product || "").includes("medicare");
}

export function isMedicareAdvantageProduct(product?: string): boolean {
  const normalized = normalizeProduct(product || "");
  return normalized.includes("medicare advantage") || normalized === "ma";
}

export function isMedigapProduct(product?: string): boolean {
  const normalized = normalizeProduct(product || "");
  return normalized.includes("medigap") || normalized.includes("supplement");
}

export function isMaOwnerOnlyStage(stage?: string, product?: string): boolean {
  const normalizedStage = normalizeDiscussionStage(stage);
  if (normalizedStage === "ma_plan_discussion" || normalizedStage === "ma_enrollment") return true;

  // If a generic plan discussion is marked for MA products, treat it as owner-only.
  return normalizedStage === "plan_discussion" && isMedicareAdvantageProduct(product);
}

