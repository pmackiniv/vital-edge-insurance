# Vital Edge Insurance — Website Finish Contract (Codex Rules)

## Mission
Finish and polish this Next.js website to a premium, enterprise-grade UX suitable for Vital Edge Insurance.
Priorities, in order:
1) Navigation integrity (no dead ends)
2) Visual polish (hero, typography, image ratios, spacing)
3) Performance + accessibility
4) Compliance-safe, high-trust copy (educational, not salesy)
5) Content scaffolding that supports ongoing “Vital Edge Daily” updates (draft + review workflow)

## Working Style
- Operate in small, reversible diffs.
- Before editing: propose a plan and the smallest batch of changes.
- After each batch of edits, run:
  - npm run lint
  - npm run build
- Stop and report immediately if either command fails.

## Hard Constraints (Non-Negotiable)
- No Medicare Advantage / MAPD marketing language.
- No plan recommendations, “best plan” guidance, pricing promises, or enrollment decisions.
- No carrier comparisons or disparagement.
- Do not request or store sensitive identifiers (SSN, Medicare ID/MBI, Medicaid ID, bank info).
- Never print, copy, or commit secrets (API keys, tokens, credentials, env vars).
- Do NOT implement Notion, Twilio, Zapier/Make integrations yet. Only create safe stubs/CTAs and placeholder routes where necessary.
- All public-facing copy must remain compliant and general; anything that looks like advice must trigger a human handoff path (CTA only for now).

## Scope of Work (This Sprint)
### P0 (must fix first)
- Dead links / routes that go nowhere
- Missing pages or broken navigation elements (Header/Footer/CTAs)
- Image stretching / squashed visuals (enforce ratio-locked wrappers + next/image best practices)
- Scroll/overflow traps (no “page stuck unless zoom out” behavior)
- Hero legibility issues (overlay gradients, text-shadow, accessible contrast)
- Dropdown/select readability (opaque background, readable text/border)

### P1 (after P0 is stable)
- Premium polish: spacing rhythm, typography scale, button states, hover/focus states
- Consistent section layouts and cards
- “Trust” UI elements (trust strip, fine print placement)
- Performance/SEO hygiene: metadata consistency, sitemap/robots sanity checks

### P2 (after P1)
- Advanced micro-interactions (only if they respect prefers-reduced-motion)
- Deeper content expansion

## Hero / Background Requirements
- Home page must have a stable background hero image layer.
- Foreground content scrolls normally above it.
- If adding cursor/parallax effect:
  - Respect prefers-reduced-motion
  - Do not introduce scroll traps or jank
  - Do not harm text legibility
  - Keep implementation minimal and reversible

## Content Strategy (Scaffolding Only for Now)
Create a clean content surface that supports ongoing updates:
- Add /learn index and /learn/[slug] route scaffolding if missing.
- Content here is educational and high-level only.
- No plan marketing. No plan recommendations.
- “Vital Edge Daily” content should be drafted for review, not auto-published.

## Acceptance Criteria for This Sprint
- Website builds cleanly: npm run lint && npm run build pass.
- No dead-end navigation.
- No stretched imagery.
- Scroll behaves normally across pages.
- Home hero looks premium, legible, and stable.
- Provide a punch list grouped by P0/P1/P2 and implement only P0 first.

## Required Outputs After Each Batch
- List files changed
- What was fixed
- What to QA in a Vercel Preview (or local build output)
- Any risks/edge cases noticed
