import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { LeadCtaSection } from "@/components/LeadCtaSection";
import { SeoFaq } from "@/components/SeoFaq";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medigap (Medicare Supplement) Education | Florida Licensed Agent Guidance",
  description:
    "Education-first Medigap and Medicare Supplement guidance for Florida residents. Learn timing, coverage basics, and next steps with a licensed agent.",
  alternates: {
    canonical: absoluteUrl("/medicare/medigap"),
  },
  openGraph: {
    title: "Medigap Education in Florida | Vital Edge Insurance",
    description:
      "Understand Medigap basics, enrollment timing, and preparation steps with licensed guidance.",
    url: absoluteUrl("/medicare/medigap"),
  },
};

export default function Page() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Medigap (Medicare Supplement) Education",
    serviceType: "Insurance Guidance",
    areaServed: "Florida",
    provider: {
      "@type": "InsuranceAgency",
      name: "Vital Edge Insurance",
      url: absoluteUrl("/"),
    },
    url: absoluteUrl("/medicare/medigap"),
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
    <Container className="py-14">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Medigap (Medicare Supplement) Basics</h1>
          <p className="text-black/70">
            General education on how Medigap works alongside Original Medicare, when it is typically considered,
            and what to prepare before speaking with a licensed agent.
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
            <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-black">{item.title}</div>
              <p className="mt-2 text-sm leading-6 text-black/70">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold text-black">What to bring</h2>
            <ul className="mt-3 space-y-2 text-sm text-black/70">
              <li>Part A and Part B effective dates.</li>
              <li>Recent Medicare notices or coverage letters.</li>
              <li>Preferred contact method and timing.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-6">
            <h2 className="text-sm font-semibold text-black">Education-first guidance</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">
              We provide general education and routing. Plan-specific guidance requires a licensed agent.
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
                "We do not recommend specific plans online. We provide education and then route you to a licensed agent for plan-specific guidance.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </Container>
  );
}
