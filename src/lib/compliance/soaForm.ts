import { site } from "@/lib/site";

/**
 * Scope of Appointment (SOA) — canonical form content and validation.
 *
 * Source of the wording below is the standard CMS Scope of Sales Appointment
 * Confirmation Form. Every consumer-facing string an auditor would compare
 * against the model form lives in this file, so a plan-year update is a single
 * -file change rather than a hunt through JSX.
 *
 * ---------------------------------------------------------------------------
 * PLAN-YEAR REVIEW REQUIRED — see SOA_FORM_VERSION.
 *
 * The text here reflects the form language supplied by the agent (2026). CMS
 * revises the model form and the surrounding marketing rules between plan
 * years, and the CY2027 final rule has NOT been diffed against this file.
 * Before the CY2027 AEP (appointments on or after 2026-10-15), verify against
 * the CY2027 final rule and the current CMS model form:
 *
 *   1. Product-type checkbox list — categories added, removed or reworded.
 *   2. The agent-compensation / not-federal-government attestation sentence.
 *   3. The "does NOT obligate you to enroll" sentence.
 *   4. The 48-hour documentation requirement and its exceptions, which are
 *      enforced in `soaTiming.ts`, not here.
 *   5. Record-retention duration, held in `policy.ts` as RETENTION_POLICY_YEARS.
 *
 * Bump SOA_FORM_VERSION on any change. Stored submissions keep the version they
 * were signed under, so historical records stay attributable to the form the
 * beneficiary actually saw.
 * ---------------------------------------------------------------------------
 */
export const SOA_FORM_VERSION = "2026-08-cms-model-v1";

/** Set true only after the CY2027 final rule has been diffed against this file. */
export const SOA_FORM_VERIFIED_FOR_CY2027 = false;

export const SOA_CMS_PREAMBLE =
  "The Centers for Medicare and Medicaid Services requires agents to document the scope of a marketing appointment prior to any sales meeting to ensure understanding of what will be discussed between the agent and the Medicare beneficiary (or their authorized representative). All information provided on this form is confidential and should be completed by each person with Medicare or his/her authorized representative.";

export const SOA_ATTESTATION =
  "By signing this form, you agree to a meeting with a sales agent to discuss the types of products you indicated above. Please note, the person who will discuss the products is either employed or contracted by a Medicare plan. They do not work directly for the federal government. This individual may also be paid based on your enrollment in a plan.";

export const SOA_NO_OBLIGATION =
  "Signing this form does NOT obligate you to enroll in a plan, affect your current enrollment, or enroll you in a Medicare plan.";

export const SOA_RETENTION_NOTICE =
  "Scope of Appointment documentation is subject to CMS record retention requirements.";

export const SOA_AGENT = {
  name: "PATRICK MACKIN",
  phoneDisplay: "352-214-8879",
  phoneE164: site.phoneE164,
  npn: site.npn,
} as const;

export type SoaProductKey =
  | "pdp"
  | "ma_cost"
  | "dvh"
  | "hospital_indemnity"
  | "medigap";

export type SoaProductType = {
  key: SoaProductKey;
  label: string;
  /** Long-form description shown under "product type descriptions". */
  description: string;
  /** Sub-entries CMS lists beneath the category, where it lists any. */
  detail?: Array<{ term: string; definition: string }>;
  /**
   * True when the category falls under the CMS SOA requirement at
   * 42 CFR 422.2264 / 423.2264. The remaining categories are non-Medicare
   * products carried on the same form as a documentation convenience.
   */
  cmsSoaGoverned: boolean;
};

