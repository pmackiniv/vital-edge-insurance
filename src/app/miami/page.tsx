import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Miami-Dade County Insurance Guidance",
    url: absoluteUrl("/miami"),
    description: "Insurance guidance for Miami-Dade County and the Miami metro area.",
  };

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
          <div className="relative aspect-[16/9]">
            <Image
              src="/images/cities/miami.png"
              alt="Miami skyline at dusk"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 720px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="text-sm font-semibold text-white/80">Service Area</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Miami-Dade County</h1>
          </div>
        </div>
        <p className="text-black/70">
          Education-first insurance guidance for Miami-Dade County residents. We focus on clarity, timelines, and next
          steps for ACA Marketplace support, Medicare education, and small business options.
        </p>
        <p className="text-black/70">
          If you need coverage guidance in Miami or surrounding communities, we can help with a clear, client-first
          process.
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
