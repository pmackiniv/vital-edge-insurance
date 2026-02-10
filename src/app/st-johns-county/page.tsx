import type { Metadata } from "next";
import { CountyLandingTemplate } from "@/components/CountyLandingTemplate";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "St. Johns County Health Insurance Agent | St. Augustine, FL",
  description:
    "Patrick Mackin IV provides health insurance guidance in St. Johns County and St. Augustine, FL. Licensed agent for ACA Marketplace, Medicare, Medigap, and small business health insurance.",
  alternates: {
    canonical: absoluteUrl("/st-johns-county"),
  },
  openGraph: {
    title: "St. Johns County Health Insurance | Patrick Mackin IV",
    description:
      "Licensed Florida health insurance agent serving St. Johns County and St. Augustine with ACA, Medicare, and employer coverage guidance.",
    url: absoluteUrl("/st-johns-county"),
  },
};

export default function Page() {
  return (
    <CountyLandingTemplate
      countyName="St. Johns County"
      canonicalPath="/st-johns-county"
      intro="Insurance guidance for St. Johns County clients, including St. Augustine and nearby communities. Our guidance focuses on education, eligibility timing, and practical next steps."
      details="Reach out for insurance guidance that is clear, local, and centered on your needs."
      neighboringCounties={[{ label: "Duval County", href: "/duval-county" }]}
    />
  );
}
