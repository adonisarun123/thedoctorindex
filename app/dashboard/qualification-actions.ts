"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDashboardContext } from "@/lib/dashboard";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { revalidateDoctors } from "@/lib/data/revalidate";
import { addQualificationWithCertificate, attachCertificate, ownCertificateIds } from "@/lib/services/qualification-evidence";

export interface QualState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function done(message: string): QualState {
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/verification");
  revalidateDoctors();
  return { ok: true, message };
}

/** Upload a certificate for a qualification already on the profile. */
export async function uploadQualificationCertificateAction(_p: QualState, form: FormData): Promise<QualState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can supply qualification certificates." };
    const qualificationId = String(form.get("qualificationId") ?? "");
    const fileId = String(form.get("certificate") ?? "");
    const [q] = await getDb().select({ id: s.doctorQualifications.id, state: s.doctorQualifications.state }).from(s.doctorQualifications).where(and(eq(s.doctorQualifications.id, qualificationId), eq(s.doctorQualifications.doctorId, ctx.doctorId))).limit(1);
    if (!q) return { error: "That qualification is not on your profile." };
    if (q.state === "verified") return { error: "This qualification is already verified." };
    if (!(await ownCertificateIds(ctx.user.id, [fileId])).has(fileId)) return { error: "Upload the certificate first." };
    await attachCertificate(q.id, fileId, ctx.user.id);
    return done("Certificate received. Our verification team reviews it within 2 business days and emails you the outcome.");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

/** Add a qualification, fellowship or course with its certificate. */
export async function addQualificationAction(_p: QualState, form: FormData): Promise<QualState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can add qualifications." };
    await addQualificationWithCertificate(
      ctx.doctorId,
      ctx.user.id,
      { degree: String(form.get("degree") ?? ""), institution: String(form.get("institution") ?? ""), year: Number(form.get("year")) || null },
      String(form.get("certificate") ?? ""),
    );
    return done("Added. It shows as pending on your profile until our team checks the certificate (2 business days).");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
