/**
 * Date helpers. The UI shows dates as "04 Sep 2026"; the database stores
 * ISO dates. Everything crosses that boundary through these two functions.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "04 Sep 2026" | "2026-09-04" | Date → "2026-09-04" */
export function toIso(input: string | Date | null | undefined): string | null {
  if (!input) return null;
  if (input instanceof Date) return input.toISOString().slice(0, 10);
  const s = input.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/.exec(s);
  if (!m) return null;
  const month = MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase());
  if (month < 0) return null;
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/** "2026-09-04" | Date → "04 Sep 2026" */
export function toDisplay(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input.length === 10 ? `${input}T00:00:00Z` : input) : input;
  if (Number.isNaN(d.getTime())) return String(input);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Whole days between two dates (b - a). */
export function daysBetween(a: string | Date, b: string | Date = new Date()): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.floor((db.getTime() - da.getTime()) / 86_400_000);
}

export function addDays(input: string | Date, days: number): string {
  const d = typeof input === "string" ? new Date(input) : new Date(input.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
