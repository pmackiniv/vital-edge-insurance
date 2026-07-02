import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { PLANENROLL } from "@/lib/externalLinks";
import { absoluteUrl, site } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Medicare Help in Jacksonville, FL | Medicare Supplement & Medigap Guidance",
  description:
    "Vital Edge Insurance provides Medicare education, Medicare Supplement (Medigap), and Medicare Advantage guidance in Jacksonville, Duval County, and St. Johns County.",
  alternates: {
    canonical: absoluteUrl("/medicare"),
  },
  openGraph: {
    title: "Medicare Help in Jacksonville, FL | Vital Edge Insurance",
    description:
      "Licensed Medicare guidance for Jacksonville residents. Education on Medicare Supplement, Medigap, Part D, and enrollment timing.",
    url: absoluteUrl("/medicare"),
  },
};

const medicareFaqItems = [
  {
    question: "What is the difference between Medicare Advantage and Medigap?",
    answer:
      "Medicare Advantage plans combine hospital and medical coverage through private insurers and often use provider networks. Medigap works with Original Medicare to help cover out-of-pocket costs and does not replace Part A or Part B. The right path depends on your provider access preferences, budget, and timing.",
    learnMoreHref: "/medicare/medigap",
    learnMoreLabel: "Learn more about Medigap basics",
  },
  {
    question: "Do I need Part D prescription drug coverage?",
    answer:
      "Part D helps cover eligible prescription medications and can be important even when current prescriptions are limited. Enrollment timing matters because delayed enrollment may create future penalties in some situations. A licensed review can confirm how drug coverage timing applies to your circumstance.",
    learnMoreHref: "/resources#part-d-basics",
    learnMoreLabel: "Learn more about Part D basics",
  },
  {
    question: "When can I enroll in Medicare coverage?",
    answer:
      "Most people start during their Initial Enrollment Period around age 65. Other windows can include Annual Enrollment and certain Special Enrollment opportunities when qualifying events happen. Timing is case-specific, so confirm your dates before you submit an application.",
    learnMoreHref: "/contact",
    learnMoreLabel: "Learn more with a licensed follow-up",
  },
  {
    question: "What if I am still working and have employer coverage?",
    answer:
      "If you still have employer group health coverage, Medicare decisions can depend on employer size and how your current plan coordinates benefits. Some people enroll in Part A first, while others need to plan Part B timing carefully to avoid gaps. Reviewing employment coverage details early helps reduce enrollment mistakes.",
    learnMoreHref: "/contact",
    learnMoreLabel: "Learn more about employer-coverage coordination",
  },
  {
    question: "How do provider networks work with Medicare Advantage?",
    answer:
      "Many Medicare Advantage plans use network structures such as HMO or PPO arrangements, which can affect where you receive covered care. Out-of-network rules vary by plan type and service category. Checking provider participation before enrollment helps avoid disruption.",
    learnMoreHref: "/resources#medicare-coverage-pathways",
    learnMoreLabel: "Learn more about coverage pathways",
  },
  {
    question: "What are referrals and prior authorization in Medicare plans?",
    answer:
      "Some plans require referrals for specialist visits, and some services may need prior authorization before coverage applies. Requirements differ by carrier and plan design, so details should be verified before care is scheduled. Understanding these rules can help prevent delays and billing surprises.",
    learnMoreHref: "/resources#new-to-medicare",
    learnMoreLabel: "Learn more in the new-to-Medicare primer",
  },
  {
    question: "What happens if I move to another county in Florida?",
    answer:
      "A move can change available plans, networks, and enrollment options. You may qualify for a Special Enrollment opportunity depending on your current coverage and timing. Updating your address and reviewing plan availability quickly helps maintain continuity.",
    learnMoreHref: "/contact",
    learnMoreLabel: "Learn more about moving-related next steps",
  },
  {
    question: "How can I compare Medicare options safely?",
    answer:
      "Start with your doctors, medications, budget, and travel patterns, then compare those needs against plan features and enrollment timing. Keep copies of notices and use a documented checklist before making decisions. For plan-specific guidance, schedule licensed follow-up so required disclosures and scope controls are in place.",
    learnMoreHref: "/schedule",
    learnMoreLabel: "Learn more by scheduling a call",
  },
];

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/medicare"),
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: "Florida",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Medicare guidance",
    serviceType: "Medicare education",
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    areaServed: "Florida",
    url: absoluteUrl("/medicare"),
    description:
      "Education-first Medicare guidance for timing, coverage basics, and next steps. Plan-specific discussions require a Scope of Appointment.",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Medicare",
        item: absoluteUrl("/medicare"),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: medicareFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Medicare"
        title="Medicare Guidance"
        subtitle="Clear, neutral Medicare education for timing, coverage basics, and next steps. Plan-specific discussions require a Scope of Appointment."
        actions={[
          { label: "Start My Review", href: PLANENROLL, kind: "primary", external: true },
          { label: "D-SNP Education", href: "/medicare/d-snp", kind: "gold" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          We do not offer every plan available in your area. Any information we provide is limited to those plans we do
          offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
        <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:p-8">
          <h2 className="font-display text-3xl font-bold tracking-normal text-[var(--ve-teal)]">Medicare in Florida: your options</h2>
          <div className="mt-4 space-y-3 font-sans text-sm leading-7 text-slate-700">
            <p>
              Medicare generally starts with Part A and Part B, known as Original Medicare. Original Medicare helps with hospital and medical services, and many people add separate coverage to reduce out-of-pocket exposure.
              Medicare Advantage plans are an alternative way to receive Medicare benefits through private carriers, while Medigap works alongside Original Medicare rather than replacing it.
            </p>
            <p>
              Part D prescription drug coverage can be added to help with medication costs, and timing decisions are important to avoid future enrollment issues.
              Network access, referral rules, and prior authorization can vary by plan design, so comparing options should include provider and pharmacy checks.
            </p>
            <p>
              If you are still working or recently changed coverage, enrollment windows may differ from standard age-based timelines.
              For next steps, you can{" "}
              <Link className="underline" href="/contact">
                request a callback
              </Link>
              ,{" "}
              <Link className="underline" href="/schedule">
                schedule a call
              </Link>
              , or review{" "}
              <Link className="underline" href="/enroll">
                enrollment links
              </Link>
              .
            </p>
          </div>
        </section>

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
            <div key={item.title} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <div className="text-sm font-extrabold text-[var(--ve-teal)]">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">What to prepare</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Preferred contact method and timing.</li>
              <li>List of doctors and medications for general guidance.</li>
              <li>Any recent Medicare or coverage notices.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(228,246,247,0.92),rgba(255,255,255,0.94))] p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Scope of Appointment</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Plan‑specific Medicare discussions require a Scope of Appointment. We can provide education first and help
              coordinate the proper next steps.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#new-to-medicare">New to Medicare</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#medicare-coverage-pathways">Coverage pathways</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#part-d-basics">Part D basics</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/medicare/medigap">Medigap basics</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/medicare/snp">C-SNP & D-SNP</Link>
          </div>
        </div>

        <section className="space-y-5">
          <h2 className="font-display text-3xl font-bold tracking-normal text-[var(--ve-teal)]">Frequently asked questions</h2>
          <div className="space-y-4">
            {medicareFaqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.07)]">
                <h3 className="text-base font-extrabold text-[var(--ve-teal)]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.answer}</p>
                <Link className="mt-2 inline-flex text-sm font-bold text-[var(--ve-teal)] underline underline-offset-4" href={item.learnMoreHref}>
                  {item.learnMoreLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <LeadCtaSection
          eyebrow="Medicare education"
          title="Get clear Medicare guidance from a licensed agent."
          description={`We provide education first, then help you schedule plan-specific information by appointment, call/text, or email ${site.email}.`}
          ctaLabel="Request Medicare guidance"
        />
      </div>
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd, faqJsonLd]} />
    </Container>
    </>
  );
}
