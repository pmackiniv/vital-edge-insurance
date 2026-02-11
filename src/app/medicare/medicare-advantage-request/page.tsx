"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const GENERAL_TPMO_DISCLAIMER =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";

export default function MedicareAdvantageRequestPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [dataSharingConsent, setDataSharingConsent] = useState(false);
  const [leadTransferDisclosureAck, setLeadTransferDisclosureAck] = useState(false);
  const [callRecordingConsent, setCallRecordingConsent] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const scheduleHref = site.scheduleUrl || `tel:${site.phoneE164}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !phone || !consent || !dataSharingConsent || !leadTransferDisclosureAck) {
      setError("Complete required fields and all disclosures to continue.");
      return;
    }

    const contactMethod = `Name: ${firstName} ${lastName} | Phone: ${phone}${email ? ` | Email: ${email}` : ""}`;
    const enrichedMessage = [
      message.trim(),
      `ZIP: ${zip.replace(/\D/g, "").slice(0, 5)}`,
      `Call recording consent: ${callRecordingConsent ? "yes" : "no"}`,
      "Licensed-agent follow-up requested from the Medicare Advantage request form.",
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "Medicare Advantage Request",
          productInterest: "Medicare Advantage",
          county: "",
          contactMethod,
          message: enrichedMessage,
          consent: true,
          dataSharingConsent: true,
          dataSharingRecipient: "Vital Edge Licensed Agent",
          dataSharingEntities: ["Vital Edge Licensed Agent"],
          leadTransferDisclosureAck: true,
          beneficiaryInitiated: true,
          intent: true,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Unable to submit your request right now.");
        return;
      }
      setSuccess(data.message || "Thanks. A licensed agent will follow up on your Medicare Advantage request.");
    } catch {
      setError("Unable to submit your request right now.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-black">Request Medicare Advantage Call</h1>
      <p className="mt-3 text-sm text-black/70">
        Share your ZIP and contact details so a licensed agent can follow up with Medicare Advantage guidance.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            required
          />
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label htmlFor="ma-zip" className="sr-only">
            ZIP
          </label>
          <input
            id="ma-zip"
            data-testid="ma-zip"
            value={zip}
            onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="ZIP"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            inputMode="numeric"
            required
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            required
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email (optional)"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            type="email"
          />
        </div>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what you need help with"
          rows={4}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        />

        <label className="flex items-start gap-2 text-xs text-black/70">
          <input type="checkbox" checked={callRecordingConsent} onChange={(event) => setCallRecordingConsent(event.target.checked)} />
          <span>This call may be recorded for compliance and quality assurance, and I agree to continue on a recorded line.</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-black/70">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
          <span>I consent to be contacted by call, text, and/or email regarding this request.</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-black/70">
          <input
            type="checkbox"
            checked={dataSharingConsent}
            onChange={(event) => setDataSharingConsent(event.target.checked)}
            required
          />
          <span>I provide express written consent for my information to be shared with Vital Edge Licensed Agent.</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-black/70">
          <input
            type="checkbox"
            checked={leadTransferDisclosureAck}
            onChange={(event) => setLeadTransferDisclosureAck(event.target.checked)}
            required
          />
          <span>I understand my information may be transferred to a licensed agent for follow-up.</span>
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            data-testid="ma-submit"
            disabled={submitLoading}
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitLoading ? "Submitting..." : "Request Medicare Advantage Call"}
          </button>
          <a href={scheduleHref} className="rounded-xl border border-black/15 px-4 py-2 text-sm font-medium text-black/80">
            Schedule a call
          </a>
        </div>

        <div data-testid="tpmo-disclaimer" className="rounded-xl border border-black/10 bg-black/[0.02] p-3 text-xs text-black/80">
          <p className="font-semibold text-black">TPMO disclaimer</p>
          <p className="mt-2">{GENERAL_TPMO_DISCLAIMER}</p>
        </div>

        {error ? <p className="text-sm text-amber-700">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}
      </form>
    </main>
  );
}
