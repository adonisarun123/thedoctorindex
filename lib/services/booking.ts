import "server-only";

import { and, asc, desc, eq, gt, gte, inArray, lt, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { notifyPatient, notifyPractice } from "@/lib/services/booking-notify";
import { newBookingRef, normaliseBookingRef } from "@/lib/booking/ref";
import { rateLimit } from "@/lib/security/rate-limit";
import { displayName } from "@/lib/display-name";
import { bookingRequirements, formatIst, generateSlots, isUnlocked, istDay, istInstant, validateRules, type Requirement, type Rule, type Slot } from "@/lib/booking/slots";

/**
 * Appointment booking. A doctor's calendar unlocks once the profile is
 * complete (lib/booking/slots.ts → bookingRequirements). Patients request a
 * slot; the doctor or their clinic manager confirms or declines. A slot holds
 * one live booking (unique index), so two patients cannot take the same time.
 */

const SUPERLATIVE = /\b(best|no\.?\s*1|top|most trusted)\b/i;

export async function bookingRequirementsFor(doctorId: string): Promise<{ requirements: Requirement[]; unlocked: boolean; enabled: boolean }> {
  const d = await getDb().query.doctors.findFirst({
    where: eq(s.doctors.id, doctorId),
    with: { registrations: true, practices: { where: (p, { eq }) => eq(p.active, true) } },
  });
  if (!d) throw new Error("doctor not found");
  const requirements = bookingRequirements({
    registrationVerified: d.registrations.some((r) => r.checkedOn),
    practices: d.practices.length,
    practicesWithFee: d.practices.filter((p) => p.feeInr !== null).length,
    aboutChars: d.about.trim().length,
    aboutHasSuperlative: SUPERLATIVE.test(d.about),
    services: d.services.length,
    languages: d.languages.length,
    modes: d.modes.length,
  });
  const unlocked = isUnlocked(requirements);
  return { requirements, unlocked, enabled: d.bookingEnabled && unlocked };
}

export async function setBookingEnabled(doctorId: string, actorUserId: string, on: boolean) {
  if (on) {
    const { unlocked } = await bookingRequirementsFor(doctorId);
    if (!unlocked) throw new Error("Complete your profile to unlock the calendar.");
    const rules = await getRules(doctorId);
    if (!rules.length) throw new Error("Add your weekly consulting hours first, so patients have slots to choose from.");
  }
  await getDb().update(s.doctors).set({ bookingEnabled: on, updatedAt: new Date() }).where(eq(s.doctors.id, doctorId));
  await audit({ actorUserId, actorRole: "doctor", action: on ? "booking.enabled" : "booking.disabled", entityType: "doctor", entityId: doctorId });
}

export async function getRules(doctorId: string): Promise<Array<Rule & { id: string }>> {
  return getDb()
    .select({ id: s.availabilityRules.id, practiceId: s.availabilityRules.practiceId, weekday: s.availabilityRules.weekday, startTime: s.availabilityRules.startTime, endTime: s.availabilityRules.endTime, slotMinutes: s.availabilityRules.slotMinutes })
    .from(s.availabilityRules)
    .where(eq(s.availabilityRules.doctorId, doctorId))
    .orderBy(asc(s.availabilityRules.weekday), asc(s.availabilityRules.startTime));
}

/** Replaces the weekly hours for the given practices (a manager only touches their own). */
export async function saveRules(doctorId: string, actorUserId: string, practiceIds: string[], rules: Rule[]) {
  const db = getDb();
  const owned = await db.select({ id: s.doctorPractices.id }).from(s.doctorPractices).where(and(eq(s.doctorPractices.doctorId, doctorId), eq(s.doctorPractices.active, true)));
  const ownedIds = new Set(owned.map((p) => p.id));
  for (const id of practiceIds) if (!ownedIds.has(id)) throw new Error("That practice is not on this profile.");
  for (const r of rules) if (!practiceIds.includes(r.practiceId)) throw new Error("That practice is not on this profile.");
  // Overlap is checked against every practice, including ones this editor does not touch.
  const untouched = (await getRules(doctorId)).filter((r) => !practiceIds.includes(r.practiceId));
  validateRules([...untouched, ...rules]);
  await db.transaction(async (tx) => {
    if (practiceIds.length) await tx.delete(s.availabilityRules).where(and(eq(s.availabilityRules.doctorId, doctorId), inArray(s.availabilityRules.practiceId, practiceIds)));
    if (rules.length) await tx.insert(s.availabilityRules).values(rules.map((r) => ({ ...r, doctorId })));
  });
  await audit({ actorUserId, actorRole: "doctor", action: "booking.hours_saved", entityType: "doctor", entityId: doctorId, after: { rules: rules.length } });
}

export async function listBlocks(doctorId: string) {
  return getDb().select().from(s.availabilityBlocks).where(and(eq(s.availabilityBlocks.doctorId, doctorId), gte(s.availabilityBlocks.day, istDay(new Date()).day))).orderBy(asc(s.availabilityBlocks.day));
}

/**
 * Blocks a whole IST day. Any open appointment that day (requested or
 * confirmed, not yet started) is cancelled and the patient emailed, so no one
 * turns up to a closed clinic. The private block note is never sent; patients
 * get a neutral reason.
 */
export async function addBlock(doctorId: string, actorUserId: string, day: string, note: string | null): Promise<{ cancelled: number }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("Choose a date.");
  if (day < istDay(new Date()).day) throw new Error("That date has passed.");
  const db = getDb();
  await db.insert(s.availabilityBlocks).values({ doctorId, day, note }).onConflictDoNothing();

  const from = istInstant(day, 0);
  const to = istInstant(day, 24 * 60);
  const affected = await db
    .update(s.appointments)
    .set({ status: "cancelled", statusNote: "The doctor is unavailable on this day", decidedAt: new Date() })
    .where(and(eq(s.appointments.doctorId, doctorId), inArray(s.appointments.status, ["requested", "confirmed"]), gte(s.appointments.startsAt, from), lt(s.appointments.startsAt, to), gt(s.appointments.startsAt, new Date())))
    .returning({ id: s.appointments.id, patientUserId: s.appointments.patientUserId, startsAt: s.appointments.startsAt });

  if (affected.length) {
    for (const a of affected) {
      await audit({ actorUserId, actorRole: "doctor", action: "appointment.cancelled", entityType: "appointment", entityId: a.id, after: { reason: "day_blocked", day } });
      await notifyPatient(a.id, "cancelled_by_practice", "The doctor is unavailable on this day.");
      await notifyPractice(a.id, "cancelled_by_practice");
    }
  }
  return { cancelled: affected.length };
}

