/**
 * CY2027 marketing-period policy.
 *
 * Ported from the Vital Edge Medicare Dialer Cockpit
 * (`app/cy2027-marketing-policy.ts`) so the website and the live-call cockpit
 * cannot drift apart on the same rule. Keep the two in sync.
 *
 * What changed
 * ------------
 * For CY2027 marketing, beginning 2026-10-01, CMS removed the 48-hour wait
 * between documenting a Scope of Appointment and the personal marketing
 * appointment. It did NOT remove the SOA itself, and it did not remove the
 * requirement that the scope be agreed in advance of the appointment.
 *
 * Authority (carried over from the cockpit's cited source, not independently
 * re-verified here — see SOA_FORM_VERIFIED_FOR_CY2027 in `soaForm.ts`):
 *   CY2027 final rule, Federal Register, published 2026-04-06
 *     https://www.federalregister.gov/documents/2026/04/06/2026-06600/medicare-program-contract-year-2027-and-certain-contract-year-2026-policy-and-technical-changes-to
 *   42 CFR 422.2264
 *     https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-422/subpart-V/section-422.2264
 *
 * Why a time zone matters: the boundary is a calendar date, not an instant. A
 * Florida booking at 9pm Eastern on September 30 is still September 30 locally,
 * and must be evaluated under the pre-CY2027 rule.
 */
export const CY2027_MARKETING_START = "2026-10-01";
export const CY2027_DEFAULT_MARKETING_TIME_ZONE = "America/Los_Angeles";

export const CY2027_FINAL_RULE_URL =
  "https://www.federalregister.gov/documents/2026/04/06/2026-06600/medicare-program-contract-year-2027-and-certain-contract-year-2026-policy-and-technical-changes-to";

/**
 * Marketing time zone by state. Mirrors the cockpit map, covering the 12
 * licensed states. Multi-zone states use the zone the book of business sits in.
 */
const stateMarketingTimeZones: Record<string, string> = {
  AZ: "America/Phoenix",
  ARIZONA: "America/Phoenix",
  FL: "America/Chicago",
  FLORIDA: "America/Chicago",
  GA: "America/New_York",
  GEORGIA: "America/New_York",
  LA: "America/Chicago",
  LOUISIANA: "America/Chicago",
  MI: "America/Chicago",
  MICHIGAN: "America/Chicago",
  NC: "America/New_York",
  "NORTH CAROLINA": "America/New_York",
  OH: "America/New_York",
  OHIO: "America/New_York",
  PA: "America/New_York",
  PENNSYLVANIA: "America/New_York",
  SC: "America/New_York",
  "SOUTH CAROLINA": "America/New_York",
  TN: "America/Chicago",
  TENNESSEE: "America/Chicago",
  TX: "America/Denver",
  TEXAS: "America/Denver",
  WA: "America/Los_Angeles",
  WASHINGTON: "America/Los_Angeles",
};

export function marketingTimeZoneForState(state = ""): string {
  return stateMarketingTimeZones[state.trim().toUpperCase()] || CY2027_DEFAULT_MARKETING_TIME_ZONE;
}

function calendarDateInTimeZone(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function isCy2027MarketingPeriod(
  now: Date = new Date(),
  timeZone: string = CY2027_DEFAULT_MARKETING_TIME_ZONE,
): boolean {
  return calendarDateInTimeZone(now, timeZone) >= CY2027_MARKETING_START;
}

/**
 * Agent-facing wording for the timing rule in force at a given moment.
 * Used by the booking surface so the explanation the beneficiary reads matches
 * the rule the server actually enforced.
 */
export function scopeTimingExplanation(
  now: Date = new Date(),
  timeZone: string = CY2027_DEFAULT_MARKETING_TIME_ZONE,
): string {
  return isCy2027MarketingPeriod(now, timeZone)
    ? "Your agenda is recorded before the appointment. There is no waiting period — you can choose any available time."
    : "Medicare asks that the agenda be documented at least 48 hours before a plan-specific appointment.";
}
