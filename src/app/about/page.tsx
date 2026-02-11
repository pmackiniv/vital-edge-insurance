import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";
import { aboutFaqItems, buildAboutFaqJsonLd } from "./content";

export const metadata: Metadata = {
  title: "About Vital Edge Insurance",
  description:
    "Vital Edge Insurance is a licensed Florida health insurance agency serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County with independent guidance for ACA, Medicare, and small business health insurance.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About Vital Edge Insurance",
    description:
      "Licensed Florida health insurance agent providing independent, education-first guidance in Jacksonville and surrounding counties.",
    url: absoluteUrl("/about"),
  },
};

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Vital Edge Insurance",
    url: absoluteUrl("/about"),
    description:
      "Learn about Vital Edge Insurance, an independent insurance agency providing guidance in Jacksonville, Florida.",
  };
  const faqJsonLd = buildAboutFaqJsonLd();

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <nav aria-label="About quick links" className="flex flex-wrap gap-3 text-sm">
          <Link className="text-black/70 hover:text-black underline" href="/about">About</Link>
          <Link className="text-black/70 hover:text-black underline" href="/about#mission">Mission</Link>
          <Link className="text-black/70 hover:text-black underline" href="/about#support-team">Support team</Link>
          <Link className="text-black/70 hover:text-black underline" href="/about#faq">FAQ</Link>
          <Link className="text-black/70 hover:text-black underline" href="/contact">Contact</Link>
          <Link className="text-black/70 hover:text-black underline" href="/schedule">Schedule</Link>
        </nav>

        <section id="mission" className="space-y-4">
          <p className="text-black/70">
            Vital Edge Insurance provides independent insurance guidance for individuals, families, and small businesses
            across Jacksonville and nearby counties.
          </p>
          <p className="text-black/70">
            We are an independent insurance agency focused on education, routing, and practical next steps. We are not a
            medical clinic or healthcare provider.
          </p>
        </section>

        <section id="support-team" className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="text-sm font-semibold text-black">Not affiliated</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Vital Edge Insurance is an independent insurance guidance business and is not affiliated with any similarly
              named healthcare clinic.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="text-sm font-semibold text-black">Explore services</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link className="text-black/70 hover:text-black" href="/services">Services</Link>
              <Link className="text-black/70 hover:text-black" href="/aca">ACA</Link>
              <Link className="text-black/70 hover:text-black" href="/medicare">Medicare</Link>
              <Link className="text-black/70 hover:text-black" href="/ichra">ICHRA</Link>
              <Link className="text-black/70 hover:text-black" href="/contact">Contact</Link>
            </div>
          </div>
        </section>

        <section id="faq" className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">Frequently asked questions</h2>
          <div className="mt-3 space-y-4">
            {aboutFaqItems.map((item) => (
              <div key={item.question}>
                <h3 className="text-sm font-semibold text-black">{item.question}</h3>
                <p className="mt-1 text-sm leading-6 text-black/70">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-xs text-black/60">
          Serving {site.address.addressLocality}, {site.address.addressRegion}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </Container>
  );
}
