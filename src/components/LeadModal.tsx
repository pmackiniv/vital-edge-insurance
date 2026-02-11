"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

type LeadPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  topic: string;
  county: string;
  message: string;
  consent: boolean;
  licensedAgentDisclosure: boolean;
};

const offerings = [
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

const topicParamToOffering: Record<string, string> = {
  medicare: "Medicare",
  medigap: "Medicare Supplement/Medigap Plan",
  aca: "ACA Marketplace",
  ichra: "Group Benefits",
  "off-exchange": "Other",
  "small group": "Group Benefits",
};

export function LeadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<LeadPayload>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    topic: "",
    county: "",
    message: "",
    consent: false,
    licensedAgentDisclosure: false,
  });
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const topic = (searchParams.get("topic")?.trim() || "").toLowerCase();
    const county = searchParams.get("county")?.trim() || "";
    if (topic && topicParamToOffering[topic] && offerings.includes(topicParamToOffering[topic])) {
      setSelectedOfferings([topicParamToOffering[topic]]);
    }
    if (county && counties.includes(county)) {
      setFormState((prev) => ({ ...prev, county }));
    }
    const storedFirst = window.localStorage.getItem("ve_lead_first_name") ?? "";
    const storedLast = window.localStorage.getItem("ve_lead_last_name") ?? "";
    setFormState((prev) => ({
      ...prev,
      firstName: prev.firstName || storedFirst,
      lastName: prev.lastName || storedLast,
    }));
  }, [isOpen, searchParams]);

  const toggleOffering = (offering: string) => {
    setSelectedOfferings((prev) =>
      prev.includes(offering) ? prev.filter((item) => item !== offering) : [...prev, offering],
    );
  };

  const updateField = (field: keyof LeadPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "firstName" && typeof window !== "undefined") {
      window.localStorage.setItem("ve_lead_first_name", String(value));
    }
    if (field === "lastName" && typeof window !== "undefined") {
      window.localStorage.setItem("ve_lead_last_name", String(value));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formState.firstName ||
      !formState.lastName ||
      !formState.phone ||
      !formState.email ||
      !formState.consent ||
      !formState.licensedAgentDisclosure
    ) {
      setError("Please complete required fields and all consent acknowledgments.");
      return;
    }

    setIsSubmitting(true);
    try {
      const nameLine = `Name: ${formState.firstName} ${formState.lastName}`.trim();
      const messageWithName = [nameLine, formState.message || ""].filter(Boolean).join("\n");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedOfferings.length ? selectedOfferings.join(", ") : "General inquiry",
          county: formState.county || "",
          contactMethod: `Phone: ${formState.phone} | Email: ${formState.email}`,
          message: messageWithName,
          consent: formState.consent,
          dataSharingConsent: formState.licensedAgentDisclosure,
          dataSharingRecipient: "Vital Edge Licensed Agent",
          dataSharingEntities: ["Vital Edge Licensed Agent"],
          leadTransferDisclosureAck: formState.licensedAgentDisclosure,
          beneficiaryInitiated: true,
          productInterest: selectedOfferings.length ? selectedOfferings.join(", ") : "General inquiry",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit right now.");
      }
      setSuccess(data.message ?? "Got it, a licensed agent will follow up.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to submit right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 py-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            style={{ maxHeight: "calc(100dvh - 3rem)" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <div className="text-sm font-semibold text-black">Get Expert Help Today</div>
                <div className="text-xs text-black/60">Independent guidance + clear next steps</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/10 p-2 text-black/60 hover:text-black"
                aria-label="Close request form"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid flex-1 gap-8 overflow-y-auto px-6 py-6 md:grid-cols-[1fr_1fr]"
            >
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-black">First name</label>
                    <input
                      value={formState.firstName}
                      onChange={updateField("firstName")}
                      className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-black">Last name</label>
                    <input
                      value={formState.lastName}
                      onChange={updateField("lastName")}
                      className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">Phone</label>
                  <input
                    value={formState.phone}
                    onChange={updateField("phone")}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                    required
                    type="tel"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">Email</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={updateField("email")}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">County</label>
                  <select
                    value={formState.county}
                    onChange={updateField("county")}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                  >
                    <option value="">Select county</option>
                    {counties.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">What should we know?</label>
                  <textarea
                    value={formState.message}
                    onChange={updateField("message")}
                    className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                    rows={4}
                  />
                </div>
                <div className="rounded-xl border border-black/10 p-4 text-xs text-black/70">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formState.consent}
                      onChange={updateField("consent")}
                      className="mt-0.5"
                      required
                    />
                    <span>
                      By checking this box, you agree to be contacted by call, text, and/or email about your request.
                      Message &amp; data rates may apply. Reply STOP to opt out.
                    </span>
                  </label>
                </div>
                <div className="rounded-xl border border-black/10 p-4 text-xs text-black/70">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formState.licensedAgentDisclosure}
                      onChange={updateField("licensedAgentDisclosure")}
                      className="mt-0.5"
                      required
                    />
                    <span>
                      I provide express written consent for my information to be shared with a licensed agent at Vital
                      Edge Insurance for follow-up, and I understand my request may be transferred for follow-up.
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-black/10 bg-[var(--muted)] p-5">
                  <div className="text-sm font-semibold text-black">Select your needs</div>
                  <div className="mt-4 grid gap-2">
                    {offerings.map((item) => (
                      <label key={item} className="flex items-center gap-2 text-sm text-black/70">
                        <input
                          type="checkbox"
                          checked={selectedOfferings.includes(item)}
                          onChange={() => toggleOffering(item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 p-5 text-xs text-black/70">
                  <div className="font-semibold text-black">Medicare note</div>
                  <p className="mt-2">
                    Medicare plan-specific discussions require a Scope of Appointment. We provide general education and
                    routing here.
                  </p>
                </div>
                {error ? <p className="text-xs text-red-600">{error}</p> : null}
                {success ? (
                  <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">{success}</p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Request help"}
                  </button>
                  <a
                    href={`tel:${site.phoneE164}`}
                    className="btn btn-secondary px-4 py-2 text-sm"
                  >
                    Call {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
