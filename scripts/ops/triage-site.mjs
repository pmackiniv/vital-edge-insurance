#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const DEFAULT_TIMEOUT_MS = 45_000;
const CHAT_TEXT = "Hello from automated triage.";
const MOBILE_LINK_LABELS = ["Home", "About", "Medicare", "Health Insurance", "Other Services", "Resources", "Locations"];

function parseArgs(argv) {
  const args = { baseUrl: process.env.BASE_URL || "", timeoutMs: DEFAULT_TIMEOUT_MS };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--baseUrl") {
      args.baseUrl = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--timeoutMs") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        args.timeoutMs = parsed;
      }
      i += 1;
      continue;
    }
  }
  if (!args.baseUrl) {
    throw new Error("Missing --baseUrl and BASE_URL is not set.");
  }
  return args;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function timestamp() {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mi = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
}

function withBase(baseUrl, route) {
  const normalized = baseUrl.replace(/\/+$/, "");
  const suffix = route.startsWith("/") ? route : `/${route}`;
  return `${normalized}${suffix}`;
}

function appendLog(logLines, message) {
  logLines.push(`[${new Date().toISOString()}] ${message}`);
}

function pickConsoleType(type) {
  if (["error", "warning", "log", "info", "debug"].includes(type)) return type;
  return "log";
}

async function ensureOutputDir() {
  const outDir = path.join(process.cwd(), "outputs", "triage", timestamp());
  await fs.mkdir(outDir, { recursive: true });
  return outDir;
}

async function clickFirstVisible(locator) {
  const count = await locator.count();
  for (let i = 0; i < count; i += 1) {
    const candidate = locator.nth(i);
    if (await candidate.isVisible()) {
      await candidate.click();
      return true;
    }
  }
  return false;
}

async function findFirstVisibleEnabled(locator) {
  const count = await locator.count();
  for (let i = 0; i < count; i += 1) {
    const candidate = locator.nth(i);
    if (await candidate.isVisible() && await candidate.isEnabled()) {
      return candidate;
    }
  }
  return null;
}

async function runDesktop({
  browser,
  baseUrl,
  timeoutMs,
  outDir,
  logLines,
  networkEntries,
}) {
  const result = {
    passed: false,
    endpoint: "/api/chat",
    responseStatus: null,
    contactUrl: withBase(baseUrl, "/contact"),
    fallbackUrl: withBase(baseUrl, "/chat"),
    error: null,
  };
  const tracePath = path.join(outDir, "trace.zip");
  const screenshotPath = path.join(outDir, "desktop.png");
  const requestMap = new Map();
  let context;
  let page;

  try {
    context = await browser.newContext();
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    page = await context.newPage();
    page.setDefaultTimeout(timeoutMs);

    page.on("console", (msg) => {
      const type = pickConsoleType(msg.type());
      const loc = msg.location();
      appendLog(
        logLines,
        `[desktop console:${type}] ${msg.text()}${loc?.url ? ` (${loc.url}:${loc.lineNumber || 0})` : ""}`,
      );
    });

    page.on("request", (request) => {
      const url = request.url();
      if (!url.includes("/api/")) return;
      const entry = {
        context: "desktop",
        url,
        method: request.method(),
        requestTs: new Date().toISOString(),
        status: null,
        ok: null,
        failureText: null,
      };
      networkEntries.push(entry);
      requestMap.set(request, entry);
    });

    page.on("response", (response) => {
      const request = response.request();
      const entry = requestMap.get(request);
      if (!entry) return;
      entry.status = response.status();
      entry.ok = response.ok();
      entry.responseTs = new Date().toISOString();
    });

    page.on("requestfailed", (request) => {
      const entry = requestMap.get(request);
      if (!entry) return;
      entry.failureText = request.failure()?.errorText || "unknown_request_failure";
      entry.responseTs = new Date().toISOString();
    });

    appendLog(logLines, `Desktop navigation start: ${result.contactUrl}`);
    const contactResponse = await page.goto(result.contactUrl, { waitUntil: "domcontentloaded" });
    if (!contactResponse || contactResponse.status() >= 400) {
      appendLog(logLines, `Desktop fallback navigation start: ${result.fallbackUrl}`);
      await page.goto(result.fallbackUrl, { waitUntil: "domcontentloaded" });
    }

    const launchers = page.getByRole("button", { name: /chat with a licensed agent now|talk with a licensed agent now|live help/i });
    const launcherClicked = await clickFirstVisible(launchers);
    if (launcherClicked) {
      await page.getByText(/Talk with a licensed agent now/i).first().waitFor({ state: "visible", timeout: 8_000 }).catch(() => {});
    }

    const askQuestion = page.getByRole("button", { name: /Ask a question/i });
    await clickFirstVisible(askQuestion);

    let chatInput = await findFirstVisibleEnabled(page.locator(".chat-widget-root textarea"));
    if (!chatInput) {
      const fullChatLink = page.getByRole("link", { name: /Open full chat page/i });
      const fullChatOpened = await clickFirstVisible(fullChatLink);
      if (fullChatOpened) {
        await page.waitForLoadState("domcontentloaded");
      } else if (!page.url().includes("/chat")) {
        await page.goto(result.fallbackUrl, { waitUntil: "domcontentloaded" });
      }
      chatInput = await findFirstVisibleEnabled(page.locator("textarea"));
    }
    if (!chatInput) {
      throw new Error("No visible and enabled chat textarea found after opening chat widget and /chat fallback.");
    }

    await chatInput.fill(CHAT_TEXT);
    const sendButton = page.getByRole("button", { name: /^Send$/i }).first();
    if (!(await sendButton.isVisible()) || !(await sendButton.isEnabled())) {
      throw new Error("Send button not visible/enabled.");
    }

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/chat") && response.request().method() === "POST",
      { timeout: timeoutMs },
    );
    await sendButton.click();
    const chatResponse = await responsePromise;
    result.responseStatus = chatResponse.status();
    if (chatResponse.status() === 200) {
      result.passed = true;
    } else if (chatResponse.status() === 503) {
      const payload = await chatResponse.json().catch(() => ({}));
      result.passed = payload?.error === "CHAT_UNAVAILABLE";
    } else {
      result.passed = false;
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    appendLog(logLines, `Desktop triage failure: ${result.error}`);
    if (page) {
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
      } catch {
        appendLog(logLines, "Desktop screenshot capture failed.");
      }
    }
  } finally {
    if (context) {
      try {
        await context.tracing.stop({ path: tracePath });
      } catch {
        appendLog(logLines, "Trace capture failed.");
      }
      await context.close();
    }
  }

  return { ...result, screenshotPath, tracePath };
}

