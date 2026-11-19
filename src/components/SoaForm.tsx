"use client";

import { useState } from "react";
import {
  SOA_ATTESTATION,
  SOA_AGENT,
  SOA_CMS_PREAMBLE,
  SOA_CONTACT_METHODS,
  SOA_NO_OBLIGATION,
  SOA_PRODUCT_TYPES,
  SOA_RETENTION_NOTICE,
  type SoaProductKey,
} from "@/lib/compliance/soaForm";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[var(--ve-teal)]/15 px-4 text-sm focus:border-[var(--ve-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--ve-teal)]/30";
const labelClass = "text-sm font-extrabold text-[var(--ve-teal)]";

type FieldError = { field: string; message: string };

/**
 * Beneficiary-facing Scope of Appointment.
 *
 * The 48-hour countdown is shown live as soon as an appointment time is picked,
 * rather than being sprung on submit -- someone choosing a slot should find out
 * immediately that a reason will be needed, not after filling in the whole form.
 * The server still recomputes it; this is guidance, not the decision.
 */
export function SoaForm({
  defaultAppointmentAt,
  defaultNeedsReason = false,
  timingHelpText = "Medicare asks that the agenda be documented at least 48 hours before a plan-specific appointment.",
  fortyEightHourRuleActive = true,
}: {
  defaultAppointmentAt?: string;
  /** Computed server-side for a prefilled slot, so render stays pure. */
  defaultNeedsReason?: boolean;
  /** Timing wording for the rule actually in force, resolved server-side. */
  timingHelpText?: string;
  /**
   * False from 2026-10-01, when CY2027 marketing removes the 48-hour wait. The
   * reason field then stops appearing rather than adding friction CMS no longer
   * requires. The server re-decides this; the client only mirrors it.
   */
  fortyEightHourRuleActive?: boolean;
}) {
  const [products, setProducts] = useState<SoaProductKey[]>([]);
  const [appointmentAt, setAppointmentAt] = useState(defaultAppointmentAt || "");
  const [needsReason, setNeedsReason] = useState(defaultNeedsReason);
  const [isRep, setIsRep] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [result, setResult] = useState<{ soaTimingValid: boolean } | null>(null);

  const errorFor = (field: string) => errors.find((e) => e.field === field)?.message;

  // Reading the clock belongs in the event handler, not in render: render must
  // stay pure, and this is only a hint anyway -- the server recomputes the
  // 48-hour decision from its own clock.
  function handleAppointmentChange(value: string) {
    setAppointmentAt(value);
    if (!fortyEightHourRuleActive) {
      setNeedsReason(false);
      return;
    }
    const when = new Date(value);
    setNeedsReason(
      !Number.isNaN(when.getTime()) && (when.getTime() - Date.now()) / 3_600_000 < 48,
    );
  }

  function toggleProduct(key: SoaProductKey) {
    setProducts((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors([]);

    const data = new FormData(event.currentTarget);
    const payload = {
      beneficiaryFirstName: String(data.get("beneficiaryFirstName") || ""),
      beneficiaryLastName: String(data.get("beneficiaryLastName") || ""),
      beneficiaryPhone: String(data.get("beneficiaryPhone") || ""),
      streetAddress: String(data.get("streetAddress") || ""),
      addressLine2: String(data.get("addressLine2") || ""),
      city: String(data.get("city") || ""),
      zip: String(data.get("zip") || ""),
      county: String(data.get("county") || ""),
      state: String(data.get("state") || ""),
      preferredLanguage: String(data.get("preferredLanguage") || "English"),
      productKeys: products,
      initialContactMethod: String(data.get("initialContactMethod") || ""),
      appointmentAt: appointmentAt ? new Date(appointmentAt).toISOString() : "",
      signature: String(data.get("signature") || ""),
      isAuthorizedRepresentative: isRep,
      representativeName: String(data.get("representativeName") || ""),
      representativeRelationship: String(data.get("representativeRelationship") || ""),
      under48HourReason: String(data.get("under48HourReason") || ""),
    };

    try {
      const res = await fetch("/api/soa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(Array.isArray(json.errors) ? json.errors : [{ field: "form", message: json.error || "Please review the form." }]);
        setStatus("error");
        return;
      }
      setResult({ soaTimingValid: Boolean(json.soaTimingValid) });
      setStatus("done");
    } catch {
      setErrors([{ field: "form", message: "Something went wrong. Please call the office instead." }]);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section
        className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
        aria-live="polite"
      >
        <h2 className="font-display text-3xl font-bold text-[var(--ve-teal)]">Scope of Appointment received</h2>
        <p className="mt-4 font-sans text-sm leading-6 text-slate-700">
          Thank you. Your agenda is on file, and our appointment will stay inside the topics you selected.
        </p>
        {result && !result.soaTimingValid && fortyEightHourRuleActive ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 font-sans text-sm leading-6 text-amber-900">
            Because this appointment is less than 48 hours away, {SOA_AGENT.name} will confirm the documentation
            with you before any plan-specific discussion begins.
          </p>
        ) : null}
        <p className="mt-4 font-sans text-xs leading-5 text-slate-500">{SOA_RETENTION_NOTICE}</p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:p-8"
    >
      <p className="font-sans text-sm leading-6 text-slate-700">{SOA_CMS_PREAMBLE}</p>

      <fieldset className="mt-8">
        <legend className="font-display text-2xl font-bold text-[var(--ve-teal)]">
          Which products would you like to discuss?
        </legend>
        <p className="mt-2 font-sans text-sm text-slate-600">
          Check every type you want covered. These are the only topics the agent may raise.
        </p>
        {errorFor("productKeys") ? (
          <p className="mt-2 font-sans text-sm font-bold text-red-700">{errorFor("productKeys")}</p>
        ) : null}
        <div className="mt-4 space-y-3">
          {SOA_PRODUCT_TYPES.map((product) => (
            <label
              key={product.key}
              className="flex cursor-pointer gap-3 rounded-2xl border border-[var(--ve-teal)]/15 p-4 hover:bg-[var(--ve-teal)]/5"
            >
              <input
                type="checkbox"
                name="productKeys"
                value={product.key}
                checked={products.includes(product.key)}
                onChange={() => toggleProduct(product.key)}
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--ve-teal)]"
              />
              <span>
                <span className="block font-sans text-sm font-extrabold text-[var(--ve-teal)]">{product.label}</span>
                <span className="mt-1 block font-sans text-sm leading-6 text-slate-600">{product.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="soa-first" className={labelClass}>
            First name *
          </label>
          <input id="soa-first" name="beneficiaryFirstName" required className={inputClass} autoComplete="given-name" />
          {errorFor("beneficiaryFirstName") ? (
            <p className="mt-1 font-sans text-sm text-red-700">{errorFor("beneficiaryFirstName")}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="soa-last" className={labelClass}>
            Last name *
          </label>
          <input id="soa-last" name="beneficiaryLastName" required className={inputClass} autoComplete="family-name" />
          {errorFor("beneficiaryLastName") ? (
            <p className="mt-1 font-sans text-sm text-red-700">{errorFor("beneficiaryLastName")}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="soa-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input id="soa-phone" name="beneficiaryPhone" type="tel" className={inputClass} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="soa-zip" className={labelClass}>
            ZIP code *
          </label>
          <input id="soa-zip" name="zip" required inputMode="numeric" maxLength={5} className={inputClass} autoComplete="postal-code" />
          {errorFor("zip") ? <p className="mt-1 font-sans text-sm text-red-700">{errorFor("zip")}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="soa-street" className={labelClass}>
            Street address
          </label>
          <input id="soa-street" name="streetAddress" className={inputClass} autoComplete="address-line1" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="soa-street2" className={labelClass}>
            Address line 2
          </label>
          <input id="soa-street2" name="addressLine2" className={inputClass} autoComplete="address-line2" />
        </div>
        <div>
          <label htmlFor="soa-city" className={labelClass}>
            City
          </label>
          <input id="soa-city" name="city" className={inputClass} autoComplete="address-level2" />
        </div>
        <div>
          <label htmlFor="soa-county" className={labelClass}>
            County
          </label>
          <input id="soa-county" name="county" className={inputClass} />
        </div>
        <div>
          <label htmlFor="soa-state" className={labelClass}>
            State
          </label>
          <input id="soa-state" name="state" maxLength={2} className={inputClass} autoComplete="address-level1" />
        </div>
        <div>
          <label htmlFor="soa-language" className={labelClass}>
            Preferred language
          </label>
          <input id="soa-language" name="preferredLanguage" defaultValue="English" className={inputClass} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="soa-contact-method" className={labelClass}>
            How did this contact begin? *
          </label>
          <select id="soa-contact-method" name="initialContactMethod" required className={inputClass} defaultValue="website">
            {SOA_CONTACT_METHODS.map((method) => (
              <option key={method.key} value={method.key}>
                {method.label}
              </option>
            ))}
          </select>
          {errorFor("initialContactMethod") ? (
            <p className="mt-1 font-sans text-sm text-red-700">{errorFor("initialContactMethod")}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="soa-appointment" className={labelClass}>
            Appointment date and time *
          </label>
          <input
            id="soa-appointment"
            name="appointmentAt"
            type="datetime-local"
            required
            value={appointmentAt}
            onChange={(e) => handleAppointmentChange(e.target.value)}
            className={inputClass}
            aria-describedby="soa-appointment-help"
          />
          <p id="soa-appointment-help" className="mt-1 font-sans text-xs text-slate-500">
            {timingHelpText}
          </p>
          {errorFor("appointmentAt") ? (
            <p className="mt-1 font-sans text-sm text-red-700">{errorFor("appointmentAt")}</p>
          ) : null}
        </div>
      </div>

      {needsReason ? (
        <div className="mt-6 rounded-2xl bg-amber-50 p-4" aria-live="polite">
          <label htmlFor="soa-reason" className={labelClass}>
            This appointment is less than 48 hours away — please tell us why *
          </label>
          <p className="mt-1 font-sans text-xs text-slate-600">
            For example: you asked for the soonest available time, or an enrollment deadline is close.
          </p>
          <input id="soa-reason" name="under48HourReason" className={inputClass} />
          {errorFor("under48HourReason") ? (
            <p className="mt-1 font-sans text-sm text-red-700">{errorFor("under48HourReason")}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-[var(--ve-teal)]/15 bg-[var(--ve-teal)]/5 p-5">
        <p className="font-sans text-sm leading-6 text-slate-700">{SOA_ATTESTATION}</p>
        <p className="mt-3 font-sans text-sm font-extrabold leading-6 text-[var(--ve-teal)]">{SOA_NO_OBLIGATION}</p>
        <dl className="mt-4 grid gap-2 font-sans text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-extrabold text-[var(--ve-teal)]">Agent</dt>
            <dd>{SOA_AGENT.name}</dd>
          </div>
          <div>
            <dt className="font-extrabold text-[var(--ve-teal)]">Agent phone</dt>
            <dd>{SOA_AGENT.phoneDisplay}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isRep}
            onChange={(e) => setIsRep(e.target.checked)}
            className="h-5 w-5 accent-[var(--ve-teal)]"
          />
          <span className="font-sans text-sm text-slate-700">
            I am signing as the beneficiary&apos;s authorized representative
          </span>
        </label>
      </div>

      {isRep ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="soa-rep-name" className={labelClass}>
              Representative&apos;s name *
            </label>
            <input id="soa-rep-name" name="representativeName" className={inputClass} />
            {errorFor("representativeName") ? (
              <p className="mt-1 font-sans text-sm text-red-700">{errorFor("representativeName")}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="soa-rep-rel" className={labelClass}>
              Relationship to the beneficiary *
            </label>
            <input id="soa-rep-rel" name="representativeRelationship" className={inputClass} />
            {errorFor("representativeRelationship") ? (
              <p className="mt-1 font-sans text-sm text-red-700">{errorFor("representativeRelationship")}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <label htmlFor="soa-signature" className={labelClass}>
          Signature — type your full name *
        </label>
        <input id="soa-signature" name="signature" required className={inputClass} autoComplete="name" />
        <p className="mt-1 font-sans text-xs text-slate-500">
          Typing your name here is your electronic signature. The date and time are recorded automatically.
        </p>
        {errorFor("signature") ? <p className="mt-1 font-sans text-sm text-red-700">{errorFor("signature")}</p> : null}
      </div>

      {errorFor("form") ? (
        <p className="mt-6 rounded-xl bg-red-50 p-4 font-sans text-sm text-red-800" role="alert">
          {errorFor("form")}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="premium-small-button premium-small-button-primary mt-8 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Sign and send"}
      </button>

      <p className="mt-6 font-sans text-xs leading-5 text-slate-500">{SOA_RETENTION_NOTICE}</p>

      <details className="mt-6">
        <summary className="cursor-pointer font-sans text-sm font-extrabold text-[var(--ve-teal)]">
          Full product type descriptions
        </summary>
        <div className="mt-4 space-y-5">
          {SOA_PRODUCT_TYPES.map((product) => (
            <div key={product.key}>
              <h3 className="font-sans text-sm font-extrabold text-[var(--ve-teal)]">{product.label}</h3>
              <p className="mt-1 font-sans text-sm leading-6 text-slate-600">{product.description}</p>
              {product.detail ? (
                <dl className="mt-2 space-y-2">
                  {product.detail.map((entry) => (
                    <div key={entry.term}>
                      <dt className="font-sans text-sm font-bold text-slate-800">{entry.term}</dt>
                      <dd className="font-sans text-sm leading-6 text-slate-600">{entry.definition}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
        </div>
      </details>
    </form>
  );
}
