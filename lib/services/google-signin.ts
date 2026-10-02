import "server-only";

import { and, eq, sql } from "drizzle-orm";

import type { GoogleProfile } from "@/lib/auth/google";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { flowFromNext } from "@/lib/funnel";

const PROVIDER = "google";

/**
 * Resolve a Google sign-in to an account, the same way a one-time code does:
 * the identity if already linked, else the account holding that verified
 * email, else a new account. Returns null for a disabled account.
 * The Google portrait is not copied: a doctor's public photo comes from their
 * profile, and a personal Gmail avatar is rarely the right one.
 */
export async function signInWithGoogle(
  p: GoogleProfile & { email: string },
  next: string,
): Promise<{ userId: string; created: boolean } | null> {
  const db = getDb();

  const [linked] = await db
    .select({ userId: s.userIdentities.userId })
    .from(s.userIdentities)
    .where(and(eq(s.userIdentities.provider, PROVIDER), eq(s.userIdentities.subject, p.sub)))
    .limit(1);

  let userId = linked?.userId ?? null;
  let created = false;
  if (!userId) {
    const [byEmail] = await db.select({ id: s.users.id }).from(s.users).where(sql`lower(${s.users.email}) = ${p.email}`).limit(1);
    userId = byEmail?.id ?? null;
  }
  if (!userId) {
    const [u] = await db
      .insert(s.users)
      .values({ email: p.email, displayName: p.name, signupFlow: flowFromNext(next), signupNext: next.slice(0, 300) })
      .returning({ id: s.users.id });
    userId = u.id;
    created = true;
  }

  const [user] = await db.select({ disabledAt: s.users.disabledAt, displayName: s.users.displayName }).from(s.users).where(eq(s.users.id, userId)).limit(1);
  if (!user || user.disabledAt) return null;
  // Fill a missing name; never overwrite one the person typed themselves.
  if (!user.displayName && p.name) await db.update(s.users).set({ displayName: p.name }).where(eq(s.users.id, userId));

  const values = {
    email: p.email,
    emailVerified: p.emailVerified,
    name: p.name,
    givenName: p.givenName,
    familyName: p.familyName,
    lastUsedAt: new Date(),
  };
  if (linked) {
    await db.update(s.userIdentities).set(values).where(and(eq(s.userIdentities.provider, PROVIDER), eq(s.userIdentities.subject, p.sub)));
  } else {
    await db.insert(s.userIdentities).values({ userId, provider: PROVIDER, subject: p.sub, ...values });
  }
  return { userId, created };
}
