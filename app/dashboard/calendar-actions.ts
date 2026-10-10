"use server";

import { revalidatePath } from "next/cache";

import type { DashState } from "@/app/dashboard/actions";
import { getDashboardContext } from "@/lib/dashboard";
import type { Rule } from "@/lib/booking/slots";
import { addBlock, decideAppointment, removeBlock, saveRules, setBookingEnabled, type DoctorDecision } from "@/lib/services/booking";
import { addNotifyEmail, removeNotifyEmail, resendNotifyVerification } from "@/lib/services/booking-notify";

function fail(e: unknown): DashState {
  return { error: e instanceof Error ? e.message : "Something went wrong." };
}
function refresh(slug: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath(`/doctor/${slug}`);
  revalidatePath(`/doctor/${slug}/book`);
}

/** Practices this signed-in user may set hours for: all of them for the doctor, the granted ones for a manager. */
async function editablePractices() {
  const ctx = await getDashboardContext();
  const all = ctx.doctor.practices.map((p) => p.id).filter((x): x is string => Boolean(x));
  return { ctx, ids: ctx.asManager && ctx.scope.length ? all.filter((id) => ctx.scope.includes(id)) : all };
}

export async function saveHoursAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const { ctx, ids } = await editablePractices();
    const rules: Rule[] = [];
    for (const practiceId of ids) {
      const slotMinutes = Number(form.get(`slot:${practiceId}`) ?? 15);
      for (let weekday = 0; weekday < 7; weekday++) {
        for (const k of [0, 1]) {
          const start = String(form.get(`r:${practiceId}:${weekday}:${k}:start`) ?? "").trim();
          const end = String(form.get(`r:${practiceId}:${weekday}:${k}:end`) ?? "").trim();
          if (!start && !end) continue;
          if (!start || !end) return { error: "Each session needs both a start and an end time." };
          rules.push({ practiceId, weekday, startTime: start, endTime: end, slotMinutes });
        }
      }
    }
    await saveRules(ctx.doctorId, ctx.user.id, ids, rules);
    refresh(ctx.doctor.slug);
    return { ok: true, message: rules.length ? `Saved ${rules.length} weekly session${rules.length === 1 ? "" : "s"}.` : "Cleared your weekly hours." };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleBookingAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    const on = form.get("on") === "1";
    await setBookingEnabled(ctx.doctorId, ctx.user.id, on);
    refresh(ctx.doctor.slug);
    return { ok: true, message: on ? "Online booking is on. Patients can now request slots from your profile." : "Online booking is off. Existing appointments are unchanged." };
  } catch (e) {
    return fail(e);
  }
}

export async function addBlockAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    const { cancelled } = await addBlock(ctx.doctorId, ctx.user.id, String(form.get("day") ?? ""), String(form.get("note") ?? "").trim() || null);
    refresh(ctx.doctor.slug);
    return { ok: true, message: cancelled ? `Day blocked. ${cancelled} appointment${cancelled === 1 ? " was" : "s were"} cancelled and the patient${cancelled === 1 ? " has" : "s have"} been emailed.` : "Day blocked. No appointments were booked that day." };
  } catch (e) {
    return fail(e);
  }
}

export async function removeBlockAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    await removeBlock(ctx.doctorId, String(form.get("id") ?? ""));
    refresh(ctx.doctor.slug);
    return { ok: true, message: "Day reopened." };
  } catch (e) {
    return fail(e);
  }
}

export async function decideAppointmentAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    const decision = String(form.get("decision") ?? "") as DoctorDecision;
    if (!["confirmed", "declined", "cancelled", "completed", "no_show"].includes(decision)) return { error: "Choose what to do." };
    await decideAppointment(ctx.doctorId, ctx.user.id, String(form.get("id") ?? ""), decision, String(form.get("note") ?? "") || null, ctx.asManager ? ctx.scope : []);
    refresh(ctx.doctor.slug);
    return { ok: true, message: decision === "confirmed" ? "Confirmed. The patient has been emailed." : decision === "declined" || decision === "cancelled" ? "Done. The patient has been emailed." : "Recorded." };
  } catch (e) {
    return fail(e);
  }
}

/** Extra addresses for appointment emails are the doctor's call, not a clinic manager's. */
async function ownerContext() {
  const ctx = await getDashboardContext();
  if (ctx.asManager) throw new Error("Only the doctor can change who receives appointment emails.");
  return ctx;
}

export async function addNotifyEmailAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await ownerContext();
    const email = await addNotifyEmail(ctx.doctorId, ctx.user.id, String(form.get("email") ?? ""));
    revalidatePath("/dashboard/calendar");
    return { ok: true, message: `Verification email sent to ${email}. It starts receiving appointment emails once someone there clicks the link.` };
  } catch (e) {
    return fail(e);
  }
}

export async function resendNotifyEmailAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await ownerContext();
    const email = await resendNotifyVerification(ctx.doctorId, String(form.get("id") ?? ""));
    return { ok: true, message: `Sent a fresh verification link to ${email}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function removeNotifyEmailAction(_p: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await ownerContext();
    await removeNotifyEmail(ctx.doctorId, ctx.user.id, String(form.get("id") ?? ""));
    revalidatePath("/dashboard/calendar");
    return { ok: true, message: "Removed. That address gets no further appointment emails." };
  } catch (e) {
    return fail(e);
  }
}
