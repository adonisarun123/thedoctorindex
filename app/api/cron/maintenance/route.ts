import { NextResponse } from "next/server";

import { revalidateDoctors } from "@/lib/data/revalidate";
import { runMaintenance } from "@/lib/services/maintenance";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Scheduled maintenance. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`
 * (see vercel.json); any other scheduler can do the same. With no
 * CRON_SECRET configured the route refuses, so it can never be triggered by
 * a stranger on a misconfigured deployment.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "no database" }, { status: 503 });
  const report = await runMaintenance(null);
  revalidateDoctors();
  return NextResponse.json(report);
}
