import assert from "node:assert/strict";
import test from "node:test";
import { answerGuideAI, parseGuideAIInput } from "../../src/lib/vitalGuideAI";
import { publicGuideSources } from "../../src/lib/vitalGuideSources";

test("follows up using only prior public evidence references, with approved link/text", async () => {
  const q = parseGuideAIInput({ question: "What paperwork should I get?", context: ["work-checklist", "private-project", "work-checklist"] });
  assert.deepEqual(q, { question: "What paperwork should I get?", context: ["work-checklist"] });
  assert.ok(q);
  const r = await answerGuideAI(q, async ({ context }) => {
    assert.deepEqual(context, ["work-checklist"]);
    return { kind: "answer", ids: ["work-form","work-drug"], privateContent: "never display me" };
  });
  assert.equal(r.kind, "answer");
  if (r.kind !== "answer") return;
  assert.deepEqual(r.context, ["work-form","work-drug"]);
  assert.equal(r.facts[0].href, publicGuideSources["work-form"].href);
  assert.equal(r.facts[1].text, publicGuideSources["work-drug"].takeaway);
  assert.doesNotMatch(JSON.stringify(r), /never display me/);
});

test("private details and personalized coverage questions stay away from the selector", async () => {
  for (const [question, kind] of [
    ["My phone is (202) 555-0123", "privacy"],
    ["My name is Example Person", "privacy"],
    ["My Medicare number is 1EG4TE5MK72", "privacy"],
    ["I am taking an example medication", "privacy"],
    ["Is my doctor in network?", "personal"],
    ["Will my plan cover dentures?", "personal"],
  ] as const) {
    let called = false;
    assert.deepEqual(await answerGuideAI({ question, context: [] }, async () => { called = true; }), { kind });
    assert.equal(called, false);
  }
});

test("model can't invent links, write freeform copy, or bypass errors", async () => {
  const input = { question: "What is Medicare?", context: [] };
  assert.deepEqual(await answerGuideAI(input, async () => ({ kind: "answer", ids: ["https://wrong.example/source"] })), { kind: "unavailable" });
  assert.deepEqual(await answerGuideAI(input, async () => { throw new Error("provider failed"); }), { kind: "unavailable" });
  assert.deepEqual(await answerGuideAI(input, async () => ({ kind: "personal", ids: ["compare"] })), { kind: "personal" });
});

test("bounds submitted text and context", () => {
  assert.equal(parseGuideAIInput({ question: "a".repeat(401) }), null);
  assert.equal(parseGuideAIInput({ question: "   " }), null);
  assert.deepEqual(parseGuideAIInput({ question: "Part B?", context: ["work-form", "work-hsa", "part-b", "work-drug"] })?.context, ["work-form", "work-hsa", "part-b"]);
});