async function runMobile({
  browser,
  baseUrl,
  timeoutMs,
  outDir,
  logLines,
  networkEntries,
  events,
}) {
  const result = {
    passed: false,
    attempts: [],
    routeChangedCount: 0,
    interceptedAttemptCount: 0,
    failedAttemptCount: 0,
    error: null,
  };
  const screenshotPath = path.join(outDir, "mobile.png");
  const requestMap = new Map();
  let context;
  let page;

  try {
    context = await browser.newContext({ ...devices["iPhone 12"] });
    page = await context.newPage();
    page.setDefaultTimeout(timeoutMs);

    page.on("console", (msg) => {
      const type = pickConsoleType(msg.type());
      const loc = msg.location();
      appendLog(
        logLines,
        `[mobile console:${type}] ${msg.text()}${loc?.url ? ` (${loc.url}:${loc.lineNumber || 0})` : ""}`,
      );
    });

    page.on("request", (request) => {
      const url = request.url();
      if (!url.includes("/api/")) return;
      const entry = {
        context: "mobile",
        url,
        method: request.method(),
        requestTs: new Date().toISOString(),
        status: null,
        ok: null,
        failureText: null,
      };
      networkEntries.push(entry);
      requestMap.set(request, entry);
    });

    page.on("response", (response) => {
      const request = response.request();
      const entry = requestMap.get(request);
      if (!entry) return;
      entry.status = response.status();
      entry.ok = response.ok();
      entry.responseTs = new Date().toISOString();
    });

    page.on("requestfailed", (request) => {
      const entry = requestMap.get(request);
      if (!entry) return;
      entry.failureText = request.failure()?.errorText || "unknown_request_failure";
      entry.responseTs = new Date().toISOString();
    });

    await page.goto(withBase(baseUrl, "/"), { waitUntil: "domcontentloaded" });

    for (const label of MOBILE_LINK_LABELS) {
      const attempt = {
        label,
        clicked: false,
        beforeUrl: page.url(),
        afterUrl: page.url(),
        routeChanged: false,
        visible: false,
        boundingBox: null,
        centerPoint: null,
        blocker: null,
        navToggle: null,
        error: null,
      };
      try {
        const toggle = page.getByRole("button", { name: /Toggle navigation/i }).first();
        if (await toggle.count()) {
          const navExpanded = await toggle.getAttribute("aria-expanded");
          if (await toggle.isVisible() && navExpanded !== "true") {
            await toggle.click();
          }
          attempt.navToggle = await toggle.evaluate((el) => ({
            ariaExpanded: el.getAttribute("aria-expanded"),
            className: el.className,
          }));
        }

        const panel = page.locator("#mobile-nav-panel");
        const labelPattern = new RegExp(`^${escapeRegExp(label)}$`, "i");
        const link = panel.getByRole("link", { name: labelPattern }).first();
        attempt.visible = await link.isVisible();
        if (!attempt.visible) {
          throw new Error(`Link not visible: ${label}`);
        }
        const box = await link.boundingBox();
        if (box) {
          const center = { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) };
          attempt.boundingBox = box;
          attempt.centerPoint = center;
          attempt.blocker = await page.evaluate(({ x, y }) => {
            const element = document.elementFromPoint(x, y);
            if (!element) return null;
            const style = window.getComputedStyle(element);
            return {
              tag: element.tagName.toLowerCase(),
              id: element.id || null,
              className: element.className || null,
              pointerEvents: style.pointerEvents,
              zIndex: style.zIndex,
              position: style.position,
              text: (element.textContent || "").trim().slice(0, 120),
            };
          }, center);
        }

        await link.click({ timeout: timeoutMs });
        attempt.clicked = true;
        await page.waitForLoadState("domcontentloaded", { timeout: Math.min(timeoutMs, 10_000) });
        attempt.afterUrl = page.url();
        attempt.routeChanged = attempt.afterUrl !== attempt.beforeUrl;
        if (attempt.routeChanged) {
          result.routeChangedCount += 1;
        }
      } catch (err) {
        attempt.error = err instanceof Error ? err.message : String(err);
      }
      events.push({
        type: "mobile_nav_attempt",
        at: new Date().toISOString(),
        attempt,
      });
      appendLog(
        logLines,
        `Mobile nav attempt ${label}: clicked=${attempt.clicked} visible=${attempt.visible} routeChanged=${attempt.routeChanged} ${
          attempt.error ? `error=${attempt.error}` : ""
        }`,
      );
      result.attempts.push(attempt);
    }

    const interceptedAttempts = result.attempts.filter(
      (attempt) => typeof attempt.error === "string" && attempt.error.toLowerCase().includes("intercepts pointer events"),
    );
    const failedAttempts = result.attempts.filter((attempt) => typeof attempt.error === "string" && attempt.error.length > 0);
    result.interceptedAttemptCount = interceptedAttempts.length;
    result.failedAttemptCount = failedAttempts.length;
    result.passed = result.routeChangedCount > 0
      && result.interceptedAttemptCount === 0
      && result.failedAttemptCount === 0;
    appendLog(
      logLines,
      `Mobile summary: routeChanged=${result.routeChangedCount} intercepted=${result.interceptedAttemptCount} failed=${result.failedAttemptCount}`,
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    appendLog(logLines, `Mobile triage failure: ${result.error}`);
    if (page) {
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
      } catch {
        appendLog(logLines, "Mobile screenshot capture failed.");
      }
    }
  } finally {
    if (context) {
      await context.close();
    }
  }

  return { ...result, screenshotPath };
}

