#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import { chromium, devices } from "playwright";

const DEFAULT_BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ROUTE_EXPECTATIONS = [
  { route: "/", expected: [200] },
  { route: "/medicare", expected: [200] },
  { route: "/enroll", expected: [200] },
  { route: "/contact", expected: [200] },
  { route: "/medicare/medicare-advantage-request", expected: [200] },
  { route: "/medicare/medigap-request", expected: [200] },
  { route: "/medicare/ma-lead", expected: [200, 301, 302, 307, 308], redirectTo: "/medicare/medicare-advantage-request" },
  { route: "/medicare/medigap-lead", expected: [200, 301, 302, 307, 308], redirectTo: "/medicare/medigap-request" },
];

// Patrick Mackin IV is approved public professional identity for Vital Edge Insurance.
// The public site may intentionally show his name, headshot, bio, licensed agent role,
// NPN/license metadata, public business email/phone, and "Speak with Patrick" style copy.
const APPROVED_PUBLIC_PROFESSIONAL_IDENTITY = [
  "Patrick",
  "Patrick Mackin IV",
  "Licensed Health Insurance Agent",
  "Licensed Health, Life and Annuities Insurance Agent",
];

const SENSITIVE_EXPOSURE_BLOCKLIST = [
  { label: "legacy internal MA lead submission wording", pattern: /submit ma lead/i },
  { label: "legacy internal Medigap lead submission wording", pattern: /submit medigap lead/i },
  { label: "internal TPMO computation wording", pattern: /compute tpmo/i },
  { label: "internal TPMO counts wording", pattern: /tpmo counts/i },
  { label: "internal owner-only routing wording", pattern: /handled by patrick/i },
  { label: "internal owner-only routing wording", pattern: /patrick only/i },
  { label: "internal owner-only routing wording", pattern: /route to patrick/i },
  { label: "internal owner-only routing wording", pattern: /directly to patrick/i },
  { label: "Agent Boost internal program reference", pattern: /\bAgent Boost\b/i },
  { label: "unapproved FMO/internal hierarchy reference", pattern: /\bFMO\b/i },
  {
    label: "Social Security number value",
    pattern: /\b(?:\d{3}[- ]\d{2}[- ]\d{4}|(?:ssn|social security(?: number)?)\s*[:=]?\s*\d{9})\b/i,
  },
  {
    label: "Medicare Beneficiary Identifier value",
    pattern: /\b[1-9][ACDEFGHJKMNPQRTUVWXY]{2}[- ]?\d[ACDEFGHJKMNPQRTUVWXY]{2}[- ]?\d[ACDEFGHJKMNPQRTUVWXY]{2}[- ]?\d{2}\b/i,
  },
  {
    label: "OpenAI/API key-like value",
    pattern: /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{20,}|(?:pk|rk)_[A-Za-z0-9]{20,})\b/,
  },
  {
    label: "secret/token assignment with concrete value",
    pattern: /\b(?:api[_-]?key|secret|token|access[_-]?token|refresh[_-]?token|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_.+/=-]{16,}["']?/i,
  },
  {
    label: "bank account/routing value",
    pattern: /\b(?:bank\s+account|routing|account)\s*(?:number|#)?\s*[:=]\s*\d{6,17}\b/i,
  },
  {
    label: "IBAN/SWIFT value",
    pattern: /\b(?:iban|swift)\s*[:=]\s*[A-Z0-9]{8,34}\b/i,
  },
  {
    label: "private/internal note marker",
    pattern: /\b(?:private note|internal note|agent note|staff note|ops note)\s*[:=]/i,
  },
  {
    label: "client DOB value",
    pattern: /\b(?:date of birth|dob)\s*[:=]\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/i,
  },
  {
    label: "client medical/Medicare detail marker",
    pattern: /\b(?:client|member|lead)\s+(?:medical|medicare|health|diagnosis|prescription|medication)\s+(?:notes?|details?|data)\s*[:=]/i,
  },
  {
    label: "unpublished/private client data marker",
    pattern: /\b(?:unpublished client data|private client data|internal client data|client data\s*[:=])/i,
  },
];

const SOURCE_BLOCKLIST = SENSITIVE_EXPOSURE_BLOCKLIST;
const RENDER_BLOCKLIST = [
  { label: "public lead-system wording", pattern: /\bleads?\b/i },
  ...SENSITIVE_EXPOSURE_BLOCKLIST,
];

function parseArgs(argv) {
  const parsed = {
    baseUrl: DEFAULT_BASE_URL,
    outDir: "",
    timeoutMs: 45_000,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--baseUrl" && argv[i + 1]) {
      parsed.baseUrl = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--outDir" && argv[i + 1]) {
      parsed.outDir = argv[i + 1];
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

function fullUrl(baseUrl, route) {
  return `${baseUrl.replace(/\/+$/, "")}${route}`;
}

async function listFiles(dir, out = []) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await listFiles(absolute, out);
      continue;
    }
    out.push(absolute);
  }
  return out;
}

