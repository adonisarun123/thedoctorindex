import "server-only";

import { and, desc, eq, gt, sql } from "drizzle-orm";

import { sha256 } from "@/lib/auth/hash";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { notifyDoctorOwner, notifyUser } from "@/lib/services/notify";
import { recomputeQuality } from "@/lib/services/doctors";
import { storeFile } from "@/lib/services/files";
import { rateLimit } from "@/lib/security/rate-limit";

/**
 * Reviews (plan §10). Submission runs automated checks and lands in a
 * moderation queue; nothing is public until a person approves it. Evidence
 * is private, validated separately, and purged after the retention window.
 */

export interface ReviewInput {
  forWhom: "self" | "family";
  visitMonth: string;
  mode: "In person" | "Online";
  communication: number;
  explanation: number;
  waitTime: number;
  facility: number;
  text: string;
  attestation: boolean;
}

/** Automated pre-moderation (plan §10.1 step 6). Flags, never decides. */
/** Every review must carry proof of consultation unless REVIEW_EVIDENCE_REQUIRED=0. */
export function evidenceRequired(): boolean {
  const v = process.env.REVIEW_EVIDENCE_REQUIRED;
  return !(v === "0" || v === "false");
}

export function assessRisk(text: string): { score: number; flags: string[] } {
  const flags: string[] = [];
  const t = text.trim();
  if (/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/.test(t)) flags.push("phone_number");
  if (/\b(?:\d{1,4}[,\s]+)?(?:main|cross|road|street|layout|nagar|block)\b/i.test(t) && /\d/.test(t)) flags.push("address_like");
  if (/\b(hba1c|creatinine|biopsy|hiv|hepatitis|tumou?r|cancer|psychiatr|pregnan|abortion|std|sti)\b/i.test(t)) flags.push("health_detail");
  if (/\b(negligen|malpractice|fraud|police|court|fir\b|extort|threat|assault|molest)\b/i.test(t)) flags.push("serious_allegation");
  if (/\b(best|worst|no\.?\s*1|scam)\b/i.test(t)) flags.push("superlative");
  if (t.length < Number(process.env.REVIEW_MIN_TEXT_CHARS ?? 40)) flags.push("too_short");
  if (/(.)\1{6,}/.test(t) || /https?:\/\//i.test(t)) flags.push("spam_pattern");
  const weights: Record<string, number> = { phone_number: 30, address_like: 20, health_detail: 25, serious_allegation: 40, superlative: 5, too_short: 10, spam_pattern: 30 };
  const score = Math.min(100, flags.reduce((a, f) => a + (weights[f] ?? 0), 0));
  return { score, flags };
}

export async function submitReview(userId: string, doctorId: string, input: ReviewInput, evidence?: { filename: string; mime: string; bytes: Buffer } | null, meta?: { ip?: string | null; deviceHash?: string | null }) {
  const db = getDb();
  if (!input.attestation) throw new Error("The first-hand attestation is required.");
  if (evidenceRequired() && !evidence) throw new Error("Attach proof of the consultation — a prescription, bill, receipt or appointment confirmation from this doctor or practice. Reviews without it are not accepted.");
  for (const k of ["communication", "explanation", "waitTime", "facility"] as const) {
    if (!(input[k] >= 1 && input[k] <= 5)) throw new Error("Rate every dimension from 1 to 5.");
  }
  const maxChars = Number(process.env.REVIEW_MAX_TEXT_CHARS ?? 2000);
  if (input.text.length > maxChars) throw new Error(`Keep it under ${maxChars} characters.`);

  // The doctor, and anyone managing the profile, cannot review it.
  const [self] = await db.select({ id: s.doctors.id }).from(s.doctors).where(and(eq(s.doctors.id, doctorId), eq(s.doctors.claimedByUserId, userId))).limit(1);
  if (self) throw new Error("A doctor cannot review their own profile.");
  const [mgr] = await db.select({ id: s.doctorManagers.id }).from(s.doctorManagers).where(and(eq(s.doctorManagers.doctorId, doctorId), eq(s.doctorManagers.userId, userId), eq(s.doctorManagers.status, "active"))).limit(1);
  if (mgr) throw new Error("Clinic staff cannot review the profiles they manage.");

  const rl = await rateLimit(`review:${userId}`, Number(process.env.RATE_LIMIT_REVIEW_SUBMIT ?? 3), 86_400);
  if (!rl.ok) throw new Error("You have submitted several reviews today. Try again tomorrow.");

  const [existing] = await db.select({ id: s.reviews.id }).from(s.reviews).where(and(eq(s.reviews.doctorId, doctorId), eq(s.reviews.authorUserId, userId))).limit(1);
  if (existing) throw new Error("You have already reviewed this doctor. One person, one review.");

  // Velocity: many reviews for one doctor in a day is a signal, not a block.
  const [{ n: velocity }] = (await db.execute(sql`select count(*)::int as n from reviews where doctor_id = ${doctorId} and submitted_at > now() - interval '1 day'`)) as unknown as Array<{ n: number }>;
  const risk = assessRisk(input.text);
  if (Number(velocity) >= Number(process.env.REVIEW_VELOCITY_MAX_PER_DOCTOR_PER_DAY ?? 10)) {
    risk.flags.push("velocity");
    risk.score = Math.min(100, risk.score + 25);
  }
  // Near-duplicate of a recent review on the same doctor.
  const [dupe] = (await db.execute(sql`select id from reviews where doctor_id = ${doctorId} and similarity(lower(text), ${input.text.toLowerCase()}) > ${Number(process.env.REVIEW_DUPLICATE_SIMILARITY_THRESHOLD ?? 0.85)} limit 1`)) as unknown as Array<{ id: string }>;
  if (dupe) {
    risk.flags.push("duplicate_text");
    risk.score = Math.min(100, risk.score + 30);
  }

  const [u] = await db.select({ displayName: s.users.displayName, email: s.users.email, phone: s.users.phone }).from(s.users).where(eq(s.users.id, userId)).limit(1);
  const authorLabel = pseudonym(u?.displayName ?? u?.email ?? u?.phone ?? userId);

  const [review] = await db
    .insert(s.reviews)
    .values({
      doctorId,
      authorUserId: userId,
      authorLabel,
      forWhom: input.forWhom,
      visitMonth: input.visitMonth,
      mode: input.mode,
      communication: input.communication,
      explanation: input.explanation,
      waitTime: input.waitTime,
      facility: input.facility,
      text: input.text.trim(),
      status: "pending",
      evidence: evidence ? "supplied" : "none",
      riskScore: risk.score,
      riskFlags: risk.flags,
      deviceHash: meta?.deviceHash ?? null,
      ipHash: meta?.ip ? sha256(meta.ip, process.env.CONTACT_HASH_PEPPER ?? "tdi").slice(0, 32) : null,
    })
    .returning({ id: s.reviews.id });

  if (evidence) {
    const file = await storeFile({ bucket: "private", filename: evidence.filename, mime: evidence.mime, bytes: evidence.bytes, uploadedByUserId: userId });
    const purge = new Date(Date.now() + Number(process.env.RETENTION_REVIEW_EVIDENCE_DAYS ?? 90) * 86_400_000);
    await db.insert(s.reviewEvidence).values({ reviewId: review.id, fileId: file.id, purgeAfter: purge });
  }
  await audit({ actorUserId: userId, actorRole: "patient", action: "review.submitted", entityType: "review", entityId: review.id, after: { doctorId, risk } });
  return { id: review.id, risk };
}

/** "Anita Sharma" → "Reviewer A.S."; an email → initials of the local part. */
function pseudonym(source: string): string {
  const base = source.includes("@") ? source.split("@")[0].replace(/[._-]+/g, " ") : source;
  const initials = base.split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).slice(0, 2).join(".");
  return `Reviewer ${initials || "A"}.`;
}

