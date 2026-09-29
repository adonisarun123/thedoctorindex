import "server-only";

import { and, count, desc, eq, gte, inArray, isNotNull, isNull, ne, sql } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { cookies, headers } from "next/headers";

import { ipHash } from "@/lib/auth/hash";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { displayName } from "@/lib/display-name";
import { audit } from "@/lib/services/audit";
import { track } from "@/lib/services/events";
import { notifyUser } from "@/lib/services/notify";
import { CODE_ALPHABET, financialYear, levelFor, parseReferralCode, rewardFor, TRIBE, tribeChannel } from "@/lib/tribe";

/**
 * Grow Your Tribe — the service layer.
 *
 * Lifecycle of one referral:
 *   1. A colleague opens /join?ref=CODE. Middleware drops a cookie.
 *   2. They start a claim or a new-profile submission. `recordReferral` reads
 *      the cookie and inserts a `pending` row (one per invitee, ever).
 *   3. Staff approve the claim / submission, and check the registration
 *      against the register. `settleReferralsForDoctor` runs after each of
 *      those and flips the row to `verified` once BOTH hold.
 *   4. `recomputeRewards` counts verified referrals, works out the level and
 *      creates one reward row per level crossed, held for review.
 *   5. Staff issue the voucher from /admin/tribe; the doctor is emailed.
 *   6. If the referred profile is later suspended, archived or merged away,
 *      `clawbackForDoctor` reverses the credit and cancels unissued rewards
 *      the referrer no longer qualifies for.
 *
 * Nothing here is automatic money: every voucher passes a person.
 */

const mint = customAlphabet(CODE_ALPHABET, 6);

/* ------------------------------------------------------------------------- */
/* Codes                                                                     */
/* ------------------------------------------------------------------------- */

/** The referrer's permanent code, minted on first use. */
export async function ensureReferralCode(userId: string): Promise<string> {
  const db = getDb();
  const [have] = await db.select({ code: s.referralCodes.code }).from(s.referralCodes).where(eq(s.referralCodes.userId, userId)).limit(1);
  if (have) return have.code;
  for (let i = 0; i < 5; i++) {
    const code = `DR${mint()}`;
    const [row] = await db.insert(s.referralCodes).values({ userId, code }).onConflictDoNothing().returning({ code: s.referralCodes.code });
    if (row) {
      await audit({ actorUserId: userId, actorRole: "doctor", action: "tribe.code.minted", entityType: "user", entityId: userId, after: { code } });
      return row.code;
    }
    // Either the code collided (retry) or the user already has one (return it).
    const [again] = await db.select({ code: s.referralCodes.code }).from(s.referralCodes).where(eq(s.referralCodes.userId, userId)).limit(1);
    if (again) return again.code;
  }
  throw new Error("Could not mint a referral code.");
}

export interface Referrer {
  userId: string;
  code: string;
  doctorId: string;
  name: string;
  specialtyKey: string;
  slug: string;
  city: string | null;
}

/** Who a code belongs to — only a doctor with a claimed, published profile can refer. */
export async function getReferrerByCode(raw: unknown): Promise<Referrer | null> {
  const code = parseReferralCode(raw);
  if (!code) return null;
  const db = getDb();
  const [row] = await db
    .select({ userId: s.referralCodes.userId, code: s.referralCodes.code, doctorId: s.doctors.id, name: s.doctors.name, specialtyKey: s.doctors.specialtyKey, slug: s.doctors.slug, city: s.users.city })
    .from(s.referralCodes)
    .innerJoin(s.users, eq(s.users.id, s.referralCodes.userId))
    .innerJoin(s.doctors, and(eq(s.doctors.claimedByUserId, s.referralCodes.userId), eq(s.doctors.claimed, true), eq(s.doctors.status, "published")))
    .where(and(eq(s.referralCodes.code, code), isNull(s.users.disabledAt)))
    .limit(1);
  return row ?? null;
}

