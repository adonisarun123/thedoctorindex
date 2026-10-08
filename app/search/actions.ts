"use server";

import { sealedSearchPath } from "@/lib/search/sealed";

/** The search boxes ask the server for the /search URL so the terms are sealed before the address bar (and every tag reading it) sees them. */
export async function searchHrefAction(q: string, loc: string): Promise<string> {
  return sealedSearchPath({ q: String(q ?? ""), loc: String(loc ?? "") });
}
