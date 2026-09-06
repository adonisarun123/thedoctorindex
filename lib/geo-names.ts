/**
 * Pure helpers for place names; no server-only imports so scripts and tests can use them.
 */

/** URL-safe slug for place names: "Vijay Nagar" → "vijay-nagar". */
export function placeSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "INDORE" / "kamrup metropolitan" → "Indore" / "Kamrup Metropolitan". */
export function placeName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/(^|[\s(\-/])([a-z])/g, (m, pre, c) => pre + c.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of");
}

