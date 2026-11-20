import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumCard, PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { absoluteUrl, licensedStateNames, site } from "@/lib/site";

const LAST_UPDATED = "November 19, 2026";

export const metadata: Metadata = {
  title: "Terms of Use & Licensing Disclosures | Vital Edge Insurance",
  description:
    "Terms of Use, Florida DFS license verification (FL License #G275791, NPN 21729046), educational scope, and Medicare compliance disclosures for Vital Edge Insurance.",
  alternates: {
    canonical: absoluteUrl("/terms"),
  },
};

export default function TermsPage() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Terms of Use"
        title="Terms of Use & Licensing Disclosures"
        subtitle="Governing terms, broker licensing disclosures, and educational boundaries for vital-edge-insurance.com."
        actions={[
          { label: "Privacy Policy", href: "/privacy", kind: "primary" },
          { label: "Request a Call", href: "/contact", kind: "gold" },
        ]}
      >
        <PremiumDisclosure>
          Last updated {LAST_UPDATED}. Vital Edge Insurance is operated by Patrick Mackin IV, an independent licensed
          Florida health insurance broker (NPN 21729046, FL License #G275791).
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-2">
            <PremiumCard title="Operator identity and licensing">
              <p>
                <strong>
                  Vital Edge Insurance is operated by Patrick Mackin IV, an independent licensed Florida health
                  insurance broker (NPN 21729046, FL License #G275791).
                </strong>
              </p>
              <p className="mt-3">
                Florida resident license class: 0215 (Life, Health &amp; Variable Contracts Insurance Agent). You may
                verify this license at any time through the{" "}
                <a
                  className="font-bold text-[var(--ve-teal)] underline underline-offset-4"
                  href="https://licenseesearch.fldfs.com/Licensee/2723002"
                  target="_blank"
                  rel="noreferrer"
                >
                  Florida Department of Financial Services Licensee Search
                </a>
                .
              </p>
              <p className="mt-3">
                Licensed states ({licensedStateNames.length}): {licensedStateNames.join(", ")}.
              </p>
            </PremiumCard>

            <PremiumCard title="Educational scope and no binding quote">
              <p>
                Information published on vital-edge-insurance.com is provided for general educational purposes only and
                does not constitute legal, tax, medical, or final enrollment advice.
              </p>
              <p className="mt-3">
                Submitting a contact form, chat inquiry, or callback request does not bind coverage, enroll you in any
                insurance plan, or modify your current coverage. Plan availability, provider networks, formularies,
                premiums, and eligibility vary by state, county, ZIP code, carrier, and enrollment period.
              </p>
            </PremiumCard>

            <PremiumCard title="Medicare and CMS disclosures">
              <p>
                Vital Edge Insurance is not connected with or endorsed by the United States government or the federal
                Medicare program.
              </p>
              <p className="mt-3">
                We do not offer every plan available in your area. We represent many organizations which offer several
                products in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your
                options. You may also contact 1-800-MEDICARE (TTY users should call 1-877-486-2048), 24 hours a day, 7
                days a week, or your local State Health Insurance Assistance Program (SHIP) to get information on all of
                your options. Can&apos;t find the plan you&apos;re looking for? Call me!
              </p>
            </PremiumCard>

            <PremiumCard title="Communications and privacy-safe intake">
              <p>
                Do not submit Social Security numbers, Medicare Beneficiary Identifiers (MBIs), payment card numbers, or
                sensitive medical records through public web forms or website chat.
              </p>
              <p className="mt-3">
                Plan-specific Medicare Advantage or Part D discussions require appropriate Scope of Appointment
                documentation and verified consumer consent. Phone calls involving Medicare marketing or enrollment
                discussions are recorded as required by federal rules.
              </p>
            </PremiumCard>
          </div>

          <PremiumCard title="Questions about these terms?" tone="teal">
            <p>
              If you have questions about licensing, disclosures, or your rights when using vital-edge-insurance.com,
              reach Patrick Mackin IV directly at{" "}
              <a className="font-bold underline underline-offset-4" href={`tel:${site.phoneE164}`}>
                {site.phoneDisplay}
              </a>{" "}
              or{" "}
              <a className="font-bold underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/privacy" className="premium-small-button premium-small-button-gold">
                Read Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
              >
                Contact Us
              </Link>
            </div>
          </PremiumCard>
        </div>
      </Container>
    </>
  );
}
