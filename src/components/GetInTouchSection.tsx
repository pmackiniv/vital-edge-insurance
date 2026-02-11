"use client";

import Image from "next/image";
import { useState } from "react";

const serviceOptions = [
  "Medicare Guidance",
  "Medigap Support",
  "ACA Marketplace",
  "Life Insurance",
  "Final Expense",
  "Term Life",
  "Dental / Vision / Hearing",
  "Hospital Plans",
  "Cancer / Heart Attack / Stroke",
];

const trustBullets = [
  "Simple guidance in plain English.",
  "Licensed-agent follow-up, no call-center bounce.",
  "Coverage options tailored to your household and budget.",
  "Clear next steps from first contact to enrollment support.",
];

export function GetInTouchSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [licensedAgentDisclosure, setLicensedAgentDisclosure] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !phone || !consent || !licensedAgentDisclosure) {
      setError("Please complete all required fields and consent acknowledgments.");
      return;
    }

    const topic = selectedServices.length ? selectedServices.join(", ") : "General guidance";
    const messageText = [message.trim(), `Services selected: ${topic}`].filter(Boolean).join("\n");

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          county: "",
          contactMethod: `Name: ${firstName} ${lastName} | Phone: ${phone}${email ? ` | Email: ${email}` : ""}`,
          message: messageText,
          consent: true,
          dataSharingConsent: true,
          dataSharingRecipient: "Vital Edge Licensed Agent",
          dataSharingEntities: ["Vital Edge Licensed Agent"],
          leadTransferDisclosureAck: true,
          beneficiaryInitiated: true,
          productInterest: topic,
          intent: true,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "We could not submit your request right now.");
        return;
      }
      setSuccess(data.message || "Thanks. A licensed agent will follow up shortly.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setSelectedServices([]);
      setConsent(false);
      setLicensedAgentDisclosure(false);
    } catch {
      setError("We could not submit your request right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-white/10 bg-white/90 py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="space-y-5">
          <h2 className="text-[clamp(1.8rem,2.6vw,2.5rem)] font-semibold tracking-tight text-black">Get in touch</h2>
          <p className="max-w-lg text-sm leading-7 text-black/75">
            Have a question or need personalized help? Share a few details and a licensed agent will follow up with
            clear next steps.
          </p>
          <div className="space-y-3">
            {trustBullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[var(--brand-green)] text-white">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m4 10 4 4 8-8" />
                  </svg>
                </span>
                <p className="text-sm leading-6 text-black/75">{bullet}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-center">
            <Image src="/brand/vital-edge-logo.png" alt="Vital Edge Insurance logo" width={190} height={72} className="h-16 w-auto" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="gti-first-name" className="text-sm font-semibold text-black">First name *</label>
                <input
                  id="gti-first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label htmlFor="gti-last-name" className="text-sm font-semibold text-black">Last name *</label>
                <input
                  id="gti-last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="gti-phone" className="text-sm font-semibold text-black">Phone *</label>
                <input
                  id="gti-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                  autoComplete="tel"
                  type="tel"
                  required
                />
              </div>
              <div>
                <label htmlFor="gti-email" className="text-sm font-semibold text-black">Email</label>
                <input
                  id="gti-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                  autoComplete="email"
                  type="email"
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-black">Coverage interests</div>
              <div className="mt-2 grid max-h-48 gap-2 overflow-y-auto rounded-lg border border-black/10 p-3 sm:grid-cols-2">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-start gap-2 text-sm text-black/75">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => toggleService(service)}
                      className="mt-1 shrink-0"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="gti-message" className="text-sm font-semibold text-black">How can we help?</label>
              <textarea
                id="gti-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-2 min-h-28 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
                placeholder="Tell us what support you need."
              />
            </div>
            <label className="flex items-start gap-3 rounded-lg border border-black/10 p-3 text-xs text-black/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5 shrink-0"
                required
              />
              <span>
                By checking this box, you agree to be contacted by call, text, and/or email about your request.
                Message &amp; data rates may apply. Reply STOP to opt out.
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-black/10 p-3 text-xs text-black/70">
              <input
                type="checkbox"
                checked={licensedAgentDisclosure}
                onChange={(event) => setLicensedAgentDisclosure(event.target.checked)}
                className="mt-0.5 shrink-0"
                required
              />
              <span>
                I provide express written consent for my information to be shared with a licensed agent at Vital Edge
                Insurance for follow-up, and I understand my request may be transferred for follow-up.
              </span>
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            {success ? <p className="text-sm text-green-700">{success}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--brand-blue)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-green)] disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
