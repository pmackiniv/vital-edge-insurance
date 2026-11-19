import assert from "node:assert/strict";
import test from "node:test";
import { evaluateSoaTiming } from "../../src/lib/compliance/soaTiming";
import {
  isCy2027MarketingPeriod,
  marketingTimeZoneForState,
} from "../../src/lib/compliance/cy2027MarketingPolicy";
import {
  SOA_PRODUCT_TYPES,
  cmsGovernedSelections,
  discussionStageForSelections,
  isSoaContactMethod,
  isSoaProductKey,
  normalizeZip,
  validateSoaSubmission,
  type SoaProductKey,
} from "../../src/lib/compliance/soaForm";

const HOUR = 3_600_000;

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    beneficiaryFirstName: "Jane",
    beneficiaryLastName: "Doe",
    zip: "32223",
    productKeys: ["ma_cost"] as SoaProductKey[],
    initialContactMethod: "website",
    appointmentAt: new Date(Date.now() + 72 * HOUR).toISOString(),
    signature: "Jane Doe",
    ...overrides,
  };
}

test("SOA form carries the five CMS model product categories", () => {
  assert.equal(SOA_PRODUCT_TYPES.length, 5);
  assert.deepEqual(
    SOA_PRODUCT_TYPES.map((p) => p.key),
    ["pdp", "ma_cost", "dvh", "hospital_indemnity", "medigap"],
  );
});

test("only MA/Part D categories are marked CMS-SOA governed", () => {
  assert.deepEqual(cmsGovernedSelections(["pdp", "ma_cost", "dvh", "medigap"]), ["pdp", "ma_cost"]);
  // Medigap and ancillary ride on the same form but are not governed by
  // 42 CFR 422.2264 / 423.2264.
  assert.deepEqual(cmsGovernedSelections(["medigap", "hospital_indemnity"]), []);
});

test("product selections map onto the gatekeeper's discussion stages", () => {
  assert.equal(discussionStageForSelections(["ma_cost"]), "ma_plan_discussion");
  assert.equal(discussionStageForSelections(["pdp"]), "plan_discussion");
  assert.equal(discussionStageForSelections(["medigap"]), "medigap_plan_discussion");
  assert.equal(discussionStageForSelections(["dvh"]), "general_service");
  // A mixed selection escalates to the strictest stage present.
  assert.equal(discussionStageForSelections(["dvh", "ma_cost"]), "ma_plan_discussion");
});

test("validation accepts a complete submission", () => {
  assert.deepEqual(validateSoaSubmission(validPayload()), []);
});

test("validation requires names, ZIP, a product, contact method and signature", () => {
  const errors = validateSoaSubmission({});
  const fields = errors.map((e) => e.field).sort();
  assert.deepEqual(fields, [
    "appointmentAt",
    "beneficiaryFirstName",
    "beneficiaryLastName",
    "initialContactMethod",
    "productKeys",
    "signature",
    "zip",
  ]);
});

test("validation rejects a short ZIP and an empty product list", () => {
  const errors = validateSoaSubmission(validPayload({ zip: "322", productKeys: [] }));
  const fields = errors.map((e) => e.field);
  assert.ok(fields.includes("zip"));
  assert.ok(fields.includes("productKeys"));
});

test("authorized representative requires name and relationship", () => {
  const errors = validateSoaSubmission(validPayload({ isAuthorizedRepresentative: true }));
  const fields = errors.map((e) => e.field);
  assert.ok(fields.includes("representativeName"));
  assert.ok(fields.includes("representativeRelationship"));
});

test("unknown product and contact-method keys are rejected", () => {
  assert.equal(isSoaProductKey("ma_cost"), true);
  assert.equal(isSoaProductKey("part_g"), false);
  assert.equal(isSoaContactMethod("website"), true);
  assert.equal(isSoaContactMethod("walk_in"), false, "walk-ins cannot originate from the web form");
});

test("normalizeZip strips non-digits and caps at five", () => {
  assert.equal(normalizeZip(" 32223-1234 "), "32223");
  assert.equal(normalizeZip("abc"), "");
});

/* ---------------------------------------------------------------------------
 * 48-hour timing. These are the assertions that actually protect the licence:
 * a plan-specific appointment booked inside 48 hours must not read as valid.
 * ------------------------------------------------------------------------- */

test("MA appointment signed more than 48 hours ahead is valid", () => {
  const signedAt = new Date("2026-08-15T12:00:00Z");
  const result = evaluateSoaTiming({
    discussionStage: discussionStageForSelections(["ma_cost"]),
    soaOnFile: true,
    soaSignedAt: signedAt.toISOString(),
    appointmentAt: new Date(signedAt.getTime() + 72 * HOUR).toISOString(),
    now: signedAt,
  });
  assert.equal(result.required, true);
  assert.equal(result.valid, true);
  assert.equal(result.reason, "ok");
});

test("MA appointment signed inside 48 hours is not valid", () => {
  const signedAt = new Date("2026-08-15T12:00:00Z");
  const result = evaluateSoaTiming({
    discussionStage: discussionStageForSelections(["ma_cost"]),
    soaOnFile: true,
    soaSignedAt: signedAt.toISOString(),
    appointmentAt: new Date(signedAt.getTime() + 24 * HOUR).toISOString(),
    now: signedAt,
  });
  assert.equal(result.valid, false);
  assert.equal(result.reason, "less_than_48_hours");
});

