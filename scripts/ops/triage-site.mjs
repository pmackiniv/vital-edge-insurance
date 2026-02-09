#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const DEFAULT_TIMEOUT_MS = 45_000;
const CHAT_TEXT = "Hello from automated triage.";
const CHAT_PLACEHOLDER_SNIPPET = "What is Part D";
const MOBILE_LINK_LABELS = ["Services", "Enroll", "Resources", "Contact", "Get help now"];

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

    const chatLauncher = page.getByRole("button", { name: /Chat with a licensed agent now/i });
    if (await chatLauncher.count()) {
      const launcher = chatLauncher.first();
      if (await launcher.isVisible()) {
        await launcher.click();
      }
    }

    const askQuestion = page.getByRole("button", { name: /Ask a question/i });
    if (await askQuestion.count()) {
      const askButton = askQuestion.first();
      if (await askButton.isVisible()) {
        await askButton.click();
      }
    }

    let chatInput = page.getByPlaceholder(new RegExp(CHAT_PLACEHOLDER_SNIPPET, "i")).first();
    if (!(await chatInput.count())) {
      chatInput = page.locator("textarea").first();
    }
    if (!(await chatInput.isVisible()) || !(await chatInput.isEnabled())) {
      throw new Error("No visible and enabled chat textarea found.");
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
    result.passed = chatResponse.status() === 200;

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
}) {
  const result = {
    passed: false,
    attempts: [],
    routeChangedCount: 0,
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
        error: null,
      };
      try {
        const toggle = page.getByRole("button", { name: /Toggle navigation/i }).first();
        if (await toggle.count()) {
          if (await toggle.isVisible()) {
            await toggle.click();
          }
        }

        const link = page.getByRole("link", { name: new RegExp(label, "i") }).first();
        attempt.visible = await link.isVisible();
        if (!attempt.visible) {
          throw new Error(`Link not visible: ${label}`);
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
      result.attempts.push(attempt);
    }

    result.passed = result.routeChangedCount > 0;
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
  await fs.writeFile(networkPath, `${JSON.stringify({ summary, requests: networkEntries }, null, 2)}\n`, "utf8");
}

async function main() {
  const args = parseArgs(process.argv);
  const outDir = await ensureOutputDir();
  const logLines = [];
  const networkEntries = [];
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
