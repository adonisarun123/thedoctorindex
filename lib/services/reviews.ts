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
import { displayName } from "@/lib/display-name";
import { questionsForSpecialty } from "@/lib/reviews/questions";
import { publicAuthorLabel } from "@/lib/reviews/author-label";
import { sameSourceBurst } from "@/lib/reviews/burst";
import { bookingProvesVisit } from "@/lib/reviews/invite";
import { overallScore, validateRatings } from "@/lib/reviews/score";

/**
 * Reviews (plan §10). Submission runs automated checks and lands in a
 * moderation queue; nothing is public until a person approves it. Evidence
 * is private, validated separately, and purged after the retention window.
 */

export interface ReviewInput {
  forWhom: "self" | "family";
  visitMonth: string;
  mode: "In person" | "Online";
  /** Question key → 1..5, validated against the doctor's questionnaire. */
  ratings: Record<string, number>;
  /** Optional comment; empty when the reviewer only rated. */
  text: string;
  attestation: boolean;
  /** Show as "Reviewer A.S." instead of first name + initial. */
  anonymous?: boolean;
  /** Booking reference from the invite link (TDI-BK-…). Optional: a qualifying booking is found without it too. */
  bookingRef?: string | null;
}

/**
 * The reviewer's own TDi booking with this doctor, if one has passed: the
 * site's record of the visit, which makes the review "Verified visit" with
 * no document. With a ref from the invite link that booking is checked; without
 * one, the most recent qualifying booking is used.
 */
export async function qualifyingAppointment(userId: string, doctorId: string, ref?: string | null) {
  const db = getDb();
  const rows = await db
    .select({ id: s.appointments.id, ref: s.appointments.ref, status: s.appointments.status, startsAt: s.appointments.startsAt, endsAt: s.appointments.endsAt })
    .from(s.appointments)
    .where(and(eq(s.appointments.patientUserId, userId), eq(s.appointments.doctorId, doctorId), ...(ref ? [eq(s.appointments.ref, ref.trim().toUpperCase())] : [])))
    .orderBy(desc(s.appointments.startsAt))
    .limit(10);
  const now = new Date();
  return rows.find((a) => bookingProvesVisit(a, now)) ?? null;
}

/** Hard cap on how long proof can sit unmoderated before the bytes go anyway. */
const EVIDENCE_MAX_DAYS = () => Number(process.env.RETENTION_REVIEW_EVIDENCE_DAYS ?? 30);

/** Automated pre-moderation (plan §10.1 step 6). Flags, never decides. */
/**
 * Proof of consultation is optional (policy change 11 Oct 2026): a review is
 * published after moderation with or without it. A review that carries a
 * document is published only once a moderator has looked at it, and gets the
 * "Verified visit" badge when the document checks out. REVIEW_EVIDENCE_STRICT=1
 * restores the old rule that every review must carry proof. (The old
 * REVIEW_EVIDENCE_REQUIRED variable is ignored: production still carries it
 * set to 1 from the launch config, and this change is a policy decision.)
 */
export function evidenceRequired(): boolean {
  const v = process.env.REVIEW_EVIDENCE_STRICT;
  return v === "1" || v === "true";
}

