import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";
import { StructuredData } from "@/components/StructuredData";
import { absoluteUrl, serviceAreaStatement, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medigap (Medicare Supplement) Guidance",
  description:
    "Vital Edge Insurance provides Medigap (Medicare Supplement) education, including enrollment timing, preparation, and licensed follow-up options across its approved service footprint.",
  alternates: {
    canonical: absoluteUrl("/medicare/medigap"),
  },
  openGraph: {
    title: "Medigap Guidance | Vital Edge Insurance",
    description: "General Medigap education and licensed follow-up guidance across Vital Edge's approved service footprint.",
    url: absoluteUrl("/medicare/medigap"),
  },
};

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/medicare/medigap"),
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: site.serviceAreas,
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Medigap guidance",
    serviceType: "Medicare Supplement education",
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    areaServed: site.serviceAreas,
    url: absoluteUrl("/medicare/medigap"),
    description:
      "General Medigap education for enrollment timing, preparation, and licensed follow-up scheduling.",
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Medigap",
        item: absoluteUrl("/medicare/medigap"),
      },
    ],
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Medicare"
        title="Medigap Basics"
        subtitle={`General education on how Medigap works alongside Original Medicare, timing considerations, and what to prepare before speaking with a licensed agent. ${serviceAreaStatement}`}
        actions={[
          { label: "Request Medigap Guidance", href: "/medicare/medigap-request", kind: "primary" },
          { label: "Medicare Overview", href: "/medicare", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Medigap availability, eligibility, underwriting, carrier appointment, and plan details vary by state, age,
          timing, and carrier.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Original Medicare first",
              body: "Medigap works with Original Medicare (Parts A and B), not Medicare Advantage.",
            },
            {
              title: "Timing matters",
              body: "Certain enrollment windows can affect availability and underwriting.",
            },
            {
              title: "Prepare documents",
              body: "Have coverage start dates and current plan notices ready for a licensed review.",
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
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">What to bring</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Part A and Part B effective dates.</li>
              <li>Recent Medicare notices or coverage letters.</li>
              <li>Preferred contact method and timing.</li>
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

        <SeoFaq
          items={[
            {
              question: "Is Medigap the same as Medicare Advantage?",
              answer:
                "No. Medigap supplements Original Medicare, while Medicare Advantage replaces Original Medicare coverage with a private plan.",
            },
            {
              question: "When can someone apply for Medigap?",
              answer:
                "Eligibility and timing can vary. A licensed agent can explain the windows that may apply to your situation.",
            },
            {
              question: "Do you recommend a specific Medigap plan?",
              answer:
                "We provide general education online and handle plan-specific guidance by appointment or call/text.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Medigap support"
          title="Get a clear Medigap roadmap from a licensed agent."
          description="We will explain the general rules and organize next steps for your situation without pressure or plan pushing."
          ctaLabel="Request Medigap guidance"
        />
      </div>
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd]} />
    </Container>
    </>
  );
}
