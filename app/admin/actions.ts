"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasRole, requireStaff } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { decideCorrection, resolveProfileReport, setEnquiryStatus } from "@/lib/services/cases";
import { addPractice, addQualification, applyField, createDoctor, markAllVerified, markRegistrationChecked, mergeDoctor, recomputeQuality, setDoctorStatus, setQualificationState } from "@/lib/services/doctors";
import { removeDoctorPhoto, setDoctorPhoto } from "@/lib/services/photos";
import { moderateResponse, moderateReview, resolveReviewReport, validateEvidence } from "@/lib/services/reviews";
import { recomputeSeoRoutes, setSeoOverride } from "@/lib/services/seo";
import { decideChange, decideClaim, decideSubmission } from "@/lib/services/workflow";
import { localityFromForm } from "@/lib/services/places";
import { revalidateDoctors } from "@/lib/data/revalidate";

export interface AdminState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function fail(e: unknown): AdminState {
  return { error: e instanceof Error ? e.message : "Something went wrong." };
}
function done(message: string, paths: string[] = ["/admin"]): AdminState {
  revalidateDoctors();
  for (const p of paths) revalidatePath(p);
  revalidatePath("/", "layout");
  return { ok: true, message };
}
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/* Submissions */
export async function decideSubmissionAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const decision = str(f, "decision") as "approved" | "rejected" | "needs_info" | "in_review";
    const r = await decideSubmission(str(f, "id"), decision, u.id, str(f, "note") || undefined, f.get("verify") === "on");
    return done(decision === "approved" ? `Approved and published${r.doctorId ? " — profile created" : ""}.` : `Marked ${decision.replace("_", " ")}.`, ["/admin/submissions", "/admin/doctors"]);
  } catch (e) {
    return fail(e);
  }
}

/* Claims */
export async function decideClaimAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    await decideClaim(str(f, "id"), str(f, "decision") as "approved" | "rejected", u.id, str(f, "note") || undefined);
    return done("Claim decided.", ["/admin/claims"]);
  } catch (e) {
    return fail(e);
  }
}

/* Change requests */
export async function decideChangeAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    await decideChange(str(f, "id"), str(f, "decision") as "published" | "rejected", u.id, str(f, "note") || undefined);
    return done("Change decided.", ["/admin/changes"]);
  } catch (e) {
    return fail(e);
  }
}

/* Reviews */
export async function moderateReviewAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("review_moderator");
    await moderateReview(str(f, "id"), str(f, "decision") as "published" | "redacted" | "rejected" | "removed", u.id, { publishedText: str(f, "publishedText") || undefined, reason: str(f, "reason") || undefined });
    return done("Review moderated.", ["/admin/reviews"]);
  } catch (e) {
    return fail(e);
  }
}
export async function validateEvidenceAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("review_moderator");
    await validateEvidence(str(f, "id"), str(f, "outcome") as "checked" | "rejected", u.id, str(f, "note") || undefined);
    return done("Evidence decided.", ["/admin/reviews"]);
  } catch (e) {
    return fail(e);
  }
}
export async function moderateResponseAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("review_moderator");
    await moderateResponse(str(f, "id"), str(f, "decision") as "published" | "rejected", u.id, str(f, "reason") || undefined);
    return done("Reply moderated.", ["/admin/reviews"]);
  } catch (e) {
    return fail(e);
  }
}
export async function resolveReviewReportAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("review_moderator");
    await resolveReviewReport(str(f, "id"), str(f, "status") as "assessed" | "resolved" | "dismissed", u.id, str(f, "resolution") || undefined);
    return done("Report updated.", ["/admin/reviews", "/admin/reports"]);
  } catch (e) {
    return fail(e);
  }
}

