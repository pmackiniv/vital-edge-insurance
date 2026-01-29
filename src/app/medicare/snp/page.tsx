import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">C-SNP & D-SNP Education</h1>
          <p className="text-black/70">
            Education-first guidance on Special Needs Plans. We explain general eligibility concepts, timelines, and
            what to prepare before a licensed agent reviews your situation.
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
              title: "C-SNP",
              body: "Chronic Condition Special Needs Plans are designed for people with specific chronic conditions.",
            },
            {
              title: "D-SNP",
              body: "Dual Eligible Special Needs Plans generally serve people who have Medicare and Medicaid.",
            },
            {
              title: "Timing",
              body: "Eligibility and enrollment windows can vary; a licensed agent can confirm details.",
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
              <li>Current coverage details and recent notices.</li>
              <li>Preferred contact method and timing.</li>
              <li>County of residence.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide general education and routing. Eligibility confirmations require a licensed agent.
            </p>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "Am I eligible for a C-SNP or D-SNP?",
              answer:
                "Eligibility depends on factors such as chronic conditions or Medicaid status. A licensed agent can confirm eligibility and timing.",
            },
            {
              question: "Do you recommend a specific SNP plan?",
              answer:
                "We do not recommend specific plans online. We provide education and route you to a licensed agent for plan-specific guidance.",
            },
            {
              question: "Can I switch SNP plans right now?",
              answer:
                "Enrollment rules can vary by situation. A licensed agent can review your options and the timing that applies.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="SNP guidance"
          title="Get education and next steps for C-SNP and D-SNP."
          description="We explain the basics and connect you to a licensed agent for plan-specific guidance."
          ctaLabel="Request SNP guidance"
        />
      </div>
    </Container>
  );
}
