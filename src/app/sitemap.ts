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

  return [
    ...routes.map((route) => ({
      url: `${base}/${route}`.replace(/\/$/, ""),
    })),
    ...resourcePageSlugs.map((slug) => ({
      url: `${base}/${slug}`,
    })),
  ];
}
