type DisclaimerInput = {
  orgCount: number;
  planCount: number;
  representsAllPlans: boolean;
};

const NON_ENDORSEMENT =
  "We are not connected with or endorsed by the U.S. government or the federal Medicare program.";

const CONTACT_MEDICARE =
  "To compare all options in your area, visit Medicare.gov or call 1-800-MEDICARE.";

export function buildTpmoDisclaimer(input: DisclaimerInput): string {
  const orgCount = Math.max(0, Math.trunc(input.orgCount || 0));
  const planCount = Math.max(0, Math.trunc(input.planCount || 0));

  if (input.representsAllPlans) {
    return [
      `We currently represent all ${orgCount} organizations and ${planCount} plans we are authorized to discuss in your area.`,
      NON_ENDORSEMENT,
    ].join(" ");
  }

  return [
    "We do not offer every plan available in your area.",
    `Currently we represent ${orgCount} organizations which offer ${planCount} plans in your area.`,
    "Any information we provide is limited to plans we offer in your area.",
    NON_ENDORSEMENT,
    CONTACT_MEDICARE,
  ].join(" ");
}
