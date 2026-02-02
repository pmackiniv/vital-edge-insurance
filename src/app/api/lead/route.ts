import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/api/leads";

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
