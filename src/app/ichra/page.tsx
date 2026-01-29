import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">ICHRA</h1>
          <p className="text-black/70">
            Independent education for employers and employees exploring Individual Coverage HRAs. We focus on structure,
            timelines, and communication planning.
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
              title: "Employer setup",
              body: "Define eligibility classes, allowances, and rollout timelines.",
            },
            {
              title: "Employee experience",
              body: "Clear communication and guidance on how reimbursements work.",
            },
            {
              title: "Ongoing support",
              body: "Checklists for onboarding, renewals, and documentation.",
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
            <h2 className="text-sm font-semibold text-black">Questions to bring</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Which employee classes are eligible?</li>
              <li>What allowance ranges are you considering?</li>
              <li>What start date and communications plan is needed?</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide education and routing. We do not make plan recommendations or enrollment decisions.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-black">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="text-black/70 hover:text-black" href="/resources#ichra-explainer">ICHRA explainer</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#small-group-basics">Small group basics</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#what-to-bring">What to bring</Link>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "What is an ICHRA?",
              answer:
                "An Individual Coverage HRA is an employer-sponsored benefit that reimburses employees for individual coverage. We provide education and planning support.",
            },
            {
              question: "Do you recommend specific plans for ICHRA?",
              answer:
                "We do not recommend specific plans online. We provide education and route you to licensed guidance when needed.",
            },
            {
              question: "What should an employer prepare before an ICHRA review?",
              answer:
                "Eligibility classes, allowance ranges, and desired start dates are a good place to begin.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="ICHRA support"
          title="Plan an ICHRA rollout with education-first guidance."
          description="We help you structure timelines and communication before licensed plan discussions."
          ctaLabel="Request ICHRA guidance"
        />
      </div>
    </Container>
  );
}
