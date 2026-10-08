"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SuggestInput, type SuggestItem } from "@/components/SuggestInput";
import { VoiceSearch } from "@/components/VoiceSearch";
import { resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { loadWhat, loadWhere } from "@/lib/search/client";
import { rememberLocation, useAutoLocation } from "@/lib/search/region-client";
import { paths } from "@/lib/site";

/**
 * Two-part search with suggestions under each field (/api/suggest). A
 * patient-language synonym ("skin doctor") or a misspelling ("cardiolgy")
 * resolves to the one canonical speciality page rather than minting a URL of
 * its own; anything we cannot resolve falls through to /search, which is
 * noindex. Picking a doctor goes straight to the profile.
 */
export function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const touchLoc = useAutoLocation(setLoc);

  function go(what: string, where: string) {
    rememberLocation(where);
    router.push(resolveDestination(what, where));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go(q, loc);
  }

  function pickWhat(item: SuggestItem) {
    if (item.href) return router.push(item.href);
    setQ(item.text);
    go(item.text, loc);
  }

  function pickWhere(item: SuggestItem) {
    touchLoc();
    setLoc(item.text);
    rememberLocation(item.text);
    if (q.trim()) go(q, item.text);
  }

  return (
    <form className="hsearch" onSubmit={submit} role="search">
      <SuggestInput value={q} onChange={setQ} onPick={pickWhat} load={loadWhat} scope={loc} placeholder="Doctor or speciality" ariaLabel="Doctor name or speciality" adornment={<VoiceSearch onInterim={setQ} onResult={(t) => { setQ(t); go(t, loc); }} />} />
      <div className="div" />
      <SuggestInput value={loc} onChange={(v) => { touchLoc(); setLoc(v); }} onPick={pickWhere} load={loadWhere} placeholder="City or locality" ariaLabel="City or locality" />
      <button type="submit">Search</button>
    </form>
  );
}

/**
 * Specialities resolve client-side (the registry is static); places are data,
 * so a location goes to /search?loc=, where the server resolves it against
 * the geography registry and redirects to the listing when both match. A
 * speciality with no place goes to its national hub, which always exists and
 * lists every city with supply — not to a fixed home city, whose page may be
 * empty or 404 for that speciality.
 */
export function resolveDestination(query: string, location: string): string {
  const specialty = resolveSpecialtyQuery(query);
  const loc = location.trim();
  if (loc) return `${paths.search(query.trim())}&loc=${encodeURIComponent(loc)}`;
  if (specialty) return paths.specialty(specialty.key);
  if (query.trim()) return paths.search(query.trim());
  return paths.home();
}
