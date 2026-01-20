import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { absoluteUrl, insuranceAgencyJsonLd, localBusinessJsonLd, organizationJsonLd, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Vital Edge Insurance | Health Insurance Guidance in Jacksonville, FL",
    template: "%s | Vital Edge Insurance",
  },
  description:
    "Independent guidance for ACA Marketplace, individual and family plans, small business options, and Medicare education in Jacksonville, FL. Duval and St. Johns County service areas.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Vital Edge Insurance",
    description:
      "Health insurance guidance for Jacksonville, FL with support for ACA, small business options, and Medicare education.",
    images: [
      {
        url: absoluteUrl(site.ogImagePath),
        width: 1200,
        height: 630,
        alt: "Vital Edge Insurance",
      },
    ],
  },
  icons: {
    icon: site.logoPath,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = organizationJsonLd();
  const local = localBusinessJsonLd();
  const agency = insuranceAgencyJsonLd();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-black antialiased font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(local) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agency) }}
        />
      </body>
    </html>
  );
}
