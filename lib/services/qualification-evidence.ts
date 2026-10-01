import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { todayIso } from "@/lib/db/dates";
import { audit } from "@/lib/services/audit";
import { storeFile } from "@/lib/services/files";
import { notifyDoctorOwner } from "@/lib/services/notify";
import { recomputeQuality } from "@/lib/services/doctors";
import { rateLimit } from "@/lib/security/rate-limit";
import { displayName } from "@/lib/display-name";

/**
 * Qualification certificates.
 *
 * A doctor uploads a certificate for each degree, diploma, fellowship or
 * course they list. The bytes go to `files` (private bucket, never public);
 * `qualification_evidence` ties the file to the qualification. Staff review
 * the certificate in the admin Qualifications queue, and the decision is
 * written as a `verification_checks` row that carries the file id — so every
 * "verified" qualification can be traced back to the document behind it.
 */

/** Vercel caps a request body at 4.5 MB; keep each certificate under that. */
export const CERT_MAX_BYTES = 4 * 1024 * 1024;
export const CERT_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
/** Hours after which an unreviewed certificate is flagged as overdue in admin. */
export const CERT_SLA_HOURS = 48;

export async function uploadCertificate(userId: string, file: { name: string; type: string; bytes: Buffer }) {
  const rl = await rateLimit(`certificate:${userId}`, Number(process.env.RATE_LIMIT_CERTIFICATE ?? 30), 3600);
  if (!rl.ok) throw new Error("Too many uploads in the last hour. Try again later.");
  if (!(CERT_MIME as readonly string[]).includes(file.type)) throw new Error("Upload the certificate as a PDF, JPEG, PNG or WebP.");
  if (file.bytes.length > CERT_MAX_BYTES) throw new Error("Keep each certificate under 4 MB. A phone photo or a scanned PDF is fine.");
  return storeFile({ bucket: "private", filename: file.name || "certificate", mime: file.type, bytes: file.bytes, uploadedByUserId: userId });
}

/**
 * The file ids a form sends back are only trusted if this user uploaded them
 * and they are still private. Anything else is dropped silently.
 */
export async function ownCertificateIds(userId: string, ids: string[]): Promise<Set<string>> {
  const clean = ids.filter((x) => /^[0-9a-f-]{36}$/i.test(x));
  if (!clean.length) return new Set();
  const rows = await getDb()
    .select({ id: s.files.id })
    .from(s.files)
    .where(and(inArray(s.files.id, clean), eq(s.files.uploadedByUserId, userId), eq(s.files.bucket, "private")));
  return new Set(rows.map((r) => r.id));
}

/** Link an uploaded certificate to a qualification and put it in the admin queue. */
export async function attachCertificate(qualificationId: string, fileId: string, userId: string | null) {
  const db = getDb();
  const [q] = await db.select().from(s.doctorQualifications).where(eq(s.doctorQualifications.id, qualificationId)).limit(1);
  if (!q) throw new Error("Qualification not found.");
  // A newer upload supersedes an older one still waiting; the older stays on record.
  const [row] = await db.insert(s.qualificationEvidence).values({ qualificationId, doctorId: q.doctorId, fileId, uploadedByUserId: userId }).returning();
  if (q.state === "rejected") await db.update(s.doctorQualifications).set({ state: "submitted", checkedOn: null }).where(eq(s.doctorQualifications.id, q.id));
  await audit({ actorUserId: userId, action: "doctor.qualification.certificate_supplied", entityType: "doctor", entityId: q.doctorId, after: { qualificationId, evidenceId: row.id, fileId } });
  return row;
}

/** Doctor adds a qualification or course from the dashboard; a certificate is required. */
export async function addQualificationWithCertificate(doctorId: string, userId: string, q: { degree: string; institution: string; year: number | null }, fileId: string) {
  const degree = q.degree.trim().slice(0, 120);
  const institution = q.institution.trim().slice(0, 200);
  if (!degree || !institution) throw new Error("Enter the qualification and the institution that awarded it.");
  if (q.year !== null && (q.year < 1940 || q.year > new Date().getFullYear())) throw new Error("Check the year.");
  const owned = await ownCertificateIds(userId, [fileId]);
  if (!owned.has(fileId)) throw new Error("Upload the certificate for this qualification.");
  const db = getDb();
  const [row] = await db.insert(s.doctorQualifications).values({ doctorId, degree, institution, year: q.year, state: "submitted", sort: 99 }).returning();
  await audit({ actorUserId: userId, action: "doctor.qualification_added", entityType: "doctor", entityId: doctorId, after: row });
  await attachCertificate(row.id, fileId, userId);
  await recomputeQuality(doctorId);
  return row;
}

export interface CertificateQueueItem {
  evidenceId: string;
  fileId: string;
  filename: string;
  mime: string;
  size: number;
  createdAt: Date;
  qualificationId: string;
  degree: string;
  institution: string;
  year: number | null;
  qualificationState: string;
  doctorId: string;
  doctorName: string;
  doctorSlug: string;
  specialtyKey: string;
}

