"use client";

import { useEffect, useState } from "react";

type Kind = "ok" | "err" | "info";
interface Toast { id: number; text: string; kind: Kind; action?: { label: string; href: string } }

/** Fire a toast from anywhere on the client. Server components can't; they render notices. */
export function toast(text: string, kind: Kind = "info", action?: Toast["action"]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tdi:toast", { detail: { text, kind, action } }));
}

let seq = 0;

/**
 * Bottom-right stack. Successes clear in 4 s, errors stay until dismissed.
 * One element on the page; ActionForm and the shortcut layer post to it.
 */
export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<Omit<Toast, "id">>).detail;
      const id = ++seq;
      setItems((xs) => [...xs.slice(-4), { id, ...d }]);
      if (d.kind !== "err") setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
    };
    window.addEventListener("tdi:toast", on);
    return () => window.removeEventListener("tdi:toast", on);
  }, []);
  if (!items.length) return null;
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <span className="toast-t">{t.text}</span>
          {t.action ? <a className="toast-a" href={t.action.href}>{t.action.label}</a> : null}
          <button type="button" className="toast-x" aria-label="Dismiss" onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}>×</button>
        </div>
      ))}
    </div>
  );
}
