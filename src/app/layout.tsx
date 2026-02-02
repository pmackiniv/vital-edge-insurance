import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { BackgroundLayers } from "@/components/BackgroundLayers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { TimedLeadPopup } from "@/components/TimedLeadPopup";
import { absoluteUrl, insuranceAgencyJsonLd, localBusinessJsonLd, organizationJsonLd, personJsonLd, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Patrick Mackin IV | Vital Edge Insurance | Licensed Florida Health Insurance Agent in Jacksonville",
    template: "%s | Patrick Mackin IV | Vital Edge Insurance",
  },
  description:
    "Patrick Mackin IV, licensed Florida health insurance agent serving Jacksonville, Duval County, St. Johns County. Independent guidance for ACA Marketplace, Medicare, Medigap, ICHRA, and small business health insurance. Vital Edge Insurance provides education-first support for individuals, families, and employers.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Patrick Mackin IV | Vital Edge Insurance | Florida Health Insurance Agent",
    description:
      "Licensed Florida health insurance agent Patrick Mackin IV provides independent guidance for ACA, Medicare, and small business coverage in Jacksonville, Duval County, and St. Johns County.",
    siteName: "Vital Edge Insurance",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Patrick Mackin IV - Vital Edge Insurance - Licensed Florida Health Insurance Agent",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Mackin IV | Vital Edge Insurance | Florida Health Insurance Agent",
    description: "Licensed Florida health insurance agent serving Jacksonville, Duval County, St. Johns County, and Miami-Dade County.",
    images: ["/og.png"],
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
  const person = personJsonLd();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-transparent text-[18px] leading-relaxed text-slate-900 antialiased font-sans">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2 focus:text-white focus:outline-none">
          Skip to main content
        </a>
        <BackgroundLayers />
        <Header />
        <main id="main-content" className="relative z-10" tabIndex={-1}>{children}</main>
        <Footer />
        <ChatWidget />
        <Suspense fallback={null}>
          <TimedLeadPopup />
        </Suspense>
        <AnalyticsConsent />

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
