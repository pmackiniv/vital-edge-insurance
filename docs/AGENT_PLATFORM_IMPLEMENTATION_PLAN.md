# Vital Edge Insurance Agent Platform — Implementation Starter

This document translates the requested requirements into concrete, repo-aligned implementation steps so work can continue quickly on the MBP. It is intentionally scoped to planning + scaffolding, without modifying compliance audit logic or any existing compliance files.

## Goals for the first implementation pass

- Stand up server-side agent entry points and shared utilities (Responses API wrapper, vector store helpers, compliance gatekeeper). 
- Add admin dashboard routes + UI shells (Leads, Content, Agents, Settings) without touching existing compliance logic. 
- Create a minimal content queue + lead intake flow that uses the existing pipeline and Notion as CRM (no new Notion integrations beyond current repo expectations). 
- Ensure all outbound content flows through a compliance gatekeeper step before publish/send. 

## Workstreams & recommended file layout

### 1) Agent API endpoints (Next.js)

Create API routes under `src/app/api/agents` (or `src/pages/api/agents` depending on app router usage):

- `lead-intake/route.ts`
  - Receives inbound lead payloads (from form or SMS webhook).
  - Calls Responses API with `file_search` and outputs a structured JSON lead.
  - Writes to existing lead pipeline (Prisma or Notion adapter already scaffolded).

- `compliance-gatekeeper/route.ts`
  - Receives outbound content/messages.
  - Ensures TPMO disclaimer, blocks plan-specific content without SOA.
  - Returns edited text + status.

- `plan-research/route.ts`
  - Receives lead identifiers.
  - Uses file + web search tools to generate a briefing.
  - Returns markdown summary.

- `marketing-content/route.ts`
  - Generates content drafts.
  - Writes to Content Queue (DB/Notion).
  - Returns draft + citations.

### 2) Shared agent utilities

Add a small service layer in `src/lib/agents/`:

- `responsesClient.ts`
  - Wraps OpenAI Responses API, model selection, and tool config.

- `vectorStores.ts`
  - Helpers for creating and retrieving vector stores.
  - Reads from the docs upload directory (e.g., `/docs/agent-knowledge`).

- `gatekeeper.ts`
  - Compliance checks/evals using required phrases + blocklist regex.
  - Must **not** modify existing compliance audit logic.

### 3) Admin dashboard shells

Add `/admin` routes with layout + auth guard:

- `src/app/admin/layout.tsx`
- `src/app/admin/leads/page.tsx`
- `src/app/admin/content/page.tsx`
- `src/app/admin/agents/page.tsx`
- `src/app/admin/settings/page.tsx`

Each page starts with a table/list shell and a server action (or API route) for data fetching. Hook into existing lead pipeline for lead data to avoid new Notion API use unless already present.

### 4) Lead capture pages

Add `src/app/lead/[product]/page.tsx` with:

- Intake form fields: name, zip, county, contact preference, product interest.
- Checkbox for one-to-one consent + disclosure that info is provided to a licensed agent.
- TPMO disclaimer displayed in the footer section.

Submit to `/api/intake` which calls the lead intake agent endpoint.

### 5) Content approval workflow

- Content Queue data model (DB or Notion) with status: `pending`, `approved`, `published`, `rejected`.
- `Approve & Publish` action calls compliance gatekeeper, then publish adapter.
- `Edit` opens markdown editor; edits must re-run compliance check.

## Environment variables to define

Add to `.env.local` and Vercel:

- `OPENAI_API_KEY`
- `OPENAI_ORG_ID`
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_MESSAGING_SERVICE_SID`
- `VERCEL_DEPLOY_URL`
- `CMS_TPMO_DISCLAIMER`

## Implementation order (minimum viable slice)

1. Create the `responsesClient` helper + `gatekeeper` evaluation module.
2. Add `marketing-content` + `compliance-gatekeeper` endpoints.
3. Add Content Queue admin page + approval action.
4. Add `lead-intake` endpoint + `/lead/[product]` form.
5. Add Leads admin page and connect to pipeline.
6. Add `plan-research` endpoint + Agents page.
7. Finish Settings page (TPMO disclaimer text update + nurture toggle).

## Guardrails

- Do not modify existing compliance audit logic or files.
- No plan recommendations or AI enrollment actions.
- No PHI/SSN/MBI collection.
- All outbound content passes compliance gatekeeper.
- Keep repo changes focused and incremental.

