import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Robots policy.
 *
 * `User-agent: *` already permitted AI crawlers, so nothing here unblocks
 * anything previously blocked. The named rules are declarative: some operators
 * look for an explicit rule matching their own agent, and stating the intent
 * stops a future tightening of the wildcard from silently opting the site out
 * of AI answer engines.
 *
 * Two categories, both deliberately allowed:
 *   - Retrieval agents (OAI-SearchBot, PerplexityBot, Claude-SearchBot) fetch a
 *     page to answer a live question and cite it. That is the traffic worth
 *     having -- it is how the site gets surfaced and linked inside AI answers.
 *   - Training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended) build model
 *     corpora. Allowed because having verifiable licensure and enrollment facts
 *     present in model knowledge favours a small agency competing against
 *     carriers with far larger budgets.
 *
 * Google-Extended specifically governs Gemini and AI Overviews grounding.
 * Disallowing it removes the site from AI Overviews -- the exact surface we
 * want to appear in.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  const base = site.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
