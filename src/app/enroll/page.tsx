import type { Metadata } from "next";
import Link from "next/link";
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
        title="Compare Medicare Plans Online"
        subtitle="Browse the plans available through Patrick’s secure SunFire plan finder at your own pace. No appointment is needed to open it. Licensed-agent help is available when you want it."
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

          <PremiumContentBand title="Prefer to explore on your own?">
            <ol className="list-decimal space-y-3 pl-5">
              <li>Open the Medicare plan finder and enter your ZIP code to see the plans it offers in your area.</li>
              <li>Check the plan’s coverage, costs, doctors, hospitals, prescriptions, and pharmacies before deciding. Enter sensitive information only on the secure enrollment site, never in this website’s chat.</li>
              <li>If you choose to apply, follow the secure site’s enrollment steps. You must meet the plan’s eligibility requirements and have a valid enrollment period; browsing does not enroll you.</li>
            </ol>
          </PremiumContentBand>

          <PremiumContentBand title="What if my carrier or plan is missing?">
            <p>
              The online tool does not show every carrier or plan. A missing plan does not necessarily mean it is unavailable in your area. Availability also varies by location and plan year.
            </p>
            <p className="mt-3">
              <Link href="/schedule" className="font-bold underline underline-offset-4">Book a call with Patrick</Link> or <Link href="/contact" className="font-bold underline underline-offset-4">request follow-up</Link> if you need help checking an option. New to Medicare? Start with the <Link href="/turning-65-medicare" className="font-bold underline underline-offset-4">Turning 65 guide</Link>.
            </p>
          </PremiumContentBand>
        </div>
      </Container>
    </>
  );
}
