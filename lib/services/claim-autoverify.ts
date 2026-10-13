import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { accountNameMatches } from "@/lib/nmc/instant-match";
import { facilityMatchesHospital, hospitalForEmail } from "@/lib/registers/hospital-domains";
import { audit } from "@/lib/services/audit";
import { decideClaim } from "@/lib/services/workflow";

/**
 * Hospital-email tier. A claim made by the "email at my hospital domain"
 * method is approved at once — no document, no officer — when three things
 * agree: the account's sign-in email is at a known hospital's domain (the
 * mailbox is proven by the code or Google sign-in), the profile practises at
 * that hospital, and the account name fits the profile name. Anything short
 * of that is left for the officer with the domain finding written on it.
 *
 * Returns what happened so the UI can say "you're in" or "sent for a check".
 */
export type AutoVerifyOutcome = { kind: "approved"; hospital: string } | { kind: "queued"; note: string | null };

export async function autoVerifyWorkEmailClaim(claimId: string): Promise<AutoVerifyOutcome> {
  const db = getDb();
  const c = await db.query.doctorClaims.findFirst({ where: eq(s.doctorClaims.id, claimId) });
  if (!c || c.status !== "pending" || c.method !== "work_email") return { kind: "queued", note: null };
  const [u] = await db.select({ email: s.users.email, name: s.users.displayName }).from(s.users).where(eq(s.users.id, c.userId)).limit(1);
  const hospital = hospitalForEmail(u?.email);
  if (!hospital) return { kind: "queued", note: null };
  const d = await db.query.doctors.findFirst({ where: eq(s.doctors.id, c.doctorId), with: { practices: { with: { facility: { columns: { name: true } } } } } });
  if (!d) return { kind: "queued", note: null };
  const facilities = d.practices.map((p) => p.facility?.name ?? "").filter(Boolean);
  const atHospital = facilityMatchesHospital(hospital, facilities);
  const nameFit: { ok: boolean; reason?: string } = u?.name ? accountNameMatches(d.name, u.name) : { ok: false, reason: "no account name" };
  const note = `Sign-in email is at ${hospital.hospital} (${hospital.domain}); ${atHospital ? "profile practises there" : "profile does not list that hospital"}; account name ${nameFit.ok ? "fits" : `does not fit (${nameFit.reason})`} the profile name.`;
  if (atHospital && nameFit.ok) {
    // Decided by the system; the verification check records the source.
    await decideClaim(claimId, "approved", c.userId, `Auto-verified: ${note}`);
    await audit({ actorUserId: c.userId, actorRole: "doctor", action: "claim.auto_verified", entityType: "claim", entityId: claimId, after: { hospital: hospital.hospital, domain: hospital.domain } });
    return { kind: "approved", hospital: hospital.hospital };
  }
  await db.update(s.doctorClaims).set({ note }).where(eq(s.doctorClaims.id, claimId));
  return { kind: "queued", note };
}
