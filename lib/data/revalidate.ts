import "server-only";

import { revalidateTag } from "next/cache";

import { DATA_CACHE_TAG } from "@/lib/data";
import { invalidateGeo } from "@/lib/data/geo";

/** Drop every cached public read (listings, counts, profiles, geography) after a change that should show at once. */
export function revalidateDoctors(): void {
  revalidateTag(DATA_CACHE_TAG);
  invalidateGeo();
}
