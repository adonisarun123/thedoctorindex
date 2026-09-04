"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CITY, resolveLocalityQuery, resolveSpecialtyQuery } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";

/**
 * Two-part search. A patient-language synonym ("skin doctor") resolves to the
 * one canonical speciality page rather than minting a URL of its own; anything
 * we cannot resolve falls through to /search, which is noindex.
 */
export function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(resolveDestination(q, loc));
  }

  return (
    <form className="hsearch" onSubmit={submit} role="search">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Doctor name or speciality"
        aria-label="Doctor name or speciality"
      />
      <div className="div" />
      <input
        type="text"
        value={loc}
        onChange={(e) => setLoc(e.target.value)}
        placeholder="City or locality"
        aria-label="City or locality"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export function resolveDestination(query: string, location: string): string {
  const specialty = resolveSpecialtyQuery(query);
  const locality = resolveLocalityQuery(location) ?? resolveLocalityQuery(query);

  if (specialty && locality) {
    return paths.localitySpecialty(
      locality.stateSlug,
      locality.citySlug,
      locality.key,
      specialty.slug,
    );
  }
  if (specialty) {
    return paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug);
  }
  if (query.trim()) return paths.search(query.trim());
  return paths.home();
}
