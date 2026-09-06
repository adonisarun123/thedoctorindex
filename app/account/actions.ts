"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeIdentifier } from "@/lib/auth/hash";
import { getSessionUser } from "@/lib/auth/session";
import { getGeo } from "@/lib/data/geo";
import { localityFromForm } from "@/lib/services/places";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";

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
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const next = safeNext(str("next"));

  const fullName = str("fullName").replace(/\s+/g, " ");
  if (fullName.length < 3 || !/^[\p{L}][\p{L} .'-]{1,79}$/u.test(fullName)) return { error: "Enter your full name as it appears on an ID (letters, spaces, dots and hyphens only)." };

  // The mobile can be updated (people change numbers); the sign-in channel that
  // was used to create the account stays fixed until verified change exists.
  const phoneIn = user.email ? str("phone") || user.phone || "" : user.phone ?? str("phone");
  const phone = normalizeIdentifier(phoneIn);
  if (!phone || phone.kind !== "phone") return { error: "Enter a valid Indian mobile number (10 digits starting 6–9)." };

  const emailIn = user.email ?? str("email");
  const email = normalizeIdentifier(emailIn);
  if (!email || email.kind !== "email") return { error: "Enter a valid email address." };

  const localityKey = await localityFromForm(form).catch(() => null);
  const cityTyped = str("placeCity") || str("city");
  if (!localityKey && !cityTyped) return { error: "Tell us where you are — choose your state and city." };
  const place = localityKey ? (await getGeo()).locality(localityKey) : null;

  const first = !user.profileComplete;
  if (first && form.get("terms") !== "on") return { error: "You need to accept the terms of use and privacy notice to continue." };

  const db = getDb();
  try {
    // Uniqueness of the second channel across accounts.
    const [clash] = await db
      .select({ id: s.users.id })
      .from(s.users)
      .where(sql`${s.users.id} <> ${user.id} and (${s.users.phone} = ${phone.value} or lower(${s.users.email}) = ${email.value})`)
      .limit(1);
    if (clash) return { error: user.phone ? "That email address belongs to another account. Sign in with it instead, or use a different one." : "That mobile number belongs to another account. Sign in with it instead, or use a different one." };

    await db
      .update(s.users)
      .set({
        displayName: fullName,
        phone: phone.value,
        email: email.value,
        localityKey: localityKey ?? null,
        city: place?.city ?? cityTyped ?? null,
        marketingOptIn: form.get("marketing") === "on",
        ...(first ? { termsAcceptedAt: new Date(), profileCompletedAt: new Date() } : {}),
      })
      .where(eq(s.users.id, user.id));
  } catch (e) {
    return { error: e instanceof Error && /unique/i.test(e.message) ? "That mobile number or email is already registered to another account." : "Could not save your details. Try again." };
  }
  await audit({ actorUserId: user.id, actorRole: user.role, action: first ? "user.registered" : "user.profile_updated", entityType: "user", entityId: user.id, after: { locality: localityKey || cityTyped, termsAccepted: first || undefined } });
  revalidatePath("/account");
  if (first) redirect(next);
  return { ok: true, message: "Details saved." };
}
