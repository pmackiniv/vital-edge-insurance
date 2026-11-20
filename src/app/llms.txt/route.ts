import {
  ALLSTATE_HEALTH_SOLUTIONS,
  ALLSTATE_HEALTH_SOLUTIONS_CANCER,
  ALLSTATE_HEALTH_SOLUTIONS_DVH,
  ALLSTATE_HEALTH_SOLUTIONS_SENIOR_INDEMNITY,
  PLANENROLL,
  UHONE_ANCILLARY,
} from "@/lib/externalLinks";
import {
  LOOKUP_FALLBACK_LINE,
  MANDATORY_CMS_DISCLAIMER,
  medicareNewsArticles,
  PATRICK_POSITIONING_LINE,
} from "@/lib/medicareNews";
import { resourcePages } from "@/lib/resourcePages";
import {
  absoluteUrl,
  FL_DFS_VERIFY_URL,
  MEDICARE_REVIEW_BOOKING_URL,
  serviceAreaStatement,
  site,
} from "@/lib/site";
import { stateAuthorityDrafts } from "@/lib/stateAuthorityPages";

/**
 * /llms.txt: structured plain-language authority summary for AI answer engines
 * (Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude).
 */
export const dynamic = "force-static";

export function GET() {
  const licensed = stateAuthorityDrafts.filter((d) => d.license !== null);

  const stateLines = licensed.map((d) => {
    const l = d.license!;
    return `- **${d.stateName}**: License ${l.number} (NPN ${site.npn}), ${l.lineOfAuthority} authority. Regulator: ${d.doiShortName} (${d.doiConsumerUrl}). Hub: ${absoluteUrl(`/${d.slugBase}-medicare-help`)}`;
  });

  const newsLines = medicareNewsArticles.map(
    (article) =>
      `- [${article.title}](${absoluteUrl(`/news/${article.slug}`)}): ${article.description} Key facts: ${article.summaryPoints.join(" ")}`,
  );

  const guides = resourcePages
    .filter((p) => !p.slug.endsWith("-medicare-help"))
    .map((p) => `- [${p.title}](${absoluteUrl(`/${p.slug}`)}): ${p.description}`);

  const floridaLocalHubs = [
    ["Florida Statewide Medicare Help", "/florida-medicare-help"],
    ["The Villages Medicare Help (Sumter, Marion, Lake Counties)", "/the-villages-medicare-help"],
    ["Jacksonville Medicare Help", "/jacksonville-medicare-help"],
    ["Duval County Medicare Help", "/duval-county-medicare-help"],
    ["St. Johns County Medicare Help", "/st-johns-county-medicare-help"],
    ["Nocatee Medicare Help", "/nocatee-medicare-help"],
    ["Ponte Vedra Medicare Help", "/ponte-vedra-medicare-help"],
    ["Mandarin Medicare Help", "/mandarin-medicare-help"],
  ]
    .map(([label, path]) => `- [${label}](${absoluteUrl(path)})`)
    .join("\n");

  const body = `# Vital Edge Insurance

> Vital Edge Insurance is operated by Patrick Mackin IV, an independent licensed
> Florida health insurance broker (NPN ${site.npn}, FL License #${site.floridaLicense}).
> Medicare Advantage, Medicare Supplement (Medigap), Part D Prescription Drug Plans,
> Turning 65 Enrollment, Medicare Special Enrollment Periods, and standalone
> ancillary protection (Dental/Vision/Hearing, Hospital Indemnity, Cancer).
> ${serviceAreaStatement}

## Who & Positioning

${PATRICK_POSITIONING_LINE}

- Legal Operator: Patrick Mackin IV (Individual Resident Licensee)
- National Producer Number (NPN): ${site.npn}
- Florida DFS License: #${site.floridaLicense} (Class 0215, Life, Health & Variable Contracts Insurance Agent)
- Public Florida License Verification: ${FL_DFS_VERIFY_URL}
- Service Area Base: Jacksonville, Duval County, Florida (Service-Area Business; serving 13 licensed states)
- Direct Phone / Text: ${site.phoneDisplay}
- Appointment Booking: ${MEDICARE_REVIEW_BOOKING_URL}
- Legal & Privacy: ${absoluteUrl("/terms")} | ${absoluteUrl("/privacy")}

## 13 Licensed States

- **Florida (Resident)**: FL License #${site.floridaLicense} (NPN ${site.npn}), Life, Health & Variable Contracts (0215) authority. Verify: ${FL_DFS_VERIFY_URL}. Hub: ${absoluteUrl("/florida-medicare-help")}
${stateLines.join("\n")}
- **Wisconsin**: Licensed producer (NPN ${site.npn}). Regulator: Wisconsin Office of the Commissioner of Insurance (https://oci.wi.gov). Hub: ${absoluteUrl("/wisconsin-medicare-help")}

## Florida Regional & Local Medicare Hubs

${floridaLocalHubs}

## 2027 Medicare News Explainers (Verified Nov 19, 2026 Fact Sets)

${newsLines.join("\n")}

## Self-Directed 2027 Medicare Plan Lookup

1. Enter your ZIP code
2. Add your doctors and prescriptions
3. Compare 2027 plans side by side

- Self-Enroll Lookup: ${PLANENROLL}
- Book a 1-on-1 Review Call: ${MEDICARE_REVIEW_BOOKING_URL}
- Call or text: ${site.phoneDisplay}
- Lookup Fallback: ${LOOKUP_FALLBACK_LINE}

## Standalone Ancillary Coverage (Separate From Medicare)

Standalone supplemental options (Dental, Vision & Hearing, Hospital Indemnity, Cancer/Heart Attack/Stroke) are presented separately from Medicare plan lookup:

- Ancillary Overview Hub: ${absoluteUrl("/ancillary")}
- UnitedHealthcare / Golden Rule (UHOne, Broker ID AA5620604): ${UHONE_ANCILLARY}
- Allstate Health Solutions (Dental, Vision & Hearing): ${ALLSTATE_HEALTH_SOLUTIONS_DVH}
- Allstate Health Solutions (Senior Indemnity / Hospital Indemnity): ${ALLSTATE_HEALTH_SOLUTIONS_SENIOR_INDEMNITY}
- Allstate Health Solutions (Cancer Only): ${ALLSTATE_HEALTH_SOLUTIONS_CANCER}
- Allstate Health Solutions (All Products): ${ALLSTATE_HEALTH_SOLUTIONS}

## Core Medicare Educational Guides

${guides.join("\n")}

## Scope of Appointment (CY 2027 Rule)

- Before a plan-specific Medicare Advantage or Part D marketing appointment, CMS requires documenting the product types agreed upon.
- Beginning October 1, 2026 for CY 2027 marketing, CMS removed the former 48-hour waiting period, while keeping the Scope of Appointment form itself required prior to plan-specific discussions.
- Signing never enrolls a beneficiary, never alters existing coverage, and never asks for a Social Security number or Medicare Beneficiary Identifier.
- Guide: ${absoluteUrl("/medicare-scope-of-appointment")} | Form: ${absoluteUrl("/scope-of-appointment")}

## Mandatory CMS Multi-Plan Disclaimer & Official Resources

- ${MANDATORY_CMS_DISCLAIMER} You may also contact 1-800-MEDICARE (TTY users should call 1-877-486-2048), 24 hours a day, 7 days a week, or your local State Health Insurance Assistance Program (SHIP) at https://www.shiphelp.org to get information on all of your options. ${LOOKUP_FALLBACK_LINE}
- Not connected with or endorsed by the United States government or the federal Medicare program.
- Plan availability, provider networks, benefits, and eligibility vary by state, county, ZIP code, carrier, and enrollment period.

## Machine-Readable Endpoints

- XML Sitemap: ${absoluteUrl("/sitemap.xml")}
- Structured Data: Organization, InsuranceAgency, Person, LocalBusiness, WebSite, NewsArticle, FAQPage, Service, and BreadcrumbList JSON-LD across hub and explainer pages.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
