import assert from "node:assert/strict";
import { test } from "node:test";
import { readAnalyticsEnabled } from "../../src/components/AnalyticsConsent";

test("analytics preserves GPC, stored opt-out, and the existing storage-failure default", () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  let optedOut: string | null = null;
  let blockedStorage = false;
  const navigatorMock = { globalPrivacyControl: false };
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: navigatorMock });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: { getItem: () => {
      if (blockedStorage) throw new Error("Storage unavailable");
      return optedOut;
    } } },
  });
  try {
    assert.equal(readAnalyticsEnabled(), true);
    optedOut = "1";
    assert.equal(readAnalyticsEnabled(), false);
    optedOut = null;
    navigatorMock.globalPrivacyControl = true;
    assert.equal(readAnalyticsEnabled(), false);
    blockedStorage = true;
    assert.equal(readAnalyticsEnabled(), false);
    navigatorMock.globalPrivacyControl = false;
    assert.equal(readAnalyticsEnabled(), true);
  } finally {
    if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
    else Reflect.deleteProperty(globalThis, "navigator");
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
