export type ChatUnavailableReason = "BILLING" | "AUTH" | "CONFIG";

type ProviderProbeState = {
  checkedAtMs: number;
  status: "ok" | "blocked";
  reason: ChatUnavailableReason | null;
};

const PROBE_BLOCK_TTL_MS = 300_000;

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
    message.includes("credit_balance_exhausted") ||
    message.includes("no credits remaining") ||
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

export function markChatProviderUnavailable(reason: ChatUnavailableReason, nowMs = Date.now()) {
  probeState = { checkedAtMs: nowMs, status: "blocked", reason };
}

// Check failures from real requests; never spend tokens on an availability probe.
export function ensureChatProviderAvailable(nowMs = Date.now()): { ok: true } | { ok: false; reason: ChatUnavailableReason } {
  if (probeState.reason && nowMs - probeState.checkedAtMs < PROBE_BLOCK_TTL_MS) {
    return { ok: false, reason: probeState.reason };
  }
  return { ok: true };
}
