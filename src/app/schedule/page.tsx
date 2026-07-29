import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { PremiumCard, PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";

export default function SchedulePage() {
  const scheduleUrl = site.scheduleUrl;

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Schedule"
        title="Schedule a Call"
        subtitle="Book time with a licensed agent for a consultation. Choose a slot that works for you."
        actions={[
          { label: "Contact Form", href: "/contact", kind: "primary" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Plan-specific Medicare guidance requires the required disclosures and scope controls before discussion.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        {scheduleUrl ? (
          <div className="min-h-[600px] w-full overflow-hidden rounded-3xl border border-[var(--ve-teal)]/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <iframe
              title="Schedule a call with Vital Edge Insurance"
              src={scheduleUrl}
              className="h-[700px] w-full border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <PremiumCard title="Scheduling is not set up yet">
            <p>
              Scheduling is not set up yet. You can still reach us by phone or the contact form.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${site.phoneE164}`}
                className="premium-small-button premium-small-button-primary"
              >
                Call {site.phoneDisplay}
              </a>
              <Link
                href="/contact"
                className="premium-small-button premium-small-button-light"
              >
                Contact form
              </Link>
            </div>
          </PremiumCard>
        )}
      </Container>
    </>
  );
}
