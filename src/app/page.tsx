"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { TrustStrip } from "@/components/TrustStrip";
import { LeadModal } from "@/components/LeadModal";
import { externalLinkProps, LINKEDIN_COMPANY_PUBLIC, LINKEDIN_PERSONAL } from "@/lib/externalLinks";
import { absoluteUrl, site } from "@/lib/site";

const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const offerings = [
  {
    title: "ACA Marketplace (HealthCare.gov)",
    description: "Eligibility and subsidy education, plan timing, and enrollment support.",
    href: "/aca",
    image: {
      mobileSrc: "/images/offerings/aca/aca-family-hero-1x1.jpg",
      desktopSrc: "/images/offerings/aca/aca-family-hero-4x3.jpg",
      alt: "ACA Marketplace guidance for families",
    },
  },
  {
    title: "Medicare Guidance",
    description: "General Medicare education. Plan-specific discussions require a Scope of Appointment.",
    href: "/medicare",
    image: {
      mobileSrc: "/images/offerings/medicare/medicare-retirement-hero-1x1.jpg",
      desktopSrc: "/images/offerings/medicare/medicare-retirement-hero-4x3.jpg",
      alt: "Medicare guidance for retirement planning",
    },
  },
  {
    title: "Medicare Supplement (Medigap)",
    description: "Help understanding enrollment timing and what to compare before you apply.",
    href: "/medicare",
    image: {
      mobileSrc: "/images/offerings/medicare/medicare-retirement-hero-1x1.jpg",
      desktopSrc: "/images/offerings/medicare/medicare-retirement-hero-4x3.jpg",
      alt: "Medigap supplemental coverage guidance",
    },
  },
  {
    title: "ICHRA",
    description: "Guidance for employers and employees navigating defined contribution coverage.",
    href: "/ichra",
    image: {
      mobileSrc: "/images/offerings/group/group-legacy-hero-1x1.jpg",
      desktopSrc: "/images/offerings/group/group-legacy-hero-4x3.jpg",
      alt: "ICHRA guidance for employers and teams",
    },
  },
  {
    title: "Off-Exchange Options",
    description: "Alternatives when Marketplace coverage is not the right fit.",
    href: "/off-exchange",
    image: {
      mobileSrc: "/images/offerings/aca/aca-family-hero-1x1.jpg",
      desktopSrc: "/images/offerings/aca/aca-family-hero-4x3.jpg",
      alt: "Off-exchange coverage alternatives",
    },
  },
  {
    title: "Small Group",
    description: "Decision support for small employers evaluating group coverage.",
    href: "/services",
    image: {
      mobileSrc: "/images/offerings/group/group-legacy-hero-1x1.jpg",
      desktopSrc: "/images/offerings/group/group-legacy-hero-4x3.jpg",
      alt: "Small group coverage guidance",
    },
  },
];

const stats = [
  { label: "Local focus", value: "Florida-wide capability" },
  { label: "Privacy-first intake", value: "No SSN or MBI in chat" },
  { label: "Guidance style", value: "Clear, documented next steps" },
  { label: "Service area", value: "Duval + St. Johns focus" },
];

const faqs = [
  {
    question: "What do you need from me?",
    answer: "ZIP code, preferred contact method, and what you want help with.",
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
    answer: "Yes. A Scope of Appointment is required before plan-specific Medicare discussions.",
  },
];

export default function HomePage() {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vital Edge Insurance",
    url: absoluteUrl("/"),
    description: "Independent insurance guidance for Jacksonville, Florida.",
  };

  return (
    <div className="bg-white">
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/images/hero/hero-beach-16x9-1920x1080.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-white/90" />
        <div className="absolute inset-0 vei-tide" />
      </div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
        <Container className="relative">
          <div className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionReveal}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur">
                Florida-wide service with a Duval + St. Johns focus
              </p>
              <h1 className="text-white font-semibold tracking-tight text-[clamp(2.6rem,5vw,4.2rem)] leading-[1.05]">
                Confused by Health Insurance or Medicare? We make the next step clear.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/85">
                Independent guidance for individuals, families, and small businesses in Florida, with a local focus in
                Duval and St. Johns County.
              </p>
              <div className="text-sm font-semibold text-white/90">What you can expect</div>
              <div className="grid gap-3 text-sm text-white/85">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white" />
                  Clear guidance, no pressure
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white" />
                  Fast, respectful intake
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white" />
                  Help confirming timing, networks, and next steps
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${site.phoneE164}`}
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: "#35B228" }}
                >
                  Call/Text
                </a>
                <button
                  type="button"
                  onClick={() => setLeadModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  Talk with a licensed agent now
                </button>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  Chat
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  Resources
                </Link>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-white/90 backdrop-blur">
                <div className="text-xs font-semibold text-white">Founder</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/85">
                  <span className="font-medium text-white">Patrick Mackin IV</span>
                  <a
                    href={LINKEDIN_PERSONAL}
                    {...externalLinkProps()}
                    className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    Connect on LinkedIn
                  </a>
                  <a
                    href={LINKEDIN_COMPANY_PUBLIC}
                    {...externalLinkProps()}
                    className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15"
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
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
                  >
                    Talk with a licensed agent now
                  </button>
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
      <TrustStrip />

      <section className="relative border-t border-black/5">
        <div className="pointer-events-none absolute inset-0 bg-white/85 backdrop-blur" />
        <Container className="relative">
          <div className="py-12">
            <motion.h2
              className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold tracking-tight text-black"
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
                  className="rounded-2xl border border-black/10 bg-white p-3"
                >
                  <Link href={item.href} className="block">
                    <div className="relative overflow-hidden rounded-2xl aspect-square md:aspect-[4/3]">
                      <Image
                        src={item.image.desktopSrc}
                        alt={item.image.alt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/0" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <div className="text-lg font-semibold">{item.title}</div>
                        <div className="mt-1 text-sm opacity-95">{item.description}</div>
                      </div>
                    </div>
                  </Link>
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
              className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold tracking-tight text-black"
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
              className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold tracking-tight text-black"
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
                  copy: "We gather your goals, doctors, prescriptions (optional), and timing.",
                },
                {
                  title: "Compare",
                  copy: "We focus on what matters: networks, costs, and coverage priorities.",
                },
                {
                  title: "Enroll & Support",
                  copy: "We route you to the right enrollment path and stay available for follow-up.",
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
              className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold tracking-tight text-black"
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
              className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold tracking-tight text-black"
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
              <h2 className="mt-2 text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold tracking-tight">
                Start a contact request today.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
                We will guide you to the right next step and keep the process simple.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setLeadModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Talk with a licensed agent now
                </button>
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
      <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
