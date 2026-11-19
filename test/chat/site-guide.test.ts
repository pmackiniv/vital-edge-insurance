import assert from "node:assert/strict";
import test from "node:test";
import { getChatSiteGuideResponse } from "../../src/lib/chatSiteGuide";
import { SENSITIVE_IDENTIFIER_CHAT_RESPONSE } from "../../src/lib/chatPrivacyGuard";

test("sensitive identifiers take priority over booking navigation", () => {
  assert.equal(getChatSiteGuideResponse([{ role: "user", content: "Book a call. My SSN is 123-45-6789." }]), SENSITIVE_IDENTIFIER_CHAT_RESPONSE);
});

test("navigation works without AI while coverage decisions receive no canned recommendation", () => {
  assert.match(getChatSiteGuideResponse([{ role: "user", content: "How do I book an appointment?" }]) || "", /Eastern Time/);
  assert.match(getChatSiteGuideResponse([{ role: "user", content: "Where is the SunFire plan finder?" }]) || "", /valid enrollment period/);
  assert.equal(getChatSiteGuideResponse([{ role: "user", content: "Which Medicare plan should I choose?" }]), null);
});
