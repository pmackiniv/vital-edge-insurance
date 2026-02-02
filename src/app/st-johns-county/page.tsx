import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "St. Johns County Health Insurance Agent | St. Augustine, FL",
  description:
    "Patrick Mackin IV provides health insurance guidance in St. Johns County and St. Augustine, FL. Licensed agent for ACA Marketplace, Medicare, Medigap, and small business health insurance.",
  alternates: {
    canonical: absoluteUrl("/st-johns-county"),
  },
  openGraph: {
    title: "St. Johns County Health Insurance | Patrick Mackin IV",
    description:
      "Licensed Florida health insurance agent serving St. Johns County and St. Augustine with ACA, Medicare, and employer coverage guidance.",
    url: absoluteUrl("/st-johns-county"),
  },
};

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "St. Johns County Insurance Guidance",
    url: absoluteUrl("/st-johns-county"),
    description: "Insurance guidance for St. Johns County, St. Augustine, and nearby communities.",
  };

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">St. Johns County</h1>
        <p className="text-black/70">
          Insurance guidance for St. Johns County clients, including St. Augustine and nearby communities. Our insurance
          guidance focuses on education, eligibility timing, and practical next steps.
        </p>
        <p className="text-black/70">
          Reach out for insurance guidance that is clear, local, and centered on your needs.
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
            Also serving <Link className="text-black hover:underline" href="/duval-county">Duval County</Link>.
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
