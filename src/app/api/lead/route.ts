import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    payload = null;
  }

  const url = new URL(request.url);
  url.pathname = "/api/leads";

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : await request.text(),
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = { ok: res.ok };
  }

  return NextResponse.json(data, { status: res.status });
}
