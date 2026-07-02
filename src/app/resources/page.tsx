import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { SeoFaq } from "@/components/SeoFaq";

type ResourceDoc = {
  slug: string;
  title: string;
  summary: string;
  html: string;
};

const contentDir = path.join(process.cwd(), "content/resources");

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInline(text: string) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (_match, label, url) => {
      if (!url.startsWith("/") && !url.startsWith("http")) return label;
      return `<a href="${url}">${label}</a>`;
    });
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (!inList || listItems.length === 0) return;
    blocks.push(`<${inList}>${listItems.join("")}</${inList}>`);
    inList = null;
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(`<h1>${formatInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (inList && inList !== "ol") flushList();
      inList = "ol";
      listItems.push(`<li>${formatInline(orderedMatch[2])}</li>`);
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (inList && inList !== "ul") flushList();
      inList = "ul";
      listItems.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    flushList();
    blocks.push(`<p>${formatInline(trimmed)}</p>`);
  }

  flushList();
  return blocks.join("");
}

async function loadResources(): Promise<ResourceDoc[]> {
  const entries = await readdir(contentDir);
  const files = entries.filter((file) => file.endsWith(".md"));

  const docs = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = await readFile(path.join(contentDir, file), "utf8");
      const lines = raw.split("\n");
      const titleLine = lines.find((line) => line.trim().startsWith("# "));
      const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : slug.replace(/-/g, " ");
      const summaryLine = lines.find((line) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-") && !trimmed.startsWith("*");
      });
      const summary = summaryLine ? summaryLine.trim() : "Education-first overview.";
      const contentLines = [...lines];
      const headingIndex = contentLines.findIndex((line) => line.trim().startsWith("# "));
      if (headingIndex !== -1) {
        contentLines.splice(headingIndex, 1);
      }
      const html = markdownToHtml(contentLines.join("\n"));

      return { slug, title, summary, html };
    }),
  );

  return docs.sort((a, b) => a.title.localeCompare(b.title));
}

export default async function ResourcesPage() {
  const resources = await loadResources();
  return (
    <>
      <PremiumInteriorHero
        eyebrow="Resources"
        title="Client Education Hub"
        subtitle="Clear primers, checklists, and step-by-step guidance for Florida residents seeking neutral explanations and next steps."
        actions={[
          { label: "Medicare Guidance", href: "/medicare", kind: "primary" },
          { label: "ACA Marketplace", href: "/aca", kind: "gold" },
          { label: "Request a Call", href: "/contact", kind: "light" },
        ]}
      >
        <PremiumDisclosure>
          Resource content is education only. Plan-specific guidance is handled by a licensed agent with applicable
          disclosures and scope controls.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/medicare">Medicare guidance</Link>
        <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/aca">ACA Marketplace</Link>
        <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/ichra">ICHRA</Link>
        <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/off-exchange">Off-exchange</Link>
        <Link className="font-bold text-[var(--ve-teal)] underline underline-offset-4" href="/small-group">Small group</Link>
      </div>

      <div className="mt-10 grid gap-8">
        {resources.map((item) => (
          <section key={item.slug} id={item.slug} className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-normal text-[var(--ve-teal)]">{item.title}</h2>
                <p className="mt-2 font-sans text-sm leading-6 text-slate-700">{item.summary}</p>
              </div>
              <a
                href={`/resources#${item.slug}`}
                className="text-xs font-bold text-[var(--ve-teal)] underline underline-offset-4"
              >
                Link
              </a>
            </div>
            <div
              className="resource-content mt-4"
              dangerouslySetInnerHTML={{ __html: item.html }}
            />
          </section>
        ))}
      </div>

      <div className="mt-10">
        <SeoFaq
          items={[
            {
              question: "How should I use these resources?",
              answer:
                "Start with the topic that matches your coverage question, then bring the checklist to your call or chat. We focus on education and next steps.",
            },
            {
              question: "Do you recommend specific plans here?",
              answer:
                "No. This hub is education-only. Plan-specific guidance is handled by a licensed agent.",
            },
            {
              question: "What information is most helpful to have ready?",
              answer:
                "ZIP code, current coverage status, key dates, and your preferred contact method.",
            },
            {
              question: "Do you help with Medicare plan-specific guidance?",
              answer:
                "Medicare plan-specific discussions require a call and the required TPMO disclaimer. We can help you schedule the next step.",
            },
          ]}
          title="Resource questions"
        />
      </div>
    </Container>
    </>
  );
}
