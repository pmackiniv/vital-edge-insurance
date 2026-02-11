import type { Metadata } from "next";
import { CountyLandingTemplate } from "@/components/CountyLandingTemplate";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Duval County Health Insurance Agent | Jacksonville, FL",
  description:
    "Vital Edge Insurance serves Duval County and Jacksonville with local health insurance guidance for ACA Marketplace, Medicare, small business group plans, and ICHRA. Licensed Florida agency with an education-first approach.",
  alternates: {
    canonical: absoluteUrl("/duval-county"),
  },
  openGraph: {
    title: "Duval County Health Insurance | Vital Edge Insurance",
    description:
      "Local health insurance agent serving Duval County and Jacksonville, FL with ACA, Medicare, and small business coverage guidance.",
    url: absoluteUrl("/duval-county"),
  },
};

export default function Page() {
  return (
    <CountyLandingTemplate
      countyName="Duval County"
      canonicalPath="/duval-county"
      intro="Local insurance guidance for Duval County residents. We provide insurance guidance focused on clarity, timelines, and next steps for ACA, Medicare education, and small business options."
      details="If you need insurance guidance in Jacksonville or the surrounding area, we are here to help with a clear, client-first process."
      neighboringCounties={[
        { label: "St. Johns County", href: "/st-johns-county" },
        { label: "Miami-Dade County", href: "/miami" },
      ]}
    />
  );
}
