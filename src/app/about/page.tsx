import type { Metadata } from "next";
import { Container } from "@/components/Container";
import {
  PremiumCard,
  PremiumContentBand,
  PremiumDisclosure,
  PremiumInteriorHero,
  PremiumLinkGrid,
} from "@/components/PremiumInteriorPage";
import { LINKEDIN_PERSONAL } from "@/lib/externalLinks";
import { absoluteUrl, serviceAreaStatement, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Vital Edge Insurance",
  description:
    `Vital Edge Insurance is headquartered in Florida and serves clients across 12 states and growing with independent guidance for ACA, Medicare, ancillary, and small business health insurance.`,
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About Vital Edge Insurance",
    description:
      "Licensed health insurance guidance with Florida headquarters and a 12-state approved service footprint.",
    url: absoluteUrl("/about"),
  },
};

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Vital Edge Insurance",
    url: absoluteUrl("/about"),
    description:
      `Learn about Vital Edge Insurance. ${serviceAreaStatement}`,
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="About Vital Edge"
        title="Guidance with Integrity"
        subtitle="Independent health insurance education, privacy-safe intake, and licensed human follow-up for individuals, families, and small businesses."
        actions={[
          { label: "Request a Call", href: "/contact", kind: "primary" },
          { label: "Explore Services", href: "/services", kind: "gold" },
          { label: "Connect on LinkedIn", href: LINKEDIN_PERSONAL, kind: "light", external: true },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Vital Edge Insurance is an independent insurance guidance business. Online content is education only and does
          not replace licensed plan-specific guidance.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumContentBand title="A clear, client-first process">
            <div className="space-y-3">
              <p>
                Vital Edge Insurance provides independent insurance guidance for individuals, families, and small
                businesses. {serviceAreaStatement}
              </p>
              <p>
                We focus on education, compliant routing, and practical next steps. We are not a medical clinic or
                healthcare provider.
              </p>
            </div>
          </PremiumContentBand>

          <div className="grid gap-5 md:grid-cols-2">
            <PremiumCard title="Not affiliated">
              <p>
                Vital Edge Insurance is an independent insurance guidance business and is not affiliated with any
                similarly named healthcare clinic.
              </p>
            </PremiumCard>
            <PremiumCard title="Explore services" tone="soft">
              <PremiumLinkGrid
                links={[
                  { label: "Services", href: "/services" },
                  { label: "ACA", href: "/aca" },
                  { label: "Medicare", href: "/medicare" },
                  { label: "ICHRA", href: "/ichra" },
                  { label: "Contact", href: "/contact" },
                ]}
              />
            </PremiumCard>
          </div>

          <PremiumCard title="Serving">
            <p>
              {serviceAreaStatement} Product availability, carrier appointment, county, ZIP code, eligibility, and
              enrollment timing still need to be confirmed before plan-specific guidance.
            </p>
          </PremiumCard>
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
