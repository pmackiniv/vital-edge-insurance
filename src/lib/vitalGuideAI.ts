import { containsSensitiveInsuranceIdentifier } from "./chatPrivacyGuard";
import { guideSourceIds, isGuideSourceId, publicGuideSources, type GuideSourceId, type PublicGuideTopic } from "./vitalGuideSources";

export const GUIDE_QUESTION_MAX = 400;
export type GuideAIResult =
  | { kind: "answer"; topic: PublicGuideTopic; facts: { text: string; label: string; href: string }[]; context: GuideSourceId[] }
  | { kind: "personal" | "privacy" | "unknown" | "unavailable" };

export type GuideAIInput = { question: string; context: GuideSourceId[] };

export function guidePrivacyBlock(text: string) {
  return containsSensitiveInsuranceIdentifier(text) ||
    /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|(?<!\d)(?:\+?1[- .]?)?(?:\(\d{3}\)|\d{3})[- .]?\d{3}[- .]?\d{4}(?!\d)|\b\d{1,4}[/-]\d{1,2}[/-]\d{1,4}\b|\b(?:my (?:name|address|date of birth|birthdate|dob|diagnosis|medications?)|i (?:was diagnosed with|take|am taking|have been diagnosed with)|dob is)\b|\b[1-9][ACDEFGHJKMNPQRTUVWXY]{2}\d[ACDEFGHJKMNPQRTUVWXY]{2}\d[ACDEFGHJKMNPQRTUVWXY]{2}\d{2}\b/i.test(text);
}

export function guideNeedsHuman(text: string) {
  return /\b(?:my (?:doctor|provider|hospital|pharmacy|prescription|medication|claim|plan|eligibility)|in[- ]network|out[- ]of[- ]network|cheapest|best plan|recommend (?:a|the|my) plan|am i eligible|do i qualify|which plan should i|will (?:my|this) plan cover|(?:aetna|humana|unitedhealthcare|wellcare|healthspring)|[hHrRsS]\d{4}[- /]\d{3})\b|\$\s*\d/i.test(text);
}

export function parseGuideAIInput(raw: unknown): GuideAIInput | null {
  if (!raw || typeof raw !== "object" || !("question" in raw) || typeof raw.question !== "string") return null;
  const question = raw.question.trim();
  if (!question || question.length > GUIDE_QUESTION_MAX) return null;
  return { question, context: guideSourceIds("context" in raw ? raw.context : null) };
}

export async function answerGuideAI(input: GuideAIInput, select: (input: GuideAIInput) => Promise<unknown>): Promise<GuideAIResult> {
  if (guidePrivacyBlock(input.question)) return { kind: "privacy" };
  if (guideNeedsHuman(input.question)) return { kind: "personal" };
  try {
    const output = await select(input);
    if (!output || typeof output !== "object" || !("kind" in output)) return { kind: "unavailable" };
    if (output.kind === "personal" || output.kind === "unknown") return { kind: output.kind };
    if (output.kind !== "answer" || !("ids" in output) || !Array.isArray(output.ids) ||
        output.ids.length < 1 || output.ids.length > 3 || !output.ids.every(isGuideSourceId)) return { kind: "unavailable" };
    const ids = guideSourceIds(output.ids);
    return { kind: "answer", topic: publicGuideSources[ids[0]].topic, context: ids,
      facts: ids.map(id => {
        const f = publicGuideSources[id];
        return { text: f.takeaway, label: f.label, href: f.href };
      }) };
  } catch {
    return { kind: "unavailable" };
  }
}

export function vitalGuideAIPreviewEnabled() {
  return process.env.VITAL_GUIDE_AI_ENABLED === "true" &&
    (process.env.VERCEL_ENV === "preview" || (!process.env.VERCEL && process.env.NODE_ENV !== "production"));
}
