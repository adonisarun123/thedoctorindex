"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { resolveDestination } from "@/components/HeaderSearch";
import { SuggestInput, type SuggestItem } from "@/components/SuggestInput";
import { searchHrefAction } from "@/app/search/actions";
import { VoiceSearch } from "@/components/VoiceSearch";
import { loadWhat, loadWhere } from "@/lib/search/client";
import { rememberLocation, useAutoLocation } from "@/lib/search/region-client";

/**
 * `defaultLocation` is the busiest city the directory actually holds, chosen
 * by the homepage from live counts, so the pre-filled search never lands on
 * an empty listing. Both fields suggest as the person types (/api/suggest).
 */
export function HomeSearch({ defaultLocation = "" }: { defaultLocation?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState(defaultLocation);
  // The busiest city is only the server-rendered fallback; on the client the
  // visitor's last place, else their IP city, replaces it (never a redirect).
  const touchLoc = useAutoLocation(setLoc);

  async function go(what: string, where: string) {
    rememberLocation(where);
    const dest = resolveDestination(what, where);
    // Free-text searches are sealed server-side so the terms never sit in the URL (lib/search/sealed.ts).
    router.push(dest.startsWith("/search") ? await searchHrefAction(what, where) : dest);
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
    <form
      className="bigsearch"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        void go(q, loc);
      }}
    >
      <label>
        <span className="k">Doctor, speciality or condition</span>
        <SuggestInput value={q} onChange={setQ} onPick={pickWhat} load={loadWhat} scope={loc} placeholder="Skin specialist, Dr Sharma, knee pain…" ariaLabel="Doctor, speciality or condition" adornment={<VoiceSearch onInterim={setQ} onResult={(t) => { setQ(t); go(t, loc); }} />} />
      </label>
      <div className="sep" />
      <label>
        <span className="k">City or locality</span>
        <SuggestInput value={loc} onChange={(v) => { touchLoc(); setLoc(v); }} onPick={pickWhere} load={loadWhere} placeholder="City or locality" ariaLabel="City or locality" />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