test("the final four days of an election period excuse the 48-hour gap", () => {
  const signedAt = new Date();
  const result = evaluateSoaTiming({
    discussionStage: discussionStageForSelections(["ma_cost"]),
    soaOnFile: true,
    soaSignedAt: signedAt.toISOString(),
    appointmentAt: new Date(signedAt.getTime() + 3 * HOUR).toISOString(),
    isElectionPeriodFinal4Days: true,
  });
  assert.equal(result.valid, true);
  assert.equal(result.reason, "ok");
});

test("an SOA signed after the appointment is never valid", () => {
  const appointmentAt = new Date();
  const result = evaluateSoaTiming({
    discussionStage: discussionStageForSelections(["ma_cost"]),
    soaOnFile: true,
    soaSignedAt: new Date(appointmentAt.getTime() + HOUR).toISOString(),
    appointmentAt: appointmentAt.toISOString(),
    isElectionPeriodFinal4Days: true,
  });
  assert.equal(result.valid, false);
  assert.equal(result.reason, "signed_after_appointment");
});

/* ---------------------------------------------------------------------------
 * CY2027 marketing boundary. Ported from the dialer cockpit so the website and
 * the live-call cockpit enforce the same rule on the same date.
 * ------------------------------------------------------------------------- */

const BEFORE_CY2027 = new Date("2026-09-30T12:00:00Z");
const AFTER_CY2027 = new Date("2026-10-02T12:00:00Z");

test("the 48-hour rule still applies before October 1, 2026", () => {
  const signedAt = BEFORE_CY2027;
  const result = evaluateSoaTiming({
    discussionStage: "ma_plan_discussion",
    soaOnFile: true,
    soaSignedAt: signedAt.toISOString(),
    appointmentAt: new Date(signedAt.getTime() + 24 * HOUR).toISOString(),
    state: "FL",
    now: signedAt,
  });
  assert.equal(result.valid, false);
  assert.equal(result.reason, "less_than_48_hours");
});

test("CY2027 marketing removes the wait, so a same-day plan review is valid", () => {
  const signedAt = AFTER_CY2027;
  const result = evaluateSoaTiming({
    discussionStage: "ma_plan_discussion",
    soaOnFile: true,
    soaSignedAt: signedAt.toISOString(),
    appointmentAt: new Date(signedAt.getTime() + 3 * HOUR).toISOString(),
    state: "FL",
    now: signedAt,
  });
  assert.equal(result.valid, true);
  assert.equal(result.reason, "cy2027_no_wait_required");
});

test("removing the wait does not remove the scope itself", () => {
  // No SOA on file is still fatal after the boundary.
  const missing = evaluateSoaTiming({
    discussionStage: "ma_plan_discussion",
    soaOnFile: false,
    now: AFTER_CY2027,
    state: "FL",
  });
  assert.equal(missing.valid, false);
  assert.equal(missing.reason, "missing_soa");

  // And signing after the appointment is still fatal.
  const late = evaluateSoaTiming({
    discussionStage: "ma_plan_discussion",
    soaOnFile: true,
    soaSignedAt: new Date(AFTER_CY2027.getTime() + HOUR).toISOString(),
    appointmentAt: AFTER_CY2027.toISOString(),
    state: "FL",
    now: AFTER_CY2027,
  });
  assert.equal(late.valid, false);
  assert.equal(late.reason, "signed_after_appointment");
});

test("the boundary is evaluated in the beneficiary's marketing time zone", () => {
  // 2026-10-01 03:00Z is still September 30 in every US marketing zone.
  const stillSeptember = new Date("2026-10-01T03:00:00Z");
  assert.equal(isCy2027MarketingPeriod(stillSeptember, marketingTimeZoneForState("FL")), false);
  // Same instant, one day later, is October in all of them.
  const october = new Date("2026-10-02T03:00:00Z");
  assert.equal(isCy2027MarketingPeriod(october, marketingTimeZoneForState("FL")), true);
});

test("an unknown state fails safe to the strictest zone", () => {
  // America/Los_Angeles is the last US zone into October 1, so an unknown state
  // keeps the stricter pre-CY2027 rule in force longest.
  assert.equal(marketingTimeZoneForState(""), "America/Los_Angeles");
  assert.equal(marketingTimeZoneForState("Narnia"), "America/Los_Angeles");
  const lateSeptemberPacific = new Date("2026-10-01T05:00:00Z"); // 10pm Sep 30 PT
  assert.equal(isCy2027MarketingPeriod(lateSeptemberPacific, marketingTimeZoneForState("")), false);
});

test("an ancillary-only appointment does not require an SOA", () => {
  const result = evaluateSoaTiming({
    discussionStage: discussionStageForSelections(["dvh", "hospital_indemnity"]),
    soaOnFile: false,
  });
  assert.equal(result.required, false);
  assert.equal(result.valid, true);
  assert.equal(result.reason, "not_required");
});
