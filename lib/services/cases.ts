import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { notifyDoctorOwner } from "@/lib/services/notify";
import { applyField, snapshotRevision } from "@/lib/services/doctors";
import { rateLimit } from "@/lib/security/rate-limit";

/**
 * Public-facing cases: profile reports, corrections, appointment enquiries.
 * Staff resolve them in the admin panel; every decision is audited.
 */

/* Profile reports */
export async function reportProfile(doctorId: string, reporterUserId: string | null, reason: string, detail: string | null, contact: string | null, ip?: string | null) {
  const db = getDb();
  const rl = await rateLimit(`report:${reporterUserId ?? ip ?? "anon"}`, Number(process.env.RATE_LIMIT_REPORT ?? 5), 3600);
  if (!rl.ok) throw new Error("Too many reports from this account. Try again later.");
  const priority = /impersonat|deceased|safety|threat/i.test(reason) ? "safety" : /retired|wrong/i.test(reason) ? "high" : "normal";
  const [row] = await db.insert(s.profileReports).values({ doctorId, reporterUserId, reason, detail, contact, priority }).returning();
  await audit({ actorUserId: reporterUserId, action: "profile.reported", entityType: "doctor", entityId: doctorId, after: { reportId: row.id, reason, priority } });
  return row;
}

export async function resolveProfileReport(id: string, status: "assessed" | "resolved" | "dismissed", staffUserId: string, resolution?: string) {
  const db = getDb();
  await db.update(s.profileReports).set({ status, assessedAt: status === "assessed" ? new Date() : undefined, resolvedAt: status === "assessed" ? null : new Date(), resolvedByUserId: staffUserId, resolution: resolution ?? null }).where(eq(s.profileReports.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `profile_report.${status}`, entityType: "profile_report", entityId: id, reason: resolution });
}

/* Corrections */
export async function submitCorrection(doctorId: string, userId: string | null, input: { field: string; currentValue: string | null; proposedValue: string; sourceNote: string | null; isDoctorOrStaff: boolean; contact: string | null }, ip?: string | null) {
  const db = getDb();
  const rl = await rateLimit(`correction:${userId ?? ip ?? "anon"}`, Number(process.env.RATE_LIMIT_CORRECTION ?? 5), 3600);
  if (!rl.ok) throw new Error("Too many corrections from this account. Try again later.");
  if (!input.proposedValue.trim()) throw new Error("Tell us what the field should say.");
  const [row] = await db.insert(s.corrections).values({ doctorId, submittedByUserId: userId, ...input }).returning();
  await audit({ actorUserId: userId, action: "correction.submitted", entityType: "doctor", entityId: doctorId, after: { correctionId: row.id, field: input.field } });
  return row;
}

/**
 * Apply a correction. `applyAs` maps the free-text field the public chose to a
 * concrete applyField() target; when staff leave it empty the correction is
 * closed as applied without a data change (e.g. they fixed it by hand).
 */
export async function decideCorrection(id: string, decision: "applied" | "rejected", staffUserId: string, applyAs?: { field: string; value: unknown } | null, note?: string) {
  const db = getDb();
  const [c] = await db.select().from(s.corrections).where(eq(s.corrections.id, id)).limit(1);
  if (!c) throw new Error("correction not found");
  if (c.status !== "open") throw new Error("already decided");
  if (decision === "applied" && applyAs?.field) {
    await applyField(c.doctorId, applyAs.field, applyAs.value, staffUserId, "staff", `correction ${id}`);
    await snapshotRevision(c.doctorId, `correction ${id}`, staffUserId);
  }
  await db.update(s.corrections).set({ status: decision, decidedAt: new Date(), decidedByUserId: staffUserId, note: note ?? null }).where(eq(s.corrections.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `correction.${decision}`, entityType: "correction", entityId: id, after: { doctorId: c.doctorId, applied: applyAs ?? null }, reason: note });
}

/* Enquiries */
export async function createEnquiry(doctorId: string, userId: string, input: { practiceId: string | null; contact: string; preferredDay: string | null; forWhom: "self" | "other"; note: string | null; consentToShare: boolean }) {
  const db = getDb();
  if (!input.consentToShare) throw new Error("Consent to share your number with the practice is required.");
  const rl = await rateLimit(`enquiry:${userId}`, Number(process.env.RATE_LIMIT_ENQUIRY ?? 5), 3600);
  if (!rl.ok) throw new Error("Too many enquiries in the last hour.");
  const [row] = await db.insert(s.enquiries).values({ doctorId, userId, practiceId: input.practiceId, contact: input.contact, preferredDay: input.preferredDay, forWhom: input.forWhom, note: input.note, consentToShare: true }).returning();
  await audit({ actorUserId: userId, actorRole: "patient", action: "enquiry.created", entityType: "doctor", entityId: doctorId, after: { enquiryId: row.id, practiceId: input.practiceId } });
  const [dn] = await db.select({ name: s.doctors.name }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  await notifyDoctorOwner(doctorId, { kind: "enquiry_received", doctorName: dn?.name ?? "", preferredDay: input.preferredDay });
  return row;
}

export async function setEnquiryStatus(id: string, status: "new" | "sent" | "contacted" | "closed", actorUserId: string, actorRole: string) {
  await getDb().update(s.enquiries).set({ status }).where(eq(s.enquiries.id, id));
  await audit({ actorUserId, actorRole, action: `enquiry.${status}`, entityType: "enquiry", entityId: id });
}

/* Reads */
export async function listProfileReports(open = true) {
  return getDb().query.profileReports.findMany({ where: open ? eq(s.profileReports.status, "open") : undefined, with: { doctor: true }, orderBy: [desc(s.profileReports.createdAt)], limit: 100 });
}
export async function listCorrections(open = true) {
  return getDb().query.corrections.findMany({ where: open ? eq(s.corrections.status, "open") : undefined, with: { doctor: true }, orderBy: [desc(s.corrections.createdAt)], limit: 100 });
}
export async function listEnquiries(opts: { doctorId?: string; status?: "new" | "sent" | "contacted" | "closed" } = {}) {
  const conds = [];
  if (opts.doctorId) conds.push(eq(s.enquiries.doctorId, opts.doctorId));
  if (opts.status) conds.push(eq(s.enquiries.status, opts.status));
  return getDb().query.enquiries.findMany({ where: conds.length ? and(...conds) : undefined, with: { doctor: true, practice: { with: { facility: true } } }, orderBy: [desc(s.enquiries.createdAt)], limit: 200 });
}
