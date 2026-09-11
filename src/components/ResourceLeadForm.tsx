"use client";

import { useState } from "react";
import { getResourceContact, type ResourceContactMethod } from "@/lib/resourceLeadContact";
import {
  AUTOMATED_CONTACT_CONSENT_TEXT,
  AUTOMATED_CONTACT_CONSENT_VERSION,
  PERMISSION_TO_CONTACT_TEXT,
  PERMISSION_TO_CONTACT_VERSION,
} from "@/lib/leadConsent";

type ResourceLeadFormProps = {
  variant?: "consumer" | "event" | "partner";
  leadCategory: string;
  pageSource: string;
  defaultTopic: string;
  showMedicareTiming?: boolean;
};

const helpOptions = [
  "Medicare consumer review",
  "Turning 65",
  "Extra Help/Medicaid question",
  "Community event request",
  "Referral partner inquiry",
  "LinkedIn lead",
  "ACA/private health",
  "Employer/private options",
];

const stateOptions = [
  "Florida",
  "Georgia",
  "South Carolina",
  "North Carolina",
  "Texas",
  "Tennessee",
  "Arizona",
  "Washington",
  "Pennsylvania",
  "Ohio",
  "Michigan",
  "Louisiana",
];

const audienceOptions = [
  "Church or faith community",
  "Senior center",
  "Library or community center",
  "Senior apartment community",
  "Assisted living community",
  "Nursing home",
  "Doctors' office",
  "Dental office",
  "Pharmacy",
  "Financial advisor or elder law office",
  "Home health agency",
  "Other local organization",
];

function getTracking(pageSource: string, leadCategory: string, variant?: string) {
  if (typeof window === "undefined") {
    return {
      leadSource: "Website",
      pageSource,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      linkedinReferral: false,
      eventReferral: variant === "event",
      partnerReferral: variant === "partner",
      leadCategory,
      consentTimestamp: new Date().toISOString(),
    };
  }

  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer || "";
  const utmSource = params.get("utm_source") || "";
  const source = params.get("source") || "";
  const linkedinReferral = /linkedin/i.test([utmSource, source, referrer, pageSource].join(" "));

  return {
    leadSource: source || utmSource || "Website",
    pageSource,
    utmSource,
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    linkedinReferral,
    eventReferral: variant === "event" || params.get("event") === "1",
    partnerReferral: variant === "partner" || params.get("partner") === "1",
    leadCategory,
    consentTimestamp: new Date().toISOString(),
  };
}

