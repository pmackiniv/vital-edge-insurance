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
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Helping a Family Member | Vital Edge Insurance",
  description:
    "Guidance for family members helping a loved one understand Medicare, ACA, or ancillary coverage next steps.",
  alternates: {
    canonical: absoluteUrl("/family-help"),
  },
};

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Family Support"
        title="Helping a Family Member"
        subtitle="A calm, respectful path for adult children, spouses, caregivers, and relatives helping someone navigate coverage questions."
        actions={[
          { label: "Request a Call", href: "/contact?topic=family-help", kind: "primary" },
          { label: "Medicare Guidance", href: "/medicare", kind: "gold" },
          { label: "Ancillary Coverage", href: "/ancillary", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Please do not submit SSN, MBI, detailed medical records, or sensitive identifiers through web forms or chat.
          We use privacy-safe intake and licensed-agent follow-up.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumFeatureGrid
            features={[
              {
                title: "Clarify the Situation",
                body: "Start with county, current coverage type, timing, preferred doctors, and what kind of help is needed.",
              },
              {
                title: "Respect Permission",
                body: "We keep conversations appropriate and route plan-specific discussion through compliant follow-up.",
              },
              {
                title: "Document Next Steps",
                body: "A licensed agent can help outline what to gather before review without collecting sensitive identifiers online.",
              },
            ]}
          />
          <PremiumContentBand title="A helpful starting checklist" tone="teal">
            <ul className="space-y-2">
              <li>Coverage topic: Medicare, ACA, ancillary, or general question.</li>
              <li>County and state where the person lives.</li>
              <li>Preferred phone or email follow-up method.</li>
              <li>High-level goals or concerns, without sensitive identifiers.</li>
            </ul>
          </PremiumContentBand>
          <LeadCtaSection
            eyebrow="Family help"
            title="Help a loved one take the next compliant step."
            description="We can start with education and route the conversation to a licensed agent when needed."
            ctaLabel="Request family guidance"
          />
          <div className="font-sans text-sm">
            <Link href="/" className="font-bold text-[var(--ve-teal)] underline underline-offset-4">
              Return to homepage
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
