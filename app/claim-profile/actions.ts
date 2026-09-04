"use server";

import { getSessionUser } from "@/lib/auth/session";
import { findByRegistration } from "@/lib/data";
import { track } from "@/lib/services/events";
import { storeFile } from "@/lib/services/files";
import { createClaim } from "@/lib/services/workflow";

export interface ClaimState {
  ok?: boolean;
  error?: string;
  doctorName?: string;
}

export async function claimAction(_prev: ClaimState, form: FormData): Promise<ClaimState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in first." };
    const registration = String(form.get("registration") ?? "").trim();
    const method = String(form.get("method") ?? "practice_otp") as "practice_otp" | "work_email" | "practice_admin" | "document";
    const doctor = await findByRegistration(registration);
    if (!doctor?.dbId) return { error: "No profile exists for that registration number. Create one instead." };
    let evidenceFileId: string | null = null;
    const file = form.get("evidence");
    if (method === "document") {
      if (!(file instanceof File) || file.size === 0) return { error: "Upload the supporting document." };
      const stored = await storeFile({ bucket: "private", filename: file.name, mime: file.type, bytes: Buffer.from(await file.arrayBuffer()), uploadedByUserId: user.id });
      evidenceFileId = stored.id;
    }
    await createClaim(user.id, doctor.dbId, registration, method, evidenceFileId);
    await track("claim_started", { doctorId: doctor.dbId });
    return { ok: true, doctorName: doctor.name };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
