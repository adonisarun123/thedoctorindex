"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { NavEntry } from "@/components/admin/CommandPalette";

/**
 * Global keys for the console. Nothing fires while a field has focus.
 *   ⌘K / Ctrl+K   command palette        /   focus the doctor search
 *   g then <key>  go to a page           n   new profile
 *   ?             this cheat-sheet       esc close sheets
 * Queue pages add their own (components/admin/QueueKeys.tsx).
 */
export function Shortcuts({ nav, onPalette }: { nav: NavEntry[]; onPalette: () => void }) {
  const router = useRouter();
  const [sheet, setSheet] = useState(false);
  const [pendingG, setPendingG] = useState(false);

  useEffect(() => {
    let gTimer: ReturnType<typeof setTimeout> | null = null;
    const typing = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    };
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); onPalette(); return; }
      if (typing(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") { setSheet(false); return; }
      if (pendingG) {
        setPendingG(false);
        if (gTimer) clearTimeout(gTimer);
        const hit = nav.find((n) => n.keys === `g ${e.key.toLowerCase()}`);
        if (hit) { e.preventDefault(); router.push(hit.href); }
        return;
      }
      if (e.key === "g") { setPendingG(true); gTimer = setTimeout(() => setPendingG(false), 1200); return; }
      if (e.key === "/") { e.preventDefault(); document.querySelector<HTMLInputElement>(".adm-search input")?.focus(); return; }
      if (e.key === "n") { e.preventDefault(); router.push("/admin/doctors/new"); return; }
      if (e.key === "?") { e.preventDefault(); setSheet((s) => !s); return; }
    };
    const openSheet = () => setSheet(true);
    window.addEventListener("keydown", on);
    window.addEventListener("tdi:shortcuts", openSheet);
    return () => { window.removeEventListener("keydown", on); window.removeEventListener("tdi:shortcuts", openSheet); if (gTimer) clearTimeout(gTimer); };
  }, [nav, onPalette, pendingG, router]);

  if (!sheet) return pendingG ? <div className="g-hint" aria-live="polite">g … then a key</div> : null;
  const goto = nav.filter((n) => n.keys);
  return (
    <div className="pal-scrim" onMouseDown={() => setSheet(false)} role="presentation">
      <div className="pal sheet" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sheet-h">Keyboard shortcuts <button type="button" className="toast-x" aria-label="Close" onClick={() => setSheet(false)}>×</button></div>
        <div className="sheet-cols">
          <div>
            <div className="pal-gl">Everywhere</div>
            <Row k="⌘ K" v="Command palette — find anything" />
            <Row k="/" v="Focus the doctor search" />
            <Row k="n" v="New doctor profile" />
            <Row k="?" v="This sheet" />
            <div className="pal-gl" style={{ marginTop: 12 }}>Go to</div>
            {goto.map((n) => <Row key={n.href} k={n.keys!} v={n.label} />)}
          </div>
          <div>
            <div className="pal-gl">On a queue</div>
            <Row k="j / k" v="Next / previous item" />
            <Row k="x" v="Select item (for bulk actions)" />
            <Row k="1 – 9" v="Pick the nth candidate / option" />
            <Row k="a" v="Approve / accept the first option" />
            <Row k="d" v="Dismiss / reject" />
            <Row k="r" v="Retry / reset" />
            <Row k="o" v="Open the doctor" />
            <Row k="c" v="Copy the doctor's public link" />
            <div className="pal-gl" style={{ marginTop: 12 }}>Tables</div>
            <Row k="click a header" v="Sort by that column; click again to reverse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="sheet-row"><span className="sheet-k">{k.split(" ").map((p, i) => <kbd key={i}>{p}</kbd>)}</span><span>{v}</span></div>;
}
