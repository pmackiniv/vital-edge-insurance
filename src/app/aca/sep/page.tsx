import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="ACA Marketplace"
        title="ACA Special Enrollment Periods"
        subtitle="Education-first guidance on Marketplace Special Enrollment Periods, qualifying life events, and what information to gather before applying."
        actions={[
          { label: "Request Guidance", href: "/contact", kind: "primary" },
          { label: "ACA Overview", href: "/aca", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          ACA eligibility, enrollment windows, document requirements, and plan availability vary by household, state,
          county, carrier, and qualifying event.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
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
            <div key={item.title} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <div className="text-sm font-extrabold text-[var(--ve-teal)]">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">What to prepare</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Description of the qualifying event and date.</li>
              <li>Household member details and coverage status.</li>
              <li>Preferred contact method and timing.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(228,246,247,0.92),rgba(255,255,255,0.94))] p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
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
    </>
  );
}
