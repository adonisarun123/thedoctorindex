"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { requestOtp, verifyOtp } from "@/lib/auth/otp";
import { createSession, destroySession, getSessionUser } from "@/lib/auth/session";
import { audit } from "@/lib/services/audit";

export interface SignInState {
  step: "identify" | "verify";
  identifier?: string;
  kind?: "email" | "phone";
  error?: string;
  next?: string;
}

function safeNext(next: string | undefined | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function requestOtpAction(_prev: SignInState, form: FormData): Promise<SignInState> {
  const identifier = String(form.get("identifier") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));
  const h = await headers();
  const res = await requestOtp(identifier, "sign_in", h.get("x-forwarded-for")?.split(",")[0]);
  if (!res.ok) return { step: "identify", error: res.error, next };
  return { step: "verify", identifier: res.identifier, kind: res.kind, next };
}

export async function verifyOtpAction(_prev: SignInState, form: FormData): Promise<SignInState> {
  const identifier = String(form.get("identifier") ?? "");
  const code = String(form.get("code") ?? "");
  const next = safeNext(String(form.get("next") ?? ""));
  const res = await verifyOtp(identifier, code, "sign_in");
  if (!res.ok) return { step: "verify", identifier, error: res.error, next };
  await createSession(res.userId);
  await audit({ actorUserId: res.userId, action: res.created ? "user.created_and_signed_in" : "user.signed_in", entityType: "user", entityId: res.userId });
  redirect(next === "/" ? await homeFor(res.userId) : next);
}

/** Where a freshly signed-in account lands when no `next` was requested. */
export async function homeFor(userId: string): Promise<string> {
  const u = await getSessionUser();
  if (u && u.id === userId) {
    if (u.role === "staff" && u.staffRoles.length) return "/admin";
    if (u.role === "doctor") return "/dashboard";
  }
  return "/account";
}

export async function signOutAction(): Promise<void> {
  const u = await getSessionUser();
  await destroySession();
  if (u) await audit({ actorUserId: u.id, action: "user.signed_out", entityType: "user", entityId: u.id });
  redirect("/");
}
