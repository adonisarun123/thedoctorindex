"use server";

import { revalidatePath } from "next/cache";

import { getDashboardContext } from "@/lib/dashboard";
import { setEnquiryStatus } from "@/lib/services/cases";
import { addPractice } from "@/lib/services/doctors";
import { removeDoctorPhoto, setDoctorPhoto } from "@/lib/services/photos";
import { reportReview, submitResponse } from "@/lib/services/reviews";
import { inviteManager, revokeManager, submitChange } from "@/lib/services/workflow";

export interface DashState {
  ok?: boolean;
  error?: string;
  message?: string;
  queued?: boolean;
}

function fail(e: unknown): DashState {
  return { error: e instanceof Error ? e.message : "Something went wrong." };
}

function after(ctx: { doctor: { slug: string } }) {
  revalidatePath("/dashboard", "layout");
  revalidatePath(`/doctor/${ctx.doctor.slug}`);
}

/** Save one or more profile fields. Sensitive ones are queued for verification. */
export async function saveProfileAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Clinic managers cannot edit identity or credential fields." };
    const d = ctx.doctor;
    const list = (v: FormDataEntryValue | null) => String(v ?? "").split(",").map((x) => x.trim()).filter(Boolean);
    const candidates: Array<[string, unknown, unknown]> = [
      ["name", String(form.get("name") ?? "").replace(/^dr\.?\s*/i, "").trim(), d.name],
      ["gender", String(form.get("gender") ?? "") || null, d.gender],
      ["languages", list(form.get("languages")), d.languages],
      ["specialtyKey", String(form.get("specialty") ?? ""), d.specialty],
      ["subspecialties", list(form.get("subspecialties")), d.subspecialties],
      ["practiceStartYear", Number(form.get("start")) || null, d.practiceStartYear],
      ["modes", [form.get("mode_inperson") ? "In person" : null, form.get("mode_online") ? "Online" : null].filter(Boolean), d.modes],
      ["about", String(form.get("about") ?? "").trim(), d.about],
      ["services", list(form.get("services")), d.services],
    ];
    let applied = 0;
    let queued = 0;
    for (const [field, to, from] of candidates) {
      if (JSON.stringify(to) === JSON.stringify(from)) continue;
      if (field === "about" && /\b(best|no\.?\s*1|top|most trusted)\b/i.test(String(to))) return { error: "Superlatives such as “best” are not allowed. Describe what you treat and where." };
      const r = await submitChange(ctx.doctorId, ctx.user.id, field, to, from);
      if (r.queued) queued++;
      else applied++;
    }
    after(ctx);
    if (!applied && !queued) return { ok: true, message: "Nothing changed." };
    return { ok: true, queued: queued > 0, message: `${applied} change${applied === 1 ? "" : "s"} published${queued ? `; ${queued} sent to verification (name, speciality and gender changes re-verify before they go public)` : ""}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function savePracticeAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    const pid = String(form.get("practiceId"));
    const p = ctx.doctor.practices.find((x) => x.id === pid);
    if (!p) return { error: "Practice not found." };
    const opts = { asManager: ctx.asManager, scope: ctx.scope };
    const fee = String(form.get("fee") ?? "").trim();
    const candidates: Array<[string, unknown, unknown]> = [
      [`practice.${pid}.days`, String(form.get("days") ?? "").trim(), p.days],
      [`practice.${pid}.hours`, String(form.get("hours") ?? "").trim(), p.hours],
      [`practice.${pid}.phone`, String(form.get("phone") ?? "").trim(), p.phone],
      [`practice.${pid}.feeInr`, fee ? Number(fee) : null, p.feeInr],
      [`facility.${p.facilityId}.address`, String(form.get("address") ?? "").trim(), p.address],
    ];
    let applied = 0;
    let queued = 0;
    for (const [field, to, from] of candidates) {
      if (JSON.stringify(to) === JSON.stringify(from)) continue;
      const r = await submitChange(ctx.doctorId, ctx.user.id, field, to, from, opts);
      if (r.queued) queued++;
      else applied++;
    }
    after(ctx);
    return { ok: true, queued: queued > 0, message: `${applied} change${applied === 1 ? "" : "s"} published${queued ? "; the address change waits for the practice to confirm" : ""}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function confirmPracticeAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    const pid = String(form.get("practiceId"));
    await submitChange(ctx.doctorId, ctx.user.id, `practice.${pid}.confirmed`, true, null, { asManager: ctx.asManager, scope: ctx.scope });
    after(ctx);
    return { ok: true, message: "Confirmed. Today's date is now on the address, hours and fee for this practice." };
  } catch (e) {
    return fail(e);
  }
}

