import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export default function SchedulePage() {
  const scheduleUrl = process.env.CALENDLY_URL || process.env.NEXT_PUBLIC_SCHEDULE_URL || "";

  return (
    <Container className="py-14">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Schedule a call</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Book time with a licensed agent for a consultation. Choose a slot that works for you.
        </p>

        {scheduleUrl ? (
          <div className="mt-8 min-h-[600px] w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <iframe
              title="Schedule a call with Vital Edge Insurance"
              src={scheduleUrl}
              className="h-[700px] w-full border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 text-center">
            <p className="text-sm text-black/70">
              Scheduling is not set up yet. You can still reach us by phone or the contact form.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${site.phoneE164}`}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Call {site.phoneDisplay}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
              >
                Contact form
              </a>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
