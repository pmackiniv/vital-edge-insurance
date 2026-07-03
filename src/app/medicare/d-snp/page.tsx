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
  title: "D-SNP Education | Vital Edge Insurance",
  description:
    "Education-first D-SNP guidance for people with Medicare and Medicaid. Learn what to prepare before a licensed review.",
  alternates: {
    canonical: absoluteUrl("/medicare/d-snp"),
  },
};

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Dual Eligible Special Needs Plan Education"
        title="D-SNP Guidance"
        subtitle="Understand the general D-SNP pathway for people who may have both Medicare and Medicaid, with a privacy-safe handoff to a licensed agent."
        actions={[
          { label: "Start My Review", href: PLANENROLL, kind: "primary", external: true },
          { label: "Request a Call", href: "/contact?topic=d-snp", kind: "gold" },
          { label: "C-SNP Education", href: "/medicare/c-snp", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          D-SNP availability and eligibility vary by county, Medicaid status, carrier appointment, plan rules, and
          enrollment period. This page is educational and does not recommend a plan.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumFeatureGrid
            features={[
              {
                title: "Medicare + Medicaid",
                body: "D-SNPs generally serve people who have Medicare and Medicaid. Medicaid level, state program rules, and plan requirements must be verified.",
              },
              {
                title: "County-Specific Options",
                body: "Plan availability can change by state, ZIP code, county, carrier, provider network, pharmacy network, and appointment status.",
              },
              {
                title: "Human Review",
                body: "A licensed agent can review eligibility factors, provider fit, prescriptions, timing, and next steps after compliant intake.",
              },
            ]}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <PremiumContentBand title="What to prepare" tone="teal">
              <ul className="space-y-2">
                <li>State, county, ZIP code, and preferred contact method.</li>
                <li>Current Medicare coverage information.</li>
                <li>Medicaid status, Medicaid level, or recent eligibility notice if available.</li>
                <li>Preferred doctors, specialists, pharmacies, and prescriptions for later licensed review.</li>
                <li>Any notices about Extra Help, LIS, Medicare Savings Program, or Medicaid renewal status.</li>
              </ul>
            </PremiumContentBand>
            <PremiumContentBand title="Privacy-safe next step">
              <p>
                Do not send SSN, MBI, or sensitive identifiers through chat or web forms. Vital Edge starts with
                education and contact routing, then hands off to a licensed human agent for plan-specific guidance.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="premium-small-button premium-small-button-primary" href="/contact?topic=d-snp">
                  Request D-SNP Guidance
                </Link>
                <Link className="premium-small-button premium-small-button-light" href="/medicare/snp">
                  C-SNP &amp; D-SNP Overview
                </Link>
              </div>
            </PremiumContentBand>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <PremiumContentBand title="Eligibility and suitability checks">
              <div className="space-y-3">
                <p>
                  A D-SNP conversation should not assume eligibility from a phrase like “Medicaid” alone. The review
                  should confirm Medicare status, Medicaid level, state rules, ZIP/county service area, enrollment
                  period, and whether the available plan type matches the client&apos;s access needs.
                </p>
                <p>
                  Provider and prescription fit still matters. Doctors, specialists, hospitals, pharmacy preferences,
                  and formularies should be checked before any plan-specific recommendation.
                </p>
              </div>
            </PremiumContentBand>
            <PremiumContentBand title="Official source">
              <p>
                Medicare.gov describes Special Needs Plans as Medicare Advantage plan types that serve people with
                specific diseases or characteristics, certain health care needs, or Medicaid. You can only remain
                enrolled if you continue to meet the plan&apos;s special conditions.
              </p>
              <p className="mt-3">
                Source:{" "}
                <a className="font-bold underline underline-offset-4" href="https://www.medicare.gov/health-drug-plans/health-plans/your-health-plan-options/SNP">
                  Medicare.gov Special Needs Plans
                </a>
                .
              </p>
            </PremiumContentBand>
          </div>

          <LeadCtaSection
            eyebrow="D-SNP education"
            title="Get clear D-SNP education before plan-specific review."
            description={`We can help you understand what to prepare and when to speak with a licensed agent. Call ${site.phoneDisplay} for direct help.`}
            ctaLabel="Request D-SNP guidance"
          />
        </div>
      </Container>
    </>
  );
}