export async function moderateReview(id: string, decision: "published" | "redacted" | "rejected" | "removed", staffUserId: string, opts: { publishedText?: string; reason?: string } = {}) {
  const db = getDb();
  const [r] = await db.select().from(s.reviews).where(eq(s.reviews.id, id)).limit(1);
  if (!r) throw new Error("review not found");
  if (decision === "redacted" && !opts.publishedText?.trim()) throw new Error("A redacted review needs the redacted text.");
  // Publication is gated on validated proof of consultation (plan §10): a
  // moderator must record the evidence decision first, and a review whose
  // proof was rejected can only be rejected.
  if ((decision === "published" || decision === "redacted") && evidenceRequired()) {
    if (r.evidence === "rejected") throw new Error("The proof of consultation was rejected; this review can only be rejected.");
    if (r.evidence !== "checked") throw new Error("Validate the proof of consultation first. A review is published only after its prescription, bill or appointment record has been checked.");
  }
  await db.update(s.reviews).set({ status: decision, publishedText: decision === "redacted" ? opts.publishedText : null, moderatedAt: new Date(), moderatedByUserId: staffUserId, moderationReason: opts.reason ?? null }).where(eq(s.reviews.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `review.${decision}`, entityType: "review", entityId: id, before: { status: r.status }, after: { status: decision }, reason: opts.reason });
  await recomputeQuality(r.doctorId);
  const [dn] = await db.select({ name: s.doctors.name, slug: s.doctors.slug }).from(s.doctors).where(eq(s.doctors.id, r.doctorId)).limit(1);
  await notifyUser(r.authorUserId, { kind: "review", decision, doctorName: dn?.name ?? "", slug: dn?.slug ?? "", reason: opts.reason });
  if (decision === "published" || decision === "redacted") await notifyDoctorOwner(r.doctorId, { kind: "review_received", doctorName: dn?.name ?? "", authorLabel: r.authorLabel });
}

