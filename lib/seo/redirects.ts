/**
 * Slug redirect table (project plan §6, §11.5).
 *
 * A doctor's public ID is part of the URL, so a name change does not break it.
 * Merges and deliberate slug changes still happen, and each one leaves a
 * permanent 301 here. Removed profiles with no successor are NOT listed: they
 * return a genuine 404/410 rather than being redirected to the homepage.
 *
 * In production this table is the `slug_redirects` relation, read by the same
 * middleware. The shape is identical.
 */
export interface SlugRedirect {
  from: string;
  to: string;
  /** Why the redirect exists — kept for audit, never rendered. */
  reason: "name-change" | "merge" | "slug-correction";
  createdOn: string;
}

export const SLUG_REDIRECTS: SlugRedirect[] = [
  {
    from: "/doctor/anita-s-d8f4c2",
    to: "/doctor/anita-sharma-d8f4c2",
    reason: "name-change",
    createdOn: "2026-06-14",
  },
  {
    from: "/doctor/suresh-gowda-duplicate-9f10ab",
    to: "/doctor/suresh-gowda-c7e9a1",
    reason: "merge",
    createdOn: "2026-07-02",
  },
];

const MAP = new Map(SLUG_REDIRECTS.map((r) => [r.from, r.to]));

export function lookupRedirect(pathname: string): string | null {
  return MAP.get(pathname.replace(/\/$/, "")) ?? null;
}
