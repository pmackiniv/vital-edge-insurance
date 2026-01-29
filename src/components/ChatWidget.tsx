"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [county, setCounty] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedResources = useMemo(() => resourcesForTopic(topic), [topic]);
  const canEnroll = useMemo(() => /medicare|aca/i.test(topic), [topic]);

  const resetFlow = () => {
    setStep(1);
    setTopic("");
    setCounty("");
    setContactMethod("");
    setMessage("");
    setConsent(false);
    setError("");
    setSubmitted(false);
    setIsSubmitting(false);
  };

  const goNext = () => {
    setError("");
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Unable to submit right now.");
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--brand-green)]"
      >
        Talk with a licensed agent now
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 w-full max-w-md border-l border-black/10 bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/10 p-4">
                <div>
                <div className="text-sm font-semibold text-black">Talk with a licensed agent now</div>
                  <div className="text-xs text-black/60">Educational guidance + routing</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetFlow();
                  }}
                  className="rounded-full border border-black/10 p-2 text-black/60 hover:text-black"
                  aria-label="Close chat"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12" />
                    <path d="M18 6l-12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto p-5">
                <div className="flex items-center gap-2 text-xs text-black/50">
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

                {step === 1 ? (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-black">What are you looking for?</div>
                    <div className="grid gap-2">
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
                        rows={3}
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
                        {suggestedResources.map((item) => (
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
                        type="button"
                        onClick={handleSubmit}
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
                    </div>

                    <div className="rounded-xl border border-black/10 p-3 text-xs text-black/60">
                      <div className="font-semibold text-black">Talk to Patrick now</div>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <a className="text-black hover:underline" href={`tel:${site.phoneE164}`}>
                          Call {site.phoneDisplay}
                        </a>
                        <a className="text-black hover:underline" href={`mailto:${site.email}`}>
                          Email {site.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