export async function validateEvidence(evidenceId: string, outcome: "checked" | "rejected", staffUserId: string, note?: string) {
  const db = getDb();
  const [e] = await db.update(s.reviewEvidence).set({ outcome, validatedAt: new Date(), validatedByUserId: staffUserId, note }).where(eq(s.reviewEvidence.id, evidenceId)).returning();
  if (!e) throw new Error("evidence not found");
  await db.update(s.reviews).set({ evidence: outcome }).where(eq(s.reviews.id, e.reviewId));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `evidence.${outcome}`, entityType: "review", entityId: e.reviewId, reason: note });
  if (outcome === "rejected" && evidenceRequired()) {
    // No valid proof, no review. Decided here so the queue never holds an unpublishable item.
    const [rv] = await db.select({ status: s.reviews.status }).from(s.reviews).where(eq(s.reviews.id, e.reviewId)).limit(1);
    if (rv && (rv.status === "pending" || rv.status === "published" || rv.status === "redacted")) {
      await moderateReview(e.reviewId, rv.status === "pending" ? "rejected" : "removed", staffUserId, { reason: `Proof of consultation not valid${note ? `: ${note}` : ""}` });
    }
  }
}

export async function submitResponse(doctorId: string, doctorUserId: string, reviewId: string, text: string) {
  const db = getDb();
  const [r] = await db.select({ id: s.reviews.id, doctorId: s.reviews.doctorId }).from(s.reviews).where(and(eq(s.reviews.id, reviewId), eq(s.reviews.doctorId, doctorId))).limit(1);
  if (!r) throw new Error("review not found");
  const max = Number(process.env.REVIEW_REPLY_MAX_CHARS ?? 800);
  if (text.trim().length === 0 || text.length > max) throw new Error(`Reply must be 1–${max} characters.`);
  const risk = assessRisk(text);
  const [row] = await db
    .insert(s.doctorResponses)
    .values({ reviewId, doctorId, text: text.trim(), status: "pending" })
    .onConflictDoUpdate({ target: s.doctorResponses.reviewId, set: { text: text.trim(), status: "pending", moderatedAt: null, moderatedByUserId: null } })
    .returning();
  await audit({ actorUserId: doctorUserId, actorRole: "doctor", action: "response.submitted", entityType: "review", entityId: reviewId, after: { risk } });
  return row;
}

export async function moderateResponse(responseId: string, decision: "published" | "rejected", staffUserId: string, reason?: string) {
  const db = getDb();
  const [r] = await db.update(s.doctorResponses).set({ status: decision, moderatedAt: new Date(), moderatedByUserId: staffUserId, moderationReason: reason ?? null }).where(eq(s.doctorResponses.id, responseId)).returning();
  if (!r) throw new Error("response not found");
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `response.${decision}`, entityType: "review", entityId: r.reviewId, reason });
  await recomputeQuality(r.doctorId);
  const [dn] = await db.select({ name: s.doctors.name }).from(s.doctors).where(eq(s.doctors.id, r.doctorId)).limit(1);
  await notifyDoctorOwner(r.doctorId, { kind: "reply", decision, doctorName: dn?.name ?? "", reason });
}

export async function reportReview(reviewId: string, reporterUserId: string | null, reason: string, detail: string | null, contact: string | null) {
  const db = getDb();
  const priority = /health|personal information|threat|abusive|allegation/i.test(reason) ? "safety" : "normal";
  const [row] = await db.insert(s.reviewReports).values({ reviewId, reporterUserId, reason, detail, contact, priority }).returning();
  await audit({ actorUserId: reporterUserId, action: "review.reported", entityType: "review", entityId: reviewId, after: { reason, priority } });
  return row;
}

export async function resolveReviewReport(id: string, status: "assessed" | "resolved" | "dismissed", staffUserId: string, resolution?: string) {
  const db = getDb();
  await db.update(s.reviewReports).set({ status, assessedAt: status === "assessed" ? new Date() : undefined, resolvedAt: status === "assessed" ? null : new Date(), resolvedByUserId: staffUserId, resolution: resolution ?? null }).where(eq(s.reviewReports.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `review_report.${status}`, entityType: "review_report", entityId: id, reason: resolution });
}

/* Moderation queue reads */
export async function listReviewQueue(status: "pending" | "published" | "redacted" | "rejected" | "removed" = "pending", limit = 100) {
  return getDb().query.reviews.findMany({ where: eq(s.reviews.status, status), with: { doctor: true, response: true, evidenceFiles: true, reports: true }, orderBy: [desc(s.reviews.riskScore), desc(s.reviews.submittedAt)], limit });
}
export async function listResponseQueue() {
  return getDb().query.doctorResponses.findMany({ where: eq(s.doctorResponses.status, "pending"), with: { review: { with: { doctor: true } } }, orderBy: [desc(s.doctorResponses.createdAt)], limit: 100 });
}
export async function listReviewReports(open = true) {
  return getDb().query.reviewReports.findMany({ where: open ? eq(s.reviewReports.status, "open") : gt(s.reviewReports.createdAt, new Date(0)), with: { review: { with: { doctor: true } } }, orderBy: [desc(s.reviewReports.createdAt)], limit: 100 });
}
export async function listDoctorReviewsForDashboard(doctorId: string) {
  return getDb().query.reviews.findMany({ where: and(eq(s.reviews.doctorId, doctorId), sql`${s.reviews.status} in ('published','redacted')`), with: { response: true }, orderBy: [desc(s.reviews.submittedAt)] });
}
