/**
 * The single cache tag every public read is filed under.
 *
 * It lives in its own module because both the data layer (lib/data/index.ts)
 * and the geography registry (lib/data/geo.ts) tag their caches with it, and
 * geo.ts is imported by the data layer — importing the constant from there
 * would close the cycle.
 */
export const DATA_CACHE_TAG = "doctors";