function isPublicRenderFile(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  if (!normalized.endsWith(".ts") && !normalized.endsWith(".tsx")) return false;
  if (normalized.includes("/src/app/api/")) return false;
  if (normalized.includes("/src/app/admin/")) return false;
  if (normalized.includes("/src/app/medicare/ma-lead/")) return false;
  if (normalized.includes("/src/app/medicare/medigap-lead/")) return false;
  return normalized.includes("/src/app/") || normalized.includes("/src/components/") || normalized.endsWith("/src/lib/site.ts") || normalized.endsWith("/src/app/layout.tsx");
}

function countMatches(text, patterns) {
  const hits = [];
  for (const entry of patterns) {
    entry.pattern.lastIndex = 0;
    if (entry.pattern.test(text)) hits.push(entry.label);
  }
  return hits;
}

function toPt(px) {
  if (!Number.isFinite(px)) return 0;
  return (px * 72) / 96;
}

function runGrep() {
  try {
    const output = execSync(
      String.raw`rg -n --hidden -S "submit ma lead|submit medigap lead|compute tpmo|tpmo counts|handled by patrick|patrick only|route to patrick|directly to patrick|Agent Boost|FMO|private note|internal note|agent note|staff note|ops note|unpublished client data|private client data|internal client data" src/app src/components src/lib/site.ts src/app/layout.tsx || true`,
      { encoding: "utf8" },
    );
    return output.trim();
  } catch {
    return "";
  }
}

