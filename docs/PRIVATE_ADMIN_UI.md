# Private Admin UI (GBP Artifact Review)

This document defines the private admin security posture and operating flow for artifact review.

## Access Controls (Defense in Depth)

1. Vercel Deployment Protection (required)
- Enable one of:
  - Vercel Authentication (team/SSO)
  - Password Protection
- Apply to preview and production deployments where `/admin` is available.
- Keep bypass methods restricted to explicit operational users only.

2. App-level guard (required)
- `/admin/*` requires a signed session cookie (`ve_admin_session`).
- `/admin/login` is the only unauthenticated admin route.
- Middleware sets:
  - `X-Robots-Tag: noindex, nofollow`
  - `Cache-Control: no-store`

3. API lock behavior
- Existing `/api/admin/*` key-gated lock remains unchanged for legacy compatibility.

## Required Environment Variables

- `DATABASE_URL` (Neon Postgres DSN)
- `NEON_DATABASE_URL` (optional fallback; should match `DATABASE_URL`)
- `ADMIN_UI_PASSWORD` (shared login secret for admin sign-in form)
- `ADMIN_UI_SESSION_SECRET` (HMAC secret for signed cookie)
- `ADMIN_UI_SESSION_TTL_HOURS` (optional, defaults to 12)
- `ADMIN_UI_BOOTSTRAP_APPROVERS` (optional comma list, e.g. `owner@domain.com:OWNER,ops@domain.com:ADMIN`)

## Operator Workflow

1. Generate artifacts:
- `npm run gbp:weekly -- --date YYYY-MM-DD --packet-dir <packet-dir>`
- `npm run gbp:monthly -- --date YYYY-MM-DD --packet-dir <packet-dir>`

2. Sync artifacts into Neon:
- `npm run gbp:sync -- --root /absolute/path/to/outputs --cadence weekly --period YYYY-WW`
- `npm run gbp:sync -- --root /absolute/path/to/outputs --cadence monthly --period YYYY-MM`

3. Review and approve in admin UI:
- `/admin/inbox`
- `/admin/artifacts/[id]`
- `/admin/runs/weekly/[period]`
- `/admin/runs/monthly/[period]`

## Notes

- No new public API routes are used for approval mutations.
- Approve/Deny and task updates are Server Actions only.
- Ads remain human approval only; no launch automation.
