"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const KEY = "tdi_near";

/**
 * "Use my location" — explicit, per-click consent through the browser's own
 * permission prompt. The position is rounded to three decimals (~100 m),
 * kept only in this browser (localStorage) so the control can offer it
 * again on the next results page, and applied by reloading the current URL
 * with `near=lat,lng`. Nothing about the visitor's position is sent
 * anywhere except as that query parameter on pages they choose to open.
 */
export function NearMe({ active }: { active: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [state, setState] = useState<"idle" | "locating" | "denied" | "unsupported" | "error">("idle");
  const [remembered, setRemembered] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRemembered(localStorage.getItem(KEY));
    } catch {
      /* ignore */
    }
  }, []);

  const withNear = (near: string | null) => {
    const p = new URLSearchParams(sp.toString());
    if (near) {
      p.set("near", near);
      p.delete("sort");
    } else p.delete("near");
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const locate = () => {
    if (!("geolocation" in navigator)) return setState("unsupported");
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = `${pos.coords.latitude.toFixed(3)},${pos.coords.longitude.toFixed(3)}`;
        try {
          localStorage.setItem(KEY, near);
        } catch {
          /* ignore */
        }
        setState("idle");
        router.push(withNear(near));
      },
      (err) => setState(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  if (active) {
    return (
      <span className="nearme on">
        <span className="dot" aria-hidden="true" />
        Sorted by distance from your location
        <Link href={withNear(null)} className="chip">
          Turn off
        </Link>
      </span>
    );
  }

  return (
    <span className="nearme">
      <button type="button" className="chip" onClick={locate} disabled={state === "locating"} title="Sort results by distance from where you are now">
        {state === "locating" ? "Locating…" : "Near me"}
      </button>
      {remembered && state === "idle" ? (
        <Link href={withNear(remembered)} className="chip" title="Use the location you shared earlier in this browser">
          Use last location
        </Link>
      ) : null}
      {state === "denied" ? <span className="hint">Location permission was refused. Pick a locality from the filters instead.</span> : null}
      {state === "unsupported" ? <span className="hint">This browser cannot share a location.</span> : null}
      {state === "error" ? <span className="hint">Could not get a fix. Try again or pick a locality.</span> : null}
    </span>
  );
}