/** The referral cookie set by middleware on /join, if any, with the channel the link carried. */
export async function readReferralCookie(): Promise<{ code: string; channel: string } | null> {
  try {
    const jar = await cookies();
    const code = parseReferralCode(jar.get(TRIBE.cookieName)?.value);
    if (!code) return null;
    return { code, channel: tribeChannel(jar.get(`${TRIBE.cookieName}_ch`)?.value) };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------------- */
/* Recording and settling                                                     */
/* ------------------------------------------------------------------------- */

/**
 * Called from the claim and new-profile actions, after the case is created.
 * Silent when there is no cookie, when the code is dead, or when the invitee
 * is the referrer. Never throws — a referral must not break a claim.
 */
export async function recordReferral(input: { refereeUserId: string; doctorId?: string | null; kind: "claim" | "submission" }): Promise<void> {
  if (!TRIBE.enabled) return;
  try {
    const cookie = await readReferralCookie();
    if (!cookie) return;
    const { code, channel } = cookie;
    const referrer = await getReferrerByCode(code);
    if (!referrer) return;
    if (referrer.userId === input.refereeUserId) {
      await audit({ actorUserId: input.refereeUserId, actorRole: "doctor", action: "tribe.referral.self", entityType: "user", entityId: input.refereeUserId, after: { code } });
      return;
    }
    if (input.doctorId && referrer.doctorId === input.doctorId) return;
    const db = getDb();
    let ip: string | null = null;
    try {
      ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? null;
    } catch {
      /* outside a request */
    }
    const [row] = await db
      .insert(s.referrals)
      .values({ referrerUserId: referrer.userId, refereeUserId: input.refereeUserId, doctorId: input.doctorId ?? null, kind: input.kind, channel, ipHash: ipHash(ip), reason: "Awaiting approval and register check." })
      .onConflictDoNothing()
      .returning({ id: s.referrals.id });
    if (!row) return; // invitee already credited to someone, or this doctor already counted
    await audit({ actorUserId: input.refereeUserId, actorRole: "doctor", action: "tribe.referral.recorded", entityType: "referral", entityId: row.id, after: { referrerUserId: referrer.userId, doctorId: input.doctorId ?? null, kind: input.kind, channel } });
    await track("referral_recorded", { doctorId: input.doctorId ?? null, query: `ch:${channel}` });
  } catch (e) {
    console.error("[tribe] recordReferral failed", e instanceof Error ? e.message : e);
  }
}

/** A new-profile submission was approved: attach the created doctor to the invitee's pending referral. */
export async function linkSubmissionDoctor(refereeUserId: string, doctorId: string): Promise<void> {
  try {
    await getDb()
      .update(s.referrals)
      .set({ doctorId })
      .where(and(eq(s.referrals.refereeUserId, refereeUserId), isNull(s.referrals.doctorId), eq(s.referrals.status, "pending")));
  } catch (e) {
    // The doctor may already be attached to another referral (unique index): leave it.
    console.error("[tribe] linkSubmissionDoctor", e instanceof Error ? e.message : e);
  }
}

/**
 * Re-evaluate the pending referral on a profile. Verified when the profile is
 * published, claimed by the invitee, and carries a register-checked
 * registration. Called after claim approval, submission approval and a
 * registration check; idempotent.
 */
export async function settleReferralsForDoctor(doctorId: string): Promise<void> {
  if (!TRIBE.enabled) return;
  try {
    const db = getDb();
    const [r] = await db.select().from(s.referrals).where(and(eq(s.referrals.doctorId, doctorId), eq(s.referrals.status, "pending"))).limit(1);
    if (!r) return;
    const [d] = await db.select({ claimed: s.doctors.claimed, claimedBy: s.doctors.claimedByUserId, status: s.doctors.status }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
    if (!d) return;
    const [reg] = await db.select({ id: s.medicalRegistrations.id }).from(s.medicalRegistrations).where(and(eq(s.medicalRegistrations.doctorId, doctorId), isNotNull(s.medicalRegistrations.checkedOn), eq(s.medicalRegistrations.status, "active"))).limit(1);
    const controlled = d.claimed && d.claimedBy === r.refereeUserId;
    if (d.status === "published" && controlled && reg) {
      await db.update(s.referrals).set({ status: "verified", verifiedAt: new Date(), settledAt: new Date(), reason: null }).where(eq(s.referrals.id, r.id));
      await audit({ actorRole: "system", action: "tribe.referral.verified", entityType: "referral", entityId: r.id, after: { referrerUserId: r.referrerUserId, doctorId } });
      await track("referral_verified", { doctorId });
      await recomputeRewards(r.referrerUserId);
      return;
    }
    const why = !controlled ? "Profile is not controlled by the invitee." : d.status !== "published" ? `Profile is ${d.status}.` : "Registration not yet checked against the register.";
    if (why !== r.reason) await db.update(s.referrals).set({ reason: why }).where(eq(s.referrals.id, r.id));
  } catch (e) {
    console.error("[tribe] settleReferralsForDoctor failed", e instanceof Error ? e.message : e);
  }
}

/** The referred profile lost its standing: reverse the credit and cancel rewards no longer earned. */
export async function clawbackForDoctor(doctorId: string, reason: string): Promise<void> {
  if (!TRIBE.enabled) return;
  try {
    const db = getDb();
    const [r] = await db.select().from(s.referrals).where(and(eq(s.referrals.doctorId, doctorId), inArray(s.referrals.status, ["pending", "verified"]))).limit(1);
    if (!r) return;
    const wasVerified = r.status === "verified";
    await db.update(s.referrals).set({ status: wasVerified ? "clawed_back" : "rejected", settledAt: new Date(), reason }).where(eq(s.referrals.id, r.id));
    await audit({ actorRole: "system", action: wasVerified ? "tribe.referral.clawed_back" : "tribe.referral.rejected", entityType: "referral", entityId: r.id, after: { doctorId }, reason });
    if (wasVerified) await recomputeRewards(r.referrerUserId);
  } catch (e) {
    console.error("[tribe] clawbackForDoctor failed", e instanceof Error ? e.message : e);
  }
}

/* ------------------------------------------------------------------------- */
/* Levels and rewards                                                        */
/* ------------------------------------------------------------------------- */

export async function verifiedCount(userId: string): Promise<number> {
  const [{ n }] = await getDb().select({ n: count() }).from(s.referrals).where(and(eq(s.referrals.referrerUserId, userId), eq(s.referrals.status, "verified")));
  return Number(n);
}

/**
 * Create a reward row for every level crossed and not yet rewarded; cancel
 * unissued rewards for levels no longer held. Cash is capped per financial
 * year across issued and pending vouchers. Emails the doctor per new level.
 */
export async function recomputeRewards(userId: string): Promise<{ level: number; newLevels: number[] }> {
  const db = getDb();
  const verified = await verifiedCount(userId);
  const level = levelFor(verified);
  const have = await db.select({ level: s.tribeRewards.level, status: s.tribeRewards.status, kind: s.tribeRewards.kind, amountInr: s.tribeRewards.amountInr, createdAt: s.tribeRewards.createdAt }).from(s.tribeRewards).where(eq(s.tribeRewards.userId, userId));
  const fy = financialYear();
  let committed = have.filter((r) => r.kind === "voucher" && r.status !== "cancelled" && r.createdAt >= fy.start && r.createdAt < fy.end).reduce((a, r) => a + r.amountInr, 0);
  const held = new Set(have.filter((r) => r.status !== "cancelled").map((r) => r.level));
  const newLevels: number[] = [];
  const holdUntil = new Date(Date.now() + TRIBE.holdDays * 864e5);
  for (let l = 1; l <= level; l++) {
    if (held.has(l)) continue;
    const reward = rewardFor(committed);
    const [row] = await db.insert(s.tribeRewards).values({ userId, level: l, kind: reward.kind, amountInr: reward.amountInr, holdUntil }).onConflictDoNothing().returning({ id: s.tribeRewards.id });
    if (!row) continue;
    committed += reward.amountInr;
    newLevels.push(l);
    await audit({ actorRole: "system", action: "tribe.level.reached", entityType: "user", entityId: userId, after: { level: l, kind: reward.kind, amountInr: reward.amountInr, verified } });
    await notifyUser(userId, { kind: "tribe_level", level: l, verified, rewardKind: reward.kind, amountInr: reward.amountInr, holdDays: TRIBE.holdDays });
  }
  // Clawback: unissued rewards above the level actually held are withdrawn.
  const lost = have.filter((r) => r.level > level && r.status === "pending_review").map((r) => r.level);
  if (lost.length) {
    await db.update(s.tribeRewards).set({ status: "cancelled", note: "Level no longer held after a referral was reversed." }).where(and(eq(s.tribeRewards.userId, userId), eq(s.tribeRewards.status, "pending_review"), inArray(s.tribeRewards.level, lost)));
    await audit({ actorRole: "system", action: "tribe.reward.cancelled", entityType: "user", entityId: userId, after: { levels: lost, verified } });
  }
  return { level, newLevels };
}

/** Staff: hand over the voucher. The code is stored, emailed once, and shown on the doctor's tribe page. */
export async function issueReward(id: string, staffUserId: string, voucherCode: string, note?: string): Promise<void> {
  const db = getDb();
  const [r] = await db.select().from(s.tribeRewards).where(eq(s.tribeRewards.id, id)).limit(1);
  if (!r) throw new Error("reward not found");
  if (r.status !== "pending_review") throw new Error("already decided");
  if (r.kind === "voucher" && !voucherCode.trim()) throw new Error("Enter the gift-card code that was issued.");
  if (r.holdUntil > new Date()) throw new Error(`Still in the review window until ${r.holdUntil.toISOString().slice(0, 10)}.`);
  await db.update(s.tribeRewards).set({ status: "issued", voucherCode: r.kind === "voucher" ? voucherCode.trim() : null, issuedAt: new Date(), issuedByUserId: staffUserId, note: note ?? null }).where(eq(s.tribeRewards.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "tribe.reward.issued", entityType: "reward", entityId: id, after: { userId: r.userId, level: r.level, kind: r.kind, amountInr: r.amountInr }, reason: note });
  await notifyUser(r.userId, { kind: "tribe_reward_issued", level: r.level, rewardKind: r.kind, amountInr: r.amountInr, voucherCode: r.kind === "voucher" ? voucherCode.trim() : null });
}

export async function cancelReward(id: string, staffUserId: string, note: string): Promise<void> {
  const db = getDb();
  const [r] = await db.select().from(s.tribeRewards).where(eq(s.tribeRewards.id, id)).limit(1);
  if (!r) throw new Error("reward not found");
  if (r.status !== "pending_review") throw new Error("already decided");
  await db.update(s.tribeRewards).set({ status: "cancelled", note }).where(eq(s.tribeRewards.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "tribe.reward.cancelled", entityType: "reward", entityId: id, after: { userId: r.userId, level: r.level }, reason: note });
}

/** Staff: reject a pending or verified referral by hand (fraud). Recomputes the referrer's rewards. */
export async function rejectReferral(id: string, staffUserId: string, note: string): Promise<void> {
  const db = getDb();
  const [r] = await db.select().from(s.referrals).where(eq(s.referrals.id, id)).limit(1);
  if (!r) throw new Error("referral not found");
  if (r.status === "rejected" || r.status === "clawed_back") throw new Error("already reversed");
  await db.update(s.referrals).set({ status: r.status === "verified" ? "clawed_back" : "rejected", settledAt: new Date(), reason: note }).where(eq(s.referrals.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "tribe.referral.rejected", entityType: "referral", entityId: id, after: { referrerUserId: r.referrerUserId }, reason: note });
  await recomputeRewards(r.referrerUserId);
}

/* ------------------------------------------------------------------------- */
/* Reads: the doctor's tribe page                                            */
/* ------------------------------------------------------------------------- */

export interface TribeMember {
  id: string;
  status: "pending" | "verified" | "rejected" | "clawed_back";
  kind: string;
  channel: string | null;
  createdAt: Date;
  verifiedAt: Date | null;
  /** Public name of the colleague's profile once it exists; null while a submission waits. */
  doctorName: string | null;
  doctorSlug: string | null;
  reason: string | null;
}

export interface TribeReward {
  id: string;
  level: number;
  kind: "voucher" | "recognition";
  amountInr: number;
  status: "pending_review" | "issued" | "cancelled";
  holdUntil: Date;
  voucherCode: string | null;
  issuedAt: Date | null;
  createdAt: Date;
}

export interface TribeSummary {
  code: string;
  verified: number;
  pending: number;
  members: TribeMember[];
  rewards: TribeReward[];
  cashIssuedInr: number;
  cashPendingInr: number;
}

export async function tribeSummary(userId: string): Promise<TribeSummary> {
  const db = getDb();
  const code = await ensureReferralCode(userId);
  const rows = await db
    .select({
      id: s.referrals.id, status: s.referrals.status, kind: s.referrals.kind, channel: s.referrals.channel, createdAt: s.referrals.createdAt, verifiedAt: s.referrals.verifiedAt, reason: s.referrals.reason,
      dName: s.doctors.name, dSpec: s.doctors.specialtyKey, dSlug: s.doctors.slug,
    })
    .from(s.referrals)
    .leftJoin(s.doctors, eq(s.doctors.id, s.referrals.doctorId))
    .where(eq(s.referrals.referrerUserId, userId))
    .orderBy(desc(s.referrals.createdAt))
    .limit(600);
  const members: TribeMember[] = rows.map((r) => ({
    id: r.id, status: r.status, kind: r.kind, channel: r.channel, createdAt: r.createdAt, verifiedAt: r.verifiedAt,
    doctorName: r.dName && r.dSpec ? displayName({ name: r.dName, specialtyKey: r.dSpec }) : null,
    doctorSlug: r.dSlug ?? null,
    // The doctor sees a plain state, not the staff-facing reason for a reversal.
    reason: r.status === "pending" ? r.reason : null,
  }));
  const rewards = (await db.select().from(s.tribeRewards).where(eq(s.tribeRewards.userId, userId)).orderBy(desc(s.tribeRewards.level))).map((r) => ({
    id: r.id, level: r.level, kind: r.kind, amountInr: r.amountInr, status: r.status, holdUntil: r.holdUntil, voucherCode: r.voucherCode, issuedAt: r.issuedAt, createdAt: r.createdAt,
  }));
  return {
    code,
    verified: members.filter((m) => m.status === "verified").length,
    pending: members.filter((m) => m.status === "pending").length,
    members,
    rewards,
    cashIssuedInr: rewards.filter((r) => r.status === "issued" && r.kind === "voucher").reduce((a, r) => a + r.amountInr, 0),
    cashPendingInr: rewards.filter((r) => r.status === "pending_review" && r.kind === "voucher").reduce((a, r) => a + r.amountInr, 0),
  };
}

export interface ColleagueGroup {
  facilityId: string;
  facility: string;
  doctors: Array<{ slug: string; name: string; specialtyKey: string }>;
}

/**
 * The hook: colleagues who already have an unclaimed profile at the same
 * facility as the referrer. These are the people most likely to say yes, and
 * the invite can name them and point at their own page.
 */
export async function colleaguesToInvite(doctorId: string, limit = 24): Promise<ColleagueGroup[]> {
  const db = getDb();
  const mine = await db.select({ facilityId: s.doctorPractices.facilityId }).from(s.doctorPractices).where(and(eq(s.doctorPractices.doctorId, doctorId), eq(s.doctorPractices.active, true)));
  const ids = [...new Set(mine.map((m) => m.facilityId))];
  if (!ids.length) return [];
  const rows = await db
    .selectDistinctOn([s.doctors.id], { facilityId: s.facilities.id, facility: s.facilities.name, id: s.doctors.id, slug: s.doctors.slug, name: s.doctors.name, specialtyKey: s.doctors.specialtyKey, quality: s.doctors.qualityScore })
    .from(s.doctorPractices)
    .innerJoin(s.doctors, eq(s.doctors.id, s.doctorPractices.doctorId))
    .innerJoin(s.facilities, eq(s.facilities.id, s.doctorPractices.facilityId))
    .where(and(inArray(s.doctorPractices.facilityId, ids), eq(s.doctorPractices.active, true), eq(s.doctors.status, "published"), eq(s.doctors.claimed, false), ne(s.doctors.id, doctorId)))
    .orderBy(s.doctors.id)
    .limit(limit * 3);
  const byFacility = new Map<string, ColleagueGroup>();
  for (const r of rows.sort((a, b) => b.quality - a.quality)) {
    const g = byFacility.get(r.facilityId) ?? { facilityId: r.facilityId, facility: r.facility, doctors: [] };
    if (g.doctors.length < limit) g.doctors.push({ slug: r.slug, name: r.name, specialtyKey: r.specialtyKey });
    byFacility.set(r.facilityId, g);
  }
  return [...byFacility.values()].sort((a, b) => b.doctors.length - a.doctors.length);
}

export interface LeaderRow {
  rank: number;
  name: string;
  city: string | null;
  verified: number;
  level: number;
  you: boolean;
}

/** Top referrers by verified count, public names only (the doctor's own profile name). */
export async function leaderboard(limit = 10, meUserId?: string): Promise<LeaderRow[]> {
  const db = getDb();
  const rows = await db
    .select({ userId: s.referrals.referrerUserId, n: count(), name: s.doctors.name, specialtyKey: s.doctors.specialtyKey, city: s.users.city })
    .from(s.referrals)
    .innerJoin(s.doctors, and(eq(s.doctors.claimedByUserId, s.referrals.referrerUserId), eq(s.doctors.claimed, true)))
    .innerJoin(s.users, eq(s.users.id, s.referrals.referrerUserId))
    .where(eq(s.referrals.status, "verified"))
    .groupBy(s.referrals.referrerUserId, s.doctors.name, s.doctors.specialtyKey, s.users.city)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r, i) => ({ rank: i + 1, name: displayName({ name: r.name, specialtyKey: r.specialtyKey }), city: r.city, verified: Number(r.n), level: levelFor(Number(r.n)), you: r.userId === meUserId }));
}

/* ------------------------------------------------------------------------- */
/* Reads: staff                                                              */
/* ------------------------------------------------------------------------- */

export interface RewardQueueItem {
  id: string;
  level: number;
  kind: "voucher" | "recognition";
  amountInr: number;
  status: "pending_review" | "issued" | "cancelled";
  holdUntil: Date;
  createdAt: Date;
  issuedAt: Date | null;
  voucherCode: string | null;
  note: string | null;
  referrer: { userId: string; name: string; email: string | null; doctorId: string | null; verified: number; pending: number; cashThisFyInr: number };
  /** Plain-English reasons to look twice before issuing. Empty means nothing stood out. */
  flags: string[];
}

export async function rewardQueue(showAll = false): Promise<RewardQueueItem[]> {
  const db = getDb();
  const rewards = await db
    .select({ r: s.tribeRewards, uName: s.users.displayName, uEmail: s.users.email, dId: s.doctors.id, dName: s.doctors.name, dSpec: s.doctors.specialtyKey })
    .from(s.tribeRewards)
    .innerJoin(s.users, eq(s.users.id, s.tribeRewards.userId))
    .leftJoin(s.doctors, and(eq(s.doctors.claimedByUserId, s.tribeRewards.userId), eq(s.doctors.claimed, true)))
    .where(showAll ? undefined : eq(s.tribeRewards.status, "pending_review"))
    .orderBy(s.tribeRewards.holdUntil, desc(s.tribeRewards.level))
    .limit(200);
  const userIds = [...new Set(rewards.map((x) => x.r.userId))];
  if (!userIds.length) return [];
  const refs = await db
    .select({ referrerUserId: s.referrals.referrerUserId, status: s.referrals.status, ipHash: s.referrals.ipHash, createdAt: s.referrals.createdAt, verifiedAt: s.referrals.verifiedAt, refereeLastSignIn: s.users.lastSignInAt, refereeCreated: s.users.createdAt })
    .from(s.referrals)
    .innerJoin(s.users, eq(s.users.id, s.referrals.refereeUserId))
    .where(inArray(s.referrals.referrerUserId, userIds));
  const fy = financialYear();
  const cash = await db
    .select({ userId: s.tribeRewards.userId, total: sql<number>`coalesce(sum(${s.tribeRewards.amountInr}),0)::int` })
    .from(s.tribeRewards)
    .where(and(inArray(s.tribeRewards.userId, userIds), eq(s.tribeRewards.kind, "voucher"), ne(s.tribeRewards.status, "cancelled"), gte(s.tribeRewards.createdAt, fy.start)))
    .groupBy(s.tribeRewards.userId);
  const cashBy = new Map(cash.map((c) => [c.userId, Number(c.total)]));

  return rewards.map(({ r, uName, uEmail, dId, dName, dSpec }) => {
    const mine = refs.filter((x) => x.referrerUserId === r.userId);
    const verified = mine.filter((x) => x.status === "verified");
    const flags: string[] = [];
    const dayAgo = Date.now() - 864e5;
    const burst = verified.filter((x) => x.verifiedAt && x.verifiedAt.getTime() > dayAgo).length;
    if (burst > 5) flags.push(`${burst} referrals verified in the last 24 hours.`);
    const ips = new Map<string, number>();
    for (const x of mine) if (x.ipHash) ips.set(x.ipHash, (ips.get(x.ipHash) ?? 0) + 1);
    const sharedIp = [...ips.values()].filter((n) => n >= 3).reduce((a, b) => a + b, 0);
    if (sharedIp) flags.push(`${sharedIp} claims started from the same network address.`);
    const ghosts = verified.filter((x) => !x.refereeLastSignIn || x.refereeLastSignIn.getTime() - x.refereeCreated.getTime() < 36e5).length;
    if (verified.length >= 5 && ghosts / verified.length >= 0.6) flags.push(`${ghosts} of ${verified.length} invitees never signed in again after registering.`);
    const reversed = mine.filter((x) => x.status === "rejected" || x.status === "clawed_back").length;
    if (reversed >= 3) flags.push(`${reversed} of this referrer's referrals were reversed.`);
    return {
      id: r.id, level: r.level, kind: r.kind, amountInr: r.amountInr, status: r.status, holdUntil: r.holdUntil, createdAt: r.createdAt, issuedAt: r.issuedAt, voucherCode: r.voucherCode, note: r.note,
      referrer: { userId: r.userId, name: dName && dSpec ? displayName({ name: dName, specialtyKey: dSpec }) : uName ?? "Unknown", email: uEmail, doctorId: dId ?? null, verified: verified.length, pending: mine.filter((x) => x.status === "pending").length, cashThisFyInr: cashBy.get(r.userId) ?? 0 },
      flags,
    };
  });
}

/** Programme totals for the admin overview. */
export async function tribeStats(): Promise<{ referrers: number; pending: number; verified: number; rewardsDue: number; cashIssuedInr: number }> {
  const rows = (await getDb().execute(sql`
    select
      (select count(distinct referrer_user_id) from referrals)::int as referrers,
      (select count(*) from referrals where status = 'pending')::int as pending,
      (select count(*) from referrals where status = 'verified')::int as verified,
      (select count(*) from tribe_rewards where status = 'pending_review' and hold_until <= now())::int as rewards_due,
      (select coalesce(sum(amount_inr),0) from tribe_rewards where status = 'issued' and kind = 'voucher')::int as cash_issued
  `)) as unknown as Array<Record<string, number>>;
  const r = rows[0] ?? {};
  return { referrers: Number(r.referrers ?? 0), pending: Number(r.pending ?? 0), verified: Number(r.verified ?? 0), rewardsDue: Number(r.rewards_due ?? 0), cashIssuedInr: Number(r.cash_issued ?? 0) };
}

/**
 * Maintenance sweep: re-evaluate every pending referral that has a profile.
 * Catches the paths that do not call settle directly — the register
 * matching worker (scripts/enrich.ts), a registration corrected by hand.
 */
export async function settlePendingReferrals(): Promise<number> {
  if (!TRIBE.enabled) return 0;
  const rows = await getDb().select({ doctorId: s.referrals.doctorId }).from(s.referrals).where(and(eq(s.referrals.status, "pending"), isNotNull(s.referrals.doctorId))).limit(2000);
  let n = 0;
  for (const r of rows) {
    if (!r.doctorId) continue;
    await settleReferralsForDoctor(r.doctorId);
    n++;
  }
  return n;
}
