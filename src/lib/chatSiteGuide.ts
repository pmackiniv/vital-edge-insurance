import type { ModelMessage } from "ai";
import { chatMessagesContainSensitiveIdentifier, SENSITIVE_IDENTIFIER_CHAT_RESPONSE } from "./chatPrivacyGuard";

export const CHAT_FALLBACK_RESPONSE =
  "Live AI answers are unavailable right now. You can still use the links below to book a call, open the secure Medicare plan finder, or read the Turning 65 guide. No chat or appointment is needed to open the plan finder. Available plans vary by location and carrier. For personal coverage questions, call or text Patrick at (352) 214-8879.";

/** Privacy checks always run before navigation or any paid model request. */
export function getChatSiteGuideResponse(messages: ModelMessage[]): string | null {
  if (chatMessagesContainSensitiveIdentifier(messages)) return SENSITIVE_IDENTIFIER_CHAT_RESPONSE;
  const latest = [...messages].reverse().find((message) => message.role === "user");
  const text = typeof latest?.content === "string"
    ? latest.content
    : latest?.content.flatMap((part) => "text" in part ? [part.text] : []).join(" ") || "";

  if (/\b(book|schedule) (a |an |my )?(call|appointment|consultation)\b|\bcalendly\b/i.test(text)) {
    return "Use Book a call below to see Patrick’s available appointments. The website calendar opens in Eastern Time (ET), including daylight saving changes. Check the calendar’s time-zone label before confirming. You can also call or text (352) 214-8879.";
  }
  if (/\b(self[- ]?enroll|plan finder|sunfire|purl)\b/i.test(text)) {
    return "Use Compare plans online below to open Patrick’s secure SunFire plan finder. No appointment is needed to browse. Available carriers and plans vary by location; a plan missing from this tool is not necessarily unavailable elsewhere. Enrollment requires eligibility and a valid enrollment period. Patrick can help if you cannot find your plan.";
  }
  return null;
}
