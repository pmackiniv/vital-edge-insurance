"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = (searchParams.get("topic")?.trim() || "").toLowerCase();
  const topicMap: Record<string, string> = { aca: "ACA", medicare: "Medicare", ichra: "ICHRA", other: "Other" };
  const defaultTopic = topicMap[topicParam] || "";
  const storedFirst = typeof window !== "undefined" ? window.localStorage.getItem("ve_lead_first_name") ?? "" : "";
  const storedLast = typeof window !== "undefined" ? window.localStorage.getItem("ve_lead_last_name") ?? "" : "";
  const defaultFirstName = searchParams.get("first_name")?.trim() || searchParams.get("name")?.trim() || storedFirst;
  const defaultLastName = searchParams.get("last_name")?.trim() || storedLast;
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

    const firstName = String(formData.get("first_name") || "").trim();
    const lastName = String(formData.get("last_name") || "").trim();
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const zip = String(formData.get("zip") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const consent = String(formData.get("consent") || "") === "yes";

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

    const contactMethod = [
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      email && `Email: ${email}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const messageWithZip = zip ? `${message}\nZIP: ${zip}` : message;
    const enrichedMessage = `${messageWithZip}\nRequest follow up: ${intent ? "yes" : "no"}`;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "General inquiry",
          county: "",
          contactMethod: contactMethod || "Contact provided",
          message: enrichedMessage,
          consent: true,
          intent,
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
    `How do you contact Vital Edge Insurance? You can call or text ${site.phoneDisplay}, use the form below, or request a callback from the chat. We respond as quickly as possible during business hours. Patrick Mackin IV is the licensed agent.`;

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
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Contact</h1>
          <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/80" aria-label="How to contact Vital Edge">
            <p className="leading-7">{answerBlock}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-black/10 bg-[var(--muted)] p-4 text-sm text-black/70">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Self-service enrollment</div>
            <p className="mt-2 leading-6">
              Use secure, third-party enrollment links when you already know your next step. If you’d rather enroll with
              a licensed agent, we can help.
            </p>
            <Link href="/enroll" className="mt-3 inline-flex items-center text-sm font-semibold text-black hover:underline">
              View enrollment links
            </Link>
            <p className="mt-2 text-xs text-black/60">
              Third-party enrollment partners. Licensed guidance is available if you prefer to enroll with help.
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Tell us what you need and we will follow up with clear next steps.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-black/10 bg-white p-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="text-sm font-semibold text-black">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  defaultValue={defaultFirstName}
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
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
                <label htmlFor="last_name" className="text-sm font-semibold text-black">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  defaultValue={defaultLastName}
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
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
                <label htmlFor="topic" className="text-sm font-semibold text-black">
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  defaultValue={defaultTopic}
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
                >
                  <option value="">Select one</option>
                  <option value="ACA">ACA</option>
                  <option value="Medicare">Medicare</option>
                  <option value="ICHRA">ICHRA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="request_follow_up" className="text-sm font-semibold text-black">
                  Request licensed agent follow up
                </label>
                <select
                  id="request_follow_up"
                  name="request_follow_up"
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
                  required
                >
                  <option value="">Select one</option>
                  <option value="no">No, general inquiry</option>
                  <option value="yes">Yes, request follow up</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-black">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={defaultEmail}
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-black">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={defaultPhone}
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>
              <div>
                <label htmlFor="zip" className="text-sm font-semibold text-black">
                  ZIP
                </label>
                <input
                  id="zip"
                  name="zip"
                  defaultValue={defaultZip}
                  className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4 text-sm"
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-semibold text-black">
                Message
              </label>
                <textarea
                  id="message"
                  name="message"
                  defaultValue={defaultMessage}
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-black/10 p-4 text-sm"
                  required
                />
            </div>

            <div className="rounded-xl border border-black/10 p-3">
              <label className="flex items-start gap-3 text-xs text-black/70">
                <input
                  type="checkbox"
                  name="consent"
                  value="yes"
                  className="mt-0.5"
                  required
                />
                <span>
                  By checking this box, you agree to be contacted by call, text, and/or email about your request.
                  Message &amp; data rates may apply. Reply STOP to opt out.
                </span>
              </label>
            </div>

            {error ? <p className="text-xs text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-black px-5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
            <div className="text-sm font-semibold text-black">Reach us directly</div>
            <div className="mt-3 space-y-2">
              <a className="block text-black hover:underline" href={`tel:${site.phoneE164}`}>
                {site.phoneDisplay}
              </a>
              <a className="block text-black hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <p className="mt-4 text-xs text-black/60">
              We respond as quickly as possible during business hours.
            </p>
          </div>
          <section className="rounded-2xl border border-black/10 bg-white p-6" aria-labelledby="contact-faq-heading">
            <h2 id="contact-faq-heading" className="text-sm font-semibold text-black">Contact FAQs</h2>
            <div className="mt-4 space-y-3 text-sm text-black/80">
              {contactFaqs.map((item) => (
                <div key={item.question}>
                  <div className="font-semibold text-black">{item.question}</div>
                  <p className="mt-1 leading-6">{item.answer}</p>
                </div>
              ))}
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqJsonLd) }} />
          </section>
        </aside>
      </div>
    </Container>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<Container className="py-14"><div className="h-64 animate-pulse rounded-2xl border border-black/10 bg-white p-6" /></Container>}>
      <ContactForm />
    </Suspense>
  );
}