export function ResourceLeadForm({
  variant = "consumer",
  leadCategory,
  pageSource,
  defaultTopic,
  showMedicareTiming = false,
}: ResourceLeadFormProps) {
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("Florida");
  const [county, setCounty] = useState("");
  const [zip, setZip] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<ResourceContactMethod>("Call");
  const [coverageSituation, setCoverageSituation] = useState("");
  const [coverageMonth, setCoverageMonth] = useState("");
  const [helpRequested, setHelpRequested] = useState(leadCategory);
  const [audienceType, setAudienceType] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [estimatedAttendance, setEstimatedAttendance] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [automatedContactConsent, setAutomatedContactConsent] = useState(false);
  const [licensedAgentDisclosure, setLicensedAgentDisclosure] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOrganizationForm = variant === "event" || variant === "partner";
  const contact = getResourceContact(preferredContactMethod, phone, email);
  const title =
    variant === "event"
      ? "Request an educational event"
      : variant === "partner"
        ? "Start a referral partner conversation"
        : "Request coverage guidance";

  const submitLabel =
    variant === "event" ? "Request Event" : variant === "partner" ? "Request Partner Follow-Up" : "Request Guidance";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!contactName.trim() || !contact.hasRequiredContact || !state || !zip || !preferredContactMethod || !helpRequested || !consent || !licensedAgentDisclosure) {
      setError("Please complete required fields and consent acknowledgments.");
      return;
    }
    if (isOrganizationForm && !organizationName) {
      setError("Please include the organization name.");
      return;
    }

    const tracking = getTracking(pageSource, helpRequested, variant);
    const messageLines = [
      isOrganizationForm ? `Organization: ${organizationName}` : "",
      `Contact name: ${contactName}`,
      `State: ${state}`,
      `County: ${county || "Not provided"}`,
      `ZIP: ${zip}`,
      `Preferred contact method: ${preferredContactMethod}`,
      `Type of help requested: ${helpRequested}`,
      showMedicareTiming && coverageSituation ? `Medicare timing situation: ${coverageSituation}` : "",
      showMedicareTiming && coverageMonth ? `Expected coverage month: ${coverageMonth}` : "",
      audienceType ? `Audience type: ${audienceType}` : "",
      preferredDateTime ? `Preferred date/time: ${preferredDateTime}` : "",
      estimatedAttendance ? `Estimated attendance: ${estimatedAttendance}` : "",
      notes ? `Notes: ${notes}` : "",
      `Lead source: ${tracking.leadSource}`,
      `Page source: ${tracking.pageSource}`,
      tracking.utmSource ? `UTM source: ${tracking.utmSource}` : "",
      tracking.utmMedium ? `UTM medium: ${tracking.utmMedium}` : "",
      tracking.utmCampaign ? `UTM campaign: ${tracking.utmCampaign}` : "",
      `LinkedIn referral: ${tracking.linkedinReferral ? "yes" : "no"}`,
      `Event referral: ${tracking.eventReferral ? "yes" : "no"}`,
      `Partner referral: ${tracking.partnerReferral ? "yes" : "no"}`,
    ].filter(Boolean).join("\n");

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: defaultTopic,
          county,
          state,
          zip,
          contactMethod: contact.summary,
          message: messageLines,
          consent,
          permissionToContactMethod: "Call, Text, Email",
          permissionToContactText: PERMISSION_TO_CONTACT_TEXT,
          permissionToContactVersion: PERMISSION_TO_CONTACT_VERSION,
          automatedContactConsent,
          automatedContactConsentText: AUTOMATED_CONTACT_CONSENT_TEXT,
          automatedContactConsentVersion: AUTOMATED_CONTACT_CONSENT_VERSION,
          dataSharingConsent: licensedAgentDisclosure,
          dataSharingRecipient: "Vital Edge Licensed Agent",
          dataSharingEntities: ["Vital Edge Licensed Agent"],
          leadTransferDisclosureAck: licensedAgentDisclosure,
          beneficiaryInitiated: true,
          intent: true,
          productInterest: helpRequested,
          ...tracking,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "Unable to submit your request right now.");
        return;
      }
      setSuccess(data.message || "Thanks. Patrick Mackin IV will follow up.");
      setOrganizationName("");
      setContactName("");
      setPhone("");
      setEmail("");
      setCounty("");
      setZip("");
      setCoverageSituation("");
      setCoverageMonth("");
      setPreferredDateTime("");
      setEstimatedAttendance("");
      setNotes("");
      setConsent(false);
      setAutomatedContactConsent(false);
      setLicensedAgentDisclosure(false);
    } catch {
      setError("Unable to submit your request right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="resource-lead-form" className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:p-8">
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl font-bold tracking-normal text-[var(--ve-teal)]">{title}</h2>
        <p className="mt-3 font-sans text-sm leading-6 text-slate-700">
          Please do not submit Medicare numbers, Social Security numbers, or sensitive medical information through this form.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {isOrganizationForm ? (
          <div>
            <label htmlFor="resource-organization" className="text-sm font-extrabold text-[var(--ve-teal)]">
              Organization name *
            </label>
            <input
              id="resource-organization"
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              required={isOrganizationForm}
            />
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="resource-contact-method" className="text-sm font-extrabold text-[var(--ve-teal)]">
              Preferred contact method *
            </label>
            <select
              id="resource-contact-method"
              value={preferredContactMethod}
              onChange={(event) => setPreferredContactMethod(event.target.value as ResourceContactMethod)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              required
            >
              <option value="Call">Call</option>
              <option value="Text">Text</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label htmlFor="resource-contact-name" className="text-sm font-extrabold text-[var(--ve-teal)]">
              Contact name *
            </label>
            <input
              id="resource-contact-name"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label htmlFor="resource-phone" className="text-sm font-extrabold text-[var(--ve-teal)]">
              Phone {contact.phoneRequired ? "*" : "(optional)"}
            </label>
            <input
              id="resource-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              autoComplete="tel"
              type="tel"
              required={contact.phoneRequired}
            />
          </div>
          <div>
            <label htmlFor="resource-email" className="text-sm font-extrabold text-[var(--ve-teal)]">
              Email {contact.emailRequired ? "*" : "(optional)"}
            </label>
            <input
              id="resource-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              autoComplete="email"
              type="email"
              required={contact.emailRequired}
            />
          </div>
          <div>
            <label htmlFor="resource-state" className="text-sm font-extrabold text-[var(--ve-teal)]">
              State *
            </label>
            <select
              id="resource-state"
              value={state}
              onChange={(event) => setState(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              required
            >
              {stateOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="resource-county" className="text-sm font-extrabold text-[var(--ve-teal)]">
              County
            </label>
            <input
              id="resource-county"
              value={county}
              onChange={(event) => setCounty(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
            />
          </div>
          <div>
            <label htmlFor="resource-zip" className="text-sm font-extrabold text-[var(--ve-teal)]">
              ZIP code *
            </label>
            <input
              id="resource-zip"
              value={zip}
              onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              autoComplete="postal-code"
              inputMode="numeric"
              required
            />
          </div>
          <div>
            <label htmlFor="resource-help" className="text-sm font-extrabold text-[var(--ve-teal)]">
              Type of help requested *
            </label>
            <select
              id="resource-help"
              value={helpRequested}
              onChange={(event) => setHelpRequested(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              required
            >
              {helpOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showMedicareTiming && !isOrganizationForm ? (
          <fieldset className="rounded-2xl border border-[var(--ve-teal)]/15 p-4">
            <legend className="px-2 text-base font-extrabold text-[var(--ve-teal)]">Your Medicare timing (optional)</legend>
            <p id="resource-timing-help" className="mb-4 text-sm leading-6 text-slate-700">
              Share what you know so we can prepare for your conversation. It is fine if you are still figuring out your dates.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="resource-coverage-situation" className="text-sm font-extrabold text-[var(--ve-teal)]">Which best describes you?</label>
                <select
                  id="resource-coverage-situation"
                  value={coverageSituation}
                  onChange={(event) => setCoverageSituation(event.target.value)}
                  aria-describedby="resource-timing-help"
                  className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-base"
                >
                  <option value="">Select one, if you know</option>
                  <option>Turning 65</option>
                  <option>Retiring or leaving employer coverage</option>
                  <option>Already on Medicare</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="resource-coverage-month" className="text-sm font-extrabold text-[var(--ve-teal)]">When do you expect to need coverage?</label>
                <input
                  id="resource-coverage-month"
                  type="month"
                  value={coverageMonth}
                  onChange={(event) => setCoverageMonth(event.target.value)}
                  aria-describedby="resource-timing-help"
                  className="mt-2 h-12 w-full min-w-0 rounded-xl border border-[var(--ve-teal)]/15 px-4 text-base"
                />
              </div>
            </div>
          </fieldset>
        ) : null}

        {isOrganizationForm ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="resource-audience" className="text-sm font-extrabold text-[var(--ve-teal)]">
                Audience type
              </label>
              <select
                id="resource-audience"
                value={audienceType}
                onChange={(event) => setAudienceType(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
              >
                <option value="">Select one</option>
                {audienceOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="resource-date" className="text-sm font-extrabold text-[var(--ve-teal)]">
                Preferred date/time
              </label>
              <input
                id="resource-date"
                value={preferredDateTime}
                onChange={(event) => setPreferredDateTime(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                placeholder="Example: Tuesday morning"
              />
            </div>
            <div>
              <label htmlFor="resource-attendance" className="text-sm font-extrabold text-[var(--ve-teal)]">
                Estimated attendance
              </label>
              <input
                id="resource-attendance"
                value={estimatedAttendance}
                onChange={(event) => setEstimatedAttendance(event.target.value.replace(/\D/g, "").slice(0, 4))}
                className="mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm"
                inputMode="numeric"
              />
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="resource-notes" className="text-sm font-extrabold text-[var(--ve-teal)]">
            Notes
          </label>
          <textarea
            id="resource-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-[var(--ve-teal)]/15 p-4 text-sm"
            placeholder="Share timing, audience, or general coverage questions. Do not include sensitive medical information."
          />
        </div>

        <div className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/45 p-3">
          <div className="mb-2 text-xs font-extrabold text-[var(--ve-teal)]">Permission to Contact</div>
          <label className="flex items-start gap-3 text-xs text-slate-700">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5" required />
            <span>{PERMISSION_TO_CONTACT_TEXT}</span>
          </label>
        </div>

        <div className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/45 p-3">
          <div className="mb-2 text-xs font-extrabold text-[var(--ve-teal)]">Automated communications consent</div>
          <label className="flex items-start gap-3 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={automatedContactConsent}
              onChange={(event) => setAutomatedContactConsent(event.target.checked)}
              className="mt-0.5"
            />
            <span>{AUTOMATED_CONTACT_CONSENT_TEXT}</span>
          </label>
        </div>

        <div className="rounded-xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/45 p-3">
          <label className="flex items-start gap-3 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={licensedAgentDisclosure}
              onChange={(event) => setLicensedAgentDisclosure(event.target.checked)}
              className="mt-0.5"
              required
            />
            <span>
              By submitting this form, you agree to be contacted by a licensed insurance agent. I provide express
              written consent for my information to be shared with Vital Edge Insurance for follow-up.
            </span>
          </label>
        </div>

        {error ? <p className="text-sm text-amber-700">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="premium-small-button premium-small-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {submitting ? "Sending..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
