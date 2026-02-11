#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const DEFAULT_A = "https://www.merebenefits.com/";
const DEFAULT_B = process.env.BASE_URL || "https://vital-edge-insurance.vercel.app/";

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

function parseArgs(argv) {
  const parsed = {
    a: DEFAULT_A,
    b: DEFAULT_B,
    out: path.join(process.cwd(), "outputs", "merebenefits-compare"),
    timeoutMs: 45_000,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--a" && argv[i + 1]) {
      parsed.a = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--b" && argv[i + 1]) {
      parsed.b = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--out" && argv[i + 1]) {
      parsed.out = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--timeoutMs" && argv[i + 1]) {
      const n = Number.parseInt(argv[i + 1], 10);
      if (Number.isFinite(n) && n > 0) parsed.timeoutMs = n;
      i += 1;
    }
  }
  return parsed;
}

function normalize(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

async function gotoWithFallback(page, url) {
  try {
    return await page.goto(url, { waitUntil: "networkidle" });
  } catch {
    return page.goto(url, { waitUntil: "domcontentloaded" });
  }
}

function safeJoin(base, route) {
  return `${base.replace(/\/+$/, "")}${route.startsWith("/") ? route : `/${route}`}`;
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const forbidden = [
      "lead",
      "compute tpmo",
      "tpmo counts",
      "handled by patrick",
      "patrick only",
      "route to patrick",
      "directly to patrick",
    ];

    const isVisible = (el) => {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const text = (document.body?.innerText || "").toLowerCase();

    const header = document.querySelector("header");
    const headerLinks = header ? [...header.querySelectorAll("a")].filter(isVisible).length : 0;

    const aboveFoldCtas = [...document.querySelectorAll("a,button")].filter((el) => {
      if (!isVisible(el)) return false;
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) return false;
      const label = (el.textContent || "").toLowerCase();
      return /(get|request|contact|call|schedule|chat|help|enroll)/.test(label);
    }).length;

    const disclosureEl = document.querySelector(".bottom-fine-print");
    const disclosurePresent = Boolean(disclosureEl) || text.includes("we do not offer every plan available in your area");
    const disclosureVisibleWithoutScroll = Boolean(
      disclosureEl &&
        disclosureEl.getBoundingClientRect().top < window.innerHeight &&
        disclosureEl.getBoundingClientRect().bottom > 0,
    );

    const firstForm = document.querySelector("form");
    const formInputCount = firstForm ? firstForm.querySelectorAll("input,select,textarea").length : 0;
    const formLabelCount = firstForm ? firstForm.querySelectorAll("label").length : 0;
    const consentGroupCount = firstForm
      ? [...firstForm.querySelectorAll("label")].filter((label) => /consent|agree|permission/i.test(label.textContent || "")).length
      : 0;

    const internalOpsLeakCount = forbidden.reduce((count, term) => {
      const matcher = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      return count + (text.match(matcher)?.length || 0);
    }, 0);

    const internalJargonInForm = firstForm
      ? /lead|tpmo|compute|route/i.test(firstForm.innerText || "")
      : false;

    return {
      headerLinks,
      aboveFoldCtas,
      disclosurePresent,
      disclosureVisibleWithoutScroll,
      formInputCount,
      formLabelCount,
      consentGroupCount,
      internalOpsLeakCount,
      internalJargonInForm,
    };
  });
}

function scoreClarity(metrics) {
  if (metrics.home.desktop.aboveFoldCtas <= 2 && metrics.home.mobile.headerLinks <= 7) return 2;
  if (metrics.home.desktop.aboveFoldCtas <= 4 && metrics.home.mobile.headerLinks <= 10) return 1;
  return 0;
}

function scoreCompliance(metrics) {
  const disclosure = metrics.request?.desktop?.disclosurePresent ?? metrics.home.desktop.disclosurePresent;
  const noLeak = (metrics.request?.desktop?.internalOpsLeakCount ?? metrics.home.desktop.internalOpsLeakCount) === 0;
  if (disclosure && noLeak) return 2;
  if (disclosure || noLeak) return 1;
  return 0;
}

