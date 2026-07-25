import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { AIChatPanel } from "@/components/AIChatPanel";
import { PremiumCard, PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";

export default function ChatPage() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Vital Guide"
        title="Ask Vital Guide"
        subtitle={`Vital Guide is the Vital Edge Insurance helper for general coverage education, resources, and next-step support. For licensed guidance, call or text ${site.phoneDisplay}.`}
        actions={[
          { label: "Contact Form", href: "/contact", kind: "primary" },
          { label: "Schedule a Call", href: "/schedule", kind: "gold" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          We do not provide plan-specific guidance via chat. Do not send SSN, Medicare ID, bank information, medical
          details, or sensitive identifiers.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <div className="flex min-h-[560px] flex-col rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <AIChatPanel />
          </div>

          <PremiumCard title="Need a callback" tone="soft">
            <p>
              If you want licensed help, use the contact form or schedule a call. We respond as quickly as possible
              during business hours.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/contact" className="premium-small-button premium-small-button-primary">
                Contact form
              </Link>
              <Link href="/schedule" className="premium-small-button premium-small-button-light">
                Schedule a call
              </Link>
              <a href={`tel:${site.phoneE164}`} className="premium-small-button premium-small-button-light">
                Call {site.phoneDisplay}
              </a>
            </div>
          </PremiumCard>
        </div>
      </Container>
    </>
  );
}
