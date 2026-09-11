import type { ResourceBlock, ResourceFaq, ResourcePage } from "./resourcePages";

const timingSource = {
  label: "Medicare.gov: Enrollment timing",
  href: "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare",
};
const coverageSource = {
  label: "Medicare.gov: Service areas and choosing coverage",
  href: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/joining-a-plan",
};
const localGuidance: Record<string, { description: string; blocks: ResourceBlock[]; faq: ResourceFaq }> = {
  "st-johns-county-medicare-help": {
    description: "Turning 65 or retiring in St. Johns County? Prepare your Medicare dates, St. Augustine and Jacksonville providers, prescriptions, and coverage questions with Vital Edge.",
    blocks: [
      {
        title: "Turning 65 or retiring in St. Johns County?",
        paragraphs: ["Start with when you expect Medicare to begin and whether you will keep coverage through a current job. Retirement, a 65th birthday, and a move to the county are different situations. We will review your existing coverage and dates before discussing an enrollment path."],
        links: [{ label: "Start with the Turning 65 timeline and appointment checklist", href: "/turning-65-medicare" }, timingSource],
      },
      {
        title: "Include care on both sides of the county line",
        paragraphs: ["If you live in St. Johns County but see specialists in Jacksonville, include those visits along with care in St. Augustine, Ponte Vedra, or near home. Bring each practice's name and location, your preferred hospital, your prescriptions, and the pharmacies you use.", "Your permanent home address determines the service area to check. Access to a doctor or hospital depends on the coverage you choose and its rules. Being nearby or accepting a carrier's other products does not confirm participation in the exact Medicare Advantage plan."],
        links: [coverageSource],
      },
    ],
    faq: {
      question: "Can I live in St. Johns County and keep my doctors in Jacksonville?",
      answer: "Possibly. Review every doctor, practice location, and hospital under the exact coverage you are considering. A plan being available in your home county does not establish that all nearby providers participate. Include regular care outside the county in your appointment checklist.",
      sources: [coverageSource],
    },
  },
  "nocatee-medicare-help": {
    description: "Turning 65 in Nocatee? Confirm your St. Johns or Duval county address, review Medicare timing and employer coverage, and prepare your doctors and prescriptions.",
    blocks: [
      {
        title: "Confirm your county before comparing plans",
        paragraphs: ["Nocatee includes neighborhoods in both St. Johns and Duval counties. Confirm the county of your permanent home address; the Nocatee community name or mailing city alone does not settle which plan service area applies.", "Your doctors may be in a different county from your home. Bring their exact practice locations and your preferred pharmacies so the review covers where you actually receive care."],
        links: [{ label: "Nocatee: Neighborhoods listed by county", href: "https://www.nocatee.com/schools/school-zoning-for-nocatee-students/" }, coverageSource],
      },
      {
        title: "Your birthday, retirement, or move sets the starting point",
        paragraphs: ["If you are approaching 65, start with your expected Medicare dates and any current employer coverage. If you already have Medicare and recently moved to Nocatee, bring your current plan information and move date instead. We will check the applicable enrollment requirements with you.", "Use the Turning 65 timeline to prepare your questions, or request a conversation below and share the month you expect to need coverage. You can leave timing blank if you are unsure."],
        links: [{ label: "Review the Turning 65 timeline and book an appointment", href: "/turning-65-medicare" }, timingSource],
      },
    ],
    faq: {
      question: "Are all Nocatee homes in the same Medicare service area?",
      answer: "No single service area should be assumed for all of Nocatee. The community includes St. Johns and Duval county neighborhoods. Confirm your permanent home county, then check availability and eligibility for the particular plan and coverage year.",
      sources: [{ label: "Nocatee: Neighborhoods in St. Johns and Duval counties", href: "https://www.nocatee.com/schools/school-zoning-for-nocatee-students/" }, coverageSource],
    },
  },
};

export function addLocalT65Guidance(page: ResourcePage): ResourcePage {
  const guidance = localGuidance[page.slug];
  if (!guidance) return page;
  return {
    ...page,
    description: guidance.description,
    heroSubtitle: guidance.description,
    primaryCtaHref: "#resource-lead-form",
    secondaryCtaLabel: "Turning 65? Start Here",
    secondaryCtaHref: "/turning-65-medicare",
    blocks: [...guidance.blocks, ...page.blocks],
    faqs: [guidance.faq, ...page.faqs],
    links: [
      { label: "Turning 65 timeline and appointment checklist", href: "/turning-65-medicare" },
      ...page.links.filter((link) => link.href !== "/turning-65-medicare"),
    ],
  };
}
