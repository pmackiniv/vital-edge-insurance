"use client";

import { useState } from "react";
import Link from "next/link";
import type { ResourceItem } from "@/lib/knowledgeBase";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
  resources?: ResourceItem[];
  shouldEscalate?: boolean;
  escalationReason?: string;
};

type AssistantResponse = {
  ok: boolean;
  answer?: string;
  topic?: string;
  resources?: ResourceItem[];
  shouldEscalate?: boolean;
  escalationReason?: string;
  error?: string;
};

type AIConciergeProps = {
  compact?: boolean;
  onRequestAgent?: () => void;
};

export function AIConcierge({ compact = false, onRequestAgent }: AIConciergeProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const question = input.trim();
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    setIsLoading(true);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = (await response.json()) as AssistantResponse;
      if (!response.ok || !data.ok || !data.answer) {
        throw new Error(data.error || "Unable to respond right now.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          resources: data.resources || [],
          shouldEscalate: data.shouldEscalate,
          escalationReason: data.escalationReason,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to respond right now.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-black/10 bg-white ${compact ? "p-4" : "p-6"}`}>
      <div className="space-y-2">
        <div className={`font-semibold text-black ${compact ? "text-sm" : "text-base"}`}>
          Vital Edge AI Concierge (Florida + CMS-informed)
        </div>
        <p className={`text-black/60 ${compact ? "text-xs" : "text-sm"}`}>
          Ask educational questions about Medicare, ACA Marketplace, or small business coverage. For plan-specific advice,
          we will route you to a licensed agent.
        </p>
      </div>

      <div className={`mt-4 space-y-3 ${compact ? "text-xs" : "text-sm"}`}>
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-[var(--muted)] p-3 text-black/60">
            Try: “When is Medicare enrollment?” or “What counts as an ACA special enrollment event?”
          </div>
        ) : null}
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl border px-3 py-2 ${
              message.role === "user"
                ? "border-black/10 bg-black text-white"
                : "border-black/10 bg-white text-black"
            }`}
          >
            <p>{message.content}</p>
            {message.role === "assistant" && message.resources && message.resources.length > 0 ? (
              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-black/70">Suggested resources</div>
                {message.resources.map((resource) => (
                  <Link
                    key={resource.slug}
                    href={`/resources#${resource.slug}`}
                    className="block text-xs text-[var(--brand-blue)] hover:underline"
                  >
                    {resource.title}
                  </Link>
                ))}
              </div>
            ) : null}
            {message.role === "assistant" && message.shouldEscalate ? (
              <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700">
                <p>{message.escalationReason || "A licensed agent can help from here."}</p>
                {onRequestAgent ? (
                  <button
                    type="button"
                    onClick={onRequestAgent}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--brand-orange)] px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90"
                  >
                    Request a callback
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}

        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>

      <form onSubmit={handleSubmit} className={`mt-4 flex flex-col gap-2 ${compact ? "text-xs" : "text-sm"}`}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={compact ? 2 : 3}
          placeholder="Ask an insurance question (no sensitive IDs)"
          className="w-full rounded-xl border border-black/10 px-3 py-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-blue)] px-4 py-2 font-semibold text-white hover:bg-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Thinking..." : "Ask the AI concierge"}
        </button>
      </form>
    </div>
  );
}
