import type { ResourcePage } from "./resourcePages";

/**
 * State authority pages.
 *
 * These replace the templated `statePages` entries in resourcePages.ts, which
 * are near-identical name-substitutions of one another (Georgia, Texas and Ohio
 * currently render within 200 bytes of each other) and are all listed in the
 * sitemap. Google treats thin duplicated regional pages as doorway spam.
 *
 * PUBLICATION GATE
 * ----------------
 * A state page must not publish without a license record verified against that
 * state's DOI. NPN 21729046 is the national producer number; each state license
 * is separate and must be confirmed independently.
 *
 * `license: null` means "not yet verified" and the page is filtered out of
 * `publishableStateAuthorityPages()`. It cannot render, cannot enter the
 * sitemap, and the templated fallback stays in place until a real record lands.
 * Filling in a StateLicenseRecord is the single change that publishes a page.
 */

export type StateLicenseRecord = {
  /**
   * State-issued producer license number. Note that AZ, MI, NC and SC issue
   * the license under the producer's NPN, so for those states this legitimately
   * equals the NPN.
   */
  number: string;
  /**
   * Exact line-of-authority wording from the licensing record, used verbatim in
   * page copy. States differ: most say "Accident & Health", Georgia says
   * "Accident and Sickness", and Washington's health line is named
   * "Disability". Never generalise these to "health insurance license" -- the
   * claim has to match the record.
   */
  lineOfAuthority: string;
  /** ISO date the record was checked. */
  verifiedOn: string;
  /** ISO expiry, when the record carries one. Absent means no stated expiry. */
  expiresOn?: string;
  /** Direct URL to this specific record, where the state publishes stable ones. */
  verifyUrl?: string;
};

export type StateAuthorityDraft = {
  slugBase: string;
  stateName: string;
  /** null until an agent-confirmed state DOI record exists. */
  license: StateLicenseRecord | null;
  /** Full name of the state insurance regulator. */
  doiName: string;
  /** Short form used mid-sentence. */
  doiShortName: string;
  /** Consumer-facing regulator URL. */
  doiConsumerUrl: string;
  /** "county" for most states, "parish" for Louisiana. */
  countyNoun: string;
  countyPlural: string;
  countyCount: number;
  /** State-specific market structure. One or two sentences. */
  geographyNote: string;
  /** A second, genuinely distinct paragraph about this state's market. */
  marketNote: string;
  /** A question real to this state, not a name-substituted generic. */
  stateSpecificFaq: { question: string; answer: string };
};

const REVIEWER = "Patrick Mackin IV";
const NPN = "21729046";
const SHIP_LOCATOR = "https://www.shiphelp.org";

/**
 * Federal SHIP locator, deliberately used instead of individual state SHIP
 * sites. floridashine.org was found serving injected spam links, so state SHIP
 * domains are not linked directly from any page.
 */
const SHIP_LINK = { label: "Find free local SHIP counseling", href: SHIP_LOCATOR };

