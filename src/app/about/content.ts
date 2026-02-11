export type AboutFaqItem = {
  question: string;
  answer: string;
};

export const aboutFaqItems: AboutFaqItem[] = [
  {
    question: "Who does Vital Edge Insurance help?",
    answer:
      "We help individuals, families, caregivers, and small businesses compare coverage pathways and next steps across Florida.",
  },
  {
    question: "Do you provide plan-specific recommendations in chat?",
    answer:
      "No. Chat is education-first. Plan-specific Medicare discussions are handled through licensed-agent follow-up with required disclosures.",
  },
  {
    question: "What details should I prepare before reaching out?",
    answer:
      "Your ZIP code, timeline, and preferred contact method are usually enough to start. We avoid requesting sensitive identifiers in chat.",
  },
  {
    question: "How can I contact your team?",
    answer: "Use the contact form, schedule a call, or call/text (352) 214-8879.",
  },
];

export function buildAboutFaqJsonLd(items: AboutFaqItem[] = aboutFaqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
