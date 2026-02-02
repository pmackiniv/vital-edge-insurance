import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medicare Guidance in Jacksonville, FL | Medicare Supplement & Medigap Help",
  description:
    "Patrick Mackin IV provides Medicare education, Medicare Supplement (Medigap), and Medicare Advantage guidance in Jacksonville, Duval County, and St. Johns County. Licensed Florida agent for Original Medicare, Part D, and supplemental coverage.",
  alternates: {
    canonical: absoluteUrl("/medicare"),
  },
  openGraph: {
    title: "Medicare Help in Jacksonville, FL | Patrick Mackin IV | Vital Edge Insurance",
    description:
      "Licensed Medicare guidance for Jacksonville residents. Education on Medicare Supplement, Medigap, Part D, and enrollment timing.",
    url: absoluteUrl("/medicare"),
  },
};

export default function Page() {
  return (
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Medicare Education</h1>
          <p className="text-black/70">
            Clear, neutral Medicare education for timing, coverage basics, and next steps. Plan-specific discussions
            require a Scope of Appointment.
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
              body: "Understand Initial Enrollment, Special Enrollment, and general timing considerations.",
            },
            {
              title: "Coverage basics",
              body: "Learn how Original Medicare works and how supplemental coverage can fit in.",
            },
            {
              title: "Prescription coverage",
              body: "General education on prescription coverage timing and preparation.",
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
              <li>Preferred contact method and timing.</li>
              <li>List of doctors and medications for general guidance.</li>
              <li>Any recent Medicare or coverage notices.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Scope of Appointment</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              Plan‑specific Medicare discussions require a Scope of Appointment. We can provide education first and help
              coordinate the proper next steps.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-black">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="text-black/70 hover:text-black" href="/resources#new-to-medicare">New to Medicare</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#medicare-coverage-pathways">Coverage pathways</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#part-d-basics">Part D basics</Link>
            <Link className="text-black/70 hover:text-black" href="/medicare/medigap">Medigap basics</Link>
            <Link className="text-black/70 hover:text-black" href="/medicare/snp">C-SNP & D-SNP</Link>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "What is the best way to start with Medicare education?",
              answer:
                "Start with timing and coverage basics. We provide education and help you prepare for a licensed review.",
            },
            {
              question: "Do you recommend specific Medicare plans?",
              answer:
                "We do not recommend specific plans online. Plan-specific guidance requires a licensed agent.",
            },
            {
              question: "Can I change Medicare coverage right now?",
              answer:
                "Eligibility and timing vary. A licensed agent can confirm what enrollment options apply to you.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Medicare education"
          title="Get clear Medicare guidance from a licensed agent."
          description="We provide education first, then connect you to licensed plan-specific guidance."
          ctaLabel="Request Medicare guidance"
        />
      </div>
    </Container>
  );
}
