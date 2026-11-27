import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/googleBusinessProfile";
import { websiteScheduleUrl } from "@/lib/scheduling";

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

/**
 * Single source of truth for the booking destination. The ScheduleButton popup,
 * the /schedule embed, and any request page all point at the same event type,
 * so the 48-hour minimum-notice setting configured on it applies everywhere.
 */
export const MEDICARE_REVIEW_BOOKING_URL =
  "https://calendly.com/pmackiniv27/medicare-annual-review";
export const FL_DFS_VERIFY_URL = "https://licenseesearch.fldfs.com/Licensee/2723002";
const LEGACY_SITE_URLS = new Set(["https://vital-edge-insurance.vercel.app"]);
export const licensedStateNames = [
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
  "Wisconsin",
] as const;

export const serviceAreaStatement =
  "Headquartered in Florida. Serving clients across 13 licensed states and growing.";

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
    addressLocality: "Jacksonville",
    addressRegion: "FL",
    addressCountry: "US",
  },
  serviceAreas: [
    "Jacksonville, FL",
    "Duval County, FL",
    "St. Johns County, FL",
    "Nocatee, FL",
    "The Villages, FL",
    ...licensedStateNames,
  ],
  sameAs: [
    FL_DFS_VERIFY_URL,
    GOOGLE_BUSINESS_PROFILE_URL,
    MEDICARE_REVIEW_BOOKING_URL,
    "https://www.linkedin.com/in/patrick-mackin-iv-297574187",
    "https://www.linkedin.com/company/vital-edge-insurance/",
  ],
  logoPath: "/brand/vital-edge-logo.png",
  ogImagePath: "/og-image.svg",
  primaryCta: {
    label: "Request a Call",
    href: "/contact",
  },
  /**
   * Booking destination. NEXT_PUBLIC_SCHEDULE_URL still wins when set, so an
   * environment override keeps working; the constant is the fallback so
   * /schedule renders a real calendar instead of "not set up yet" when the
   * variable is absent.
   */
  scheduleUrl: websiteScheduleUrl(process.env.NEXT_PUBLIC_SCHEDULE_URL || MEDICARE_REVIEW_BOOKING_URL),
  nav: [
    { label: "Home", href: "/" },
    { label: "Medicare Advantage", href: "/medicare/medicare-advantage-request" },
    { label: "Medigap", href: "/medicare/medigap-request" },
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
        { label: "2027 Medicare News", href: "/news" },
        { label: "New to Medicare", href: "/turning-65-medicare" },
        { label: "Medicare Advantage", href: "/medicare/medicare-advantage-request" },
        { label: "Medigap", href: "/medicare/medigap" },
        { label: "Part D", href: "/resources#part-d-basics" },
        { label: "Special Needs Plans", href: "/medicare/snp" },
        { label: "D-SNP", href: "/medicare/d-snp" },
        { label: "C-SNP", href: "/medicare/c-snp" },
      ],
    },
    {
      label: "Dental, Vision & More",
      href: "/ancillary",
      children: [
        { label: "Ancillary Overview", href: "/ancillary" },
        { label: "Dental/Vision/Hearing", href: "/ancillary#dental-vision-hearing" },
        { label: "Hospital Indemnity", href: "/ancillary" },
        { label: "Request Help Comparing Options", href: "/contact?topic=ancillary" },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      children: [
        { label: "Resource Hub", href: "/resources" },
        { label: "2027 Medicare News", href: "/news" },
        { label: "Medicare Coverage Pathways", href: "/resources#medicare-coverage-pathways" },
        { label: "What to Bring", href: "/resources#what-to-bring" },
        { label: "Prescription Savings", href: "/resources#prescription-savings-basics" },
        { label: "Referral Information", href: "/referrals" },
      ],
    },
    {
      label: "About",
      href: "/about",
      children: [
        { label: "About Vital Edge", href: "/about" },
        { label: "Licensed States", href: "/licensed-states" },
        { label: "Contact", href: "/contact" },
        { label: "Request a Call", href: "/contact" },
      ],
    },
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
  };
}

const CORE_KNOWS_ABOUT = [
  "Medicare Advantage",
  "Medicare Supplement / Medigap",
  "Part D Prescription Drug Plans",
  "Turning 65 Enrollment",
  "Medicare Special Enrollment Periods",
  "Hospital Indemnity",
  "Dental Vision and Hearing",
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
  "Wisconsin Health Insurance",
  "Health Insurance Compliance",
];

const LICENSE_IDENTIFIERS = [
  { "@type": "PropertyValue", name: "National Producer Number", value: "NPN 21729046" },
  { "@type": "PropertyValue", name: "Florida DFS License", value: "FL License #G275791" },
];

export function insuranceAgencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/"),
    telephone: site.phoneE164,
    email: site.email,
    description:
      "Vital Edge Insurance is operated by Patrick Mackin IV, an independent licensed Florida health insurance broker (NPN 21729046, FL License #G275791) offering Medicare Advantage, Medigap, Part D, ancillary coverage, and small group guidance across Florida and 12 additional licensed states.",
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: site.sameAs,
    logo: absoluteUrl(site.logoPath),
    identifier: LICENSE_IDENTIFIERS,
    knowsAbout: CORE_KNOWS_ABOUT,
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
    jobTitle: "Independent Licensed Florida Health Insurance Broker",
    worksFor: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    telephone: site.phoneE164,
    email: site.email,
    url: absoluteUrl("/about"),
    sameAs: site.sameAs,
    identifier: LICENSE_IDENTIFIERS,
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: CORE_KNOWS_ABOUT,
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
