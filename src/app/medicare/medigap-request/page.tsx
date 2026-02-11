"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function MedigapRequestPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [licensedAgentDisclosure, setLicensedAgentDisclosure] = useState(false);
  const [callRecordingConsent, setCallRecordingConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !phone || !zip || !consent || !licensedAgentDisclosure) {
      setError("Complete all required fields and consent acknowledgments.");
      return;
    }

    const contactMethod = `Name: ${firstName} ${lastName} | Phone: ${phone}${email ? ` | Email: ${email}` : ""}`;
    const enrichedMessage = [
      message.trim(),
      `ZIP: ${zip.replace(/\D/g, "").slice(0, 5)}`,
      ageBand ? `Age band: ${ageBand}` : "",
      `Call recording consent: ${callRecordingConsent ? "yes" : "no"}`,
      "Licensed-agent follow-up requested from the Medigap request form.",
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "Medigap Request",
          productInterest: "Medigap",
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
        setError(data.error || "Unable to submit your request.");
        return;
      }
      setSuccess(data.message || "Thanks. A licensed agent will follow up on your Medigap request.");
    } catch {
      setError("Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-black">Request Medigap Call</h1>
      <p className="mt-3 text-sm text-black/70">
        Share your ZIP and contact details so our team can follow up on Medicare Supplement options.
      </p>
      <p className="mt-2 text-xs text-black/60">
        For immediate help, call{" "}
        <a href={`tel:${site.phoneE164}`} className="underline">{site.phoneDisplay}</a>.
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

        <div className="grid gap-3 md:grid-cols-4">
          <label htmlFor="medigap-zip" className="sr-only">
            ZIP
          </label>
          <input
            id="medigap-zip"
            value={zip}
            onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="ZIP"
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            inputMode="numeric"
            required
          />
          <select
            value={ageBand}
            onChange={(event) => setAgeBand(event.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm"
          >
            <option value="">Age band</option>
            <option value="64-66">64-66</option>
            <option value="67-72">67-72</option>
            <option value="73+">73+</option>
          </select>
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
          placeholder="Notes or preferred call times"
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
          rows={4}
        />

        <label className="flex items-start gap-2 text-xs text-black/70">
          <input type="checkbox" checked={callRecordingConsent} onChange={(event) => setCallRecordingConsent(event.target.checked)} />
          <span>I consent to continue on a recorded line for compliance and quality assurance.</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-black/70">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
          <span>I consent to be contacted by call, text, and/or email about this request.</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-black/70">
          <input
            type="checkbox"
            checked={licensedAgentDisclosure}
            onChange={(event) => setLicensedAgentDisclosure(event.target.checked)}
            required
          />
          <span>
            I provide express written consent for my information to be shared with a licensed agent at Vital Edge
            Insurance for follow-up, and I understand my request may be transferred for follow-up.
          </span>
        </label>

        <button
          type="submit"
          data-testid="medigap-submit"
          disabled={submitting}
          className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Request Medigap Call"}
        </button>

        {error ? <p className="text-sm text-amber-700">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}
      </form>
    </main>
  );
}