/* Reports, corrections, enquiries */
export async function resolveProfileReportAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("support_officer", "verification_officer");
    await resolveProfileReport(str(f, "id"), str(f, "status") as "assessed" | "resolved" | "dismissed", u.id, str(f, "resolution") || undefined);
    return done("Report updated.", ["/admin/reports"]);
  } catch (e) {
    return fail(e);
  }
}
export async function decideCorrectionAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("support_officer", "verification_officer");
    const applyField = str(f, "applyField");
    const applyValue = str(f, "applyValue");
    await decideCorrection(str(f, "id"), str(f, "decision") as "applied" | "rejected", u.id, applyField ? { field: applyField, value: applyValue } : null, str(f, "note") || undefined);
    return done("Correction decided.", ["/admin/reports"]);
  } catch (e) {
    return fail(e);
  }
}
export async function enquiryStatusAdminAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("support_officer");
    await setEnquiryStatus(str(f, "id"), str(f, "status") as "new" | "sent" | "contacted" | "closed", u.id, "staff");
    return done("Enquiry updated.", ["/admin/enquiries"]);
  } catch (e) {
    return fail(e);
  }
}

/* Doctors */
export async function createDoctorAction(_p: AdminState, f: FormData): Promise<AdminState> {
  let created: { id: string } | null = null;
  try {
    const u = await requireStaff("verification_officer", "content_editor");
    const list = (k: string) => str(f, k).split(",").map((x) => x.trim()).filter(Boolean);
    created = await createDoctor(
      {
        name: str(f, "name").replace(/^dr\.?\s*/i, ""),
        gender: (str(f, "gender") as "F" | "M" | "X") || null,
        specialtyKey: str(f, "specialty"),
        subspecialties: list("subspecialties"),
        practiceStartYear: Number(str(f, "start")) || null,
        languages: list("languages"),
        modes: [f.get("mode_inperson") ? "In person" : null, f.get("mode_online") ? "Online" : null].filter((x): x is string => Boolean(x)),
        about: str(f, "about"),
        services: list("services"),
        registration: { number: str(f, "registration"), council: str(f, "council"), registeredYear: Number(str(f, "regYear")) || null, verified: f.get("regVerified") === "on" },
        qualifications: [0, 1, 2].map((i) => ({ degree: str(f, `q${i}_degree`), institution: str(f, `q${i}_inst`), year: Number(str(f, `q${i}_year`)) || null, verified: f.get(`q${i}_verified`) === "on" })).filter((q) => q.degree && q.institution),
        experience: [0, 1].map((i) => ({ role: str(f, `e${i}_role`), place: str(f, `e${i}_place`), fromYear: Number(str(f, `e${i}_from`)) || 0, toYear: Number(str(f, `e${i}_to`)) || null })).filter((e) => e.role && e.place && e.fromYear),
        practices: str(f, "facility") ? [{ facilityName: str(f, "facility"), localityKey: (await localityFromForm(f)) ?? "", address: str(f, "address"), postalCode: str(f, "postal"), days: str(f, "days"), hours: str(f, "hours"), feeInr: Number(str(f, "fee")) || null, phone: str(f, "phone"), confirmed: f.get("practiceConfirmed") === "on" }] : [],
        status: f.get("publish") === "on" ? "published" : "draft",
        source: str(f, "source") || "staff",
      },
      u.id,
    );
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/", "layout");
  redirect(`/admin/doctors/${created.id}?created=1`);
}

export async function updateDoctorFieldsAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer", "content_editor");
    const id = str(f, "id");
    const list = (k: string) => str(f, k).split(",").map((x) => x.trim()).filter(Boolean);
    const fields: Record<string, unknown> = {
      name: str(f, "name").replace(/^dr\.?\s*/i, ""),
      gender: str(f, "gender") || null,
      specialtyKey: str(f, "specialty"),
      subspecialties: list("subspecialties"),
      practiceStartYear: Number(str(f, "start")) || null,
      languages: list("languages"),
      modes: [f.get("mode_inperson") ? "In person" : null, f.get("mode_online") ? "Online" : null].filter(Boolean),
      about: str(f, "about"),
      services: list("services"),
      hprVerified: f.get("hprVerified") === "on",
      hprId: str(f, "hprId") || null,
      photoConsent: f.get("photoConsent") === "on",
      phoneConsent: f.get("phoneConsent") === "on",
    };
    const [current] = await getDb().select().from(s.doctors).where(eq(s.doctors.id, id)).limit(1);
    if (!current) return { error: "Doctor not found." };
    let n = 0;
    for (const [field, value] of Object.entries(fields)) {
      const before = (current as Record<string, unknown>)[field];
      if (JSON.stringify(before ?? null) === JSON.stringify(value ?? null)) continue;
      await applyField(id, field, value, u.id, "staff", str(f, "reason") || "staff edit");
      n++;
    }
    return done(`${n} field${n === 1 ? "" : "s"} updated.`, [`/admin/doctors/${id}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function updatePracticeAdminAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer", "content_editor");
    const doctorId = str(f, "doctorId");
    const pid = str(f, "practiceId");
    const facilityId = str(f, "facilityId");
    const fee = str(f, "fee");
    // Only write fields that changed, so an unchanged address does not wipe a geocode.
    const [cur] = await getDb().query.doctorPractices.findMany({ where: eq(s.doctorPractices.id, pid), with: { facility: true }, limit: 1 });
    const pairs: Array<[string, unknown]> = [[`practice.${pid}.days`, str(f, "days")], [`practice.${pid}.hours`, str(f, "hours")], [`practice.${pid}.phone`, str(f, "phone")], [`practice.${pid}.feeInr`, fee ? Number(fee) : null], [`facility.${facilityId}.name`, str(f, "facility")], [`facility.${facilityId}.address`, str(f, "address")], [`facility.${facilityId}.postalCode`, str(f, "postal")], [`facility.${facilityId}.localityKey`, (await localityFromForm(f)) ?? cur?.facility.localityKey ?? ""]];
    if (f.has("geo")) pairs.push([`facility.${facilityId}.geo`, str(f, "geo")]);
    const current: Record<string, unknown> = cur ? { [`practice.${pid}.days`]: cur.days, [`practice.${pid}.hours`]: cur.hours, [`practice.${pid}.phone`]: cur.phone ?? "", [`practice.${pid}.feeInr`]: cur.feeInr, [`facility.${facilityId}.name`]: cur.facility.name, [`facility.${facilityId}.address`]: cur.facility.address, [`facility.${facilityId}.postalCode`]: cur.facility.postalCode ?? "", [`facility.${facilityId}.localityKey`]: cur.facility.localityKey, [`facility.${facilityId}.geo`]: cur.facility.lat && cur.facility.lng ? `${cur.facility.lat},${cur.facility.lng}` : "" } : {};
    for (const [field, value] of pairs) {
      if (field in current && JSON.stringify(current[field] ?? "") === JSON.stringify(value ?? "")) continue;
      await applyField(doctorId, field, value, u.id, "staff", "staff practice edit");
    }
    if (f.get("confirm") === "on") await applyField(doctorId, `practice.${pid}.confirmed`, true, u.id, "staff", "staff confirmed practice");
    if (f.get("deactivate") === "on") await applyField(doctorId, `practice.${pid}.active`, false, u.id, "staff", "staff removed practice");
    return done("Practice updated.", [`/admin/doctors/${doctorId}`]);
  } catch (e) {
    return fail(e);
  }
}

/**
 * One confirmation call, logged in one submit (/admin/calls).
 *
 * The three fields a call collects — practice confirmed, consultation fee,
 * professional introduction — are worth 37 of the 100 quality points, and are
 * the only ones that cannot be reached without speaking to someone. Doing them
 * in one action rather than three trips through the profile editor is the whole
 * point of the call queue.
 *
 * Every outcome is logged, including the ones that collect nothing: a number
 * that rings out, a wrong number, a doctor who declines. The queue reads those
 * back so nobody redials the same clinic tomorrow, and so "we called and they
 * said no" is distinguishable from "we never got to them".
 */
export async function logCallAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer", "content_editor");
    const doctorId = str(f, "doctorId");
    const pid = str(f, "practiceId");
    const outcome = str(f, "outcome") || "reached";
    const note = str(f, "note");

    if (outcome !== "reached") {
      await audit({ actorUserId: u.id, actorRole: "staff", action: "doctor.call.logged", entityType: "doctor", entityId: doctorId, after: { outcome }, reason: note || null });
      const label = outcome === "no_answer" ? "No answer — back in the queue in 2 days." : outcome === "wrong_number" ? "Wrong number — the phone is now marked unusable." : "Declined — parked for 90 days.";
      if (outcome === "wrong_number") await applyField(doctorId, `practice.${pid}.phone`, "", u.id, "staff", "wrong number on a confirmation call");
      return done(label, ["/admin/calls"]);
    }

    const about = str(f, "about");
    const fee = str(f, "fee");
    // About before fee before confirm: applyField stamps feeCheckedOn when the
    // fee is written and confirmedOn when the practice is confirmed, so the
    // confirmation is last and the dates all land on today.
    if (about) await applyField(doctorId, "about", about, u.id, "staff", "confirmation call");
    if (fee) await applyField(doctorId, `practice.${pid}.feeInr`, Number(fee), u.id, "staff", "confirmation call");
    if (f.get("confirm") === "on") await applyField(doctorId, `practice.${pid}.confirmed`, true, u.id, "staff", "confirmed by telephone");

    await audit({ actorUserId: u.id, actorRole: "staff", action: "doctor.call.logged", entityType: "doctor", entityId: doctorId, after: { outcome: "reached", confirmed: f.get("confirm") === "on", fee: fee || null, about: Boolean(about) }, reason: note || null });
    const { score } = await recomputeQuality(doctorId);

    // The introduction is saved either way, but it only scores when it is long
    // enough and free of the superlatives recomputeQuality screens for. Saying
    // so here beats letting a caller wonder why the score did not move.
    const shortAbout = about && about.length < 80;
    const puffed = about && /\b(best|no\.?\s*1|top|most trusted)\b/i.test(about);
    const caveat = shortAbout ? " The introduction is under 80 characters, so it does not score yet." : puffed ? " The introduction contains a superlative, so it does not score — reword it without “best”, “top”, “no. 1” or “most trusted”." : "";
    return done(`Saved — quality score now ${score}${score >= 70 ? " (verified)" : ""}.${caveat}`, ["/admin/calls", `/admin/doctors/${doctorId}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function addPracticeAdminAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer", "content_editor");
    const doctorId = str(f, "doctorId");
    await addPractice(doctorId, { facilityName: str(f, "facility"), localityKey: (await localityFromForm(f)) ?? "", address: str(f, "address"), postalCode: str(f, "postal"), days: str(f, "days"), hours: str(f, "hours"), feeInr: Number(str(f, "fee")) || null, phone: str(f, "phone") }, u.id, f.get("confirm") === "on");
    return done("Practice added.", [`/admin/doctors/${doctorId}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function setStatusAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const id = str(f, "id");
    await setDoctorStatus(id, str(f, "status") as "published" | "suspended" | "retired" | "archived" | "draft" | "in_review", u.id, str(f, "reason") || undefined);
    return done(`Status set to ${str(f, "status")}.`, [`/admin/doctors/${id}`, "/admin/doctors"]);
  } catch (e) {
    return fail(e);
  }
}

export async function registrationCheckAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const id = str(f, "id");
    await markRegistrationChecked(id, u.id, str(f, "result") as "verified" | "failed", str(f, "note") || undefined);
    return done("Registration check recorded.", [`/admin/doctors/${id}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function qualificationStateAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    await setQualificationState(str(f, "id"), str(f, "state") as "verified" | "submitted" | "rejected", u.id, str(f, "note") || undefined);
    return done("Qualification updated.", [`/admin/doctors/${str(f, "doctorId")}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function markAllVerifiedAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const id = str(f, "id");
    const r = await markAllVerified(id, u.id, str(f, "note") || "Marked all as verified");
    return done(`Marked verified: ${r.registrations} registration(s), ${r.qualifications} qualification(s), ${r.practices} practice(s).`, [`/admin/doctors/${id}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function addQualificationAdminAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const doctorId = str(f, "doctorId");
    await addQualification(doctorId, { degree: str(f, "degree"), institution: str(f, "institution"), year: Number(str(f, "year")) || null }, u.id, f.get("verified") === "on");
    return done("Qualification added.", [`/admin/doctors/${doctorId}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function mergeDoctorAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const dup = str(f, "id");
    const target = str(f, "targetId");
    if (!target || target === dup) return { error: "Choose a different target profile." };
    await mergeDoctor(dup, target, u.id, str(f, "reason") || undefined);
    return done("Merged. The duplicate is archived and its URL redirects to the target.", ["/admin/doctors", `/admin/doctors/${dup}`, `/admin/doctors/${target}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function photoAdminAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer", "content_editor");
    const id = str(f, "id");
    if (f.get("remove") === "1") {
      await removeDoctorPhoto(id, u.id, "staff", str(f, "reason") || undefined);
      return done("Photograph removed.", [`/admin/doctors/${id}`]);
    }
    const file = f.get("photo");
    if (!(file instanceof File) || file.size === 0) return { error: "Choose a photograph first." };
    await setDoctorPhoto(id, { mime: file.type, bytes: Buffer.from(await file.arrayBuffer()), filename: file.name }, u.id, "staff", f.get("consent") === "on");
    return done("Photograph set.", [`/admin/doctors/${id}`]);
  } catch (e) {
    return fail(e);
  }
}

/* SEO */
export async function recomputeSeoAction(): Promise<void> {
  const u = await requireStaff("content_editor", "verification_officer");
  const n = await recomputeSeoRoutes();
  await audit({ actorUserId: u.id, actorRole: "staff", action: "seo_routes.recomputed", entityType: "seo_route", after: { routes: n } });
  revalidatePath("/admin/seo");
}
export async function seoOverrideAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("content_editor");
    const override = str(f, "override");
    await setSeoOverride(str(f, "path"), (override === "force_index" || override === "force_noindex" ? override : null), u.id, str(f, "note") || undefined);
    return done("Override saved. Takes effect on the next build or revalidation.", ["/admin/seo"]);
  } catch (e) {
    return fail(e);
  }
}

/* Staff */
export async function setStaffAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff();
    if (!hasRole(u)) return { error: "Only a super administrator can manage staff." };
    const email = str(f, "email").toLowerCase();
    const roles = f.getAll("roles").map(String).filter(Boolean) as Array<typeof s.staffRole.enumValues[number]>;
    const active = f.get("active") !== "off";
    const db = getDb();
    let [user] = await db.select().from(s.users).where(sql`lower(${s.users.email}) = ${email}`).limit(1);
    if (!user) [user] = await db.insert(s.users).values({ email, role: "staff", displayName: str(f, "name") || null }).returning();
    else await db.update(s.users).set({ role: "staff" }).where(eq(s.users.id, user.id));
    await db.insert(s.staffMembers).values({ userId: user.id, roles, active }).onConflictDoUpdate({ target: s.staffMembers.userId, set: { roles, active } });
    if (!active) await db.update(s.sessions).set({ revokedAt: new Date() }).where(and(eq(s.sessions.userId, user.id)));
    const resetMfa = f.get("resetMfa") === "on";
    if (resetMfa) {
      await db.update(s.staffMembers).set({ mfaEnrolled: false, mfaSecret: null, mfaEnrolledAt: null }).where(eq(s.staffMembers.userId, user.id));
      await db.update(s.sessions).set({ revokedAt: new Date() }).where(eq(s.sessions.userId, user.id));
    }
    await audit({ actorUserId: u.id, actorRole: "staff", action: resetMfa ? "staff.mfa.reset_by_admin" : "staff.updated", entityType: "user", entityId: user.id, after: { email, roles, active } });
    return done("Staff member saved.", ["/admin/staff"]);
  } catch (e) {
    return fail(e);
  }
}

/* Enrichment queue (NMC register matching) */
export async function acceptRegisterCandidateAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const doctorId = str(f, "doctorId");
    const number = str(f, "registrationNo");
    const council = str(f, "council");
    const year = Number(str(f, "year")) || null;
    const registerName = str(f, "registerName");
    if (!doctorId || !number || !council) throw new Error("candidate is incomplete");
    const db = getDb();
    const today = new Date().toISOString().slice(0, 10);
    const norm = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "");
    await db.transaction(async (tx) => {
      const existing = await tx.query.medicalRegistrations.findMany({ where: eq(s.medicalRegistrations.doctorId, doctorId) });
      const same = existing.find((r) => r.numberNormalized === norm(number) && r.councilNormalized === norm(council));
      if (same) {
        await tx.update(s.medicalRegistrations).set({ checkedOn: today, status: "active", source: "nmc-imr", registeredYear: same.registeredYear ?? year, isPrimary: true }).where(eq(s.medicalRegistrations.id, same.id));
        for (const r of existing) if (r.id !== same.id) await tx.update(s.medicalRegistrations).set({ isPrimary: false }).where(eq(s.medicalRegistrations.id, r.id));
      } else {
        for (const r of existing) await tx.update(s.medicalRegistrations).set({ isPrimary: false }).where(eq(s.medicalRegistrations.id, r.id));
        await tx.insert(s.medicalRegistrations).values({ doctorId, number, numberNormalized: norm(number), council, councilNormalized: norm(council), registeredYear: year, checkedOn: today, source: "nmc-imr", isPrimary: true });
      }
      await tx.insert(s.verificationChecks).values({ doctorId, kind: "registration", result: "verified", source: "nmc-imr", checkedByUserId: u.id, note: `${council} · ${number} · ${registerName} (chosen from register candidates)` });
      await tx.update(s.doctors).set({ lastVerifiedOn: today, updatedAt: new Date() }).where(eq(s.doctors.id, doctorId));
      await tx.update(s.doctorEnrichment).set({ nmcStatus: "confirmed", nmcCandidates: null, updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, doctorId));
    });
    await audit({ actorUserId: u.id, actorRole: "staff", action: "doctor.registration.verified", entityType: "doctor", entityId: doctorId, after: { council, number, year, registerName, source: "nmc-imr" }, reason: "Chosen from NMC register candidates" });
    await recomputeQuality(doctorId);
    return done("Registration recorded as verified.", ["/admin/enrichment", `/admin/doctors/${doctorId}`]);
  } catch (e) {
    return fail(e);
  }
}

export async function dismissEnrichmentAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("verification_officer");
    const doctorId = str(f, "doctorId");
    await getDb().update(s.doctorEnrichment).set({ nmcStatus: "dismissed", nmcCandidates: null, updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, doctorId));
    await audit({ actorUserId: u.id, actorRole: "staff", action: "doctor.registration.unmatched", entityType: "doctor", entityId: doctorId, reason: "No register candidate accepted" });
    return done("Left unverified.", ["/admin/enrichment"]);
  } catch (e) {
    return fail(e);
  }
}

export async function resetEnrichmentAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    await requireStaff("verification_officer");
    const doctorId = str(f, "doctorId");
    await getDb().update(s.doctorEnrichment).set({ nmcStatus: "pending", googleStatus: sql`case when google_status = 'error' then 'pending' else google_status end`, attempts: 0, lastError: null, nmcCandidates: null, updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, doctorId));
    return done("Queued for the next worker run.", ["/admin/enrichment"]);
  } catch (e) {
    return fail(e);
  }
}