export async function removeBlock(doctorId: string, id: string) {
  await getDb().delete(s.availabilityBlocks).where(and(eq(s.availabilityBlocks.id, id), eq(s.availabilityBlocks.doctorId, doctorId)));
}

export async function availableSlots(doctorId: string, now = new Date()): Promise<Slot[]> {
  const db = getDb();
  const [rules, blocks, live] = await Promise.all([
    getRules(doctorId),
    listBlocks(doctorId),
    db.select({ startsAt: s.appointments.startsAt }).from(s.appointments).where(and(eq(s.appointments.doctorId, doctorId), inArray(s.appointments.status, ["requested", "confirmed"]), gte(s.appointments.startsAt, now))),
  ]);
  return generateSlots({ rules, blockedDays: blocks.map((b) => b.day), taken: live.map((a) => a.startsAt), now });
}

export async function requestAppointment(userId: string, doctorId: string, input: { practiceId: string; startsAt: string; forWhom: "self" | "other"; reason: string | null; name: string; phone: string }) {
  const db = getDb();
  const { enabled } = await bookingRequirementsFor(doctorId);
  if (!enabled) throw new Error("This doctor is not taking online bookings right now.");

  const [own] = await db.select({ id: s.doctors.id }).from(s.doctors).where(and(eq(s.doctors.id, doctorId), eq(s.doctors.claimedByUserId, userId))).limit(1);
  if (own) throw new Error("You cannot book an appointment with your own profile.");

  const rl = await rateLimit(`booking:${userId}`, Number(process.env.RATE_LIMIT_BOOKING ?? 5), 86_400);
  if (!rl.ok) throw new Error("You have made several booking requests today. Try again tomorrow, or call the practice.");

  const [{ n }] = (await db.execute(sql`select count(*)::int as n from appointments where doctor_id = ${doctorId} and patient_user_id = ${userId} and status in ('requested','confirmed') and starts_at > now()`)) as unknown as Array<{ n: number }>;
  if (Number(n) >= 2) throw new Error("You already have two upcoming appointments with this doctor. Cancel one from your account to book another.");

  const wanted = new Date(input.startsAt);
  const slot = (await availableSlots(doctorId)).find((x) => x.practiceId === input.practiceId && x.startsAt.getTime() === wanted.getTime());
  if (!slot) throw new Error("That time was just taken or is no longer available. Pick another slot.");

  const reason = input.reason?.trim().slice(0, 200) || null;
  let id = "";
  let ref = "";
  for (let attempt = 0; !id; attempt++) {
    try {
      const [row] = await db
        .insert(s.appointments)
        .values({ ref: newBookingRef(), doctorId, practiceId: slot.practiceId, patientUserId: userId, patientName: input.name, patientPhone: input.phone, forWhom: input.forWhom, reason, startsAt: slot.startsAt, endsAt: slot.endsAt })
        .returning({ id: s.appointments.id, ref: s.appointments.ref });
      id = row.id;
      ref = row.ref;
    } catch (e) {
      const msg = String((e as Error)?.message ?? e);
      if (/appointments_ref_uq/.test(msg) && attempt < 4) continue; // reference clash: draw another
      if (/appointments_live_slot_uq|duplicate key/i.test(msg)) throw new Error("Someone booked that time a moment ago. Pick another slot.");
      throw e;
    }
  }
  await audit({ actorUserId: userId, actorRole: "patient", action: "appointment.requested", entityType: "appointment", entityId: id, after: { doctorId, startsAt: slot.startsAt, ref } });
  await notifyPatient(id, "requested");
  await notifyPractice(id, "requested");
  return { id, ref, startsAt: slot.startsAt };
}

