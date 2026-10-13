"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { doctorDestination, isDoctorNext, unverifiedDoctorHome } from "@/lib/auth/doctor-journey";
import { getSessionUser } from "@/lib/auth/session";
import { completeRegistration } from "@/lib/services/registration";

export interface ProfileState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

/**
 * Registration details, required once per account and editable afterwards.
 * The identifier the person signed in with (email or mobile) cannot be
 * changed here — it is the credential; the other one is collected and,
 * until SMS/email verification of the second channel exists, stored as
 * declared. Both are unique across accounts.
 */
export async function saveProfileDetailsAction(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=%2Faccount%2Fsetup");
  const next = safeNext(String(form.get("next") ?? "").trim());
  const res = await completeRegistration(user, form, { next });
  if ("error" in res) return { error: res.error };
  revalidatePath("/account");
  // A doctor lands on "Is this you?" with the name just typed — on the
  // destination they came for when it is a doctor one, else the register search.
  const doctorFirstRun = res.first && res.accountType === "doctor";
  if (res.first) redirect(doctorFirstRun ? (isDoctorNext(next) ? doctorDestination(next, res.fullName) : unverifiedDoctorHome(res.fullName)) : next);
  return { ok: true, message: "Details saved." };
}
