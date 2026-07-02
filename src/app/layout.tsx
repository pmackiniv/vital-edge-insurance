import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import AnalyticsConsent from "@/components/AnalyticsConsent";
import { BackgroundLayers } from "@/components/BackgroundLayers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import TimedLeadPopup from "@/components/TimedLeadPopup";
import { insuranceAgencyJsonLd, localBusinessJsonLd, organizationJsonLd, personJsonLd, webSiteJsonLd } from "@/lib/site";

const PRODUCTION_SITE_URL = "https://www.vital-edge-insurance.com";
const METADATA_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NEXT_PUBLIC_SITE_URL.startsWith("http") &&
  process.env.NEXT_PUBLIC_SITE_URL !== "https://vital-edge-insurance.vercel.app"
    ? process.env.NEXT_PUBLIC_SITE_URL
    : PRODUCTION_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(METADATA_BASE_URL),
  title: {
    default: "Vital Edge Insurance | Licensed Health Insurance Agency in Jacksonville, FL",
    template: "%s | Vital Edge Insurance",
  },
  description:
    "Licensed health insurance guidance for Medicare, ACA Marketplace, ancillary coverage, and small group questions across Florida and 11 additional states. Call (352) 214-8879 or request a callback.",
  openGraph: {
    type: "website",
    url: "/",
    title: "Vital Edge Insurance | Licensed Health Insurance Agency in Jacksonville, FL",
    description:
      "Licensed health insurance guidance for Medicare, ACA Marketplace, ancillary coverage, and small group questions across Florida and 11 additional states. Call (352) 214-8879 or request a callback.",
    siteName: "Vital Edge Insurance",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vital Edge Insurance - Licensed Florida Health Insurance Guidance",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vital Edge Insurance | Licensed Health Insurance Agency in Jacksonville, FL",
    description:
      "Licensed health insurance guidance for Medicare, ACA Marketplace, ancillary coverage, and small group questions across Florida and 11 additional states. Call (352) 214-8879 or request a callback.",
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
  const website = webSiteJsonLd();

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />
      </body>
    </html>
  );
}
