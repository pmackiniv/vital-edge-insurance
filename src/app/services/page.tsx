import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl } from "@/lib/site";

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
                We provide general education and routing. We do not make plan recommendations, compare carriers, or make
                enrollment decisions on your behalf. For individualized advice, connect with a licensed agent.
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
                question: "Do you recommend specific plans?",
                answer:
                  "We do not recommend specific plans online. We provide education and connect you with licensed agents for plan-specific guidance.",
              },
              {
                question: "How do I start a small group benefits review?",
                answer:
                  "Share your renewal timeline and coverage goals, and we will outline next steps.",
              },
            ]}
          />

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
