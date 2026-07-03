import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getChatModelId } from "@/lib/chatModelConfig";

export type ChatUnavailableReason = "BILLING" | "AUTH";

type ProviderProbeState = {
  checkedAtMs: number;
  status: "ok" | "blocked";
  reason: ChatUnavailableReason | null;
};

const PROBE_OK_TTL_MS = 60_000;
const PROBE_BLOCK_TTL_MS = 20_000;

let probeState: ProviderProbeState = {
  checkedAtMs: 0,
  status: "ok",
  reason: null,
};

function messageFromError(error: unknown): string {
  if (!error) return "";
  if (error instanceof Error) return error.message || "";
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function classifyChatProviderError(error: unknown): ChatUnavailableReason | null {
  const message = messageFromError(error).toLowerCase();
  if (!message) return null;

  if (
    message.includes("insufficient_quota") ||
    message.includes("exceeded your current quota") ||
    message.includes("billing") ||
    message.includes("quota")
  ) {
    return "BILLING";
  }

  if (
    message.includes("invalid_api_key") ||
    message.includes("incorrect api key") ||
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes('"status":401') ||
    message.includes("status code 401")
  ) {
    return "AUTH";
  }

  return null;
}

export function makeChatUnavailablePayload(requestId: string, reason: ChatUnavailableReason) {
  return {
    error: "CHAT_UNAVAILABLE" as const,
    reason,
    requestId,
  };
}

function probeIsFresh(nowMs: number) {
  if (probeState.checkedAtMs === 0) return false;
  const ttl = probeState.status === "blocked" ? PROBE_BLOCK_TTL_MS : PROBE_OK_TTL_MS;
  return nowMs - probeState.checkedAtMs < ttl;
}

export async function ensureChatProviderAvailable(): Promise<{ ok: true } | { ok: false; reason: ChatUnavailableReason }> {
  const nowMs = Date.now();
  if (probeIsFresh(nowMs)) {
    if (probeState.status === "blocked" && probeState.reason) {
      return { ok: false, reason: probeState.reason };
    }
    return { ok: true };
  }

  try {
    await generateText({
      model: openai(getChatModelId()),
      prompt: "Reply with OK.",
      maxOutputTokens: 1,
      temperature: 0,
    });
    probeState = {
      checkedAtMs: nowMs,
      status: "ok",
      reason: null,
    };
    return { ok: true };
  } catch (error) {
    const reason = classifyChatProviderError(error);
    if (!reason) {
      probeState = {
        checkedAtMs: nowMs,
        status: "ok",
        reason: null,
      };
      return { ok: true };
    }

    probeState = {
      checkedAtMs: nowMs,
      status: "blocked",
      reason,
    };
    return { ok: false, reason };
  }
}