function scoreOpsPrivacy(metrics) {
  const homeClean = metrics.home.desktop.internalOpsLeakCount === 0;
  const reqClean = (metrics.request?.desktop?.internalOpsLeakCount ?? 0) === 0;
  const noJargon = !(metrics.request?.desktop?.internalJargonInForm ?? false);
  if (homeClean && reqClean && noJargon) return 2;
  if ((homeClean && reqClean) || noJargon) return 1;
  return 0;
}

function scoreMobileDensity(metrics) {
  if (metrics.home.mobile.headerLinks <= 7 && metrics.home.mobile.aboveFoldCtas <= 2) return 2;
  if (metrics.home.mobile.headerLinks <= 10 && metrics.home.mobile.aboveFoldCtas <= 4) return 1;
  return 0;
}

function scoreDisclosureVisibility(metrics) {
  const requestVisible = metrics.request?.mobile?.disclosureVisibleWithoutScroll ?? metrics.home.mobile.disclosureVisibleWithoutScroll;
  if (requestVisible) return 2;
  const present = metrics.request?.mobile?.disclosurePresent ?? metrics.home.mobile.disclosurePresent;
  return present ? 1 : 0;
}

function markdownTableRow(cols) {
  return `| ${cols.join(" | ")} |`;
}

function buildReport({ aUrl, bUrl, metrics, screenshots }) {
  const lines = [];
  lines.push("# MereBenefits Structural Comparison");
  lines.push("");
  lines.push(`- Reference (A): ${aUrl}`);
  lines.push(`- Vital Edge (B): ${bUrl}`);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Rubric (0-2)");
  lines.push(markdownTableRow(["Criterion", "A Score", "B Score", "Notes"]));
  lines.push(markdownTableRow(["---", "---", "---", "---"]));
  lines.push(markdownTableRow(["Clarity", String(metrics.a.rubric.clarity), String(metrics.b.rubric.clarity), "Single CTA emphasis + low header clutter"]));
  lines.push(markdownTableRow(["Compliance posture", String(metrics.a.rubric.compliancePosture), String(metrics.b.rubric.compliancePosture), "Disclosure present + low prohibited language risk"]));
  lines.push(markdownTableRow(["Ops privacy", String(metrics.a.rubric.opsPrivacy), String(metrics.b.rubric.opsPrivacy), "No internal operations leakage in public surfaces"]));
  lines.push(markdownTableRow(["Mobile density", String(metrics.a.rubric.mobileDensity), String(metrics.b.rubric.mobileDensity), "Mobile header and CTA load"]));
  lines.push(markdownTableRow(["Disclosure visibility", String(metrics.a.rubric.disclosureVisibility), String(metrics.b.rubric.disclosureVisibility), "Visibility without scrolling on key page"]));
  lines.push("");
  lines.push("## Metrics");
  lines.push("```json");
  lines.push(JSON.stringify(metrics, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## Screenshot Artifacts");
  for (const shot of screenshots) lines.push(`- \`${shot}\``);
  lines.push("");
  lines.push("## Diff Summary");
  lines.push("- Compared structure and compliance UX signals only: header density, CTA load, disclosure visibility, form clarity, and internal-ops leakage.");
  lines.push("");
  lines.push("## Non-Copy Attestation");
  lines.push("This comparison is structural and compliance-oriented. No MereBenefits text, layouts, or proprietary phrasing were copied.");
  lines.push("");
  return lines.join("\n");
}

async function capturePage(context, { url, timeoutMs, screenshotPath }) {
  const page = await context.newPage();
  page.setDefaultTimeout(timeoutMs);
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "*{animation:none!important;transition:none!important;scroll-behavior:auto!important}";
    document.head.appendChild(style);
  });
  await gotoWithFallback(page, url);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const metrics = await collectMetrics(page);
  await page.close();
  return metrics;
}

