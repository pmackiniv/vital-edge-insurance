import assert from "node:assert/strict";
import test from "node:test";

import {
  canBypassAdminLock,
  isAdminApiPath,
  isLockedAdminPath,
  isPublicAdminLockEnabled,
} from "../../src/lib/publicAdminLock";

test("isPublicAdminLockEnabled defaults to true", () => {
  assert.equal(isPublicAdminLockEnabled(undefined), true);
  assert.equal(isPublicAdminLockEnabled(""), true);
});

test("isPublicAdminLockEnabled honors explicit false values", () => {
  assert.equal(isPublicAdminLockEnabled("false"), false);
  assert.equal(isPublicAdminLockEnabled("0"), false);
  assert.equal(isPublicAdminLockEnabled("off"), false);
});

test("isLockedAdminPath matches admin surfaces", () => {
  assert.equal(isLockedAdminPath("/admin"), true);
  assert.equal(isLockedAdminPath("/admin/agents"), true);
  assert.equal(isLockedAdminPath("/api/admin"), true);
  assert.equal(isLockedAdminPath("/api/admin/events"), true);
  assert.equal(isLockedAdminPath("/api/agent-status"), false);
  assert.equal(isLockedAdminPath("/contact"), false);
});

test("isAdminApiPath only matches admin API routes", () => {
  assert.equal(isAdminApiPath("/api/admin"), true);
  assert.equal(isAdminApiPath("/api/admin/compliance/calls"), true);
  assert.equal(isAdminApiPath("/admin"), false);
  assert.equal(isAdminApiPath("/contact"), false);
});

test("canBypassAdminLock only allows admin API with matching key", () => {
  assert.equal(canBypassAdminLock("/api/admin/compliance/calls", "abc123", "abc123"), true);
  assert.equal(canBypassAdminLock("/api/admin/compliance/calls", "wrong", "abc123"), false);
  assert.equal(canBypassAdminLock("/admin/leads", "abc123", "abc123"), false);
  assert.equal(canBypassAdminLock("/api/admin/compliance/calls", "", "abc123"), false);
  assert.equal(canBypassAdminLock("/api/admin/compliance/calls", "abc123", ""), false);
});
