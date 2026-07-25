"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { site } from "@/lib/site";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

type AIChatPanelProps = {
  onPatrickHandoffNeeded?: (question?: string) => void;
  displayMode?: "page" | "widget";
};

function isChatUnavailableError(message: string | undefined): boolean {
  if (!message) return false;
  if (message.includes("CHAT_UNAVAILABLE")) return true;
  if (message.includes("OPENAI_API_KEY")) return true;
  if (message.includes("503")) return true;

  try {
    const parsed = JSON.parse(message) as { error?: string };
    return parsed.error === "CHAT_UNAVAILABLE";
  } catch {
    return false;
  }
}

function needsPatrickHandoff(message: string): boolean {
  const normalized = message.toLowerCase();
  const hasMedicareContext =
    /\b(cms|medicare|medicare advantage|part d|medigap|medicare supplement|d-snp|c-snp|dsnp|csnp|snp|special needs|dual eligible)\b/.test(normalized);
  const asksForPlanSpecificHelp =
    /\b(best|recommend|which|compare|carrier|choose|provider|doctor|network|drug|formulary|premium|cost|copay|benefit|available|availability|zip|county|eligib|qualif|enroll|diabetes|condition|medicaid)\b/.test(normalized);
  return hasMedicareContext && asksForPlanSpecificHelp;
}

function cleanInlineText(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/^#{1,6}\s*/, "")
    .trim();
}

function parseBullet(line: string) {
  const match = line.match(/^((?:[-*])|(?:\d+[.)]))\s+(.+)$/);
  return match ? cleanInlineText(match[2]) : null;
}

function looksLikeHeading(line: string) {
  const cleaned = cleanInlineText(line).replace(/:$/, "");
  return cleaned.length > 0 && cleaned.length <= 56 && !/[.!?]$/.test(cleaned);
}

