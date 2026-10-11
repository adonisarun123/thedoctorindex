"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Progressive enhancement for every `.table` in the console: click a header
 * to sort the rows by that column (numbers, dates and text each compare as
 * what they are), click again to reverse. Pure DOM work, so server-rendered
 * tables need no change. Re-runs on navigation.
 */
export function EnhanceTables() {
  const pathname = usePathname();
  useEffect(() => {
    const tables = document.querySelectorAll<HTMLTableElement>(".admin-shell table.table");
    const cleanups: Array<() => void> = [];
    tables.forEach((table) => {
      const head = table.tHead?.rows[0];
      const body = table.tBodies[0];
      if (!head || !body || body.rows.length < 2) return;
      Array.from(head.cells).forEach((th, col) => {
        if (!th.textContent?.trim() || th.querySelector("input,button")) return;
        th.classList.add("sortable");
        th.tabIndex = 0;
        th.setAttribute("role", "button");
        th.setAttribute("aria-sort", "none");
        const sort = () => {
          const dir = th.getAttribute("aria-sort") === "ascending" ? "desc" : "asc";
          head.querySelectorAll("th").forEach((o) => o.setAttribute("aria-sort", "none"));
          th.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
          const rows = Array.from(body.rows).filter((r) => r.cells.length > col);
          const key = (r: HTMLTableRowElement) => (r.cells[col].getAttribute("data-sort") ?? r.cells[col].textContent ?? "").trim();
          const num = (v: string) => { const n = Number(v.replace(/[,₹%\s]/g, "")); return v !== "" && Number.isFinite(n) ? n : null; };
          const date = (v: string) => { const d = Date.parse(v); return /\d{4}/.test(v) && Number.isFinite(d) ? d : null; };
          const allNum = rows.every((r) => num(key(r)) !== null || key(r) === "" || key(r) === "—");
          const allDate = !allNum && rows.every((r) => date(key(r)) !== null || key(r) === "" || key(r) === "—");
          rows.sort((a, b) => {
            const ka = key(a), kb = key(b);
            let c = 0;
            if (allNum) c = (num(ka) ?? -Infinity) - (num(kb) ?? -Infinity);
            else if (allDate) c = (date(ka) ?? -Infinity) - (date(kb) ?? -Infinity);
            else c = ka.localeCompare(kb, "en", { numeric: true, sensitivity: "base" });
            return dir === "asc" ? c : -c;
          });
          rows.forEach((r) => body.appendChild(r));
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); } };
        th.addEventListener("click", sort);
        th.addEventListener("keydown", onKey);
        cleanups.push(() => { th.removeEventListener("click", sort); th.removeEventListener("keydown", onKey); th.classList.remove("sortable"); });
      });
    });
    return () => cleanups.forEach((c) => c());
  }, [pathname]);
  return null;
}
