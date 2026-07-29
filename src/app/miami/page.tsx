import type { Metadata } from "next";
import { CountyLandingTemplate } from "@/components/CountyLandingTemplate";
import { absoluteUrl, serviceAreaStatement } from "@/lib/site";

export const metadata: Metadata = {
  title: "Miami-Dade County Health Insurance Agent | Miami, FL",
  description:
    `Vital Edge Insurance supports Miami-Dade County with health insurance guidance for ACA Marketplace, Medicare, and small business coverage. ${serviceAreaStatement}`,
  alternates: {
    canonical: absoluteUrl("/miami"),
  },
  openGraph: {
    title: "Miami-Dade Health Insurance | Vital Edge Insurance",
    description:
      `Licensed health insurance guidance for Miami-Dade County with ACA, Medicare, and employer coverage education. ${serviceAreaStatement}`,
    url: absoluteUrl("/miami"),
  },
};

export default function Page() {
  return (
    <CountyLandingTemplate
      countyName="Miami-Dade County"
      canonicalPath="/miami"
      intro={`Education-first insurance guidance for Miami-Dade County residents. ${serviceAreaStatement}`}
      details="If you need coverage guidance in Miami, another Florida county, or another licensed state, we can help with a clear, client-first process."
      neighboringCounties={[{ label: "Duval County", href: "/duval-county" }]}
    />
  );
}
