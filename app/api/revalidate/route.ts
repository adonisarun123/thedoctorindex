import { NextResponse } from "next/server";

import { revalidateDoctors } from "@/lib/data/revalidate";

export const dynamic = "force-dynamic";

/**
 * Drops the public data cache so changes made outside this process — the
 * hourly enrichment job on GitHub Actions, a bulk import — show at once
 * instead of at the next hourly expiry. Same bearer secret as the cron route.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  revalidateDoctors();
  return NextResponse.json({ ok: true, revalidated: "doctors", at: new Date().toISOString() });
}
