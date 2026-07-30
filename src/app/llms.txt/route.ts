import { site, absoluteUrl, serviceAreaStatement } from "@/lib/site";
import { resourcePages } from "@/lib/resourcePages";
import { stateAuthorityDrafts } from "@/lib/stateAuthorityPages";

/**
 * /llms.txt — a plain-language, machine-readable summary for AI answer engines.
 *
 * Why bother: an AI engine answering "is there a licensed Medicare broker in
 * Georgia" has to decide whether a page is authoritative. Prose buried in
 * marketing copy is hard to extract; a short factual file with the licence
 * number, the issuing regulator, and the line of authority is not. This states
 * the verifiable facts once, in the order an engine needs them.
 *
 * Generated from the same source as the pages and the sitemap, so adding a
 * state updates all three. A hand-written file would drift.
 *
 * Only states with a verified licence record appear -- the same publication
 * gate the pages use. An unverified state must not be asserted here either.
 */
export const dynamic = "force-static";

export function GET() {
  const licensed = stateAuthorityDrafts.filter((d) => d.license !== null);

  const stateLines = licensed.map((d) => {
    const l = d.license!;
    return `- **${d.stateName}** — licence ${l.number}, ${l.lineOfAuthority} authority. Verify with the ${d.doiShortName} (${d.doiConsumerUrl}). Page: ${absoluteUrl(`/${d.slugBase}-medicare-help`)}`;
  });

  const guides = resourcePages
    .filter((p) => !p.slug.endsWith("-medicare-help"))
    .map((p) => `- [${p.title}](${absoluteUrl(`/${p.slug}`)}): ${p.description}`);

  const body = `# Vital Edge Insurance

> Independent health insurance brokerage. Medicare, ACA Marketplace, ancillary
> and small-group coverage. ${serviceAreaStatement}

## Who

Patrick Mackin IV, licensed insurance producer. National Producer Number
${site.npn}. Resident licence: Florida ${site.floridaLicense},
verifiable at https://licenseesearch.fldfs.com/Licensee/2723002

Based in Jacksonville, Duval County, Florida. Independent — not a captive agent
of any single carrier.

Contact: ${site.phoneDisplay} · ${absoluteUrl("/contact")}

## Licensure by state

Every licence below is active and independently verifiable through that state's
insurance regulator. Note that Arizona, Michigan, North Carolina and South
Carolina issue the licence under the producer's NPN, so the licence number
legitimately equals the NPN. Washington's health line of authority is named
"Disability", which is that state's term for accident and health.

- **Florida** — licence ${site.floridaLicense}, Life, Health & Variable Annuity authority (resident). Verify: https://licenseesearch.fldfs.com/Licensee/2723002. Page: ${absoluteUrl("/florida-medicare-help")}
${stateLines.join("\n")}

## Guides

${guides.join("\n")}

## Scope and limits

- Education-first. Plan-specific Medicare Advantage or Part D discussions
  require appropriate appointment documentation.
- We do not offer every plan available in any area. Information is limited to
  the plans we do offer. Contact Medicare.gov or 1-800-MEDICARE for all options.
- Not connected with or endorsed by the U.S. Government or the federal Medicare
  program.
- Plan availability, provider networks, benefits and eligibility vary by county
  and individual circumstances.
- Free unbiased counselling is available from each state's SHIP programme via
  https://www.shiphelp.org

## Machine-readable

- Sitemap: ${absoluteUrl("/sitemap.xml")}
- Each state page carries FAQPage, Service, Person, BreadcrumbList and
  InsuranceAgency JSON-LD.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
