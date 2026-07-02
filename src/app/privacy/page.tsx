import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumCard, PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Privacy"
        title="Privacy & Information Handling"
        subtitle="A high-level summary of how Vital Edge Insurance handles information shared through forms, phone, and chat."
        actions={[
          { label: "Ask a Privacy Question", href: "/contact", kind: "primary" },
          { label: "Chat With Our Team", href: "/chat", kind: "gold" },
        ]}
      >
        <PremiumDisclosure>
          This page provides a high-level summary. A full privacy policy will be published after legal review.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-2">
          <PremiumCard title="Information we collect">
            <p>
              Contact details and basic coverage questions that you share via forms, phone, or chat. We do not request
              sensitive identifiers like Social Security numbers or Medicare IDs through this site.
            </p>
          </PremiumCard>
          <PremiumCard title="How we use information">
            <p>
              To respond to your inquiry, coordinate next steps, and improve our services. We do not sell personal
              information or use it for unrelated marketing.
            </p>
          </PremiumCard>
          <PremiumCard title="Sharing">
            <p>
              We may share details only as needed to assist with your request, such as with a carrier or marketplace.
              We do not compare carriers or recommend specific plans.
            </p>
          </PremiumCard>
          <PremiumCard title="Your choices">
            <p>
              You can request access, updates, or deletion of your contact information by reaching out directly. We will
              confirm identity before any changes.
            </p>
          </PremiumCard>
        </div>

        <PremiumCard title="Security and retention" tone="soft">
          <p>
            We take reasonable safeguards to protect information and only retain it as needed for service follow-up and
            recordkeeping. Specific retention periods will be posted in the full policy.
          </p>
        </PremiumCard>

        <PremiumCard title="Questions about privacy?" tone="teal">
          <p>
            Use the contact form or chat to reach our team. We will respond with clear, non-technical answers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="premium-small-button premium-small-button-gold">
              Contact us
            </Link>
            <Link
              href="/chat"
              className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
            >
              Chat now
            </Link>
          </div>
        </PremiumCard>
      </div>
    </Container>
    </>
  );
}