export const stateAuthorityDrafts: StateAuthorityDraft[] = [
  {
    slugBase: "georgia",
    stateName: "Georgia",
    license: {
      number: "3882193",
      lineOfAuthority: "Agent - Accident and Sickness",
      verifiedOn: "2026-07-29",
      expiresOn: "2028-02-29",
    },
    doiName: "Georgia Office of Commissioner of Insurance and Safety Fire",
    doiShortName: "Georgia Office of Insurance and Safety Fire",
    doiConsumerUrl: "https://oci.georgia.gov",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 159,
    geographyNote:
      "Georgia has 159 counties, more than any state except Texas, and they range from dense metro Atlanta counties to rural counties with a single hospital.",
    marketNote:
      "The gap between metro Atlanta and rural South Georgia is the single biggest factor in a Georgia Medicare review. Provider networks that look broad statewide can thin out sharply outside the metro counties, and a plan that works in Fulton or DeKalb may not carry the same hospital access further south.",
    stateSpecificFaq: {
      question: "Does moving between metro Atlanta and rural Georgia affect my Medicare plan?",
      answer:
        "It can. Medicare Advantage plans are county-based, so moving between counties may change which plans you are eligible for and which providers are in network. A move across county lines can also trigger a Special Enrollment Period. Confirm the specifics for your situation before you move.",
    },
  },
  {
    slugBase: "south-carolina",
    stateName: "South Carolina",
    license: {
      number: "21729046",
      lineOfAuthority: "Accident & Health or Sickness, and Life",
      verifiedOn: "2026-07-29",
      expiresOn: "2029-02-28",
    },
    doiName: "South Carolina Department of Insurance",
    doiShortName: "South Carolina Department of Insurance",
    doiConsumerUrl: "https://doi.sc.gov",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 46,
    geographyNote:
      "South Carolina has 46 counties, with populations concentrated along the coast and in the Upstate around Greenville and Spartanburg.",
    marketNote:
      "South Carolina draws a large number of retirees relocating from other states, which makes enrollment timing and prior-coverage history unusually important here. Someone arriving from another state often has a Special Enrollment Period, and the coverage they held before the move affects which paths remain open.",
    stateSpecificFaq: {
      question: "I retired to South Carolina from another state. Does that change my options?",
      answer:
        "Moving to a new state generally creates a Special Enrollment Period, because plan availability is tied to where you live. Your prior coverage and the date you established residency both matter. Bring your move date and previous plan details to any review so the timing can be confirmed rather than assumed.",
    },
  },
  {
    slugBase: "north-carolina",
    stateName: "North Carolina",
    license: {
      number: "21729046",
      lineOfAuthority: "Accident & Health or Sickness, and Medicare Supplement/Long-Term Care",
      verifiedOn: "2026-07-29",
    },
    doiName: "North Carolina Department of Insurance",
    doiShortName: "North Carolina Department of Insurance",
    doiConsumerUrl: "https://www.ncdoi.gov",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 100,
    geographyNote:
      "North Carolina has 100 counties spanning the coastal plain, the Piedmont, and the mountain counties in the west.",
    marketNote:
      "North Carolina's three regions behave differently. The Research Triangle and Charlotte have concentrated hospital systems, while the western mountain counties and eastern coastal counties can involve longer travel to in-network specialists. Network adequacy is worth checking against the specific providers you already use.",
    stateSpecificFaq: {
      question: "Why does my North Carolina county matter so much for provider access?",
      answer:
        "Hospital systems in North Carolina are regionally concentrated. A plan's network may include the system you use in one part of the state but not the one nearest you in another. Checking your actual doctors and hospitals against a plan's network is more reliable than looking at statewide network size.",
    },
  },
  {
    slugBase: "texas",
    stateName: "Texas",
    license: {
      number: "3461683",
      lineOfAuthority: "Life, Accident, Health and HMO",
      verifiedOn: "2026-07-29",
      expiresOn: "2028-02-29",
    },
    doiName: "Texas Department of Insurance",
    doiShortName: "Texas Department of Insurance",
    doiConsumerUrl: "https://www.tdi.texas.gov",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 254,
    geographyNote:
      "Texas has 254 counties, more than any other state, and plan availability varies more across Texas than in most states simply because of that spread.",
    marketNote:
      "The distance between the large metro markets and West Texas or the Panhandle is a practical issue, not an abstract one. Some rural Texas counties have very few in-network facilities within reasonable driving distance, so a plan review that stops at premium and deductible can miss the thing that matters most.",
    stateSpecificFaq: {
      question: "Does living in rural Texas limit my Medicare choices?",
      answer:
        "It can affect which Medicare Advantage plans are offered and how far you may need to travel for in-network care. Original Medicare with a Medigap policy is sometimes a better fit where networks are thin, because it is generally accepted by any provider that takes Medicare. Which approach fits depends on your county, providers, and budget.",
    },
  },
  {
    slugBase: "tennessee",
    stateName: "Tennessee",
    license: {
      number: "3004239694",
      lineOfAuthority: "Accident & Health, and Life",
      verifiedOn: "2026-07-29",
      expiresOn: "2029-02-28",
    },
    doiName: "Tennessee Department of Commerce and Insurance",
    doiShortName: "Tennessee Department of Commerce and Insurance",
    doiConsumerUrl: "https://www.tn.gov/commerce/insurance.html",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 95,
    geographyNote:
      "Tennessee has 95 counties across three grand divisions — East, Middle, and West — that function as distinct healthcare markets.",
    marketNote:
      "Tennessee's grand divisions are anchored by different hospital systems around Memphis, Nashville, and Knoxville. Someone moving between divisions is effectively changing markets, even without leaving the state, and network access can change accordingly.",
    stateSpecificFaq: {
      question: "I am moving from East to Middle Tennessee. Do I need to review my plan?",
      answer:
        "Yes, it is worth reviewing. Medicare Advantage plans are county-based and Tennessee's regions are served by different hospital systems, so a plan that fit well in one division may not provide the same access in another. A move may also open a Special Enrollment Period.",
    },
  },
  {
    slugBase: "louisiana",
    stateName: "Louisiana",
    license: {
      number: "1260392",
      lineOfAuthority: "Accident, Health or Sickness",
      verifiedOn: "2026-07-29",
      expiresOn: "2028-02-29",
    },
    doiName: "Louisiana Department of Insurance",
    doiShortName: "Louisiana Department of Insurance",
    doiConsumerUrl: "https://www.ldi.la.gov",
    countyNoun: "parish",
    countyPlural: "parishes",
    countyCount: 64,
    geographyNote:
      "Louisiana is divided into 64 parishes rather than counties, and Medicare plan availability is set at the parish level.",
    marketNote:
      "Because Louisiana uses parishes, plan documents and enrollment tools that ask for your county are asking for your parish. Availability differs between the New Orleans and Baton Rouge areas and the more rural northern and southwestern parishes, so the parish you live in is the right starting point.",
    stateSpecificFaq: {
      question: "Louisiana has parishes, not counties. How does that affect Medicare?",
      answer:
        "Parishes serve the same function as counties for Medicare purposes. Plan availability, provider networks, and eligibility are determined by your parish. When a Medicare form or plan finder asks for your county, enter your parish.",
    },
  },
  {
    slugBase: "arizona",
    stateName: "Arizona",
    license: {
      number: "21729046",
      lineOfAuthority: "Accident & Health or Sickness, and Life",
      verifiedOn: "2026-07-29",
      expiresOn: "2030-02-28",
    },
    doiName: "Arizona Department of Insurance and Financial Institutions",
    doiShortName: "Arizona Department of Insurance and Financial Institutions",
    doiConsumerUrl: "https://difi.az.gov",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 15,
    geographyNote:
      "Arizona has only 15 counties, but they are geographically large — a single county can span both a major metro area and remote rural communities.",
    marketNote:
      "Arizona's county count is low but each county covers a lot of ground, so county-level plan availability can hide big differences in practical provider access within the same county. Arizona also has a substantial seasonal-resident population, which makes coverage while travelling a common and legitimate question here.",
    stateSpecificFaq: {
      question: "I spend part of the year outside Arizona. How does that affect coverage?",
      answer:
        "It depends on the type of coverage. Original Medicare is generally accepted by any provider nationwide that takes Medicare. Medicare Advantage plans are usually network-based and tied to where you live, though many cover emergency and urgent care while travelling. If you split the year between states, raise it early in the review — it often changes which approach fits.",
    },
  },
  {
    slugBase: "washington",
    stateName: "Washington",
    license: {
      number: "1352072",
      lineOfAuthority: "Disability, and Life",
      verifiedOn: "2026-07-29",
      expiresOn: "2028-02-28",
    },
    doiName: "Washington State Office of the Insurance Commissioner",
    doiShortName: "Washington Office of the Insurance Commissioner",
    doiConsumerUrl: "https://www.insurance.wa.gov",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 39,
    geographyNote:
      "Washington has 39 counties, and the Cascade Range divides the state into two quite different healthcare markets.",
    marketNote:
      "Western Washington around the Puget Sound has dense provider networks, while the eastern counties are more rural and served by different systems. The east–west split matters more in Washington than the simple county count suggests.",
    stateSpecificFaq: {
      question: "Does the east–west split in Washington affect Medicare plans?",
      answer:
        "It does in practice. Provider networks and plan participation differ between the Puget Sound region and eastern Washington. Your county determines which plans are available, and the providers you actually use should be checked against any plan's network before deciding.",
    },
  },
  {
    slugBase: "pennsylvania",
    stateName: "Pennsylvania",
    license: {
      number: "1302380",
      lineOfAuthority: "Accident & Health",
      verifiedOn: "2026-07-29",
      expiresOn: "2028-02-29",
    },
    doiName: "Pennsylvania Insurance Department",
    doiShortName: "Pennsylvania Insurance Department",
    doiConsumerUrl: "https://www.pa.gov/agencies/insurance.html",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 67,
    geographyNote:
      "Pennsylvania has 67 counties, ranging from the Philadelphia and Pittsburgh metros to a large stretch of rural counties between them.",
    marketNote:
      "Pennsylvania has one of the larger Medicare-eligible populations in the country, and its two metro markets are served by different major health systems. Between them, the rural central counties can involve meaningfully longer travel to specialist care, which is worth factoring into a network review.",
    stateSpecificFaq: {
      question: "Are Medicare options different in Philadelphia versus rural Pennsylvania?",
      answer:
        "Plan availability is set by county, and the metro counties generally have more Medicare Advantage options than the rural central counties. More options is not automatically better — what matters is whether your doctors, hospitals, and prescriptions are covered under the plans available where you live.",
    },
  },
  {
    slugBase: "ohio",
    stateName: "Ohio",
    license: {
      number: "1725275",
      lineOfAuthority: "Accident & Health, and Life",
      verifiedOn: "2026-07-29",
      expiresOn: "2028-02-29",
    },
    doiName: "Ohio Department of Insurance",
    doiShortName: "Ohio Department of Insurance",
    doiConsumerUrl: "https://insurance.ohio.gov/",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 88,
    geographyNote:
      "Ohio has 88 counties organised around several mid-sized metros rather than one dominant city.",
    marketNote:
      "Ohio's population is spread across Columbus, Cleveland, Cincinnati, Dayton, Toledo and Akron rather than concentrated in a single metro. Each is anchored by its own hospital systems, so provider network questions in Ohio are usually regional rather than statewide.",
    stateSpecificFaq: {
      question: "Why is provider network the main question in Ohio?",
      answer:
        "Because Ohio's care is organised around several regional hospital systems rather than one statewide network. A plan may include the system you use in one metro but not the equivalent system in another. Checking your specific providers is more useful than comparing statewide network counts.",
    },
  },
  {
    slugBase: "michigan",
    stateName: "Michigan",
    license: {
      number: "21729046",
      lineOfAuthority: "Accident and Health, and Life",
      verifiedOn: "2026-07-29",
    },
    doiName: "Michigan Department of Insurance and Financial Services",
    doiShortName: "Michigan Department of Insurance and Financial Services",
    doiConsumerUrl: "https://www.michigan.gov/difs",
    countyNoun: "county",
    countyPlural: "counties",
    countyCount: 83,
    geographyNote:
      "Michigan has 83 counties across two peninsulas, and the Upper Peninsula is a distinctly different healthcare market from the Detroit metro area.",
    marketNote:
      "The Upper Peninsula is sparsely populated with long distances between facilities, while southeastern Michigan has dense provider networks. Michigan also has a significant retiree population that spends winters out of state, which makes coverage away from home a routine question rather than an edge case.",
    stateSpecificFaq: {
      question: "Does living in the Upper Peninsula change my Medicare options?",
      answer:
        "It can. Medicare Advantage networks in the Upper Peninsula are generally smaller and facilities are further apart than in southeastern Michigan. Original Medicare with a Medigap policy is sometimes a better practical fit where networks are limited. The right answer depends on your county, providers, and budget.",
    },
  },
];

