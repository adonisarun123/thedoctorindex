import "server-only";

import { eq, sql } from "drizzle-orm";

import { sendEmail } from "@/lib/auth/mailer";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { displayName } from "@/lib/display-name";
import { composeDigest, digestUnsubscribeUrl, monthLabel, periodKey, type DigestFacts } from "@/lib/doctor-digest";
import { env } from "@/lib/env";
import { audit } from "@/lib/services/audit";
import { doctorAnalytics } from "@/lib/services/events";
import { reminderSecret } from "@/lib/services/signup-reminders";
import { paths } from "@/lib/site";

/**
 * Monthly digest to every claimed doctor (run by /api/cron/digest).
 * Dry run unless DOCTOR_DIGEST_ENABLED=1. Each send is claimed in
 * doctor_digests (unique doctor + period) before the email goes out.
 */
export function digestEnabled(): boolean {
  const v = process.env.DOCTOR_DIGEST_ENABLED;
  return v === "1" || v === "true";
}

type Candidate = {
  doctor_id: string;
  user_id: string;
  email: string;
  name: string;
  specialty_key: string;
  slug: string;
  tdi_id: string | null;
  has_photo: boolean;
  about: string;
  publications: number;
  articles: number;
  enquiries: number;
  new_enquiries: number;
  unreplied: number;
};

async function candidates(): Promise<Candidate[]> {
  return (await getDb().execute(sql`
    select d.id doctor_id, u.id user_id, u.email, d.name, d.specialty_key, d.slug, d.tdi_id,
      (d.photo_file_id is not null and d.photo_consent) has_photo, d.about,
      (select count(*) from doctor_credentials c where c.doctor_id = d.id and c.kind = 'publication')::int publications,
      (select count(*) from doctor_articles a where a.doctor_id = d.id and a.status = 'published')::int articles,
      (select count(*) from enquiries e where e.doctor_id = d.id and e.created_at >= now() - interval '28 days')::int enquiries,
      (select count(*) from enquiries e where e.doctor_id = d.id and e.status = 'new')::int new_enquiries,
      (select count(*) from reviews r where r.doctor_id = d.id and r.status in ('published','redacted')
         and not exists (select 1 from doctor_responses x where x.review_id = r.id))::int unreplied
    from doctors d
    join users u on u.id = d.claimed_by_user_id
    where d.claimed and d.status = 'published' and u.email is not null
      and u.disabled_at is null and u.digest_opt_out_at is null
  `)) as unknown as Candidate[];
}

export interface DigestRunReport {
  dryRun: boolean;
  period: string;
  considered: number;
  sent: number;
  failed: number;
  items: Array<{ doctorId: string; email: string; result: "sent" | "failed" | "would_send" | "already_sent"; subject: string }>;
}

export async function runDoctorDigest(opts: { now?: Date; send?: boolean; onlyDoctorId?: string } = {}): Promise<DigestRunReport> {
  const now = opts.now ?? new Date();
  const send = opts.send ?? digestEnabled();
  // Runs on the 2nd: the 28 days it reports are the month just ended, so name that month.
  const ref = new Date(now.getTime() - 3 * 86_400_000);
  const period = periodKey(ref);
  const label = monthLabel(ref);
  const db = getDb();
  const all = await candidates();
  const list = opts.onlyDoctorId ? all.filter((c) => c.doctor_id === opts.onlyDoctorId) : all;
  const report: DigestRunReport = { dryRun: !send, period, considered: list.length, sent: 0, failed: 0, items: [] };

  for (const c of list) {
    const a = await doctorAnalytics(c.doctor_id);
    const sum = (o: Record<string, number>) => Object.values(o).reduce((x, y) => x + y, 0);
    const facts: DigestFacts = {
      displayName: displayName({ name: c.name, specialty: c.specialty_key }),
      viewsTotal: a.viewsTotal,
      viewsPrevTotal: a.viewsPrevTotal,
      actionsTotal: sum(a.actions),
      actionsPrevTotal: sum(a.actionsPrev),
      enquiries: Number(c.enquiries),
      newEnquiries: Number(c.new_enquiries),
      topTerms: a.searchTerms.map((t) => t.term),
      hasPhoto: Boolean(c.has_photo),
      aboutWords: (c.about ?? "").trim().split(/\s+/).filter(Boolean).length,
      publications: Number(c.publications),
      articles: Number(c.articles),
      pendingReviewReplies: Number(c.unreplied),
      hasTdiId: Boolean(c.tdi_id),
    };
    const mail = composeDigest(
      facts,
      {
        dashboard: `${env.siteUrl.replace(/\/$/, "")}/dashboard`,
        profile: `${env.siteUrl.replace(/\/$/, "")}${paths.doctor(c.slug)}`,
        unsubscribe: digestUnsubscribeUrl(env.siteUrl, c.user_id, reminderSecret()),
      },
      label,
    );
    const item = { doctorId: c.doctor_id, email: c.email, subject: mail.subject };
    if (!send) {
      report.items.push({ ...item, result: "would_send" });
      continue;
    }
    const [claimed] = await db
      .insert(s.doctorDigests)
      .values({ doctorId: c.doctor_id, userId: c.user_id, period, delivered: false })
      .onConflictDoNothing()
      .returning({ id: s.doctorDigests.id });
    if (!claimed) {
      report.items.push({ ...item, result: "already_sent" });
      continue;
    }
    const res = await sendEmail({ to: c.email, subject: mail.subject, text: mail.text });
    await db.update(s.doctorDigests).set({ delivered: res.delivered, provider: res.provider }).where(eq(s.doctorDigests.id, claimed.id));
    if (res.delivered) report.sent++;
    else report.failed++;
    report.items.push({ ...item, result: res.delivered ? "sent" : "failed" });
  }
  if (send && list.length) await audit({ action: "doctor_digest.run", entityType: "system", after: { period, considered: list.length, sent: report.sent, failed: report.failed } });
  return report;
}

/** Preview of one doctor's email, for staff and tests. */
export async function previewDigest(doctorId: string) {
  return runDoctorDigest({ send: false, onlyDoctorId: doctorId });
}

export async function optOutOfDigest(userId: string): Promise<void> {
  const res = await getDb()
    .update(s.users)
    .set({ digestOptOutAt: new Date() })
    .where(sql`${s.users.id} = ${userId} and ${s.users.digestOptOutAt} is null`)
    .returning({ id: s.users.id });
  if (res.length) await audit({ actorUserId: userId, action: "user.digest_opt_out", entityType: "user", entityId: userId });
}
