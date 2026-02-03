# Vital Edge Insurance

Next.js site for Vital Edge Insurance (Florida licensed health insurance agent). Lead capture, chat-style guidance, enrollment routing, and notifications.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Edit `src/app/page.tsx` (and other files under `src/`) — the app auto-updates.

**Useful commands**

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm audit --omit=dev` — security audit (exclude devDependencies)

## Notifications

Lead intake (Contact page, LeadModal, Chat widget, `/chat`) posts to **POST /api/leads**. The API:

1. Validates consent + contact method (and blocks SSN/MBI in message).
2. Sends **email** to you via SMTP (if `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set).
3. Optionally sends **SMS** to you via Twilio (if Twilio env vars are set and SMS is not disabled).

**Email-only (no SMS)** — set in Vercel (or `.env`):

```bash
LEAD_SMS_DISABLED=1
```

Accepted values: `1`, `true`, `yes`, `on` (case-insensitive). When set, lead notifications skip Twilio; email still sends. Inbound SMS webhook (`/api/twilio/inbound-sms`) is unchanged.

**Env vars (see `.env.example`)**

- **Email:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `OWNER_EMAIL` (or `LEAD_NOTIFY_TO_EMAIL`), optional `LEAD_NOTIFY_FROM_EMAIL`
- **SMS (optional):** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`, `OWNER_PHONE`
- **Site URL:** `NEXT_PUBLIC_SITE_URL` (production), `VERCEL_URL` (set by Vercel)

## API Routes

| Route | Method | Purpose |
|-------|--------|--------|
| `/api/leads` | POST | Lead intake; sends email + optional SMS to owner |
| `/api/lead` | POST | Forwards body to `/api/leads` |
| `/api/twilio/inbound-sms` | POST | Twilio webhook; forwards inbound SMS to owner, returns privacy auto-reply |
| `/api/qa` | POST | Canned Q&A + resources; no plan recommendations |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