function FormattedMessageText({ text }: { text: string }) {
  const blocks = text
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const bulletItems = lines.map(parseBullet);
        const allBullets = bulletItems.length > 0 && bulletItems.every(Boolean);
        const heading = lines.length > 1 && looksLikeHeading(lines[0]) ? cleanInlineText(lines[0]) : "";
        const bulletsAfterHeading = heading ? lines.slice(1).map(parseBullet) : [];

        if (allBullets) {
          return (
            <ul key={`${block}-${blockIndex}`} className="list-disc space-y-1.5 pl-5">
              {bulletItems.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (heading && bulletsAfterHeading.length > 0 && bulletsAfterHeading.every(Boolean)) {
          return (
            <div key={`${block}-${blockIndex}`} className="space-y-1.5">
              <p className="font-extrabold text-[var(--ve-teal)]">{heading}</p>
              <ul className="list-disc space-y-1.5 pl-5">
                {bulletsAfterHeading.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }

        if (lines.length === 1 && looksLikeHeading(lines[0])) {
          return (
            <p key={`${block}-${blockIndex}`} className="font-extrabold text-[var(--ve-teal)]">
              {cleanInlineText(lines[0])}
            </p>
          );
        }

        return (
          <p key={`${block}-${blockIndex}`} className="whitespace-pre-line">
            {lines.map(cleanInlineText).join("\n")}
          </p>
        );
      })}
    </div>
  );
}

export function AIChatPanel({ onPatrickHandoffNeeded, displayMode = "page" }: AIChatPanelProps = {}) {
  const [input, setInput] = useState("");
  const [handoffNotice, setHandoffNotice] = useState("");
  const [clientReady, setClientReady] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    id: "vital-edge-ai-chat",
    transport: chatTransport,
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setClientReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    transcript.scrollTo({
      top: transcript.scrollHeight,
      behavior: reduceMotion || status === "streaming" ? "auto" : "smooth",
    });
  }, [messages, status]);

  const isDisabled = !clientReady || status === "streaming" || status === "submitted";
  const chatUnavailable = isChatUnavailableError(error?.message);
  const isWidget = displayMode === "widget";

  const submitText = (value: string) => {
    const text = value.trim();
    if (!text || isDisabled) return;
    setInput("");
    if (needsPatrickHandoff(text)) {
      onPatrickHandoffNeeded?.(text);
      setHandoffNotice(
        "This question needs licensed-agent follow-up after required disclosures and scope steps. Vital Guide is opening the callback form so Patrick Mackin IV can respond.",
      );
      return;
    }
    sendMessage({ text });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formText = formData.get("message");
    submitText(typeof formText === "string" ? formText : input);
  };

  const showError = Boolean(error) || status === "error";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {!isWidget ? (
        <div className="shrink-0">
          <div className="text-base font-extrabold text-[var(--ve-teal)]">Vital Guide</div>
          <p className="mt-1 text-sm leading-6 text-black/68">
            Ask general education questions about Medicare, ACA, coverage timing, and next steps. For Medicare
            plan-specific questions, carrier comparisons, provider or drug checks, enrollment recommendations, SNP
            eligibility decisions, or plan availability, request a call with Patrick Mackin IV after required disclosures
            and scope steps. Call or text {site.phoneDisplay},{" "}
            <Link href="/schedule" className="font-medium text-[var(--brand-blue)] underline hover:no-underline">
              schedule a call
            </Link>
            .
          </p>
        </div>
      ) : null}

      {showError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {chatUnavailable
            ? "Chat is temporarily unavailable. Call/text (352) 214-8879 or request a callback."
            : "Chat is temporarily unavailable. Use the contact form or call."}
        </div>
      ) : null}

      {handoffNotice ? (
        <div className="rounded-xl border border-[var(--ve-gold)]/35 bg-[var(--ve-gold)]/10 p-3 text-xs leading-5 text-slate-800">
          {handoffNotice}
        </div>
      ) : null}

      <div
        ref={transcriptRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Vital Guide conversation"
        className={`flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain rounded-2xl border border-[var(--ve-teal)]/12 [scrollbar-gutter:stable] ${
        isWidget
          ? "bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:p-5"
          : "bg-[linear-gradient(180deg,#ffffff_0%,#eef7f7_100%)] p-3"
      }`}
      >
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-[var(--ve-teal)]/10 bg-white/86 p-4 text-sm leading-6 text-slate-700">
            <p className="font-bold text-[var(--ve-teal)]">Ask a coverage question.</p>
            <p className="mt-1">
              Vital Guide can explain general Medicare, ACA, coverage timing, and preparation steps.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const text = (m.parts ?? [])
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            return (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-3.5 text-base leading-6 shadow-sm sm:leading-7 ${
                  m.role === "user"
                    ? "max-w-[86%] bg-[var(--brand-blue)]/12 text-slate-950"
                    : "w-full border border-[var(--ve-teal)]/10 bg-white/95 text-slate-900"
                }`}
                >
                  <span className="block text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-slate-500">
                    {m.role === "user" ? "You" : "Vital Guide"}
                  </span>
                  <div className="mt-2">
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <FormattedMessageText text={text} />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {status === "streaming" ? (
          <div className="flex w-fit items-center gap-2 rounded-xl border border-[var(--ve-teal)]/10 bg-white/85 px-3 py-2.5 text-xs text-slate-600">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-black/40" />
            <span>Vital Guide is typing...</span>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex shrink-0 flex-col gap-2 rounded-2xl border border-[var(--ve-teal)]/10 ${
          isWidget ? "bg-white/78 p-3 shadow-sm" : "bg-white/70 p-3"
        }`}
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            name="message"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a coverage question"
            rows={2}
            className={`w-full resize-none rounded-xl border border-black/10 bg-white px-3 text-base leading-6 text-slate-900 placeholder:text-slate-500 focus:border-[var(--brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20 ${
              isWidget ? "min-h-[3.25rem] py-2" : "min-h-[4.4rem] py-2.5"
            }`}
            disabled={isDisabled}
            aria-busy={!clientReady}
          />
          <button
            type="submit"
            disabled={isDisabled || !input.trim()}
            className={`btn btn-primary shrink-0 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
              isWidget ? "min-h-[3.25rem] min-w-[4.65rem]" : "min-h-11"
            }`}
          >
            {status === "streaming" || status === "submitted" ? "Thinking…" : "Send"}
          </button>
        </div>
        <p className="text-xs leading-4 text-slate-600">
          Do not send SSN, Medicare ID, bank information, or sensitive identifiers.
        </p>
      </form>

      {!isWidget ? (
        <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-1 border-t border-black/5 pt-2 text-xs text-black/60">
          <a href={`tel:${site.phoneE164}`} className="hover:text-black hover:underline">
            Call {site.phoneDisplay}
          </a>
          <Link href="/contact" className="hover:text-black hover:underline">
            Contact form
          </Link>
          <Link href="/schedule" className="hover:text-black hover:underline">
            Schedule a call
          </Link>
        </div>
      ) : null}
    </div>
  );
}