async function captureSite(browser, { id, url, outDir, timeoutMs, requestPath }) {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const mobileContext = await browser.newContext({ ...devices["iPhone 12"], reducedMotion: "reduce" });

  const screenshots = [];
  const homeDesktopPath = path.join(outDir, `${id}_desktop.png`);
  const homeMobilePath = path.join(outDir, `${id}_mobile.png`);

  const homeDesktopMetrics = await capturePage(desktopContext, {
    url: normalize(url),
    timeoutMs,
    screenshotPath: homeDesktopPath,
  });
  const homeMobileMetrics = await capturePage(mobileContext, {
    url: normalize(url),
    timeoutMs,
    screenshotPath: homeMobilePath,
  });
  screenshots.push(homeDesktopPath, homeMobilePath);

  let requestDesktopMetrics = null;
  let requestMobileMetrics = null;
  if (requestPath) {
    const requestDesktopPath = path.join(outDir, `${id}_request_desktop.png`);
    const requestMobilePath = path.join(outDir, `${id}_request_mobile.png`);
    requestDesktopMetrics = await capturePage(desktopContext, {
      url: safeJoin(url, requestPath),
      timeoutMs,
      screenshotPath: requestDesktopPath,
    });
    requestMobileMetrics = await capturePage(mobileContext, {
      url: safeJoin(url, requestPath),
      timeoutMs,
      screenshotPath: requestMobilePath,
    });
    screenshots.push(requestDesktopPath, requestMobilePath);
  }

  await desktopContext.close();
  await mobileContext.close();

  const metrics = {
    home: {
      desktop: homeDesktopMetrics,
      mobile: homeMobileMetrics,
    },
    request: requestDesktopMetrics
      ? {
          desktop: requestDesktopMetrics,
          mobile: requestMobileMetrics,
        }
      : null,
  };

  return { metrics, screenshots };
}

async function main() {
  const args = parseArgs(process.argv);
  const outDir = path.join(args.out, timestamp());
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    const a = await captureSite(browser, {
      id: "merebenefits",
      url: args.a,
      outDir,
      timeoutMs: args.timeoutMs,
      requestPath: null,
    });
    const b = await captureSite(browser, {
      id: "vitaledge",
      url: args.b,
      outDir,
      timeoutMs: args.timeoutMs,
      requestPath: "/medicare/medicare-advantage-request",
    });

    const metrics = {
      a: {
        ...a.metrics,
        rubric: {
          clarity: scoreClarity(a.metrics),
          compliancePosture: scoreCompliance(a.metrics),
          opsPrivacy: scoreOpsPrivacy(a.metrics),
          mobileDensity: scoreMobileDensity(a.metrics),
          disclosureVisibility: scoreDisclosureVisibility(a.metrics),
        },
      },
      b: {
        ...b.metrics,
        rubric: {
          clarity: scoreClarity(b.metrics),
          compliancePosture: scoreCompliance(b.metrics),
          opsPrivacy: scoreOpsPrivacy(b.metrics),
          mobileDensity: scoreMobileDensity(b.metrics),
          disclosureVisibility: scoreDisclosureVisibility(b.metrics),
        },
      },
    };

    const screenshots = [...a.screenshots, ...b.screenshots].map((shot) => path.relative(process.cwd(), shot));

    await fs.writeFile(path.join(outDir, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`, "utf8");
    await fs.writeFile(path.join(outDir, "REPORT.md"), `${buildReport({ aUrl: args.a, bUrl: args.b, metrics, screenshots })}\n`, "utf8");

    console.log(`[merebenefits-compare] output: ${outDir}`);
    console.log("[merebenefits-compare] complete");
  } finally {
    await browser.close();
  }
}

main().catch(async (error) => {
  const out = path.join(process.cwd(), "outputs", "merebenefits-compare", timestamp());
  await fs.mkdir(out, { recursive: true });
  const message = error instanceof Error ? error.stack || error.message : String(error);
  await fs.writeFile(path.join(out, "REPORT.md"), `# MereBenefits Structural Comparison\n\nFailure:\n\n\`\`\`\n${message}\n\`\`\`\n`, "utf8");
  console.error(message);
  process.exit(1);
});
