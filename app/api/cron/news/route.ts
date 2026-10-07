import { NextResponse } from "next/server";

import { runNewsPipeline } from "@/lib/news/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Daily newsroom run, 06:00 IST (vercel.json). Same guard as the other crons:
 * `Authorization: Bearer $CRON_SECRET`. Finds, drafts and checks stories,
 * then fills today's publishing slots from the buffer. A failure emails
 * staff and still publishes from the buffer.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || (req.headers.get("authorization") ?? "") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "no database" }, { status: 503 });
  try {
    return NextResponse.json(await runNewsPipeline());
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
