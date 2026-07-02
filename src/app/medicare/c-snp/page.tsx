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
import { PLANENROLL } from "@/lib/externalLinks";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "C-SNP Education | Vital Edge Insurance",
  description:
    "Education-first C-SNP guidance for chronic condition Special Needs Plan concepts, timing, and licensed review preparation.",
  alternates: {
    canonical: absoluteUrl("/medicare/c-snp"),
  },
};

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Chronic Condition Special Needs Plan Education"
        title="C-SNP Guidance"
        subtitle="Learn general C-SNP concepts for certain chronic conditions and what to prepare before any plan-specific licensed review."
        actions={[
          { label: "Start My Review", href: PLANENROLL, kind: "primary", external: true },
          { label: "Request a Call", href: "/contact?topic=c-snp", kind: "gold" },
          { label: "D-SNP Education", href: "/medicare/d-snp", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          C-SNP availability and eligibility vary by county, qualifying condition, carrier appointment, plan rules,
          network, and enrollment period. This page is educational and does not recommend a plan.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumFeatureGrid
            features={[
              {
                title: "Condition-Based Concepts",
                body: "C-SNPs are designed around certain chronic conditions. Eligibility and plan fit require licensed review.",
              },
              {
                title: "Provider Fit Matters",
                body: "Provider networks, specialists, prescriptions, and pharmacies should be checked against any specific plan.",
              },
              {
                title: "Compliant Handoff",
                body: "Vital Edge starts with education and routes plan-specific conversations to a licensed human agent.",
              },
            ]}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <PremiumContentBand title="What to prepare" tone="teal">
              <ul className="space-y-2">
                <li>County of residence and preferred contact method.</li>
                <li>Current Medicare coverage information.</li>
                <li>General condition category or recent plan notice if relevant.</li>
                <li>Preferred specialists, prescriptions, pharmacies, and care priorities.</li>
              </ul>
            </PremiumContentBand>
            <PremiumContentBand title="No autonomous recommendations">
              <p>
                This website does not diagnose, confirm eligibility, or recommend plans. It helps you understand the
                process and request a licensed-agent follow-up with the right preparation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="premium-small-button premium-small-button-primary" href="/contact?topic=c-snp">
                  Request C-SNP Guidance
                </Link>
                <Link className="premium-small-button premium-small-button-light" href="/medicare/snp">
                  C-SNP &amp; D-SNP Overview
                </Link>
              </div>
            </PremiumContentBand>
          </div>

          <LeadCtaSection
            eyebrow="C-SNP education"
            title="Get clear C-SNP education before plan-specific review."
            description={`We can help you prepare questions and route you to a licensed agent. Call ${site.phoneDisplay} for direct help.`}
            ctaLabel="Request C-SNP guidance"
          />
        </div>
      </Container>
    </>
  );
}
