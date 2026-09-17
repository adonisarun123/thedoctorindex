import "server-only";

import type { GateResult } from "@/lib/seo/gates";
import { routeOverride, routeOverrides } from "@/lib/services/seo";

export type OverrideMap = Map<string, "force_index" | "force_noindex">;

/**
 * The override table, or an empty map if it cannot be read.
 *
 * Callers that decide thousands of routes in one pass (the sitemap) take the
 * map once and apply it synchronously, rather than awaiting a lookup per path.
 */
export async function overrideMap(): Promise<OverrideMap> {
  return routeOverrides().catch(() => new Map() as OverrideMap);
}

/** Pure form of `withOverride`, for a caller that already holds the map. */
export function applyOverride(path: string, gate: GateResult, map: OverrideMap): GateResult {
  const o = map.get(path);
  if (!o) return gate;
  const forced = o === "force_index";
  return {
    indexable: forced,
    checks: [...gate.checks, { label: "Staff override", pass: forced, detail: forced ? "Forced into the index by staff (see /admin/seo for the reason)" : "Forced out of the index by staff (see /admin/seo for the reason)" }],
  };
}

/**
 * Applies a staff override from the SEO route allowlist (/admin/seo) to a
 * computed gate. An override never happens silently: it appears as an extra
 * check in the route inspector with the direction it forced.
 */
export async function withOverride(path: string, gate: GateResult): Promise<GateResult> {
  const o = await routeOverride(path).catch(() => null);
  if (!o) return gate;
  const forced = o === "force_index";
  return {
    indexable: forced,
    checks: [...gate.checks, { label: "Staff override", pass: forced, detail: forced ? "Forced into the index by staff (see /admin/seo for the reason)" : "Forced out of the index by staff (see /admin/seo for the reason)" }],
  };
}
