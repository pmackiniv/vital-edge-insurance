import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, verifySessionToken } from "../../src/app/admin/_lib/session";

test("session token verifies and returns email", async () => {
  process.env.ADMIN_UI_SESSION_SECRET = "test-secret";
  const token = await createSessionToken("Owner@Example.com");
  const session = await verifySessionToken(token);

  assert.ok(session);
  assert.equal(session?.email, "owner@example.com");
});

test("session token tampering is rejected", async () => {
  process.env.ADMIN_UI_SESSION_SECRET = "test-secret";
  const token = await createSessionToken("owner@example.com");
  const tampered = `${token}x`;
  const session = await verifySessionToken(tampered);

  assert.equal(session, null);
});

test("session token expires based on exp claim", async () => {
  process.env.ADMIN_UI_SESSION_SECRET = "test-secret";
  process.env.ADMIN_UI_SESSION_TTL_HOURS = "1";

  const token = await createSessionToken("owner@example.com");
  const realNow = Date.now;
  try {
    Date.now = () => realNow() + (2 * 60 * 60 * 1000);
    const session = await verifySessionToken(token);
    assert.equal(session, null);
  } finally {
    Date.now = realNow;
  }
});
