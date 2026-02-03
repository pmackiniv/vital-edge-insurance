# Vital Edge Socials Editor (Local, No API)

This workflow generates daily social drafts locally without any external APIs.

## Create drafts

```bash
node scripts/socials/create-daily-socials.mjs
```

Optional date override:

```bash
node scripts/socials/create-daily-socials.mjs 2026-02-03
```

Drafts are created in:

```
outputs/daily/YYYY-MM-DD/
```

## Compliance checklist

- Education-first language only.
- No plan recommendations or carrier mentions.
- Medicare: call-only with TPMO disclaimer language if referenced.
- No SSN/MBI/PHI collection.

## Editing workflow

1. Open the drafts in `outputs/daily/YYYY-MM-DD/`.
2. Replace the placeholders ({{HOOK}}, {{BODY}}, etc.).
3. Review against the checklist above.
4. Post manually from the platform of choice.
