import { getListing } from "@/lib/data";
import { sortByRank } from "@/lib/ranking";
import type { DoctorView, SpecialtyKey } from "@/lib/types";

/**
 * Doctor profiles shown on a condition page.
 *
 * Until now a condition page linked only to the speciality listing, never to a
 * doctor. These rows are the part of the page a compiled-source clone cannot
 * have, and they give Google crawl paths into the profiles themselves.
 *
 * Honest framing: these are doctors of the speciality that usually assesses
 * the condition, not doctors who claim a special interest in it. The page
 * words the block that way.
 *
 * Rotation: 200+ condition pages share ~20 specialities. Showing every
 * dermatology page the same top five would pile every link onto five
 * profiles, so each page takes a window into the top POOL, offset by a hash
 * of its slug. Indexable profiles come first in the pool.
 */
export const CONDITION_CITY = { stateSlug: "karnataka", citySlug: "bengaluru", label: "Bangalore" } as const;

const POOL = 24;
export const CONDITION_DOCTORS_SHOWN = 5;

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  return h;
}

/** Pure part, exported for tests. */
export function pickConditionDoctors(slug: string, ranked: DoctorView[], show = CONDITION_DOCTORS_SHOWN): DoctorView[] {
  const pool = [...ranked.filter((d) => d.indexable), ...ranked.filter((d) => !d.indexable)].slice(0, POOL);
  if (pool.length <= show) return pool;
  const start = hash(slug) % pool.length;
  return Array.from({ length: show }, (_, i) => pool[(start + i) % pool.length]);
}

export async function doctorsForCondition(slug: string, specialty: SpecialtyKey): Promise<DoctorView[]> {
  const listing = await getListing(specialty, { stateSlug: CONDITION_CITY.stateSlug, citySlug: CONDITION_CITY.citySlug });
  return pickConditionDoctors(slug, sortByRank(listing, { specialty }));
}
