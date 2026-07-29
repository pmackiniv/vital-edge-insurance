import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ExternalLinks } from "@/components/ExternalLinks";
import { PremiumContentBand, PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Secure Quote and Enrollment Links | Vital Edge Insurance",
  description:
    "Use approved Vital Edge Insurance destinations for Medicare review and UnitedHealthcare or Allstate Health Solutions ancillary quotes.",
  alternates: {
    canonical: absoluteUrl("/enroll"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/enroll"),
    title: "Secure Quote and Enrollment Links | Vital Edge Insurance",
    description:
      "Use approved Vital Edge Insurance destinations for Medicare review and UnitedHealthcare or Allstate Health Solutions ancillary quotes.",
    siteName: "Vital Edge Insurance",
    images: [
      {
        url: absoluteUrl("/og.png"),
        width: 1200,
        height: 630,
        alt: "Vital Edge Insurance secure quote and enrollment links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure Quote and Enrollment Links | Vital Edge Insurance",
    description:
      "Use approved Vital Edge Insurance destinations for Medicare review and UnitedHealthcare or Allstate Health Solutions ancillary quotes.",
    images: [absoluteUrl("/og.png")],
  },
};

export default function EnrollPage() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Secure External Links"
        title="Enrollment Destinations"
        subtitle="Use the current approved external destinations when you already know your next step, or request a licensed-agent call first."
        actions={[
          { label: "Request a Call", href: "/contact", kind: "primary" },
          { label: "Medicare Guidance", href: "/medicare", kind: "gold" },
        ]}
      >
        <PremiumDisclosure>
          You are leaving Vital Edge Insurance and going to a third-party website. Not connected with or endorsed by the
          U.S. government or the federal Medicare program.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-8">
          <PremiumContentBand title="Current approved destinations">
            <div className="space-y-2">
              <p>Use the secure enrollment partners below. You will be redirected to a third-party site to continue.</p>
              <p>
                We do not offer every plan available in your area. Any information we provide is limited to plans we
                offer in your area.
              </p>
            </div>
          </PremiumContentBand>

          <ExternalLinks />
        </div>
      </Container>
    </>
  );
}
