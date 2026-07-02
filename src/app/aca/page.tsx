import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import {
  PremiumContentBand,
  PremiumDisclosure,
  PremiumFeatureGrid,
  PremiumInteriorHero,
} from "@/components/PremiumInteriorPage";
import { StructuredData } from "@/components/StructuredData";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "ACA Marketplace Help in Jacksonville, FL | Vital Edge Insurance",
  description:
    "Vital Edge Insurance provides ACA Marketplace enrollment guidance in Jacksonville, Florida. Get clear education on HealthCare.gov timing, subsidy basics, and next steps for Duval, St. Johns, and nearby counties.",
  alternates: {
    canonical: absoluteUrl("/aca"),
  },
  openGraph: {
    title: "ACA Marketplace Help in Jacksonville, FL | Vital Edge Insurance",
    description:
      "Education-first ACA Marketplace guidance for Jacksonville residents, including enrollment timing, subsidy basics, and follow-up options.",
    url: absoluteUrl("/aca"),
  },
};

const acaFaqItems = [
  {
    question: "What is the ACA Marketplace?",
    answer:
      "The ACA Marketplace is the federal platform where eligible individuals and families can compare qualified health plans and apply for coverage. Plans are offered by private carriers and can vary by county, network, and benefit design.",
    learnMoreHref: "/resources#aca-subsidies-overview",
    learnMoreLabel: "Learn more about ACA Marketplace basics",
  },
  {
    question: "What is a subsidy and how does it work?",
    answer:
      "A subsidy is financial assistance that may reduce monthly premium costs and, in some cases, out-of-pocket expenses for eligible households. Eligibility depends on household size, income estimates, and filing status, and final amounts can change when income changes.",
    learnMoreHref: "/resources#aca-subsidies-overview",
    learnMoreLabel: "Learn more about subsidy basics",
  },
  {
    question: "When can I enroll in ACA Marketplace coverage?",
    answer:
      "Enrollment usually happens during Open Enrollment, and some life events may create a Special Enrollment Period. Timing windows and document requirements can vary by event type, so it is important to confirm deadlines early.",
    learnMoreHref: "/aca/sep",
    learnMoreLabel: "Learn more about Special Enrollment timing",
  },
  {
    question: "What documents should I prepare before applying?",
    answer:
      "Most applications are easier when you gather household member details, income information, and current coverage status in advance. Keeping digital and paper copies of supporting documents can reduce delays if verification is requested.",
    learnMoreHref: "/resources#what-to-bring",
    learnMoreLabel: "Learn more about what to bring",
  },
  {
    question: "Can I keep my current doctor on an ACA plan?",
    answer:
      "Doctor participation depends on the plan network available in your county and on the provider's current contracts. Before enrolling, verify that your preferred doctors, hospitals, and pharmacies are in-network for the specific plan you are considering.",
    learnMoreHref: "/resources#marketplace-sep-checklist",
    learnMoreLabel: "Learn more about network checks",
  },
];

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/aca"),
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: "Florida",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "ACA Marketplace guidance",
    serviceType: "ACA Marketplace enrollment guidance",
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    areaServed: "Florida",
    url: absoluteUrl("/aca"),
    description:
      "Education-first guidance for ACA Marketplace enrollment, eligibility questions, and timeline planning.",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "ACA Marketplace", item: absoluteUrl("/aca") },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: acaFaqItems.map((item) => ({
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
        eyebrow="Under 65 Health Insurance"
        title="ACA Marketplace Guidance"
        subtitle="Clear, education-first help for HealthCare.gov timing, subsidy basics, document prep, and next steps before you apply."
        actions={[
          { label: "Request ACA Guidance", href: "/contact?topic=aca", kind: "primary" },
          { label: "ACA SEP Overview", href: "/aca/sep", kind: "gold" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          ACA Marketplace availability, eligibility, subsidies, and plan details vary by state, county, household,
          income, carrier, provider network, and enrollment period. Not affiliated with or endorsed by Healthcare.gov or
          any government agency.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <PremiumContentBand title="ACA coverage with a calm, documented process">
            <div className="space-y-3">
              <p>
                ACA Marketplace coverage gives Florida residents a way to compare qualified individual and family health
                plans through HealthCare.gov. Plans are offered by private carriers and vary by county, provider network,
                and cost-sharing structure.
              </p>
              <p>
                Vital Edge keeps ACA visible but secondary to Medicare and ancillary coverage on the homepage. On this
                page, the focus is simple preparation: timing, household details, income estimates, current coverage,
                and provider checks before any plan-specific decision.
              </p>
            </div>
          </PremiumContentBand>

          <PremiumFeatureGrid
            features={[
              {
                title: "Enrollment Timing",
                body: "Understand Open Enrollment and Special Enrollment Periods with clear date and document checkpoints.",
              },
              {
                title: "Income & Household",
                body: "Prepare household size, estimated income, filing status, and current coverage information.",
              },
              {
                title: "Network Review",
                body: "Before choosing a plan, verify doctors, hospitals, prescriptions, and pharmacies against the specific option.",
              },
            ]}
          />

          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <PremiumContentBand title="What to prepare" tone="teal">
              <ul className="space-y-2">
                <li>Household member details and dates of birth.</li>
                <li>Recent income documents or estimates.</li>
                <li>Current coverage status and recent life changes.</li>
                <li>Preferred doctors, hospitals, prescriptions, and pharmacies.</li>
              </ul>
            </PremiumContentBand>

            <PremiumContentBand title="Helpful ACA resources">
              <div className="grid gap-3 text-sm">
                <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#aca-subsidies-overview">
                  ACA subsidies overview
                </Link>
                <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#marketplace-sep-checklist">
                  Marketplace SEP checklist
                </Link>
                <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#what-to-bring">
                  What to bring
                </Link>
                <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/aca/sep">
                  ACA SEP overview
                </Link>
              </div>
            </PremiumContentBand>
          </div>

          <section className="space-y-5">
            <h2 className="font-display text-3xl font-bold tracking-normal text-[var(--ve-teal)]">
              Frequently asked questions
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {acaFaqItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.07)]">
                  <h3 className="font-sans text-base font-extrabold text-[var(--ve-teal)]">{item.question}</h3>
                  <p className="mt-2 font-sans text-sm leading-6 text-slate-700">{item.answer}</p>
                  <Link
                    className="mt-3 inline-flex font-sans text-sm font-bold text-[var(--ve-teal)] underline underline-offset-4"
                    href={item.learnMoreHref}
                  >
                    {item.learnMoreLabel}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <LeadCtaSection
            eyebrow="ACA Marketplace"
            title="Get ACA Marketplace guidance and next steps."
            description="We explain the process and help you prepare for a licensed review."
            ctaLabel="Request ACA guidance"
          />
        </div>
      </Container>
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd, faqJsonLd]} />
    </>
  );
}
