import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Duval County Health Insurance Agent | Jacksonville, FL",
  description:
    "Patrick Mackin IV serves Duval County and Jacksonville with local health insurance guidance for ACA Marketplace, Medicare, small business group plans, and ICHRA. Licensed Florida agent with education-first approach.",
  alternates: {
    canonical: absoluteUrl("/duval-county"),
  },
  openGraph: {
    title: "Duval County Health Insurance | Patrick Mackin IV | Jacksonville Agent",
    description:
      "Local health insurance agent serving Duval County and Jacksonville, FL with ACA, Medicare, and small business coverage guidance.",
    url: absoluteUrl("/duval-county"),
  },
};

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Duval County Insurance Guidance",
    url: absoluteUrl("/duval-county"),
    description: "Insurance guidance for Duval County, Jacksonville, and nearby communities.",
  };

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Duval County</h1>
        <p className="text-black/70">
          Local insurance guidance for Duval County residents. We provide insurance guidance that focuses on clarity,
          timelines, and next steps for ACA, Medicare education, and small business options.
        </p>
        <p className="text-black/70">
          If you need insurance guidance in Jacksonville or the surrounding area, we are here to help with a clear,
          client-first process.
        </p>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">Core services</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="text-black/70 hover:text-black" href="/aca">ACA</Link>
            <Link className="text-black/70 hover:text-black" href="/medicare">Medicare</Link>
            <Link className="text-black/70 hover:text-black" href="/ichra">ICHRA</Link>
            <Link className="text-black/70 hover:text-black" href="/off-exchange">Off-Exchange</Link>
            <Link className="text-black/70 hover:text-black" href="/services">Services</Link>
          </div>
          <div className="mt-4 text-sm text-black/70">
            Also serving{" "}
            <Link className="text-black hover:underline" href="/st-johns-county">St. Johns County</Link>{" "}
            and{" "}
            <Link className="text-black hover:underline" href="/miami">Miami-Dade County</Link>.
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/70">
          <div className="font-semibold text-black">{site.legalName}</div>
          <div>{site.address.addressLocality}, {site.address.addressRegion}</div>
          <div>{site.phoneDisplay}</div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </Container>
  );
}