export function assessRisk(text: string): { score: number; flags: string[] } {
  const flags: string[] = [];
  const t = text.trim();
  if (/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/.test(t)) flags.push("phone_number");
  if (/\b(?:\d{1,4}[,\s]+)?(?:main|cross|road|street|layout|nagar|block)\b/i.test(t) && /\d/.test(t)) flags.push("address_like");
  if (/\b(hba1c|creatinine|biopsy|hiv|hepatitis|tumou?r|cancer|psychiatr|pregnan|abortion|std|sti)\b/i.test(t)) flags.push("health_detail");
  if (/\b(negligen|malpractice|fraud|police|court|fir\b|extort|threat|assault|molest)\b/i.test(t)) flags.push("serious_allegation");
  if (/\b(best|worst|no\.?\s*1|scam)\b/i.test(t)) flags.push("superlative");
  // The comment is optional; only a non-empty but trivially short one is worth a look.
  if (t.length > 0 && t.length < Number(process.env.REVIEW_MIN_TEXT_CHARS ?? 15)) flags.push("too_short");
  if (/(.)\1{6,}/.test(t) || /https?:\/\//i.test(t)) flags.push("spam_pattern");
  const weights: Record<string, number> = { phone_number: 30, address_like: 20, health_detail: 25, serious_allegation: 40, superlative: 5, too_short: 10, spam_pattern: 30 };
  const score = Math.min(100, flags.reduce((a, f) => a + (weights[f] ?? 0), 0));
  return { score, flags };
}

export async function submitReview(userId: string, doctorId: string, input: ReviewInput, evidence?: { filename: string; mime: string; bytes: Buffer } | null, meta?: { ip?: string | null; deviceHash?: string | null }) {
  const db = getDb();
  if (!input.attestation) throw new Error("The first-hand attestation is required.");
  if (evidenceRequired() && !evidence) throw new Error("Upload the prescription from this consultation (a bill or appointment confirmation from this doctor also works).");
  const [doc] = await db.select({ specialtyKey: s.doctors.specialtyKey }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  if (!doc) throw new Error("Doctor not found.");
  const questions = await questionsForSpecialty(doc.specialtyKey);
  validateRatings(questions, input.ratings);
  const score = overallScore(input.ratings);
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
  // Same device or address, same doctor, same day: a desk seeding reviews. Held for a person.
  const ipHash = meta?.ip ? sha256(meta.ip, process.env.CONTACT_HASH_PEPPER ?? "tdi").slice(0, 32) : null;
  const sourceHashes = [meta?.deviceHash ?? null, ipHash].filter((h): h is string => Boolean(h));
  if (sourceHashes.length) {
    const [{ n: same }] = (await db.execute(
      sql`select count(*)::int as n from reviews where doctor_id = ${doctorId} and submitted_at > now() - interval '1 day' and (device_hash = any(${sourceHashes}) or ip_hash = any(${sourceHashes}))`,
    )) as unknown as Array<{ n: number }>;
    if (sameSourceBurst(Number(same) + 1)) {
      risk.flags.push("same_source_burst");
      risk.score = Math.min(100, risk.score + 40);
    }
  }
  // A TDi booking that has passed is the proof of visit: no document needed.
  const booking = await qualifyingAppointment(userId, doctorId, input.bookingRef);
  // Near-duplicate of a recent review on the same doctor.
  const [dupe] = input.text.trim()
    ? ((await db.execute(sql`select id from reviews where doctor_id = ${doctorId} and text <> '' and similarity(lower(text), ${input.text.toLowerCase()}) > ${Number(process.env.REVIEW_DUPLICATE_SIMILARITY_THRESHOLD ?? 0.85)} limit 1`)) as unknown as Array<{ id: string }>)
    : [];
  if (dupe) {
    risk.flags.push("duplicate_text");
    risk.score = Math.min(100, risk.score + 30);
  }

  const [u] = await db.select({ displayName: s.users.displayName, email: s.users.email, phone: s.users.phone }).from(s.users).where(eq(s.users.id, userId)).limit(1);
  const anonymous = Boolean(input.anonymous);
  const authorLabel = publicAuthorLabel(u?.displayName ?? u?.email ?? u?.phone ?? "", anonymous);

  const [review] = await db
    .insert(s.reviews)
    .values({
      doctorId,
      authorUserId: userId,
      authorLabel,
      forWhom: input.forWhom,
      visitMonth: input.visitMonth,
      mode: input.mode,
      ratings: input.ratings,
      score,
      text: input.text.trim(),
      status: "pending",
      // The booking outranks a document: it is TDi's own record of the visit.
      evidence: booking ? "checked" : evidence ? "supplied" : "none",
      appointmentId: booking?.id ?? null,
      anonymous,
      riskScore: risk.score,
      riskFlags: risk.flags,
      deviceHash: meta?.deviceHash ?? null,
      ipHash,
    })
    .returning({ id: s.reviews.id });

  if (evidence && !booking) {
    const file = await storeFile({ bucket: "private", filename: evidence.filename, mime: evidence.mime, bytes: evidence.bytes, uploadedByUserId: userId });
    // Brought forward to the moderation time once a decision is made (moderateReview).
    const purge = new Date(Date.now() + EVIDENCE_MAX_DAYS() * 86_400_000);
    await db.insert(s.reviewEvidence).values({ reviewId: review.id, fileId: file.id, purgeAfter: purge });
  }
  await audit({ actorUserId: userId, actorRole: "patient", action: "review.submitted", entityType: "review", entityId: review.id, after: { doctorId, risk, bookingRef: booking?.ref ?? null, anonymous } });
  // One invite per booking: a review written from the profile before the
  // invite went out means the invite is no longer needed.
  if (booking) await db.update(s.appointments).set({ reviewInviteSentAt: sql`coalesce(${s.appointments.reviewInviteSentAt}, now())` }).where(eq(s.appointments.id, booking.id));
  return { id: review.id, risk, verifiedByBooking: Boolean(booking) };
}

export async function moderateReview(id: string, decision: "published" | "redacted" | "rejected" | "removed", staffUserId: string, opts: { publishedText?: string; reason?: string } = {}) {
  const db = getDb();
  const [r] = await db.select().from(s.reviews).where(eq(s.reviews.id, id)).limit(1);
  if (!r) throw new Error("review not found");
  if (decision === "redacted" && !opts.publishedText?.trim()) throw new Error("A redacted review needs the redacted text.");
  // A document, when supplied, is looked at before the review goes out: it
  // decides the "Verified visit" badge, and a document found to be false
  // sinks the review (someone forging proof is not a first-hand reviewer).
  // With no document the review is judged on its text alone.
  if (decision === "published" || decision === "redacted") {
    if (r.evidence === "rejected") throw new Error("The proof of consultation was rejected; this review can only be rejected.");
    if (r.evidence === "supplied") throw new Error("Record a decision on the uploaded document first — it decides whether the review carries the Verified visit badge.");
    if (evidenceRequired() && r.evidence !== "checked") throw new Error("A review is published only after its prescription, bill or appointment record has been checked.");
  }
  await db.update(s.reviews).set({ status: decision, publishedText: decision === "redacted" ? opts.publishedText : null, moderatedAt: new Date(), moderatedByUserId: staffUserId, moderationReason: opts.reason ?? null }).where(eq(s.reviews.id, id));
  // The prescription has done its job once the review is decided: the nightly
  // maintenance run deletes the bytes; the evidence row stays as the record that a check happened.
  await db.update(s.reviewEvidence).set({ purgeAfter: new Date() }).where(eq(s.reviewEvidence.reviewId, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `review.${decision}`, entityType: "review", entityId: id, before: { status: r.status }, after: { status: decision }, reason: opts.reason });
  await recomputeQuality(r.doctorId);
  const [dn] = await db.select({ name: s.doctors.name, slug: s.doctors.slug, specialtyKey: s.doctors.specialtyKey }).from(s.doctors).where(eq(s.doctors.id, r.doctorId)).limit(1);
  await notifyUser(r.authorUserId, { kind: "review", decision, doctorName: dn ? displayName(dn) : "", slug: dn?.slug ?? "", reason: opts.reason });
  if (decision === "published" || decision === "redacted") await notifyDoctorOwner(r.doctorId, { kind: "review_received", doctorName: dn ? displayName(dn) : "", authorLabel: r.authorLabel });
}

export async function validateEvidence(evidenceId: string, outcome: "checked" | "rejected", staffUserId: string, note?: string) {
  const db = getDb();
  const [e] = await db.update(s.reviewEvidence).set({ outcome, validatedAt: new Date(), validatedByUserId: staffUserId, note }).where(eq(s.reviewEvidence.id, evidenceId)).returning();
  if (!e) throw new Error("evidence not found");
  await db.update(s.reviews).set({ evidence: outcome }).where(eq(s.reviews.id, e.reviewId));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `evidence.${outcome}`, entityType: "review", entityId: e.reviewId, reason: note });
  if (outcome === "rejected") {
    // A false document sinks the review. Decided here so the queue never holds an unpublishable item.
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
  const [dn] = await db.select({ name: s.doctors.name, specialtyKey: s.doctors.specialtyKey }).from(s.doctors).where(eq(s.doctors.id, r.doctorId)).limit(1);
  await notifyDoctorOwner(r.doctorId, { kind: "reply", decision, doctorName: dn ? displayName(dn) : "", reason });
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
  // A doctor's dispute is decided by someone other than the moderator who
  // published the review — the dashboard promises this, so it is enforced here.
  const [rp] = await db
    .select({ reporterUserId: s.reviewReports.reporterUserId, moderatedBy: s.reviews.moderatedByUserId, doctorOwner: s.doctors.claimedByUserId })
    .from(s.reviewReports)
    .innerJoin(s.reviews, eq(s.reviews.id, s.reviewReports.reviewId))
    .innerJoin(s.doctors, eq(s.doctors.id, s.reviews.doctorId))
    .where(eq(s.reviewReports.id, id))
    .limit(1);
  if (!rp) throw new Error("report not found");
  const byDoctor = Boolean(rp.reporterUserId && rp.doctorOwner && rp.reporterUserId === rp.doctorOwner);
  if (byDoctor && status !== "assessed" && rp.moderatedBy === staffUserId) throw new Error("This is the doctor's dispute of a review you published. A second moderator has to decide it — leave it as assessed and hand it over.");
  await db.update(s.reviewReports).set({ status, assessedAt: status === "assessed" ? new Date() : undefined, resolvedAt: status === "assessed" ? null : new Date(), resolvedByUserId: staffUserId, resolution: resolution ?? null }).where(eq(s.reviewReports.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `review_report.${status}`, entityType: "review_report", entityId: id, reason: resolution });
}

/* Moderation queue reads */
export async function listReviewQueue(status: "pending" | "published" | "redacted" | "rejected" | "removed" = "pending", limit = 100) {
  return getDb().query.reviews.findMany({ where: eq(s.reviews.status, status), with: { doctor: true, response: true, evidenceFiles: true, reports: true, appointment: { columns: { ref: true, startsAt: true, status: true } }, author: { columns: { displayName: true, email: true, phone: true } } }, orderBy: [desc(s.reviews.riskScore), desc(s.reviews.submittedAt)], limit });
}
export async function listResponseQueue() {
  return getDb().query.doctorResponses.findMany({ where: eq(s.doctorResponses.status, "pending"), with: { review: { with: { doctor: true } } }, orderBy: [desc(s.doctorResponses.createdAt)], limit: 100 });
}
export async function listReviewReports(open = true) {
  return getDb().query.reviewReports.findMany({ where: open ? eq(s.reviewReports.status, "open") : gt(s.reviewReports.createdAt, new Date(0)), with: { review: { with: { doctor: true } } }, orderBy: [desc(s.reviewReports.createdAt)], limit: 100 });
}
export async function listDoctorReviewsForDashboard(doctorId: string) {
  return getDb().query.reviews.findMany({ where: and(eq(s.reviews.doctorId, doctorId), sql`${s.reviews.status} in ('published','redacted')`), with: { response: true, appointment: { columns: { ref: true } } }, orderBy: [desc(s.reviews.submittedAt)] });
}
