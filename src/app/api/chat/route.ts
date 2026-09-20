import { createUIMessageStream, createUIMessageStreamResponse, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildChatSystemPrompt } from "@/lib/chatSystemPrompt";
import { normalizeChatMessages } from "@/lib/chatMessages";
import { getChatModelId } from "@/lib/chatModelConfig";
import { CHAT_FALLBACK_RESPONSE, getChatSiteGuideResponse } from "@/lib/chatSiteGuide";
import { classifyChatProviderError, ensureChatProviderAvailable, markChatProviderUnavailable } from "@/lib/chatProviderGuard";

export const maxDuration = 30;

function chatResponse(text: string) {
  const stream = createUIMessageStream({
    execute({ writer }) {
      const id = crypto.randomUUID();
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: text });
      writer.write({ type: "text-end", id });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid chat message payload.", requestId }, { status: 400 });
  }
  const messages = await normalizeChatMessages(body?.messages);
  if (messages.length === 0) {
    return Response.json({ error: "Invalid chat message payload.", requestId }, { status: 400 });
  }

  const localResponse = getChatSiteGuideResponse(messages);
  if (localResponse) return chatResponse(localResponse);
  if (!process.env.OPENAI_API_KEY || !ensureChatProviderAvailable().ok) {
    return chatResponse(CHAT_FALLBACK_RESPONSE);
  }

  try {
    // Buffer the answer so a provider failure returns useful guidance through
    // the same chat protocol instead of leaving a failed or partial stream.
    const result = await generateText({
      model: openai(getChatModelId()),
      system: buildChatSystemPrompt(),
      messages,
      maxOutputTokens: 800,
      temperature: 0.3,
      maxRetries: 0,
      abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(20_000)]),
    });
    return chatResponse(result.text || CHAT_FALLBACK_RESPONSE);
  } catch (error) {
    const reason = classifyChatProviderError(error);
    if (reason) markChatProviderUnavailable(reason);
    // Do not log conversations or raw errors, which may contain input.
    console.warn("chat_provider_unavailable", { request_id: requestId, reason: reason || "UPSTREAM" });
    return chatResponse(CHAT_FALLBACK_RESPONSE);
  }
}
