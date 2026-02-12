import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { absoluteUrl, site } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";

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
      "The ACA Marketplace is the federal platform where eligible individuals and families can compare qualified health plans and apply for coverage. Plans are offered by private carriers and can vary by county, network, and benefit design. Starting with a simple checklist helps you compare options more confidently.",
    learnMoreHref: "/resources#aca-subsidies-overview",
    learnMoreLabel: "Learn more about ACA Marketplace basics",
  },
  {
    question: "What is a subsidy and how does it work?",
    answer:
      "A subsidy is financial assistance that may reduce monthly premium costs and, in some cases, out-of-pocket expenses for eligible households. Eligibility depends on household size, income estimates, and filing status, and final amounts can change when income changes. Subsidy outcomes are determined by the official application process.",
    learnMoreHref: "/resources#aca-subsidies-overview",
    learnMoreLabel: "Learn more about subsidy basics",
  },
  {
    question: "When can I enroll in ACA Marketplace coverage?",
    answer:
      "Enrollment usually happens during Open Enrollment, and some life events may create a Special Enrollment Period. Timing windows and document requirements can vary by event type, so it is important to confirm deadlines early. Submitting complete information quickly can help prevent coverage gaps.",
    learnMoreHref: "/aca/sep",
    learnMoreLabel: "Learn more about Special Enrollment timing",
  },
  {
    question: "What documents should I prepare before applying?",
    answer:
      "Most applications are easier when you gather household member details, income information, and current coverage status in advance. Keeping digital and paper copies of supporting documents can reduce delays if verification is requested. A preparation checklist helps keep the submission process organized.",
    learnMoreHref: "/resources#what-to-bring",
    learnMoreLabel: "Learn more about what to bring",
  },
  {
    question: "What happens if my income changes during the year?",
    answer:
      "Income changes should be reported so your Marketplace application can be updated with current information. Updates may affect financial assistance amounts and your year-end tax reconciliation. Prompt updates help reduce unexpected balances at tax time.",
    learnMoreHref: "/contact",
    learnMoreLabel: "Learn more about reporting updates",
  },
  {
    question: "How do I choose a plan without guessing?",
    answer:
      "Compare plan options by looking at provider network access, prescription needs, monthly premiums, and expected out-of-pocket costs. The goal is to match coverage details to your usage patterns, not just pick the lowest monthly number. A documented comparison checklist can make decisions clearer.",
    learnMoreHref: "/resources#marketplace-sep-checklist",
    learnMoreLabel: "Learn more about plan comparison checklists",
  },
  {
    question: "Can dependents be included on the same application?",
    answer:
      "In many situations, dependents can be included in one household application when eligibility rules are met. Household composition and tax filing relationships can influence available options and assistance levels. Accurate household information is important before submission.",
    learnMoreHref: "/contact",
    learnMoreLabel: "Learn more about household applications",
  },
  {
    question: "Can I keep my current doctor on an ACA plan?",
    answer:
      "Doctor participation depends on the plan network available in your county and on the provider's current contracts. Before enrolling, verify that your preferred doctors, hospitals, and pharmacies are in-network for the specific plan you are considering. Network checks are an important part of plan review.",
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ACA Marketplace",
        item: absoluteUrl("/aca"),
      },
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
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            ACA Marketplace help in Jacksonville, FL
          </h1>
          <p className="text-black/70">
            Education-first guidance for HealthCare.gov enrollment, eligibility questions, and timeline planning. We
            explain how the process works and help you prepare the right information before you apply.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)]"
            >
              Request guidance
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
            >
              Chat with our team
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">ACA Marketplace health insurance in Florida</h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-black/75">
            <p>
              ACA Marketplace coverage gives Florida residents a way to compare qualified individual and family health
              plans through HealthCare.gov. Plans are offered by private carriers and vary by county, provider network,
              and cost-sharing structure. Reviewing options by care usage and provider access often gives a clearer
              starting point than premium alone.
            </p>
            <p>
              Financial assistance may be available for eligible households, but final eligibility and amounts are set
              by the official application and reconciliation process. Enrollment usually happens during Open Enrollment,
              while certain life events may create a Special Enrollment opportunity. Keeping income and household
              details current helps avoid avoidable delays and surprises.
            </p>
            <p>
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
              title: "Enrollment timing",
              body: "Understand Open Enrollment and Special Enrollment Periods with clear date checklists.",
            },
            {
              title: "Income & household",
              body: "Review what counts toward household size and estimated income for eligibility.",
            },
            {
              title: "Application prep",
              body: "Gather documents and avoid common submission delays.",
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
            <h2 className="text-sm font-semibold text-black">Checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Household member details and dates of birth.</li>
              <li>Recent income documents or estimates.</li>
              <li>Current coverage status and recent changes.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-only guidance</h2>
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

        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-black">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="text-black/70 hover:text-black" href="/resources#aca-subsidies-overview">ACA subsidies overview</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#marketplace-sep-checklist">Marketplace SEP checklist</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#what-to-bring">What to bring</Link>
            <Link className="text-black/70 hover:text-black" href="/aca/sep">ACA SEP overview</Link>
          </div>
        </div>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight text-black">Frequently asked questions</h2>
          <div className="space-y-4">
            {acaFaqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-base font-semibold text-black">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-black/75">{item.answer}</p>
                <Link
                  className="mt-2 inline-flex text-sm font-medium text-[var(--brand-blue)] underline"
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
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd, faqJsonLd]} />
    </Container>
  );
}
