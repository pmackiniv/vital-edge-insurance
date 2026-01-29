# Vital Edge Website Agents – Operating Context

## Current State (Authoritative)
- Compliance audit stabilized
- TPMO disclaimer parsing fixed with regression fixture
- Repo stays clean after dev + audit
- Inbound lead pipeline scaffolded (Prisma + API routes)
- Twilio uses Messaging Service SID (not From number)
- Notion is CRM surface; Prisma is source of truth

## Non-Negotiables
- Compliance logic must not be refactored without fixtures
- No agent may modify compliance-audit files unless explicitly instructed
- No agent may introduce marketing language requiring TPMO without disclaimer checks
- Repo hygiene is mandatory: no scope creep, no mass refactors

## Website Build Objective
Ship a compliant, conversion-focused insurance website that:
- Captures inbound leads 24/7
- Routes through compliant intake
- Hands off to a human agent
- Never performs enrollment or plan recommendation autonomously

## Allowed Actions
- Add new website components
- Add new API routes that call existing lead pipeline
- Improve UI/UX, SEO structure, performance
- Propose changes before implementing if touching shared logic
- Implement Phase 1 Twilio SMS routing only (inbound webhook → forward to owner → privacy-safe auto-reply)

## Disallowed Actions
- Changing compliance audit logic
- Editing blocked terms or disclaimers
- Auto-deploying without approval
- Refactoring existing files without instruction
- No AI SMS responses, no plan recommendations, no PHI/SSN/MBI collection, and no Notion/Zapier integrations without explicit approval


Why this matters:
Codex treats this as its constitution for the repo.
