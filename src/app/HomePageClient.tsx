"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { LeadModal } from "@/components/LeadModal";
import { externalLinkProps, PLANENROLL, UHONE_ANCILLARY } from "@/lib/externalLinks";
import { absoluteUrl } from "@/lib/site";

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

type IconName = "shield" | "tooth" | "phone" | "person" | "clipboard" | "heart" | "users" | "pin" | "star" | "cross";

function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  if (name === "tooth") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7.2 3.5c1.2 0 2.1.6 2.8 1.1.5.3 1 .6 1.9.6.8 0 1.4-.3 1.9-.6.8-.5 1.6-1.1 2.9-1.1 2.4 0 4 2.2 4 5.3 0 2.3-.8 4.7-1.8 6.8-1.1 2.4-2.1 4.2-3.5 4.2-1.1 0-1.3-1.2-1.6-2.7-.3-1.5-.6-3.2-1.9-3.2s-1.6 1.7-1.9 3.2c-.3 1.5-.5 2.7-1.6 2.7-1.4 0-2.5-1.8-3.5-4.2C3.9 13.5 3 11.1 3 8.8c0-3.1 1.7-5.3 4.2-5.3Z" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7.6 4.2 5.3 6.5c-.8.8-.8 2.1-.2 3.2 2 3.8 5.4 7.2 9.2 9.2 1.1.6 2.4.6 3.2-.2l2.3-2.3-4-3-1.8 1.8c-2.3-1.1-4.1-2.9-5.2-5.2l1.8-1.8-3-4Z" />
      </svg>
    );
  }
  if (name === "clipboard") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 4h6l1 2h3v15H5V6h3l1-2Z" />
        <path d="M9 11h6M9 15h4" />
        <path d="m14 18 2 2 4-5" />
      </svg>
    );
  }
  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 20s-7.5-4.4-9.1-9.1C1.8 7.7 3.8 5 6.8 5c1.8 0 3.2 1 4.2 2.4C12 6 13.5 5 15.2 5c3 0 5 2.7 3.9 5.9C17.5 15.6 12 20 12 20Z" />
        <path d="M7 12h3l1-2 2 5 1-3h3" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M8.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM15.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
        <path d="M2.8 20c.5-3.5 2.4-5.3 5.7-5.3 1.6 0 2.9.4 3.9 1.2M11.6 20c.5-3.5 2.4-5.3 5.7-5.3 2.4 0 4.1 1 5.1 3" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (name === "star") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    );
  }
  if (name === "cross") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3v18M6.5 8.5h11" />
      </svg>
    );
  }
  if (name === "person") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.5 20c.7-4.3 2.9-6.4 6.5-6.4s5.8 2.1 6.5 6.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3.5 19 6v5.3c0 4.4-2.8 7.8-7 9.2-4.2-1.4-7-4.8-7-9.2V6l7-2.5Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

const routingCards = [
  {
    title: "New to Medicare",
    description: "I'm new to Medicare and need guidance.",
    href: "/medicare",
    icon: "person" as const,
  },
  {
    title: "Medicare Plan Review",
    description: "I have Medicare and want to review my options.",
    href: "/medicare/medicare-advantage-request",
    icon: "clipboard" as const,
  },
  {
    title: "Under 65 (ACA) Health Insurance",
    description: "I need health coverage before Medicare.",
    href: "/aca",
    icon: "heart" as const,
  },
  {
    title: "Ancillary Coverage",
    description: "Dental, vision, hearing, hospital indemnity and more.",
    href: "/ancillary",
    icon: "shield" as const,
  },
  {
    title: "Helping a Family Member",
    description: "I'm helping a loved one find coverage.",
    href: "/family-help",
    icon: "users" as const,
  },
  {
    title: "Speak With a Licensed Agent",
    description: "Let's connect for personal guidance.",
    href: "/contact",
    icon: "phone" as const,
  },
];

