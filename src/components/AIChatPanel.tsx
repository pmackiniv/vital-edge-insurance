"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { site } from "@/lib/site";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

type AIChatPanelProps = {
  onPatrickHandoffNeeded?: () => void;
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
    /\b(cms|medicare|medicare advantage|part d|medigap|medicare supplement|d-snp|c-snp|snp|special needs|dual eligible)\b/.test(normalized);
  const asksForPlanSpecificHelp =
    /\b(best|recommend|which|compare|choose|provider|doctor|network|drug|premium|cost|copay|benefit|eligib|enroll|diabetes|medicaid)\b/.test(normalized);
  return hasMedicareContext && asksForPlanSpecificHelp;
}

export function AIChatPanel({ onPatrickHandoffNeeded }: AIChatPanelProps = {}) {
  const [input, setInput] = useState("");
  const [handoffNotice, setHandoffNotice] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    id: "vital-edge-ai-chat",
    transport: chatTransport,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isDisabled = status === "streaming" || status === "submitted";
  const chatUnavailable = isChatUnavailableError(error?.message);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formText = formData.get("message");
    const text = (typeof formText === "string" ? formText : input).trim();
    if (!text || isDisabled) return;
    setInput("");
    if (needsPatrickHandoff(text)) {
      onPatrickHandoffNeeded?.();
      setHandoffNotice(
        "This looks like a question for Patrick Mackin IV. Use Permission to Contact in the guidance form so Patrick can respond.",
      );
    }
    sendMessage({ text });
  };

  const showError = Boolean(error) || status === "error";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0">
        <div className="text-base font-extrabold text-[var(--ve-teal)]">Coverage Atlas</div>
        <p className="mt-1 text-sm leading-6 text-black/68">
          Ask general questions about Medicare, ACA, coverage timing, and next steps. Coverage Atlas can point you to
          resources and help request follow-up. Plan-specific guidance requires Patrick Mackin IV, licensed agent. Call
          or text {site.phoneDisplay},{" "}
          <Link href="/schedule" className="font-medium text-[var(--brand-blue)] underline hover:no-underline">
            schedule a call
          </Link>
          . Secure enrollment: <Link href="/enroll" className="font-medium text-[var(--brand-blue)] underline hover:no-underline">/enroll</Link>.
        </p>
      </div>

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

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-[var(--ve-teal)]/15 bg-[linear-gradient(180deg,#ffffff_0%,#eef7f7_100%)] p-3 scroll-smooth">
        {messages.length === 0 ? (
          <p className="py-2 text-sm leading-6 text-black/58">Ask a coverage question to start.</p>
        ) : (
          messages.map((m) => {
            const text = (m.parts ?? [])
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            return (
              <div
                key={m.id}
                className={`rounded-2xl px-4 py-3 text-[15px] shadow-sm ${
                  m.role === "user"
                    ? "ml-6 bg-[var(--brand-blue)]/15 text-black"
                    : "mr-6 border border-[var(--ve-teal)]/10 bg-white text-black/90"
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-wide text-black/60">
                  {m.role === "user" ? "You" : "Coverage Atlas"}
                </span>
                <p className="mt-1.5 whitespace-pre-wrap leading-relaxed">{text}</p>
              </div>
            );
          })
        )}
        {status === "streaming" ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-xs text-black/60">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-black/40" />
            <span>Coverage Atlas is typing...</span>
          </div>
        ) : null}
        <div ref={messagesEndRef} aria-hidden="true" className="h-0 shrink-0" />
      </div>

      <form onSubmit={handleSubmit} className="flex shrink-0 flex-col gap-2">
        <textarea
          value={input}
          name="message"
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What is Part D? When should I ask Patrick for licensed guidance?"
          rows={2}
          className="w-full resize-none rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-[var(--brand-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-blue)]"
          disabled={isDisabled}
        />
        <p className="text-[11px] text-black/50">Do not send SSN, Medicare ID, or medical details.</p>
        <button
          type="submit"
          disabled={isDisabled}
          className="btn btn-primary self-end px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "streaming" || status === "submitted" ? "Thinking…" : "Send"}
        </button>
      </form>

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
    </div>
  );
}