async function writeArtifacts(outDir, logLines, networkEntries, summary) {
  const consolePath = path.join(outDir, "console.log");
  const networkPath = path.join(outDir, "network.json");

  await fs.writeFile(consolePath, `${logLines.join("\n")}\n`, "utf8");
  await fs.writeFile(
    networkPath,
    `${JSON.stringify({ summary, requests: networkEntries, events: summary.events || [] }, null, 2)}\n`,
    "utf8",
  );
}

async function main() {
  const args = parseArgs(process.argv);
  const outDir = await ensureOutputDir();
  const logLines = [];
  const networkEntries = [];
  const events = [];
  appendLog(logLines, `Triage start baseUrl=${args.baseUrl} timeoutMs=${args.timeoutMs}`);
  appendLog(logLines, `Artifact directory: ${outDir}`);

  let browser;
  let desktopResult = null;
  let mobileResult = null;
  let fatalError = null;

  try {
    browser = await chromium.launch({ headless: true });
    desktopResult = await runDesktop({
      browser,
      baseUrl: args.baseUrl,
      timeoutMs: args.timeoutMs,
      outDir,
      logLines,
      networkEntries,
    });

    mobileResult = await runMobile({
      browser,
      baseUrl: args.baseUrl,
      timeoutMs: args.timeoutMs,
      outDir,
      logLines,
      networkEntries,
      events,
    });
  } catch (err) {
    fatalError = err instanceof Error ? err.message : String(err);
    appendLog(logLines, `Fatal triage error: ${fatalError}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  const desktopPassed = Boolean(desktopResult?.passed);
  const mobilePassed = Boolean(mobileResult?.passed);
  const overallPassed = desktopPassed && mobilePassed && !fatalError;
  const summary = {
    baseUrl: args.baseUrl,
    timeoutMs: args.timeoutMs,
    desktop: desktopResult,
    mobile: mobileResult,
    events,
    fatalError,
    passed: overallPassed,
  };

  await writeArtifacts(outDir, logLines, networkEntries, summary);

  console.log(`[triage] output: ${outDir}`);
  console.log(`[triage] desktop: ${desktopPassed ? "PASS" : "FAIL"}`);
  console.log(`[triage] mobile: ${mobilePassed ? "PASS" : "FAIL"}`);

  if (!overallPassed) {
    process.exitCode = 1;
  }
}

main().catch(async (err) => {
  const outDir = await ensureOutputDir();
  const message = err instanceof Error ? err.stack || err.message : String(err);
  await fs.writeFile(path.join(outDir, "console.log"), `[${new Date().toISOString()}] Fatal bootstrap error: ${message}\n`, "utf8");
  await fs.writeFile(path.join(outDir, "network.json"), JSON.stringify({ summary: { fatalError: message }, requests: [] }, null, 2), "utf8");
  console.error(message);
  process.exit(1);
});
