import "server-only";

import { and, eq, sql } from "drizzle-orm";

import { emailConfigured, sendEmail } from "@/lib/auth/mailer";
import { specialtyByKey } from "@/lib/data/taxonomy";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { displayName } from "@/lib/display-name";
import {
  composeInvite,
  DAILY_INVITE_CAP,
  dueSend,
  hashInviteToken,
  INVITE_VALID_DAYS,
  inviteToken,
  inviteUrl,
  istDayStart,
  looksLikeToken,
  MAX_CONFIRM_ATTEMPTS,
  newInviteToken,
  normalizeEmail,
  type InviteProfile,
} from "@/lib/doctor-invites";
import { env } from "@/lib/env";
import { audit } from "@/lib/services/audit";
import { createClaim, decideClaim } from "@/lib/services/workflow";

/**
 * Staff invites to claim a profile — the database side (rules in lib/doctor-invites.ts).
 *
 * Staff enter an address with its source and press Send. The email carries a
 * link that signs the recipient in; the profile is claimed only once they
 * confirm a registration number already on the profile, and only if nobody
 * has claimed it. Anything less leaves an ordinary pending claim for a
 * verification officer. Reminders go on day 3 and day 10 from the daily
 * reminders cron. An address that opted out is never invited again.
 */

const DAY = 86_400_000;

function secret(): string {
  const v = process.env.AUTH_SECRET;
  if (!v || v.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set");
    return "development-only-secret-change-me";
  }
  return v;
}
const tokenFor = (id: string) => inviteToken(id, secret());

export type Invite = typeof s.doctorInvites.$inferSelect;

/* ------------------------------------------------------------------------- */
/* Staff side                                                                */
/* ------------------------------------------------------------------------- */

/** Record an invite for a profile. Its link works only once it has been sent. */
export async function queueInvite(input: { doctorId: string; email: string; emailSource: string; staffUserId: string }): Promise<Invite> {
  const db = getDb();
  const email = normalizeEmail(input.email);
  if (!email) throw new Error("That email address does not look valid.");
  const source = input.emailSource.trim();
  if (source.length < 3) throw new Error("Say where the email address came from.");
  const [d] = await db.select({ id: s.doctors.id, claimed: s.doctors.claimed, status: s.doctors.status }).from(s.doctors).where(eq(s.doctors.id, input.doctorId)).limit(1);
  if (!d) throw new Error("Profile not found.");
  if (d.claimed) throw new Error("This profile is already claimed; there is nobody to invite.");
  if (d.status !== "published") throw new Error("Publish the profile before inviting the doctor to claim it.");
  const [regs] = (await db.execute(sql`select count(*)::int as n from medical_registrations where doctor_id = ${d.id}`)) as unknown as Array<{ n: number }>;
  if (!regs?.n) throw new Error("Add the registration number first: the doctor claims by confirming it.");
  const [stopped] = (await db.execute(sql`select 1 from doctor_invites where lower(email) = ${email} and status = 'opted_out' limit 1`)) as unknown as unknown[];
  if (stopped) throw new Error("This address asked not to be emailed again.");
  const [staff] = (await db.execute(sql`select 1 from users u join staff_members m on m.user_id = u.id where lower(u.email) = ${email} limit 1`)) as unknown as unknown[];
  if (staff) throw new Error("That address belongs to a staff account.");
  const [open] = await db.select({ id: s.doctorInvites.id }).from(s.doctorInvites).where(and(eq(s.doctorInvites.doctorId, d.id), sql`${s.doctorInvites.status} in ('queued', 'sent')`)).limit(1);
  if (open) throw new Error("This profile already has an open invite. Cancel it first to change the address.");
  const [inserted] = await db
    .insert(s.doctorInvites)
    .values({ doctorId: d.id, email, emailSource: source, tokenHash: `pending:${newInviteToken()}`, createdByUserId: input.staffUserId })
    .returning();
  const [row] = await db.update(s.doctorInvites).set({ tokenHash: hashInviteToken(tokenFor(inserted.id)) }).where(eq(s.doctorInvites.id, inserted.id)).returning();
  await audit({ actorUserId: input.staffUserId, actorRole: "staff", action: "invite.queued", entityType: "doctor", entityId: d.id, after: { inviteId: row.id, email, emailSource: source } });
  return row;
}

export async function sentToday(now = new Date()): Promise<number> {
  const [r] = (await getDb().execute(sql`select count(*)::int as n from doctor_invites where first_sent_at >= ${istDayStart(now).toISOString()}`)) as unknown as Array<{ n: number }>;
  return r?.n ?? 0;
}

