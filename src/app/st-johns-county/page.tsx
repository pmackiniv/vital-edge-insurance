import type { Metadata } from "next";
import { CountyLandingTemplate } from "@/components/CountyLandingTemplate";
import { absoluteUrl, serviceAreaStatement } from "@/lib/site";

export const metadata: Metadata = {
  title: "St. Johns County Health Insurance Agent | St. Augustine, FL",
  description:
    `Vital Edge Insurance provides health insurance guidance in St. Johns County and St. Augustine, FL for ACA Marketplace, Medicare, Medigap, and small business questions. ${serviceAreaStatement}`,
  alternates: {
    canonical: absoluteUrl("/st-johns-county"),
  },
  openGraph: {
    title: "St. Johns County Health Insurance | Vital Edge Insurance",
    description:
      `Licensed health insurance guidance for St. Johns County and St. Augustine with ACA, Medicare, and employer coverage education. ${serviceAreaStatement}`,
    url: absoluteUrl("/st-johns-county"),
  },
};

export default function Page() {
  return (
    <CountyLandingTemplate
      countyName="St. Johns County"
      canonicalPath="/st-johns-county"
      intro={`Insurance guidance for St. Johns County clients, including St. Augustine and nearby communities. ${serviceAreaStatement}`}
      details="Reach out for guidance that starts with education, eligibility timing, and practical next steps."
      neighboringCounties={[{ label: "Duval County", href: "/duval-county" }]}
    />
  );
}