export async function removePracticeAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can remove a practice." };
    const pid = String(form.get("practiceId"));
    await submitChange(ctx.doctorId, ctx.user.id, `practice.${pid}.active`, false, true);
    after(ctx);
    return { ok: true, message: "Practice removed from the public profile. Its history is kept privately for provenance." };
  } catch (e) {
    return fail(e);
  }
}

export async function addPracticeAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can add a practice." };
    await addPractice(
      ctx.doctorId,
      {
        facilityName: String(form.get("facility") ?? "").trim(),
        localityKey: String(form.get("locality") ?? ""),
        address: String(form.get("address") ?? "").trim(),
        postalCode: String(form.get("postal") ?? "").trim(),
        days: String(form.get("days") ?? "").trim(),
        hours: String(form.get("hours") ?? "").trim(),
        feeInr: Number(form.get("fee")) || null,
        phone: String(form.get("phone") ?? "").trim(),
      },
      ctx.user.id,
      false,
    );
    after(ctx);
    return { ok: true, message: "Practice added. It appears publicly once the practice confirms the address; a verification officer will contact them." };
  } catch (e) {
    return fail(e);
  }
}

export async function replyAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can reply to reviews." };
    await submitResponse(ctx.doctorId, ctx.user.id, String(form.get("reviewId")), String(form.get("text") ?? ""));
    after(ctx);
    return { ok: true, message: "Reply queued for moderation. It is checked for health information before it appears, usually within 48 hours." };
  } catch (e) {
    return fail(e);
  }
}

export async function disputeAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can dispute a review." };
    const row = await reportReview(String(form.get("reviewId")), ctx.user.id, String(form.get("reason") ?? "Disputed by doctor"), String(form.get("detail") ?? "") || null, null);
    after(ctx);
    return { ok: true, message: `Dispute opened, reference ${row.id.slice(0, 8).toUpperCase()}. A moderator who did not approve the review assesses it within 48 hours. The review stays visible unless it breaches policy.` };
  } catch (e) {
    return fail(e);
  }
}

export async function inviteManagerAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can invite managers." };
    const scope = form.getAll("scope").map(String).filter(Boolean);
    await inviteManager(ctx.doctorId, ctx.user.id, String(form.get("email") ?? ""), String(form.get("name") ?? "") || null, scope);
    after(ctx);
    return { ok: true, message: "Manager added. They sign in with that email and can edit hours, fees and contact for the practices you chose — nothing else." };
  } catch (e) {
    return fail(e);
  }
}

export async function revokeManagerAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can revoke access." };
    await revokeManager(String(form.get("managerId")), ctx.user.id);
    after(ctx);
    return { ok: true, message: "Access revoked immediately. Changes they made stay, with their name on the provenance record." };
  } catch (e) {
    return fail(e);
  }
}

export async function enquiryStatusAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    await setEnquiryStatus(String(form.get("enquiryId")), String(form.get("status")) as "new" | "sent" | "contacted" | "closed", ctx.user.id, ctx.asManager ? "manager" : "doctor");
    after(ctx);
    return { ok: true, message: "Updated." };
  } catch (e) {
    return fail(e);
  }
}

/** Photograph with usage consent. Managers cannot change the doctor's likeness. */
export async function photoAction(_prev: DashState, form: FormData): Promise<DashState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Clinic managers cannot change the photograph." };
    if (form.get("remove") === "1") {
      await removeDoctorPhoto(ctx.doctorId, ctx.user.id, "doctor");
      after(ctx);
      return { ok: true, message: "Photograph removed." };
    }
    const f = form.get("photo");
    if (!(f instanceof File) || f.size === 0) return { error: "Choose a photograph first." };
    await setDoctorPhoto(ctx.doctorId, { mime: f.type, bytes: Buffer.from(await f.arrayBuffer()), filename: f.name }, ctx.user.id, "doctor", form.get("consent") === "on");
    after(ctx);
    return { ok: true, message: "Photograph published. It is resized to 512 px and stripped of metadata." };
  } catch (e) {
    return fail(e);
  }
}
