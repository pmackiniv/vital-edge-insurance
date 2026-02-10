import { requiresSoaByStage } from "@/lib/compliance/policy";

export type SoaTimingInput = {
  discussionStage?: string;
  soaOnFile?: boolean;
  soaRequestedAt?: string;
  soaSignedAt?: string;
  appointmentAt?: string;
  isElectionPeriodFinal4Days?: boolean;
};

export type SoaTimingResult = {
  required: boolean;
  valid: boolean;
  reason: "not_required" | "missing_soa" | "missing_timestamps" | "signed_after_appointment" | "less_than_48_hours" | "ok";
};

function parseIso(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function evaluateSoaTiming(input: SoaTimingInput): SoaTimingResult {
  const required = requiresSoaByStage(input.discussionStage);
  if (!required) {
    return { required: false, valid: true, reason: "not_required" };
  }

  if (input.soaOnFile !== true) {
    return { required: true, valid: false, reason: "missing_soa" };
  }

  const signedAt = parseIso(input.soaSignedAt);
  const appointmentAt = parseIso(input.appointmentAt);
  if (!signedAt || !appointmentAt) {
    // Existing SOA may already be on file even if exact timestamps are absent.
    return { required: true, valid: true, reason: "missing_timestamps" };
  }

  if (signedAt.getTime() > appointmentAt.getTime()) {
    return { required: true, valid: false, reason: "signed_after_appointment" };
  }

  if (input.isElectionPeriodFinal4Days === true) {
    return { required: true, valid: true, reason: "ok" };
  }

  const hoursBetween = (appointmentAt.getTime() - signedAt.getTime()) / (1000 * 60 * 60);
  if (hoursBetween < 48) {
    return { required: true, valid: false, reason: "less_than_48_hours" };
  }

  return { required: true, valid: true, reason: "ok" };
}