async function profileFor(doctorId: string): Promise<InviteProfile | null> {
  const rows = (await getDb().execute(sql`
    select d.name, d.slug, d.specialty_key,
      (select f.name || coalesce(', ' || l.name, '') from doctor_practices p join facilities f on f.id = p.facility_id left join localities l on l.key = f.locality_key
        where p.doctor_id = d.id and p.active order by p.sort nulls last limit 1) as practice,
      (select coalesce(m.council || ' ', '') || m.number from medical_registrations m where m.doctor_id = d.id order by m.is_primary desc limit 1) as registration
    from doctors d where d.id = ${doctorId}
  `)) as unknown as Array<{ name: string; slug: string; specialty_key: string; practice: string | null; registration: string | null }>;
  const d = rows[0];
  if (!d) return null;
  return {
    name: displayName({ name: d.name, specialtyKey: d.specialty_key }),
    specialty: specialtyByKey(d.specialty_key)?.name ?? null,
    practice: d.practice,
    registration: d.registration,
    profileUrl: `${env.siteUrl}/doctor/${d.slug}`,
  };
}

/** Send a queued invite now. Honours the daily cap and records before sending. */
export async function sendInvite(inviteId: string, staffUserId: string, now = new Date()): Promise<{ delivered: boolean; provider: string }> {
  const db = getDb();
  if (!emailConfigured() && process.env.NODE_ENV === "production") throw new Error("Email is not configured, so nothing can be sent.");
  if ((await sentToday(now)) >= DAILY_INVITE_CAP) throw new Error(`Today's limit of ${DAILY_INVITE_CAP} invites is reached. Queued invites can go tomorrow.`);
  const token = tokenFor(inviteId);
  const [inv] = await db
    .update(s.doctorInvites)
    .set({ status: "sent", sends: 1, firstSentAt: now, lastSentAt: now, expiresAt: new Date(now.getTime() + INVITE_VALID_DAYS * DAY) })
    .where(and(eq(s.doctorInvites.id, inviteId), eq(s.doctorInvites.status, "queued")))
    .returning();
  if (!inv) throw new Error("That invite is not waiting to be sent.");
  const profile = await profileFor(inv.doctorId);
  if (!profile) throw new Error("Profile not found.");
  const msg = composeInvite(1, profile, inviteUrl(env.siteUrl, token));
  const res = await sendEmail({ to: inv.email, ...msg });
  await db.update(s.doctorInvites).set({ lastDelivered: res.delivered }).where(eq(s.doctorInvites.id, inv.id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "invite.sent", entityType: "doctor", entityId: inv.doctorId, after: { inviteId: inv.id, delivered: res.delivered, provider: res.provider } });
  return res;
}

/** Send up to `limit` queued invites, oldest first, within the daily cap. */
export async function sendQueued(staffUserId: string, limit: number): Promise<{ sent: number; failed: number; left: number }> {
  const room = Math.max(0, DAILY_INVITE_CAP - (await sentToday()));
  const ids = (await getDb().execute(sql`select id from doctor_invites where status = 'queued' order by created_at limit ${Math.min(limit, room)}`)) as unknown as Array<{ id: string }>;
  let sent = 0;
  let failed = 0;
  for (const { id } of ids) {
    try {
      const r = await sendInvite(id, staffUserId);
      if (r.delivered) sent++;
      else failed++;
    } catch {
      failed++;
    }
  }
  const [q] = (await getDb().execute(sql`select count(*)::int as n from doctor_invites where status = 'queued'`)) as unknown as Array<{ n: number }>;
  return { sent, failed, left: q?.n ?? 0 };
}

export async function cancelInvite(inviteId: string, staffUserId: string): Promise<void> {
  const [inv] = await getDb()
    .update(s.doctorInvites)
    .set({ status: "cancelled" })
    .where(and(eq(s.doctorInvites.id, inviteId), sql`${s.doctorInvites.status} in ('queued', 'sent')`))
    .returning();
  if (!inv) throw new Error("That invite is no longer open.");
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "invite.cancelled", entityType: "doctor", entityId: inv.doctorId, after: { inviteId: inv.id } });
}

export async function invitesForDoctor(doctorId: string): Promise<Invite[]> {
  return getDb().select().from(s.doctorInvites).where(eq(s.doctorInvites.doctorId, doctorId)).orderBy(sql`${s.doctorInvites.createdAt} desc`);
}

export interface InviteListRow extends Invite {
  doctorName: string;
  doctorSlug: string;
  specialtyKey: string;
  createdByEmail: string | null;
}

