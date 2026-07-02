"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import {
  AUTOMATED_CONTACT_CONSENT_TEXT,
  AUTOMATED_CONTACT_CONSENT_VERSION,
  PERMISSION_TO_CONTACT_TEXT,
  PERMISSION_TO_CONTACT_VERSION,
} from "@/lib/leadConsent";
import { buildClientLeadTracking } from "@/lib/clientLeadTracking";
import { externalLinkProps, LINKEDIN_PERSONAL } from "@/lib/externalLinks";
import { site } from "@/lib/site";

const stateOptions = ["Florida", "Georgia", "South Carolina", "North Carolina", "Texas", "Tennessee", "Arizona", "Washington", "Pennsylvania", "Ohio", "Michigan", "Louisiana"];

function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = (searchParams.get("topic")?.trim() || "").toLowerCase();
  const topicMap: Record<string, string> = {
    aca: "ACA",
    medicare: "Medicare",
    ichra: "ICHRA",
    "life-insurance": "Life Insurance",
    "final-expense": "Final Expense",
    "term-life": "Term Life",
    "dental-vision-hearing": "Dental / Vision / Hearing",
    "hospital-plans": "Hospital Plans",
    "cancer-heart-stroke": "Cancer / Heart Attack / Stroke",
    other: "Other",
  };
  const defaultTopic = topicMap[topicParam] || "";
  const storedFirst = typeof window !== "undefined" ? window.localStorage.getItem("ve_lead_first_name") ?? "" : "";
  const storedLast = typeof window !== "undefined" ? window.localStorage.getItem("ve_lead_last_name") ?? "" : "";
  const defaultFirstName =
    searchParams.get("firstName")?.trim() ||
    searchParams.get("first_name")?.trim() ||
    searchParams.get("name")?.trim() ||
    storedFirst;
  const defaultLastName =
    searchParams.get("lastName")?.trim() ||
    searchParams.get("last_name")?.trim() ||
    storedLast;
  const defaultEmail = searchParams.get("email")?.trim() || "";
  const defaultPhone = searchParams.get("phone")?.trim() || "";
  const defaultZip = searchParams.get("zip")?.trim() || "";
  const defaultMessage = searchParams.get("message")?.trim() || "";
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const followUp = String(formData.get("request_follow_up") || "").toLowerCase();
    const intent = followUp === "yes";
    setError("");

    const firstName = String(formData.get("firstName") || formData.get("first_name") || "").trim();
    const lastName = String(formData.get("lastName") || formData.get("last_name") || "").trim();
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const state = String(formData.get("state") || "").trim();
    const county = String(formData.get("county") || "").trim();
    const zip = String(formData.get("zip") || "").trim();
    const preferredContactMethod = String(formData.get("preferred_contact_method") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const consent = String(formData.get("consent") || "") === "yes";
    const automatedContactConsent = String(formData.get("automated_contact_consent") || "") === "yes";
    const licensedAgentDisclosure = String(formData.get("licensed_agent_disclosure") || "") === "yes";

    if (!name || !message) {
      setError("Please provide your name and a short message.");
      return;
    }

    if (!email && !phone) {
      setError("Please provide an email or phone number.");
      return;
    }

    if (!consent) {
      setError("Please provide consent to be contacted.");
      return;
    }
    if (!licensedAgentDisclosure) {
      setError("Please acknowledge that your information may be shared with a licensed agent for follow-up.");
      return;
    }

    const contactMethod = [
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      email && `Email: ${email}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const leadCategory = /medicare/i.test(topic)
      ? "Medicare consumer review"
      : /ichra|group|employer/i.test(topic)
        ? "Employer/private options"
        : "ACA/private health";
    const tracking = buildClientLeadTracking(window.location.pathname, leadCategory);
    const enrichedMessage = [
      message,
      `State: ${state || "Not provided"}`,
      `County: ${county || "Not provided"}`,
      zip ? `ZIP: ${zip}` : "",
      preferredContactMethod ? `Preferred contact method: ${preferredContactMethod}` : "",
      `Request follow up: ${intent ? "yes" : "no"}`,
    ].filter(Boolean).join("\n");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "General inquiry",
          county,
          state,
          zip,
          contactMethod: [preferredContactMethod && `Preferred: ${preferredContactMethod}`, contactMethod || "Contact provided"].filter(Boolean).join(" | "),
          message: enrichedMessage,
          consent: true,
          permissionToContactMethod: phone && email ? "Phone, Text, Email" : phone ? "Phone/Text" : "Email",
          permissionToContactText: PERMISSION_TO_CONTACT_TEXT,
          permissionToContactVersion: PERMISSION_TO_CONTACT_VERSION,
          automatedContactConsent,
          automatedContactConsentText: AUTOMATED_CONTACT_CONSENT_TEXT,
          automatedContactConsentVersion: AUTOMATED_CONTACT_CONSENT_VERSION,
          dataSharingConsent: true,
          dataSharingRecipient: "Vital Edge Licensed Agent",
          dataSharingEntities: ["Vital Edge Licensed Agent"],
          leadTransferDisclosureAck: true,
          beneficiaryInitiated: true,
          productInterest: topic || "General inquiry",
          intent,
          ...tracking,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = typeof data?.error === "string" ? data.error : "We could not submit your request.";
        throw new Error(errorMessage);
      }
      router.push("/contact/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const answerBlock =
    `How do you contact Vital Edge Insurance? You can call or text ${site.phoneDisplay}, use the form below, or request a callback from the chat. We respond as quickly as possible during business hours. A licensed agent will follow up with you.`;

  const contactFaqs = [
    {
      question: "How quickly will I hear back?",
      answer: `We respond as quickly as possible during business hours. For urgent questions, call or text ${site.phoneDisplay}.`,
    },
    {
      question: "What should I include in my message?",
      answer: "Your name, topic (ACA, Medicare, ICHRA, or other), and how you prefer to be contacted. A short description of what you need helps us route you to the right next step.",
    },
    {
      question: "Can I schedule a call?",
      answer: "Yes. Use the Schedule a call link in the header or footer, or mention in your message that you would like to book a time.",
    },
    {
      question: "Do you offer enrollment links?",
      answer: "Yes. When appropriate we provide secure enrollment links so you can complete your application online.",
    },
    {
      question: "What information should I avoid sending?",
      answer: "Please do not send Social Security numbers, Medicare Beneficiary Identifiers, or other sensitive IDs.",
    },
  ];

  const contactFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contactFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <PremiumInteriorHero
      eyebrow="Request a Call"
      title="Contact Vital Edge Insurance"
      subtitle="Tell us what you need and we will follow up with clear, compliant next steps."
      actions={[
        { label: "Call Now", href: `tel:${site.phoneE164}`, kind: "primary" },
        { label: "Schedule a Call", href: "/schedule", kind: "gold" },
        { label: "Educational Chat", href: "/chat", kind: "light" },
      ]}
    >
      <PremiumDisclosure>
        Please do not send Social Security numbers, Medicare Beneficiary Identifiers, or other sensitive IDs through this
        website.
      </PremiumDisclosure>
    </PremiumInteriorHero>

      <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-normal text-[var(--ve-teal)]">Contact details</h2>
          <div className="mt-3 rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-5 font-sans text-sm text-slate-700 shadow-[0_18px_52px_rgba(15,23,42,0.08)]" aria-label="How to contact Vital Edge">
            <p className="leading-7">{answerBlock}</p>
          </div>
          <div className="mt-4 rounded-3xl border border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(228,246,247,0.92),rgba(255,255,255,0.94))] p-5 font-sans text-sm text-slate-700 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ve-teal)]">Self-service enrollment</div>
            <p className="mt-2 leading-6">
              Use secure, third-party enrollment links when you already know your next step. If you’d rather enroll with
              a licensed agent, we can help.
            </p>
            <Link href="/enroll" className="mt-3 inline-flex items-center text-sm font-bold text-[var(--ve-teal)] underline underline-offset-4">
              View enrollment links
            </Link>
            <p className="mt-2 text-xs text-slate-600">
              Third-party enrollment partners. Licensed guidance is available if you prefer to enroll with help.
            </p>
          </div>
          <p className="mt-5 font-sans text-sm leading-6 text-slate-700">
            Tell us what you need and we will follow up with clear next steps.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  defaultValue={defaultFirstName}
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  required
                  autoComplete="given-name"
                  onChange={(event) => {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("ve_lead_first_name", event.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  defaultValue={defaultLastName}
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  required
                  autoComplete="family-name"
                  onChange={(event) => {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("ve_lead_last_name", event.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="topic" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  defaultValue={defaultTopic}
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                >
                  <option value="">Select one</option>
                  <option value="ACA">ACA</option>
                  <option value="Medicare">Medicare</option>
                  <option value="ICHRA">ICHRA</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Final Expense">Final Expense</option>
                  <option value="Term Life">Term Life</option>
                  <option value="Dental / Vision / Hearing">Dental / Vision / Hearing</option>
                  <option value="Hospital Plans">Hospital Plans</option>
                  <option value="Cancer / Heart Attack / Stroke">Cancer / Heart Attack / Stroke</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="request_follow_up" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  Request licensed agent follow up
                </label>
                <select
                  id="request_follow_up"
                  name="request_follow_up"
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  required
                >
                  <option value="">Select one</option>
                  <option value="no">No, general inquiry</option>
                  <option value="yes">Yes, request follow up</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={defaultEmail}
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={defaultPhone}
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>
              <div>
                <label htmlFor="preferred_contact_method" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  Preferred contact method
                </label>
                <select
                  id="preferred_contact_method"
                  name="preferred_contact_method"
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  required
                >
                  <option value="Call">Call</option>
                  <option value="Text">Text</option>
                  <option value="Email">Email</option>
                </select>
              </div>
              <div>
                <label htmlFor="state" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  defaultValue="Florida"
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  required
                >
                  {stateOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="county" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  County
                </label>
                <input
                  id="county"
                  name="county"
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                />
              </div>
              <div>
                <label htmlFor="zip" className="text-sm font-extrabold text-[var(--ve-teal)]">
                  ZIP
                </label>
                <input
                  id="zip"
                  name="zip"
                  defaultValue={defaultZip}
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-extrabold text-[var(--ve-teal)]">
                Message
              </label>
                <textarea
                  id="message"
                  name="message"
                  defaultValue={defaultMessage}
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-[var(--ve-teal)]/15 p-4 text-sm"
                  required
                />
              <p className="mt-2 text-xs text-slate-600">
                Please do not submit Medicare numbers, Social Security numbers, or sensitive medical information through this form.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/45 p-3">
              <div className="mb-2 text-xs font-extrabold text-[var(--ve-teal)]">Permission to Contact</div>
              <label className="flex items-start gap-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  name="consent"
                  value="yes"
                  className="mt-0.5"
                  required
                />
                <span>{PERMISSION_TO_CONTACT_TEXT}</span>
              </label>
            </div>
            <div className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/45 p-3">
              <div className="mb-2 text-xs font-extrabold text-[var(--ve-teal)]">Automated communications consent</div>
              <label className="flex items-start gap-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  name="automated_contact_consent"
                  value="yes"
                  className="mt-0.5"
                />
                <span>{AUTOMATED_CONTACT_CONSENT_TEXT}</span>
              </label>
              <p className="mt-2 text-xs text-slate-600">
                Optional. Permission to Contact above still lets Patrick respond manually about your request.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/45 p-3">
              <label className="flex items-start gap-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  name="licensed_agent_disclosure"
                  value="yes"
                  className="mt-0.5"
                  required
                />
                <span>
                  I provide express written consent for my information to be shared with a licensed agent at Vital Edge
                  Insurance for follow-up, and I understand my request may be transferred for follow-up.
                </span>
              </label>
            </div>

            {error ? <p className="text-xs text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-small-button premium-small-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 font-sans text-sm text-slate-700 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <div className="text-sm font-extrabold text-[var(--ve-teal)]">Reach us directly</div>
            <div className="mt-3 space-y-2">
              <a className="block font-bold text-[var(--ve-teal)] underline underline-offset-4" href={`tel:${site.phoneE164}`}>
                {site.phoneDisplay}
              </a>
              <a className="block font-bold text-[var(--ve-teal)] underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="block font-bold text-[var(--ve-teal)] underline underline-offset-4" href={LINKEDIN_PERSONAL} {...externalLinkProps()}>
                Connect with Patrick on LinkedIn
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              We respond as quickly as possible during business hours.
            </p>
          </div>
          <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]" aria-labelledby="contact-faq-heading">
            <h2 id="contact-faq-heading" className="font-display text-2xl font-bold tracking-normal text-[var(--ve-teal)]">Contact FAQs</h2>
            <div className="mt-4 space-y-4 font-sans text-sm text-slate-700">
              {contactFaqs.map((item) => (
                <div key={item.question}>
                  <div className="font-extrabold text-[var(--ve-teal)]">{item.question}</div>
                  <p className="mt-1 leading-6">{item.answer}</p>
                </div>
              ))}
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqJsonLd) }} />
          </section>
        </aside>
      </div>
      </Container>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<Container className="py-14"><div className="h-64 animate-pulse rounded-2xl border border-black/10 bg-white p-6" /></Container>}>
      <ContactForm />
    </Suspense>
  );
}
