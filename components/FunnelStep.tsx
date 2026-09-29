"use client";

import { useEffect, useRef } from "react";

import { trackEvent, type FunnelEvent, type FunnelParams } from "@/lib/funnel";

/**
 * Fires one GA4 event when a funnel step renders — for steps drawn by server
 * components (the claim page, account setup). Once per mount; gtag may load a
 * moment after hydration, so it retries briefly before giving up.
 */
export function FunnelStep({ event, params = {} }: { event: FunnelEvent; params?: FunnelParams }) {
  const sent = useRef(false);
  const key = JSON.stringify(params);
  useEffect(() => {
    sent.current = false;
    let tries = 0;
    const p = JSON.parse(key) as FunnelParams;
    const tick = () => {
      if (sent.current) return;
      if (typeof (window as Window & { gtag?: unknown }).gtag === "function") {
        sent.current = true;
        trackEvent(event, p);
      } else if (++tries < 20) {
        timer = setTimeout(tick, 250);
      }
    };
    let timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [event, key]);
  return null;
}
