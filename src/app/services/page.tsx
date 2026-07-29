import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl, serviceAreaStatement, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Education-first insurance guidance for Medicare, ACA Marketplace, ancillary coverage, ICHRA, and small group coverage across Vital Edge's approved service footprint.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Services"
        title="Education-First Insurance Guidance"
        subtitle="Clear guidance for individuals, families, and small businesses across Medicare, ACA, ancillary coverage, ICHRA, and group benefits."
        actions={[
          { label: "Request Guidance", href: "/contact", kind: "primary" },
          { label: "Start My Review", href: "/enroll", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Online content is education only. Plan-specific guidance, enrollment details, and carrier-specific questions
          require licensed follow-up and applicable disclosures.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 font-sans text-sm text-slate-700 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-teal)]">Answer</div>
            <p className="mt-3 leading-7">
              Vital Edge Insurance provides education-first guidance across ACA Marketplace, Medicare education, ICHRA,
              ancillary coverage, and small group coverage. {serviceAreaStatement} We outline next steps and connect you with a licensed agent for
              plan-specific decisions. Call or text {site.phoneDisplay} or use chat for a quick next step.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/enroll" className="premium-small-button premium-small-button-light">
                Enrollment links
              </Link>
              <Link href="/contact" className="premium-small-button premium-small-button-primary">
                Request guidance
              </Link>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Third-party enrollment partners. Licensed guidance is available if you prefer to enroll with help.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Florida headquarters",
                description: "Local roots with a privacy-safe intake process and licensed follow-up.",
                href: "/duval-county",
                image: "/images/hero/hero-beach-16x9-1920x1080.webp",
                alt: "Warm beach horizon used in the Vital Edge visual system",
              },
              {
                title: "12 states and growing",
                description: "Guidance starts with education, then state, county, ZIP, and eligibility checks.",
                href: "/licensed-states",
                image: "/images/hero/hero-beach-16x9-1920x1080.webp",
                alt: "Calm beach water and sky from the Vital Edge visual system",
              },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
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
                body: "State, county, and ZIP-level preparation for clients across the approved service footprint.",
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
              <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">How we help</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Explain coverage terms and key differences in plain language.</li>
                <li>Outline required steps and timelines for enrollment or changes.</li>
                <li>Coordinate next steps with carriers or marketplaces when needed.</li>
                <li>Provide documentation checklists and follow-up reminders.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(228,246,247,0.92),rgba(255,255,255,0.94))] p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
              <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Compliance-first approach</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                We provide general education and routing. If you&apos;d like plan-specific information, please provide a bit
                of information to{" "}
                <Link className="underline" href="/schedule">schedule an appointment</Link> or{" "}
                <Link className="underline" href="/chat">request a same-day callback/text/email</Link>. You can also email{" "}
                <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> or call/text{" "}
                <a className="underline" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--ve-teal)] p-8 text-white shadow-[0_28px_80px_rgba(0,63,69,0.22)] md:p-10">
            <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/80">Need a clear next step?</div>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,2.6vw,2.6rem)] font-bold tracking-normal">
              Start a contact request or chat with our team.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
              We will help you understand your options and organize the next action with minimal back-and-forth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="premium-small-button premium-small-button-gold"
            >
              Contact us
            </Link>
            <Link
              href="/chat"
              className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
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

          <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-teal)]">AEO questions</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-normal text-[var(--ve-teal)]">Common guidance questions</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>What should I bring to a first coverage call?</li>
              <li>How do I know which enrollment window applies?</li>
              <li>Can you explain coverage options without recommending a plan?</li>
              <li>Which of the 12 approved service states can Vital Edge help with?</li>
            </ul>
            <p className="mt-3 text-sm text-slate-700">
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
    </>
  );
}
