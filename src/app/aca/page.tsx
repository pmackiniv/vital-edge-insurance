import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ACA Marketplace Health Insurance | Florida HealthCare.gov Enrollment Help",
  description:
    "Patrick Mackin IV provides ACA Marketplace enrollment guidance in Jacksonville, FL. Get help with HealthCare.gov eligibility, subsidies, Special Enrollment Periods, and plan selection for Duval, St. Johns, and Miami-Dade counties.",
  alternates: {
    canonical: absoluteUrl("/aca"),
  },
  openGraph: {
    title: "ACA Marketplace Help in Jacksonville, FL | Patrick Mackin IV",
    description:
      "Licensed agent support for Florida ACA Marketplace enrollment, subsidies, and plan selection.",
    url: absoluteUrl("/aca"),
  },
};

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">ACA Marketplace</h1>
          <p className="text-black/70">
            Education-first guidance for HealthCare.gov enrollment, eligibility questions, and timeline planning. We
            explain how the process works and help you prepare the right information before you apply.
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
              title: "Enrollment timing",
              body: "Understand Open Enrollment and Special Enrollment Periods with clear date checklists.",
            },
            {
              title: "Income & household",
              body: "Review what counts toward household size and estimated income for eligibility.",
            },
            {
              title: "Application prep",
              body: "Gather documents and avoid common submission delays.",
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
            <h2 className="text-sm font-semibold text-black">Checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Household member details and dates of birth.</li>
              <li>Recent income documents or estimates.</li>
              <li>Current coverage status and recent changes.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-only guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide general education and routing. We do not make plan recommendations or enrollment decisions on
              your behalf.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-black">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="text-black/70 hover:text-black" href="/resources#aca-subsidies-overview">ACA subsidies overview</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#marketplace-sep-checklist">Marketplace SEP checklist</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#what-to-bring">What to bring</Link>
            <Link className="text-black/70 hover:text-black" href="/aca/sep">ACA SEP overview</Link>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "When can I enroll in the ACA Marketplace?",
              answer:
                "Enrollment happens during Open Enrollment or a Special Enrollment Period if you qualify. We provide education and help you prepare for licensed guidance.",
            },
            {
              question: "Do you recommend specific Marketplace plans?",
              answer:
                "We do not recommend specific plans online. We provide education and route you to a licensed agent for plan-specific guidance.",
            },
            {
              question: "What should I prepare before applying?",
              answer:
                "Household details, income estimates, and recent coverage changes are key starting points.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="ACA Marketplace"
          title="Get ACA Marketplace guidance and next steps."
          description="We explain the process and help you prepare for a licensed review."
          ctaLabel="Request ACA guidance"
        />
      </div>
    </Container>
  );
}
