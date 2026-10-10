"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/app/doctor/[slug]/actions";
import { getSessionUser } from "@/lib/auth/session";
import { getDoctorBySlug } from "@/lib/data";
import { formatIst } from "@/lib/booking/slots";
import { cancelByPatient, requestAppointment } from "@/lib/services/booking";
import { track } from "@/lib/services/events";

export async function bookAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in to book." };
    if (!user.profileComplete || !user.phone) return { error: "Add your name and mobile number to your account first, so the practice can reach you." };
    const doctor = await getDoctorBySlug(String(form.get("slug") ?? ""));
    if (!doctor?.dbId) return { error: "Doctor not found." };
    const [practiceId, startsAt] = String(form.get("slot") ?? "").split("|");
    if (!practiceId || !startsAt) return { error: "Choose a time." };
    if (form.get("consent") !== "on") return { error: "Tick the box to share your name and mobile with the practice." };
    const res = await requestAppointment(user.id, doctor.dbId, {
      practiceId,
      startsAt,
      forWhom: form.get("for") === "other" ? "other" : "self",
      reason: String(form.get("reason") ?? "") || null,
      name: user.displayName ?? "",
      phone: user.phone,
    });
    await track("appointment_requested", { doctorId: doctor.dbId, practiceId });
    revalidatePath("/account");
    return { ok: true, message: `Requested for ${formatIst(res.startsAt)} (IST). Booking reference ${res.ref}. This is not confirmed yet — the practice confirms it and you get an email either way. We have emailed you a copy; you can cancel from your account.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function cancelBookingAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in again." };
    await cancelByPatient(user.id, String(form.get("id") ?? ""));
    revalidatePath("/account");
    return { ok: true, message: "Cancelled. The practice has been told." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
