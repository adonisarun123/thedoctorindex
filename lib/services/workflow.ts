import "server-only";

import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { todayIso } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { notifyUser } from "@/lib/services/notify";
import { SENSITIVE_FIELDS, applyField, createDoctor, normalizeKey, recomputeQuality, snapshotRevision, type NewDoctorInput } from "@/lib/services/doctors";

/**
 * Doctor-facing workflows: new-profile submissions, claims, change requests,
 * team access. Each creates a case that staff decide in the admin panel.
 */

/* ------------------------------------------------------------------------- */
/* Submissions (plan §9.2)                                                    */
/* ------------------------------------------------------------------------- */

export interface SubmissionPayload {
  name: string;
  gender?: "F" | "M" | "X" | null;
  specialtyKey: string;
  subspecialties?: string[];
  practiceStartYear?: number | null;
  languages?: string[];
  modes?: string[];
  about?: string;
  services?: string[];
  qualifications?: Array<{ degree: string; institution: string; year?: number | null }>;
  practice?: { facilityName: string; localityKey: string; address: string; postalCode?: string; days?: string; hours?: string; feeInr?: number | null; phone?: string };
  consents: { publish: boolean; photo: boolean; phone: boolean; accurate: boolean };
}

export async function findDuplicateByRegistration(council: string, number: string) {
  const db = getDb();
  const [row] = await db
    .select({ doctorId: s.medicalRegistrations.doctorId, slug: s.doctors.slug, name: s.doctors.name, status: s.doctors.status, claimed: s.doctors.claimed })
    .from(s.medicalRegistrations)
    .innerJoin(s.doctors, eq(s.doctors.id, s.medicalRegistrations.doctorId))
    .where(and(eq(s.medicalRegistrations.numberNormalized, normalizeKey(number)), eq(s.medicalRegistrations.councilNormalized, normalizeKey(council))))
    .limit(1);
  return row ?? null;
}

export async function createSubmission(userId: string, council: string, registrationNumber: string, payload: SubmissionPayload) {
  const db = getDb();
  const dup = await findDuplicateByRegistration(council, registrationNumber);
  if (dup) throw new Error("A profile already exists for this registration. Claim it instead.");
  const [open] = await db.select({ id: s.doctorSubmissions.id }).from(s.doctorSubmissions).where(and(eq(s.doctorSubmissions.userId, userId), inArray(s.doctorSubmissions.status, ["submitted", "in_review", "needs_info"]))).limit(1);
  if (open) throw new Error("You already have a submission under review.");
  const [row] = await db.insert(s.doctorSubmissions).values({ userId, council, registrationNumber, payload }).returning();
  await audit({ actorUserId: userId, actorRole: "doctor", action: "submission.created", entityType: "submission", entityId: row.id, after: { council, registrationNumber, name: payload.name } });
  return row;
}

export async function decideSubmission(id: string, decision: "approved" | "rejected" | "needs_info" | "in_review", staffUserId: string, note?: string, verifyRegistration = false) {
  const db = getDb();
  const [sub] = await db.select().from(s.doctorSubmissions).where(eq(s.doctorSubmissions.id, id)).limit(1);
  if (!sub) throw new Error("submission not found");
  if (sub.status === "approved" || sub.status === "rejected") throw new Error("already decided");

  let doctorId: string | null = sub.doctorId;
  if (decision === "approved") {
    const p = sub.payload as SubmissionPayload;
    const input: NewDoctorInput = {
      name: p.name,
      gender: p.gender ?? null,
      specialtyKey: p.specialtyKey,
      subspecialties: p.subspecialties,
      practiceStartYear: p.practiceStartYear ?? null,
      languages: p.languages,
      modes: p.modes,
      about: p.about,
      services: p.services,
      registration: { number: sub.registrationNumber, council: sub.council, verified: verifyRegistration },
      qualifications: (p.qualifications ?? []).map((q) => ({ ...q, verified: false })),
      practices: p.practice ? [{ ...p.practice, confirmed: false }] : [],
      status: "published",
      source: "self",
      claimedByUserId: sub.userId,
    };
    const created = await createDoctor(input, staffUserId, "staff");
    doctorId = created.id;
    await db.update(s.doctors).set({ photoConsent: Boolean(p.consents?.photo), phoneConsent: Boolean(p.consents?.phone) }).where(eq(s.doctors.id, doctorId));
    await db.update(s.users).set({ role: "doctor" }).where(and(eq(s.users.id, sub.userId), eq(s.users.role, "patient")));
  }
  await db.update(s.doctorSubmissions).set({ status: decision, doctorId, reviewerNote: note ?? null, decidedAt: decision === "in_review" ? null : new Date(), decidedByUserId: staffUserId }).where(eq(s.doctorSubmissions.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `submission.${decision}`, entityType: "submission", entityId: id, after: { doctorId }, reason: note });
  const slug = doctorId ? (await db.select({ slug: s.doctors.slug }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1))[0]?.slug : null;
  await notifyUser(sub.userId, { kind: "submission", decision, doctorName: (sub.payload as SubmissionPayload).name, note, slug });
  return { doctorId };
}