export const SOA_PRODUCT_TYPES: readonly SoaProductType[] = [
  {
    key: "pdp",
    label: "Stand-alone Medicare Prescription Drug Plans (Part D)",
    cmsSoaGoverned: true,
    description:
      "Medicare Prescription Drug Plan (PDP) - A stand-alone drug plan that adds prescription drug coverage to Original Medicare, some Medicare Cost plans, some Medicare Private Fee-for-Service plans, and Medicare Medical Savings Account plans.",
  },
  {
    key: "ma_cost",
    label: "Medicare Advantage Plans (Part C) and Cost Plans",
    cmsSoaGoverned: true,
    description:
      "Medicare Advantage and Cost Plan options provide Part A and Part B coverage through a private plan, and sometimes include Part D prescription drug coverage.",
    detail: [
      {
        term: "Medicare Health Maintenance Organization (HMO)",
        definition:
          "A Medicare Advantage Plan that provides all Original Medicare Part A and Part B health coverage and sometimes covers Part D prescription drug coverage. In most HMOs, you can only get your care from doctors or hospitals in the plan's network (except in emergencies).",
      },
      {
        term: "Medicare Preferred Provider Organization (PPO) Plan",
        definition:
          "A Medicare Advantage Plan that provides all Original Medicare Part A and Part B health coverage and sometimes covers Part D prescription drug coverage. PPOs have network doctors and hospitals but you can also use out-of-network providers, usually at a higher cost.",
      },
      {
        term: "Medicare Private Fee-For-Service (PFFS) Plan",
        definition:
          "A Medicare Advantage Plan in which you may go to any Medicare-approved doctor, hospital and provider that accepts the plan's payment, terms and conditions and agrees to treat you - not all providers will. If you join a PFFS Plan that has a network, you can see any of the network providers who have agreed to always treat plan members. You will usually pay more to see out-of-network providers.",
      },
      {
        term: "Medicare Point of Service (POS) Plan",
        definition:
          "A type of Medicare Advantage Plan available in a local or regional area which combines the best feature of an HMO with an out-of-network benefit. Like the HMO, members are required to designate an in-network physician to be the primary health care provider. You can use doctors, hospitals, and providers outside of the network for an additional cost.",
      },
      {
        term: "Medicare Special Needs Plan (SNP)",
        definition:
          "A Medicare Advantage Plan that has a benefit package designed for people with special health care needs. Examples of the specific groups served include people who have both Medicare and Medicaid, people who reside in nursing homes, and people who have certain chronic medical conditions.",
      },
      {
        term: "Medicare Medical Savings Account (MSA) Plan",
        definition:
          "MSA Plans combine a high deductible health plan with a bank account. The plan deposits money from Medicare into the account. You can use it to pay your medical expenses until your deductible is met.",
      },
      {
        term: "Medicare Cost Plan",
        definition:
          "In a Medicare Cost Plan, you can go to providers both in and out of network. If you get services outside of the plan's network, your Medicare-covered services will be paid for under Original Medicare but you will be responsible for Medicare coinsurance and deductibles.",
      },
    ],
  },
  {
    key: "dvh",
    label: "Dental/Vision/Hearing Products",
    cmsSoaGoverned: false,
    description:
      "Plans offering additional benefits for consumers who are looking to cover needs for dental, vision or hearing. These plans are not affiliated or connected to Medicare.",
  },
  {
    key: "hospital_indemnity",
    label: "Hospital Indemnity Products",
    cmsSoaGoverned: false,
    description:
      "Plans offering additional benefits; payable to consumers based upon their medical utilization; sometimes used to defray copays/coinsurance. These plans are not affiliated or connected to Medicare.",
  },
  {
    key: "medigap",
    label: "Medicare Supplement (Medigap) Products",
    cmsSoaGoverned: false,
    description:
      "Plans offering a supplemental policy to fill “gaps” in Original Medicare coverage. A Medigap policy typically pays some or all of the deductible and coinsurance amounts applicable to Medicare-covered services, and sometimes covers items and services that are not covered by Medicare, such as care outside of the country. These plans are not affiliated or connected to Medicare.",
  },
] as const;

const PRODUCT_KEYS = new Set<string>(SOA_PRODUCT_TYPES.map((p) => p.key));

export function isSoaProductKey(value: unknown): value is SoaProductKey {
  return typeof value === "string" && PRODUCT_KEYS.has(value);
}

export function soaProductLabel(key: SoaProductKey): string {
  return SOA_PRODUCT_TYPES.find((p) => p.key === key)?.label ?? key;
}

/**
 * Initial method of contact. CMS asks the agent to record how the contact
 * began, and specifically to flag a walk-in, because a beneficiary-initiated
 * walk-in is one of the recognised exceptions to documenting the SOA 48 hours
 * ahead. A web submission can never be a walk-in, so that option is deliberately
 * absent -- the agent records walk-ins on paper at the time.
 */
export const SOA_CONTACT_METHODS = [
  { key: "website", label: "Website request (this form)" },
  { key: "inbound_call", label: "I called the agent" },
  { key: "outbound_call", label: "The agent called me" },
  { key: "referral", label: "Referred by a friend or family member" },
  { key: "event", label: "Community or educational event" },
  { key: "other", label: "Other" },
] as const;

