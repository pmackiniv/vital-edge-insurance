import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Small Business Health Insurance | Florida Group Coverage | Jacksonville",
  description:
    "Patrick Mackin IV helps Florida small businesses with group health insurance, renewals, and employee benefits. Licensed agent serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County employers.",
  alternates: {
    canonical: absoluteUrl("/small-group"),
  },
  openGraph: {
    title: "Small Business Health Insurance in Florida | Patrick Mackin IV",
    description:
      "Licensed agent support for small group health insurance, renewals, and employee benefits in Florida.",
    url: absoluteUrl("/small-group"),
  },
};

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Small Group Benefits</h1>
          <p className="text-black/70">
            Education-first guidance for small employers exploring group benefits, renewals, and employee communication
            planning. We explain options and organize next steps without pushing a carrier.
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
              title: "Plan basics",
              body: "Understand how small group coverage structures are typically organized.",
            },
            {
              title: "Renewals",
              body: "Prepare for renewal timelines, documentation, and employee communications.",
            },
            {
              title: "Employee experience",
              body: "Create clear onboarding and benefits education materials for staff.",
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
              <li>Employer size and coverage goals.</li>
              <li>Renewal dates and current benefit summary.</li>
              <li>Preferred communication timeline.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide education and routing. We do not make plan recommendations or negotiate on your behalf.
            </p>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "Do you handle small group renewals?",
              answer:
                "We provide education, organize timelines, and help you prepare for licensed carrier conversations.",
            },
            {
              question: "Can you recommend a specific group plan?",
              answer:
                "We do not recommend specific plans online. We provide education and route you to a licensed agent for plan-specific guidance.",
            },
            {
              question: "What is the first step for a small group review?",
              answer:
                "Start with your renewal date, employee count, and coverage goals. We will outline the next steps.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Small group benefits"
          title="Organize your small group benefits review with a licensed agent."
          description="We help you prepare for renewals and employee communication without plan pushing."
          ctaLabel="Request group benefits guidance"
        />
      </div>
    </Container>
  );
}
