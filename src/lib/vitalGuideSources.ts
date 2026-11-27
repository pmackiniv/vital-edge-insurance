// This catalog is the public boundary. Never populate it from a project-wide export,
// client conversation, uploaded visitor material, CRM, or a search at request time.
export const guideTopics = ["turning", "working", "review", "client", "dental", "basics"] as const;
export type PublicGuideTopic = typeof guideTopics[number];

const working = "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65";
const basics = "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics";
type PublicSource = { label: string; href: string; topic: PublicGuideTopic; takeaway: string };

export const publicGuideSources = {
  "work-pays-first": { label: "Medicare.gov: Who pays first?", href: "https://www.medicare.gov/health-drug-plans/coordination/who-pays-first", topic: "working", takeaway: "Ask the benefits team which coverage pays first and whether the work plan expects you to have Part A or Part B. The answer depends on how you get coverage and how the plans work together." },
  "work-checklist": { label: "Vital Edge: Working Past 65 checklist", href: "/medicare-still-working", topic: "working", takeaway: "Ask your benefits team when work coverage ends and what a change would mean for a spouse or dependents. Get the dates in writing before dropping coverage." },
  "work-hsa": { label: "Medicare.gov: Working past 65 and HSAs", href: working, topic: "working", takeaway: "Check the timing of your and your employer’s HSA contributions before applying. Premium-free Part A can start retroactively. Confirm your dates with Social Security and ask payroll about contributions." },
  "work-drug": { label: "CMS: Creditable drug coverage", href: "https://www.cms.gov/medicare/employers-plan-sponsors/creditable-coverage", topic: "working", takeaway: "Ask the benefits team for the current written notice saying whether the work plan’s drug coverage is creditable for Medicare. Keep a copy for your records." },
  "work-cobra": { label: "Medicare.gov: Working past 65", href: working, topic: "working", takeaway: "COBRA and retiree coverage are different from health coverage through a current job. Check your Part B timing with Social Security before relying on either to delay enrolling." },
  "work-form": { label: "CMS: Request for Employment Information (CMS-L564)", href: "https://www.cms.gov/cms-l564-request-employment-information", topic: "working", takeaway: "If you’re applying for Part B based on current employment, ask the employer whether they can confirm your coverage dates and complete Section B of CMS-L564 if Social Security needs it." },
  "part-b": { label: "Social Security: Sign up for Part B", href: "https://www.ssa.gov/medicare/sign-up/part-b-only", topic: "working", takeaway: "Social Security explains how to apply for Part B when employer group coverage ends and which documents you may need. Check your dates before making a coverage change." },
  "turning-start": { label: "Vital Edge: Turning 65 guide", href: "/turning-65-medicare", topic: "turning", takeaway: "Start by checking whether your Medicare enrollment will be automatic or whether you need to sign up. If you have coverage through a current job, ask your benefits team how it works with Medicare." },
  "turning-timing": { label: "Medicare.gov: When can I sign up?", href: "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare", topic: "turning", takeaway: "Medicare.gov explains the Initial Enrollment Period and other times you may be able to sign up. Social Security can help confirm which dates apply to you." },
  "medicare-parts": { label: "Medicare.gov: Medicare basics", href: basics, topic: "basics", takeaway: "Part A is hospital insurance, Part B is medical insurance, and Part D is Medicare drug coverage. Medicare.gov explains how the parts fit together." },
  "compare": { label: "Vital Edge: Compare plans online", href: "/enroll", topic: "review", takeaway: "You can browse the available plans online without scheduling a call. We do not offer every plan available in your area. You can also visit Medicare.gov or call 1-800-MEDICARE to learn about all your options." },
  "client-support": { label: "Vital Edge: Contact", href: "/contact", topic: "client", takeaway: "For a claim or replacement ID card, use the member services number on your plan materials. For help from Patrick, use the call or callback options below." },
  "dental": { label: "Vital Edge: Dental, Vision & More", href: "/ancillary", topic: "dental", takeaway: "The dental, vision, and hearing page explains the types of coverage. To verify a benefit on your current plan, check with your plan or talk to Patrick." },
} satisfies Record<string, PublicSource>;

export type GuideSourceId = keyof typeof publicGuideSources;
export function isGuideSourceId(value: unknown): value is GuideSourceId {
  return typeof value === "string" && Object.hasOwn(publicGuideSources, value);
}
export function guideSourceIds(value: unknown): GuideSourceId[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(isGuideSourceId))].slice(0, 3);
}
