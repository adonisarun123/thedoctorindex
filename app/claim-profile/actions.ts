"use server";

import { getSessionUser } from "@/lib/auth/session";
import { findByRegistration, getDoctorBySlug } from "@/lib/data";
import { track } from "@/lib/services/events";
import { storeFile } from "@/lib/services/files";
import { createClaim } from "@/lib/services/workflow";
import { displayName } from "@/lib/display-name";

export interface ClaimState {
  ok?: boolean;
  error?: string;
  doctorName?: string;
}

export async function claimAction(_prev: ClaimState, form: FormData): Promise<ClaimState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in first." };
    if (!user.profileComplete) return { error: "Complete your account details first." };
    const registration = String(form.get("registration") ?? "").trim();
    const method = String(form.get("method") ?? "practice_otp") as "practice_otp" | "work_email" | "practice_admin" | "document";
    const council = String(form.get("council") ?? "").trim();
    const profile = String(form.get("profile") ?? "").trim();
    if (!registration) return { error: "Enter your registration number." };
    // From a profile page the profile is named outright; otherwise it is found by
    // council + number, and a number several doctors share resolves to nothing.
    const doctor = profile ? await getDoctorBySlug(profile) : await findByRegistration(registration, council);
    if (!doctor?.dbId) {
      return {
        error: profile
          ? "That profile is no longer available. Search for it again, or create a new one."
          : "No single profile holds that council and registration number. Check the council, open your profile and use its Claim button, or create a profile instead.",
      };
    }
    let evidenceFileId: string | null = null;
    const file = form.get("evidence");
    if (method === "document") {
      if (!(file instanceof File) || file.size === 0) return { error: "Upload the supporting document." };
      const stored = await storeFile({ bucket: "private", filename: file.name, mime: file.type, bytes: Buffer.from(await file.arrayBuffer()), uploadedByUserId: user.id });
      evidenceFileId = stored.id;
    }
    await createClaim(user.id, doctor.dbId, registration, method, evidenceFileId, council || undefined);
    await track("claim_started", { doctorId: doctor.dbId });
    return { ok: true, doctorName: displayName(doctor) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
