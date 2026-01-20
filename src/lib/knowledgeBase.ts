export type ResourceItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

export const resources: ResourceItem[] = [
  {
    slug: "new-to-medicare",
    title: "New to Medicare",
    summary: "Primer on Medicare parts, enrollment windows, and what to prepare.",
    tags: ["medicare"],
  },
  {
    slug: "medicare-advantage-vs-medigap",
    title: "Medicare Advantage vs Medigap",
    summary: "High-level differences between Advantage and Medigap coverage.",
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
    summary: "How premium tax credits are determined and what to expect.",
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
