import assert from "node:assert/strict";
import test from "node:test";
import { normalizeChatMessages } from "../../src/lib/chatMessages";

test("normalizeChatMessages converts UI chat messages to model messages", async () => {
  const messages = await normalizeChatMessages([
    {
      id: "msg-1",
      role: "user",
      parts: [{ type: "text", text: "Hello from UI chat" }],
    },
  ]);

  assert.equal(messages.length, 1);
  assert.equal(messages[0].role, "user");
  assert.ok(JSON.stringify(messages[0]).includes("Hello from UI chat"));
});

test("normalizeChatMessages supports legacy model message payloads", async () => {
  const messages = await normalizeChatMessages([{ role: "user", content: "Legacy message" }]);

  assert.equal(messages.length, 1);
  assert.equal(messages[0].role, "user");
  assert.ok(JSON.stringify(messages[0]).includes("Legacy message"));
});

test("normalizeChatMessages returns empty array for invalid payloads", async () => {
  const messages = await normalizeChatMessages([{ id: "broken", role: "user", text: "Missing parts" }]);
  assert.deepEqual(messages, []);
});