export async function listInvites(status?: string): Promise<InviteListRow[]> {
  const where = status ? sql`where i.status = ${status}` : sql``;
  const rows = (await getDb().execute(sql`
    select i.*, d.name as doctor_name, d.slug as doctor_slug, d.specialty_key, u.email as created_by_email
    from doctor_invites i join doctors d on d.id = i.doctor_id left join users u on u.id = i.created_by_user_id
    ${where} order by i.created_at desc limit 300
  `)) as unknown as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: r.id as string,
    doctorId: r.doctor_id as string,
    email: r.email as string,
    emailSource: r.email_source as string,
    tokenHash: "",
    status: r.status as Invite["status"],
    sends: Number(r.sends),
    lastDelivered: r.last_delivered as boolean | null,
    firstSentAt: r.first_sent_at ? new Date(r.first_sent_at as string) : null,
    lastSentAt: r.last_sent_at ? new Date(r.last_sent_at as string) : null,
    expiresAt: r.expires_at ? new Date(r.expires_at as string) : null,
    acceptedAt: r.accepted_at ? new Date(r.accepted_at as string) : null,
    acceptedUserId: (r.accepted_user_id as string) ?? null,
    confirmAttempts: Number(r.confirm_attempts),
    claimedAt: r.claimed_at ? new Date(r.claimed_at as string) : null,
    optedOutAt: r.opted_out_at ? new Date(r.opted_out_at as string) : null,
    optOutReason: (r.opt_out_reason as string) ?? null,
    createdByUserId: r.created_by_user_id as string,
    createdAt: new Date(r.created_at as string),
    doctorName: r.doctor_name as string,
    doctorSlug: r.doctor_slug as string,
    specialtyKey: r.specialty_key as string,
    createdByEmail: (r.created_by_email as string) ?? null,
  }));
}

/* ------------------------------------------------------------------------- */
/* Reminders (from /api/cron/reminders)                                      */
/* ------------------------------------------------------------------------- */

export interface InviteReminderReport {
  dryRun: boolean;
  due: number;
  sent: number;
  failed: number;
}

export async function runInviteReminders(opts: { now?: Date; send?: boolean } = {}): Promise<InviteReminderReport> {
  const now = opts.now ?? new Date();
  const send = opts.send ?? emailConfigured();
  const db = getDb();
  const open = await db.select().from(s.doctorInvites).where(eq(s.doctorInvites.status, "sent"));
  const due = open.map((i) => ({ inv: i, step: dueSend(i, now) })).filter((x): x is { inv: Invite; step: number } => x.step !== null);
  const report: InviteReminderReport = { dryRun: !send, due: due.length, sent: 0, failed: 0 };
  if (!send) return report;
  for (const { inv, step } of due) {
    // Claim the step first, so an overlapping run cannot send it twice.
    const [won] = await db
      .update(s.doctorInvites)
      .set({ sends: step, lastSentAt: now })
      .where(and(eq(s.doctorInvites.id, inv.id), eq(s.doctorInvites.sends, step - 1), eq(s.doctorInvites.status, "sent")))
      .returning({ id: s.doctorInvites.id });
    if (!won) continue;
    const profile = await profileFor(inv.doctorId);
    if (!profile) continue;
    const res = await sendEmail({ to: inv.email, ...composeInvite(step, profile, inviteUrl(env.siteUrl, tokenFor(inv.id))) });
    await db.update(s.doctorInvites).set({ lastDelivered: res.delivered }).where(eq(s.doctorInvites.id, inv.id));
    if (res.delivered) report.sent++;
    else report.failed++;
  }
  return report;
}

/* ------------------------------------------------------------------------- */
/* Recipient side                                                            */
/* ------------------------------------------------------------------------- */

export type InviteView =
  | { state: "invalid" }
  | { state: "expired" | "claimed" | "opted_out" | "open"; invite: Invite; profile: InviteProfile; slug: string };

export async function inviteByToken(token: string, now = new Date()): Promise<InviteView> {
  if (!looksLikeToken(token)) return { state: "invalid" };
  const [inv] = await getDb().select().from(s.doctorInvites).where(eq(s.doctorInvites.tokenHash, hashInviteToken(token))).limit(1);
  if (!inv || inv.status === "cancelled" || inv.status === "queued") return { state: "invalid" };
  const profile = await profileFor(inv.doctorId);
  if (!profile) return { state: "invalid" };
  const slug = profile.profileUrl.split("/doctor/")[1] ?? "";
  if (inv.status === "claimed") return { state: "claimed", invite: inv, profile, slug };
  if (inv.status === "opted_out") return { state: "opted_out", invite: inv, profile, slug };
  if (inv.expiresAt && inv.expiresAt <= now) return { state: "expired", invite: inv, profile, slug };
  return { state: "open", invite: inv, profile, slug };
}

/**
 * "Yes, this is me": the link proved the inbox, so the account for that address
 * is found or created and returned for a session. Staff accounts never sign in this way.
 * An opted-out invite can still be accepted; the doctor changed their mind.
 */
