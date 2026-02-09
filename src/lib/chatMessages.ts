import { convertToModelMessages, type ModelMessage, type UIMessage } from "ai";

type UnknownRecord = Record<string, unknown>;

function isRole(value: unknown): value is UIMessage["role"] {
  return value === "system" || value === "user" || value === "assistant";
}

function toUiMessageWithoutId(value: unknown): Omit<UIMessage, "id"> | null {
  if (!value || typeof value !== "object") return null;
  const record = value as UnknownRecord;
  if (!isRole(record.role)) return null;
  if (!Array.isArray(record.parts)) return null;

  const message: Omit<UIMessage, "id"> = {
    role: record.role,
    parts: record.parts as UIMessage["parts"],
  };

  if ("metadata" in record) {
    (message as UnknownRecord).metadata = record.metadata;
  }

  return message;
}

function isLegacyModelMessage(value: unknown): value is ModelMessage {
  if (!value || typeof value !== "object") return false;
  const record = value as UnknownRecord;
  if (!["system", "user", "assistant", "tool"].includes(String(record.role))) return false;
  return typeof record.content === "string" || Array.isArray(record.content);
}

export async function normalizeChatMessages(input: unknown): Promise<ModelMessage[]> {
  if (!Array.isArray(input)) return [];

  const uiMessages = input
    .map(toUiMessageWithoutId)
    .filter((message): message is Omit<UIMessage, "id"> => message !== null);

  if (uiMessages.length > 0) {
    try {
      return await convertToModelMessages(uiMessages);
    } catch {
      // Fall through to legacy format handling.
    }
  }

  return input.filter(isLegacyModelMessage);
}
