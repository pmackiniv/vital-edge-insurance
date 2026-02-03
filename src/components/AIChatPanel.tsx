"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { site } from "@/lib/site";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

export function AIChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    id: "vital-edge-ai-chat",
    transport: chatTransport,
  });

  const isDisabled = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isDisabled) return;
    setInput("");
    sendMessage({ text });
  };

  const showError = Boolean(error) || status === "error";

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm font-semibold text-black">AI assistant</div>
      <p className="text-xs text-black/60">
        Ask general questions about coverage types or enrollment timing. We do not provide plan-specific guidance in
        chat. We will connect you with a licensed agent for your convenience, call or text {site.phoneDisplay}, request a
        callback, or schedule a call.
      </p>

      {showError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {error?.message?.includes("503")
            ? "AI chat is not configured yet. Add OPENAI_API_KEY in Vercel to enable."
            : "Chat is temporarily unavailable. Call or text or use the contact form."}
        </div>
      ) : null}

      <div className="flex max-h-[280px] flex-col gap-3 overflow-y-auto rounded-xl border border-black/10 bg-white/80 p-3">
        {messages.length === 0 ? (
          <p className="text-xs text-black/50">Ask a question to start.</p>
        ) : (
          messages.map((m) => {
            const text = (m.parts ?? [])
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            return (
              <div
                key={m.id}
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === "user" ? "ml-4 bg-[var(--brand-blue)]/10 text-black" : "mr-4 bg-black/5 text-black/90"
                }`}
              >
                <span className="font-semibold text-black/70">{m.role === "user" ? "You" : "Vital Edge"}</span>
                <p className="mt-1 whitespace-pre-wrap leading-relaxed">{text}</p>
              </div>
            );
          })
        )}
        {status === "streaming" ? (
          <div className="text-xs text-black/50">Vital Edge is typing...</div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What is Part D? How do I speak to Patrick?"
          rows={3}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
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

      <div className="flex flex-wrap gap-2 border-t border-black/5 pt-3">
        <a href={`tel:${site.phoneE164}`} className="text-xs text-black/70 hover:underline">
          Call {site.phoneDisplay}
        </a>
        <Link href="/contact" className="text-xs text-black/70 hover:underline">
          Contact form
        </Link>
        <Link href="/schedule" className="text-xs text-black/70 hover:underline">
          Schedule a call
        </Link>
      </div>
    </div>
  );
}
