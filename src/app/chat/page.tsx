"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { resourcesForTopic } from "@/lib/knowledgeBase";
import { site } from "@/lib/site";

type LeadPayload = {
  topic: string;
  county: string;
  contactMethod: string;
  message: string;
  consent: boolean;
};

const topics = ["Medicare", "ACA Marketplace", "Small Business", "Other"];
const counties = ["Duval County", "St. Johns County", "Other"];
const contactMethods = ["Call", "Text", "Email"];

export default function ChatPage() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [county, setCounty] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resources = useMemo(() => resourcesForTopic(topic), [topic]);
  const canEnroll = useMemo(() => /medicare|aca/i.test(topic), [topic]);

  const goNext = () => {
    setError("");
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!topic || !county || !contactMethod || !message || !consent) {
      setError("Please complete all fields and provide consent to continue.");
      return;
    }

    const payload: LeadPayload = {
      topic,
      county,
      contactMethod,
      message,
      consent,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong. Please try again or use the contact page.");
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-14">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Chat with Patrick</h1>
        <p className="text-sm leading-6 text-black/70">
          This guided assistant is for general information and routing. It does not provide plan recommendations or
          collect sensitive identifiers.
        </p>
        <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-4 text-xs text-black/70">
          <p>This chat may use AI assistance to provide general information.</p>
          <p className="mt-2">
            For enrollment or plan-specific advice, request a call or use official enrollment links.
          </p>
          <p className="mt-2">Do not enter SSN/Medicare ID or sensitive identifiers here.</p>
          <p className="mt-2">
            Want a human handoff? Call <a className="text-black hover:underline" href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a> or
            email <a className="text-black hover:underline" href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-3xl rounded-2xl border border-black/10 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-black/50">
          {["Topic", "Details", "Next steps"].map((label, index) => {
            const current = index + 1;
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                    step >= current ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/50"
                  }`}
                >
                  {current}
                </span>
                <span className={step >= current ? "text-black" : "text-black/50"}>{label}</span>
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-black">Step 1: Choose a topic</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {topics.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        topic === item ? "border-black bg-black text-white" : "border-black/10 text-black hover:bg-black/5"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!topic}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-black">County</label>
                  <select
                    value={county}
                    onChange={(event) => setCounty(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                  >
                    <option value="">Select county</option>
                    {counties.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">Preferred contact method</label>
                  <select
                    value={contactMethod}
                    onChange={(event) => setContactMethod(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                  >
                    <option value="">Select one</option>
                    {contactMethods.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">Short message</label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                    rows={4}
                    placeholder="Share what you need help with"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={goBack} className="text-sm font-semibold text-black/70 hover:text-black">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!county || !contactMethod || !message}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-black/10 p-4 text-xs text-black/70">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      By checking this box, I consent to be contacted by Vital Edge Insurance at the phone number/email
                      provided (including by autodialed calls/texts where permitted). Msg & data rates may apply. Reply STOP
                      to opt out.
                    </span>
                  </label>
                </div>

                <div>
                  <div className="text-sm font-semibold text-black">Recommended resources</div>
                  <div className="mt-3 space-y-2">
                    {resources.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/resources#${item.slug}`}
                        className="block rounded-xl border border-black/10 px-3 py-2 text-sm text-black hover:bg-black/5"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {error ? <p className="text-xs text-red-600">{error}</p> : null}
                {submitted ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
                    Got it, Patrick will follow up.
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!consent || isSubmitting || submitted}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Request Call Back"}
                  </button>
                  {canEnroll ? (
                    <Link
                      href="/enroll"
                      className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
                    >
                      Enroll
                    </Link>
                  ) : null}
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
                  >
                    Talk to Patrick
                  </Link>
                </div>
              </div>
            ) : null}
          </form>
        ) : null}
      </div>
    </Container>
  );
}
