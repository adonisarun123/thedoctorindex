import "server-only";

import { decrypt, encrypt } from "@/lib/auth/crypto";

/**
 * What a visitor typed into search never appears in a URL.
 *
 * A search for "chest pain" or "my daughter's anxiety" is health information.
 * In a query string it would reach Google Analytics (page_location and the
 * site-search report), the Google Ads tag that runs before consent, browser
 * history sync and server request logs. So /search is addressed by an opaque,
 * authenticated-encrypted token (AES-256-GCM, lib/auth/crypto) instead of
 * ?q=…&loc=…; only the server can read it back. Pagination and the near-me
 * sort stay plain because they carry nothing about the visitor's interest.
 */
export interface SearchTerms {
  q: string;
  loc: string;
}

export function sealSearch(terms: SearchTerms): string {
  const json = JSON.stringify({ q: terms.q.trim().slice(0, 240), l: terms.loc.trim().slice(0, 120) });
  // The ciphertext's own dots and base64 survive encodeURIComponent; base64url keeps the URL tidy.
  return Buffer.from(encrypt(json), "utf8").toString("base64url");
}

export function openSearch(token: string | null | undefined): SearchTerms | null {
  if (!token || token.length > 2000) return null;
  try {
    const parsed = JSON.parse(decrypt(Buffer.from(token, "base64url").toString("utf8"))) as { q?: unknown; l?: unknown };
    return { q: typeof parsed.q === "string" ? parsed.q : "", loc: typeof parsed.l === "string" ? parsed.l : "" };
  } catch {
    // Tampered, truncated, or sealed under a key that has since been rotated out.
    return null;
  }
}

export function sealedSearchPath(terms: SearchTerms): string {
  return terms.q.trim() || terms.loc.trim() ? `/search?t=${sealSearch(terms)}` : "/search";
}
