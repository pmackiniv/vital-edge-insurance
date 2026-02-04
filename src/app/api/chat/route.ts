import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildChatSystemPrompt } from "@/lib/chatSystemPrompt";

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
    const messages = Array.isArray(body.messages) ? body.messages : [];

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
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
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
