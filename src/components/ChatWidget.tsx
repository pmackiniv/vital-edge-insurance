"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { resourcesForTopic } from "@/lib/knowledgeBase";
import {
  AUTOMATED_CONTACT_CONSENT_TEXT,
  AUTOMATED_CONTACT_CONSENT_VERSION,
  PERMISSION_TO_CONTACT_TEXT,
  PERMISSION_TO_CONTACT_VERSION,
} from "@/lib/leadConsent";
import { buildClientLeadTracking } from "@/lib/clientLeadTracking";
import { site } from "@/lib/site";
import { AIChatPanel } from "@/components/AIChatPanel";

const STORAGE_KEY_OPEN = "ve_chat_open";
const STORAGE_KEY_MINIMIZED = "ve_chat_minimized";

function getStoredOpen(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY_OPEN) === "true";
}

function getStoredMinimized(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY_MINIMIZED) === "true";
}

type LeadPayload = {
  topic: string;
  county: string;
  state: string;
  zip: string;
  contactMethod: string;
  message: string;
  consent: boolean;
  permissionToContactMethod: string;
  permissionToContactText: string;
  permissionToContactVersion: string;
  automatedContactConsent: boolean;
  automatedContactConsentText: string;
  automatedContactConsentVersion: string;
  dataSharingConsent: boolean;
  dataSharingRecipient: string;
  dataSharingEntities: string[];
  leadTransferDisclosureAck: boolean;
  beneficiaryInitiated: boolean;
  productInterest: string;
  leadSource: string;
  pageSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  linkedinReferral: boolean;
  eventReferral: boolean;
  partnerReferral: boolean;
  leadCategory: string;
  consentTimestamp: string;
};

const topics = [
  "ACA Marketplace",
  "Cancer / Heart Attack / Stroke",
  "Dental / Vision / Hearing",
  "Group Benefits",
  "Hospital Plans",
  "Life Insurance",
  "Final Expense",
  "Term Life",
  "Medicare",
  "Medicare Supplement/Medigap Plan",
  "Prescription Drug Savings",
  "Other",
];
const counties = ["Duval County", "St. Johns County", "Other"];
const contactMethods = ["Call", "Text", "Email"];
const stateOptions = ["Florida", "Georgia", "South Carolina", "North Carolina", "Texas", "Tennessee", "Arizona", "Washington", "Pennsylvania", "Ohio", "Michigan", "Louisiana"];

function AtlasBookIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`${className} relative inline-flex shrink-0 items-center justify-center rounded-[0.9rem] bg-[linear-gradient(135deg,#5a321f_0%,#8b5a2b_42%,#2c1711_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_28px_rgba(0,0,0,0.22)] ring-1 ring-white/25`}
      aria-hidden="true"
    >
      <span className="absolute left-[18%] top-[16%] h-[68%] w-[12%] rounded-full bg-[linear-gradient(180deg,#d99d45,#7b431f)] opacity-95" />
      <span className="absolute right-[18%] top-[18%] h-[64%] w-px bg-white/24" />
      <span className="absolute bottom-[18%] right-[20%] h-px w-[38%] bg-white/22" />
      <span className="font-display text-base font-bold leading-none text-[#ffe9b4]">V</span>
    </span>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [state, setState] = useState("Florida");
  const [county, setCounty] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactDetail, setContactDetail] = useState("");
  const [firstName, setFirstName] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("ve_lead_first_name") ?? "";
  });
  const [lastName, setLastName] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("ve_lead_last_name") ?? "";
  });
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [automatedContactConsent, setAutomatedContactConsent] = useState(false);
  const [licensedAgentDisclosure, setLicensedAgentDisclosure] = useState(false);
  const [zip, setZip] = useState("");
  const [mode, setMode] = useState<"intake" | "question">("question");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [emailSent, setEmailSent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedResources = useMemo(() => resourcesForTopic(topic), [topic]);
  const canEnroll = useMemo(() => /medicare|aca/i.test(topic), [topic]);
  const contactLabel = contactMethod === "Email" ? "Best email address" : "Best phone number";
  const contactPlaceholder = contactMethod === "Email" ? "you@email.com" : "(904) 555-1234";

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setOpen(getStoredOpen());
    setMinimized(getStoredMinimized());
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY_OPEN, String(open));
  }, [hydrated, open]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY_MINIMIZED, String(minimized));
  }, [hydrated, minimized]);

  const openPanel = () => {
    setMode("question");
    setOpen(true);
    setMinimized(false);
  };

  const minimizePanel = () => {
    setMinimized(true);
    setOpen(false);
  };

  const resetFlow = () => {
    setStep(1);
    setTopic("");
    setState("Florida");
    setCounty("");
    setContactMethod("");
    setContactDetail("");
    setMessage("");
    setConsent(false);
    setAutomatedContactConsent(false);
    setLicensedAgentDisclosure(false);
    setZip("");
    setMode("intake");
    setError("");
    setSubmitted(false);
    setSubmitMessage("");
    setEmailSent(true);
    setIsSubmitting(false);
  };

  const startPatrickHandoff = () => {
    setMode("intake");
    setStep(2);
    setTopic("Medicare");
    setContactMethod("Call");
    setMessage((current) => current || "I need Patrick Mackin IV to follow up about a Medicare/CMS question from Coverage Atlas.");
    setError("");
    setSubmitted(false);
    setSubmitMessage("");
    setEmailSent(true);
  };

  const closeWidget = () => {
    setOpen(false);
    setMinimized(false);
    resetFlow();
  };

  const goNext = () => {
    setError("");
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goNextDetails = () => {
    setError("");
    if (topic.toLowerCase().includes("medicare") && zip.length !== 5) {
      setError("Please enter a valid ZIP code for Medicare routing.");
      return;
    }
    if (!contactDetail.trim()) {
      setError("Please share the best phone or email for follow-up.");
      return;
    }
    if (contactMethod === "Email" && !/^\S+@\S+\.\S+$/.test(contactDetail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if ((contactMethod === "Text" || contactMethod === "Call") && contactDetail.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !firstName ||
      !lastName ||
      !topic ||
      !county ||
      !contactMethod ||
      !contactDetail ||
      !message ||
      !consent ||
      !licensedAgentDisclosure
    ) {
      setError("Please complete all fields and all consent acknowledgments to continue.");
      return;
    }

    const nameLine = `Name: ${firstName} ${lastName}`.trim();
    const leadCategory = /medicare/i.test(topic)
      ? "Medicare consumer review"
      : /group|employer/i.test(topic)
        ? "Employer/private options"
        : "ACA/private health";
    const tracking = buildClientLeadTracking(window.location.pathname, leadCategory, {
      linkedinReferral: typeof document !== "undefined" && /linkedin/i.test(document.referrer || ""),
    });
    const messageWithName = [
      nameLine,
      `State: ${state}`,
      `County: ${county}`,
      zip.length === 5 ? `ZIP: ${zip}` : "",
      message,
    ].filter(Boolean).join("\n");

    const payload: LeadPayload = {
      topic,
      county,
      state,
      zip,
      contactMethod: `${contactMethod}: ${contactDetail}`,
      message: messageWithName,
      consent,
      permissionToContactMethod: contactMethod,
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
      productInterest: topic,
      ...tracking,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        notifications?: { email?: { status?: string } };
      };
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit right now.");
      }
      setSubmitMessage(data.message ?? "Got it. Patrick Mackin IV has been notified and will follow up.");
      setEmailSent(data.notifications?.email?.status === "sent");
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showPanel = hydrated && open && !minimized;
  const showBubble = !showPanel;

  return (
    <div className="chat-widget-root fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-0 sm:bottom-6 sm:right-6">
      {showBubble ? (
        <motion.button
          type="button"
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="flex min-h-14 min-w-14 items-center gap-3 rounded-full border border-white/30 bg-[var(--ve-teal)] px-3 py-2.5 text-left text-sm text-white shadow-[0_20px_54px_rgba(0,63,69,0.28)] transition hover:-translate-y-0.5 hover:bg-[var(--ve-teal-2)] sm:px-5 sm:py-3"
          onClick={openPanel}
          aria-label="Open Coverage Atlas"
        >
          <AtlasBookIcon className="h-10 w-10 sm:h-11 sm:w-11" />
          <span className="text-xs font-bold sm:hidden">Atlas</span>
          <span className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/78">Coverage Atlas</span>
            <span className="text-sm font-extrabold">Ask a coverage question</span>
          </span>
        </motion.button>
      ) : null}

      <AnimatePresence>
        {showPanel ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-[620px] w-[430px] max-h-[88vh] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-[var(--ve-teal)]/14 bg-white shadow-[0_30px_90px_rgba(0,63,69,0.22)]"
          >
            <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,#ffffff_0%,#eef7f7_100%)] p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <AtlasBookIcon className="h-11 w-11" />
                  <div>
                    <div className="text-base font-extrabold text-[var(--ve-teal)]">Coverage Atlas</div>
                    <div className="text-xs leading-5 text-black/64">
                      A Vital Edge knowledge guide for coverage questions, resources, and compliant follow-up requests.
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={minimizePanel}
                    className="rounded-full border border-black/10 p-2 text-black/60 hover:bg-black/5 hover:text-black"
                    aria-label="Minimize chat"
                    title="Minimize"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 12H5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={closeWidget}
                    className="rounded-full border border-black/10 p-2 text-black/60 hover:bg-black/5 hover:text-black"
                    aria-label="Close chat"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 6l12 12" />
                      <path d="M18 6l-12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <Link href="/chat" className="text-xs font-bold text-[var(--brand-blue)] hover:underline">
                Open full Coverage Atlas
              </Link>
            </div>

            <div className="shrink-0 border-b border-black/10 bg-white/70 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Self-service enrollment</div>
              <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href="/enroll"
                    className="btn btn-primary px-3 py-2 text-xs"
                  >
                    View enrollment links
                  </Link>
                  <a
                    className="btn btn-secondary px-3 py-2 text-xs"
                    href={`tel:${site.phoneE164}`}
                  >
                    Call {site.phoneDisplay}
                  </a>
                </div>
                <p className="mt-2 text-xs text-black/60">
                  Third-party enrollment partners. If you’d rather enroll with a licensed agent, we can help.
                </p>
              </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("intake")}
                    className={`btn px-3 py-1 text-xs ${
                      mode === "intake" ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Request guidance
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("question")}
                    className={`btn px-3 py-1 text-xs ${
                      mode === "question" ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Ask a question
                  </button>
                </div>

                {mode === "question" ? (
                  <div className="flex min-h-0 flex-1 flex-col gap-3">
                    <AIChatPanel onPatrickHandoffNeeded={startPatrickHandoff} />
                  </div>
                ) : null}

                {mode === "intake" ? (
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
                ) : null}

                {mode === "intake" && step === 1 ? (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-black">What are you looking for?</div>
                    <div className="grid gap-2">
                      {topics.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setTopic(item);
                            if (item.toLowerCase().includes("medicare")) {
                              setContactMethod("Call");
                            }
                          }}
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
                        className="btn btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}

                {mode === "intake" && step === 2 ? (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold text-black">First name</label>
                        <input
                          value={firstName}
                          onChange={(event) => {
                            const value = event.target.value;
                            setFirstName(value);
                            if (typeof window !== "undefined") {
                              window.localStorage.setItem("ve_lead_first_name", value);
                            }
                          }}
                          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                          placeholder="First name"
                          autoComplete="given-name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-black">Last name</label>
                        <input
                          value={lastName}
                          onChange={(event) => {
                            const value = event.target.value;
                            setLastName(value);
                            if (typeof window !== "undefined") {
                              window.localStorage.setItem("ve_lead_last_name", value);
                            }
                          }}
                          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                          placeholder="Last name"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-black">State</label>
                      <select
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      >
                        {stateOptions.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
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
                        {topic.toLowerCase().includes("medicare") ? (
                          <option value="Call">Call</option>
                        ) : (
                          contactMethods.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))
                        )}
                      </select>
                    </div>
                    {contactMethod ? (
                      <div>
                        <label className="text-sm font-semibold text-black">{contactLabel}</label>
                        <input
                          value={contactDetail}
                          onChange={(event) => setContactDetail(event.target.value)}
                          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                          placeholder={contactPlaceholder}
                          type={contactMethod === "Email" ? "email" : "tel"}
                          autoComplete={contactMethod === "Email" ? "email" : "tel"}
                        />
                      </div>
                    ) : null}
                    {topic.toLowerCase().includes("medicare") ? (
                      <div>
                        <label className="text-sm font-semibold text-black">ZIP code</label>
                        <input
                          value={zip}
                          onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
                          className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                          placeholder="ZIP code"
                        />
                      </div>
                    ) : null}
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
                    {topic.toLowerCase().includes("medicare") ? (
                      <div className="rounded-xl border border-[var(--ve-gold)]/30 bg-[var(--ve-gold)]/10 p-3 text-xs leading-5 text-slate-800">
                        Permission to Contact is collected on the next step before Patrick Mackin IV is notified for
                        Medicare or CMS-related follow-up.
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={goBack} className="text-sm font-semibold text-black/70 hover:text-black">
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={goNextDetails}
                        disabled={!firstName || !lastName || !state || !county || !contactMethod || !contactDetail || !message}
                        className="btn btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}

                {mode === "intake" && step === 3 ? (
                  <div className="space-y-4">
                    {topic.toLowerCase().includes("medicare") && zip.length === 5 ? (
                      <div className="rounded-xl border border-black/10 bg-black/5 p-3 text-xs text-black/70">
                        <div className="font-semibold text-black">TPMO disclaimer</div>
                        We do not offer every plan available in your area. Any information we provide is limited to
                        plans we offer in your area. We are not connected with or endorsed by the U.S. government or the
                        federal Medicare program.
                      </div>
                    ) : null}
                    <div className="rounded-xl border border-black/10 p-4 text-xs text-black/70">
                      <div className="mb-2 font-semibold text-black">Permission to Contact</div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                          className="mt-0.5 shrink-0"
                          aria-describedby="consent-request-callback-hint"
                        />
                        <span>
                          {PERMISSION_TO_CONTACT_TEXT}
                        </span>
                      </label>
                      {!consent ? (
                        <p id="consent-request-callback-hint" className="mt-2 text-black/60">
                          Check the box above to enable &quot;Request Call Back&quot; and submit your request.
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-xl border border-black/10 p-4 text-xs text-black/70">
                      <div className="mb-2 font-semibold text-black">Automated communications consent</div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={automatedContactConsent}
                          onChange={(event) => setAutomatedContactConsent(event.target.checked)}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{AUTOMATED_CONTACT_CONSENT_TEXT}</span>
                      </label>
                      {!automatedContactConsent ? (
                        <p className="mt-2 text-black/60">
                          Optional. We still collect Permission to Contact above so Patrick can respond manually.
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-xl border border-black/10 p-4 text-xs text-black/70">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={licensedAgentDisclosure}
                          onChange={(event) => setLicensedAgentDisclosure(event.target.checked)}
                          className="mt-0.5 shrink-0"
                        />
                        <span>
                          I provide express written consent for my information to be shared with Patrick Mackin IV,
                          licensed agent at Vital Edge Insurance, for follow-up. I understand my request may be
                          transferred for follow-up.
                        </span>
                      </label>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-black">Recommended resources</div>
                      <div className="mt-3 space-y-2">
                        {suggestedResources.map((item) => (
                          <Link
                            key={item.slug}
                            href={item.href || `/resources#${item.slug}`}
                            className="block rounded-xl border border-black/10 px-3 py-2 text-sm text-black hover:bg-black/5"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {error ? <p className="text-xs text-red-600">{error}</p> : null}
                    {submitted ? (
                      <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
                        <p>{submitMessage || "Got it. Patrick Mackin IV has been notified and will follow up."}</p>
                        {!emailSent ? (
                          <p>
                            If you don&apos;t hear back within an hour, please call us at{" "}
                            <a className="font-semibold underline" href={`tel:${site.phoneE164}`}>
                              {site.phoneDisplay}
                            </a>
                            .
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!consent || !licensedAgentDisclosure || isSubmitting || submitted}
                        className="btn px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 enabled:opacity-100 enabled:hover:opacity-90"
                        style={{ backgroundColor: "var(--brand-orange)" }}
                        aria-disabled={!consent || !licensedAgentDisclosure || isSubmitting || submitted}
                        title={
                          !consent || !licensedAgentDisclosure
                            ? "Check all consent boxes above to enable"
                            : "Submit your request for a call back"
                        }
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
                      <div className="font-semibold text-black">Request licensed follow-up</div>
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