export async function acceptInvite(token: string): Promise<{ userId: string; inviteId: string }> {
  const view = await inviteByToken(token);
  if (view.state !== "open" && view.state !== "opted_out") throw new Error("This link is no longer valid.");
  const inv = view.invite;
  const db = getDb();
  const [existing] = (await db.execute(sql`
    select u.id, exists(select 1 from staff_members m where m.user_id = u.id) as staff from users u where lower(u.email) = ${inv.email} limit 1
  `)) as unknown as Array<{ id: string; staff: boolean }>;
  if (existing?.staff) throw new Error("This address belongs to a staff account. Sign in normally.");
  let userId = existing?.id;
  if (!userId) {
    const [u] = await db.insert(s.users).values({ email: inv.email, displayName: view.profile.name.replace(/^Dr\s+/, "").replace(/\s+\(PT\)$/, ""), signupFlow: "claim" }).returning({ id: s.users.id });
    userId = u.id;
  }
  await db.update(s.doctorInvites).set({ status: "sent", acceptedAt: inv.acceptedAt ?? new Date(), acceptedUserId: userId, optedOutAt: null, optOutReason: null }).where(eq(s.doctorInvites.id, inv.id));
  await audit({ actorUserId: userId, action: "invite.accepted", entityType: "doctor", entityId: inv.doctorId, after: { inviteId: inv.id, created: !existing } });
  return { userId, inviteId: inv.id };
}

/**
 * The confirm step. The signed-in account must be the invited address. A
 * registration number on the profile, on a profile nobody has claimed, claims
 * it at once with the inviting staff member recorded as the checker; anything
 * else becomes an ordinary pending claim.
 */
export async function confirmInvite(token: string, user: { id: string; email: string | null }, registration: string): Promise<{ claimed: boolean }> {
  const view = await inviteByToken(token);
  if (view.state !== "open") throw new Error("This link is no longer valid.");
  const inv = view.invite;
  if ((user.email ?? "").toLowerCase() !== inv.email) throw new Error(`You are signed in with a different email address. Sign out, then open the link again.`);
  if (inv.confirmAttempts >= MAX_CONFIRM_ATTEMPTS) throw new Error("Too many attempts. Use Claim on your profile page instead, or write to us.");
  const db = getDb();
  let claim: Awaited<ReturnType<typeof createClaim>>;
  try {
    claim = await createClaim(user.id, inv.doctorId, registration, "staff_invite");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (/do not match/.test(msg)) {
      await db.update(s.doctorInvites).set({ confirmAttempts: inv.confirmAttempts + 1 }).where(eq(s.doctorInvites.id, inv.id));
      throw new Error(`That number does not match the registration on this profile. ${MAX_CONFIRM_ATTEMPTS - inv.confirmAttempts - 1} attempts left.`);
    }
    throw e;
  }
  const [d] = await db.select({ claimed: s.doctors.claimed }).from(s.doctors).where(eq(s.doctors.id, inv.doctorId)).limit(1);
  const [regs] = (await db.execute(sql`select count(*)::int as n from medical_registrations where doctor_id = ${inv.doctorId}`)) as unknown as Array<{ n: number }>;
  if (d?.claimed || !regs?.n) {
    await audit({ actorUserId: user.id, action: "invite.claim_pending", entityType: "doctor", entityId: inv.doctorId, after: { inviteId: inv.id, claimId: claim.id } });
    return { claimed: false };
  }
  await decideClaim(claim.id, "approved", inv.createdByUserId, `Staff invite to ${inv.email} (source: ${inv.emailSource}); the recipient confirmed the registration number on file.`);
  await db.update(s.doctorInvites).set({ status: "claimed", claimedAt: new Date() }).where(eq(s.doctorInvites.id, inv.id));
  return { claimed: true };
}

/**
 * "This is not me" or "Stop these emails". Either stops the sequence and
 * blocks the address from future invites. "Not interested" also hides the
 * practice phone on the profile, as staff agreed when the feature was set up;
 * "not me" changes nothing on the profile, since the email went to the wrong person.
 */
export async function optOutInvite(token: string, reason: "not_me" | "not_interested"): Promise<void> {
  const view = await inviteByToken(token);
  if (view.state === "invalid") throw new Error("This link is not valid.");
  if (view.state === "claimed") throw new Error("This profile has been claimed. Manage it from your dashboard.");
  const inv = view.invite;
  const db = getDb();
  await db.update(s.doctorInvites).set({ status: "opted_out", optedOutAt: new Date(), optOutReason: reason }).where(eq(s.doctorInvites.id, inv.id));
  if (reason === "not_interested") await db.update(s.doctors).set({ phoneConsent: false }).where(eq(s.doctors.id, inv.doctorId));
  await audit({ action: `invite.opted_out.${reason}`, entityType: "doctor", entityId: inv.doctorId, after: { inviteId: inv.id, phoneHidden: reason === "not_interested" } });
}
