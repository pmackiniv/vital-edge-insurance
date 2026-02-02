# Vital Edge Insurance — Go‑Live QA Checklist

Run this checklist Monday morning before promoting to Production.

## 1) LeadModal (Primary Conversion Path)
- Submit with minimal fields + consent (no message, no topic) → success state shown.
- Submit with a normal message → success state shown.
- Submit with SSN/MBI text → blocked with privacy warning (expected).

## 2) Notifications
- Lead submission triggers SMS to `OWNER_PHONE` (if Twilio env vars are set).
- If Twilio is unset, lead still succeeds (no user-facing error).

## 3) Twilio Inbound
- Text your Twilio number → you receive the forwarded copy.
- Sender receives auto‑reply: “Thanks—received. For your privacy, do not send SSN/Medicare ID. We’ll respond shortly.”

## 4) SEO Sanity
- `/sitemap.xml` loads.
- `/robots.txt` loads.
- Top CTAs route correctly (Home, Services, Medicare, ACA, Off‑Exchange, ICHRA).

## 5) UI/UX (Desktop + Mobile)
- Buttons readable on hero (no blue text on blue buttons).
- Background visible with no opaque white blocks.
- Forms readable on dark sections.
- Header + footer links work.
