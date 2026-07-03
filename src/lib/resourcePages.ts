import { LINKEDIN_PERSONAL } from "./externalLinks";

export type ResourceFaq = {
  question: string;
  answer: string;
};

export type ResourceBlock = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ResourceCard = {
  title: string;
  body: string;
};

export type ResourcePage = {
  slug: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  description: string;
  heroSubtitle: string;
  leadCategory:
    | "Medicare consumer review"
    | "Turning 65"
    | "Extra Help/Medicaid question"
    | "Community event request"
    | "Referral partner inquiry"
    | "LinkedIn lead"
    | "ACA/private health"
    | "Employer/private options";
  audience: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  primaryExternal?: boolean;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryExternal?: boolean;
  formVariant?: "consumer" | "event" | "partner";
  serviceType: string;
  areaServed?: string;
  cards: ResourceCard[];
  blocks: ResourceBlock[];
  faqs: ResourceFaq[];
  links: Array<{ label: string; href: string }>;
};

const medicareDisclosure =
  "Plan availability and eligibility vary by county and individual circumstances. Vital Edge Insurance is not connected with or endorsed by the U.S. Government or the federal Medicare program. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation.";

const tpmoDisclosure =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

const coreLinks = [
  { label: "Medicare 101", href: "/medicare-101" },
  { label: "Turning 65", href: "/turning-65-medicare" },
  { label: "Still working past 65", href: "/medicare-still-working" },
  { label: "Extra Help and LIS", href: "/medicare-extra-help-lis" },
  { label: "Medicare and Medicaid", href: "/medicare-and-medicaid" },
  { label: "Request an event", href: "/medicare-educational-events" },
  { label: "Partner with Vital Edge", href: "/partner-with-vital-edge" },
];

