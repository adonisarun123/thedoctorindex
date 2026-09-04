"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { paths } from "@/lib/site";

/**
 * Contact actions gated behind sign-in.
 *
 * The practice phone number is not in the public HTML, the RSC payload, the
 * sitemap or the JSON-LD. A signed-in person clicks "Call practice", the
 * number is fetched from /api/contact/<practice> (rate-limited per account,
 * counted for the doctor's analytics) and the dialler opens. Directions work
 * the same way. A visitor who is not signed in is sent to sign in and
 * returned to the same page.
 */

let sessionPromise: Promise<boolean> | null = null;
function signedIn(): Promise<boolean> {
  if (!sessionPromise) {
    sessionPromise = fetch("/api/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { signedIn: false }))
      .then((j) => Boolean(j.signedIn))
      .catch(() => false);
  }
  return sessionPromise;
}
export function resetSessionProbe() {
  sessionPromise = null;
}

export function useSignedIn(): boolean | null {
  const [v, setV] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    signedIn().then((x) => alive && setV(x));
    return () => {
      alive = false;
    };
  }, []);
  return v;
}

function sid(): string {
  try {
    const key = "tdi_sid";
    let v = localStorage.getItem(key);
    if (!v) {
      v = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(key, v);
    }
    return v;
  } catch {
    return "";
  }
}

export function beacon(kind: string, data: Record<string, string | null | undefined> = {}) {
  try {
    const payload = JSON.stringify({ kind, sid: sid(), path: location.pathname, query: new URLSearchParams(location.search).get("q") ?? undefined, ...data });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
    else fetch("/api/events", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    /* never block the UI */
  }
}

export function ViewBeacon({ doctorId, localityKey }: { doctorId?: string; localityKey?: string | null }) {
  useEffect(() => {
    if (doctorId) beacon("profile_viewed", { doctorId, localityKey: localityKey ?? undefined });
  }, [doctorId, localityKey]);
  return null;
}

const cls = (variant: "solid" | "outline" | "quiet") => (variant === "solid" ? "btn solid" : variant === "outline" ? "btn" : "btn quiet");

type Contact = { tel: string | null; phone: string | null; directions: string; address: string };
const cache = new Map<string, Promise<Contact | null>>();
function loadContact(practiceId: string, purpose: "call" | "directions"): Promise<Contact | null> {
  const key = `${practiceId}:${purpose}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`/api/contact/${practiceId}?for=${purpose}`, { credentials: "same-origin", cache: "no-store" })
        .then((r) => (r.ok ? (r.json() as Promise<Contact>) : null))
        .catch(() => null),
    );
  }
  return cache.get(key)!;
}

function GatedButton({ practiceId, purpose, label, variant, hint }: { practiceId?: string; purpose: "call" | "directions"; label: string; variant: "solid" | "outline" | "quiet"; hint: string }) {
  const pathname = usePathname();
  const isIn = useSignedIn();
  const [state, setState] = useState<"idle" | "busy" | "none" | "error">("idle");
  const [contact, setContact] = useState<Contact | null>(null);

  if (!practiceId || isIn === false || isIn === null) {
    // Not signed in (or not yet known, or a seed-mode build with no practice ids): route through sign-in.
    return (
      <Link className={cls(variant)} href={paths.signIn(pathname || "/")} title={hint} rel="nofollow">
        {label}
      </Link>
    );
  }

  if (contact && purpose === "call" && contact.tel) {
    return (
      <a className={cls(variant)} href={contact.tel}>
        Call {contact.phone}
      </a>
    );
  }
  if (contact && purpose === "directions") {
    return (
      <a className={cls(variant)} href={contact.directions} target="_blank" rel="noopener noreferrer">
        Open in maps ↗
      </a>
    );
  }
  if (state === "none") return <span className="btn quiet" aria-disabled="true" style={{ opacity: 0.7 }}>Number withheld by the doctor</span>;
  if (state === "error") return <span className="btn quiet" aria-disabled="true" style={{ opacity: 0.7 }}>Unavailable right now</span>;

  return (
    <button
      type="button"
      className={cls(variant)}
      disabled={state === "busy"}
      onClick={async () => {
        setState("busy");
        const c = await loadContact(practiceId, purpose);
        if (!c) return setState("error");
        if (purpose === "call" && !c.tel) return setState("none");
        setContact(c);
        setState("idle");
        if (purpose === "call" && c.tel) window.location.href = c.tel;
        if (purpose === "directions") window.open(c.directions, "_blank", "noopener");
      }}
    >
      {state === "busy" ? "…" : label}
    </button>
  );
}

export function CallButton({ practiceId, variant = "solid" }: { practiceId?: string; doctorId?: string; variant?: "solid" | "outline" | "quiet" }) {
  return <GatedButton practiceId={practiceId} purpose="call" label="Call practice" variant={variant} hint="Sign in to see the practice number" />;
}

export function DirectionsButton({ practiceId, variant = "outline" }: { practiceId?: string; doctorId?: string; address?: string; variant?: "solid" | "outline" | "quiet" }) {
  return <GatedButton practiceId={practiceId} purpose="directions" label="Directions" variant={variant} hint="Sign in to get directions" />;
}

export function EnquiryLink({ href, variant = "quiet", label = "Request appointment" }: { href: string; variant?: "solid" | "outline" | "quiet"; label?: string }) {
  return (
    <Link className={cls(variant)} href={href}>
      {label}
    </Link>
  );
}
