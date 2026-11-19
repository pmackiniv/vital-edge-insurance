import assert from "node:assert/strict";
import test from "node:test";
import { classifyChatProviderError, makeChatUnavailablePayload, markChatProviderUnavailable, ensureChatProviderAvailable } from "../../src/lib/chatProviderGuard";

test("classifyChatProviderError maps insufficient_quota to BILLING", () => {
  const reason = classifyChatProviderError(
    '{"type":"insufficient_quota","code":"insufficient_quota","message":"You exceeded your current quota."}',
  );
  assert.equal(reason, "BILLING");
});

test("classifyChatProviderError maps auth-like errors to AUTH", () => {
  const reason = classifyChatProviderError('{"error":"invalid_api_key","status":401,"message":"Unauthorized"}');
  assert.equal(reason, "AUTH");
});

test("classifyChatProviderError ignores unrelated errors", () => {
  const reason = classifyChatProviderError(new Error("temporary upstream timeout"));
  assert.equal(reason, null);
});

test("exhausted credit balance opens a five-minute circuit without a paid probe", () => {
  assert.equal(classifyChatProviderError(new Error("You have no credits remaining.")), "BILLING");
  assert.equal(classifyChatProviderError({ code: "credit_balance_exhausted" }), "BILLING");
  markChatProviderUnavailable("BILLING", 1_000);
  assert.deepEqual(ensureChatProviderAvailable(300_999), { ok: false, reason: "BILLING" });
  assert.deepEqual(ensureChatProviderAvailable(301_000), { ok: true });
});

test("makeChatUnavailablePayload returns deterministic shape", () => {
  const payload = makeChatUnavailablePayload("req-123", "BILLING");
  assert.deepEqual(payload, {
    error: "CHAT_UNAVAILABLE",
    reason: "BILLING",
    requestId: "req-123",
  });
});