export async function certificateQueue(status: "supplied" | "checked" | "rejected" = "supplied", limit = 200): Promise<CertificateQueueItem[]> {
  const e = s.qualificationEvidence;
  const rows = await getDb()
    .select({
      evidenceId: e.id,
      fileId: e.fileId,
      filename: s.files.filename,
      mime: s.files.mime,
      size: s.files.size,
      createdAt: e.createdAt,
      qualificationId: e.qualificationId,
      degree: s.doctorQualifications.degree,
      institution: s.doctorQualifications.institution,
      year: s.doctorQualifications.year,
      qualificationState: s.doctorQualifications.state,
      doctorId: e.doctorId,
      doctorName: s.doctors.name,
      doctorSlug: s.doctors.slug,
      specialtyKey: s.doctors.specialtyKey,
    })
    .from(e)
    .innerJoin(s.files, eq(s.files.id, e.fileId))
    .innerJoin(s.doctorQualifications, eq(s.doctorQualifications.id, e.qualificationId))
    .innerJoin(s.doctors, eq(s.doctors.id, e.doctorId))
    .where(eq(e.status, status))
    .orderBy(status === "supplied" ? asc(e.createdAt) : desc(e.decidedAt))
    .limit(limit);
  return rows;
}

export async function pendingCertificateCount(): Promise<number> {
  const rows = await getDb().select({ id: s.qualificationEvidence.id }).from(s.qualificationEvidence).where(eq(s.qualificationEvidence.status, "supplied"));
  return rows.length;
}

/** All certificates for one doctor, newest first — for the admin doctor page and the dashboard. */
export async function certificatesForDoctor(doctorId: string) {
  return getDb()
    .select({ id: s.qualificationEvidence.id, qualificationId: s.qualificationEvidence.qualificationId, fileId: s.qualificationEvidence.fileId, status: s.qualificationEvidence.status, note: s.qualificationEvidence.note, createdAt: s.qualificationEvidence.createdAt, filename: s.files.filename })
    .from(s.qualificationEvidence)
    .innerJoin(s.files, eq(s.files.id, s.qualificationEvidence.fileId))
    .where(eq(s.qualificationEvidence.doctorId, doctorId))
    .orderBy(desc(s.qualificationEvidence.createdAt));
}

/**
 * Staff decision on one certificate.
 *
 *  verified → qualification verified, check recorded with the file as evidence
 *  rejected → qualification stays unverified (shown as pending), the doctor is
 *             emailed the reason and can upload a better copy
 */
export async function decideCertificate(evidenceId: string, decision: "verified" | "rejected", staffUserId: string, note?: string) {
  const db = getDb();
  const [ev] = await db.select().from(s.qualificationEvidence).where(eq(s.qualificationEvidence.id, evidenceId)).limit(1);
  if (!ev) throw new Error("Certificate not found.");
  if (ev.status !== "supplied") throw new Error("This certificate has already been decided.");
  if (decision === "rejected" && !note?.trim()) throw new Error("Say why the certificate was not accepted; the doctor sees this.");
  const [q] = await db.select().from(s.doctorQualifications).where(eq(s.doctorQualifications.id, ev.qualificationId)).limit(1);
  if (!q) throw new Error("Qualification not found.");

  await db.transaction(async (tx) => {
    await tx.update(s.qualificationEvidence).set({ status: decision === "verified" ? "checked" : "rejected", note: note?.trim() || null, decidedAt: new Date(), decidedByUserId: staffUserId }).where(eq(s.qualificationEvidence.id, ev.id));
    if (decision === "verified") {
      await tx.update(s.doctorQualifications).set({ state: "verified", checkedOn: todayIso() }).where(eq(s.doctorQualifications.id, q.id));
      // Any other copy still waiting for the same qualification is now moot.
      await tx.update(s.qualificationEvidence).set({ status: "checked", note: "Superseded: qualification verified from another upload", decidedAt: new Date(), decidedByUserId: staffUserId }).where(and(eq(s.qualificationEvidence.qualificationId, q.id), eq(s.qualificationEvidence.status, "supplied")));
    }
    await tx.insert(s.verificationChecks).values({
      doctorId: q.doctorId,
      kind: "qualification",
      subjectId: q.id,
      result: decision === "verified" ? "verified" : "failed",
      source: "Certificate supplied by the doctor",
      evidenceFileId: ev.fileId,
      checkedByUserId: staffUserId,
      note: note?.trim() || null,
    });
  });
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: `doctor.qualification.certificate_${decision}`, entityType: "doctor", entityId: q.doctorId, after: { qualificationId: q.id, evidenceId: ev.id, fileId: ev.fileId }, reason: note });
  await recomputeQuality(q.doctorId);

  const [d] = await db.select({ name: s.doctors.name, specialtyKey: s.doctors.specialtyKey }).from(s.doctors).where(eq(s.doctors.id, q.doctorId)).limit(1);
  await notifyDoctorOwner(q.doctorId, { kind: "qualification", decision, degree: q.degree, doctorName: d ? displayName(d) : "your profile", note: note?.trim() || null });
  return { doctorId: q.doctorId };
}
