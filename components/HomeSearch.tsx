"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { resolveDestination } from "@/components/HeaderSearch";
import { SuggestInput, type SuggestItem } from "@/components/SuggestInput";
import { loadWhat, loadWhere } from "@/lib/search/client";

/**
 * `defaultLocation` is the busiest city the directory actually holds, chosen
 * by the homepage from live counts, so the pre-filled search never lands on
 * an empty listing. Both fields suggest as the person types (/api/suggest).
 */
export function HomeSearch({ defaultLocation = "" }: { defaultLocation?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState(defaultLocation);

  function pickWhat(item: SuggestItem) {
    if (item.href) return router.push(item.href);
    setQ(item.text);
    router.push(resolveDestination(item.text, loc));
  }

  function pickWhere(item: SuggestItem) {
    setLoc(item.text);
    if (q.trim()) router.push(resolveDestination(q, item.text));
  }

  return (
    <form
      className="bigsearch"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(resolveDestination(q, loc));
      }}
    >
      <label>
        <span className="k">Doctor, speciality or condition</span>
        <SuggestInput value={q} onChange={setQ} onPick={pickWhat} load={loadWhat} scope={loc} placeholder="Skin specialist, Dr Sharma, knee pain…" ariaLabel="Doctor, speciality or condition" />
      </label>
      <div className="sep" />
      <label>
        <span className="k">City or locality</span>
        <SuggestInput value={loc} onChange={setLoc} onPick={pickWhere} load={loadWhere} placeholder="City or locality" ariaLabel="City or locality" />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
