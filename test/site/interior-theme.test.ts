import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { test } from "node:test";
import { interiorPhotos, photoForInteriorPage } from "../../src/lib/interiorTheme";

test("interior pages choose distinct approved lifestyle scenes by page family", () => {
  assert.equal(photoForInteriorPage("Medicare", "Medicare Guidance"), "walking");
  assert.equal(photoForInteriorPage("Resources", "Client Education Hub"), "gardening");
  assert.equal(photoForInteriorPage("Ancillary Coverage", "Dental, Vision & Hospital Coverage"), "cycling");
  for (const path of Object.values(interiorPhotos)) {
    assert.ok(statSync(`public${path}`).size < 150_000, path);
  }
});
