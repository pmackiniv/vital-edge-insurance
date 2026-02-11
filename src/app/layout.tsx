import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import AnalyticsConsent from "@/components/AnalyticsConsent";
import { BackgroundLayers } from "@/components/BackgroundLayers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import TimedLeadPopup from "@/components/TimedLeadPopup";
import { absoluteUrl, insuranceAgencyJsonLd, localBusinessJsonLd, organizationJsonLd, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "Vital Edge Insurance | Licensed Florida Health Insurance Agency in Jacksonville",
    template: "%s | Vital Edge Insurance",
  },
  description:
    "Vital Edge Insurance provides licensed Florida health insurance guidance in Jacksonville and nearby counties. Education-first support for ACA Marketplace, Medicare, Medigap, ICHRA, and small business coverage.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Vital Edge Insurance | Florida Health Insurance Guidance",
    description:
      "Licensed Florida health insurance guidance for ACA, Medicare, and small business coverage in Jacksonville, Duval County, and St. Johns County.",
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
    title: "Vital Edge Insurance | Florida Health Insurance Guidance",
    description: "Licensed Florida health insurance guidance for Jacksonville, Duval County, St. Johns County, and Miami-Dade County.",
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
      </body>
    </html>
  );
}
