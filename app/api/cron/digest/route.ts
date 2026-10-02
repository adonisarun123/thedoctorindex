import { NextResponse } from "next/server";

import { runDoctorDigest } from "@/lib/services/doctor-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Monthly doctor digest (vercel.json, 2nd of the month). Same guard as the
 * other crons: `Authorization: Bearer $CRON_SECRET`. Emails go out only when
 * DOCTOR_DIGEST_ENABLED=1; otherwise the response lists what would be sent.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "no database" }, { status: 503 });
  const report = await runDoctorDigest();
  return NextResponse.json({ ...report, items: report.items.map(({ email: _e, ...rest }) => rest) });
}
