import { NextResponse } from "next/server";
import { resourcesForTopic } from "@/lib/knowledgeBase";

type QaRequest = {
  question?: string;
};

const responses = [
  {
    match: (q: string) => q.includes("medicare") || q.includes("medigap"),
    topic: "medicare",
    answer:
      "We can share general Medicare education and help you connect with a licensed agent. For plan-specific Medicare discussions, we’ll guide you to a phone call. Please share your ZIP code in the chat so we can provide required plan-availability and disclaimer context.",
  },
  {
    match: (q: string) => q.includes("aca") || q.includes("marketplace"),
    topic: "aca",
    answer:
      "We provide education-first guidance on ACA Marketplace timing, eligibility, and what to prepare. If you want a follow-up, we can text or email you.",
  },
  {
    match: (q: string) => q.includes("ichra"),
    topic: "ichra",
    answer:
      "ICHRA questions are welcome. We can explain how allowances, timelines, and employee steps work, and follow up by text or email.",
  },
  {
    match: (q: string) => q.includes("off-exchange") || q.includes("off exchange"),
    topic: "off-exchange",
    answer:
      "Off-exchange coverage is education-only here. We can help clarify timing and documentation and follow up by text or email.",
  },
  {
    match: (q: string) => q.includes("small group") || q.includes("group benefits") || q.includes("group"),
    topic: "group",
    answer:
      "For small group coverage, we can explain timing, participation expectations, and what to prepare. We can follow up by text or email.",
  },
  {
    match: (q: string) => q.includes("contact") || q.includes("phone") || q.includes("call"),
    topic: "contact",
    answer:
      "You can call, text, or request guidance through the contact form. We’ll route you to the right next step.",
  },
];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as QaRequest;
  const question = String(body.question ?? "").trim();
  const normalized = question.toLowerCase();

  const match = responses.find((item) => item.match(normalized));
  const topic = match?.topic || "general";
  const answer =
    match?.answer ||
    "I can help with navigation and general education. Tell me what topic you need help with: Medicare, ACA Marketplace, ICHRA, off-exchange, or small group.";

  const resources = resourcesForTopic(topic === "group" ? "group" : topic);

  return NextResponse.json({
    ok: true,
    topic,
    answer,
    resources,
  });
}
