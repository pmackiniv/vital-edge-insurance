import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { absoluteUrl, site } from "@/lib/site";

type CountyLink = { label: string; href: string };

type CountyLandingTemplateProps = {
  countyName: string;
  canonicalPath: string;
  intro: string;
  details: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  neighboringCounties?: CountyLink[];
};

const coreServiceLinks: CountyLink[] = [
  { label: "ACA", href: "/aca" },
  { label: "Medicare", href: "/medicare" },
  { label: "ICHRA", href: "/ichra" },
  { label: "Off-Exchange", href: "/off-exchange" },
  { label: "Small Group", href: "/small-group" },
];

export function CountyLandingTemplate({
  countyName,
  canonicalPath,
  intro,
  details,
  heroImageSrc,
  heroImageAlt,
  neighboringCounties = [],
}: CountyLandingTemplateProps) {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${countyName} Insurance Guidance`,
    url: absoluteUrl(canonicalPath),
    description: intro,
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${countyName} Insurance Guidance`,
    serviceType: "Insurance Guidance",
    areaServed: countyName,
    provider: {
      "@type": "InsuranceAgency",
      name: site.legalName,
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(canonicalPath),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: countyName, item: absoluteUrl(canonicalPath) },
    ],
  };

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        {heroImageSrc ? (
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="relative aspect-[16/9]">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt || `${countyName} skyline`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 720px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="text-sm font-semibold text-white/80">Service Area</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{countyName}</h1>
            </div>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold tracking-tight">{countyName}</h1>
        )}

        <p className="text-black/70">{intro}</p>
        <p className="text-black/70">{details}</p>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold text-black">Core services</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {coreServiceLinks.map((serviceLink) => (
              <Link key={serviceLink.href} className="text-black/70 hover:text-black" href={serviceLink.href}>
                {serviceLink.label}
              </Link>
            ))}
          </div>
          {neighboringCounties.length ? (
            <div className="mt-4 text-sm text-black/70">
              Also serving{" "}
              {neighboringCounties.map((county, index) => (
                <span key={county.href}>
                  {index > 0 ? " and " : ""}
                  <Link className="text-black hover:underline" href={county.href}>
                    {county.label}
                  </Link>
                </span>
              ))}
              .
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/70">
          <div className="font-semibold text-black">{site.legalName}</div>
          <div>
            {site.address.addressLocality}, {site.address.addressRegion}
          </div>
          <div>{site.phoneDisplay}</div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </Container>
  );
}
