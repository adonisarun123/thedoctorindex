import "server-only";

import { eq, sql } from "drizzle-orm";

import { sendEmail } from "@/lib/auth/mailer";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { env } from "@/lib/env";
import { audit } from "@/lib/services/audit";
import {
  actionUrl,
  composeReminder,
  dueStep,
  isDoctorJourney,
  stageOf,
  unsubscribeUrl,
  type ReminderCandidate,
  type ReminderStage,
} from "@/lib/signup-reminders";

/**
 * Signup reminders — the database side. Run daily by /api/cron/reminders.
 *
 * Sending is off unless SIGNUP_REMINDERS_ENABLED=1; without it every run is a
 * dry run that reports who would be emailed. Each send is recorded before the
 * email goes out (unique on user, stage, step), so overlapping runs cannot
 * send the same step twice.
 */

export function remindersEnabled(): boolean {
  const v = process.env.SIGNUP_REMINDERS_ENABLED;
  return v === "1" || v === "true";
}

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set");
    return "development-only-secret-change-me";
  }
  return s;
}

export const reminderSecret = secret;

type Row = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  signup_flow: string | null;
  signup_next: string | null;
  created_at: Date;
  profile_completed_at: Date | null;
  opted_out: boolean;
  disabled: boolean;
  is_staff: boolean;
  has_doctor_activity: boolean;
  setup_steps: number[] | null;
  setup_last: Date | null;
  profile_steps: number[] | null;
  profile_last: Date | null;
};

/** Every account that has not reached a claim or a profile, with what it has been sent. */
export async function stalledSignups(): Promise<Array<ReminderCandidate & { stage: ReminderStage | null }>> {
  const rows = (await getDb().execute(sql`
    select u.id as user_id, u.email, u.display_name, u.signup_flow, u.signup_next, u.created_at, u.profile_completed_at,
      u.reminders_opt_out_at is not null as opted_out,
      u.disabled_at is not null as disabled,
      exists(select 1 from staff_members sm where sm.user_id = u.id) as is_staff,
      (exists(select 1 from doctors d where d.claimed_by_user_id = u.id)
        or exists(select 1 from doctor_claims c where c.user_id = u.id)
        or exists(select 1 from doctor_submissions x where x.user_id = u.id)
        or exists(select 1 from doctor_managers m where m.user_id = u.id)) as has_doctor_activity,
      (select array_agg(r.step order by r.step) from signup_reminders r where r.user_id = u.id and r.stage = 'setup') as setup_steps,
      (select max(r.sent_at) from signup_reminders r where r.user_id = u.id and r.stage = 'setup') as setup_last,
      (select array_agg(r.step order by r.step) from signup_reminders r where r.user_id = u.id and r.stage = 'doctor_profile') as profile_steps,
      (select max(r.sent_at) from signup_reminders r where r.user_id = u.id and r.stage = 'doctor_profile') as profile_last
    from users u
    order by u.created_at desc
  `)) as unknown as Row[];

  return rows
    .map((r) => {
      const base = {
        userId: r.user_id,
        email: r.email,
        displayName: r.display_name,
        signupFlow: r.signup_flow,
        signupNext: r.signup_next,
        createdAt: new Date(r.created_at),
        profileCompletedAt: r.profile_completed_at ? new Date(r.profile_completed_at) : null,
        optedOut: r.opted_out,
        disabled: r.disabled,
        isStaff: r.is_staff,
        hasDoctorActivity: r.has_doctor_activity,
      };
      const stage = stageOf(base);
      const steps = stage === "setup" ? r.setup_steps : stage === "doctor_profile" ? r.profile_steps : null;
      const last = stage === "setup" ? r.setup_last : stage === "doctor_profile" ? r.profile_last : null;
      return { ...base, stage, sentSteps: (steps ?? []).map(Number), lastSentAt: last ? new Date(last) : null };
    })
    .filter((c) => c.stage !== null && !c.isStaff && !c.disabled);
}

export interface ReminderRunReport {
  dryRun: boolean;
  considered: number;
  due: number;
  sent: number;
  failed: number;
  items: Array<{ userId: string; email: string; stage: ReminderStage; step: number; result: "sent" | "failed" | "would_send" | "already_sent" }>;
}

export async function runSignupReminders(opts: { now?: Date; send?: boolean } = {}): Promise<ReminderRunReport> {
  const now = opts.now ?? new Date();
  const send = opts.send ?? remindersEnabled();
  const candidates = await stalledSignups();
  const report: ReminderRunReport = { dryRun: !send, considered: candidates.length, due: 0, sent: 0, failed: 0, items: [] };
  const db = getDb();

  for (const c of candidates) {
    const due = dueStep(c, now);
    if (!due || !c.email) continue;
    report.due++;
    const item = { userId: c.userId, email: c.email, stage: due.stage, step: due.step };
    if (!send) {
      report.items.push({ ...item, result: "would_send" });
      continue;
    }
    // Claim the step first; a concurrent run loses the insert and skips.
    const [claimed] = await db
      .insert(s.signupReminders)
      .values({ userId: c.userId, stage: due.stage, step: due.step, delivered: false })
      .onConflictDoNothing()
      .returning({ id: s.signupReminders.id });
    if (!claimed) {
      report.items.push({ ...item, result: "already_sent" });
      continue;
    }
    const mail = composeReminder({
      stage: due.stage,
      step: due.step,
      displayName: c.displayName,
      actionUrl: actionUrl(env.siteUrl, c, due.stage, due.step),
      unsubscribeUrl: unsubscribeUrl(env.siteUrl, c.userId, secret()),
    });
    const res = await sendEmail({ to: c.email, subject: mail.subject, text: mail.text });
    await db.update(s.signupReminders).set({ delivered: res.delivered, provider: res.provider }).where(eq(s.signupReminders.id, claimed.id));
    if (res.delivered) report.sent++;
    else report.failed++;
    report.items.push({ ...item, result: res.delivered ? "sent" : "failed" });
  }

  if (send && report.due) {
    await audit({ action: "signup_reminders.run", entityType: "system", after: { due: report.due, sent: report.sent, failed: report.failed } });
  }
  return report;
}

export async function optOutOfReminders(userId: string): Promise<boolean> {
  const res = await getDb()
    .update(s.users)
    .set({ remindersOptOutAt: new Date() })
    .where(sql`${s.users.id} = ${userId} and ${s.users.remindersOptOutAt} is null`)
    .returning({ id: s.users.id });
  if (res.length) await audit({ actorUserId: userId, action: "user.reminders_opt_out", entityType: "user", entityId: userId });
  return true;
}

export { isDoctorJourney };
