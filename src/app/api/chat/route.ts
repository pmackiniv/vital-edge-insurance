import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildChatSystemPrompt } from "@/lib/chatSystemPrompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const startMs = Date.now();
  if (!process.env.OPENAI_API_KEY) {
    console.warn("chat_request", { status: 503, reason: "openai_not_configured" });
    return new Response(
      JSON.stringify({ error: "LLM not configured. Add OPENAI_API_KEY in Vercel." }),
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

    console.info("chat_request", { status: 200, duration_ms: Date.now() - startMs });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("chat_error", { message });
    console.info("chat_request", { status: 500, duration_ms: Date.now() - startMs });
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
