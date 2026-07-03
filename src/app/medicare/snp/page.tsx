import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import {
  PremiumContentBand,
  PremiumDisclosure,
  PremiumFeatureGrid,
  PremiumInteriorHero,
} from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";
import { PLANENROLL } from "@/lib/externalLinks";
import { site } from "@/lib/site";

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Medicare Special Needs Plans"
        title="C-SNP & D-SNP Education"
        subtitle="Education-first guidance on Special Needs Plan concepts, general eligibility, timing, and what to prepare before a licensed review."
        actions={[
          { label: "Start My Review", href: PLANENROLL, kind: "primary", external: true },
          { label: "D-SNP Education", href: "/medicare/d-snp", kind: "gold" },
          { label: "C-SNP Education", href: "/medicare/c-snp", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Plan availability, eligibility, benefits, provider networks, pharmacy networks, and enrollment periods vary by
          county and carrier. Plan-specific Medicare discussions require proper scope and licensed-agent follow-up.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumFeatureGrid
            features={[
              {
                title: "C-SNP",
                body: "Chronic Condition Special Needs Plans are designed for certain severe or disabling chronic conditions, with plan-specific eligibility rules.",
              },
              {
                title: "D-SNP",
                body: "Dual Eligible Special Needs Plans generally serve people who have Medicare and Medicaid, but Medicaid level and plan rules still need verification.",
              },
              {
                title: "Licensed Review",
                body: "A licensed agent can confirm plan availability, eligibility, and timing after the required compliant steps.",
              },
            ]}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <PremiumContentBand title="What to prepare" tone="teal">
              <ul className="space-y-2">
                <li>State, county, ZIP code, and preferred contact method.</li>
                <li>Current Medicare and Medicaid coverage details, including Medicaid level if applicable.</li>
                <li>Recent notices, doctors, specialists, hospitals, pharmacies, and prescription list.</li>
              </ul>
            </PremiumContentBand>
            <PremiumContentBand title="Choose the right education path">
              <div className="grid gap-3">
                <Link href="/medicare/d-snp" className="font-bold text-[var(--ve-teal)] underline underline-offset-4">
                  Learn about D-SNP education
                </Link>
                <Link href="/medicare/c-snp" className="font-bold text-[var(--ve-teal)] underline underline-offset-4">
                  Learn about C-SNP education
                </Link>
                <Link href="/medicare" className="font-bold text-[var(--ve-teal)] underline underline-offset-4">
                  Return to Medicare overview
                </Link>
              </div>
            </PremiumContentBand>
          </div>

          <SeoFaq
            items={[
              {
                question: "Am I eligible for a C-SNP or D-SNP?",
                answer:
                  "Eligibility depends on factors such as chronic conditions, Medicaid status, service area, and plan rules. A licensed agent can confirm eligibility and timing.",
              },
              {
                question: "Do you recommend a specific SNP plan online?",
                answer:
                  "No. We provide general education online and route plan-specific discussions through a licensed agent with proper scope.",
              },
              {
                question: "Can I switch SNP plans right now?",
                answer:
                  "Enrollment rules can vary by situation. A licensed agent can review the timing that applies after collecting the required information.",
              },
            ]}
          />

          <LeadCtaSection
            eyebrow="SNP guidance"
            title="Get education and next steps for C-SNP and D-SNP."
            description={`We explain the basics and connect you to a licensed agent for plan-specific guidance. You can also call ${site.phoneDisplay}.`}
            ctaLabel="Request SNP guidance"
          />

          <PremiumContentBand title="Official source">
            <p>
              Medicare.gov explains that SNPs are Medicare Advantage plan types for people with specific diseases or
              characteristics, certain health care needs, or Medicaid, and that enrollment depends on continuing to meet
              plan conditions.
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
      </Container>
    </>
  );
}
