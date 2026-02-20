"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { site } from "@/lib/site";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

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

export function AIChatPanel() {
  const [input, setInput] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isDisabled) return;
    setInput("");
    sendMessage({ text });
  };

  const showError = Boolean(error) || status === "error";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="shrink-0">
        <div className="text-sm font-semibold text-black">AI assistant</div>
        <p className="mt-0.5 text-xs leading-snug text-black/60">
          Ask general questions about coverage types or enrollment timing. We do not provide plan-specific guidance in
          chat. For a licensed agent: call or text {site.phoneDisplay}, request a callback, or{" "}
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

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-black/10 bg-white/80 p-3 scroll-smooth">
        {messages.length === 0 ? (
          <p className="py-2 text-xs text-black/50">Ask a question to start.</p>
        ) : (
          messages.map((m) => {
            const text = (m.parts ?? [])
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            return (
              <div
                key={m.id}
                className={`rounded-xl px-3 py-2.5 text-sm shadow-sm ${
                  m.role === "user"
                    ? "ml-6 bg-[var(--brand-blue)]/15 text-black"
                    : "mr-6 bg-slate-100 text-black/90"
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-wide text-black/60">
                  {m.role === "user" ? "You" : "Vital Edge"}
                </span>
                <p className="mt-1.5 whitespace-pre-wrap leading-relaxed">{text}</p>
              </div>
            );
          })
        )}
        {status === "streaming" ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-xs text-black/60">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-black/40" />
            <span>Vital Edge is typing...</span>
          </div>
        ) : null}
        <div ref={messagesEndRef} aria-hidden="true" className="h-0 shrink-0" />
      </div>

      <form onSubmit={handleSubmit} className="flex shrink-0 flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What is Part D? How do I speak to a licensed agent?"
          rows={2}
          className="w-full resize-none rounded-xl border border-black/10 px-3 py-2 text-sm focus:border-[var(--brand-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-blue)]"
          disabled={isDisabled}
        />
        <p className="text-[11px] text-black/50">Do not send SSN, Medicare ID, or medical details.</p>
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
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
