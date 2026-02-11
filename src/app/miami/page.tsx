import type { Metadata } from "next";
import { CountyLandingTemplate } from "@/components/CountyLandingTemplate";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Miami-Dade County Health Insurance Agent | Miami, FL",
  description:
    "Vital Edge Insurance serves Miami-Dade County with health insurance guidance for ACA Marketplace, Medicare, and small business coverage. Licensed Florida agency with regional support for the Miami metro area.",
  alternates: {
    canonical: absoluteUrl("/miami"),
  },
  openGraph: {
    title: "Miami-Dade Health Insurance | Vital Edge Insurance",
    description:
      "Licensed health insurance agent serving Miami-Dade County with ACA, Medicare, and employer coverage guidance.",
    url: absoluteUrl("/miami"),
  },
};

export default function Page() {
  return (
    <CountyLandingTemplate
      countyName="Miami-Dade County"
      canonicalPath="/miami"
      intro="Education-first insurance guidance for Miami-Dade County residents. We focus on clarity, timelines, and next steps for ACA Marketplace support, Medicare education, and small business options."
      details="If you need coverage guidance in Miami or surrounding communities, we can help with a clear, client-first process."
      heroImageSrc="/images/cities/miami.png"
      heroImageAlt="Miami skyline at dusk"
      neighboringCounties={[{ label: "Duval County", href: "/duval-county" }]}
    />
  );
}
