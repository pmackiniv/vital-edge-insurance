"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

type FormState = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  topic: string;
  message: string;
  consent: boolean;
  honeypot: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  zip: "",
  topic: "",
  message: "",
  consent: false,
  honeypot: "",
};

export default function ContactPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabledUntil, setDisabledUntil] = useState<number | null>(null);
  const formEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (disabledUntil && Date.now() < disabledUntil) return false;
    if (!formEndpoint) return false;
    return true;
  }, [disabledUntil, formEndpoint, isSubmitting]);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!canSubmit) return;

    const now = Date.now();
    setDisabledUntil(now + 3000);

    if (formState.honeypot) {
      setError("Submission blocked.");
      return;
    }

    if (!formState.name.trim()) {
      setError("Please add your name.");
      return;
    }

    if (!formState.message.trim()) {
      setError("Please add a message.");
      return;
    }

    if (!formState.email.trim() && !formState.phone.trim()) {
      setError("Please provide an email or phone number.");
      return;
    }

    if (!formState.consent) {
      setError("Please provide consent to be contacted.");
      return;
    }

    if (!formEndpoint) {
      setError("Contact form is temporarily unavailable. Please call/email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          zip: formState.zip,
          topic: formState.topic,
          message: formState.message,
          consent: formState.consent,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/thank-you");
      }, 1200);
    } catch {
      setError("We could not submit your request. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Contact</h1>
          <p className="mt-3 text-sm leading-6 text-black/70">
            Tell us what you need and we will follow up with clear next steps.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-black/10 bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-black">
                  Name
                </label>
                <input
                  id="name"
                  value={formState.name}
                  onChange={handleChange("name")}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="topic" className="text-sm font-semibold text-black">
                  Topic
                </label>
                <select
                  id="topic"
                  value={formState.topic}
                  onChange={handleChange("topic")}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                >
                  <option value="">Select one</option>
                  <option value="ACA">ACA</option>
                  <option value="Medicare">Medicare</option>
                  <option value="ICHRA">ICHRA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-black">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange("email")}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-black">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange("phone")}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="zip" className="text-sm font-semibold text-black">
                  ZIP
                </label>
                <input
                  id="zip"
                  value={formState.zip}
                  onChange={handleChange("zip")}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-semibold text-black">
                Message
              </label>
              <textarea
                id="message"
                value={formState.message}
                onChange={handleChange("message")}
                rows={5}
                className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                required
              />
            </div>

            <input
              type="text"
              name="company"
              value={formState.honeypot}
              onChange={handleChange("honeypot")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="rounded-xl border border-black/10 p-3">
              <label className="flex items-start gap-3 text-xs text-black/70">
                <input
                  type="checkbox"
                  checked={formState.consent}
                  onChange={handleChange("consent")}
                  className="mt-0.5"
                  required
                />
                <span>
                  By checking this box, I consent to be contacted by Vital Edge Insurance at the phone number/email
                  provided (including by autodialed calls/texts where permitted). Msg & data rates may apply. Reply STOP to
                  opt out.
                </span>
              </label>
            </div>

            {success ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                Message sent. Redirecting...
              </p>
            ) : null}
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            {!formEndpoint ? (
              <p className="text-xs text-black/60">
                Contact form is temporarily unavailable. Please call/email.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
          <div className="text-sm font-semibold text-black">Reach us directly</div>
          <div className="mt-3 space-y-2">
            <a className="block text-black hover:underline" href={`tel:${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
            <a className="block text-black hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <p className="mt-4 text-xs text-black/60">
            We respond as quickly as possible during business hours.
          </p>
        </aside>
      </div>
    </Container>
  );
}
