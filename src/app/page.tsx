"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { TrustStrip } from "@/components/TrustStrip";
import { Suspense } from "react";
import { LeadModal } from "@/components/LeadModal";
import { GetInTouchSection } from "@/components/GetInTouchSection";
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
    iconSrc: "/images/offerings/aca.svg",
    image: {
      mobileSrc: "/images/offerings/daytona-beach.png",
      desktopSrc: "/images/offerings/daytona-beach.png",
      alt: "Florida coastline at sunset",
    },
  },
  {
    title: "Medicare Guidance",
    description: "General Medicare education. Plan-specific discussions require a Scope of Appointment.",
    href: "/medicare",
    iconSrc: "/images/offerings/medicare.svg",
    image: {
      mobileSrc: "/images/offerings/tampa-sunset.png",
      desktopSrc: "/images/offerings/tampa-sunset.png",
      alt: "Calm Florida skyline at sunset",
    },
  },
  {
    title: "Medicare Supplement (Medigap)",
    description: "Help understanding enrollment timing and what to compare before you apply.",
    href: "/medicare",
    iconSrc: "/images/offerings/medigap.svg",
    image: {
      mobileSrc: "/images/offerings/daytona-beach.png",
      desktopSrc: "/images/offerings/daytona-beach.png",
      alt: "Florida coastline at dusk",
    },
  },
  {
    title: "ICHRA",
    description: "Guidance for employers and employees navigating defined contribution coverage.",
    href: "/ichra",
    iconSrc: "/images/offerings/ichra.svg",
    image: {
      mobileSrc: "/images/offerings/florida-night.png",
      desktopSrc: "/images/offerings/florida-night.png",
      alt: "Florida city skyline after sunset",
    },
  },
  {
    title: "Off-Exchange Options",
    description: "Alternatives when Marketplace coverage is not the right fit.",
    href: "/off-exchange",
    iconSrc: "/images/offerings/off-exchange.svg",
    image: {
      mobileSrc: "/images/offerings/tampa-sunset.png",
      desktopSrc: "/images/offerings/tampa-sunset.png",
      alt: "Florida skyline in warm light",
    },
  },
  {
    title: "Small Group",
    description: "Decision support for small employers evaluating group coverage.",
    href: "/small-group",
    iconSrc: "/images/offerings/small-group.svg",
    image: {
      mobileSrc: "/images/offerings/florida-night.png",
      desktopSrc: "/images/offerings/florida-night.png",
      alt: "City skyline with evening lights",
    },
  },
];

