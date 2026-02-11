import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
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
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/30 bg-white/35 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">ICHRA</h1>
          <p className="text-black/70">
            Independent education for employers and employees exploring Individual Coverage HRAs. We focus on structure,
            timelines, and communication planning.
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
            <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-black">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-black/70">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">Questions to bring</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Which employee classes are eligible?</li>
              <li>What allowance ranges are you considering?</li>
              <li>What start date and communications plan is needed?</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
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
            <Link className="text-black/70 hover:text-black" href="/resources#ichra-explainer">ICHRA explainer</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#small-group-basics">Small group basics</Link>
            <Link className="text-black/70 hover:text-black" href="/resources#what-to-bring">What to bring</Link>
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
  );
}
