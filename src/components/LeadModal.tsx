"use client";

import { useState } from "react";
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
};

const offerings = [
  "ACA Marketplace",
  "Medicare Guidance",
  "Medigap",
  "ICHRA",
  "Off-Exchange",
  "Small Group",
];

const counties = ["Duval County", "St. Johns County", "Other"];

export function LeadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formState, setFormState] = useState<LeadPayload>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    topic: "",
    county: "",
    message: "",
    consent: false,
  });
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleOffering = (offering: string) => {
    setSelectedOfferings((prev) =>
      prev.includes(offering) ? prev.filter((item) => item !== offering) : [...prev, offering],
    );
  };

  const updateField = (field: keyof LeadPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formState.firstName || !formState.lastName || !formState.phone || !formState.email || !formState.consent) {
      setError("Please complete required fields and consent.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedOfferings.join(", ") || formState.topic,
          county: formState.county,
          contactMethod: `Phone: ${formState.phone} | Email: ${formState.email}`,
          message: formState.message,
          consent: formState.consent,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Unable to submit right now.");
      }

      setSuccess("Got it, Patrick will follow up.");
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <div>
                <div className="text-sm font-semibold text-black">Get Expert Help Today</div>
                <div className="text-xs text-black/60">Independent guidance + clear next steps</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/10 p-2 text-black/60 hover:text-black"
                aria-label="Close lead form"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 px-6 py-6 md:grid-cols-[1fr_1fr]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-black">First name</label>
                    <input
                      value={formState.firstName}
                      onChange={updateField("firstName")}
                      className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-black">Last name</label>
                    <input
                      value={formState.lastName}
                      onChange={updateField("lastName")}
                      className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                      required
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
                      I consent to be contacted by Vital Edge Insurance by phone, text, and email regarding insurance
                      coverage and related services. Message and data rates may apply. Reply STOP to opt out of texts.
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
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Request help"}
                  </button>
                  <a
                    href={`tel:${site.phoneE164}`}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black hover:bg-black/5"
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
