import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumCard, PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";

/**
 * Effective date for the policy text below. Update this whenever the substance
 * of the policy changes -- a privacy policy without a date is not much use to a
 * reader trying to work out what they agreed to.
 */
const LAST_UPDATED = "July 30, 2026";

export default function Page() {
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Privacy"
        title="Privacy & Information Handling"
        subtitle="How Vital Edge Insurance handles information shared through forms, phone, chat, and this website."
        actions={[
          { label: "Ask a Privacy Question", href: "/contact", kind: "primary" },
          { label: "Chat With Our Team", href: "/chat", kind: "gold" },
        ]}
      >
        <PremiumDisclosure>
          Last updated {LAST_UPDATED}. Vital Edge Insurance serves consumers in the United States only. This policy
          describes current practice and is reviewed as services change.
        </PremiumDisclosure>
      </PremiumInteriorHero>

      <Container className="py-12">
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-2">
            <PremiumCard title="Information we collect">
              <p>
                Contact details and the coverage questions you choose to share through our forms, by phone, by text, or
                in chat. This typically means your name, email address, phone number, ZIP code or county, and a
                description of what you are trying to figure out.
              </p>
              <p className="mt-3">
                We do not ask for Social Security numbers, Medicare Beneficiary Identifiers, bank or card details, or
                medical records through this website. Please do not send them to us through the site.
              </p>
              <p className="mt-3">
                Our web host also records standard technical information such as your IP address, browser type, and the
                pages you visited, which is ordinary server logging common to essentially all websites.
              </p>
            </PremiumCard>

            <PremiumCard title="How we use information">
              <p>
                To answer your question, arrange a conversation, prepare for a scheduled appointment, keep required
                records of consent and disclosures, and improve how the site explains coverage.
              </p>
              <p className="mt-3">
                <strong>We do not sell personal information</strong>, and we do not share it for cross-context
                behavioural advertising. We do not use your information for marketing unrelated to your inquiry.
              </p>
              <p className="mt-3">
                Medicare-related conversations are subject to federal recordkeeping rules, so consent and disclosure
                details are retained even where the inquiry does not lead to an application.
              </p>
            </PremiumCard>

            <PremiumCard title="Cookies and similar technologies">
              <p>
                This site does not use advertising cookies, tracking pixels, or cross-site trackers.
              </p>
              <p className="mt-3">
                We keep basic, anonymous counts of which pages are viewed and how quickly they load, so the site stays
                useful and fast. This sets no cookies, does not follow you between websites, and does not receive your
                name, email address, or phone number.
              </p>
              <p className="mt-3">
                Small amounts of information may be stored in your browser to remember choices you make here, such as
                whether the chat window is minimised. That data stays in your browser.
              </p>
              <p className="mt-3">
                We honour browser privacy signals that ask us not to measure a visit.
              </p>
            </PremiumCard>

            <PremiumCard title="Service providers we share with">
              <p>
                We use a small number of vendors to operate this site and follow up on inquiries. They may process your
                information only to provide their service to us:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li><strong>Vercel</strong> — website hosting and performance</li>
                <li><strong>Neon</strong> — the database where inquiries and consent records are stored</li>
                <li><strong>Email delivery</strong> — our mail provider, and a form-relay service as a backup, used to notify us of a new inquiry</li>
                <li><strong>OpenAI</strong> — powers the website chat assistant; chat messages are processed to generate replies</li>
                <li><strong>Twilio</strong> — text message delivery, where you have asked to be contacted by text</li>
                <li><strong>Notion</strong> — our internal record of inquiries and follow-up</li>
              </ul>
              <p className="mt-3">
                We may also share details with an insurance carrier or a government marketplace when that is necessary to
                act on your request, and we will disclose information where the law requires it.
              </p>
            </PremiumCard>
          </div>

          <PremiumCard title="Your choices and rights" tone="soft">
            <p>
              You can ask us to access, correct, or delete your contact information, or to stop contacting you, at any
              time. We confirm identity before making changes. There is no charge, and we do not treat you differently
              for asking.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li><strong>Phone and text:</strong> reply STOP to any text to stop texts, or tell us during any call.</li>
              <li><strong>Email:</strong> ask us to remove you and we will.</li>
            </ul>
          </PremiumCard>

          <PremiumCard title="Questions about privacy?" tone="teal">
            <p>
              Reach out through the contact form or chat and we will respond with clear, non-technical answers. If you
              want to know exactly what we hold about you, just ask.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="premium-small-button premium-small-button-gold">
                Contact us
              </Link>
              <Link
                href="/chat"
                className="premium-small-button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
              >
                Chat now
              </Link>
            </div>
          </PremiumCard>
        </div>
      </Container>
    </>
  );
}
