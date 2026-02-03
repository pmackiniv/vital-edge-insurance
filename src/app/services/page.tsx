import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Education-first insurance guidance for Duval County and Miami-Dade County, including ACA Marketplace support, Medicare education, ICHRA, and small group coverage.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

export default function Page() {
  return (
    <div className="relative">
      <Container className="py-14">
        <div className="space-y-10">
          <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
            <h1 className="text-2xl font-semibold tracking-tight text-black">Services</h1>
            <p className="text-black/70">
              Clear, education-first insurance guidance for individuals, families, and small businesses. We explain
              options, outline next steps, and keep the process organized without pushing a specific plan or carrier.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="btn btn-primary px-4 py-2 text-sm"
            >
              Request guidance
            </Link>
            <Link
              href="/chat"
              className="btn btn-secondary px-4 py-2 text-sm"
            >
              Chat with our team
            </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Answer</div>
            <p className="mt-3 leading-7">
              Vital Edge Insurance provides education-first guidance across ACA Marketplace, Medicare education, ICHRA,
              and small group coverage in Florida. We outline next steps and connect you with a licensed agent for
              plan-specific decisions. Call or text {site.phoneDisplay} or use chat for a quick next step.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/enroll" className="btn btn-secondary px-4 py-2 text-sm">
                Enrollment links
              </Link>
              <Link href="/contact" className="btn btn-primary px-4 py-2 text-sm">
                Request guidance
              </Link>
            </div>
            <p className="mt-2 text-xs text-black/60">
              Third-party enrollment partners. Licensed guidance is available if you prefer to enroll with help.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Duval County (Jacksonville)",
                description: "Local guidance with clear timelines and intake support.",
                href: "/duval-county",
                image: "/images/cities/jacksonville.png",
                alt: "Jacksonville skyline at sunset",
              },
              {
                title: "Miami-Dade County",
                description: "Regional support for Miami-area coverage questions.",
                href: "/miami",
                image: "/images/cities/miami.png",
                alt: "Miami skyline at dusk",
              },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group rounded-2xl border border-black/10 bg-white p-3">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="text-lg font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm opacity-90">{item.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Individual & family coverage",
                body: "Support navigating ACA Marketplace enrollment windows, eligibility questions, and documentation.",
              },
              {
                title: "Medicare education",
                body: "High-level guidance on Parts A/B, supplemental coverage, and timing considerations.",
              },
              {
                title: "Small group support",
                body: "Employer coverage education, renewal reviews, and employee communication planning.",
              },
              {
                title: "ICHRA insights",
                body: "Help understanding employer stipend structures and how individual coverage works alongside them.",
              },
              {
                title: "Off-exchange options",
                body: "Overview of alternatives when Marketplace enrollment is not a fit.",
              },
              {
                title: "Local area guidance",
                body: "County-level support for Jacksonville and nearby communities.",
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
              <h2 className="text-sm font-semibold text-black">How we help</h2>
              <ul className="mt-3 space-y-2 text-sm text-black/70">
                <li>Explain coverage terms and key differences in plain language.</li>
                <li>Outline required steps and timelines for enrollment or changes.</li>
                <li>Coordinate next steps with carriers or marketplaces when needed.</li>
                <li>Provide documentation checklists and follow-up reminders.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
              <h2 className="text-sm font-semibold text-black">Compliance-first approach</h2>
              <p className="mt-3 text-sm leading-6 text-black/70">
                We provide general education and routing. If you&apos;d like plan-specific information, please provide a bit
                of information to{" "}
                <Link className="underline" href="/schedule">schedule an appointment</Link> or{" "}
                <Link className="underline" href="/chat">request a same-day callback/text/email</Link>. You can also email{" "}
                <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> or call/text{" "}
                <a className="underline" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--brand-blue)] p-8 text-white md:p-10">
            <div className="text-sm font-semibold text-white/80">Need a clear next step?</div>
            <h2 className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold tracking-tight">
              Start a contact request or chat with our team.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
              We will help you understand your options and organize the next action with minimal back-and-forth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="btn px-5 py-3 text-sm text-white"
              style={{ backgroundColor: "var(--brand-orange)" }}
            >
              Contact us
            </Link>
            <Link
              href="/chat"
              className="btn btn-outline-on-dark px-5 py-3 text-sm"
            >
              Chat now
            </Link>
            </div>
          </div>

          <SeoFaq
            items={[
              {
                question: "Do you handle Medicare, ACA, and small group guidance?",
                answer:
                  "Yes. We provide education across Medicare, ACA Marketplace, off-exchange coverage, ICHRA, and small group benefits.",
              },
              {
                question: "How do you handle plan-specific guidance?",
                answer:
                  "We provide general education online and handle plan-specific guidance by appointment or call/text.",
              },
              {
                question: "Do you offer enrollment links?",
                answer:
                  "Yes. When appropriate we provide secure enrollment links so you can complete your application online.",
              },
              {
                question: "What information should I have ready?",
                answer:
                  "Your ZIP code, coverage goals, preferred contact method, and any timing deadlines are most helpful.",
              },
              {
                question: "How do I start a small group benefits review?",
                answer:
                  "Share your renewal timeline and coverage goals, and we will outline next steps.",
              },
            ]}
          />

          <section className="rounded-2xl border border-white/30 bg-white/35 p-6 text-white/90 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/70">AEO questions</div>
            <h2 className="mt-2 text-lg font-semibold text-white">Common guidance questions</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>What should I bring to a first coverage call?</li>
              <li>How do I know which enrollment window applies?</li>
              <li>Can you explain coverage options without recommending a plan?</li>
              <li>Do you support Florida‑only counties or statewide?</li>
            </ul>
            <p className="mt-3 text-sm text-white/80">
              We provide education-first guidance and route plan-specific decisions to a licensed agent.
            </p>
          </section>

          <LeadCtaSection
            eyebrow="Ready to talk?"
            title="Get education-first guidance and a licensed next step."
            description="We route every request through a compliant intake so you can move forward with confidence."
            ctaLabel="Request guidance"
          />
        </div>
      </Container>
    </div>
  );
}
