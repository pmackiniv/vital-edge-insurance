import assert from "node:assert/strict";
import test from "node:test";
import { classifyChatProviderError, makeChatUnavailablePayload } from "../../src/lib/chatProviderGuard";

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

test("makeChatUnavailablePayload returns deterministic shape", () => {
  const payload = makeChatUnavailablePayload("req-123", "BILLING");
  assert.deepEqual(payload, {
    error: "CHAT_UNAVAILABLE",
    reason: "BILLING",
    requestId: "req-123",
  });
});
