import "server-only";

import { and, eq, sql } from "drizzle-orm";

import type { LinkedInProfile } from "@/lib/auth/linkedin";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { flowFromNext } from "@/lib/funnel";
import { storeFile } from "@/lib/services/files";

const PROVIDER = "linkedin";
const PHOTO_MAX = 3 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Resolve a LinkedIn sign-in to an account, the same way a one-time code does:
 * the identity if it is already linked, else the account holding that verified
 * email, else a new account. Returns null for a disabled account.
 */
export async function signInWithLinkedIn(
  p: LinkedInProfile & { email: string },
  next: string,
): Promise<{ userId: string; created: boolean } | null> {
  const db = getDb();

  const [linked] = await db
    .select({ userId: s.userIdentities.userId, photoFileId: s.userIdentities.photoFileId })
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

  if (p.picture && !linked?.photoFileId) {
    const photoFileId = await copyPortrait(p.picture, userId).catch((e) => {
      console.error(`[linkedin] portrait not copied · ${(e as Error).message}`);
      return null;
    });
    if (photoFileId) {
      await db.update(s.userIdentities).set({ photoFileId }).where(and(eq(s.userIdentities.provider, PROVIDER), eq(s.userIdentities.subject, p.sub)));
    }
  }

  return { userId, created };
}

/**
 * LinkedIn portrait URLs expire, so the bytes are copied into the private file
 * store. Private: nothing shows it publicly until the doctor chooses to use it.
 */
async function copyPortrait(url: string, userId: string): Promise<string | null> {
  if (!/^https:\/\/media\.licdn\.com\//.test(url)) return null;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!PHOTO_TYPES.has(mime)) return null;
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length === 0 || bytes.length > PHOTO_MAX) return null;
  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const row = await storeFile({ bucket: "private", filename: `linkedin-portrait.${ext}`, mime, bytes, uploadedByUserId: userId });
  return row.id;
}