export type SoaContactMethodKey = (typeof SOA_CONTACT_METHODS)[number]["key"];

const CONTACT_METHOD_KEYS = new Set<string>(SOA_CONTACT_METHODS.map((m) => m.key));

export function isSoaContactMethod(value: unknown): value is SoaContactMethodKey {
  return typeof value === "string" && CONTACT_METHOD_KEYS.has(value);
}

export type SoaSubmissionInput = {
  beneficiaryFirstName?: string;
  beneficiaryLastName?: string;
  beneficiaryPhone?: string;
  streetAddress?: string;
  addressLine2?: string;
  city?: string;
  zip?: string;
  county?: string;
  state?: string;
  productKeys?: unknown;
  initialContactMethod?: string;
  appointmentAt?: string;
  /** Typed-name electronic signature. */
  signature?: string;
  signedAt?: string;
  isAuthorizedRepresentative?: boolean;
  representativeName?: string;
  representativeRelationship?: string;
  /** Free-text reason, required when the appointment is under 48 hours out. */
  under48HourReason?: string;
  preferredLanguage?: string;
};

export type SoaValidationError = { field: string; message: string };

function trimmed(value: unknown): string {
  return String(value ?? "").trim();
}

export function normalizeZip(value: unknown): string {
  return trimmed(value).replace(/\D/g, "").slice(0, 5);
}

/**
 * Field-level validation. Deliberately mirrors the required-field markers on the
 * CMS model form: names, ZIP, at least one product, initial method of contact,
 * appointment date/time, and a signature.
 *
 * The 48-hour timing decision is NOT made here -- `evaluateSoaTiming` owns it,
 * so the booking surface and the live-call gatekeeper cannot drift apart.
 */
export function validateSoaSubmission(input: SoaSubmissionInput): SoaValidationError[] {
  const errors: SoaValidationError[] = [];

  if (!trimmed(input.beneficiaryFirstName)) {
    errors.push({ field: "beneficiaryFirstName", message: "First name is required." });
  }
  if (!trimmed(input.beneficiaryLastName)) {
    errors.push({ field: "beneficiaryLastName", message: "Last name is required." });
  }

  const zip = normalizeZip(input.zip);
  if (zip.length !== 5) {
    errors.push({ field: "zip", message: "A 5-digit ZIP code is required." });
  }

  const products = Array.isArray(input.productKeys) ? input.productKeys.filter(isSoaProductKey) : [];
  if (products.length === 0) {
    errors.push({ field: "productKeys", message: "Select at least one product type to discuss." });
  }

  if (!isSoaContactMethod(input.initialContactMethod)) {
    errors.push({ field: "initialContactMethod", message: "Select how this contact began." });
  }

  const appointmentAt = trimmed(input.appointmentAt);
  if (!appointmentAt || Number.isNaN(new Date(appointmentAt).getTime())) {
    errors.push({ field: "appointmentAt", message: "An appointment date and time is required." });
  }

  const signature = trimmed(input.signature);
  if (!signature) {
    errors.push({ field: "signature", message: "Type your full name to sign." });
  } else if (signature.length < 3) {
    errors.push({ field: "signature", message: "Enter your full name as your signature." });
  }

  if (input.isAuthorizedRepresentative === true) {
    if (!trimmed(input.representativeName)) {
      errors.push({ field: "representativeName", message: "Representative name is required." });
    }
    if (!trimmed(input.representativeRelationship)) {
      errors.push({
        field: "representativeRelationship",
        message: "Relationship to the beneficiary is required.",
      });
    }
  }

  return errors;
}

/** Product selections that pull the appointment under the CMS SOA requirement. */
export function cmsGovernedSelections(keys: readonly SoaProductKey[]): SoaProductKey[] {
  return keys.filter((key) => SOA_PRODUCT_TYPES.find((p) => p.key === key)?.cmsSoaGoverned);
}

/**
 * Map product selections onto the DiscussionStage vocabulary in `policy.ts`, so
 * a signed SOA can be evaluated by the same timing rules the call gatekeeper
 * uses. MA/PDP selections are the ones CMS governs; a Medigap-only or
 * ancillary-only selection is not a CMS plan discussion.
 */
export function discussionStageForSelections(keys: readonly SoaProductKey[]): string {
  if (keys.includes("ma_cost")) return "ma_plan_discussion";
  if (keys.includes("pdp")) return "plan_discussion";
  if (keys.includes("medigap")) return "medigap_plan_discussion";
  return "general_service";
}
