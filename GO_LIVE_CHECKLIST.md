# Vital Edge Insurance — Go‑Live QA Checklist

Run this checklist Monday morning before promoting to Production.

## 0) Vercel env (Production)

> **Go-live path:** **SMTP** for email delivery, with optional FormSubmit fallback configured server-side.

### SMTP (current app setup)

In **Vercel → Project → Settings → Environment Variables → Production**, set:

* [ ] `SMTP_HOST`
* [ ] `SMTP_PORT`
* [ ] `SMTP_SECURE` *(true/false)*
* [ ] `SMTP_USER`
* [ ] `SMTP_PASS`
* [ ] `OWNER_EMAIL` = *(destination inbox for lead notifications)*
* [ ] `NEXT_PUBLIC_SITE_URL` = *(production URL, e.g. `https://vital-edge-insurance.vercel.app` or custom domain)*

Optional fallback:

* [ ] `NEXT_PUBLIC_FORMSUBMIT_TO` = *(email address for FormSubmit fallback)*

### Optional — Twilio (only if inbound SMS/voice is enabled)

Set in **Production** only if your app uses Twilio features:

* [ ] `TWILIO_ACCOUNT_SID`
* [ ] `TWILIO_AUTH_TOKEN`
* [ ] `TWILIO_MESSAGING_SERVICE_SID`
* [ ] `OWNER_PHONE`

### Redeploy note (important)

* [ ] After editing **Production** env vars, **redeploy the latest `main`** so the new values are picked up.

## 1) Deploy

* [ ] Confirm `main` is the **Production Branch** in Vercel (Project → Settings → Git).
* [ ] Deploy the latest `main` (push/merge to `main`, then verify Vercel created a new **Production** deployment).
* [ ] Confirm deployment status is **Ready** (no build errors).
* [ ] Confirm `NEXT_PUBLIC_SITE_URL` matches the **actual production URL** for this deployment / domain.

## 2) Quick email smoke test (production)

* [ ] Submit a test lead via the production site form.
* [ ] Confirm the lead notification email arrives at `OWNER_EMAIL`.
* [ ] If missing:

  * [ ] Check spam/junk/promotions.
  * [ ] Check **Vercel → Logs → Runtime Logs** for the form submit / notification path errors.

### Troubleshooting: lead email not received

1. **Env vars (Production)** — In Vercel → Settings → Environment Variables, confirm for **Production**:
   * `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set.
   * `OWNER_EMAIL` is the inbox where you expect the lead notification (check for typos).
   * Optional: `NEXT_PUBLIC_FORMSUBMIT_TO` if you want fallback.

2. **Redeploy** — After changing any Production env var, **Redeploy** the latest production deployment so the new values are used.

3. **Vercel Runtime Logs** — After submitting a test lead, open **Vercel → Project → Logs → Runtime Logs**. Look for `lead_email` and `lead_notifications` entries. If email fails, the log reason will show the SMTP or FormSubmit error.

4. **Local dev** — For local testing you need a `.env.local` with SMTP variables and `OWNER_EMAIL`. Without SMTP, email is skipped unless FormSubmit fallback is configured.

## 3) LeadModal (Primary Conversion Path)
- Submit with minimal fields + consent (no message, no topic) → success state shown.
- Submit with a normal message → success state shown.
- Submit with SSN/MBI text → blocked with privacy warning (expected).

## 4) Notifications
- Lead submission triggers SMS to `OWNER_PHONE` (if Twilio env vars are set).
- If Twilio is unset, lead still succeeds (no user-facing error).

## 5) Twilio Inbound
- Text your Twilio number → you receive the forwarded copy.
- Sender receives auto‑reply: "Thanks—received. For your privacy, do not send SSN/Medicare ID. We'll respond shortly."

## 6) SEO Sanity
- `/sitemap.xml` loads.
- `/robots.txt` loads.
- Top CTAs route correctly (Home, Services, Medicare, ACA, Off‑Exchange, ICHRA).

## 7) UI/UX (Desktop + Mobile)
- Buttons readable on hero (no blue text on blue buttons).
- Background visible with no opaque white blocks.
- Forms readable on dark sections.
- Header + footer links work.