function collectDiffSnippets() {
  const parseSnippets = (diffText) => {
    const snippets = [];
    let currentFile = "";
    for (const line of diffText.split("\n")) {
      if (line.startsWith("diff --git")) {
        const match = line.match(/ b\/(.+)$/);
        currentFile = match ? match[1] : "";
        continue;
      }
      if (!currentFile) continue;
      if (line.startsWith("---") || line.startsWith("+++")) continue;
      if (line.startsWith("-") || line.startsWith("+")) {
        const text = line.slice(1).trim();
        if (!text) continue;
        if (!/[A-Za-z]/.test(text)) continue;
        snippets.push({ file: currentFile, type: line.startsWith("-") ? "before" : "after", text });
      }
    }
    return snippets;
  };

  try {
    const diff = execSync("git diff --unified=0 -- src/app src/components src/lib/site.ts src/app/layout.tsx", {
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    const workingTreeSnippets = parseSnippets(diff);
    if (workingTreeSnippets.length > 0) return workingTreeSnippets;
  } catch {
    // fall through to commit-history extraction
  }

  try {
    const historyDiff = execSync(
      "git show --pretty=format: --unified=0 HEAD~3..HEAD -- src/app src/components src/lib/site.ts src/app/layout.tsx",
      { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
    );
    return parseSnippets(historyDiff);
  } catch {
    return [];
  }
}

function buildReportMarkdown(result) {
  const lines = [];
  lines.push("# Public Exposure Audit Report");
  lines.push("");
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Base URL: ${result.baseUrl}`);
  lines.push(`- Overall: ${result.passed ? "PASS" : "FAIL"}`);
  lines.push("");
  lines.push("## Repro Commands");
  lines.push("```bash");
  lines.push(`node scripts/ops/public-exposure-audit.mjs --baseUrl ${result.baseUrl}`);
  lines.push(String.raw`rg -n --hidden -S "submit ma lead|submit medigap lead|compute tpmo|tpmo counts|handled by patrick|patrick only|route to patrick|directly to patrick|Agent Boost|FMO|private note|internal note|agent note|staff note|ops note|unpublished client data|private client data|internal client data" src/app src/components src/lib/site.ts src/app/layout.tsx`);
  lines.push("```");
  lines.push("");
  lines.push("## Approved Public Professional Identity");
  lines.push(
    "- Patrick Mackin IV and related licensed-agent identity are approved public professional identity for Vital Edge Insurance.",
  );
  lines.push(`- Allowed identity references: ${result.approvedPublicProfessionalIdentity.join(", ")}`);
  lines.push("");
  lines.push("## Pass/Fail Matrix");
  lines.push(`- Source sensitive exposure scan: ${result.sourceScan.passed ? "PASS" : "FAIL"} (${result.sourceScan.totalHits} hits)`);
  lines.push(`- Rendered sensitive exposure scan: ${result.renderScan.passed ? "PASS" : "FAIL"} (${result.renderScan.totalHits} hits)`);
  lines.push(`- Route probe (status expectations): ${result.routeProbe.passed ? "PASS" : "FAIL"}`);
  lines.push(`- Nav excludes legacy lead routes: ${result.navPolicy.passed ? "PASS" : "FAIL"}`);
  lines.push(`- Canonical URLs exclude lead wording: ${result.canonicalPolicy.passed ? "PASS" : "FAIL"}`);
  lines.push(`- Footer disclosure present once on desktop: ${result.disclosureScan.desktop.presentOnce ? "PASS" : "FAIL"}`);
  lines.push(`- Footer disclosure font >=14pt desktop: ${result.disclosureScan.desktop.fontPass ? "PASS" : "FAIL"} (${result.disclosureScan.desktop.fontPt.toFixed(2)}pt)`);
  lines.push(`- Footer disclosure font >=14pt mobile: ${result.disclosureScan.mobile.fontPass ? "PASS" : "FAIL"} (${result.disclosureScan.mobile.fontPt.toFixed(2)}pt)`);
  lines.push("");
  lines.push("## Route Probe");
  for (const route of result.routeProbe.routes) {
    lines.push(`- ${route.route}: ${route.status} -> ${route.finalPath} (expected ${route.expected.join(",")}${route.redirectTo ? ` and final ${route.redirectTo}` : ""})`);
  }
  lines.push("");
  lines.push("## Rendered DOM Sensitive Exposure Scan");
  if (result.renderScan.hits.length === 0) {
    lines.push("- PASS: no sensitive exposure patterns detected in rendered public DOM.");
  } else {
    for (const hit of result.renderScan.hits) {
      lines.push(`- ${hit.route}: ${hit.pattern}`);
    }
  }
  lines.push("");
  lines.push("## Grep Report");
  lines.push("```text");
  lines.push(result.grepReport || "(no matches)");
  lines.push("```");
  lines.push("");
  lines.push("## Before/After Snippets (Public String Changes)");
  if (result.diffSnippets.length === 0) {
    lines.push("- No diff snippets captured.");
  } else {
    const grouped = new Map();
    for (const snippet of result.diffSnippets) {
      if (!grouped.has(snippet.file)) grouped.set(snippet.file, []);
      grouped.get(snippet.file).push(snippet);
    }
    for (const [file, snippets] of grouped.entries()) {
      lines.push(`### ${file}`);
      for (const snippet of snippets.slice(0, 20)) {
        lines.push(`- ${snippet.type === "before" ? "before" : "after"}: ${snippet.text}`);
      }
      if (snippets.length > 20) {
        lines.push(`- ... ${snippets.length - 20} more lines omitted`);
      }
      lines.push("");
    }
  }
  lines.push("## Screenshots");
  for (const filePath of result.screenshots) {
    lines.push(`- \`${filePath}\``);
  }
  lines.push("");
  lines.push("## Final Exposure Verdict");
  lines.push(`- Remaining occurrences of blocked strings on public rendered pages: ${result.renderScan.totalHits}`);
  lines.push(`- Remaining occurrences of sensitive exposure patterns in public render files: ${result.sourceScan.totalHits}`);
  lines.push("");
  return lines.join("\n");
}

async function gotoWithFallback(page, url) {
  try {
    return await page.goto(url, { waitUntil: "networkidle" });
  } catch {
    return page.goto(url, { waitUntil: "domcontentloaded" });
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const outDir = args.outDir || path.join(process.cwd(), "outputs", "public-exposure", timestamp());
  const baselineDir = path.join(outDir, "baseline");
  const screenshotDir = path.join(outDir, "screenshots");
  await fs.mkdir(baselineDir, { recursive: true });
  await fs.mkdir(screenshotDir, { recursive: true });

  const allFiles = await listFiles(path.join(process.cwd(), "src"));
  const publicFiles = allFiles.filter(isPublicRenderFile);
  const sourceHits = [];
  for (const filePath of publicFiles) {
    const text = await fs.readFile(filePath, "utf8");
    const hits = countMatches(text, SOURCE_BLOCKLIST);
    if (hits.length > 0) {
      sourceHits.push({
        file: path.relative(process.cwd(), filePath),
        hits,
      });
    }
  }

  const routeStatuses = [];
  const renderHits = [];
  const canonicalViolations = [];
  const screenshots = [];
  let navContainsLegacy = false;

  const browser = await chromium.launch({ headless: true });
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const mobileContext = await browser.newContext({
    ...devices["iPhone 12"],
    reducedMotion: "reduce",
  });
  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();
  desktopPage.setDefaultTimeout(args.timeoutMs);
  mobilePage.setDefaultTimeout(args.timeoutMs);

  let desktopDisclosure = { presentOnce: false, fontPt: 0, fontPass: false, visibleWithoutScroll: false };
  let mobileDisclosure = { presentOnce: false, fontPt: 0, fontPass: false, visibleWithoutScroll: false };

  try {
    for (const routeConfig of ROUTE_EXPECTATIONS) {
      const response = await gotoWithFallback(desktopPage, fullUrl(args.baseUrl, routeConfig.route));
      const status = response?.status() ?? 0;
      const finalPath = new URL(desktopPage.url()).pathname;
      const redirectPass = routeConfig.redirectTo ? finalPath === routeConfig.redirectTo : true;
      routeStatuses.push({
        route: routeConfig.route,
        status,
        expected: routeConfig.expected,
        redirectTo: routeConfig.redirectTo || null,
        finalPath,
        pass: routeConfig.expected.includes(status) && redirectPass,
      });

      const shotPath = path.join(
        screenshotDir,
        `${routeConfig.route === "/" ? "home" : routeConfig.route.slice(1).replaceAll("/", "_")}.png`,
      );
      await desktopPage.screenshot({ path: shotPath, fullPage: true });
      screenshots.push(path.relative(process.cwd(), shotPath));

      const bodyText = await desktopPage.evaluate(() => document.body.innerText || "");
      for (const entry of RENDER_BLOCKLIST) {
        entry.pattern.lastIndex = 0;
        if (entry.pattern.test(bodyText)) {
          renderHits.push({ route: routeConfig.route, pattern: entry.label });
        }
      }

      const canonical = await desktopPage.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");
      if (/lead/i.test(canonical)) {
        canonicalViolations.push({ route: routeConfig.route, canonical });
      }

      if (routeConfig.route === "/") {
        const navCheck = await desktopPage.evaluate(() => {
          const hrefs = [...document.querySelectorAll("header nav a, header a")]
            .map((el) => (el instanceof HTMLAnchorElement ? el.getAttribute("href") || "" : ""))
            .filter(Boolean);
          return hrefs.some((href) => href.includes("/medicare/ma-lead") || href.includes("/medicare/medigap-lead"));
        });
        navContainsLegacy = navCheck;

        const disclosure = await desktopPage.evaluate(() => {
          const els = [...document.querySelectorAll(".bottom-fine-print")];
          if (els.length !== 1) return { presentOnce: false, px: 0, visibleWithoutScroll: false };
          const el = els[0];
          const fontPx = Number.parseFloat(window.getComputedStyle(el).fontSize || "0");
          const rect = el.getBoundingClientRect();
          return {
            presentOnce: true,
            px: fontPx,
            visibleWithoutScroll: rect.top < window.innerHeight && rect.bottom > 0,
          };
        });

        desktopDisclosure = {
          presentOnce: disclosure.presentOnce,
          fontPt: toPt(disclosure.px),
          fontPass: disclosure.presentOnce && toPt(disclosure.px) >= 14,
          visibleWithoutScroll: disclosure.visibleWithoutScroll,
        };

        await gotoWithFallback(mobilePage, fullUrl(args.baseUrl, "/"));
        const mobileShot = path.join(screenshotDir, "home_mobile.png");
        await mobilePage.screenshot({ path: mobileShot, fullPage: true });
        screenshots.push(path.relative(process.cwd(), mobileShot));

        const mobileDisclosureEval = await mobilePage.evaluate(() => {
          const els = [...document.querySelectorAll(".bottom-fine-print")];
          if (els.length !== 1) return { presentOnce: false, px: 0, visibleWithoutScroll: false };
          const el = els[0];
          const fontPx = Number.parseFloat(window.getComputedStyle(el).fontSize || "0");
          const rect = el.getBoundingClientRect();
          return {
            presentOnce: true,
            px: fontPx,
            visibleWithoutScroll: rect.top < window.innerHeight && rect.bottom > 0,
          };
        });
        mobileDisclosure = {
          presentOnce: mobileDisclosureEval.presentOnce,
          fontPt: toPt(mobileDisclosureEval.px),
          fontPass: mobileDisclosureEval.presentOnce && toPt(mobileDisclosureEval.px) >= 14,
          visibleWithoutScroll: mobileDisclosureEval.visibleWithoutScroll,
        };
      }
    }
  } finally {
    await desktopContext.close();
    await mobileContext.close();
    await browser.close();
  }

  const sourceScan = {
    passed: sourceHits.length === 0,
    totalHits: sourceHits.length,
    hits: sourceHits,
  };
  const renderScan = {
    passed: renderHits.length === 0,
    totalHits: renderHits.length,
    hits: renderHits,
  };
  const routeProbe = {
    passed: routeStatuses.every((item) => item.pass),
    routes: routeStatuses,
  };
  const disclosureScan = {
    desktop: desktopDisclosure,
    mobile: mobileDisclosure,
  };
  const navPolicy = {
    passed: !navContainsLegacy,
    navContainsLegacy,
  };
  const canonicalPolicy = {
    passed: canonicalViolations.length === 0,
    violations: canonicalViolations,
  };

  const grepReport = runGrep();
  const diffSnippets = collectDiffSnippets();

  const result = {
    baseUrl: args.baseUrl,
    approvedPublicProfessionalIdentity: APPROVED_PUBLIC_PROFESSIONAL_IDENTITY,
    passed:
      sourceScan.passed &&
      renderScan.passed &&
      routeProbe.passed &&
      navPolicy.passed &&
      canonicalPolicy.passed &&
      disclosureScan.desktop.fontPass &&
      disclosureScan.mobile.fontPass &&
      disclosureScan.desktop.presentOnce &&
      disclosureScan.mobile.presentOnce,
    sourceScan,
    renderScan,
    routeProbe,
    navPolicy,
    canonicalPolicy,
    disclosureScan,
    grepReport,
    diffSnippets,
    screenshots,
  };

  const reportPath = path.join(outDir, "REPORT.md");
  await fs.writeFile(path.join(outDir, "result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(baselineDir, "source-scan.json"), `${JSON.stringify(sourceScan, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(baselineDir, "render-scan.json"), `${JSON.stringify(renderScan, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(baselineDir, "route-probe.json"), `${JSON.stringify(routeProbe, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(baselineDir, "disclosure-font.json"), `${JSON.stringify(disclosureScan, null, 2)}\n`, "utf8");
  await fs.writeFile(reportPath, `${buildReportMarkdown(result)}\n`, "utf8");

  console.log(`[public-exposure-audit] output: ${outDir}`);
  console.log(`[public-exposure-audit] overall: ${result.passed ? "PASS" : "FAIL"}`);
  if (!result.passed) process.exitCode = 1;
}

main().catch(async (error) => {
  const outDir = path.join(process.cwd(), "outputs", "public-exposure", timestamp());
  await fs.mkdir(outDir, { recursive: true });
  const message = error instanceof Error ? error.stack || error.message : String(error);
  await fs.writeFile(path.join(outDir, "REPORT.md"), `# Public Exposure Audit Report\n\nFailure:\n\n\`\`\`\n${message}\n\`\`\`\n`, "utf8");
  console.error(message);
  process.exit(1);
});
