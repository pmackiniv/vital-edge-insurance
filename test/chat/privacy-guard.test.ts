import assert from "node:assert/strict";
import test from "node:test";
import {
  chatMessagesContainSensitiveIdentifier,
  containsSensitiveInsuranceIdentifier,
} from "../../src/lib/chatPrivacyGuard";

test("containsSensitiveInsuranceIdentifier detects SSN-like values", () => {
  assert.equal(containsSensitiveInsuranceIdentifier("My SSN is 123-45-6789."), true);
});

test("containsSensitiveInsuranceIdentifier detects Medicare MBI-like values", () => {
  assert.equal(containsSensitiveInsuranceIdentifier("My Medicare number is 1EG4-TE5-MK73."), true);
});

test("containsSensitiveInsuranceIdentifier ignores ordinary Medicare education text", () => {
  assert.equal(containsSensitiveInsuranceIdentifier("What is Part D and when should I review plan fit?"), false);
});

test("chatMessagesContainSensitiveIdentifier only evaluates user messages", () => {
  assert.equal(
    chatMessagesContainSensitiveIdentifier([
      { role: "assistant", content: "Example 1EG4-TE5-MK73" },
      { role: "user", content: "What is a Medicare Supplement?" },
    ]),
    false,
  );
});
