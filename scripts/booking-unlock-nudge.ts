import { config } from "dotenv";
import { and, eq, isNull, sql } from "drizzle-orm";

import { sendEmail } from "../lib/auth/mailer";
import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { displayName } from "../lib/display-name";
import { env } from "../lib/env";
import { digestUnsubscribeUrl } from "../lib/doctor-digest";
import { reminderSecret } from "../lib/services/signup-reminders";
import { audit } from "../lib/services/audit";
import { bookingRequirementsFor } from "../lib/services/booking";

config({ path: ".env.local" });
config();

/**
 * One email to every doctor who has claimed a profile but not switched on
 * bookings: what is left, with links. Dry run prints the emails; --send sends.
 *
 *   npx tsx --require ./scripts/server-only-shim.cjs scripts/booking-unlock-nudge.ts [--send] [--only slug]
 *
 * Honours the digest opt-out. One send per doctor is recorded in the audit
 * log and the script skips anyone emailed in the last 14 days.
 */
const args = process.argv.slice(2);
const SEND = args.includes("--send");
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

export function nudgeEmail(n: { doctorName: string; missing: Array<{ label: string; href: string }>; unlocked: boolean; dashboardUrl: string; siteUrl: string; unsubscribe: string }): { subject: string; text: string } {
  const first = n.doctorName;
  if (n.unlocked) {
    return {
      subject: `${first}, your calendar is unlocked — switch on bookings`,
      text: [
        `Dear ${first},`,
        "",
        "Your profile on The Doctor Index is complete, so online appointment booking is unlocked. It is off until you switch it on.",
        "",
        "Two steps, about five minutes:",
        `1. Set your weekly consulting hours: ${n.siteUrl}/dashboard/calendar`,
        "2. Turn on \"Accept bookings\" on the same page.",
        "",
        "What happens then: patients request a slot from your profile; nothing is confirmed until you or your front desk accept it, and you get an email for every request. After each visit the site asks the patient for a review — every patient, automatically, with a Verified visit badge — so your reviews build from real appointments without you asking anyone.",
        "",
        `— The Doctor Index`,
        n.siteUrl,
        `Stop these emails: ${n.unsubscribe}`,
      ].join("\n"),
    };
  }
  return {
    subject: `${first}, ${n.missing.length === 1 ? "one thing" : `${n.missing.length} things`} between your profile and online bookings`,
    text: [
      `Dear ${first},`,
      "",
      "Thank you for claiming your profile on The Doctor Index. Patients can see it; they cannot yet book you. Bookings unlock when the profile is complete, and here is what is left:",
      "",
      ...n.missing.map((m, i) => `${i + 1}. ${m.label} — ${n.siteUrl}${m.href}`),
      "",
      "Once these are in, set your weekly hours and switch bookings on. Patients request a slot; you or your front desk confirm; and after each visit the site asks the patient for a review — every patient, automatically, with a Verified visit badge. Your reviews build from real appointments without you asking anyone.",
      "",
      `Your dashboard: ${n.dashboardUrl}`,
      "",
      `— The Doctor Index`,
      n.siteUrl,
      `Stop these emails: ${n.unsubscribe}`,
    ].join("\n"),
  };
}

async function main() {
  const db = getDb();
  const rows = await db
    .select({ id: s.doctors.id, slug: s.doctors.slug, name: s.doctors.name, specialtyKey: s.doctors.specialtyKey, userId: s.users.id, email: s.users.email, optOut: s.users.digestOptOutAt })
    .from(s.doctors)
    .innerJoin(s.users, eq(s.users.id, s.doctors.claimedByUserId))
    .where(and(eq(s.doctors.claimed, true), eq(s.doctors.status, "published"), isNull(s.doctors.mergedIntoId), eq(s.doctors.bookingEnabled, false), isNull(s.users.disabledAt)));
  let sent = 0;
  for (const d of rows) {
    if (ONLY && d.slug !== ONLY) continue;
    if (!d.email || d.optOut) { console.log(`skip ${d.slug}: ${!d.email ? "no email" : "opted out"}`); continue; }
    const [recent] = (await db.execute(sql`select 1 from audit_logs where action = 'doctor.booking_nudge' and entity_id = ${d.id} and created_at > now() - interval '14 days' limit 1`)) as unknown as unknown[];
    if (recent) { console.log(`skip ${d.slug}: nudged in the last 14 days`); continue; }
    const req = await bookingRequirementsFor(d.id);
    const missing = req.requirements.filter((r) => !r.done).map((r) => ({ label: r.label, href: r.href }));
    const msg = nudgeEmail({ doctorName: displayName({ name: d.name, specialtyKey: d.specialtyKey }), missing, unlocked: req.unlocked, dashboardUrl: `${env.siteUrl}/dashboard`, siteUrl: env.siteUrl, unsubscribe: digestUnsubscribeUrl(env.siteUrl, d.userId, reminderSecret()) });
    console.log(`\n=== ${d.slug} → ${d.email} (${req.unlocked ? "unlocked" : `${missing.length} missing`})\nSubject: ${msg.subject}\n${msg.text}\n`);
    if (SEND) {
      await sendEmail({ to: d.email, subject: msg.subject, text: msg.text });
      await audit({ actorUserId: null, actorRole: "staff", action: "doctor.booking_nudge", entityType: "doctor", entityId: d.id, after: { missing: missing.map((m) => m.label), unlocked: req.unlocked } });
      sent++;
    }
  }
  console.log(`\n${SEND ? "sent" : "would send"}: ${SEND ? sent : rows.length}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
