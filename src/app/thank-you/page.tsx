import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumCard, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request Received | Vital Edge Insurance",
  alternates: {
    canonical: absoluteUrl("/thank-you"),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Request Received"
        title="Thank you"
        subtitle="We received your request and will follow up shortly with next steps."
        actions={[
          { label: "Back to Home", href: "/", kind: "primary" },
          { label: "Contact", href: "/contact", kind: "light" },
        ]}
      />
      <Container className="py-12">
        <PremiumCard title="Next step">
          We received your request and will follow up shortly with next steps.
          <div className="mt-5">
            <Link href="/" className="premium-small-button premium-small-button-primary">
              Back to home
            </Link>
          </div>
        </PremiumCard>
      </Container>
    </>
  );
}
