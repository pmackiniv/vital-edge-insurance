import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "ICHRA Health Insurance | Individual Coverage HRA | Florida Employer Guide",
  description:
    "Vital Edge Insurance helps Florida employers and employees navigate ICHRA (Individual Coverage Health Reimbursement Arrangement) with licensed guidance for defined contribution health benefits.",
  alternates: {
    canonical: absoluteUrl("/ichra"),
  },
  openGraph: {
    title: "ICHRA Guidance in Florida | Vital Edge Insurance",
    description:
      "Licensed agent support for ICHRA setup, employee guidance, and compliance in Florida.",
    url: absoluteUrl("/ichra"),
  },
};

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/ichra"),
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: "Florida",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "ICHRA guidance",
    serviceType: "Individual Coverage HRA guidance",
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    areaServed: "Florida",
    url: absoluteUrl("/ichra"),
    description:
      "Independent education for employers and employees exploring Individual Coverage HRAs.",
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
        name: "ICHRA",
        item: absoluteUrl("/ichra"),
      },
    ],
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Employer Benefits"
        title="ICHRA Guidance"
        subtitle="Independent education for employers and employees exploring Individual Coverage HRAs."
        actions={[
          { label: "Request ICHRA Guidance", href: "/contact?topic=ichra", kind: "primary" },
          { label: "Small Group", href: "/small-group", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          ICHRA design, reimbursement rules, employee eligibility, carrier availability, and plan details require careful
          review with licensed and qualified professionals.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Employer setup",
              body: "Define eligibility classes, allowances, and rollout timelines.",
            },
            {
              title: "Employee experience",
              body: "Clear communication and guidance on how reimbursements work.",
            },
            {
              title: "Ongoing support",
              body: "Checklists for onboarding, renewals, and documentation.",
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
            <h2 className="text-sm font-extrabold text-[var(--ve-teal)]">Questions to bring</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Which employee classes are eligible?</li>
              <li>What allowance ranges are you considering?</li>
              <li>What start date and communications plan is needed?</li>
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
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#ichra-explainer">ICHRA explainer</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#small-group-basics">Small group basics</Link>
            <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/resources#what-to-bring">What to bring</Link>
          </div>
        </div>

        <SeoFaq
          items={[
            {
              question: "What is an ICHRA?",
              answer:
                "An Individual Coverage HRA is an employer-sponsored benefit that reimburses employees for individual coverage. We provide education and planning support.",
            },
            {
              question: "Do you recommend specific plans for ICHRA?",
              answer:
                "We provide general education online and handle plan-specific guidance by appointment or call/text.",
            },
            {
              question: "What should an employer prepare before an ICHRA review?",
              answer:
                "Eligibility classes, allowance ranges, and desired start dates are a good place to begin.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="ICHRA support"
          title="Plan an ICHRA rollout with education-first guidance."
          description="We help you structure timelines and communication before licensed plan discussions."
          ctaLabel="Request ICHRA guidance"
        />
      </div>
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd]} />
    </Container>
    </>
  );
}
