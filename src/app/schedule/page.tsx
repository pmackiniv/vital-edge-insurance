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
        <div className="mb-6 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            Our scheduling calendar opens in <strong>Eastern Time (ET)</strong>, adjusting for daylight saving time.
            If you are in another time zone, check the calendar’s time-zone selector before confirming your appointment.
          </p>
          {scheduleUrl ? (
            <a href={scheduleUrl} target="_blank" rel="noopener noreferrer" className="premium-small-button premium-small-button-primary">
              Open booking calendar in a new tab
            </a>
          ) : null}
          <p>
            Prefer to browse on your own? <Link href="/enroll" className="font-bold underline underline-offset-4">Compare Medicare plans online</Link> without booking a call.
          </p>
        </div>
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
