export const DEFAULT_OPENAI_MODEL = "gpt-5.5";

export function getChatModelId() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}
