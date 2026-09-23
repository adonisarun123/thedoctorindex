import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { normaliseTdiId } from "@/lib/data/tdi-codes";

const PUBLIC_STATUSES = ["published", "suspended", "retired"];

/**
 * Resolves a TDI ID to the doctor's current slug, following merges. Returns
 * null for an unknown ID or a record that is no longer public, so a printed
 * card for a withdrawn profile lands on a 404, never on someone else.
 */
export async function resolveTdiId(raw: string): Promise<{ tdiId: string; slug: string } | null> {
  const tdiId = normaliseTdiId(raw);
  if (!tdiId) return null;
  const db = getDb();
  const cols = { slug: s.doctors.slug, status: s.doctors.status, mergedIntoId: s.doctors.mergedIntoId };
  let [d] = await db.select(cols).from(s.doctors).where(eq(s.doctors.tdiId, tdiId)).limit(1);
  for (let hops = 0; d?.mergedIntoId && hops < 5; hops++) {
    [d] = await db.select(cols).from(s.doctors).where(eq(s.doctors.id, d.mergedIntoId)).limit(1);
  }
  if (!d || !PUBLIC_STATUSES.includes(d.status)) return null;
  return { tdiId, slug: d.slug };
}
