"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

type LeadPayload = {
  coverageType: string;
  zipCode: string;
  contactMethod: string;
  consent: boolean;
};

export default function ChatPage() {
  const [coverageType, setCoverageType] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const callHref = site.phoneE164 ? `tel:${site.phoneE164}` : "tel:";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!coverageType || !zipCode || !contactMethod || !consent) {
      setError("Please complete all fields and provide consent to continue.");
      return;
    }

    const payload: LeadPayload = {
      coverageType,
      zipCode,
      contactMethod,
      consent,
    };

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Something went wrong. Please try again or use the contact page.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <Container className="py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Chat triage</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Share a few details so we can route you to the right next step. We do not provide plan recommendations or
          collect Medicare ID information here.
        </p>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border border-black/10 bg-white p-6">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="coverageType">
                What type of coverage are you looking for?
              </label>
              <select
                id="coverageType"
                value={coverageType}
                onChange={(event) => setCoverageType(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                required
              >
                <option value="">Select one</option>
                <option value="ACA">ACA Marketplace</option>
                <option value="Medicare">Medicare</option>
                <option value="ICHRA">ICHRA / Small business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-black" htmlFor="zipCode">
                ZIP code
              </label>
              <input
                id="zipCode"
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                placeholder="32200"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-black" htmlFor="contactMethod">
                Best contact method
              </label>
              <input
                id="contactMethod"
                value={contactMethod}
                onChange={(event) => setContactMethod(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                placeholder="Phone or email"
                required
              />
            </div>

            <div className="rounded-xl border border-black/10 p-3">
              <label className="flex items-start gap-3 text-xs text-black/70">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5"
                  required
                />
                <span>
                  By checking this box, I consent to be contacted by Vital Edge Insurance at the phone number/email
                  provided (including by autodialed calls/texts where permitted). Msg & data rates may apply. Reply STOP to
                  opt out.
                </span>
              </label>
            </div>

            {error ? <p className="text-xs text-red-600">{error}</p> : null}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-black/70">Thanks! Choose your next step.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/enroll"
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Start enrollment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
              >
                Schedule a call
              </Link>
              <a
                href={callHref}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
              >
                Call now
              </a>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
