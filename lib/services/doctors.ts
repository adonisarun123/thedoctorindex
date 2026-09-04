import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { env } from "@/lib/env";
import { getDb } from "@/lib/db/client";
import { daysBetween, todayIso } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";

/**
 * Doctor record service: creation by staff, direct edits by staff, lifecycle,
 * quality scoring and revision snapshots. Doctor-initiated edits go through
 * lib/services/changes.ts so sensitive fields return to verification.
 */

const publicIdGen = customAlphabet("0123456789abcdef", 6);

export function slugify(name: string, publicId: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-") || "doctor"}-${publicId}`;
}
export function normalizeKey(v: string): string {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Fields that return to verification before they change publicly (plan §4). */
export const SENSITIVE_FIELDS = new Set(["name", "specialtyKey", "registration", "qualification", "gender"]);

/* ------------------------------------------------------------------------- */
/* Quality score                                                              */
/* ------------------------------------------------------------------------- */

/**
 * 0–100 completeness and currency score. The public index gate is
 * GATE_PROFILE_QUALITY (default 70). Recomputed after every write that can
 * change it, so the gate, the dashboard checklist and the ranking agree.
 */
export async function recomputeQuality(doctorId: string): Promise<{ score: number; checklist: Array<{ label: string; detail: string; points: number; done: boolean }> }> {
  const db = getDb();
  const d = await db.query.doctors.findFirst({
    where: eq(s.doctors.id, doctorId),
    with: { registrations: true, qualifications: true, practices: { where: (p, { eq }) => eq(p.active, true), with: { facility: true } }, reviews: { with: { response: true } } },
  });
  if (!d) throw new Error("doctor not found");

  const regVerified = d.registrations.some((r) => r.checkedOn);
  const quals = d.qualifications;
  const qualsVerified = quals.length > 0 && quals.every((q) => q.state === "verified");
  const practicesConfirmed = d.practices.length > 0 && d.practices.every((p) => (p.confirmedOn ?? p.facility.confirmedOn) && daysBetween((p.confirmedOn ?? p.facility.confirmedOn)!) <= env.freshness.practiceDays);
  const feesFresh = d.practices.length > 0 && d.practices.every((p) => p.feeInr !== null && p.feeCheckedOn && daysBetween(p.feeCheckedOn) <= env.freshness.feeDays);
  const aboutOk = d.about.trim().length >= 80 && !/\b(best|no\.?\s*1|top|most trusted)\b/i.test(d.about);
  const servicesOk = d.services.length >= 3;
  const langsOk = d.languages.length >= 1 && d.modes.length >= 1;
  const photoOk = Boolean(d.photoFileId) && d.photoConsent;
  const published = d.reviews.filter((r) => r.status === "published" || r.status === "redacted");
  const repliedOk = published.length === 0 || published.every((r) => r.response && r.response.status === "published");

  const checklist = [
    { label: "Registration verified", detail: regVerified ? `${d.registrations[0]?.council} · ${d.registrations[0]?.number}` : "Not yet matched in the register", points: 22, done: regVerified },
    { label: "All qualifications verified", detail: `${quals.filter((q) => q.state === "verified").length} of ${quals.length} found in the awarding body's record`, points: 15, done: qualsVerified },
    { label: "Practice locations confirmed", detail: practicesConfirmed ? `${d.practices.length} of ${d.practices.length} reconfirmed within ${env.freshness.practiceDays} days` : "At least one practice needs reconfirmation", points: 17, done: practicesConfirmed },
    { label: "Consultation fees current", detail: feesFresh ? `All reconfirmed within ${env.freshness.feeDays} days` : `A fee is missing or older than ${env.freshness.feeDays} days`, points: 10, done: feesFresh },
    { label: "Professional introduction", detail: aboutOk ? "Factual, 80+ characters, no superlatives" : "Add 2–4 factual sentences; superlatives are rejected", points: 10, done: aboutOk },
    { label: "Services from the controlled list", detail: `${d.services.length} listed (3 needed)`, points: 8, done: servicesOk },
    { label: "Languages and consultation modes", detail: `${d.languages.length} languages · ${d.modes.join(", ") || "no modes"}`, points: 6, done: langsOk },
    { label: "Photograph with usage consent", detail: photoOk ? "Published" : "No photograph supplied. Optional; improves recognition at the clinic.", points: 4, done: photoOk },
    { label: "HPR ID linked", detail: d.hprVerified ? "Healthcare Professionals Registry match found" : "Not linked", points: 6, done: d.hprVerified },
    { label: "Replied to recent reviews", detail: `${published.filter((r) => r.response?.status === "published").length} of ${published.length} written reviews has a reply`, points: 2, done: repliedOk },
  ];
  const score = checklist.filter((c) => c.done).reduce((a, c) => a + c.points, 0);
  if (score !== d.qualityScore) await db.update(s.doctors).set({ qualityScore: score }).where(eq(s.doctors.id, doctorId));
  return { score, checklist };
}

/* ------------------------------------------------------------------------- */
/* Revisions                                                                  */
/* ------------------------------------------------------------------------- */

export async function snapshotRevision(doctorId: string, reason: string, actorUserId: string | null): Promise<void> {
  const db = getDb();
  const d = await db.query.doctors.findFirst({
    where: eq(s.doctors.id, doctorId),
    with: { registrations: true, qualifications: true, experience: true, practices: { with: { facility: true } } },
  });
  if (!d) return;
  await db.insert(s.profileRevisions).values({ doctorId, snapshot: d, reason, createdByUserId: actorUserId });
}

/* ------------------------------------------------------------------------- */
/* Staff: create and edit                                                     */
/* ------------------------------------------------------------------------- */

export interface NewDoctorInput {
  name: string;
  gender?: "F" | "M" | "X" | null;
  specialtyKey: string;
  subspecialties?: string[];
  practiceStartYear?: number | null;
  languages?: string[];
  modes?: string[];
  about?: string;
  services?: string[];
  registration: { number: string; council: string; registeredYear?: number | null; verified?: boolean };
  qualifications?: Array<{ degree: string; institution: string; year?: number | null; verified?: boolean }>;
  experience?: Array<{ role: string; place: string; fromYear: number; toYear?: number | null }>;
  practices?: Array<{ facilityId?: string; facilityName?: string; localityKey?: string; address?: string; postalCode?: string; days?: string; hours?: string; feeInr?: number | null; phone?: string; confirmed?: boolean }>;
  status?: "draft" | "published";
  source?: string;
  claimedByUserId?: string | null;
}

export async function createDoctor(input: NewDoctorInput, actorUserId: string | null, actorRole = "staff"): Promise<{ id: string; slug: string; publicId: string }> {
  const db = getDb();
  const regNorm = normalizeKey(input.registration.number);
  const councilNorm = normalizeKey(input.registration.council);
  const [dup] = await db.select({ doctorId: s.medicalRegistrations.doctorId }).from(s.medicalRegistrations).where(and(eq(s.medicalRegistrations.numberNormalized, regNorm), eq(s.medicalRegistrations.councilNormalized, councilNorm))).limit(1);
  if (dup) throw new Error(`A profile already exists for ${input.registration.council} ${input.registration.number}`);

  let publicId = publicIdGen();
  for (let i = 0; i < 5; i++) {
    const [clash] = await db.select({ id: s.doctors.id }).from(s.doctors).where(eq(s.doctors.publicId, publicId)).limit(1);
    if (!clash) break;
    publicId = publicIdGen();
  }
  const slug = slugify(input.name, publicId);
  const today = todayIso();

  const created = await db.transaction(async (tx) => {
    const [doc] = await tx
      .insert(s.doctors)
      .values({
        publicId,
        slug,
        name: input.name.trim(),
        gender: input.gender ?? null,
        specialtyKey: input.specialtyKey,
        subspecialties: input.subspecialties ?? [],
        practiceStartYear: input.practiceStartYear ?? null,
        languages: input.languages ?? [],
        modes: input.modes ?? ["In person"],
        about: input.about ?? "",
        services: input.services ?? [],
        status: input.status ?? "draft",
        source: input.source ?? "staff",
        claimed: Boolean(input.claimedByUserId),
        claimedByUserId: input.claimedByUserId ?? null,
        createdByUserId: actorUserId,
        publishedAt: input.status === "published" ? new Date() : null,
        lastVerifiedOn: input.registration.verified ? today : null,
      })
      .returning({ id: s.doctors.id });

    await tx.insert(s.medicalRegistrations).values({
      doctorId: doc.id,
      number: input.registration.number.trim(),
      numberNormalized: regNorm,
      council: input.registration.council.trim(),
      councilNormalized: councilNorm,
      registeredYear: input.registration.registeredYear ?? null,
      checkedOn: input.registration.verified ? today : null,
      source: input.registration.verified ? "State Medical Council register" : null,
      isPrimary: true,
    });
    if (input.registration.verified) {
      await tx.insert(s.verificationChecks).values({ doctorId: doc.id, kind: "registration", result: "verified", source: input.registration.council, checkedByUserId: actorUserId });
    }
    for (const [i, q] of (input.qualifications ?? []).entries()) {
      await tx.insert(s.doctorQualifications).values({ doctorId: doc.id, degree: q.degree, institution: q.institution, year: q.year ?? null, state: q.verified ? "verified" : "submitted", checkedOn: q.verified ? today : null, sort: i });
    }
    for (const [i, e] of (input.experience ?? []).entries()) {
      await tx.insert(s.doctorExperience).values({ doctorId: doc.id, role: e.role, place: e.place, fromYear: e.fromYear, toYear: e.toYear ?? null, sort: i });
    }
    for (const [i, p] of (input.practices ?? []).entries()) {
      let facilityId = p.facilityId;
      if (!facilityId) {
        if (!p.facilityName || !p.localityKey || !p.address) continue;
        const [f] = await tx.insert(s.facilities).values({ name: p.facilityName, localityKey: p.localityKey, address: p.address, postalCode: p.postalCode ?? null, phone: p.phone ?? null, confirmedOn: p.confirmed ? today : null }).returning({ id: s.facilities.id });
        facilityId = f.id;
      }
      await tx.insert(s.doctorPractices).values({ doctorId: doc.id, facilityId, days: p.days ?? "", hours: p.hours ?? "", feeInr: p.feeInr ?? null, feeCheckedOn: p.feeInr != null ? today : null, confirmedOn: p.confirmed ? today : null, phone: p.phone ?? null, sort: i });
    }
    return doc;
  });

  await recomputeQuality(created.id);
  await snapshotRevision(created.id, "created", actorUserId);
  await audit({ actorUserId, actorRole, action: "doctor.created", entityType: "doctor", entityId: created.id, after: { name: input.name, status: input.status ?? "draft", source: input.source ?? "staff" } });
  return { id: created.id, slug, publicId };
}

/**
 * Apply one field change to a doctor. Used by staff edits and by approved
 * change requests. Field grammar:
 *   name | about | gender | specialtyKey | practiceStartYear | subspecialties |
 *   languages | modes | services | hprVerified | hprId
 *   practice.<practiceId>.(days|hours|feeInr|phone|confirmed)
 *   facility.<facilityId>.(name|address|postalCode|phone|localityKey|geo)   geo = "lat,lng" or "" (manual, confidence high)
 */
export async function applyField(doctorId: string, field: string, value: unknown, actorUserId: string | null, actorRole: string, reason?: string): Promise<{ before: unknown }> {
  const db = getDb();
  const today = todayIso();
  let before: unknown = null;

  if (field.startsWith("practice.")) {
    const [, pid, col] = field.split(".");
    const [p] = await db.select().from(s.doctorPractices).where(and(eq(s.doctorPractices.id, pid), eq(s.doctorPractices.doctorId, doctorId))).limit(1);
    if (!p) throw new Error("practice not found");
    if (col === "days" || col === "hours" || col === "phone") {
      before = p[col];
      await db.update(s.doctorPractices).set({ [col]: String(value ?? "") }).where(eq(s.doctorPractices.id, pid));
    } else if (col === "feeInr") {
      before = p.feeInr;
      const fee = value === null || value === "" ? null : Number(value);
      await db.update(s.doctorPractices).set({ feeInr: fee, feeCheckedOn: fee === null ? null : today }).where(eq(s.doctorPractices.id, pid));
    } else if (col === "confirmed") {
      before = p.confirmedOn;
      await db.update(s.doctorPractices).set({ confirmedOn: today, feeCheckedOn: p.feeInr !== null ? today : p.feeCheckedOn }).where(eq(s.doctorPractices.id, pid));
      await db.insert(s.verificationChecks).values({ doctorId, kind: "practice", subjectId: pid, result: "verified", source: "Practice confirmation", checkedByUserId: actorUserId });
    } else if (col === "active") {
      before = p.active;
      await db.update(s.doctorPractices).set({ active: Boolean(value) }).where(eq(s.doctorPractices.id, pid));
    } else throw new Error(`unknown practice field ${col}`);
  } else if (field.startsWith("facility.")) {
    const [, fid, col] = field.split(".");
    const [f] = await db.select().from(s.facilities).where(eq(s.facilities.id, fid)).limit(1);
    if (!f) throw new Error("facility not found");
    if (col === "geo") {
      before = f.lat && f.lng ? `${f.lat},${f.lng}` : null;
      const [lat, lng] = String(value ?? "").split(",").map((x) => Number(x.trim()));
      const has = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && String(value ?? "").trim() !== "";
      if (String(value ?? "").trim() !== "" && !has) throw new Error("Coordinates must be \"lat,lng\" in decimal degrees.");
      await db.update(s.facilities).set(has ? { lat: String(lat), lng: String(lng), geocodeSource: "manual", geocodeConfidence: "high" } : { lat: null, lng: null, geocodeSource: null, geocodeConfidence: null }).where(eq(s.facilities.id, fid));
    } else {
      if (!["name", "address", "postalCode", "phone", "localityKey"].includes(col)) throw new Error(`unknown facility field ${col}`);
      before = (f as Record<string, unknown>)[col];
      // An address change invalidates both the practice confirmation and any geocode.
      await db.update(s.facilities).set({ [col]: String(value ?? ""), ...(col === "address" ? { confirmedOn: null, lat: null, lng: null, geocodeSource: null, geocodeConfidence: null } : {}) }).where(eq(s.facilities.id, fid));
    }
  } else {
    const [d] = await db.select().from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
    if (!d) throw new Error("doctor not found");
    const allowed: Record<string, (v: unknown) => Partial<typeof s.doctors.$inferInsert>> = {
      name: (v) => ({ name: String(v).trim(), slug: slugify(String(v), d.publicId) }),
      about: (v) => ({ about: String(v ?? "") }),
      gender: (v) => ({ gender: v === "M" || v === "F" || v === "X" ? v : null }),
      specialtyKey: (v) => ({ specialtyKey: String(v) }),
      practiceStartYear: (v) => ({ practiceStartYear: v ? Number(v) : null }),
      subspecialties: (v) => ({ subspecialties: toList(v) }),
      languages: (v) => ({ languages: toList(v) }),
      modes: (v) => ({ modes: toList(v) }),
      services: (v) => ({ services: toList(v) }),
      hprVerified: (v) => ({ hprVerified: Boolean(v) }),
      hprId: (v) => ({ hprId: v ? String(v) : null }),
      photoConsent: (v) => ({ photoConsent: Boolean(v) }),
      phoneConsent: (v) => ({ phoneConsent: Boolean(v) }),
    };
    const fn = allowed[field];
    if (!fn) throw new Error(`unknown field ${field}`);
    before = (d as Record<string, unknown>)[field];
    const patch = fn(value);
    if (field === "name" && patch.slug && patch.slug !== d.slug) {
      await db.insert(s.slugRedirects).values({ fromPath: `/doctor/${d.slug}`, toPath: `/doctor/${patch.slug}`, reason: "name-change" }).onConflictDoUpdate({ target: s.slugRedirects.fromPath, set: { toPath: `/doctor/${patch.slug}` } });
    }
    await db.update(s.doctors).set(patch).where(eq(s.doctors.id, doctorId));
  }

  await audit({ actorUserId, actorRole, action: "doctor.field_applied", entityType: "doctor", entityId: doctorId, before: { [field]: before }, after: { [field]: value }, reason });
  await recomputeQuality(doctorId);
  return { before };
}

function toList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((x) => x.trim()).filter(Boolean);
  return String(v ?? "").split(",").map((x) => x.trim()).filter(Boolean);
}

