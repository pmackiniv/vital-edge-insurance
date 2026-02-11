import assert from "node:assert/strict";
import test from "node:test";
import {
  computeSha256,
  expectedArtifacts,
  missingExpected,
  parseArtifactContent,
  parseHandoffTasks,
  upsertBySha,
} from "../../scripts/gbp/sync-artifacts";

test("parseArtifactContent ingests markdown as contentText", () => {
  const parsed = parseArtifactContent("gbp.posts.md", "# Heading\n\nBody");
  assert.equal(parsed.contentText?.includes("Heading"), true);
  assert.equal(parsed.contentJson, null);
});

test("parseArtifactContent ingests JSON payload", () => {
  const parsed = parseArtifactContent("report.json", '{"ok":true,"count":3}');
  assert.equal((parsed.contentJson as { ok: boolean }).ok, true);
  assert.equal(parsed.contentText, null);
});

test("computeSha256 is deterministic for dedupe", () => {
  const a = computeSha256("same payload");
  const b = computeSha256("same payload");
  const c = computeSha256("different payload");

  assert.equal(a, b);
  assert.notEqual(a, c);
});

test("upsertBySha deduplicates records by hash", async () => {
  const seen = new Set<string>();
  const inserted: string[] = [];

  const records = [
    { sha256: "a" },
    { sha256: "b" },
    { sha256: "a" },
  ];

  const result = await upsertBySha(records, {
    hasSha: async (sha) => seen.has(sha),
    insert: async (entry) => {
      seen.add(entry.sha256);
      inserted.push(entry.sha256);
    },
  });

  assert.equal(result.inserted, 2);
  assert.equal(result.skipped, 1);
  assert.deepEqual(inserted, ["a", "b"]);
});

test("missingExpected reports absent weekly files", () => {
  const expected = expectedArtifacts("weekly");
  const missing = missingExpected(expected, ["gbp.posts.md", "gbp.handoff.weekly.md"]);

  assert.equal(missing.includes("gbp.weekly-performance-memo.md"), true);
  assert.equal(missing.includes("gbp.review-response-library.md"), true);
});

test("parseHandoffTasks extracts bullet items from required-manual-actions section", () => {
  const markdown = [
    "# Handoff",
    "",
    "## Required manual actions",
    "- Approve post draft",
    "- Publish visual update",
    "",
    "## Ads status",
    "- NOT_LAUNCHED",
  ].join("\n");

  const tasks = parseHandoffTasks(markdown);
  assert.deepEqual(tasks, ["Approve post draft", "Publish visual update"]);
});