export type DoctorDecision = "confirmed" | "declined" | "cancelled" | "completed" | "no_show";

/**
 * `scope` is the practice ids a clinic manager may act for (empty = all, i.e.
 * the doctor themself or an unscoped manager).
 */
export async function decideAppointment(doctorId: string, actorUserId: string, appointmentId: string, decision: DoctorDecision, note: string | null, scope: string[] = []) {
  const db = getDb();
  const [a] = await db.select().from(s.appointments).where(and(eq(s.appointments.id, appointmentId), eq(s.appointments.doctorId, doctorId))).limit(1);
  if (!a) throw new Error("Appointment not found.");
  if (scope.length && !scope.includes(a.practiceId)) throw new Error("This appointment is at a practice you don't manage.");
  const allowed: Record<string, DoctorDecision[]> = {
    requested: ["confirmed", "declined"],
    confirmed: ["cancelled", "completed", "no_show"],
  };
  if (!allowed[a.status]?.includes(decision)) throw new Error(`An appointment that is ${a.status} cannot be marked ${decision}.`);
  if ((decision === "completed" || decision === "no_show") && a.startsAt > new Date()) throw new Error("Mark it after the appointment time.");
  await db.update(s.appointments).set({ status: decision, statusNote: note?.trim() || null, decidedAt: new Date() }).where(eq(s.appointments.id, appointmentId));
  await audit({ actorUserId, actorRole: "doctor", action: `appointment.${decision}`, entityType: "appointment", entityId: appointmentId, before: { status: a.status }, after: { status: decision } });
  if (decision === "confirmed" || decision === "declined" || decision === "cancelled") {
    await notifyPatient(appointmentId, decision === "cancelled" ? "cancelled_by_practice" : decision, note?.trim() || null);
    await notifyPractice(appointmentId, decision === "cancelled" ? "cancelled_by_practice" : decision);
  }
}

