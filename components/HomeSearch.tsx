"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { resolveDestination } from "@/components/HeaderSearch";

/**
 * `defaultLocation` is the busiest city the directory actually holds, chosen
 * by the homepage from live counts, so the pre-filled search never lands on
 * an empty listing.
 */
export function HomeSearch({ defaultLocation = "" }: { defaultLocation?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState(defaultLocation);

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
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Skin specialist, Dr Sharma, knee pain…"
        />
      </label>
      <div className="sep" />
      <label>
        <span className="k">City or locality</span>
        <input
          type="text"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="City or locality"
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
