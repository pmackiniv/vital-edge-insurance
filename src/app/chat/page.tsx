"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

type LeadPayload = {
  coverageType: string;
  zipCode: string;
  contactMethod: string;
  goal: string;
  consent: boolean;
};

const topics = ["ACA", "Medicare", "Medigap", "ICHRA", "Group", "Other"];

export default function ChatPage() {
  const [step, setStep] = useState(1);
  const [coverageType, setCoverageType] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [goal, setGoal] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canEnroll = useMemo(() => ["ACA", "Medicare"].includes(coverageType), [coverageType]);

  const goNext = () => {
    setError("");
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!coverageType || !zipCode || !contactMethod || !goal || !consent) {
      setError("Please complete all fields and provide consent to continue.");
      return;
    }

    const payload: LeadPayload = {
      coverageType,
      zipCode,
      contactMethod,
      goal,
      consent,
    };

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Something went wrong. Please try again or use the contact page.";
      try {
        const data = (await response.json()) as { error?: string };
        if (data?.error) message = data.error;
      } catch {
        // keep default
      }
      setError(message);
      return;
    }

    setSubmitted(true);
    setStep(4);
  };

  return (
    <Container className="py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Chat triage</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Premium intake for general information and routing. We do not provide plan recommendations here.
        </p>
        <div className="mt-4 space-y-2 rounded-2xl border border-black/10 bg-white p-4 text-xs text-black/70">
          <p>Automated assistant for general information and routing.</p>
          <p>For Medicare: we can provide general info, but plan-specific discussions require a Scope of Appointment.</p>
          <p>Do not enter SSN/MBI or sensitive identifiers here.</p>
        </div>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border border-black/10 bg-white p-6">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-black" htmlFor="coverageType">
                  Step 1: Choose a topic
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setCoverageType(topic)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        coverageType === topic ? "border-black bg-black text-white" : "border-black/10 text-black hover:bg-black/5"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!coverageType}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-black" htmlFor="zipCode">
                    Step 2: ZIP code
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
                    Preferred contact method
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
                <div>
                  <label className="text-sm font-semibold text-black" htmlFor="goal">
                    Short goal
                  </label>
                  <textarea
                    id="goal"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Example: clarify options for a family of four"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-semibold text-black/70 hover:text-black"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!zipCode || !contactMethod || !goal}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-black/10 p-4">
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
                      provided (including by autodialed calls/texts where permitted). Msg & data rates may apply. Reply STOP
                      to opt out.
                    </span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-semibold text-black/70 hover:text-black"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!consent}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : null}

            {error ? <p className="text-xs text-red-600">{error}</p> : null}
          </form>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <p className="text-sm text-black/70">Thanks! Choose your next step.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Continue with Patrick
              </Link>
              {canEnroll ? (
                <Link
                  href="/enroll"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
                >
                  Start enrollment
                </Link>
              ) : null}
              <Link
                href="/resources"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
              >
                Resources
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
}
