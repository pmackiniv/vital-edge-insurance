import type { ModelMessage } from "ai";

const MBI_LETTER = "[ACDEFGHJKMNPQRTUVWXY]";
const MBI_PATTERN = new RegExp(
  `^[1-9]${MBI_LETTER}{2}[0-9]${MBI_LETTER}{2}[0-9]${MBI_LETTER}{2}[0-9]{2}$`,
);

const SSN_PATTERN = /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/;
const MEDICARE_IDENTIFIER_CONTEXT = /\b(medicare number|medicare id|medicare identifier|mbi|member id)\b/i;
const BANK_IDENTIFIER_CONTEXT = /\b(bank account|account number|routing number|debit card|credit card|card number)\b/i;

export const SENSITIVE_IDENTIFIER_CHAT_RESPONSE =
  "For your privacy, please do not share Medicare numbers, Social Security numbers, bank information, or sensitive identifiers here. Vital Guide cannot process those identifiers. For plan-specific Medicare, Part D, or CMS guidance, request licensed follow-up so Patrick Mackin IV can respond through the proper process.";

function textFromModelMessage(message: ModelMessage): string {
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

export function containsSensitiveInsuranceIdentifier(text: string): boolean {
  if (SSN_PATTERN.test(text)) return true;
  if (BANK_IDENTIFIER_CONTEXT.test(text) && /\d[\d -]{5,}\d/.test(text)) return true;

  const normalized = text.toUpperCase();
  if (MEDICARE_IDENTIFIER_CONTEXT.test(normalized) && /[A-Z0-9][A-Z0-9 -]{8,20}[A-Z0-9]/.test(normalized)) {
    return true;
  }

  const candidates = normalized.match(/[A-Z0-9][A-Z0-9 -]{8,20}[A-Z0-9]/g) ?? [];
  return candidates.some((candidate) => {
    const compact = candidate.replace(/[^A-Z0-9]/g, "");
    return MBI_PATTERN.test(compact);
  });
}

export function chatMessagesContainSensitiveIdentifier(messages: ModelMessage[]): boolean {
  return messages
    .filter((message) => message.role === "user")
    .some((message) => containsSensitiveInsuranceIdentifier(textFromModelMessage(message)));
}
