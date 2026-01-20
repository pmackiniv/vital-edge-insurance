"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { externalLinkProps, LINKEDIN_COMPANY_PUBLIC, LINKEDIN_PERSONAL } from "@/lib/externalLinks";

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const sectionTitleVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const services = [
  {
    title: "ACA Marketplace",
    description: "Eligibility guidance, enrollment timing, and subsidy basics with a clear next step.",
    href: "/aca",
  },
  {
    title: "Medicare (MA/MAPD/PDP)",
    description: "Routing for Medicare Advantage or Part D discussions when a Scope of Appointment is in place.",
    href: "/medicare",
  },
  {
    title: "Medicare Supplement",
    description: "Medigap education, timing considerations, and help preparing for carrier comparisons.",
    href: "/medicare",
  },
  {
    title: "ICHRA",
    description: "Defined contribution guidance for teams and employees navigating individual coverage.",
    href: "/ichra",
  },
  {
    title: "Off-Exchange",
    description: "Alternative plans when marketplace options are not the right fit for your household.",
    href: "/off-exchange",
  },
  {
    title: "Small Group",
    description: "Support for small group coverage decisions and renewals with a client-first approach.",
    href: "/services",
  },
];

const faqs = [
  {
    question: "What do you need from me?",
    answer: "A few basics: ZIP code, preferred contact method, and your goals. We avoid sensitive identifiers in chat.",
  },
  {
    question: "How do you get paid?",
    answer: "Compensation varies by carrier and product. We will always explain any commissions when relevant.",
  },
  {
    question: "Do you cover my county?",
    answer: "We focus on Jacksonville, Duval, and St. Johns counties and can confirm availability in your area.",
  },
  {
    question: "Can I enroll online?",
    answer: "Yes. We offer secure enrollment links and can guide you through the steps when appropriate.",
  },
  {
    question: "Medicare: do I need an SOA to discuss plan details?",
    answer: "Yes. We require a Scope of Appointment before discussing plan-specific details or options.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden">
        <Container>
          <div className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
                Jacksonville guidance with a local, client-first focus
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                High-trust health insurance guidance, without the noise.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-black/70">
                We help households and small businesses move from uncertainty to clarity with a tight, respectful process
                and an emphasis on what matters most.
              </p>

              <div className="mt-6 grid gap-3 text-sm text-black/70">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  Clear, plain-language guidance
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  Fast response with the right next step
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  Local focus for Duval and St. Johns counties
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Get help now
                </Link>
                <Link
                  href="/enroll"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  Enroll
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  Contact
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  Resources
                </Link>
              </div>

              <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
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
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="rounded-2xl border border-black/10 bg-gradient-to-br from-black/5 to-black/0 p-6"
            >
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-black">Start here</div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  A short, respectful intake helps us route you quickly without collecting sensitive identifiers.
                </p>
                <ol className="mt-5 space-y-3 text-sm text-black/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      1
                    </span>
                    Pick your topic and location.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      2
                    </span>
                    Answer a few clarifying questions.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      3
                    </span>
                    Get guidance and next steps.
                  </li>
                </ol>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Start with chat
                  </Link>
                  <Link
                    href={site.primaryCta.href}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
                  >
                    {site.primaryCta.label}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 bg-white">
        <Container>
          <div className="py-10 md:py-12">
            <motion.h2
              className="text-xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionTitleVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Trusted guidance, designed for clarity
            </motion.h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                {
                  title: "Local Jacksonville focus",
                  copy: "Guidance tailored to Duval and St. Johns counties.",
                },
                {
                  title: "Same-day response when available",
                  copy: "We aim to respond quickly during business hours.",
                },
                {
                  title: "Client-first guidance",
                  copy: "Clear explanations without pressure or noise.",
                },
                {
                  title: "Privacy-respecting intake",
                  copy: "No SSN or MBI collection in chat.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 12h16" />
                        <path d="M12 4v16" />
                      </svg>
                    </span>
                    <div className="text-sm font-semibold text-black">{item.title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-black/70">{item.copy}</p>
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
              variants={sectionTitleVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Services and guidance
            </motion.h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              We help you understand options, timing, and next steps so you can make confident decisions.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <motion.div
                  key={service.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="rounded-2xl border border-black/10 bg-white p-6"
                >
                  <div className="text-sm font-semibold text-black">{service.title}</div>
                  <p className="mt-2 text-sm leading-6 text-black/70">{service.description}</p>
                  <Link href={service.href} className="mt-4 inline-flex text-sm font-semibold text-black">
                    Learn more →
                  </Link>
                </motion.div>
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
              variants={sectionTitleVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              A clear three-step process
            </motion.h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Clarify",
                  copy: "We gather the basics: needs, doctors, medications, and timing.",
                },
                {
                  title: "Compare",
                  copy: "We focus on what matters most: network, cost, and coverage fit.",
                },
                {
                  title: "Enroll & Support",
                  copy: "We route you to enrollment links and stay available for follow-up.",
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
          <div className="py-14">
            <motion.h2
              className="text-2xl font-semibold tracking-tight text-black"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionTitleVariants}
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
              variants={sectionTitleVariants}
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
            <div className="rounded-2xl bg-black p-8 text-white md:p-10">
              <div className="text-sm font-semibold text-white/80">Ready to begin?</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Start with the chat.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
                We will route you to the right next step without collecting sensitive identifiers.
              </p>
              <div className="mt-6">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
                >
                  Start with the chat
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
