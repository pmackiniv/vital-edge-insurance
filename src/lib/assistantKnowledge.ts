import { resourcesForTopic } from "@/lib/knowledgeBase";

export type AssistantResponse = {
  answer: string;
  topic: string;
  resources: ReturnType<typeof resourcesForTopic>;
  shouldEscalate: boolean;
  escalationReason?: string;
};

type KnowledgeCard = {
  topic: string;
  keywords: string[];
  answer: string;
};

const knowledgeCards: KnowledgeCard[] = [
  {
    topic: "Medicare",
    keywords: ["medicare", "cms", "part a", "part b", "part c", "part d", "advantage", "medigap", "supplement"],
    answer:
      "Medicare has four parts: A (hospital), B (medical), C (Medicare Advantage), and D (prescriptions). Enrollment timing matters—Initial Enrollment, Annual Election, and Special Enrollment Periods are common windows. Plan availability varies by Florida county, so a licensed agent should confirm options before enrollment.",
  },
  {
    topic: "Medicare enrollment",
    keywords: ["enrollment", "annual election", "sep", "special enrollment", "initial enrollment", "late enrollment"],
    answer:
      "Medicare enrollment windows include the Initial Enrollment Period around your 65th birthday, the Annual Election Period each fall, and Special Enrollment Periods for qualifying events. Because dates and eligibility can change, confirm timing with official CMS guidance or a licensed agent.",
  },
  {
    topic: "ACA Marketplace",
    keywords: ["aca", "marketplace", "obamacare", "healthcare.gov", "premium tax credit", "subsidy"],
    answer:
      "Florida uses HealthCare.gov for ACA Marketplace coverage. Open Enrollment runs annually and exact dates can shift year to year. Subsidies are based on household size, income, and location, so a licensed agent should confirm eligibility before enrollment.",
  },
  {
    topic: "Marketplace SEP",
    keywords: ["special enrollment", "sep", "loss of coverage", "move", "marriage", "baby", "adoption", "divorce"],
    answer:
      "Marketplace Special Enrollment Periods (SEPs) are typically triggered by life events like losing coverage, moving, marriage, or having a child. Documentation is usually required, so keep proof of the qualifying event handy.",
  },
  {
    topic: "Small Business",
    keywords: ["small business", "group", "employer", "ichra", "shop", "team coverage"],
    answer:
      "Small business coverage options can include group plans or reimbursement arrangements like ICHRA. Eligibility, participation rules, and available carriers vary by Florida county and employer size, so a licensed agent should review your situation.",
  },
  {
    topic: "Florida Medicaid",
    keywords: ["medicaid", "chip", "ahca", "florida", "kidcare", "dcf"],
    answer:
      "Florida Medicaid eligibility is determined by the Florida Department of Children and Families (DCF), and benefits are administered through the Agency for Health Care Administration (AHCA). For children, Florida KidCare may also be an option depending on household income.",
  },
  {
    topic: "Compliance",
    keywords: ["compliance", "cms", "marketing", "privacy", "hipaa", "do not share", "ssn", "mbi"],
    answer:
      "To stay compliant with CMS and privacy standards, we keep conversations educational and avoid collecting sensitive identifiers like SSNs or Medicare IDs. For plan-specific guidance or enrollment, a licensed agent will step in.",
  },
];

const escalationSignals = [
  "quote",
  "pricing",
  "price",
  "cost",
  "recommend",
  "choose a plan",
  "enroll",
  "apply",
  "switch plans",
  "complaint",
  "appeal",
  "urgent",
  "agent",
  "call me",
  "talk to someone",
];

const defaultAnswer =
  "I can help with Medicare, ACA Marketplace, Florida-specific guidance, and small business coverage basics. Ask about enrollment windows, SEP triggers, or what to prepare before speaking with a licensed agent.";

const scoreMatch = (question: string, keywords: string[]) =>
  keywords.reduce((score, keyword) => (question.includes(keyword) ? score + 1 : score), 0);

const detectTopic = (question: string, matched?: KnowledgeCard) => {
  if (matched) return matched.topic;
  if (question.includes("medicare")) return "Medicare";
  if (question.includes("marketplace") || question.includes("aca")) return "ACA Marketplace";
  if (question.includes("group") || question.includes("small business")) return "Small Business";
  if (question.includes("medicaid") || question.includes("florida")) return "Florida Medicaid";
  return "General";
};

export function buildAssistantResponse(question: string): AssistantResponse {
  const normalized = question.toLowerCase();

  const matched = knowledgeCards
    .map((card) => ({ card, score: scoreMatch(normalized, card.keywords) }))
    .sort((a, b) => b.score - a.score)[0];

  const hasMatch = matched?.score && matched.score > 0;
  const answer = hasMatch ? matched.card.answer : defaultAnswer;
  const topic = detectTopic(normalized, hasMatch ? matched.card : undefined);
  const shouldEscalate = escalationSignals.some((signal) => normalized.includes(signal));
  const escalationReason = shouldEscalate
    ? "Plan selection, pricing, or enrollment requests are best handled by a licensed agent."
    : undefined;

  return {
    answer,
    topic,
    resources: resourcesForTopic(topic),
    shouldEscalate,
    escalationReason,
  };
}
