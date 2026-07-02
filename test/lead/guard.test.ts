import assert from "node:assert/strict";
import test from "node:test";
import { findSensitiveIdentifier } from "../../src/lib/leadGuard";

test("findSensitiveIdentifier blocks SSN-like values", () => {
  assert.equal(
    findSensitiveIdentifier("Please call me about 123-45-6789."),
    "Please remove SSN/Medicare ID (MBI) or other sensitive identifiers.",
  );
});

test("findSensitiveIdentifier blocks Medicare identifier language", () => {
  assert.equal(
    findSensitiveIdentifier("My Medicare number is 1EG4-TE5-MK73."),
    "Please remove SSN/Medicare ID (MBI) or other sensitive identifiers.",
  );
});

test("findSensitiveIdentifier allows general Medicare education questions", () => {
  assert.equal(findSensitiveIdentifier("I need help understanding Medicare Part D."), null);
});
