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
  title: "Referrals | Vital Edge Insurance",
  description:
    "Refer a friend, client, or family member to Vital Edge Insurance for compliant insurance guidance and licensed-agent follow-up.",
  alternates: {
    canonical: absoluteUrl("/referrals"),
  },
};

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Referrals"
        title="Refer Someone to Vital Edge"
        subtitle="Send someone to a privacy-safe intake path for Medicare, ACA, ancillary coverage, or a general insurance question."
        actions={[
          { label: "Request a Call", href: "/contact?topic=referral", kind: "primary" },
          { label: "Helping a Family Member", href: "/family-help", kind: "gold" },
          { label: "View Licensed States", href: "/licensed-states", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Please do not send SSN, MBI, PHI, or other sensitive identifiers through referral forms, chat, or email.
          Vital Edge uses privacy-safe intake and licensed-agent follow-up.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumFeatureGrid
            features={[
              {
                title: "Simple Intake",
                body: "The referral starts with topic, county, contact preference, and a brief non-sensitive message.",
              },
              {
                title: "Human Handoff",
                body: "A licensed agent follows up for plan-specific questions and appropriate disclosures.",
              },
              {
                title: "No Autonomous Enrollment",
                body: "The website does not enroll, recommend plans, or collect sensitive identifiers autonomously.",
              },
            ]}
          />
          <PremiumContentBand title="Who referrals are for" tone="teal">
            <p>
              Referrals are appropriate for people looking for Medicare education, ACA Marketplace preparation,
              ancillary coverage guidance, or help understanding which compliant next step comes first.
            </p>
          </PremiumContentBand>
          <LeadCtaSection
            eyebrow="Referral"
            title="Route someone to a licensed human follow-up."
            description="Start with a privacy-safe contact request and a clear topic."
            ctaLabel="Send referral request"
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
