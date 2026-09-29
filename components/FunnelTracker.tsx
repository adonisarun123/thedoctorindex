"use client";

import { useEffect } from "react";

import { pageType, trackEvent } from "@/lib/funnel";

/**
 * Site-wide listeners, mounted once in the root layout, so no individual
 * button or form needs its own tracking code:
 *
 *  1. Clicks on any link to /claim-profile or /add-doctor → claim_cta_click /
 *     add_profile_cta_click, with where on the page it was (header, footer,
 *     body) and the page type. Covers the header, footer, home page, doctor
 *     pages, "for doctors", sign-in and every future link to those routes.
 *
 *  2. Funnel forms: any element marked data-funnel="<form_name>" (optionally
 *     data-funnel-flow="<flow>"). The first focus inside it sends
 *     funnel_form_start; leaving the page (tab closed, navigated away, app
 *     backgrounded) with a started form that was never submitted sends
 *     form_abandon with the last field used and how many fields were touched.
 *     Field *names* only — never values.
 */
type Started = { form: string; flow?: string; fields: Set<string>; last: string; submitted: boolean };

export function FunnelTracker() {
  useEffect(() => {
    const started = new Map<Element, Started>();

    const funnelRoot = (el: EventTarget | null) => (el instanceof Element ? el.closest("[data-funnel]") : null);

    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL((a as HTMLAnchorElement).href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      // An in-site link is a client-side navigation: no pagehide will fire, so
      // report any started, unsent form now. A new-tab link is not leaving.
      if ((a as HTMLAnchorElement).target !== "_blank" && !a.closest("[data-funnel]")) flush();
      const ev = url.pathname.startsWith("/claim-profile") ? "claim_cta_click" : url.pathname.startsWith("/add-doctor") ? "add_profile_cta_click" : null;
      if (!ev) return;
      const where = a.closest("header") ? "header" : a.closest("footer") ? "footer" : "body";
      trackEvent(ev, { cta_location: where, page_type: pageType(location.pathname), src: url.searchParams.get("src") });
    };

    const onFocus = (e: FocusEvent) => {
      const root = funnelRoot(e.target);
      if (!root) return;
      const name = (e.target as HTMLInputElement).name || (e.target as HTMLElement).id || "";
      let s = started.get(root);
      // Back in a form after a submit means the submit failed (error shown) —
      // it counts as unsent again until the next submit.
      if (s && s.submitted) s.submitted = false;
      if (!s) {
        s = { form: root.getAttribute("data-funnel") ?? "form", flow: root.getAttribute("data-funnel-flow") ?? undefined, fields: new Set(), last: "", submitted: false };
        started.set(root, s);
        trackEvent("funnel_form_start", { form_name: s.form, flow: s.flow });
      }
      // Skip buttons; they are not fields.
      if (name && !(e.target instanceof HTMLButtonElement)) {
        s.fields.add(name);
        s.last = name;
      }
    };

    const onSubmit = (e: SubmitEvent) => {
      const root = funnelRoot(e.target);
      const s = root ? started.get(root) : undefined;
      if (s) s.submitted = true;
    };

    // A form no longer on screen was completed or moved past (a multi-step
    // flow swapped it for the next step), so only connected ones count.
    function flush() {
      for (const [root, s] of started) {
        if (s.submitted || !root.isConnected) continue;
        trackEvent("form_abandon", { form_name: s.form, flow: s.flow, last_field: s.last || "none", fields_touched: s.fields.size });
        s.submitted = true; // once
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocus, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, []);
  return null;
}

