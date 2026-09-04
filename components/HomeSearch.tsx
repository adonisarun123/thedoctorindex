"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { resolveDestination } from "@/components/HeaderSearch";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("Bengaluru");

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
        <span className="k">Doctor or speciality</span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cardiologist, skin specialist, Dr Sharma…"
        />
      </label>
      <div className="sep" />
      <label>
        <span className="k">City or locality</span>
        <input
          type="text"
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Bengaluru, Indiranagar…"
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}
