import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "about",
  "aca",
  "aca/sep",
  "blog",
  "chat",
  "contact",
  "duval-county",
  "enroll",
  "ichra",
  "medicare",
  "medicare/medigap",
  "medicare/snp",
  "miami",
  "off-exchange",
  "privacy",
  "resources",
  "services",
  "small-group",
  "st-johns-county",
  "thank-you",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl.replace(/\/$/, "");
  const now = new Date();

  return routes.map((route) => ({
    url: `${base}/${route}`.replace(/\/$/, ""),
    lastModified: now,
  }));
}
