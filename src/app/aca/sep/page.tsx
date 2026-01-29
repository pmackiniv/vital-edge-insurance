import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">ACA Special Enrollment Periods (SEP)</h1>
          <p className="text-black/70">
            Education-first guidance on Marketplace Special Enrollment Periods, qualifying life events, and what
            information to gather before applying.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
            >
              Request guidance
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
            >
              Chat with our team
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Life events",
              body: "Moves, coverage loss, household changes, and other events can open a Special Enrollment Period.",
            },
            {
              title: "Documentation",
              body: "Each event may require specific proof or timing documentation.",
            },
            {
              title: "Timing",
              body: "Enrollment windows are time-limited and can vary by event.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-black">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-black/70">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">What to prepare</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Description of the qualifying event and date.</li>
              <li>Household member details and coverage status.</li>
              <li>Preferred contact method and timing.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide general education and routing. A licensed agent can confirm whether a specific SEP applies.
            </p>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "What qualifies for an ACA Special Enrollment Period?",
              answer:
                "Qualifying events can include moving, losing coverage, household changes, or other life events. A licensed agent can confirm which events apply.",
            },
            {
              question: "How long do I have to use a SEP?",
              answer:
                "SEP windows are time-limited and depend on the specific event. A licensed agent can help confirm timing.",
            },
            {
              question: "Do you recommend a specific Marketplace plan?",
              answer:
                "We do not recommend specific plans online. We provide education and route you to a licensed agent for plan-specific guidance.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Marketplace SEP"
          title="Get clarity on ACA SEP timing and next steps."
          description="We explain the general rules and help you prepare for a licensed review."
          ctaLabel="Request SEP guidance"
        />
      </div>
    </Container>
  );
}