const medicareDisclosure =
  "Plan availability and eligibility vary by county and individual circumstances. Vital Edge Insurance is not connected with or endorsed by the U.S. Government or the federal Medicare program. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation.";

const tpmoDisclosure =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

function formatReviewDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const monthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][month - 1];
  return `${monthName} ${day}, ${year}`;
}

/**
 * Builds a full ResourcePage from a draft. Only ever called for drafts with a
 * verified license, so `license` is non-null by contract.
 */
function buildStateAuthorityPage(
  draft: StateAuthorityDraft,
  license: StateLicenseRecord,
  coreLinks: Array<{ label: string; href: string }>,
): ResourcePage {
  const { stateName, countyNoun, countyPlural, countyCount } = draft;
  const reviewed = formatReviewDate(license.verifiedOn);

  return {
    slug: `${draft.slugBase}-medicare-help`,
    eyebrow: `${stateName} Medicare help`,
    title: `${stateName} Medicare Help`,
    metaTitle: `${stateName} Medicare Help from a Licensed Agent | Vital Edge Insurance`,
    description: `${stateName} Medicare education from ${REVIEWER}, a licensed insurance producer (${stateName} license ${license.number}, NPN ${NPN}). Review enrollment timing, ${countyNoun}-level availability, provider networks, prescriptions, and free official ${stateName} resources.`,
    heroSubtitle: `Licensed in ${stateName}, with ${countyNoun}-by-${countyNoun} Medicare education for households across the state.`,
    leadCategory: "Medicare consumer review",
    audience: `${stateName} Medicare consumers and families`,
    primaryCtaLabel: `Request ${stateName} Medicare Guidance`,
    primaryCtaHref: `/contact?topic=medicare&state=${encodeURIComponent(stateName)}`,
    secondaryCtaLabel: "Medicare 101",
    secondaryCtaHref: "/medicare-101",
    serviceType: "State Medicare education",
    areaServed: stateName,
    cards: [
      {
        title: `${stateName}-licensed and verifiable`,
        body: `${REVIEWER} holds an active ${stateName} insurance license (${license.number}, NPN ${NPN}) with ${license.lineOfAuthority} authority. Verify it anytime through the ${draft.doiShortName}.`,
      },
      {
        title: `${stateName} has ${countyCount} ${countyPlural}`,
        body: `${draft.geographyNote} Plan availability, provider networks, benefits, and eligibility vary by ${countyNoun}, so a useful review starts with your ${countyNoun} and ZIP code.`,
      },
      {
        title: "Free official help exists",
        body: `${stateName}'s State Health Insurance Assistance Program offers free, unbiased Medicare counseling. Vital Edge encourages using official resources alongside licensed-agent guidance — find your local SHIP through the national locator.`,
      },
    ],
    blocks: [
      {
        title: `Medicare guidance in ${stateName}`,
        paragraphs: [
          `Vital Edge Insurance provides education-first Medicare guidance for ${stateName} residents who want to understand coverage paths before discussing plan-specific options.`,
          draft.marketNote,
          `A useful review starts with your ${countyNoun}, ZIP code, current coverage, doctors, hospitals, prescriptions, preferred pharmacies, budget, and enrollment timing.`,
        ],
      },
      {
        title: "About your licensed agent",
        paragraphs: [
          `${REVIEWER} is a Florida-resident licensed agent holding a non-resident ${stateName} insurance license (${stateName} license ${license.number}, National Producer Number ${NPN}) with ${license.lineOfAuthority} authority. The license record, including active status and carrier appointments, is publicly verifiable through the ${draft.doiName}, linked below.`,
          `Reviewed by ${REVIEWER}. Last reviewed ${reviewed}.${license.expiresOn ? ` License current through ${formatReviewDate(license.expiresOn)}.` : ""}`,
        ],
      },
      {
        title: `Official ${stateName} and federal resources`,
        bullets: [
          "Medicare.gov and 1-800-MEDICARE for complete plan information for your area.",
          `${stateName}'s State Health Insurance Assistance Program, for free unbiased counseling (find it via the national SHIP locator).`,
          `The ${draft.doiName} for license verification and insurance consumer help.`,
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      {
        question: `Is Vital Edge Insurance licensed in ${stateName}?`,
        answer: `Yes. ${REVIEWER} holds an active non-resident ${stateName} insurance license (${license.number}, NPN ${NPN}) with ${license.lineOfAuthority} authority. You can verify the license through the ${draft.doiShortName} at any time.`,
      },
      draft.stateSpecificFaq,
      {
        question: `Is there free official Medicare help in ${stateName}?`,
        answer: `Yes. ${stateName}'s State Health Insurance Assistance Program provides free, unbiased, confidential Medicare counseling. Medicare.gov and 1-800-MEDICARE list every option in your area.`,
      },
      {
        question: "Can I get plan-specific guidance right away?",
        answer:
          "General education can start anytime. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation.",
      },
    ],
    links: [
      // Only claim a direct-record link where the state actually publishes a
      // stable one (as Florida does). Otherwise point at the regulator's own
      // lookup, which is what the page copy tells the reader to use.
      license.verifyUrl
        ? { label: `Verify ${REVIEWER}'s ${stateName} license`, href: license.verifyUrl }
        : { label: `Verify licenses through the ${draft.doiShortName}`, href: draft.doiConsumerUrl },
      { label: "Medicare.gov", href: "https://www.medicare.gov" },
      SHIP_LINK,
      ...coreLinks,
    ],
  };
}

/** slugBases that have a verified license and therefore publish. */
export const publishedStateSlugBases: string[] = stateAuthorityDrafts
  .filter((d) => d.license !== null)
  .map((d) => d.slugBase);

/**
 * Full ResourcePages for every state with a verified license record.
 * States without one are omitted entirely — they keep the templated fallback.
 */
export function publishableStateAuthorityPages(
  coreLinks: Array<{ label: string; href: string }>,
): ResourcePage[] {
  return stateAuthorityDrafts.flatMap((draft) =>
    draft.license ? [buildStateAuthorityPage(draft, draft.license, coreLinks)] : [],
  );
}
