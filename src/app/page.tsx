"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { externalLinkProps, LINKEDIN_COMPANY_PUBLIC, LINKEDIN_PERSONAL } from "@/lib/externalLinks";
import { absoluteUrl, site } from "@/lib/site";

const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const offerings = [
  {
    title: "ACA Marketplace",
    description: "Enrollment guidance, subsidy education, and plan timing clarity.",
    href: "/aca",
    image: "/offerings/aca.svg",
  },
  {
    title: "Medicare Guidance",
    description: "General Medicare education with SOA-required plan discussions.",
    href: "/medicare",
    image: "/offerings/medicare.svg",
  },
  {
    title: "Medigap",
    description: "Supplement education and enrollment timing support.",
    href: "/medicare",
    image: "/offerings/medigap.svg",
  },
  {
    title: "ICHRA",
    description: "Defined contribution guidance for employers and teams.",
    href: "/ichra",
    image: "/offerings/ichra.svg",
  },
  {
    title: "Off-Exchange",
    description: "Alternatives when marketplace coverage is not the right fit.",
    href: "/off-exchange",
    image: "/offerings/off-exchange.svg",
  },
  {
    title: "Small Group",
    description: "Decision support for small group health coverage.",
    href: "/services",
    image: "/offerings/small-group.svg",
  },
];

const stats = [
  { label: "Counties served", value: "Duval + St. Johns" },
  { label: "Response pace", value: "Same-day when available" },
  { label: "Intake style", value: "No SSN or MBI in chat" },
  { label: "Guidance focus", value: "Client-first clarity" },
];

const faqs = [
  {
    question: "What do you need from me?",
    answer: "ZIP code, preferred contact method, and goals. We keep intake light and respectful.",
  },
  {
    question: "How do you get paid?",
    answer: "Compensation varies by carrier and product. We disclose commissions when relevant.",
  },
  {
    question: "Do you cover my county?",
    answer: "We focus on Jacksonville, Duval, and St. Johns County and can confirm availability in your area.",
  },
  {
    question: "Can I enroll online?",
    answer: "Yes. We provide secure enrollment links when appropriate.",
  },
  {
    question: "Medicare: do I need an SOA to discuss plan details?",
    answer: "Yes. A Scope of Appointment is required before plan-specific discussions.",
  },
];

export default function HomePage() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vital Edge Insurance",
    url: absoluteUrl("/"),
    description: "Independent insurance guidance for Jacksonville, Florida.",
  };

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden">
        <Container>
          <div className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionReveal}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
                Independent insurance guidance for Jacksonville, Florida
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                Premium guidance for coverage decisions, built on clarity and speed.
              </h1>
              <p className="max-w-xl text-base leading-7 text-black/70">
                We help individuals, families, and small businesses move from uncertainty to confident next steps with a
                fast, respectful intake and a clean enrollment path.
              </p>
              <div className="grid gap-3 text-sm text-black/70">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  Clear guidance, no pressure
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  Fast response when available
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  Local focus with county-level support
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${site.phoneE164}`}
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
                >
                  Call/Text
                </a>
                <Link
                  href="/enroll"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Enroll
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  Chat
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  Resources
                </Link>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-xs font-semibold text-black">Founder</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-black/70">
                  <span className="font-medium text-black">Patrick Mackin IV</span>
                  <a
                    href={LINKEDIN_PERSONAL}
                    {...externalLinkProps()}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black hover:bg-black/5"
                  >
                    Connect on LinkedIn
                  </a>
                  <a
                    href={LINKEDIN_COMPANY_PUBLIC}
                    {...externalLinkProps()}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black hover:bg-black/5"
                  >
                    Vital Edge Insurance on LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-black/0 p-6"
            >
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-black">Start here</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  Quick intake and clear steps. We focus on education, routing, and privacy-first guidance.
                </p>
                <ol className="mt-5 space-y-3 text-sm text-black/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      1
                    </span>
                    Pick your topic and county.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      2
                    </span>
                    Share goals and contact preference.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      3
                    </span>
                    Receive guidance and next steps.
                  </li>
                </ol>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
                  >
                    Start with chat
                  </Link>
                  <a
                    href={`tel:${site.phoneE164}`}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
                  >
                    Call/Text
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-12">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Offerings
            </motion.h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              Comprehensive guidance across marketplace, Medicare education, employer plans, and small group coverage.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {offerings.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  <div className="relative h-40 w-full">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm font-semibold text-black">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-black/70">{item.description}</p>
                    <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-black">
                      Learn more →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-12">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Local guidance, clear next steps
            </motion.h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              Explore county-specific guidance and core services to find the right next step.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link href="/duval-county" className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Duval County</div>
                <p className="mt-2 text-sm text-black/70">Jacksonville guidance and local service highlights.</p>
              </Link>
              <Link href="/st-johns-county" className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">St. Johns County</div>
                <p className="mt-2 text-sm text-black/70">St. Augustine area guidance and resources.</p>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link className="text-black/70 hover:text-black" href="/services">Services</Link>
              <Link className="text-black/70 hover:text-black" href="/aca">ACA</Link>
              <Link className="text-black/70 hover:text-black" href="/medicare">Medicare</Link>
              <Link className="text-black/70 hover:text-black" href="/ichra">ICHRA</Link>
              <Link className="text-black/70 hover:text-black" href="/resources">Resources</Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Three-step process
            </motion.h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Clarify",
                  copy: "We gather your needs, doctor preferences, medications, and timing.",
                },
                {
                  title: "Compare",
                  copy: "We focus on what matters most: network, costs, and coverage priorities.",
                },
                {
                  title: "Enroll & Support",
                  copy: "We route you to enrollment and stay available for follow-up support.",
                },
              ].map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-black/10 bg-white p-6">
                  <div className="text-xs font-semibold text-black/60">Step {index + 1}</div>
                  <div className="mt-2 text-sm font-semibold text-black">{step.title}</div>
                  <p className="mt-2 text-sm leading-6 text-black/70">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-12">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Why clients choose us
            </motion.h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-black/10 bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-black/60">{stat.label}</div>
                  <div className="mt-3 text-sm font-semibold text-black">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Client feedback
            </motion.h2>
            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
              Client feedback coming soon.
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              FAQ
            </motion.h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-2xl border border-black/10 bg-white p-6">
                  <div className="text-sm font-semibold text-black">{item.question}</div>
                  <p className="mt-2 text-sm leading-6 text-black/70">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-14">
            <div className="rounded-2xl bg-[var(--brand-blue)] p-8 text-white md:p-10">
              <div className="text-sm font-semibold text-white/80">Ready to begin?</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Start a contact request today.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
                We will guide you to the right next step and keep the process simple.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Contact us
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Chat now
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
