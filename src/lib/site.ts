export const site = {
  name: "Vital Edge Insurance",
  legalName: "Vital Edge Insurance",
  domain: "vital-edge-insurance.vercel.app",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phoneDisplay: "(352) 214-8879",
  phoneE164: "+13522148879",
  email: "pmackiniv27@icloud.com",
  address: {
    streetAddress: "11247 San Jose Blvd.",
    addressLocality: "Jacksonville",
    addressRegion: "FL",
    postalCode: "32223",
    addressCountry: "US",
  },
  serviceAreas: ["Jacksonville, FL", "Duval County, FL", "St. Johns County, FL", "Miami-Dade County, FL"],
  sameAs: [
    "https://www.linkedin.com/in/patrick-mackin-iv-297574187",
    "https://www.linkedin.com/company/vital-edge-insurance/",
    "https://www.facebook.com/pmackiniv",
    "https://www.instagram.com/pmackiniv/",
    "https://www.google.com/search?q=Vital+Edge+Insurance&stick=H4sIAAAAAAAA_-NgU1I1qEi0TDZOTUs1MzIwME4yT0uzMqgwSzE0sjA0NEpOSk5NMjEwWcQqEpZZkpij4JqSnqrgmVdcWpSYl5wKANLkHDxAAAAA&hl=en&mat=CW35JL1kTIqIElcBTVDHnqVfH-Wi1kZaybAAgEkbbguVbMIiOx3q7WK137Zlmt8PEjkzMjCVWgPbHAq2C2xH1w8p9BoEq0B1ljI2u_pt8FnNlaK60z23RCABICMr0GIQYIw&authuser=1",
  ],
  logoPath: "/brand/vital-edge-logo.png",
  ogImagePath: "/og-image.svg",
  primaryCta: {
    label: "Request help",
    href: "/contact",
  },
  /** Cal.com, Calendly, or other booking embed URL. Set NEXT_PUBLIC_SCHEDULE_URL in Vercel. */
  scheduleUrl: process.env.NEXT_PUBLIC_SCHEDULE_URL || "",
  nav: [
    { label: "Home", href: "/" },
    { label: "Medicare Advantage", href: "/medicare/ma-lead" },
    { label: "Medigap", href: "/medicare/medigap-lead" },
    { label: "ACA / ICHRA", href: "/aca" },
    { label: "Small Group", href: "/small-group" },
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
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry,
    },
    sameAs: site.sameAs,
    logo: absoluteUrl(site.logoPath),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Patrick Mackin IV",
    jobTitle: "Licensed Health Insurance Agent",
    worksFor: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      addressCountry: site.address.addressCountry,
    },
    telephone: site.phoneE164,
    email: site.email,
    url: absoluteUrl("/about"),
    sameAs: site.sameAs,
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: [
      "ACA Marketplace",
      "Medicare",
      "Medicare Supplement",
      "Medigap",
      "ICHRA",
      "Small Group Health Insurance",
      "Florida Health Insurance",
      "Health Insurance Compliance",
    ],
  };
}
