import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import {
  PremiumContentBand,
  PremiumDisclosure,
  PremiumFeatureGrid,
  PremiumInteriorHero,
} from "@/components/PremiumInteriorPage";
import { absoluteUrl, licensedStateNames, serviceAreaStatement } from "@/lib/site";

export const metadata: Metadata = {
  title: "Licensed Health Insurance States | Vital Edge Insurance",
  description:
    "Vital Edge Insurance provides licensed health insurance guidance for Florida, Georgia, South Carolina, North Carolina, Texas, Tennessee, Arizona, Washington, Pennsylvania, Ohio, Michigan, and Louisiana.",
  alternates: {
    canonical: absoluteUrl("/licensed-states"),
  },
};

const states = [...licensedStateNames];

const stateSearchIntents = states.map((state) => ({
  title: `Health insurance guidance in ${state}`,
  body: `Vital Edge Insurance can start with general education, coverage timing, and next-step guidance for residents in ${state}. Plan availability still depends on county, ZIP code, carrier appointment, eligibility, and enrollment period.`,
}));

const faqs = [
  {
    question: "Can Vital Edge Insurance help me if I live outside Florida?",
    answer:
      "Yes. Vital Edge Insurance is headquartered in Florida and serves clients across 12 states and growing. Availability still depends on your state, county, ZIP code, carrier appointment, eligibility, and enrollment timing.",
  },
  {
    question: "Can I get Medicare plan-specific guidance online?",
    answer:
      "The website provides general education. Plan-specific Medicare guidance requires licensed follow-up with Patrick Mackin IV and the required Medicare disclosures and scope controls.",
  },
  {
    question: "Can Vital Edge help with ACA or health insurance before Medicare?",
    answer:
      "Yes. Vital Edge provides education-first guidance for ACA Marketplace timing, subsidy basics, off-exchange questions, and related next steps where licensed and appropriate.",
  },
  {
    question: "Does being licensed in a state mean every plan is available?",
    answer:
      "No. Licensure does not mean every carrier or plan is available. Carrier appointment, county, ZIP code, eligibility, and enrollment period must still be confirmed.",
  },
];

export default function Page() {
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
    <>
      <PremiumInteriorHero
        eyebrow="Licensed State Footprint"
        title="Headquartered in Florida. Serving clients across 12 states and growing."
        subtitle={`${serviceAreaStatement} Every plan-specific review still starts with state, county, ZIP code, eligibility, and carrier-appointment checks.`}
        actions={[
          { label: "Request a Call", href: "/contact?topic=licensed-states", kind: "primary" },
          { label: "Medicare Guidance", href: "/medicare", kind: "gold" },
          { label: "Ancillary Coverage", href: "/ancillary", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Plan availability varies by state, county, ZIP code, carrier appointment, eligibility, and enrollment period.
          Licensure does not mean every carrier or plan is available in every location.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {states.map((state) => (
              <div
                key={state}
                className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-5 text-center shadow-[0_14px_36px_rgba(15,23,42,0.07)]"
              >
                <div className="mx-auto h-9 w-14 rounded-[50%] bg-gradient-to-br from-[var(--ve-teal)] to-[#7dbac0]" />
                <div className="mt-3 font-sans text-sm font-extrabold text-[var(--ve-teal)]">{state}</div>
              </div>
            ))}
          </div>

          <PremiumFeatureGrid
            features={[
              {
                title: "Local Roots",
                body: "Vital Edge is headquartered in Florida, with client-first guidance built for both local and out-of-state referrals.",
              },
              {
                title: "Wide Reach",
                body: "The licensed footprint supports families, referrals, and clients with coverage questions across additional states.",
              },
              {
                title: "Availability Check",
                body: "Carrier appointment, county, ZIP code, and enrollment timing still need to be confirmed before plan-specific guidance.",
              },
            ]}
          />

          <div className="space-y-5">
            <div>
              <h2 className="font-display text-3xl font-bold text-[var(--ve-teal)]">
                Health Insurance Guidance Across Licensed States
              </h2>
              <p className="mt-3 max-w-3xl font-sans text-sm leading-7 text-slate-700">
                These state pages and service signals help people find Vital Edge when searching for licensed health
                insurance guidance, Medicare education, ACA Marketplace help, ancillary coverage, and family support in
                the states Patrick serves.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {stateSearchIntents.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
                >
                  <h3 className="font-sans text-base font-extrabold text-[var(--ve-teal)]">{item.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-7 text-slate-700">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-[var(--ve-teal)]">Common Licensed-State Questions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
                >
                  <h3 className="font-sans text-base font-extrabold text-[var(--ve-teal)]">{item.question}</h3>
                  <p className="mt-2 font-sans text-sm leading-7 text-slate-700">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <PremiumContentBand title="Important disclosure" tone="teal">
            <p>
              We do not offer every plan available in your area. Any information we provide is limited to those plans we
              offer in your area. Please contact Medicare.gov or 1-800-MEDICARE for information on all Medicare options.
            </p>
          </PremiumContentBand>

          <LeadCtaSection
            eyebrow="Licensed states"
            title="Confirm guidance availability for your state and county."
            description="We can start with education and route to a licensed-agent follow-up when appropriate."
            ctaLabel="Request state guidance"
          />
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
