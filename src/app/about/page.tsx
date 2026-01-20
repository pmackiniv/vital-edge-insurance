import Link from "next/link";
import { Container } from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Vital Edge Insurance",
    url: absoluteUrl("/about"),
    description:
      "Learn about Vital Edge Insurance, an independent insurance agency providing guidance in Jacksonville, Florida.",
  };

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-black/70">
          Vital Edge Insurance provides independent insurance guidance for individuals, families, and small businesses
          across Jacksonville and nearby counties.
        </p>
        <p className="text-black/70">
          We are an independent insurance agency focused on education, routing, and practical next steps. We are not a
          medical clinic or healthcare provider.
        </p>
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
        <div className="text-xs text-black/60">
          Serving {site.address.addressLocality}, {site.address.addressRegion}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </Container>
  );
}
