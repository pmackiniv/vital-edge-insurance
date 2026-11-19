import assert from "node:assert/strict";
import test from "node:test";
import { buildClientLeadTracking, captureLandingAttribution } from "../../src/lib/clientLeadTracking";

/**
 * The regression these cover: attribution used to be read from
 * window.location at submit time, so a visitor who landed on a tagged URL and
 * then navigated to the form arrived with an empty query string and was
 * recorded with no source. That is the normal path, not an edge case.
 */

type StorageStub = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function installWindow(options: {
  search: string;
  referrer?: string;
  storage?: StorageStub | null;
  throwOnStorage?: boolean;
}) {
  const store = new Map<string, string>();
  const sessionStorage: StorageStub = options.storage ?? {
    getItem: (key) => {
      if (options.throwOnStorage) throw new Error("storage blocked");
      return store.has(key) ? store.get(key)! : null;
    },
    setItem: (key, value) => {
      if (options.throwOnStorage) throw new Error("storage blocked");
      store.set(key, value);
    },
  };

  (globalThis as Record<string, unknown>).window = {
    location: { search: options.search },
    sessionStorage,
  };
  (globalThis as Record<string, unknown>).document = { referrer: options.referrer ?? "" };

  return sessionStorage;
}

function clearWindow() {
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).document;
}

test("attribution captured on the landing page survives navigation to a form", () => {
  const storage = installWindow({ search: "?utm_source=linkedin&utm_medium=social&utm_campaign=profile" });
  captureLandingAttribution();

  // Visitor navigates to /contact. The query string is gone from the URL.
  (globalThis as Record<string, unknown>).window = {
    location: { search: "" },
    sessionStorage: storage,
  };

  const tracking = buildClientLeadTracking("/contact", "Medicare consumer review");
  assert.equal(tracking.utmSource, "linkedin");
  assert.equal(tracking.utmMedium, "social");
  assert.equal(tracking.utmCampaign, "profile");
  assert.equal(tracking.leadSource, "linkedin");
  assert.equal(tracking.linkedinReferral, true);
  clearWindow();
});

test("first touch wins: a later tagged arrival does not overwrite the original", () => {
  const storage = installWindow({ search: "?utm_source=linkedin&utm_medium=social" });
  captureLandingAttribution();

  (globalThis as Record<string, unknown>).window = {
    location: { search: "?utm_source=facebook&utm_medium=paid" },
    sessionStorage: storage,
  };
  captureLandingAttribution();

  const tracking = buildClientLeadTracking("/contact", "Medicare consumer review");
  assert.equal(tracking.utmSource, "linkedin");
  assert.equal(tracking.utmMedium, "social");
  clearWindow();
});

test("a visit with no signal stores nothing, leaving a later tagged arrival to be first touch", () => {
  const storage = installWindow({ search: "", referrer: "" });
  captureLandingAttribution();

  (globalThis as Record<string, unknown>).window = {
    location: { search: "?utm_source=event&utm_campaign=seminar-fall-2026" },
    sessionStorage: storage,
  };
  captureLandingAttribution();

  const tracking = buildClientLeadTracking("/contact", "Medicare consumer review");
  assert.equal(tracking.utmSource, "event");
  assert.equal(tracking.utmCampaign, "seminar-fall-2026");
  clearWindow();
});

test("blocked sessionStorage degrades to reading the live URL, never throws", () => {
  installWindow({ search: "?utm_source=google&utm_medium=organic", throwOnStorage: true });

  assert.doesNotThrow(() => captureLandingAttribution());
  const tracking = buildClientLeadTracking("/contact", "Medicare consumer review");
  assert.equal(tracking.utmSource, "google");
  assert.equal(tracking.utmMedium, "organic");
  clearWindow();
});

test("the event and partner flags persist across navigation too", () => {
  const storage = installWindow({ search: "?event=1" });
  captureLandingAttribution();

  (globalThis as Record<string, unknown>).window = {
    location: { search: "" },
    sessionStorage: storage,
  };

  const tracking = buildClientLeadTracking("/medicare-educational-events", "Community event request");
  assert.equal(tracking.eventReferral, true);
  assert.equal(tracking.partnerReferral, false);
  clearWindow();
});

test("explicit caller flags still win regardless of stored attribution", () => {
  const storage = installWindow({ search: "?utm_source=google" });
  captureLandingAttribution();

  (globalThis as Record<string, unknown>).window = {
    location: { search: "" },
    sessionStorage: storage,
  };

  const tracking = buildClientLeadTracking("/partner-with-vital-edge", "Referral partner inquiry", {
    partnerReferral: true,
  });
  assert.equal(tracking.partnerReferral, true);
  assert.equal(tracking.utmSource, "google");
  clearWindow();
});

test("server-side rendering returns empty attribution without touching window", () => {
  clearWindow();
  const tracking = buildClientLeadTracking("/contact", "ACA/private health");
  assert.equal(tracking.utmSource, "");
  assert.equal(tracking.leadSource, "Website");
  assert.equal(tracking.pageSource, "/contact");
});
