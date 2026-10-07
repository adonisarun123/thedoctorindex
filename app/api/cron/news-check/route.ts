import { NextResponse } from "next/server";

import { runNewsSafetyNet } from "@/lib/news/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Afternoon safety net, 14:00 IST (vercel.json): fills any free slot from the
 * buffer (covers stories staff approved after the morning run) and emails
 * staff if nothing is live today or the buffer is below its minimum.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || (req.headers.get("authorization") ?? "") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "no database" }, { status: 503 });
  return NextResponse.json(await runNewsSafetyNet());
}
