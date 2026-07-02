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
  title: "Small Business Health Insurance | Florida Group Coverage | Jacksonville",
  description:
    "Vital Edge Insurance helps Florida small businesses with group health insurance, renewals, and employee benefits in Jacksonville and nearby counties.",
  alternates: {
    canonical: absoluteUrl("/small-group"),
  },
  openGraph: {
    title: "Small Business Health Insurance in Florida | Vital Edge Insurance",
    description:
      "Licensed agent support for small group health insurance, renewals, and employee benefits in Florida.",
    url: absoluteUrl("/small-group"),
  },
};

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: site.legalName,
    url: absoluteUrl("/small-group"),
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: "Florida",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Small group benefits guidance",
    serviceType: "Small business health insurance guidance",
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
    },
    areaServed: "Florida",
    url: absoluteUrl("/small-group"),
    description:
      "Education-first guidance for small employers exploring group benefits, renewals, and employee communication planning.",
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
        name: "Small Group",
        item: absoluteUrl("/small-group"),
      },
    ],
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Small Group"
        title="Small Group Benefits"
        subtitle="Education-first guidance for small employers exploring group benefits, renewals, and employee communication planning."
        actions={[
          { label: "Request Guidance", href: "/contact", kind: "primary" },
          { label: "Schedule a Call", href: "/schedule", kind: "gold" },
          { label: "Chat With Our Team", href: "/chat", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Group benefit availability, contribution strategy, carrier appointment, and plan details vary by employer,
          employee census, state, carrier, and renewal timing.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="space-y-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Plan basics",
              body: "Understand how small group coverage structures are typically organized.",
            },
            {
              title: "Renewals",
              body: "Prepare for renewal timelines, documentation, and employee communications.",
            },
            {
              title: "Employee experience",
              body: "Create clear onboarding and benefits education materials for staff.",
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
              <li>Employer size and coverage goals.</li>
              <li>Renewal dates and current benefit summary.</li>
              <li>Preferred communication timeline.</li>
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
              question: "Do you handle small group renewals?",
              answer:
                "We provide education, organize timelines, and help you prepare for licensed carrier conversations.",
            },
            {
              question: "Can you recommend a specific group plan?",
              answer:
                "We provide general education online and handle plan-specific guidance by appointment or call/text.",
            },
            {
              question: "What is the first step for a small group review?",
              answer:
                "Start with your renewal date, employee count, and coverage goals. We will outline the next steps.",
            },
          ]}
        />

        <LeadCtaSection
          eyebrow="Small group benefits"
          title="Organize your small group benefits review with a licensed agent."
          description="We help you prepare for renewals and employee communication without plan pushing."
          ctaLabel="Request group benefits guidance"
        />
      </div>
      <StructuredData entries={[localBusinessJsonLd, serviceJsonLd, breadcrumbJsonLd]} />
    </Container>
    </>
  );
}
