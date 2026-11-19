import { requiresSoaByStage } from "@/lib/compliance/policy";
import {
  isCy2027MarketingPeriod,
  marketingTimeZoneForState,
} from "@/lib/compliance/cy2027MarketingPolicy";

export type SoaTimingInput = {
  discussionStage?: string;
  soaOnFile?: boolean;
  soaRequestedAt?: string;
  soaSignedAt?: string;
  appointmentAt?: string;
  isElectionPeriodFinal4Days?: boolean;
  /** Drives the marketing time zone for the CY2027 boundary. */
  state?: string;
  /** Evaluation moment. Injected in tests; defaults to now. */
  now?: number | Date;
};

export type SoaTimingResult = {
  required: boolean;
  valid: boolean;
  reason:
    | "not_required"
    | "missing_soa"
    | "missing_timestamps"
    | "signed_after_appointment"
    | "less_than_48_hours"
    | "cy2027_no_wait_required"
    | "ok";
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

  /*
   * CY2027 marketing (from 2026-10-01) removed the 48-hour wait, not the SOA.
   * The scope must still be recorded before the appointment -- which the
   * signed_after_appointment check above already enforces -- but no gap is
   * required between signing and meeting.
   *
   * The boundary is evaluated in the beneficiary's marketing time zone. With no
   * state supplied this falls back to America/Los_Angeles, the last zone to
   * cross into October 1, so the stricter pre-CY2027 rule stays in force
   * longest. Unknown state therefore fails safe.
   */
  const marketingActive = isCy2027MarketingPeriod(
    input.now instanceof Date ? input.now : new Date(input.now ?? Date.now()),
    marketingTimeZoneForState(input.state),
  );
  if (marketingActive) {
    return { required: true, valid: true, reason: "cy2027_no_wait_required" };
  }

  const hoursBetween = (appointmentAt.getTime() - signedAt.getTime()) / (1000 * 60 * 60);
  if (hoursBetween < 48) {
    return { required: true, valid: false, reason: "less_than_48_hours" };
  }

  return { required: true, valid: true, reason: "ok" };
}

