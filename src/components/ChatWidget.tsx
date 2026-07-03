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
const counties = ["Duval County", "St. Johns County", "Other / not listed"];
const contactMethods = ["Call", "Text", "Email"];
const stateOptions = ["Florida", "Georgia", "South Carolina", "North Carolina", "Texas", "Tennessee", "Arizona", "Washington", "Pennsylvania", "Ohio", "Michigan", "Louisiana"];

function VitalGuideIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`${className} relative inline-flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#e8f6f5_54%,#d3eee9_100%)] text-[var(--ve-teal)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_26px_rgba(0,63,69,0.22)] ring-1 ring-[var(--ve-teal)]/15`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M6 5.5h6.2c1.5 0 2.8.6 3.8 1.6.7.7 1.1 1.7 1.1 2.8v8.6H10c-1.2 0-2.3.4-3.1 1.2L6 20.5v-15Z" />
        <path d="M9 8.5h4.6M9 11.5h5.8M9 14.5h4.1" />
        <path d="M17.6 4.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z" />
      </svg>
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

  const startPatrickHandoff = (question?: string) => {
    setMode("intake");
    setStep(2);
    setTopic("Medicare");
    setContactMethod("Call");
    setMessage((current) => current || `I need Patrick Mackin IV to follow up about a Medicare/CMS question from Vital Guide.${question ? `\n\nVisitor question: ${question}` : ""}`);
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

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (showPanel) {
      document.body.dataset.chatWidgetOpen = "true";
    } else {
      delete document.body.dataset.chatWidgetOpen;
    }
    return () => {
      delete document.body.dataset.chatWidgetOpen;
    };
  }, [showPanel]);

  return (
    <div className="chat-widget-root fixed bottom-4 right-3 z-[120] flex flex-col items-end gap-0 sm:bottom-5 sm:right-5">
      {showBubble ? (
        <motion.button
          type="button"
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/92 text-left text-sm text-[var(--ve-teal)] shadow-[0_14px_34px_rgba(0,63,69,0.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[var(--ve-teal)]/25 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ve-gold)]/55 sm:h-11 sm:w-auto sm:min-w-[11.75rem] sm:gap-2.5 sm:px-3"
          onClick={openPanel}
          aria-label="Open 24/7 Coverage Guide"
          aria-controls="vital-guide-panel"
          aria-expanded={showPanel}
        >
          <VitalGuideIcon className="h-8 w-8" />
          <span className="hidden flex-col sm:flex">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--ve-teal)]/65">24/7 Coverage Guide</span>
            <span className="text-sm font-extrabold leading-4 text-[var(--ve-teal)]">Vital Guide</span>
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
            id="vital-guide-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="vital-guide-title"
            className="flex h-[min(78dvh,680px)] w-[calc(100vw-1rem)] max-w-[31.5rem] flex-col overflow-hidden rounded-[1.35rem] border border-white/70 bg-[#fffaf0]/95 shadow-[0_30px_90px_rgba(0,63,69,0.22)] backdrop-blur-xl sm:h-[min(76vh,720px)] sm:w-[min(500px,calc(100vw-2.5rem))]"
          >
            <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--ve-teal)]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(239,248,246,0.92)_58%,rgba(255,249,238,0.96)_100%)] p-3 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <VitalGuideIcon className="h-9 w-9 sm:h-10 sm:w-10" />
                  <div>
                    <div id="vital-guide-title" className="text-base font-extrabold text-[var(--ve-teal)]">Vital Guide</div>
                    <div className="text-xs leading-5 text-black/64">
                      General education, resource routing, and licensed-agent callback requests.
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
                Open full Vital Guide
              </Link>
            </div>

            <div className="shrink-0 border-b border-[var(--ve-teal)]/10 bg-white/70 px-4 py-2.5 sm:py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[var(--ve-teal)]/70">
                    Licensed help when needed
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-700">
                    General education only. Do not enter SSN, Medicare ID, bank information, or sensitive identifiers.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link href="/contact" className="btn btn-primary px-3 py-1.5 text-xs sm:py-2">
                    Request a call
                  </Link>
                  <a className="btn btn-secondary px-3 py-1.5 text-xs sm:py-2" href={`tel:${site.phoneE164}`}>
                    Call
                  </a>
                </div>
              </div>
            </div>

            <div className={`flex min-h-0 flex-1 flex-col gap-2.5 ${mode === "question" ? "overflow-hidden p-2.5 sm:p-4" : "overflow-y-auto p-3 sm:p-4"}`}>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("intake")}
                    aria-pressed={mode === "intake"}
                    className={`btn px-3 py-1.5 text-xs ${
                      mode === "intake" ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Request guidance
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("question")}
                    aria-pressed={mode === "question"}
                    className={`btn px-3 py-1.5 text-xs ${
                      mode === "question" ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Ask a question
                  </button>
                </div>

                {mode === "question" ? (
                  <div className="flex min-h-0 flex-1 flex-col gap-3">
                    <AIChatPanel displayMode="widget" onPatrickHandoffNeeded={startPatrickHandoff} />
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
