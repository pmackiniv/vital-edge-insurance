import type { Metadata } from "next";
import { CountyLandingTemplate } from "@/components/CountyLandingTemplate";
import { absoluteUrl, serviceAreaStatement } from "@/lib/site";

export const metadata: Metadata = {
  title: "Duval County Health Insurance Agent | Jacksonville, FL",
  description:
    `Vital Edge Insurance supports Duval County and Jacksonville with ACA Marketplace, Medicare, small business group, and ICHRA education. ${serviceAreaStatement}`,
  alternates: {
    canonical: absoluteUrl("/duval-county"),
  },
  openGraph: {
    title: "Duval County Health Insurance | Vital Edge Insurance",
    description:
      `Health insurance guidance for Duval County and Jacksonville, FL with ACA, Medicare, and small business education. ${serviceAreaStatement}`,
    url: absoluteUrl("/duval-county"),
  },
};

export default function Page() {
  return (
    <CountyLandingTemplate
      countyName="Duval County"
      canonicalPath="/duval-county"
      intro={`Insurance guidance for Duval County residents, with clarity on timelines and next steps for ACA, Medicare education, and small business options. ${serviceAreaStatement}`}
      details="If you need insurance guidance in Jacksonville, another Florida county, or another licensed state, we can start with a clear, client-first process."
      neighboringCounties={[
        { label: "St. Johns County", href: "/st-johns-county" },
        { label: "Miami-Dade County", href: "/miami" },
      ]}
    />
  );
}
