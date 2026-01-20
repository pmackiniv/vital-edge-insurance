export const site = {
  name: "Vital Edge Insurance",
  legalName: "Vital Edge Insurance",
  domain: "vital-edge-insurance.vercel.app",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phoneDisplay: "(352) 214-8879",
  phoneE164: "+13522148879",
  email: "pmackiniv27@icloud.com",
  address: {
    streetAddress: "Jacksonville, FL",
    addressLocality: "Jacksonville",
    addressRegion: "FL",
    postalCode: "32200",
    addressCountry: "US",
  },
  serviceAreas: ["Jacksonville, FL", "Duval County, FL", "St. Johns County, FL"],
  sameAs: [
    "https://www.linkedin.com/in/patrick-mackin-iv-297574187",
    "https://www.linkedin.com/company/vital-edge-insurance/",
  ],
  logoPath: "/logo.svg",
  ogImagePath: "/og-image.svg",
  primaryCta: {
    label: "Request help",
    href: "/contact",
  },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Enroll", href: "/enroll" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export function absoluteUrl(path = "/") {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || "";
  const fallback = "http://localhost:3000";
  const base = (explicit || vercelUrl || fallback).replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    url: site.siteUrl,
    email: site.email,
    telephone: site.phoneE164,
    sameAs: site.sameAs,
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.legalName,
    url: site.siteUrl,
    telephone: site.phoneE164,
    email: site.email,
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    address: {
      "@type": "PostalAddress",
      ...site.address,
    },
  };
}

export function insuranceAgencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/"),
    telephone: site.phoneE164,
    email: site.email,
    description:
      "Independent insurance guidance for individuals, families, and small businesses in Jacksonville, Florida and nearby counties.",
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      addressCountry: site.address.addressCountry,
    },
    sameAs: site.sameAs,
    logo: absoluteUrl(site.logoPath),
  };
}
