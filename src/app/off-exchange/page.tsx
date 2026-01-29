import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Off-Exchange Coverage</h1>
          <p className="text-black/70">
            Education-first guidance on individual coverage purchased outside the Marketplace. We help clarify timing,
            documentation, and next steps without making plan recommendations.
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
              title: "Timing",
              body: "Understand when off‑exchange coverage can be considered relative to Marketplace windows.",
            },
            {
              title: "Documentation",
              body: "Know what personal and coverage information is typically required.",
            },
            {
              title: "Next steps",
              body: "Plan a simple, compliant path to compare coverage paths.",
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
            <h2 className="text-sm font-semibold text-black">Good to know</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Marketplace coverage may include premium tax credits for eligible households.</li>
              <li>Off‑exchange coverage generally does not include premium tax credits.</li>
              <li>Enrollment timing and options can differ from the Marketplace.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide general education and routing. We do not make plan recommendations or carrier comparisons.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-black">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="text-black/70 hover:text-black" href="/resources#off-exchange-vs-marketplace">Off‑exchange vs Marketplace</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#aca-subsidies-overview">ACA subsidies overview</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#what-to-bring">What to bring</Link>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "What is off-exchange coverage?",
              answer:
                "Off-exchange coverage is purchased outside the Marketplace. We provide education on timing and process.",
            },
            {
              question: "Can I get premium tax credits off-exchange?",
              answer:
                "Premium tax credits are generally tied to Marketplace coverage. A licensed agent can confirm details.",
            },
            {
              question: "Do you recommend off-exchange plans?",
              answer:
                "We do not recommend specific plans online. We provide education and route you to licensed guidance.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Off-exchange"
          title="Clarify off-exchange options with a licensed agent."
          description="We explain the differences and help you prepare for a licensed review."
          ctaLabel="Request off-exchange guidance"
        />
      </div>
    </Container>
  );
}
