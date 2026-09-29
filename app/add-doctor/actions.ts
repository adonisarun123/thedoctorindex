"use server";

import { getSessionUser } from "@/lib/auth/session";
import { findByRegistration } from "@/lib/data";
import { track } from "@/lib/services/events";
import { createSubmission, type SubmissionPayload } from "@/lib/services/workflow";
import type { DoctorView } from "@/lib/types";
import { localityFromForm } from "@/lib/services/places";
import { claimSource } from "@/lib/claim-source";
import { workflowErrorCode } from "@/lib/funnel-errors";

/**
 * Duplicate check, run on the server so the directory never ships to the
 * browser. Identity is council + registration number, never the name.
 */
export async function lookupRegistration(registrationNumber: string, council: string): Promise<DoctorView | null> {
  return findByRegistration(registrationNumber, council);
}

export interface SubmitState {
  ok?: boolean;
  error?: string;
  /** Enumerated cause, for analytics (lib/funnel.ts). Never shown. */
  code?: string;
  id?: string;
}

export async function submitProfileAction(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in before submitting.", code: "signed_out" };
    if (!user.profileComplete) return { error: "Complete your account details first.", code: "account_incomplete" };
    const list = (k: string) => String(form.get(k) ?? "").split(",").map((x) => x.trim()).filter(Boolean);
    const payload: SubmissionPayload = {
      name: String(form.get("name") ?? "").replace(/^dr\.?\s*/i, "").trim(),
      gender: (form.get("gender") as "F" | "M" | "X" | null) || null,
      specialtyKey: String(form.get("specialty") ?? ""),
      subspecialties: list("subspecialties"),
      practiceStartYear: Number(form.get("start")) || null,
      languages: list("languages"),
      modes: [form.get("mode_inperson") ? "In person" : null, form.get("mode_online") ? "Online" : null].filter((x): x is string => Boolean(x)),
      about: String(form.get("about") ?? "").trim(),
      services: list("services"),
      qualifications: [0, 1, 2]
        .map((i) => ({ degree: String(form.get(`q${i}_degree`) ?? "").trim(), institution: String(form.get(`q${i}_inst`) ?? "").trim(), year: Number(form.get(`q${i}_year`)) || null }))
        .filter((q) => q.degree && q.institution),
      practice: form.get("facility")
        ? {
            facilityName: String(form.get("facility")),
            localityKey: (await localityFromForm(form)) ?? "",
            address: String(form.get("address") ?? ""),
            postalCode: String(form.get("postal") ?? ""),
            days: String(form.get("days") ?? ""),
            hours: String(form.get("hours") ?? ""),
            feeInr: Number(form.get("fee")) || null,
            phone: String(form.get("phone") ?? ""),
          }
        : undefined,
      consents: {
        publish: form.get("c_publish") === "on",
        photo: form.get("c_photo") === "on",
        phone: form.get("c_phone") === "on",
        accurate: form.get("c_accurate") === "on",
      },
    };
    if (!payload.name || !payload.specialtyKey) return { error: "Name and speciality are required.", code: "missing_name_specialty" };
    if (!payload.consents.publish || !payload.consents.accurate) return { error: "The publication and accuracy consents are required.", code: "missing_consent" };
    if (/\b(best|no\.?\s*1|top|most trusted)\b/i.test(payload.about ?? "")) return { error: "Superlatives such as “best” are not allowed in the introduction. Describe what you treat and where.", code: "superlative" };
    const council = String(form.get("council") ?? "").trim();
    const registration = String(form.get("registration") ?? "").trim();
    if (!council || !registration) return { error: "The council or registering body and the registration number are required.", code: "no_registration" };
    const row = await createSubmission(user.id, council, registration, payload);
    const src = claimSource(form.get("src"));
    await track("profile_submitted", { query: src ? `src:${src}` : null });
    return { ok: true, id: row.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong.";
    return { error: message, code: workflowErrorCode(message) };
  }
}
