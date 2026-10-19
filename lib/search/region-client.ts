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

/** The IP guess, remembered per browser so /api/region runs once a day per visitor, not once per page view. */
const DETECTED_KEY = "tdi_loc_ip";
const DETECTED_TTL_MS = 24 * 3600 * 1000;

function readDetected(): { city: string | null } | null {
  try {
    const raw = window.localStorage.getItem(DETECTED_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { city: string | null; at: number };
    return typeof v.at === "number" && Date.now() - v.at < DETECTED_TTL_MS ? { city: v.city ?? null } : null;
  } catch {
    return null;
  }
}

function writeDetected(city: string | null): void {
  try {
    window.localStorage.setItem(DETECTED_KEY, JSON.stringify({ city, at: Date.now() }));
  } catch {
    /* storage blocked: next page asks again, which is still correct */
  }
}

/** One /api/region request per visitor per day, shared by every search box on the page. */
export function detectedLocation(): Promise<string | null> {
  const remembered = readDetected();
  if (remembered) return Promise.resolve(remembered.city);
  pending ??= fetch("/api/region", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<{ city: string | null }>) : null))
    .then((j) => {
      if (!j) return null;
      const city = j.city ?? null;
      writeDetected(city);
      return city;
    })
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