export async function cancelByPatient(userId: string, appointmentId: string) {
  const db = getDb();
  const [a] = await db.select().from(s.appointments).where(and(eq(s.appointments.id, appointmentId), eq(s.appointments.patientUserId, userId))).limit(1);
  if (!a) throw new Error("Appointment not found.");
  if (a.status !== "requested" && a.status !== "confirmed") throw new Error("This appointment is already closed.");
  await db.update(s.appointments).set({ status: "cancelled", statusNote: "Cancelled by patient", decidedAt: new Date() }).where(eq(s.appointments.id, appointmentId));
  await audit({ actorUserId: userId, actorRole: "patient", action: "appointment.cancelled_by_patient", entityType: "appointment", entityId: appointmentId });
  await notifyPatient(appointmentId, "cancelled_by_patient");
  await notifyPractice(appointmentId, "cancelled_by_patient");
}

export async function listDoctorAppointments(doctorId: string) {
  return getDb().query.appointments.findMany({
    where: and(eq(s.appointments.doctorId, doctorId), sql`${s.appointments.startsAt} > now() - interval '7 days'`),
    with: { practice: { with: { facility: true } } },
    orderBy: [asc(s.appointments.startsAt)],
    limit: 300,
  });
}

export async function listPatientAppointments(userId: string) {
  return getDb().query.appointments.findMany({
    where: eq(s.appointments.patientUserId, userId),
    with: { doctor: true, practice: { with: { facility: true } } },
    orderBy: [desc(s.appointments.startsAt)],
    limit: 50,
  });
}

/** Upcoming requests awaiting a decision, oldest request first. */
export async function listPendingRequests(doctorId: string, scope: string[] = []) {
  const rows = await getDb().query.appointments.findMany({
    where: and(eq(s.appointments.doctorId, doctorId), eq(s.appointments.status, "requested"), gt(s.appointments.startsAt, new Date())),
    with: { practice: { with: { facility: true } } },
    orderBy: [asc(s.appointments.createdAt)],
    limit: 100,
  });
  return scope.length ? rows.filter((r) => scope.includes(r.practiceId)) : rows;
}

export type AdminBookingFilter = { status?: string; stale?: boolean; q?: string };

/**
 * Super-admin view across all doctors. Read-only by design: staff do not
 * confirm on a doctor's behalf. "Stale" = an upcoming request left unanswered
 * for more than 24 hours.
 */
export async function listAppointmentsAdmin(f: AdminBookingFilter) {
  const conds = [];
  if (f.stale) conds.push(and(eq(s.appointments.status, "requested"), gt(s.appointments.startsAt, new Date()), lt(s.appointments.createdAt, new Date(Date.now() - 24 * 3_600_000))));
  else if (f.status) conds.push(eq(s.appointments.status, f.status as (typeof s.appointments.$inferSelect)["status"]));
  const q = f.q?.trim();
  if (q) {
    const ref = normaliseBookingRef(q);
    const digits = q.replace(/\D/g, "");
    const like = `%${q}%`;
    // A six-letter word like "Sharma" is also a valid-looking reference, so match either.
    const byName = sql`(${s.appointments.doctorId} in (select id from doctors where name ilike ${like}) or ${s.appointments.patientName} ilike ${like})`;
    conds.push(
      digits.length >= 4 && !ref
        ? sql`regexp_replace(${s.appointments.patientPhone}, '[^0-9]', '', 'g') like ${`%${digits}%`}`
        : ref
          ? sql`(${s.appointments.ref} = ${ref} or ${byName})`
          : byName,
    );
  }
  return getDb().query.appointments.findMany({
    where: conds.length ? and(...conds) : undefined,
    with: { doctor: true, practice: { with: { facility: true } } },
    orderBy: [desc(s.appointments.createdAt)],
    limit: 200,
  });
}

export async function pendingRequestCount(doctorId: string): Promise<number> {
  const [{ n }] = (await getDb().execute(sql`select count(*)::int as n from appointments where doctor_id = ${doctorId} and status = 'requested' and starts_at > now()`)) as unknown as Array<{ n: number }>;
  return Number(n);
}

async function nameOf(doctorId: string): Promise<string> {
  const [d] = await getDb().select({ name: s.doctors.name, specialtyKey: s.doctors.specialtyKey }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  return d ? displayName(d) : "";
}
