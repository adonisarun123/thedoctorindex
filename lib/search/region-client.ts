"use client";

import { useEffect, useRef } from "react";

/**
 * The location default for the search boxes.
 *
 * Order of precedence: what the visitor typed in this session, then the place
 * they last searched with (remembered in this browser), then the city
 * /api/region guesses from their IP. The guess is only ever a pre-filled,
 * editable value — never a redirect — because IP city in India is often
 * wrong on mobile networks.
 */
const KEY = "tdi_loc";

export function rememberedLocation(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function rememberLocation(value: string): void {
  try {
    window.localStorage.setItem(KEY, value.trim());
  } catch {
    /* private mode or storage blocked: the IP default still works */
  }
}

let pending: Promise<string | null> | null = null;

/** One /api/region request per page load, shared by every search box on the page. */
export function detectedLocation(): Promise<string | null> {
  pending ??= fetch("/api/region", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<{ city: string | null }>) : { city: null }))
    .then((j) => j.city ?? null)
    .catch(() => null);
  return pending;
}

/**
 * Fills the location field once on mount unless the visitor has already
 * typed in it. Returns the `touch` callback the field's onChange must call.
 */
export function useAutoLocation(setLoc: (v: string) => void): () => void {
  const touched = useRef(false);
  useEffect(() => {
    let live = true;
    const saved = rememberedLocation();
    if (saved !== null) {
      if (!touched.current) setLoc(saved);
      return;
    }
    detectedLocation().then((city) => {
      if (live && city && !touched.current) setLoc(city);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return () => {
    touched.current = true;
  };
}
