"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "@/components/admin/Toaster";

export interface NavEntry { href: string; label: string; group: string; keys?: string }
interface Hit { kind: "nav" | "action" | "doctor" | "patient" | "booking"; title: string; sub?: string; href?: string; tag?: string; run?: () => void }

const RECENT_KEY = "tdi.admin.recent";

/**
 * ⌘K. One box that goes anywhere: every console page, a doctor by name,
 * slug, TDi ID or registration number, a patient by name, mobile or email,
 * a booking by reference, and the few global actions. Results from
 * /admin/api/search arrive as you type; navigation matches are instant.
 */
export function CommandPalette({ nav, open, onClose }: { nav: NavEntry[]; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [remote, setRemote] = useState<Hit[]>([]);
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ(""); setRemote([]); setSel(0);
    const t = setTimeout(() => input.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  // Remote results, debounced; a stale response never overwrites a newer one.
  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < 2) { setRemote([]); setBusy(false); return; }
    let live = true;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/admin/api/search?q=${encodeURIComponent(term)}`, { cache: "no-store" });
        const j = (await r.json()) as { hits?: Hit[] };
        if (live) setRemote(j.hits ?? []);
      } catch {
        if (live) setRemote([]);
      } finally {
        if (live) setBusy(false);
      }
    }, 160);
    return () => { live = false; clearTimeout(t); };
  }, [q, open]);

  const recent = useMemo<string[]>(() => {
    if (!open) return [];
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
  }, [open]);

  const actions: Hit[] = useMemo(() => [
    { kind: "action", title: "New doctor profile", sub: "Create a profile by hand", href: "/admin/doctors/new" },
    { kind: "action", title: "Toggle theme", sub: "Light / dark / auto", run: () => (document.querySelector<HTMLButtonElement>(".adm-top .themebtn")?.click()) },
    { kind: "action", title: "Keyboard shortcuts", sub: "Show the cheat-sheet", run: () => window.dispatchEvent(new CustomEvent("tdi:shortcuts")) },
    { kind: "action", title: "View public site", sub: "Opens in a new tab", run: () => window.open("/", "_blank", "noopener") },
  ], []);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    const navHits: Hit[] = nav
      .filter((n) => !term || n.label.toLowerCase().includes(term) || n.group.toLowerCase().includes(term))
      .map((n) => ({ kind: "nav", title: n.label, sub: n.group, href: n.href, tag: n.keys }));
    const actionHits = actions.filter((a) => !term || a.title.toLowerCase().includes(term) || (a.sub ?? "").toLowerCase().includes(term));
    if (!term) {
      const rec = recent.map((h) => nav.find((n) => n.href === h)).filter(Boolean).map((n) => ({ kind: "nav" as const, title: n!.label, sub: "Recent", href: n!.href }));
      const rest = navHits.filter((n) => !recent.includes(n.href!));
      return [...rec, ...rest, ...actionHits];
    }
    return [...remote, ...navHits, ...actionHits];
  }, [q, nav, actions, remote, recent]);

  useEffect(() => setSel(0), [hits.length, q]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = useCallback((h: Hit) => {
    onClose();
    if (h.run) { h.run(); return; }
    if (!h.href) return;
    if (h.kind === "nav") {
      try { localStorage.setItem(RECENT_KEY, JSON.stringify([h.href, ...recent.filter((r) => r !== h.href)].slice(0, 5))); } catch { /* per-viewer nicety only */ }
    }
    router.push(h.href);
  }, [onClose, recent, router]);

  if (!open) return null;
  const groups: Array<[string, Hit[]]> = [
    ["Doctors", hits.filter((h) => h.kind === "doctor")],
    ["Patients", hits.filter((h) => h.kind === "patient")],
    ["Bookings", hits.filter((h) => h.kind === "booking")],
    ["Go to", hits.filter((h) => h.kind === "nav")],
    ["Actions", hits.filter((h) => h.kind === "action")],
  ];
  let i = -1;
  return (
    <div className="pal-scrim" onMouseDown={onClose} role="presentation">
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="pal-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16m10 2-4.3-4.3" /></svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Doctor, patient, booking ref, or a page…"
            aria-label="Search the console"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(hits.length - 1, s + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); const h = hits[sel]; if (h) go(h); }
              else if (e.key === "Escape") { e.preventDefault(); onClose(); }
            }}
          />
          {busy ? <span className="pal-busy" aria-live="polite">searching…</span> : <kbd className="pal-kbd">esc</kbd>}
        </div>
        <div className="pal-list" ref={list}>
          {hits.length === 0 ? <div className="pal-empty">{q.trim().length < 2 ? "Type to search" : busy ? "Searching…" : "Nothing matches"}</div> : null}
          {groups.map(([label, items]) =>
            items.length ? (
              <div className="pal-group" key={label}>
                <div className="pal-gl">{label}</div>
                {items.map((h) => {
                  i += 1;
                  const idx = i;
                  return (
                    <button type="button" key={`${h.kind}:${h.href ?? h.title}`} data-i={idx} className={`pal-item${idx === sel ? " is-sel" : ""}`} onMouseEnter={() => setSel(idx)} onClick={() => go(h)}>
                      <span className={`pal-dot ${h.kind}`} aria-hidden="true" />
                      <span className="pal-t">{h.title}</span>
                      {h.sub ? <span className="pal-s">{h.sub}</span> : null}
                      {h.tag ? <span className="pal-tag">{h.tag}</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : null,
          )}
        </div>
        <div className="pal-foot"><kbd>↑↓</kbd> move <kbd>↵</kbd> open <kbd>esc</kbd> close <span className="pal-foot-r">Copy a doctor link: open it, then <kbd>c</kbd></span></div>
      </div>
    </div>
  );
}

/** Copies text, with a toast either way. Shared by the shortcuts layer. */
export async function copyText(text: string, label = "Copied") {
  try { await navigator.clipboard.writeText(text); toast(label, "ok"); } catch { toast("Could not copy", "err"); }
}
