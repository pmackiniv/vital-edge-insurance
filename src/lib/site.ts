export const site = {
  name: "Vital Edge Insurance",
  legalName: "Vital Edge Insurance",
  domain: "vital-edge-insurance.vercel.app",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phoneDisplay: "(904) 000-0000",
  phoneE164: "+19040000000",
  email: "help@vitaledgeinsurance.com",
  address: {
    streetAddress: "Jacksonville, FL",
    addressLocality: "Jacksonville",
    addressRegion: "FL",
    postalCode: "32200",
    addressCountry: "US",
  },
  serviceAreas: ["Duval County, FL", "St. Johns County, FL"],
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
  const base = site.siteUrl.replace(/\/$/, "");
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
    sameAs: [],
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
