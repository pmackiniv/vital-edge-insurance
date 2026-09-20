import type { MetadataRoute } from "next";
import { resourcePageSlugs } from "@/lib/resourcePages";
import { site } from "@/lib/site";

const routes = [
  "",
  "about",
  "aca",
  "aca/sep",
  "ancillary",
  "contact",
  "duval-county",
  "enroll",
  "family-help",
  "ichra",
  "licensed-states",
  "medicare",
  "medicare/medicare-advantage-request",
  "medicare/c-snp",
  "medicare/d-snp",
  "medicare/medigap",
  "medicare/medigap-request",
  "medicare/snp",
  "miami",
  "off-exchange",
  "privacy",
  "referrals",
  "resources",
  "schedule",
  "services",
  "small-group",
  "st-johns-county",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl.replace(/\/$/, "");
  // Use actual content-update dates, not a new timestamp on every crawl.
  const updated: Record<string, string> = {
    "": "2026-09-20",
    enroll: "2026-09-20",
    schedule: "2026-09-20",
    "turning-65-medicare": "2026-09-15",
    "st-johns-county": "2026-09-15",
    "nocatee-medicare-help": "2026-09-15",
  };

  return [
    ...routes.map((route) => ({
      url: `${base}/${route}`.replace(/\/$/, ""),
      ...(updated[route] ? { lastModified: updated[route] } : {}),
    })),
    ...resourcePageSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      ...(updated[slug] ? { lastModified: updated[slug] } : {}),
    })),
  ];
}
