import "server-only";

import { and, desc, eq, isNotNull, ne, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { todayIso } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { createDoctor, recomputeQuality, snapshotRevision } from "@/lib/services/doctors";
import { notifyUser } from "@/lib/services/notify";
import { settleReferralsForDoctor } from "@/lib/services/tribe";
import { createClaim, createSubmission, findDuplicateByRegistration } from "@/lib/services/workflow";
import { accountNameMatches } from "@/lib/nmc/instant-match";
import { displayName } from "@/lib/display-name";

/**
 * Instant onboarding (9 Oct 2026). A signed-in doctor picks their own entry in
 * the council register; if the name on their account fits that entry, the
 * profile goes live at once — claimed if we already hold one, created from the
 * register if not. Everything else (photo, bio, clinic, fees, certificates) is
 * optional and added later from the dashboard.
 *
 * What is NOT automatic, and goes to a verification officer instead:
 *   - the account name does not fit the register name;
 *   - someone else already controls the profile (the owner keeps it meanwhile —
 *     a second claim never freezes a live profile, or anyone could take a
 *     doctor offline by typing their number);
 *   - the account already controls a different profile.
 * A struck-off registration is refused outright.
 *
 * What the register supplies is what the profile shows — name, council,
 * number, degrees. Those are sensitive fields (SENSITIVE_FIELDS): a later edit
 * goes back to verification, so the register data stays locked.
 */

export type GoLiveOutcome =
  | { kind: "live"; slug: string; created: boolean; doctorName: string; doctorId: string }
  | { kind: "already_yours"; slug: string }
  | { kind: "review"; reason: "name_mismatch" | "claimed_by_other" | "has_profile" }
  | { kind: "blocked"; reason: "removed" | "not_found" | "unavailable" | "no_account_name" };

const SOURCE = "register_match";

type RegisterRow = typeof s.nmcRegister.$inferSelect;

async function registerEntry(id: number): Promise<RegisterRow | null> {
  const db = getDb();
  let [r] = await db.select().from(s.nmcRegister).where(eq(s.nmcRegister.sourceRecordId, id)).limit(1);
  // A cross-council duplicate points at the entry the person's profile is kept on.
  const dupOf = r?.matchKind?.startsWith("duplicate:") ? Number(r.matchKind.slice("duplicate:".length)) : null;
  if (dupOf) [r] = await db.select().from(s.nmcRegister).where(eq(s.nmcRegister.sourceRecordId, dupOf)).limit(1);
  return r ?? null;
}

/** The name to check: a LinkedIn / Google name the provider vouched for, else the name typed at account setup. */
async function accountName(userId: string): Promise<{ name: string | null; from: string }> {
  const db = getDb();
  const [idn] = await db.select({ name: s.userIdentities.name, provider: s.userIdentities.provider }).from(s.userIdentities).where(and(eq(s.userIdentities.userId, userId), isNotNull(s.userIdentities.name))).orderBy(desc(s.userIdentities.lastUsedAt)).limit(1);
  if (idn?.name) return { name: idn.name, from: idn.provider };
  const [u] = await db.select({ name: s.users.displayName }).from(s.users).where(eq(s.users.id, userId)).limit(1);
  return { name: u?.name ?? null, from: "account" };
}

async function registerQualifications(r: RegisterRow) {
  const db = getDb();
  const junk = (d: string | null) => !d || /^(-+|#N\/A|NULL|NA)$/i.test(d.trim());
  const extra = await db.select().from(s.nmcRegisterQualifications).where(eq(s.nmcRegisterQualifications.sourceRecordId, r.sourceRecordId)).orderBy(s.nmcRegisterQualifications.seq);
  return [
    ...(junk(r.qualification) ? [] : [{ degree: r.qualification!.trim(), institution: r.university || `${r.council} record`, year: r.qualificationYear }]),
    ...extra.filter((q) => !junk(q.degree)).map((q) => ({ degree: q.degree.trim(), institution: q.university || `${r.council} record`, year: q.year })),
  ];
}

/** Send to a verification officer: a pending claim on an existing profile, or a submission built from the register. */
async function toOfficer(userId: string, r: RegisterRow, doctorId: string | null, why: string): Promise<void> {
  const db = getDb();
  try {
    if (doctorId) {
      const row = await createClaim(userId, doctorId, r.number, "register_match", null, r.council);
      await db.update(s.doctorClaims).set({ note: why }).where(eq(s.doctorClaims.id, row.id));
    } else {
      const quals = await registerQualifications(r);
      await createSubmission(userId, r.council, r.number, {
        name: r.nameClean ?? r.name,
        specialtyKey: r.specialtyKey ?? "general-practice",
        qualifications: quals.map((q) => ({ degree: q.degree, institution: q.institution, year: q.year ?? null })),
        about: "",
        consents: { publish: true, photo: false, phone: false, accurate: true },
      });
    }
  } catch (e) {
    // "already under review" and friends: the case is already with an officer.
    const msg = e instanceof Error ? e.message : String(e);
    if (!/already|under review/i.test(msg)) throw e;
  }
  await audit({ actorUserId: userId, actorRole: "doctor", action: "onboard.to_officer", entityType: doctorId ? "doctor" : "register_entry", entityId: doctorId ?? String(r.sourceRecordId), after: { council: r.council, number: r.number }, reason: why });
}

export async function goLiveFromRegister(userId: string, sourceRecordId: number): Promise<GoLiveOutcome> {
  const db = getDb();
  const r = await registerEntry(sourceRecordId);
  if (!r || ["name-unusable", "no-number"].includes(r.category)) return { kind: "blocked", reason: "not_found" };
  if (r.removed || r.category === "struck-off") return { kind: "blocked", reason: "removed" };

  // The profile we hold for this registration, if any.
  let doctorId = r.doctorId ?? (await findDuplicateByRegistration(r.council, r.number))?.doctorId ?? null;
  let doc = doctorId ? (await db.select().from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1))[0] ?? null : null;
  if (doc?.mergedIntoId) {
    doc = (await db.select().from(s.doctors).where(eq(s.doctors.id, doc.mergedIntoId)).limit(1))[0] ?? null;
    doctorId = doc?.id ?? null;
  }
  if (doc && ["suspended", "retired", "archived"].includes(doc.status)) return { kind: "blocked", reason: "unavailable" };
  if (doc?.claimed && doc.claimedByUserId === userId) return { kind: "already_yours", slug: doc.slug };
  if (doc?.claimed) {
    await toOfficer(userId, r, doc.id, "Instant onboarding: this profile is already controlled by another account.");
    return { kind: "review", reason: "claimed_by_other" };
  }

  const [other] = await db.select({ id: s.doctors.id }).from(s.doctors).where(and(eq(s.doctors.claimedByUserId, userId), doctorId ? ne(s.doctors.id, doctorId) : sql`true`)).limit(1);
  if (other) {
    await toOfficer(userId, r, doctorId, "Instant onboarding: this account already controls another profile.");
    return { kind: "review", reason: "has_profile" };
  }

  const acct = await accountName(userId);
  if (!acct.name) return { kind: "blocked", reason: "no_account_name" };
  const match = accountNameMatches(r.name, acct.name);
  if (!match.ok) {
    await toOfficer(userId, r, doctorId, `Instant onboarding: account name "${acct.name}" (${acct.from}) does not fit register name "${r.name}" (${match.reason}).`);
    return { kind: "review", reason: "name_mismatch" };
  }

  const today = todayIso();
  const evidence = `${r.council} · ${r.number} · register name "${r.name}" ↔ ${acct.from} name "${acct.name}" (register entry ${r.sourceRecordId})`;
  let created = false;
  let slug: string;
  let name: string;
  let specialtyKey: string;

  if (doc) {
    await db.transaction(async (tx) => {
      await tx.update(s.doctors).set({
        claimed: true,
        claimedByUserId: userId,
        status: "published",
        publishedAt: doc.publishedAt ?? new Date(),
        lastVerifiedOn: today,
        updatedAt: new Date(),
      }).where(eq(s.doctors.id, doc.id));
      await tx.update(s.medicalRegistrations).set({ checkedOn: today, status: "active" }).where(and(eq(s.medicalRegistrations.doctorId, doc.id), eq(s.medicalRegistrations.numberNormalized, r.numberNormalized)));
      await tx.insert(s.doctorClaims).values({ doctorId: doc.id, userId, registrationNumber: `${r.council} · ${r.number}`, method: "register_match", status: "approved", decidedAt: new Date(), note: evidence });
      await tx.insert(s.verificationChecks).values({ doctorId: doc.id, kind: "claim", result: "verified", source: SOURCE, note: evidence });
      if (!r.doctorId) await tx.update(s.nmcRegister).set({ doctorId: doc.id, matchKind: r.matchKind ?? "existing:number" }).where(eq(s.nmcRegister.sourceRecordId, r.sourceRecordId));
    });
    await snapshotRevision(doc.id, "claimed:register_match", userId);
    slug = doc.slug;
    name = doc.name;
    specialtyKey = doc.specialtyKey;
    doctorId = doc.id;
  } else {
    name = r.nameClean ?? r.name;
    specialtyKey = r.specialtyKey ?? "general-practice";
    const quals = await registerQualifications(r);
    const made = await createDoctor(
      {
        name,
        specialtyKey,
        registration: { number: r.number, council: r.council, verified: true },
        qualifications: quals.map((q) => ({ ...q, verified: true })),
        status: "published",
        source: "self",
        sourceRef: String(r.sourceRecordId),
        sourceUrl: r.sourceUrl ?? "https://www.nmc.org.in/information-desk/indian-medical-register/",
        claimedByUserId: userId,
      },
      userId,
      "doctor",
    );
    created = true;
    slug = made.slug;
    doctorId = made.id;
    await db.transaction(async (tx) => {
      await tx.update(s.doctors).set({ phoneConsent: false }).where(eq(s.doctors.id, made.id));
      await tx.insert(s.doctorClaims).values({ doctorId: made.id, userId, registrationNumber: `${r.council} · ${r.number}`, method: "register_match", status: "approved", decidedAt: new Date(), note: evidence });
      await tx.insert(s.verificationChecks).values({ doctorId: made.id, kind: "claim", result: "verified", source: SOURCE, note: evidence });
      await tx.update(s.nmcRegister).set({ doctorId: made.id, matchKind: "created" }).where(eq(s.nmcRegister.sourceRecordId, r.sourceRecordId));
    });
  }

  await db.update(s.users).set({ role: "doctor" }).where(and(eq(s.users.id, userId), eq(s.users.role, "patient")));
  await recomputeQuality(doctorId);
  await audit({ actorUserId: userId, actorRole: "doctor", action: created ? "onboard.created_live" : "onboard.claimed_live", entityType: "doctor", entityId: doctorId, after: { registerEntry: r.sourceRecordId, council: r.council, number: r.number, nameFrom: acct.from }, reason: evidence });
  await settleReferralsForDoctor(doctorId);
  const doctorName = displayName({ name, specialtyKey });
  await notifyUser(userId, { kind: "claim", decision: "approved", doctorName, note: "Your profile is live. Add a photo, your clinic and a short introduction from your dashboard whenever you like." });
  return { kind: "live", slug, created, doctorName, doctorId };
}
