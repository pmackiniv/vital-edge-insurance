import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { resourcePageSlugs } from "@/lib/resourcePages";
import { site } from "@/lib/site";

const routes = [
  "",
  "about",
  "aca",
  "aca/sep",
  "ancillary",
  "blog",
  "chat",
  "contact",
  "duval-county",
  "enroll",
  "family-help",
  "ichra",
  "licensed-states",
  "medicare",
  "medicare/c-snp",
  "medicare/d-snp",
  "medicare/medigap",
  "medicare/snp",
  "miami",
  "off-exchange",
  "privacy",
  "referrals",
  "resources",
  "services",
  "small-group",
  "st-johns-county",
  "thank-you",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl.replace(/\/$/, "");
  const now = new Date();

  return [
    ...routes.map((route) => ({
      url: `${base}/${route}`.replace(/\/$/, ""),
      lastModified: now,
    })),
    ...resourcePageSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: now,
    })),
  ];
}
