import "server-only";

import { eq, sql } from "drizzle-orm";

import { impliedAccountType, looksLikeDoctorName } from "@/lib/auth/doctor-journey";
import { normalizeIdentifier } from "@/lib/auth/hash";
import type { SessionUser } from "@/lib/auth/session";
import { getGeo } from "@/lib/data/geo";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { localityFromForm } from "@/lib/services/places";

/**
 * Registration details — name, mobile, email, home place, terms — saved once
 * per account and editable afterwards. Shared by /account/setup and by the
 * review form, which asks for them on the same page as the ratings rather
 * than sending the person to a separate setup step first.
 *
 * The identifier the person signed in with (email or mobile) is the
 * credential and cannot be changed here; the other channel is collected and
 * stored as declared. Both are unique across accounts.
 */
export type RegistrationResult = { error: string } | { ok: true; first: boolean; accountType: "patient" | "doctor"; fullName: string };

export async function completeRegistration(user: SessionUser, form: FormData, opts: { next?: string; forceAccountType?: "patient" | "doctor" } = {}): Promise<RegistrationResult> {
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const next = opts.next ?? "/account";

  const fullName = str("fullName").replace(/\s+/g, " ");
  if (fullName.length < 3 || !/^[\p{L}][\p{L} .'-]{1,79}$/u.test(fullName)) return { error: "Enter your full name as it appears on an ID (letters, spaces, dots and hyphens only)." };

  const first = !user.profileComplete;
  const typedKind = str("accountType");
  const accountType: "patient" | "doctor" = opts.forceAccountType
    ? opts.forceAccountType
    : first
      ? typedKind === "doctor" || typedKind === "patient" ? typedKind : impliedAccountType(next)
      : user.accountType ?? (user.role === "doctor" ? "doctor" : impliedAccountType(next));
  if (first && accountType === "patient" && !opts.forceAccountType && looksLikeDoctorName(fullName)) return { error: "That name starts with \"Dr\". If you are a doctor, choose \"A doctor or healthcare professional\" above; if not, enter your name without the title." };
  const doctorFirstRun = first && accountType === "doctor";

  // The mobile can be updated (people change numbers); the sign-in channel
  // stays fixed until verified change exists. A doctor's first run may skip
  // the mobile: it is asked when bookings are switched on, where it matters.
  const phoneIn = user.email ? str("phone") || user.phone || "" : user.phone ?? str("phone");
  const phone = normalizeIdentifier(phoneIn);
  if (!phone || phone.kind !== "phone") {
    if (!(doctorFirstRun && !phoneIn)) return { error: "Enter a valid Indian mobile number (10 digits starting 6–9)." };
  }

  const emailIn = user.email ?? str("email");
  const email = normalizeIdentifier(emailIn);
  if (!email || email.kind !== "email") return { error: "Enter a valid email address." };

  const localityKey = await localityFromForm(form).catch(() => null);
  const cityTyped = str("placeCity") || str("city");
  // A doctor's first run skips the home locality: the practice location comes
  // from the register entry they claim (lib/auth/doctor-journey.ts).
  if (!localityKey && !cityTyped && first && !doctorFirstRun) return { error: "Tell us where you are — choose your state and city." };
  const place = localityKey ? (await getGeo()).locality(localityKey) : null;

  if (first && form.get("terms") !== "on") return { error: "You need to accept the terms of use and privacy notice to continue." };

  const db = getDb();
  const phoneValue = phone && phone.kind === "phone" ? phone.value : null;
  try {
    const [clash] = await db
      .select({ id: s.users.id })
      .from(s.users)
      .where(sql`${s.users.id} <> ${user.id} and ((${phoneValue}::text is not null and ${s.users.phone} = ${phoneValue}) or lower(${s.users.email}) = ${email.value})`)
      .limit(1);
    if (clash) return { error: user.phone ? "That email address belongs to another account. Sign in with it instead, or use a different one." : "That mobile number belongs to another account. Sign in with it instead, or use a different one." };

    await db
      .update(s.users)
      .set({
        displayName: fullName,
        ...(phoneValue ? { phone: phoneValue } : {}),
        email: email.value,
        ...(localityKey || cityTyped || first ? { localityKey: localityKey ?? null, city: place?.city ?? (cityTyped || null) } : {}),
        marketingOptIn: form.get("marketing") === "on",
        ...(first ? { termsAcceptedAt: new Date(), profileCompletedAt: new Date(), accountType } : {}),
      })
      .where(eq(s.users.id, user.id));
  } catch (e) {
    return { error: e instanceof Error && /unique/i.test(e.message) ? "That mobile number or email is already registered to another account." : "Could not save your details. Try again." };
  }
  await audit({ actorUserId: user.id, actorRole: user.role, action: first ? "user.registered" : "user.profile_updated", entityType: "user", entityId: user.id, after: { locality: localityKey || cityTyped, termsAccepted: first || undefined, accountType: first ? accountType : undefined, via: opts.forceAccountType ? "inline" : "setup" } });
  return { ok: true, first, accountType, fullName };
}
