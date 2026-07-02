"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { PLANENROLL } from "@/lib/externalLinks";
import {
  AUTOMATED_CONTACT_CONSENT_TEXT,
  AUTOMATED_CONTACT_CONSENT_VERSION,
  PERMISSION_TO_CONTACT_TEXT,
  PERMISSION_TO_CONTACT_VERSION,
} from "@/lib/leadConsent";
import { buildClientLeadTracking } from "@/lib/clientLeadTracking";
import { site } from "@/lib/site";

const GENERAL_TPMO_DISCLAIMER =
  "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.";
const stateOptions = ["Florida", "Georgia", "South Carolina", "North Carolina", "Texas", "Tennessee", "Arizona", "Washington", "Pennsylvania", "Ohio", "Michigan", "Louisiana"];

export default function MedicareAdvantageRequestPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("Florida");
  const [county, setCounty] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [automatedContactConsent, setAutomatedContactConsent] = useState(false);
  const [licensedAgentDisclosure, setLicensedAgentDisclosure] = useState(false);
  const [callRecordingConsent, setCallRecordingConsent] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const scheduleHref = site.scheduleUrl || `tel:${site.phoneE164}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !phone || !consent || !licensedAgentDisclosure) {
      setError("Complete required fields and all consent acknowledgments to continue.");
      return;
    }

    const contactMethod = `Name: ${firstName} ${lastName} | Phone: ${phone}${email ? ` | Email: ${email}` : ""}`;
    const tracking = buildClientLeadTracking(window.location.pathname, "Medicare consumer review");
    const enrichedMessage = [
      message.trim(),
      `State: ${state}`,
      `County: ${county || "Not provided"}`,
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
        setError(data.error || "Unable to submit your request right now.");
        return;
      }
      setSuccess(data.message || "Thanks. Patrick Mackin IV will follow up on your Medicare Advantage request.");
    } catch {
      setError("Unable to submit your request right now.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <PremiumInteriorHero
        eyebrow="Medicare"
        title="Request Medicare Advantage Call"
        subtitle="Share your ZIP and contact details so a licensed agent can follow up with Medicare Advantage guidance."
        actions={[
          { label: "Start My Review", href: PLANENROLL, kind: "primary", external: true },
          { label: "Schedule a Call", href: scheduleHref, kind: "gold" },
          { label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneE164}`, kind: "light" },
        ]}
      >
        <PremiumDisclosure>{GENERAL_TPMO_DISCLAIMER}</PremiumDisclosure>
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
        <div className="grid gap-3 md:grid-cols-3">
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
          <label htmlFor="ma-zip" className="sr-only">
            ZIP
          </label>
          <input
            id="ma-zip"
            data-testid="ma-zip"
            value={zip}
            onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="ZIP"
            className="rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
            inputMode="numeric"
            required
          />
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
          placeholder="Tell us what you need help with"
          rows={4}
          className="w-full rounded-xl border border-[var(--ve-teal)]/15 px-3 py-2 text-sm"
        />
        <p className="text-xs text-slate-600">
          Please do not submit Medicare numbers, Social Security numbers, or sensitive medical information through this form.
        </p>

        <label className="flex items-start gap-2 text-xs text-slate-700">
          <input type="checkbox" checked={callRecordingConsent} onChange={(event) => setCallRecordingConsent(event.target.checked)} />
          <span>This call may be recorded for compliance and quality assurance, and I agree to continue on a recorded line.</span>
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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            data-testid="ma-submit"
            disabled={submitLoading}
            className="premium-small-button premium-small-button-primary disabled:opacity-50"
          >
            {submitLoading ? "Submitting..." : "Request Medicare Advantage Call"}
          </button>
          <a href={scheduleHref} className="premium-small-button premium-small-button-light">
            Schedule a call
          </a>
        </div>

        <div data-testid="tpmo-disclaimer" className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/50 p-3 text-xs text-slate-700">
          <p className="font-extrabold text-[var(--ve-teal)]">TPMO disclaimer</p>
          <p className="mt-2">{GENERAL_TPMO_DISCLAIMER}</p>
        </div>

        {error ? <p className="text-sm text-amber-700">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}
      </form>
    </Container>
    </>
  );
}
