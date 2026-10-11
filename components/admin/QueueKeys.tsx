"use client";

import { usePathname } from "next/navigation";
import { startTransition, useActionState, useCallback, useEffect, useState } from "react";

import type { AdminState } from "@/app/admin/actions";
import { toast } from "@/components/admin/Toaster";

/**
 * Keyboard triage and bulk selection for a queue page. Cards opt in with
 * `data-queue-item`; buttons inside opt in with `data-key` ("1"…"9", "a",
 * "d", "r"); `data-open` marks the link to the doctor; `data-public-url`
 * the public profile URL to copy.
 *
 *   j / k  move focus        x  select        1–9 a d r  press that button
 *   o      open the doctor   c  copy the public link
 *
 * Bulk: the selected ids go to `bulkAction` with the op the bar button names.
 */
export function QueueKeys({ bulkAction, ops, noun = "items" }: { bulkAction?: (prev: AdminState, f: FormData) => Promise<AdminState>; ops?: Array<{ op: string; label: string; confirm?: string; variant?: "solid" | "quiet" }>; noun?: string }) {
  const pathname = usePathname();
  const [focus, setFocus] = useState(-1);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, act, pending] = useActionState<AdminState, FormData>(bulkAction ?? (async () => ({})), {});

  const cards = useCallback(() => Array.from(document.querySelectorAll<HTMLElement>("[data-queue-item]")), []);

  // Paint focus and selection onto the DOM (the cards are server-rendered).
  useEffect(() => {
    const all = cards();
    all.forEach((c, i) => {
      c.classList.toggle("is-focus", i === focus);
      const id = c.getAttribute("data-queue-item") ?? "";
      c.classList.toggle("is-selected", selected.includes(id));
      const box = c.querySelector<HTMLInputElement>("input.q-select");
      if (box) box.checked = selected.includes(id);
    });
    if (focus >= 0) all[focus]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focus, selected, cards]);

  // Checkbox clicks (mouse) keep the React list in sync.
  useEffect(() => {
    const on = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (!t.classList?.contains("q-select")) return;
      const id = t.closest<HTMLElement>("[data-queue-item]")?.getAttribute("data-queue-item") ?? "";
      setSelected((s) => (t.checked ? [...new Set([...s, id])] : s.filter((x) => x !== id)));
    };
    document.addEventListener("change", on);
    return () => document.removeEventListener("change", on);
  }, []);

  useEffect(() => { setFocus(-1); setSelected([]); }, [pathname]);

  useEffect(() => {
    if (state.ok && state.message) { toast(state.message, "ok"); setSelected([]); }
    if (state.error) toast(state.error, "err");
  }, [state]);

  useEffect(() => {
    const typing = (t: EventTarget | null) => { const el = t as HTMLElement | null; const tag = el?.tagName; return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || Boolean(el?.isContentEditable); };
    const on = (e: KeyboardEvent) => {
      if (typing(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const all = cards();
      if (!all.length) return;
      const k = e.key;
      if (k === "j" || k === "ArrowDown") { e.preventDefault(); setFocus((f) => Math.min(all.length - 1, f + 1)); return; }
      if (k === "k" || k === "ArrowUp") { e.preventDefault(); setFocus((f) => Math.max(0, f - 1)); return; }
      const card = all[focus];
      if (!card) return;
      const id = card.getAttribute("data-queue-item") ?? "";
      if (k === "x") { e.preventDefault(); setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])); return; }
      if (k === "o") { e.preventDefault(); card.querySelector<HTMLAnchorElement>("a[data-open]")?.click(); return; }
      if (k === "c") {
        const url = card.getAttribute("data-public-url");
        if (url) { e.preventDefault(); navigator.clipboard.writeText(url).then(() => toast("Public link copied", "ok"), () => toast("Could not copy", "err")); }
        return;
      }
      if (/^[1-9adr]$/.test(k)) {
        const btn = card.querySelector<HTMLButtonElement>(`[data-key="${k}"]`);
        if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [focus, cards]);

  if (!bulkAction || !ops?.length || selected.length === 0) return null;
  return (
    <div className="bulkbar" role="region" aria-label="Bulk actions">
      <span className="bulkbar-n"><b>{selected.length}</b> {noun} selected</span>
      {ops.map((o) => (
        <button
          key={o.op}
          type="button"
          className={`btn ${o.variant ?? "quiet"}`}
          disabled={pending}
          onClick={() => {
            if (o.confirm && !window.confirm(o.confirm.replace("{n}", String(selected.length)))) return;
            const f = new FormData();
            f.set("op", o.op);
            f.set("ids", selected.join(","));
            startTransition(() => act(f));
          }}
        >
          {pending ? "Working…" : o.label}
        </button>
      ))}
      <button type="button" className="bulkbar-x" onClick={() => setSelected([])} aria-label="Clear selection">Clear</button>
    </div>
  );
}
