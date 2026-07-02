import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/googleBusinessProfile";

export type SiteNavItem = {
  label: string;
  href: string;
};

export type SiteMainNavItem = {
  label: string;
  href?: string;
  children?: SiteNavItem[];
};

const PRODUCTION_SITE_URL = "https://www.vital-edge-insurance.com";
const LEGACY_SITE_URLS = new Set(["https://vital-edge-insurance.vercel.app"]);

function normalizePublicSiteUrl(value?: string) {
  if (!value || !value.startsWith("http")) return "";

  const normalized = value.replace(/\/$/, "");
  if (LEGACY_SITE_URLS.has(normalized)) return "";

  return normalized;
}

export const site = {
  name: "Vital Edge Insurance",
  legalName: "Vital Edge Insurance",
  domain: "www.vital-edge-insurance.com",
  siteUrl: normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) || PRODUCTION_SITE_URL,
  npn: "21729046",
  floridaLicense: "G275791",
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
  serviceAreas: [
    "Florida",
    "Georgia",
    "South Carolina",
    "North Carolina",
    "Texas",
    "Tennessee",
    "Arizona",
    "Washington",
    "Pennsylvania",
    "Ohio",
    "Michigan",
    "Louisiana",
    "Jacksonville, FL",
    "Duval County, FL",
    "St. Johns County, FL",
    "Miami-Dade County, FL",
  ],
  sameAs: [
    "https://www.linkedin.com/in/patrick-mackin-iv-297574187",
    "https://www.linkedin.com/company/vital-edge-insurance/",
    GOOGLE_BUSINESS_PROFILE_URL,
  ],
  logoPath: "/brand/vital-edge-logo.png",
  ogImagePath: "/og-image.svg",
  primaryCta: {
    label: "Request a Call",
    href: "/contact",
  },
  /** Cal.com, Calendly, or other booking embed URL. Set NEXT_PUBLIC_SCHEDULE_URL in Vercel. */
  scheduleUrl: process.env.NEXT_PUBLIC_SCHEDULE_URL || "",
  nav: [
    { label: "Home", href: "/" },
    { label: "Medicare Advantage", href: "/medicare/medicare-advantage-request" },
    { label: "Medigap", href: "/medicare/medigap-request" },
    { label: "ACA / ICHRA", href: "/aca" },
    { label: "Ancillary", href: "/ancillary" },
    { label: "Small Group", href: "/small-group" },
    { label: "Contact", href: "/contact" },
  ] as SiteNavItem[],
  mainNav: [
    {
      label: "Medicare",
      href: "/medicare",
      children: [
        { label: "Medicare Overview", href: "/medicare" },
        { label: "Medicare 101", href: "/medicare-101" },
        { label: "Turning 65", href: "/turning-65-medicare" },
        { label: "Still Working Past 65", href: "/medicare-still-working" },
        { label: "Extra Help / LIS", href: "/medicare-extra-help-lis" },
        { label: "Medicare and Medicaid", href: "/medicare-and-medicaid" },
        { label: "D-SNP Education", href: "/medicare/d-snp" },
        { label: "C-SNP Education", href: "/medicare/c-snp" },
        { label: "C-SNP & D-SNP", href: "/medicare/snp" },
        { label: "Medicare Advantage Request", href: "/medicare/medicare-advantage-request" },
        { label: "Medigap Request", href: "/medicare/medigap-request" },
        { label: "Enrollment Links", href: "/enroll" },
      ],
    },
    {
      label: "Health Insurance (ACA)",
      href: "/aca",
      children: [
        { label: "ACA Marketplace", href: "/aca" },
        { label: "Special Enrollment", href: "/aca/sep" },
        { label: "ICHRA", href: "/ichra" },
        { label: "Off-Exchange", href: "/off-exchange" },
        { label: "Small Group", href: "/small-group" },
      ],
    },
    {
      label: "Ancillary Coverage",
      href: "/ancillary",
      children: [
        { label: "Ancillary Overview", href: "/ancillary" },
        { label: "Dental, Vision & Hearing", href: "/ancillary" },
        { label: "Hospital Indemnity", href: "/ancillary" },
        { label: "Life Insurance", href: "/contact?topic=life-insurance" },
        { label: "Final Expense", href: "/contact?topic=final-expense" },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      children: [
        { label: "Resources", href: "/resources" },
        { label: "LinkedIn Medicare Resources", href: "/linkedin-medicare-resources" },
        { label: "Educational Events", href: "/medicare-educational-events" },
        { label: "Resource Tables", href: "/medicare-resource-tables" },
        { label: "Partner With Vital Edge", href: "/partner-with-vital-edge" },
        { label: "Blog", href: "/blog" },
        { label: "Referrals", href: "/referrals" },
        { label: "Licensed States", href: "/licensed-states" },
      ],
    },
    {
      label: "About",
      href: "/about",
      children: [
        { label: "About Vital Edge", href: "/about" },
        { label: "Helping a Family Member", href: "/family-help" },
        { label: "Duval County", href: "/duval-county" },
        { label: "St. Johns County", href: "/st-johns-county" },
        { label: "Miami-Dade", href: "/miami" },
        { label: "Schedule a Call", href: "/schedule" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ] as SiteMainNavItem[],
} as const;

export function absoluteUrl(path = "/") {
  const vercelUrl = normalizePublicSiteUrl(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const explicit = normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const fallback = process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : vercelUrl || "http://localhost:3000";
  const base = (explicit || fallback).replace(/\/$/, "");
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
    identifier: [
      { "@type": "PropertyValue", name: "National Producer Number", value: site.npn },
      { "@type": "PropertyValue", name: "Florida insurance license", value: site.floridaLicense },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneE164,
        email: site.email,
        contactType: "customer service",
        areaServed: site.serviceAreas,
        availableLanguage: "English",
      },
    ],
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
    identifier: [
      { "@type": "PropertyValue", name: "National Producer Number", value: site.npn },
      { "@type": "PropertyValue", name: "Florida insurance license", value: site.floridaLicense },
    ],
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
      "Independent health insurance guidance for Medicare, ACA Marketplace, ancillary coverage, and small group questions across Florida and additional licensed states.",
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
    identifier: [
      { "@type": "PropertyValue", name: "National Producer Number", value: site.npn },
      { "@type": "PropertyValue", name: "Florida insurance license", value: site.floridaLicense },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      email: site.email,
      contactType: "licensed insurance guidance",
      areaServed: site.serviceAreas,
      availableLanguage: "English",
    },
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
    identifier: [
      { "@type": "PropertyValue", name: "National Producer Number", value: site.npn },
      { "@type": "PropertyValue", name: "Florida insurance license", value: site.floridaLicense },
    ],
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: [
      "ACA Marketplace",
      "Medicare",
      "Medicare Supplement",
      "Medigap",
      "ICHRA",
      "Small Group Health Insurance",
      "Florida Health Insurance",
      "Georgia Health Insurance",
      "South Carolina Health Insurance",
      "North Carolina Health Insurance",
      "Texas Health Insurance",
      "Tennessee Health Insurance",
      "Arizona Health Insurance",
      "Washington Health Insurance",
      "Pennsylvania Health Insurance",
      "Ohio Health Insurance",
      "Michigan Health Insurance",
      "Louisiana Health Insurance",
      "Health Insurance Compliance",
    ],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl("/"),
    publisher: {
      "@type": "Organization",
      name: site.legalName,
    },
  };
}
