import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import {
  PremiumContentBand,
  PremiumDisclosure,
  PremiumFeatureGrid,
  PremiumInteriorHero,
} from "@/components/PremiumInteriorPage";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dental, Vision & Hospital Coverage | Vital Edge Insurance",
  description:
    "Ancillary coverage guidance for dental, vision, hearing, hospital indemnity, and related options. Licensed-agent follow-up from Vital Edge Insurance.",
  alternates: {
    canonical: absoluteUrl("/ancillary"),
  },
};

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Ancillary Coverage"
        title="Dental, Vision & Hospital Coverage"
        subtitle="A polished, practical review of supplemental coverage options that can support your broader health insurance strategy."
        actions={[
          { label: "Explore Coverage Categories", href: "#dental-vision-hearing", kind: "gold" },
          { label: "Request Ancillary Guidance", href: "/contact?topic=ancillary", kind: "primary" },
          { label: "Request a Call", href: "/contact", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Ancillary product availability, benefits, limitations, exclusions, underwriting, carrier appointment, and
          pricing vary by state, ZIP code, age, and carrier. This website provides education and intake only.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <div id="dental-vision-hearing" className="scroll-mt-28">
            <PremiumFeatureGrid
            features={[
              {
                title: "Dental, Vision & Hearing",
                body: "Understand how common supplemental benefits can fit alongside Medicare, ACA, or other health coverage.",
              },
              {
                title: "Hospital Indemnity",
                body: "Review general concepts for hospital-related cash benefits, waiting periods, exclusions, and limitations.",
              },
              {
                title: "Licensed Human Handoff",
                body: "Vital Edge routes inquiries to a licensed agent for carrier-specific details and next steps.",
              },
            ]}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <PremiumContentBand title="Coverage that supports the bigger picture" tone="teal">
              <p>
                Ancillary coverage can help address gaps that major medical coverage may not fully solve. The right
                conversation starts with budget, existing coverage, household needs, and the benefit categories that
                matter most.
              </p>
            </PremiumContentBand>
            <PremiumContentBand title="No Pressure. Clear Guidance.">
              <p>
                We keep the process simple: ask what you want help with, avoid sensitive identifiers in web intake, and
                hand off to a licensed agent for carrier-specific details.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact?topic=ancillary" className="premium-small-button premium-small-button-primary">
                  Request Ancillary Guidance
                </Link>
                <Link href="/medicare" className="premium-small-button premium-small-button-light">
                  Medicare Guidance
                </Link>
              </div>
            </PremiumContentBand>
          </div>

          <LeadCtaSection
            eyebrow="Ancillary coverage"
            title="Review dental, vision, hearing, and hospital coverage options."
            description={`A licensed agent can help you understand available options. You can also call ${site.phoneDisplay}.`}
            ctaLabel="Request ancillary guidance"
          />
        </div>
      </Container>
    </>
  );
}