const regionalHighlights = [
  {
    title: "Duval County (Jacksonville)",
    description: "Local guidance with quick access to intake, timelines, and documentation help.",
    href: "/duval-county",
    image: {
      src: "/images/cities/jacksonville.png",
      alt: "Jacksonville skyline at sunset",
    },
  },
  {
    title: "Miami-Dade County",
    description: "Regional support for Miami-area coverage questions and enrollment timing.",
    href: "/miami",
    image: {
      src: "/images/cities/miami.png",
      alt: "Miami skyline at dusk",
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
    question: "Do you collect SSN or Medicare ID in chat?",
    answer: "No. We keep chat privacy-first and avoid sensitive identifiers.",
  },
  {
    question: "What happens after I submit a request?",
    answer: "We review your request and respond with the next compliant step, usually by phone or email.",
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
    description: "Independent insurance guidance for Duval County and Miami-Dade County, Florida.",
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="relative">
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
                <Link
                  href="/contact"
                  className="btn px-6 py-3 text-base text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: "#35B228", color: "#ffffff" }}
                >
                  Get Personalized Medicare Advice
                </Link>
              </div>
              <div className="text-sm text-white/80">
                Prefer a callback?{" "}
                <button type="button" onClick={() => setLeadModalOpen(true)} className="underline">
                  Request one here
                </button>
                .
              </div>
              <div className="text-xs text-white/75">
                Need immediate help?{" "}
                <a href={`tel:${site.phoneE164}`} className="underline">
                  Call or text {site.phoneDisplay}
                </a>
                . Prefer self-service?{" "}
                <Link href="/enroll" className="underline">
                  View enrollment links
                </Link>
                . Third-party enrollment partners. Licensed guidance is available if you prefer to enroll with help.
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-white/90 backdrop-blur">
                <div className="text-xs font-semibold text-white">Agency credentials</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/85">
                  <span className="font-medium text-white">Licensed Florida Health Insurance Agency</span>
                  <a
                    href={LINKEDIN_PERSONAL}
                    {...externalLinkProps()}
                    className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    Agency updates on LinkedIn
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
                  <Link
                    href="/contact"
                    className="btn btn-primary px-4 py-2 text-sm"
                  >
                    Get personalized advice
                  </Link>
                </div>
                <div className="mt-3 text-xs text-black/60">
                  Prefer a callback?{" "}
                  <button type="button" onClick={() => setLeadModalOpen(true)} className="underline">
                    Request one
                  </button>
                  .
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-transparent">
        <Container>
          <div className="py-10">
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/75">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Answer</div>
              <p className="mt-3 leading-7">
                Vital Edge Insurance is a Jacksonville, Florida insurance guidance agency. We provide education on ACA
                Marketplace, Medicare, ICHRA, and small group coverage, then route you to a licensed agent for plan-specific
                decisions. Call or text {site.phoneDisplay} or use chat to get a clear next step.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative border-t border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-black/35 backdrop-blur" />
        <Container className="relative">
          <div className="py-12">
            <motion.h2
              className="text-[clamp(2.1rem,3vw,3rem)] font-semibold tracking-tight text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={sectionReveal}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Offerings
            </motion.h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/85">
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
                      <div className="absolute left-4 top-4 rounded-2xl bg-white/95 p-2 shadow-sm">
                        <Image src={item.iconSrc} alt="" width={36} height={36} />
                      </div>
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

      <section className="border-t border-white/10 bg-transparent">
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

      <TrustStrip />

      <GetInTouchSection />

      <section className="border-t border-white/10 bg-transparent">
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

      <section className="border-t border-white/10 bg-transparent">
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
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Link href="/duval-county" className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Duval County</div>
                <p className="mt-2 text-sm text-black/70">Jacksonville guidance and local service highlights.</p>
              </Link>
              <Link href="/miami" className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">Miami-Dade County</div>
                <p className="mt-2 text-sm text-black/70">Miami guidance and enrollment timing support.</p>
              </Link>
              <Link href="/st-johns-county" className="rounded-2xl border border-black/10 bg-white p-6 hover:bg-black/5">
                <div className="text-sm font-semibold text-black">St. Johns County</div>
                <p className="mt-2 text-sm text-black/70">St. Augustine area guidance and resources.</p>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link className="text-black/70 hover:text-black" href="/small-group">Small Group</Link>
              <Link className="text-black/70 hover:text-black" href="/aca">ACA</Link>
              <Link className="text-black/70 hover:text-black" href="/medicare">Medicare</Link>
              <Link className="text-black/70 hover:text-black" href="/ichra">ICHRA</Link>
              <Link className="text-black/70 hover:text-black" href="/resources">Resources</Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-transparent">
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
              Regional focus: Duval + Miami-Dade
            </motion.h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              We provide education-first guidance with local context for Duval County and Miami-Dade County.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {regionalHighlights.map((item) => (
                <Link key={item.title} href={item.href} className="group rounded-2xl border border-black/10 bg-white p-3">
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
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
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-transparent">
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

      <section className="border-t border-white/10 bg-transparent">
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
                <Link
                  href="/contact"
                  className="btn px-5 py-3 text-sm text-white"
                  style={{ backgroundColor: "var(--brand-orange)" }}
                >
                  Start your contact request
                </Link>
              </div>
              <p className="mt-3 text-xs text-white/80">
                Prefer a callback?{" "}
                <button type="button" onClick={() => setLeadModalOpen(true)} className="underline">
                  Request one here
                </button>
                .
              </p>
              <p className="mt-3 text-xs text-white/80">
                Third-party enrollment partners. Licensed guidance is available if you prefer to enroll with help.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Suspense fallback={null}>
        <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
      </Suspense>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
