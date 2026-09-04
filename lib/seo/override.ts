import "server-only";

import type { GateResult } from "@/lib/seo/gates";
import { routeOverride } from "@/lib/services/seo";

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
