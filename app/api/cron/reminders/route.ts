import { NextResponse } from "next/server";

import { runInviteReminders } from "@/lib/services/doctor-invites";
import { runSignupReminders } from "@/lib/services/signup-reminders";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Daily signup reminders (vercel.json). Same guard as /api/cron/maintenance:
 * `Authorization: Bearer $CRON_SECRET`, refused when no secret is configured.
 * Emails go out only when SIGNUP_REMINDERS_ENABLED=1; otherwise the response
 * lists who would have been sent what, and nothing is written.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "no database" }, { status: 503 });
  const report = await runSignupReminders();
  // Staff invites' day-3 and day-10 reminders. The staff member's Send was the
  // decision to email, so these follow whenever email is configured.
  const invites = await runInviteReminders();
  // Addresses stay out of the cron log; counts and stages are enough to audit a run.
  return NextResponse.json({ ...report, items: report.items.map(({ email: _e, ...rest }) => rest), invites });
}
