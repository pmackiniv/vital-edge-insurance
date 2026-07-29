import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl, serviceAreaStatement, site } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Off-Exchange Health Insurance | Vital Edge Insurance",
  description:
    "Vital Edge Insurance provides guidance on off-exchange health insurance options when ACA Marketplace coverage is not the right fit.",
  alternates: {
    canonical: absoluteUrl("/off-exchange"),
  },
  openGraph: {
    title: "Off-Exchange Health Insurance | Vital Edge Insurance",
    description:
      "Licensed agent guidance for non-Marketplace health insurance options across Vital Edge's approved service footprint.",
    url: absoluteUrl("/off-exchange"),
  },
};

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/off-exchange"),
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: site.serviceAreas,
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Off-exchange guidance",
    serviceType: "Off-exchange health insurance guidance",
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    areaServed: site.serviceAreas,
    url: absoluteUrl("/off-exchange"),
    description:
      "Education-first guidance on individual coverage purchased outside the Marketplace.",
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
        name: "Off-Exchange",
        item: absoluteUrl("/off-exchange"),
      },
    ],
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Health Insurance"
        title="Off-Exchange Coverage"
        subtitle={`Education-first guidance on individual coverage purchased outside the Marketplace. ${serviceAreaStatement}`}
        actions={[
          { label: "Request Guidance", href: "/contact", kind: "primary" },
          { label: "ACA Marketplace", href: "/aca", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Off-exchange coverage availability, eligibility, underwriting, subsidies, plan details, and enrollment timing
          vary by state, county, household, carrier, and product.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Timing",
              body: "Understand when off‑exchange coverage can be considered relative to Marketplace windows.",
            },
            {
              title: "Documentation",
              body: "Know what personal and coverage information is typically required.",
            },
            {
              title: "Next steps",
              body: "Plan a simple, compliant path to compare coverage paths.",
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
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Good to know</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Marketplace coverage may include premium tax credits for eligible households.</li>
              <li>Off‑exchange coverage generally does not include premium tax credits.</li>
              <li>Enrollment timing and options can differ from the Marketplace.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(228,246,247,0.92),rgba(255,255,255,0.94))] p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              We provide general education and routing. If you&apos;d like plan-specific information, please provide a bit
              of information to{" "}
              <Link className="underline" href="/schedule">schedule an appointment</Link> or{" "}
              <Link className="underline" href="/chat">request a same-day callback/text/email</Link>. You can also email{" "}
              <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> or call/text{" "}
              <a className="underline" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Helpful resources</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#off-exchange-vs-marketplace">Off‑exchange vs Marketplace</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#aca-subsidies-overview">ACA subsidies overview</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#what-to-bring">What to bring</Link>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "What is off-exchange coverage?",
              answer:
                "Off-exchange coverage is purchased outside the Marketplace. We provide education on timing and process.",
            },
            {
              question: "Can I get premium tax credits off-exchange?",
              answer:
                "Premium tax credits are generally tied to Marketplace coverage. A licensed agent can confirm details.",
            },
            {
              question: "Do you recommend off-exchange plans?",
              answer:
                "We provide general education online and handle plan-specific guidance by appointment or call/text.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Off-exchange"
          title="Clarify off-exchange options with a licensed agent."
          description="We explain the differences and help you prepare for a licensed review."
          ctaLabel="Request off-exchange guidance"
        />
      </div>
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd]} />
    </Container>
    </>
  );
}