export async function setDoctorStatus(doctorId: string, status: "published" | "suspended" | "retired" | "archived" | "draft" | "in_review", actorUserId: string, reason?: string): Promise<void> {
  const db = getDb();
  const [d] = await db.select({ status: s.doctors.status, slug: s.doctors.slug }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  if (!d) throw new Error("doctor not found");
  await db.update(s.doctors).set({
    status,
    publishedAt: status === "published" ? new Date() : undefined,
    retiredAt: status === "retired" ? new Date() : null,
    suspendedReason: status === "suspended" ? reason ?? null : null,
    lastVerifiedOn: status === "published" ? todayIso() : undefined,
  }).where(eq(s.doctors.id, doctorId));
  await snapshotRevision(doctorId, `status:${status}`, actorUserId);
  await audit({ actorUserId, actorRole: "staff", action: `doctor.status.${status}`, entityType: "doctor", entityId: doctorId, before: { status: d.status }, after: { status }, reason });
}

/** Mark `duplicateId` as merged into `targetId`: reviews move, old slug 301s. */
export async function mergeDoctor(duplicateId: string, targetId: string, actorUserId: string, reason?: string): Promise<void> {
  const db = getDb();
  const [dup] = await db.select({ slug: s.doctors.slug }).from(s.doctors).where(eq(s.doctors.id, duplicateId)).limit(1);
  const [target] = await db.select({ slug: s.doctors.slug }).from(s.doctors).where(eq(s.doctors.id, targetId)).limit(1);
  if (!dup || !target) throw new Error("doctor not found");
  await db.transaction(async (tx) => {
    // Reviews follow the surviving record; a reviewer who reviewed both keeps only the target's.
    await tx.execute(sql`update reviews r set doctor_id = ${targetId} where r.doctor_id = ${duplicateId} and not exists (select 1 from reviews t where t.doctor_id = ${targetId} and t.author_user_id = r.author_user_id)`);
    await tx.execute(sql`update doctor_responses set doctor_id = ${targetId} where doctor_id = ${duplicateId}`);
    await tx.execute(sql`update enquiries set doctor_id = ${targetId} where doctor_id = ${duplicateId}`);
    await tx.update(s.doctors).set({ status: "archived", mergedIntoId: targetId }).where(eq(s.doctors.id, duplicateId));
    await tx.insert(s.slugRedirects).values({ fromPath: `/doctor/${dup.slug}`, toPath: `/doctor/${target.slug}`, reason: "merge" }).onConflictDoUpdate({ target: s.slugRedirects.fromPath, set: { toPath: `/doctor/${target.slug}`, reason: "merge" } });
  });
  await recomputeQuality(targetId);
  await snapshotRevision(targetId, "merge-target", actorUserId);
  await audit({ actorUserId, actorRole: "staff", action: "doctor.merged", entityType: "doctor", entityId: duplicateId, after: { mergedInto: targetId }, reason });
}

/* ------------------------------------------------------------------------- */
/* Staff reads                                                                */
/* ------------------------------------------------------------------------- */

export async function listDoctorsAdmin(opts: { q?: string; status?: string; specialty?: string; limit?: number }) {
  const db = getDb();
  const conds = [];
  if (opts.status) conds.push(eq(s.doctors.status, opts.status as typeof s.doctorStatus.enumValues[number]));
  if (opts.specialty) conds.push(eq(s.doctors.specialtyKey, opts.specialty));
  if (opts.q) conds.push(or(ilike(s.doctors.name, `%${opts.q}%`), ilike(s.doctors.slug, `%${opts.q}%`), sql`exists (select 1 from medical_registrations m where m.doctor_id = ${s.doctors.id} and m.number ilike ${"%" + opts.q + "%"})`));
  return db.query.doctors.findMany({
    where: conds.length ? and(...conds) : undefined,
    with: { registrations: true, practices: { with: { facility: true } } },
    orderBy: [desc(s.doctors.updatedAt)],
    limit: opts.limit ?? 100,
  });
}

export async function getDoctorAdmin(id: string) {
  return getDb().query.doctors.findFirst({
    where: eq(s.doctors.id, id),
    with: {
      registrations: true,
      qualifications: { orderBy: (q, { asc }) => [asc(q.sort)] },
      experience: { orderBy: (e, { asc }) => [asc(e.sort)] },
      practices: { with: { facility: true }, orderBy: (p, { asc }) => [asc(p.sort)] },
      reviews: { with: { response: true, evidenceFiles: true }, orderBy: (r, { desc }) => [desc(r.submittedAt)] },
      changeRequests: { orderBy: (c, { desc }) => [desc(c.createdAt)] },
      checks: { orderBy: (c, { desc }) => [desc(c.checkedOn)] },
      managers: true,
    },
  });
}

export async function addQualification(doctorId: string, q: { degree: string; institution: string; year?: number | null }, actorUserId: string | null, verified = false) {
  const db = getDb();
  const [row] = await db.insert(s.doctorQualifications).values({ doctorId, degree: q.degree, institution: q.institution, year: q.year ?? null, state: verified ? "verified" : "submitted", checkedOn: verified ? todayIso() : null, sort: 99 }).returning();
  await audit({ actorUserId, action: "doctor.qualification_added", entityType: "doctor", entityId: doctorId, after: row });
  await recomputeQuality(doctorId);
  return row;
}

export async function setQualificationState(qualificationId: string, state: "verified" | "submitted" | "rejected", actorUserId: string, note?: string) {
  const db = getDb();
  const [q] = await db.update(s.doctorQualifications).set({ state, checkedOn: state === "verified" ? todayIso() : null }).where(eq(s.doctorQualifications.id, qualificationId)).returning();
  if (!q) throw new Error("qualification not found");
  await db.insert(s.verificationChecks).values({ doctorId: q.doctorId, kind: "qualification", subjectId: q.id, result: state === "verified" ? "verified" : state === "rejected" ? "failed" : "pending", source: q.institution, checkedByUserId: actorUserId, note });
  await audit({ actorUserId, actorRole: "staff", action: `doctor.qualification.${state}`, entityType: "doctor", entityId: q.doctorId, after: { qualificationId, state }, reason: note });
  await recomputeQuality(q.doctorId);
}

export async function markRegistrationChecked(doctorId: string, actorUserId: string, result: "verified" | "failed", note?: string) {
  const db = getDb();
  const today = todayIso();
  await db.update(s.medicalRegistrations).set({ checkedOn: result === "verified" ? today : null, status: result === "verified" ? "active" : "unverified" }).where(eq(s.medicalRegistrations.doctorId, doctorId));
  await db.insert(s.verificationChecks).values({ doctorId, kind: "registration", result, source: "State Medical Council register", checkedByUserId: actorUserId, note });
  if (result === "verified") await db.update(s.doctors).set({ lastVerifiedOn: today }).where(eq(s.doctors.id, doctorId));
  await audit({ actorUserId, actorRole: "staff", action: `doctor.registration.${result}`, entityType: "doctor", entityId: doctorId, reason: note });
  await recomputeQuality(doctorId);
}

export async function addPractice(doctorId: string, p: { facilityId?: string; facilityName?: string; localityKey?: string; address?: string; postalCode?: string; days?: string; hours?: string; feeInr?: number | null; phone?: string }, actorUserId: string | null, confirmed = false) {
  const db = getDb();
  const today = todayIso();
  let facilityId = p.facilityId;
  if (!facilityId) {
    if (!p.facilityName || !p.localityKey || !p.address) throw new Error("facility name, locality and address are required");
    const [f] = await db.insert(s.facilities).values({ name: p.facilityName, localityKey: p.localityKey, address: p.address, postalCode: p.postalCode ?? null, phone: p.phone ?? null, confirmedOn: confirmed ? today : null }).returning({ id: s.facilities.id });
    facilityId = f.id;
  }
  const [row] = await db.insert(s.doctorPractices).values({ doctorId, facilityId, days: p.days ?? "", hours: p.hours ?? "", feeInr: p.feeInr ?? null, feeCheckedOn: p.feeInr != null ? today : null, confirmedOn: confirmed ? today : null, phone: p.phone ?? null, sort: 99 }).returning();
  await audit({ actorUserId, action: "doctor.practice_added", entityType: "doctor", entityId: doctorId, after: row });
  await recomputeQuality(doctorId);
  return row;
}

export async function listFacilities(q?: string) {
  const db = getDb();
  return db.query.facilities.findMany({ where: q ? ilike(s.facilities.name, `%${q}%`) : undefined, with: { locality: true }, orderBy: (f, { asc }) => [asc(f.name)], limit: 50 });
}
