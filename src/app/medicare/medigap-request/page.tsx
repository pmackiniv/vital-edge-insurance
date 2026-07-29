"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import {
  AUTOMATED_CONTACT_CONSENT_TEXT,
  AUTOMATED_CONTACT_CONSENT_VERSION,
  PERMISSION_TO_CONTACT_TEXT,
  PERMISSION_TO_CONTACT_VERSION,
} from "@/lib/leadConsent";
import { buildClientLeadTracking } from "@/lib/clientLeadTracking";
import { site } from "@/lib/site";

const stateOptions = ["Florida", "Georgia", "South Carolina", "North Carolina", "Texas", "Tennessee", "Arizona", "Washington", "Pennsylvania", "Ohio", "Michigan", "Louisiana"];

export default function MedigapRequestPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("Florida");
  const [county, setCounty] = useState("");
  const [zip, setZip] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [automatedContactConsent, setAutomatedContactConsent] = useState(false);
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
    const tracking = buildClientLeadTracking(window.location.pathname, "Medicare consumer review");
    const enrichedMessage = [
      message.trim(),
      `State: ${state}`,
      `County: ${county || "Not provided"}`,
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
          county,
          state,
          zip,
          contactMethod,
          message: enrichedMessage,
          consent: true,
          permissionToContactMethod: email ? "Phone, Text, Email" : "Phone/Text",
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
          intent: true,
          ...tracking,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Unable to submit your request.");
        return;
      }
      setSuccess(data.message || "Thanks. Patrick Mackin IV will follow up on your Medigap request.");
    } catch {
      setError("Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Medicare"
        title="Request Medigap Call"
        subtitle="Share your ZIP and contact details so our team can follow up on Medicare Supplement options."
        actions={[
          { label: "Call Now", href: `tel:${site.phoneE164}`, kind: "primary" },
          { label: "Medigap Basics", href: "/medicare/medigap", kind: "gold" },
          { label: "Medicare Overview", href: "/medicare", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Medigap availability, eligibility, underwriting, carrier appointment, and plan details vary by state, age,
          timing, and carrier.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            required
          />
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            required
          >
            {stateOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <input
            value={county}
            onChange={(event) => setCounty(event.target.value)}
            placeholder="County"
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
          />
          <label htmlFor="medigap-zip" className="sr-only">
            ZIP
          </label>
          <input
            id="medigap-zip"
            value={zip}
            onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="ZIP"
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            inputMode="numeric"
            required
          />
          <select
            value={ageBand}
            onChange={(event) => setAgeBand(event.target.value)}
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
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
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            required
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email (optional)"
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            type="email"
          />
        </div>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Notes or preferred call times"
          className="w-full rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
          rows={4}
        />
        <p className="text-xs text-slate-600">
          Please do not submit Medicare numbers, Social Security numbers, or sensitive medical information through this form.
        </p>

        <label className="flex items-start gap-2 text-xs text-slate-700">
          <input type="checkbox" checked={callRecordingConsent} onChange={(event) => setCallRecordingConsent(event.target.checked)} />
          <span>I consent to continue on a recorded line for compliance and quality assurance.</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-slate-700">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
          <span><strong>Permission to Contact: </strong>{PERMISSION_TO_CONTACT_TEXT}</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-slate-700">
          <input type="checkbox" checked={automatedContactConsent} onChange={(event) => setAutomatedContactConsent(event.target.checked)} />
          <span><strong>Automated communications consent: </strong>{AUTOMATED_CONTACT_CONSENT_TEXT}</span>
        </label>
        <label className="flex items-start gap-2 text-xs text-slate-700">
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
          className="premium-small-button premium-small-button-primary disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Request Medigap Call"}
        </button>

        {error ? <p className="text-sm text-amber-700">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}
      </form>
    </Container>
    </>
  );
}