/* ------------------------------------------------------------------------- */
/* Claims (plan §9.3)                                                        */
/* ------------------------------------------------------------------------- */

export async function createClaim(userId: string, doctorId: string, registrationNumber: string, method: "practice_otp" | "work_email" | "practice_admin" | "document", evidenceFileId?: string | null) {
  const db = getDb();
  const [d] = await db.select({ id: s.doctors.id, claimed: s.doctors.claimed, claimedBy: s.doctors.claimedByUserId }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  if (!d) throw new Error("profile not found");
  if (d.claimed && d.claimedBy === userId) throw new Error("You already control this profile.");
  const [reg] = await db.select({ n: s.medicalRegistrations.numberNormalized }).from(s.medicalRegistrations).where(eq(s.medicalRegistrations.doctorId, doctorId)).limit(1);
  if (!reg || reg.n !== normalizeKey(registrationNumber)) throw new Error("The registration number does not match this profile.");
  const [open] = await db.select({ id: s.doctorClaims.id }).from(s.doctorClaims).where(and(eq(s.doctorClaims.doctorId, doctorId), eq(s.doctorClaims.userId, userId), eq(s.doctorClaims.status, "pending"))).limit(1);
  if (open) throw new Error("Your claim is already under review.");
  const [row] = await db.insert(s.doctorClaims).values({ doctorId, userId, registrationNumber, method, evidenceFileId: evidenceFileId ?? null }).returning();
  await audit({ actorUserId: userId, action: "claim.created", entityType: "claim", entityId: row.id, after: { doctorId, method } });
  return row;
}

export async function decideClaim(id: string, decision: "approved" | "rejected", staffUserId: string, note?: string) {
  const db = getDb();
  const [c] = await db.select().from(s.doctorClaims).where(eq(s.doctorClaims.id, id)).limit(1);
  if (!c) throw new Error("claim not found");
  if (c.status !== "pending") throw new Error("already decided");
  if (decision === "approved") {
    await db.transaction(async (tx) => {
      await tx.update(s.doctors).set({ claimed: true, claimedByUserId: c.userId }).where(eq(s.doctors.id, c.doctorId));
      await tx.update(s.users).set({ role: "doctor" }).where(and(eq(s.users.id, c.userId), eq(s.users.role, "patient")));
      await tx.insert(s.verificationChecks).values({ doctorId: c.doctorId, kind: "claim", subjectId: c.id, result: "verified", source: c.method, checkedByUserId: staffUserId, note });
      // A competing pending claim on the same profile is closed, never auto-approved.
      await tx.update(s.doctorClaims).set({ status: "rejected", decidedAt: new Date(), decidedByUserId: staffUserId, note: "Another claim on this profile was approved." }).where(and(eq(s.doctorClaims.doctorId, c.doctorId), eq(s.doctorClaims.status, "pending"), sql`${s.doctorClaims.id} <> ${id}`));
    });
    await recomputeQuality(c.doctorId);
  }
  await db.update(s.doctorClaims).set({ status: decision, decidedAt: new Date(), decidedByUserId: staffUserId, note: note ?? null }).where(eq(s.doctorClaims.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `claim.${decision}`, entityType: "claim", entityId: id, after: { doctorId: c.doctorId, userId: c.userId }, reason: note });
  const [dn] = await db.select({ name: s.doctors.name }).from(s.doctors).where(eq(s.doctors.id, c.doctorId)).limit(1);
  await notifyUser(c.userId, { kind: "claim", decision, doctorName: dn?.name ?? "", note });
}

/* ------------------------------------------------------------------------- */
/* Change requests (plan §4, §5.2)                                            */
/* ------------------------------------------------------------------------- */

function isSensitive(field: string): boolean {
  const head = field.split(".")[0];
  if (SENSITIVE_FIELDS.has(head)) return true;
  // Address changes re-confirm with the practice before publication.
  return field.startsWith("facility.") && field.endsWith(".address");
}

/**
 * A doctor (or an authorised manager) proposes a change. Non-sensitive
 * fields publish immediately with an audit row; sensitive ones wait for a
 * verification officer. Returns whether it was applied or queued.
 */
export async function submitChange(doctorId: string, userId: string, field: string, toValue: unknown, currentValue: unknown, opts: { asManager?: boolean; scope?: string[] } = {}) {
  const db = getDb();
  if (opts.asManager) {
    const head = field.split(".")[0];
    if (head !== "practice" && head !== "facility") throw new Error("Managers may only edit practice details.");
    const pid = field.split(".")[1];
    if (head === "practice" && opts.scope?.length && !opts.scope.includes(pid)) throw new Error("This practice is outside your access.");
  }
  const sensitive = isSensitive(field);
  const [row] = await db.insert(s.profileChangeRequests).values({ doctorId, requestedByUserId: userId, field, fromValue: currentValue ?? null, toValue: toValue as object, sensitive, status: sensitive ? "pending" : "published", decidedAt: sensitive ? null : new Date() }).returning();
  if (!sensitive) {
    await applyField(doctorId, field, toValue, userId, opts.asManager ? "manager" : "doctor", `change ${row.id}`);
    await snapshotRevision(doctorId, `change ${row.id}`, userId);
  }
  await audit({ actorUserId: userId, actorRole: opts.asManager ? "manager" : "doctor", action: sensitive ? "change.queued" : "change.published", entityType: "change", entityId: row.id, before: { [field]: currentValue }, after: { [field]: toValue } });
  return { id: row.id, queued: sensitive };
}

export async function decideChange(id: string, decision: "published" | "rejected", staffUserId: string, note?: string) {
  const db = getDb();
  const [c] = await db.select().from(s.profileChangeRequests).where(eq(s.profileChangeRequests.id, id)).limit(1);
  if (!c) throw new Error("change not found");
  if (c.status !== "pending") throw new Error("already decided");
  if (decision === "published") {
    await applyField(c.doctorId, c.field, c.toValue, staffUserId, "staff", `change ${id} approved`);
    await snapshotRevision(c.doctorId, `change ${id} approved`, staffUserId);
    if (c.field === "name" || c.field === "specialtyKey") {
      await db.insert(s.verificationChecks).values({ doctorId: c.doctorId, kind: c.field === "name" ? "identity" : "registration", result: "verified", source: "Re-verified on change", checkedByUserId: staffUserId, note });
    }
  }
  await db.update(s.profileChangeRequests).set({ status: decision, decidedAt: new Date(), decidedByUserId: staffUserId, note: note ?? null }).where(eq(s.profileChangeRequests.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `change.${decision}`, entityType: "change", entityId: id, after: { doctorId: c.doctorId, field: c.field }, reason: note });
  const [dn] = await db.select({ name: s.doctors.name }).from(s.doctors).where(eq(s.doctors.id, c.doctorId)).limit(1);
  await notifyUser(c.requestedByUserId, { kind: "change", decision, field: c.field, doctorName: dn?.name ?? "", note });
}

/* ------------------------------------------------------------------------- */
/* Team access                                                                */
/* ------------------------------------------------------------------------- */

export async function inviteManager(doctorId: string, ownerUserId: string, email: string, name: string | null, scopePracticeIds: string[]) {
  const db = getDb();
  const lower = email.trim().toLowerCase();
  let [u] = await db.select({ id: s.users.id }).from(s.users).where(sql`lower(${s.users.email}) = ${lower}`).limit(1);
  if (!u) [u] = await db.insert(s.users).values({ email: lower, displayName: name }).returning({ id: s.users.id });
  const [row] = await db.insert(s.doctorManagers).values({ doctorId, userId: u.id, email: lower, name, scopePracticeIds, status: "active" }).returning();
  await audit({ actorUserId: ownerUserId, actorRole: "doctor", action: "manager.invited", entityType: "doctor", entityId: doctorId, after: { email: lower, scope: scopePracticeIds } });
  const [dn] = await db.select({ name: s.doctors.name }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  const [owner] = await db.select({ name: s.users.displayName, email: s.users.email }).from(s.users).where(eq(s.users.id, ownerUserId)).limit(1);
  await notifyUser(u.id, { kind: "manager_invite", doctorName: dn?.name ?? "", invitedBy: owner?.name ?? owner?.email ?? "The profile owner" });
  return row;
}

export async function revokeManager(managerId: string, ownerUserId: string) {
  const db = getDb();
  const [m] = await db.update(s.doctorManagers).set({ status: "revoked", revokedAt: new Date() }).where(eq(s.doctorManagers.id, managerId)).returning();
  if (m) await audit({ actorUserId: ownerUserId, actorRole: "doctor", action: "manager.revoked", entityType: "doctor", entityId: m.doctorId, after: { email: m.email } });
}

/* ------------------------------------------------------------------------- */
/* Reads for the dashboard                                                    */
/* ------------------------------------------------------------------------- */

export async function listChangesForDoctor(doctorId: string) {
  return getDb().select().from(s.profileChangeRequests).where(eq(s.profileChangeRequests.doctorId, doctorId)).orderBy(desc(s.profileChangeRequests.createdAt)).limit(50);
}
export async function listChecksForDoctor(doctorId: string) {
  return getDb().select().from(s.verificationChecks).where(eq(s.verificationChecks.doctorId, doctorId)).orderBy(desc(s.verificationChecks.checkedOn)).limit(50);
}
export async function listManagersForDoctor(doctorId: string) {
  return getDb().select().from(s.doctorManagers).where(eq(s.doctorManagers.doctorId, doctorId)).orderBy(desc(s.doctorManagers.createdAt));
}
export async function reconfirmSchedule(doctorId: string) {
  const db = getDb();
  const d = await db.query.doctors.findFirst({ where: eq(s.doctors.id, doctorId), with: { practices: { where: (p, { eq }) => eq(p.active, true), with: { facility: true } }, registrations: true } });
  if (!d) return [];
  const { env } = await import("@/lib/env");
  const { addDays } = await import("@/lib/db/dates");
  const today = todayIso();
  const out: Array<{ what: string; lastConfirmed: string | null; dueBy: string | null; overdue: boolean }> = [];
  for (const p of d.practices) {
    out.push({ what: `Fee · ${p.facility.name}`, lastConfirmed: p.feeCheckedOn, dueBy: p.feeCheckedOn ? addDays(p.feeCheckedOn, env.freshness.feeDays) : null, overdue: !p.feeCheckedOn || addDays(p.feeCheckedOn, env.freshness.feeDays) < today });
    const c = p.confirmedOn ?? p.facility.confirmedOn;
    out.push({ what: `Address and contact · ${p.facility.name}`, lastConfirmed: c, dueBy: c ? addDays(c, env.freshness.practiceDays) : null, overdue: !c || addDays(c, env.freshness.practiceDays) < today });
  }
  const r = d.registrations[0];
  out.push({ what: "Registration and disciplinary status", lastConfirmed: r?.checkedOn ?? null, dueBy: r?.checkedOn ? addDays(r.checkedOn, env.freshness.registrationDays) : null, overdue: !r?.checkedOn || addDays(r.checkedOn, env.freshness.registrationDays) < today });
  return out;
}
