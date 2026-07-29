import Link from "next/link";
import { Container } from "@/components/Container";
import {
  PremiumCard,
  PremiumContentBand,
  PremiumDisclosure,
  PremiumFeatureGrid,
  PremiumInteriorHero,
  PremiumLinkGrid,
} from "@/components/PremiumInteriorPage";
import { absoluteUrl, site } from "@/lib/site";

type CountyLink = { label: string; href: string };

type CountyLandingTemplateProps = {
  countyName: string;
  canonicalPath: string;
  intro: string;
  details: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  neighboringCounties?: CountyLink[];
};

const coreServiceLinks: CountyLink[] = [
  { label: "ACA", href: "/aca" },
  { label: "Medicare", href: "/medicare" },
  { label: "ICHRA", href: "/ichra" },
  { label: "Off-Exchange", href: "/off-exchange" },
  { label: "Small Group", href: "/small-group" },
];

export function CountyLandingTemplate({
  countyName,
  canonicalPath,
  intro,
  details,
  neighboringCounties = [],
}: CountyLandingTemplateProps) {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${countyName} Insurance Guidance`,
    url: absoluteUrl(canonicalPath),
    description: intro,
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${countyName} Insurance Guidance`,
    serviceType: "Insurance Guidance",
    areaServed: countyName,
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(canonicalPath),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: countyName, item: absoluteUrl(canonicalPath) },
    ],
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Service Area"
        title={`${countyName} Guidance`}
        subtitle={intro}
        actions={[
          { label: "Request Guidance", href: "/contact", kind: "primary" },
          { label: "Medicare Guidance", href: "/medicare", kind: "gold" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Local service availability, product availability, carrier appointment, plan details, and enrollment timing can
          vary by state, county, ZIP code, and carrier.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumContentBand title={`Insurance guidance for ${countyName}`}>
            <div className="space-y-3">
              <p>{details}</p>
              <p>
                Vital Edge keeps the process education-first: clarify the coverage question, prepare the right details,
                and hand off to a licensed agent for plan-specific next steps.
              </p>
            </div>
          </PremiumContentBand>

          <PremiumFeatureGrid
            features={[
              {
                title: "Local routing",
                body: "Start with ZIP code, timing, current coverage, and the type of help needed.",
              },
              {
                title: "Coverage education",
                body: "Review Medicare, ACA, ancillary, employer, and off-exchange concepts without pressure.",
              },
              {
                title: "Licensed handoff",
                body: "Plan-specific conversations are handled with the right disclosures and licensed follow-up.",
              },
            ]}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <PremiumCard title="Core services" tone="soft">
              <PremiumLinkGrid links={coreServiceLinks} />
            </PremiumCard>
            <PremiumCard title={site.legalName} tone="teal">
              <p>
                {site.address.addressLocality}, {site.address.addressRegion}
              </p>
              <p className="mt-2">
                <a className="font-bold underline underline-offset-4" href={`tel:${site.phoneE164}`}>
                  {site.phoneDisplay}
                </a>
              </p>
              {neighboringCounties.length ? (
                <p className="mt-3">
                  Also serving{" "}
                  {neighboringCounties.map((county, index) => (
                    <span key={county.href}>
                      {index > 0 ? " and " : ""}
                      <Link className="font-bold underline underline-offset-4" href={county.href}>
                        {county.label}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </PremiumCard>
          </div>
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
