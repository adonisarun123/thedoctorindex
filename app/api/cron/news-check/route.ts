import { NextResponse } from "next/server";

import { runNewsSafetyNet } from "@/lib/news/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Afternoon safety net, 14:00 IST (vercel.json): fills any free slot from the
 * buffer (covers stories staff approved after the morning run); if the day
 * is still empty, runs discovery again and then publishes the best checked
 * draft (lib/services/news.ts publishFallback). Emails staff either way.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || (req.headers.get("authorization") ?? "") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "no database" }, { status: 503 });
  return NextResponse.json(await runNewsSafetyNet());
}