const strategicPages: ResourcePage[] = [
  {
    slug: "medicare-101",
    eyebrow: "Medicare 101",
    title: "Medicare 101 Education",
    metaTitle: "Medicare 101 Education Across 12 States | Vital Edge Insurance",
    description:
      "Plain-language Medicare 101 education from Vital Edge Insurance covering Original Medicare, Medicare Advantage, Medigap, Part D, enrollment timing, networks, prescriptions, and pharmacies.",
    heroSubtitle:
      "A clear, local Medicare primer for people who want to understand the pieces before making any plan-specific decisions.",
    leadCategory: "Medicare consumer review",
    audience: "Medicare consumers and families",
    primaryCtaLabel: "Request Medicare Guidance",
    primaryCtaHref: "/contact?topic=medicare",
    secondaryCtaLabel: "Turning 65 Timeline",
    secondaryCtaHref: "/turning-65-medicare",
    serviceType: "Medicare education",
    areaServed: "Florida headquarters and 12-state approved service footprint",
    cards: [
      {
        title: "Original Medicare",
        body: "Part A generally relates to hospital coverage. Part B generally relates to medical coverage. Costs, timing, and coordination can depend on your situation.",
      },
      {
        title: "Medicare Advantage and Medigap",
        body: "Medicare Advantage and Medicare Supplement insurance work differently. Provider access, referrals, travel, and budget should be reviewed before a decision.",
      },
      {
        title: "Part D and pharmacies",
        body: "Prescription coverage should be reviewed using current medications and pharmacy preferences. Formularies and pharmacy networks can vary.",
      },
    ],
    blocks: [
      {
        title: "What Medicare 101 should cover",
        paragraphs: [
          "Medicare education should start with the basics: what Part A and Part B do, what they do not do, and why people often review additional coverage. The goal is to understand the moving parts before looking at plan-specific details.",
          "A practical review also includes enrollment periods, provider networks, prescription drug lists, preferred pharmacies, and how coverage can change by county. This helps people ask better questions and avoid rushed decisions.",
        ],
      },
      {
        title: "Why plan fit matters",
        bullets: [
          "Doctors and hospitals may participate differently across plan types.",
          "Prescription costs can depend on formulary tier, pharmacy, dosage, and coverage stage.",
          "Dental, vision, hearing, and hospital coverage may be handled separately or through certain plan designs.",
          "Plan-specific conversations require appropriate appointment documentation before recommendations are discussed.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      {
        question: "Is Medicare 101 a plan recommendation?",
        answer:
          "No. Medicare 101 is general education. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation and licensed-agent follow-up.",
      },
      {
        question: "What should I prepare before a Medicare review?",
        answer:
          "Prepare your ZIP code, county, preferred doctors, prescription list, pharmacy preferences, current coverage, and any employer or retiree coverage details.",
      },
      {
        question: "Can plan availability change by county?",
        answer:
          "Yes. Plan availability, provider networks, benefits, and eligibility can vary by county and individual circumstances.",
      },
    ],
    links: coreLinks,
  },
  {
    slug: "turning-65-medicare",
    eyebrow: "Turning 65",
    title: "Turning 65 Medicare Timeline",
    metaTitle: "Turning 65 Medicare Timeline | Vital Edge Insurance Jacksonville",
    description:
      "A plain-language Turning 65 Medicare timeline covering Part A, Part B, employer coverage, prescriptions, doctors, pharmacies, and coverage options.",
    heroSubtitle:
      "A month-by-month checklist for reviewing Medicare timing before your coverage begins.",
    leadCategory: "Turning 65",
    audience: "People approaching Medicare age",
    primaryCtaLabel: "Start a Turning 65 Review",
    primaryCtaHref: "/contact?topic=turning-65",
    secondaryCtaLabel: "Connect on LinkedIn",
    secondaryCtaHref: LINKEDIN_PERSONAL,
    secondaryExternal: true,
    serviceType: "Turning 65 Medicare guidance",
    cards: [
      { title: "6 months before", body: "Confirm your expected Medicare start date, current coverage, employer status, and Social Security timing." },
      { title: "3 months before", body: "Review Part A, Part B, prescription needs, doctors, pharmacies, and whether employer coverage changes your timing." },
      { title: "Before coverage starts", body: "Compare coverage paths carefully and document next steps before any plan-specific discussion." },
    ],
    blocks: [
      {
        title: "A practical Turning 65 sequence",
        bullets: [
          "Confirm whether you are already receiving Social Security benefits.",
          "Review whether Part A and Part B should start right away or coordinate with employer coverage.",
          "Gather current prescriptions, preferred doctors, and pharmacies.",
          "Understand the difference between Original Medicare, Medicare Advantage, Medigap, and Part D.",
          "Avoid submitting sensitive identifiers through web forms or chat.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      { question: "Do I always need Part B when I turn 65?", answer: "Not always. Employer coverage, employer size, and creditable coverage rules should be reviewed carefully before delaying or starting Part B." },
      { question: "Should I review prescriptions before Medicare starts?", answer: "Yes. Prescription coverage can affect costs and plan fit, so medication and pharmacy details should be reviewed before enrollment decisions." },
    ],
    links: coreLinks,
  },
  {
    slug: "medicare-still-working",
    eyebrow: "Still working past 65",
    title: "Medicare When You Are Still Working",
    metaTitle: "Medicare While Still Working Past 65 | Vital Edge Insurance",
    description:
      "Education for people still working past 65 who need to review employer coverage, Part B timing, creditable coverage, prescriptions, and Medicare coordination.",
    heroSubtitle:
      "Employer coverage can change Medicare timing. Review the details before you make a Part B or coverage decision.",
    leadCategory: "Employer/private options",
    audience: "Workers age 65 and older",
    primaryCtaLabel: "Review Employer Coverage Timing",
    primaryCtaHref: "/contact?topic=medicare-still-working",
    secondaryCtaLabel: "Turning 65 Timeline",
    secondaryCtaHref: "/turning-65-medicare",
    serviceType: "Employer Medicare coordination education",
    cards: [
      { title: "Employer size matters", body: "Coordination rules can differ based on employer size and whether coverage is active employee coverage." },
      { title: "Part B timing matters", body: "Delaying or starting Part B should be reviewed carefully to reduce gaps or penalty risk." },
      { title: "Drug coverage matters", body: "Creditable prescription coverage should be confirmed before relying on employer or retiree coverage." },
    ],
    blocks: [
      {
        title: "Questions to review",
        bullets: [
          "Is the coverage active employee group health coverage or retiree coverage?",
          "How does the employer plan coordinate with Medicare?",
          "Is prescription drug coverage considered creditable?",
          "Are your doctors and pharmacies still practical under the current arrangement?",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure] },
    ],
    faqs: [
      { question: "Can I keep employer coverage after 65?", answer: "Many people can, but Medicare timing and coordination depend on employment status, employer size, and coverage details." },
      { question: "What is creditable coverage?", answer: "Creditable coverage generally means coverage that meets certain standards. You should confirm creditable status with the employer or plan administrator." },
    ],
    links: coreLinks,
  },
  {
    slug: "medicare-extra-help-lis",
    eyebrow: "Extra Help and LIS",
    title: "Medicare Extra Help and LIS Education",
    metaTitle: "Medicare Extra Help and LIS Education | Vital Edge Insurance",
    description:
      "Consumer-friendly education about Medicare Extra Help and the Low-Income Subsidy without promising eligibility or specific outcomes.",
    heroSubtitle:
      "Learn what Extra Help and LIS generally mean, what information may be reviewed, and why eligibility should not be assumed.",
    leadCategory: "Extra Help/Medicaid question",
    audience: "People with Medicare prescription cost questions",
    primaryCtaLabel: "Ask an Extra Help Question",
    primaryCtaHref: "/contact?topic=extra-help-lis",
    secondaryCtaLabel: "Medicare and Medicaid",
    secondaryCtaHref: "/medicare-and-medicaid",
    serviceType: "Extra Help and LIS education",
    cards: [
      { title: "What it may help with", body: "Extra Help may reduce certain Medicare prescription drug costs for eligible people." },
      { title: "Eligibility is not promised", body: "Eligibility depends on official rules and personal circumstances. Vital Edge does not promise eligibility." },
      { title: "Prepare the basics", body: "A review may include county, current coverage, prescription needs, and where to apply or verify status." },
    ],
    blocks: [
      {
        title: "Plain-language overview",
        paragraphs: [
          "Extra Help, also called LIS, is related to help with Medicare prescription drug costs for people who meet eligibility rules. It is important to verify status through official channels and avoid assuming qualification.",
          "A local resource can help you understand what questions to ask, what notices to look for, and how prescription coverage may interact with other programs.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      { question: "Does this page tell me I qualify?", answer: "No. Eligibility must be confirmed through official program rules and individual circumstances." },
      { question: "Can Extra Help affect prescription costs?", answer: "It may reduce certain costs for eligible people, but details depend on official eligibility and coverage." },
    ],
    links: coreLinks,
  },
  {
    slug: "medicare-and-medicaid",
    eyebrow: "Medicare and Medicaid",
    title: "Medicare and Medicaid Education",
    metaTitle: "Medicare and Medicaid Guidance | Vital Edge Insurance",
    description:
      "Educational guidance for people who may have both Medicare and Medicaid, including county-based plan availability, eligibility review, and D-SNP considerations.",
    heroSubtitle:
      "Some people have both Medicare and Medicaid. Additional plan options may exist, but eligibility and availability must be verified.",
    leadCategory: "Extra Help/Medicaid question",
    audience: "People with Medicare and Medicaid questions",
    primaryCtaLabel: "Ask a Medicare and Medicaid Question",
    primaryCtaHref: "/contact?topic=medicare-medicaid",
    secondaryCtaLabel: "D-SNP Education",
    secondaryCtaHref: "/medicare/d-snp",
    serviceType: "Medicare and Medicaid education",
    cards: [
      { title: "Dual coverage basics", body: "Some people receive Medicare and Medicaid. The details depend on eligibility, state rules, and county." },
      { title: "D-SNP is not assumed", body: "Certain Special Needs Plan options may be available, but eligibility must be confirmed." },
      { title: "County review", body: "Provider networks, benefits, and plan availability can vary by county and individual circumstances." },
    ],
    blocks: [
      {
        title: "What to review first",
        bullets: [
          "Current Medicare coverage.",
          "Current Medicaid status and notices.",
          "County, ZIP code, doctors, prescriptions, and pharmacies.",
          "Whether a plan-specific conversation requires appointment documentation.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      { question: "Does Medicaid automatically mean I qualify for a D-SNP?", answer: "No. Eligibility and plan availability must be verified based on individual circumstances and county." },
      { question: "Can networks still matter?", answer: "Yes. Provider networks and pharmacies should be reviewed for any plan-specific option." },
    ],
    links: coreLinks,
  },
  {
    slug: "medicare-educational-events",
    eyebrow: "Community education",
    title: "Request a Medicare 101 Educational Event",
    metaTitle: "Request a Medicare 101 Educational Event | Vital Edge Insurance",
    description:
      "Churches, senior centers, libraries, community groups, senior apartments, assisted living communities, nursing homes, and local organizations can request an educational Medicare 101 presentation.",
    heroSubtitle:
      "Bring a clear, no-cost Medicare 101 presentation to a community group without high-pressure sales language.",
    leadCategory: "Community event request",
    audience: "Community organizations",
    primaryCtaLabel: "Request an Educational Event",
    primaryCtaHref: "#resource-lead-form",
    secondaryCtaLabel: "Partner With Vital Edge",
    secondaryCtaHref: "/partner-with-vital-edge",
    formVariant: "event",
    serviceType: "Community Medicare education event",
    cards: [
      { title: "For senior centers", body: "Offer a plain-language Medicare basics session with time for general questions." },
      { title: "For churches and groups", body: "Support members with education on timing, coverage terms, and next steps." },
      { title: "For libraries and communities", body: "Host a practical education session that respects compliance boundaries." },
    ],
    blocks: [
      {
        title: "What the event covers",
        bullets: [
          "Original Medicare, Medicare Advantage, Medigap, Part D, enrollment periods, provider networks, prescriptions, and pharmacies.",
          "How to prepare for a licensed appointment when someone needs plan-specific help.",
          "Why plan availability, eligibility, provider networks, and benefits can vary by county and personal circumstances.",
        ],
      },
      {
        title: "Compliance boundaries",
        paragraphs: [
          "The presentation is educational. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation before individual recommendations are discussed.",
          medicareDisclosure,
          tpmoDisclosure,
        ],
      },
    ],
    faqs: [
      { question: "Is the event a sales meeting?", answer: "The requested presentation is educational. Plan-specific conversations require proper appointment documentation." },
      { question: "Who can request an event?", answer: "Churches, senior centers, libraries, community centers, senior apartments, assisted living communities, nursing homes, and local organizations may request an event." },
    ],
    links: coreLinks,
  },
  {
    slug: "partner-with-vital-edge",
    eyebrow: "Referral partners",
    title: "Partner With Vital Edge Insurance",
    metaTitle: "Partner With Vital Edge Insurance | Medicare Referral Resource",
    description:
      "Referral partner page for doctors, dentists, pharmacies, financial advisors, elder law attorneys, churches, senior centers, home health agencies, and senior communities.",
    heroSubtitle:
      "A local, education-first resource for Medicare and health coverage questions that your clients, patients, members, or residents may be asking.",
    leadCategory: "Referral partner inquiry",
    audience: "Referral partners",
    primaryCtaLabel: "Start a Partner Conversation",
    primaryCtaHref: "#resource-lead-form",
    secondaryCtaLabel: "Request an Event",
    secondaryCtaHref: "/medicare-educational-events",
    formVariant: "partner",
    serviceType: "Referral partner Medicare education",
    cards: [
      { title: "For Doctors' Offices", body: "A resource for patients with Medicare timing, provider network, and coverage questions without implying provider endorsement." },
      { title: "For Dental Offices", body: "Help patients understand how dental, vision, hearing, and Medicare questions may intersect." },
      { title: "For Pharmacies", body: "Offer a referral path for people asking about prescription coverage, Part D timing, and pharmacy networks." },
      { title: "For Senior Centers", body: "Support general Medicare education and appointment scheduling with compliance-first boundaries." },
      { title: "For Churches and Community Groups", body: "Provide education-first guidance for members and caregivers in plain language." },
      { title: "For Financial Advisors and Elder Law Attorneys", body: "Give clients a coverage resource for Medicare timing, plan-fit questions, and private health options." },
      { title: "For Senior Living Communities", body: "Help residents and families understand Medicare basics, provider networks, and prescription review preparation." },
    ],
    blocks: [
      {
        title: "How Vital Edge supports partners",
        paragraphs: [
          "Vital Edge can serve as a local Medicare and health coverage education resource. The goal is not to imply endorsement by your organization, but to give people a clear next step when coverage questions come up.",
          "Patrick Mackin IV helps people understand timing, coverage pathways, provider network considerations, prescription coverage, and when a licensed appointment is required.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      { question: "Does a partner relationship imply endorsement?", answer: "No. Any referral relationship should be framed as access to an education-first resource, not endorsement by the organization." },
      { question: "Can Vital Edge help with educational events?", answer: "Yes. Community organizations can request Medicare 101 educational presentations with compliance-safe boundaries." },
    ],
    links: coreLinks,
  },
  {
    slug: "medicare-resource-tables",
    eyebrow: "Resource tables",
    title: "Medicare Resource Tables",
    metaTitle: "Compliant Medicare Resource Tables | Vital Edge Insurance",
    description:
      "Compliant Medicare resource tables for approved community locations such as grocery stores, pharmacies, libraries, community centers, and senior events.",
    heroSubtitle:
      "A calm, educational table for general Medicare questions and appointment scheduling at approved community locations.",
    leadCategory: "Community event request",
    audience: "Community locations",
    primaryCtaLabel: "Request a Resource Table",
    primaryCtaHref: "#resource-lead-form",
    secondaryCtaLabel: "Request an Event",
    secondaryCtaHref: "/medicare-educational-events",
    formVariant: "event",
    serviceType: "Medicare resource table",
    cards: [
      { title: "General education", body: "The table is for Medicare basics, timing questions, and appointment scheduling." },
      { title: "Approved locations", body: "Examples include grocery stores, pharmacies, community centers, libraries, and senior events when approved." },
      { title: "No high-pressure setup", body: "The table should feel useful, calm, and compliance-first, not like a high-pressure sales booth." },
    ],
    blocks: [
      {
        title: "What the table is for",
        bullets: [
          "Answering general Medicare education questions.",
          "Helping visitors know what to prepare for a licensed appointment.",
          "Scheduling follow-up when a visitor asks for plan-specific help.",
          "Avoiding sensitive identifiers at the table or through web forms.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
    ],
    faqs: [
      { question: "Can plan-specific questions be answered at the table?", answer: "Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation." },
      { question: "Can a table be requested for a local event?", answer: "Yes. Use the request form with location, audience type, date, and notes." },
    ],
    links: coreLinks,
  },
  {
    slug: "linkedin-medicare-resources",
    eyebrow: "LinkedIn resources",
    title: "Medicare and Health Coverage Resources From Patrick",
    metaTitle: "LinkedIn Medicare Resources | Patrick Mackin IV | Vital Edge Insurance",
    description:
      "A LinkedIn landing page for Patrick Mackin IV with Medicare 101, Turning 65, Still Working Past 65, Extra Help/LIS, Medicare and Medicaid, events, partners, and consultation links.",
    heroSubtitle:
      "If you came from LinkedIn, start here for education-first Medicare and health coverage resources from Patrick Mackin IV.",
    leadCategory: "LinkedIn lead",
    audience: "LinkedIn visitors",
    primaryCtaLabel: "Schedule a Consultation",
    primaryCtaHref: "/contact?source=linkedin",
    secondaryCtaLabel: "Medicare 101",
    secondaryCtaHref: "/medicare-101",
    serviceType: "LinkedIn Medicare education hub",
    cards: [
      { title: "Start with Medicare 101", body: "Review Original Medicare, Advantage, Medigap, Part D, networks, prescriptions, and timing." },
      { title: "Approaching 65", body: "Use the Turning 65 timeline and still-working guide before making timing decisions." },
      { title: "Community and partner work", body: "Request an educational event, resource table, or referral partner conversation." },
    ],
    blocks: [
      {
        title: "Connect with Patrick on LinkedIn",
        paragraphs: [
          "Connect with Patrick on LinkedIn for Medicare and health coverage education, local Medicare 101 posts, and compliance-first coverage resources.",
        ],
      },
      {
        title: "Resource map",
        bullets: [
          "Medicare 101 education.",
          "Turning 65 guidance.",
          "Still working past 65.",
          "Extra Help and Medicare/Medicaid education.",
          "Community Medicare 101 event requests.",
          "Referral partner resources.",
        ],
      },
      { title: "Compliance note", paragraphs: [medicareDisclosure] },
    ],
    faqs: [
      { question: "Can I ask plan-specific Medicare questions from LinkedIn?", answer: "You can request follow-up. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation." },
      { question: "Is this page only for Medicare?", answer: "No. It also connects to ACA, private health, employer/private options, ancillary coverage, and partner resources." },
    ],
    links: coreLinks,
  },
];

const statePages: ResourcePage[] = [
  ["florida", "Florida", "Jacksonville roots with statewide Medicare education for county-by-county review."],
  ["georgia", "Georgia", "Education for Georgia residents who want to review Medicare timing, networks, prescriptions, and county availability."],
  ["south-carolina", "South Carolina", "Plain-language Medicare guidance for South Carolina residents and families comparing coverage pathways."],
  ["north-carolina", "North Carolina", "Medicare education for North Carolina residents with attention to county, provider access, and prescription review."],
  ["texas", "Texas", "Texas Medicare guidance with a focus on county variation, provider networks, prescription coverage, and appointment-based review."],
  ["tennessee", "Tennessee", "Tennessee Medicare education for people reviewing doctors, pharmacies, timing, and local plan availability."],
  ["arizona", "Arizona", "Arizona Medicare guidance for retirees, caregivers, and workers approaching Medicare decisions."],
  ["washington", "Washington", "Washington Medicare education with attention to county-based availability, provider access, and prescription coverage."],
  ["pennsylvania", "Pennsylvania", "Pennsylvania Medicare guidance for timing, plan pathways, prescriptions, pharmacies, and local county differences."],
  ["ohio", "Ohio", "Ohio Medicare education for people comparing Original Medicare, Medicare Advantage, Medigap, and Part D basics."],
  ["michigan", "Michigan", "Michigan Medicare guidance focused on provider networks, prescriptions, enrollment timing, and county-level variation."],
  ["louisiana", "Louisiana", "Louisiana Medicare education for people who want clear next steps before plan-specific conversations."],
].map(([slugBase, stateName, stateNote]) => ({
  slug: `${slugBase}-medicare-help`,
  eyebrow: `${stateName} Medicare help`,
  title: `${stateName} Medicare Help`,
  metaTitle: `${stateName} Medicare Help | Vital Edge Insurance`,
  description: `Licensed Medicare education for ${stateName} residents. Review timing, provider networks, prescriptions, pharmacies, and county-specific plan availability with Vital Edge Insurance.`,
  heroSubtitle: stateNote,
  leadCategory: "Medicare consumer review",
  audience: `${stateName} Medicare consumers and families`,
  primaryCtaLabel: `Request ${stateName} Medicare Guidance`,
  primaryCtaHref: `/contact?topic=medicare&state=${encodeURIComponent(stateName)}`,
  secondaryCtaLabel: "Medicare 101",
  secondaryCtaHref: "/medicare-101",
  serviceType: "State Medicare education",
  areaServed: stateName,
  cards: [
    { title: "County matters", body: `Plan availability, provider networks, benefits, and eligibility can vary by county within ${stateName}.` },
    { title: "Provider review", body: "Doctors, hospitals, referrals, prior authorization rules, and pharmacies should be reviewed before plan-specific decisions." },
    { title: "Appointment-based next steps", body: "Plan-specific Medicare Advantage or Part D conversations require appropriate appointment documentation." },
  ],
  blocks: [
    {
      title: `Medicare guidance in ${stateName}`,
      paragraphs: [
        `Vital Edge Insurance provides education-first Medicare guidance for ${stateName} residents who want to understand coverage paths before discussing plan-specific options.`,
        "A useful review starts with county, ZIP code, current coverage, doctors, prescriptions, pharmacies, budget preferences, and enrollment timing.",
      ],
    },
    { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
  ],
  faqs: [
    { question: `Does Medicare plan availability vary in ${stateName}?`, answer: "Yes. Plan availability, provider networks, benefits, and eligibility vary by county and individual circumstances." },
    { question: "Can I get plan-specific guidance right away?", answer: "General education can start anytime. Plan-specific Medicare Advantage or Part D discussions require appropriate appointment documentation." },
  ],
  links: coreLinks,
})) as ResourcePage[];

const localPages: ResourcePage[] = [
  ["jacksonville", "Jacksonville", "Jacksonville Medicare Help", "Local Medicare guidance based in Jacksonville with attention to doctors, hospitals, pharmacies, prescriptions, and appointment-based reviews."],
  ["duval-county", "Duval County", "Duval County Medicare Help", "Duval County Medicare education for provider network review, pharmacy access, prescriptions, and coverage timing."],
  ["st-johns-county", "St. Johns County", "St. Johns County Medicare Help", "St. Johns County Medicare guidance for families reviewing doctors, pharmacies, prescriptions, and county-specific availability."],
  ["mandarin", "Mandarin", "Mandarin Medicare Help", "Mandarin-area Medicare education from a Florida-headquartered licensed agent serving clients across 12 states and growing."],
  ["ponte-vedra", "Ponte Vedra", "Ponte Vedra Medicare Help", "Ponte Vedra Medicare education for provider access, prescription review, pharmacy preferences, and timing questions."],
  ["nocatee", "Nocatee", "Nocatee Medicare Help", "Nocatee Medicare guidance for people approaching 65, still working, or helping a family member compare coverage paths."],
].map(([slugBase, areaName, title, subtitle]) => ({
  slug: `${slugBase}-medicare-help`,
  eyebrow: `${areaName} Medicare help`,
  title,
  metaTitle: `${title} | Vital Edge Insurance Jacksonville`,
  description: `${title} from Vital Edge Insurance. Local guidance for provider-network review, prescriptions, pharmacies, enrollment timing, and appointment-based Medicare reviews.`,
  heroSubtitle: subtitle,
  leadCategory: "Medicare consumer review",
  audience: `${areaName} Medicare consumers and families`,
  primaryCtaLabel: `Request ${areaName} Medicare Guidance`,
  primaryCtaHref: `/contact?topic=medicare&area=${encodeURIComponent(areaName)}`,
  secondaryCtaLabel: "Medicare 101",
  secondaryCtaHref: "/medicare-101",
  serviceType: "Local Medicare education",
  areaServed: `${areaName}, Florida`,
  cards: [
    { title: "Local provider review", body: "Review doctors, hospitals, referrals, and network access before any plan-specific decision." },
    { title: "Prescriptions and pharmacies", body: "Prescription lists and pharmacy preferences are part of a practical Medicare review." },
    { title: "Appointment-based guidance", body: "Plan-specific Medicare Advantage or Part D guidance requires appropriate appointment documentation." },
  ],
  blocks: [
    {
      title: `${areaName} Medicare guidance`,
      paragraphs: [
        `Vital Edge Insurance provides local, education-first Medicare guidance for ${areaName} residents and families.`,
        "The review starts with coverage timing, county and ZIP code, current doctors, prescription needs, preferred pharmacies, and whether employer or retiree coverage affects the next step.",
      ],
    },
    { title: "Compliance note", paragraphs: [medicareDisclosure, tpmoDisclosure] },
  ],
  faqs: [
    { question: `Why does local Medicare review matter in ${areaName}?`, answer: "Provider networks, pharmacy access, and plan availability can vary by county, ZIP code, and individual circumstances." },
    { question: "Can a family member help with the review?", answer: "Yes. A family member can help organize information, but plan-specific discussions still require appropriate documentation and consent." },
  ],
  links: coreLinks,
})) as ResourcePage[];

export const resourcePages: ResourcePage[] = [...strategicPages, ...statePages, ...localPages];

export const resourcePageSlugs = resourcePages.map((page) => page.slug);

export function getResourcePage(slug: string) {
  return resourcePages.find((page) => page.slug === slug);
}
