export type ResourceItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  href?: string;
};

export const resources: ResourceItem[] = [
  {
    slug: "medicare-101",
    title: "Medicare 101 Education",
    summary: "Plain-language guide to Original Medicare, Medicare Advantage, Medigap, Part D, networks, prescriptions, and pharmacies.",
    tags: ["medicare"],
    href: "/medicare-101",
  },
  {
    slug: "turning-65-medicare",
    title: "Turning 65 Medicare Timeline",
    summary: "A practical Medicare timing checklist for people approaching 65.",
    tags: ["medicare"],
    href: "/turning-65-medicare",
  },
  {
    slug: "medicare-still-working",
    title: "Medicare when still working",
    summary: "Employer coverage, Part B timing, and creditable coverage review for workers past 65.",
    tags: ["medicare", "group"],
    href: "/medicare-still-working",
  },
  {
    slug: "medicare-extra-help-lis",
    title: "Extra Help and LIS",
    summary: "Consumer-friendly education about Medicare Extra Help without eligibility promises.",
    tags: ["medicare", "prescriptions"],
    href: "/medicare-extra-help-lis",
  },
  {
    slug: "medicare-and-medicaid",
    title: "Medicare and Medicaid",
    summary: "Education for people who may have both Medicare and Medicaid.",
    tags: ["medicare"],
    href: "/medicare-and-medicaid",
  },
  {
    slug: "new-to-medicare",
    title: "New to Medicare",
    summary: "Primer on Medicare parts, enrollment windows, and what to prepare.",
    tags: ["medicare"],
  },
  {
    slug: "medicare-coverage-pathways",
    title: "Medicare coverage pathways",
    summary: "Client-friendly overview of Original Medicare, Medicare Advantage, Medigap, Part D, provider access, prescriptions, cost exposure, and county-specific availability.",
    tags: ["medicare", "medigap"],
  },
  {
    slug: "part-d-basics",
    title: "Part D basics",
    summary: "Overview of Part D prescription coverage and timing.",
    tags: ["medicare", "prescriptions"],
  },
  {
    slug: "aca-subsidies-overview",
    title: "ACA subsidies overview",
    summary: "Education on premium tax credits, income estimates, household size, reporting changes, Special Enrollment Periods, and Marketplace source links.",
    tags: ["aca"],
  },
  {
    slug: "marketplace-sep-checklist",
    title: "Marketplace SEP checklist",
    summary: "Life events that can trigger a Special Enrollment Period.",
    tags: ["aca"],
  },
  {
    slug: "small-group-basics",
    title: "Small group basics",
    summary: "Overview of small group health coverage decisions.",
    tags: ["group"],
  },
  {
    slug: "ichra-explainer",
    title: "ICHRA explainer",
    summary: "Understanding ICHRA structures for employers and teams.",
    tags: ["ichra", "group"],
  },
  {
    slug: "off-exchange-vs-marketplace",
    title: "Off-exchange vs marketplace",
    summary: "When off-exchange plans may be considered.",
    tags: ["off-exchange"],
  },
  {
    slug: "prescription-savings-basics",
    title: "Prescription savings basics",
    summary: "Ways to think about prescription costs and savings programs.",
    tags: ["medicare", "aca", "prescriptions"],
  },
  {
    slug: "what-to-bring",
    title: "What to bring to an appointment",
    summary: "Checklist of information to have ready before a discussion.",
    tags: ["aca", "medicare", "group"],
  },
];

export function resourcesForTopic(topic: string) {
  const normalized = topic.toLowerCase();
  if (!normalized) return resources.slice(0, 3);

  if (normalized.includes("medicare")) {
    return resources.filter((item) => item.tags.includes("medicare")).slice(0, 4);
  }
  if (normalized.includes("medigap")) {
    return resources.filter((item) => item.tags.includes("medigap")).slice(0, 4);
  }
  if (normalized.includes("aca")) {
    return resources.filter((item) => item.tags.includes("aca")).slice(0, 4);
  }
  if (normalized.includes("group") || normalized.includes("small")) {
    return resources.filter((item) => item.tags.includes("group")).slice(0, 4);
  }
  if (normalized.includes("ichra")) {
    return resources.filter((item) => item.tags.includes("ichra")).slice(0, 4);
  }
  if (normalized.includes("off")) {
    return resources.filter((item) => item.tags.includes("off-exchange")).slice(0, 4);
  }

  return resources.slice(0, 3);
}
