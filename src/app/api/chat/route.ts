import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildChatSystemPrompt } from "@/lib/chatSystemPrompt";
import { normalizeChatMessages } from "@/lib/chatMessages";
import {
  classifyChatProviderError,
  ensureChatProviderAvailable,
  makeChatUnavailablePayload,
} from "@/lib/chatProviderGuard";

export const maxDuration = 30;

export async function POST(req: Request) {
  const startMs = Date.now();
  const requestId = crypto.randomUUID();
  const gitCommit = process.env.VERCEL_GIT_COMMIT_SHA || "unknown";
  const vercelEnv = process.env.VERCEL_ENV || "unknown";
  if (!process.env.OPENAI_API_KEY) {
    console.warn("chat_request", {
      request_id: requestId,
      status: 503,
      reason: "openai_not_configured",
      vercel_env: vercelEnv,
      git_commit: gitCommit,
    });
    return new Response(
      JSON.stringify({
        error: "Chat is temporarily unavailable. Add OPENAI_API_KEY in Vercel.",
        requestId,
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const body = await req.json();
    const messages = await normalizeChatMessages(body.messages);
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid chat message payload.", requestId }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const availability = await ensureChatProviderAvailable();
    if (!availability.ok) {
      const payload = makeChatUnavailablePayload(requestId, availability.reason);
      console.warn("chat_request", {
        request_id: requestId,
        status: 503,
        reason: payload.reason,
        vercel_env: vercelEnv,
        git_commit: gitCommit,
      });
      return new Response(JSON.stringify(payload), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: buildChatSystemPrompt(),
      messages,
      maxOutputTokens: 800,
      temperature: 0.3,
    });

    console.info("chat_request", {
      request_id: requestId,
      status: 200,
      duration_ms: Date.now() - startMs,
      message_count: messages.length,
      vercel_env: vercelEnv,
      git_commit: gitCommit,
    });
    return result.toUIMessageStreamResponse({
      onError: (error) => {
        const reason = classifyChatProviderError(error);
        if (reason) {
          return JSON.stringify(makeChatUnavailablePayload(requestId, reason));
        }
        return "Chat is temporarily unavailable. Use the contact form or call.";
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const providerReason = classifyChatProviderError(err);
    if (providerReason) {
      const payload = makeChatUnavailablePayload(requestId, providerReason);
      console.warn("chat_request", {
        request_id: requestId,
        status: 503,
        reason: payload.reason,
        vercel_env: vercelEnv,
        git_commit: gitCommit,
      });
      return new Response(JSON.stringify(payload), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("chat_error", { request_id: requestId, message });
    console.info("chat_request", {
      request_id: requestId,
      status: 500,
      duration_ms: Date.now() - startMs,
      vercel_env: vercelEnv,
      git_commit: gitCommit,
    });
    return new Response(
      JSON.stringify({
        error: "Chat is temporarily unavailable. Use the contact form or call.",
        requestId,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