const states = [
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "South Carolina", abbr: "SC" },
  { name: "North Carolina", abbr: "NC" },
  { name: "Texas", abbr: "TX" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Washington", abbr: "WA" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Ohio", abbr: "OH" },
  { name: "Michigan", abbr: "MI" },
  { name: "Louisiana", abbr: "LA" },
];

const values = [
  { label: "Integrity First", icon: "shield" as const },
  { label: "People Over Profits", icon: "heart" as const },
  { label: "Excellence in Service", icon: "star" as const },
  { label: "Stewardship", icon: "pin" as const },
  { label: "Faith in Action", icon: "cross" as const },
];

const whyItems = [
  { label: "Personal Guidance", icon: "person" as const },
  { label: "Licensed in 12 States", icon: "pin" as const },
  { label: "No Pressure. Clear Guidance.", icon: "shield" as const },
  { label: "Ongoing Support", icon: "phone" as const },
];

const testimonials = [
  {
    quote: "The guidance made the entire Medicare process simple and stress-free.",
    name: "Linda S.",
  },
  {
    quote: "Excellent service and always available when I have questions.",
    name: "James R.",
  },
  {
    quote: "Saved me money and found a plan that fits my needs perfectly.",
    name: "Susan M.",
  },
];

export default function HomePageClient() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vital Edge Insurance",
    url: absoluteUrl("/"),
    description:
      "Premium, compliant health insurance guidance for Medicare, ACA Marketplace, and ancillary coverage.",
  };

  return (
    <div className="bg-white text-[var(--ve-text)]">
      <section className="premium-hero relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <picture className="block h-full w-full">
            <img
              src="/images/hero/vital-edge-goa-beach-hero.png"
              alt=""
              className="h-full w-full object-cover object-[center_top] md:object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,238,1)_0%,rgba(255,247,232,0.98)_50%,rgba(255,247,232,0.74)_78%,rgba(255,247,232,0.48)_100%)] md:bg-[linear-gradient(90deg,rgba(255,249,238,0.98)_0%,rgba(255,247,232,0.82)_38%,rgba(255,247,232,0.24)_66%,rgba(0,55,63,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/75 to-transparent" />
        </div>

        <Container>
          <div className="flex min-h-[600px] items-center pb-2 pt-10 md:min-h-[680px] md:pb-12 md:pt-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionReveal}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-[52rem]"
            >
              <p className="font-sans text-[0.78rem] font-extrabold uppercase leading-5 tracking-[0.12em] text-[var(--ve-teal)] md:text-xs md:tracking-[0.16em]">
                Personal guidance. Biblical principles. Real people.
              </p>
              <h1 className="mt-4 font-display text-[clamp(3.1rem,7vw,6rem)] font-bold leading-[0.95] tracking-normal text-[var(--ve-teal)]">
                Vital Edge Insurance
              </h1>
              <p className="mt-4 font-display text-[clamp(1.55rem,2.4vw,2.25rem)] italic leading-tight text-[#8d611f] md:text-[var(--ve-gold)]">
                Guidance with Integrity. Coverage with Purpose.
              </p>
              <p className="mt-5 max-w-[38rem] font-sans text-[1.08rem] font-semibold leading-7 text-slate-950 md:text-lg md:font-normal">
                We help individuals and families find health insurance solutions that fit their needs and their budget.
                Proudly serving Florida and 11 additional states.
              </p>

              <div className="mt-7 grid gap-3 md:grid-cols-[15rem_15rem_12rem]">
                <a
                  href={PLANENROLL}
                  {...externalLinkProps()}
                  className="premium-cta premium-cta-primary group"
                >
                  <span className="premium-cta-icon"><Icon name="shield" /></span>
                  <span>
                    <span className="block text-base">Start My Review</span>
                    <span className="block text-xs font-semibold opacity-90">Medicare Plan Review</span>
                    <span className="mt-2 block text-[0.66rem] font-medium opacity-80">Powered by SunFire</span>
                  </span>
                  <span className="premium-arrow">&#8594;</span>
                </a>
                <a href={UHONE_ANCILLARY} {...externalLinkProps()} className="premium-cta premium-cta-gold group">
                  <span className="premium-cta-icon"><Icon name="tooth" /></span>
                  <span>
                    <span className="block text-base">Dental, Vision &amp; Hospital Coverage</span>
                    <span className="block text-xs font-semibold opacity-90">UHC / Golden Rule Ancillary</span>
                  </span>
                  <span className="premium-arrow">&#8594;</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLeadModalOpen(true)}
                  className="premium-cta premium-cta-light group"
                >
                  <span className="premium-cta-icon"><Icon name="phone" /></span>
                  <span>
                    <span className="block text-base">Request a Call</span>
                    <span className="block text-xs font-semibold opacity-75">We&apos;ll contact you</span>
                  </span>
                  <span className="premium-arrow">&#8594;</span>
                </button>
              </div>

              <div className="mt-5 hidden rounded-2xl border border-white/55 bg-white/55 p-4 font-sans shadow-[0_20px_60px_rgba(10,50,60,0.12)] backdrop-blur-md sm:block md:rounded-none md:border-x-0 md:bg-white/40 md:px-0 md:shadow-none">
                <div className="flex gap-3 text-[var(--ve-teal)]">
                  <Icon name="clipboard" className="mt-1 h-7 w-7 shrink-0 text-[var(--ve-gold)]" />
                  <p className="text-sm font-semibold leading-6 text-slate-900 md:text-base">
                    Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.
                    <span className="block text-slate-800">- Colossians 3:23</span>
                  </p>
                </div>
                <div className="mt-4 hidden gap-2 text-xs font-semibold text-[var(--ve-teal)] sm:grid sm:grid-cols-2 lg:grid-cols-5">
                  {values.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 border-[var(--ve-gold)]/25 py-1 lg:border-l lg:pl-3 first:lg:border-l-0">
                      <Icon name={item.icon} className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 hidden font-sans text-xs text-slate-700 sm:block">
                  Plan availability varies by state, county, ZIP code, carrier appointment, eligibility, and enrollment
                  period.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="relative z-10 bg-white pb-8">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionReveal}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="-mt-2 md:-mt-8"
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[var(--ve-gold)]/45" />
              <h2 className="text-center font-display text-[clamp(1.7rem,2.4vw,2.35rem)] font-bold text-[var(--ve-teal)]">
                How can we help you today?
              </h2>
              <span className="h-px w-12 bg-[var(--ve-gold)]/45" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {routingCards.map((item) => (
                <Link key={item.title} href={item.href} className="premium-route-card group">
                  <Icon name={item.icon} className="h-9 w-9 text-[var(--ve-teal)] transition group-hover:-translate-y-0.5" />
                  <span className="mt-3 block min-h-[2.55rem] text-sm font-extrabold leading-tight text-[var(--ve-teal)]">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-sm leading-5 text-slate-700">{item.description}</span>
                  <span className="mt-4 block text-2xl leading-none text-[var(--ve-teal)]">&#8594;</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-white py-5">
        <Container>
          <div className="premium-states-strip">
            <div className="flex items-center gap-4 lg:row-span-2">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--ve-teal)] text-white shadow-lg shadow-teal-950/20">
                <Icon name="pin" className="h-11 w-11" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-extrabold leading-tight text-[var(--ve-teal)]">
                  Serving Florida &amp; 11 Additional States
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-700">
                  Local roots. Wide reach. Personalized support wherever you are.
                </p>
              </div>
            </div>
            <div className="state-outline-grid" aria-label="Licensed state outline list">
              {states.map((state) => (
                <div key={state.name} className="state-outline-cell">
                  <div className="state-outline-art" aria-hidden="true">
                    {state.abbr}
                  </div>
                  <div className="state-outline-label">{state.name}</div>
                </div>
              ))}
            </div>
            <Link href="/licensed-states" className="justify-self-start font-sans text-sm font-bold text-[var(--ve-teal)] underline underline-offset-4 lg:col-start-2 lg:justify-self-end">
              View All Licensed States &amp; Disclosures -&gt;
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-white py-5">
        <Container>
          <div className="grid items-center gap-5 rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,247,247,0.86))] p-5 shadow-[0_18px_52px_rgba(15,23,42,0.07)] md:grid-cols-[auto_1fr_auto] md:p-6">
            <Image
              src="/images/team/patrick-mackin-iv.jpg"
              alt="Patrick Mackin IV, licensed health insurance agent"
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-cover shadow-[0_16px_34px_rgba(0,63,69,0.16)]"
            />
            <div>
              <p className="font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-gold)]">
                Client-first guidance
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-[var(--ve-teal)]">
                Patrick Mackin IV
              </h2>
              <p className="mt-2 max-w-3xl font-sans text-sm leading-7 text-slate-700">
                Patrick keeps the process patient, clear, and privacy-conscious. His role is to help clients understand
                their options, ask better questions, and move forward only when the next step makes sense.
              </p>
            </div>
            <Link href="/about" className="premium-small-button premium-small-button-light">
              About Vital Edge
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-white py-10">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-3xl bg-[var(--ve-teal)] text-white shadow-[0_30px_80px_rgba(0,63,69,0.22)]">
              <div className="relative p-7 md:p-9">
                <div className="absolute inset-0 opacity-25">
                  <Image src="/images/hero/vital-edge-goa-beach-hero.png" alt="" fill className="object-cover object-center" sizes="50vw" />
                  <div className="absolute inset-0 bg-[var(--ve-teal)]/70" />
                </div>
                <div className="relative">
                  <h2 className="max-w-sm font-display text-3xl font-bold leading-tight">
                    Why Clients Choose Vital Edge Insurance
                  </h2>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {whyItems.map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20">
                          <Icon name={item.icon} className="h-8 w-8" />
                        </div>
                        <div className="mt-3 text-sm font-bold leading-tight">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-1">
              <div className="flex items-center justify-between px-3 pb-4">
                <h2 className="font-display text-2xl font-bold text-[var(--ve-teal)]">What Our Clients Are Saying</h2>
                <Link href="/referrals" className="text-sm font-bold text-[var(--ve-teal)]">View All Reviews -&gt;</Link>
              </div>
              <div className="grid gap-3">
                {testimonials.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <div className="text-xl tracking-[0.12em] text-[var(--ve-gold)]">*****</div>
                    <p className="mt-2 text-sm italic leading-6 text-slate-800">&quot;{item.quote}&quot;</p>
                    <div className="mt-3 text-xs font-bold text-[var(--ve-teal)]">- {item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef7f7_100%)] py-12">
        <Container>
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:flex md:items-center md:justify-between md:gap-8 md:p-9">
            <div>
              <h2 className="font-display text-3xl font-bold text-[var(--ve-teal)]">No Pressure. Clear Guidance.</h2>
              <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-slate-700">
                Start with education, privacy-safe intake, and a licensed human handoff. Vital Edge does not enroll,
                recommend plans, or collect sensitive identifiers autonomously.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
              <a href={PLANENROLL} {...externalLinkProps()} className="premium-small-button premium-small-button-primary">
                Start My Review
              </a>
              <a href={UHONE_ANCILLARY} {...externalLinkProps()} className="premium-small-button premium-small-button-gold">
                Dental, Vision &amp; Hospital Coverage
              </a>
              <button type="button" onClick={() => setLeadModalOpen(true)} className="premium-small-button premium-small-button-light">
                Request a Call
              </button>
            </div>
          </div>
        </Container>
      </section>

      <Suspense fallback={null}>
        <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
      </Suspense>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
