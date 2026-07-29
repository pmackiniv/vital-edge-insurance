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
import {
  ALLSTATE_HEALTH_SOLUTIONS,
  externalLinkProps,
  UHONE_ANCILLARY,
} from "@/lib/externalLinks";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dental, Vision & Hospital Coverage | Vital Edge Insurance",
  description:
    "Ancillary coverage guidance for dental, vision, hearing, hospital indemnity, and related options. Licensed-agent follow-up from Vital Edge Insurance.",
  alternates: {
    canonical: absoluteUrl("/ancillary"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/ancillary"),
    title: "Dental, Vision & Hospital Coverage | Vital Edge Insurance",
    description:
      "Explore UnitedHealthcare and Allstate Health Solutions self-quote paths or request licensed ancillary coverage guidance.",
    siteName: "Vital Edge Insurance",
    images: [
      {
        url: absoluteUrl("/og.png"),
        width: 1200,
        height: 630,
        alt: "Vital Edge Insurance ancillary coverage guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dental, Vision & Hospital Coverage | Vital Edge Insurance",
    description:
      "Explore UnitedHealthcare and Allstate Health Solutions self-quote paths or request licensed ancillary coverage guidance.",
    images: [absoluteUrl("/og.png")],
  },
};

const faqs = [
  {
    question: "Can I get an ancillary coverage quote online?",
    answer:
      "Yes. Vital Edge provides direct links to the public UnitedHealthOne and Allstate Health Solutions quoting experiences. Each link opens a third-party carrier site where availability and quote details are determined.",
  },
  {
    question: "Does receiving a quote guarantee coverage?",
    answer:
      "No. Product availability, eligibility, pricing, benefits, exclusions, limitations, and underwriting requirements vary by carrier, product, state, and applicant. A quote does not guarantee that coverage will be issued.",
  },
  {
    question: "How do I decide which quote path to use?",
    answer:
      "You can explore either carrier's public quoting experience or request licensed guidance first. A useful review starts with the coverage gap you want to address, your state and ZIP code, your budget, and your existing coverage.",
  },
  {
    question: "Does ancillary coverage replace Medicare or major medical coverage?",
    answer:
      "Ancillary coverage is generally designed to address specific supplemental needs and should not be treated as a replacement for Medicare or comprehensive major medical coverage. Review the actual policy terms before applying.",
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
        eyebrow="Ancillary Coverage"
        title="Dental, Vision & Hospital Coverage"
        subtitle="A polished, practical review of supplemental coverage options that can support your broader health insurance strategy."
        actions={[
          { label: "Quote UnitedHealthcare Options", href: UHONE_ANCILLARY, kind: "primary", external: true },
          {
            label: "Quote Allstate Health Solutions",
            href: ALLSTATE_HEALTH_SOLUTIONS,
            kind: "gold",
            external: true,
          },
          { label: "Request Ancillary Guidance", href: "/contact?topic=ancillary", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Ancillary product availability, benefits, limitations, exclusions, underwriting, carrier appointment, and
          pricing vary by state, ZIP code, age, applicant, product, and carrier. Quote buttons open third-party carrier
          sites. This website provides education and intake only; a quote is not a recommendation or guarantee of
          coverage.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <section
            aria-labelledby="self-quote-heading"
            className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white/92 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-8"
          >
            <div className="max-w-3xl">
              <p className="font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ve-gold)]">
                Self-quote options
              </p>
              <h2
                id="self-quote-heading"
                className="mt-2 font-display text-3xl font-bold leading-tight tracking-normal text-[var(--ve-teal)]"
              >
                Explore available options through two carrier quoting destinations
              </h2>
              <p className="mt-3 font-sans text-sm leading-7 text-slate-700">
                Choose a carrier below to continue to its public quoting experience, or request licensed guidance if
                you would like help deciding which coverage category to explore.
              </p>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-[var(--ve-teal)]/10 bg-[#f5fbfb] p-6">
                <h3 className="font-sans text-lg font-extrabold text-[var(--ve-teal)]">
                  UnitedHealthcare options
                </h3>
                <p className="mt-3 font-sans text-sm leading-6 text-slate-700">
                  Explore currently available health and supplemental coverage categories through the UnitedHealthOne
                  quoting experience.
                </p>
                <a
                  href={UHONE_ANCILLARY}
                  {...externalLinkProps()}
                  className="premium-small-button premium-small-button-primary mt-5"
                >
                  Quote UnitedHealthcare Options
                </a>
              </article>

              <article className="rounded-2xl border border-[var(--ve-gold)]/20 bg-[#fff9ee] p-6">
                <h3 className="font-sans text-lg font-extrabold text-[var(--ve-teal)]">
                  Allstate Health Solutions
                </h3>
                <p className="mt-3 font-sans text-sm leading-6 text-slate-700">
                  Explore currently available health and supplemental coverage categories through the Allstate Health
                  Solutions quick-quote experience.
                </p>
                <a
                  href={ALLSTATE_HEALTH_SOLUTIONS}
                  {...externalLinkProps()}
                  className="premium-small-button premium-small-button-gold mt-5"
                >
                  Quote Allstate Health Solutions
                </a>
              </article>
            </div>

            <p className="mt-5 font-sans text-xs leading-5 text-slate-600">
              These are third-party quoting sites. Product availability, eligibility, pricing, benefits, exclusions,
              limitations, and underwriting requirements vary by carrier, product, state, and applicant. Starting or
              receiving a quote does not guarantee issuance or establish that a product is right for you.
            </p>
          </section>

          <div id="dental-vision-hearing" className="scroll-mt-28">
            <PremiumFeatureGrid
            features={[
              {
                title: "Dental, Vision & Hearing",
                body: "Understand how common supplemental benefits can fit alongside Medicare, ACA, or other health coverage.",
              },
              {
                title: "Hospital Indemnity",
                body: "Review general concepts for hospital-related cash benefits, waiting periods, exclusions, and limitations.",
              },
              {
                title: "Licensed Human Handoff",
                body: "Vital Edge routes inquiries to a licensed agent for carrier-specific details and next steps.",
              },
            ]}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <PremiumContentBand title="Coverage that supports the bigger picture" tone="teal">
              <p>
                Ancillary coverage can help address gaps that major medical coverage may not fully solve. The right
                conversation starts with budget, existing coverage, household needs, and the benefit categories that
                matter most.
              </p>
            </PremiumContentBand>
            <PremiumContentBand title="No Pressure. Clear Guidance.">
              <p>
                We keep the process simple: ask what you want help with, avoid sensitive identifiers in web intake, and
                hand off to a licensed agent for carrier-specific details.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact?topic=ancillary" className="premium-small-button premium-small-button-primary">
                  Request Ancillary Guidance
                </Link>
                <Link href="/medicare" className="premium-small-button premium-small-button-light">
                  Medicare Guidance
                </Link>
              </div>
            </PremiumContentBand>
          </div>

          <section aria-labelledby="ancillary-faq-heading" className="space-y-5">
            <div>
              <p className="font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ve-gold)]">
                Common questions
              </p>
              <h2
                id="ancillary-faq-heading"
                className="mt-2 font-display text-3xl font-bold text-[var(--ve-teal)]"
              >
                Ancillary coverage and online quoting
              </h2>
            </div>
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
          </section>

          <LeadCtaSection
            eyebrow="Ancillary coverage"
            title="Review dental, vision, hearing, and hospital coverage options."
            description={`A licensed agent can help you understand available options. You can also call ${site.phoneDisplay}.`}
            ctaLabel="Request ancillary guidance"
          />
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
