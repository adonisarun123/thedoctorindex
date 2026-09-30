import { once } from "node:events";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

import { config } from "dotenv";
import postgres from "postgres";

import { classify, nameSortedKey, plausibleYear, REGISTER_COUNCILS } from "../../lib/nmc/classify";
import { nameTokens } from "../../lib/enrich/names";
import { normalizeKey } from "../../lib/services/doctors";

config({ path: ".env.local" });
config();

/**
 * Load the NMC Indian Medical Register export into `nmc_register` and
 * `nmc_register_qualifications`, categorising every entry on the way in.
 *
 *   npm run nmc:load -- --profiles <NMC_Register_Full_profiles.csv> --quals <NMC_Register_Full_additional_qualifications.csv> [--truncate] [--limit N]
 *
 * Streams both files (432 MB + 79 MB) with COPY, so the full register loads
 * in minutes over a direct Neon connection. Re-running with --truncate
 * replaces the tables; without it, rows already present are kept (the
 * primary key rejects duplicates and the load stops — use --truncate).
 *
 * Nothing here touches `doctors`: this is the register, not the directory.
 * scripts/nmc/match-existing.ts and scripts/nmc/build-profiles.ts read it.
 */

const args = process.argv.slice(2);
const arg = (k: string) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (k: string) => args.includes(k);

const PROFILES = arg("--profiles") ?? "";
const QUALS = arg("--quals") ?? "";
const LIMIT = Number(arg("--limit") ?? Infinity);
if (!PROFILES || !QUALS) {
  console.error("usage: npm run nmc:load -- --profiles <csv> --quals <csv> [--truncate] [--limit N]");
  process.exit(2);
}

/* ------------------------------------------------------------------------ */
/* CSV streaming                                                             */
/* ------------------------------------------------------------------------ */

/** Yields rows as arrays. Handles quoted fields with embedded commas, doubled quotes and line breaks inside quotes. */
async function* csvRows(path: string): AsyncGenerator<string[]> {
  const rl = createInterface({ input: createReadStream(path, { encoding: "utf8" }), crlfDelay: Infinity });
  let carry: string | null = null;
  let first = true;
  for await (let line of rl) {
    if (first) {
      line = line.replace(/^﻿/, "");
      first = false;
    }
    const text: string = carry !== null ? `${carry}\n${line}` : line;
    const parsed = parseLine(text);
    if (parsed === null) {
      carry = text; // an open quote — the field continues on the next line
      continue;
    }
    carry = null;
    yield parsed;
  }
}

/** Returns null when the line ends inside a quoted field. */
function parseLine(text: string): string[] | null {
  const out: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      out.push(field);
      field = "";
    } else field += c;
  }
  if (quoted) return null;
  out.push(field);
  return out;
}

const q = (v: string | number | boolean | null | undefined): string => {
  if (v === null || v === undefined || v === "") return "";
  const s = String(v);
  return `"${s.replace(/"/g, '""')}"`;
};
/** Always quoted — for NOT NULL text columns where the source may be empty. */
const qq = (v: string) => `"${v.replace(/"/g, '""')}"`;
const pgArray = (xs: string[]) => `{${xs.map((x) => `"${x.replace(/[\\"]/g, "")}"`).join(",")}}`;
const int = (v: string | undefined): number | null => (v && /^-?\d+$/.test(v.trim()) ? Number(v.trim()) : null);
const dateOf = (v: string | undefined): string | null => {
  const m = v?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const y = Number(m[1]);
  if (y < 1880 || y > 2030) return null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== `${m[1]}-${m[2]}-${m[3]}` ? null : `${m[1]}-${m[2]}-${m[3]}`;
};
const tsOf = (v: string | undefined): string | null => {
  if (!v) return null;
  const d = new Date(v.replace(" ", "T") + (v.includes("+") || v.endsWith("Z") ? "" : "Z"));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

async function writeAll(w: NodeJS.WritableStream, chunk: string) {
  if (!w.write(chunk)) await once(w, "drain");
}

/* ------------------------------------------------------------------------ */

type Qual = { seq: number | null; degree: string; year: number | null; university: string | null };

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  const sql = postgres(url, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const t0 = Date.now();
  const elapsed = () => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

  if (has("--truncate")) {
    await sql`truncate nmc_register_qualifications`;
    await sql`truncate nmc_register`;
    console.log("truncated");
  }

  // 1. Additional qualifications: keep in memory for classification, and COPY as they stream.
  console.log(`reading ${QUALS}`);
  const quals = new Map<number, Qual[]>();
  let header: string[] | null = null;
  let qn = 0;
  const qw = await sql`copy nmc_register_qualifications (source_record_id, seq, degree, year, university) from stdin with (format csv, null '')`.writable();
  let buf: string[] = [];
  for await (const row of csvRows(QUALS)) {
    if (!header) {
      header = row.map((h) => h.trim());
      continue;
    }
    const r = Object.fromEntries(header.map((h, i) => [h, (row[i] ?? "").trim()]));
    const id = int(r["Source record ID"]);
    const degree = r["Additional qualification"] ?? "";
    if (id === null || !degree) continue;
    const qual: Qual = { seq: int(r["Qualification sequence"]), degree, year: int(r["Qualification year"]), university: r["University"] || null };
    const list = quals.get(id) ?? [];
    list.push(qual);
    quals.set(id, list);
    buf.push([id, qual.seq ?? "", q(degree), qual.year ?? "", q(qual.university)].join(","));
    qn++;
    if (buf.length >= 5000) {
      await writeAll(qw, buf.join("\n") + "\n");
      buf = [];
    }
  }
  if (buf.length) await writeAll(qw, buf.join("\n") + "\n");
  qw.end();
  await once(qw, "finish").catch(() => {});
  console.log(`${qn} additional qualifications for ${quals.size} entries · ${elapsed()}`);

  // 2. Profiles.
  console.log(`reading ${PROFILES}`);
  const cols = [
    "source_record_id", "name", "council", "council_code", "number", "number_normalized", "council_normalized", "registration_date", "year_of_information", "qualification", "qualification_year", "university", "uprn", "additional_count", "removed", "data_notes", "source_url", "retrieved_at",
    "name_clean", "name_tokens", "name_sorted", "state_slug", "era_year", "category", "specialty_key", "specialty_basis", "specialty_rank",
  ];
  const pw = await sql.unsafe(`copy nmc_register (${cols.join(", ")}) from stdin with (format csv, null '')`).writable();
  header = null;
  let n = 0, skipped = 0;
  const cats = new Map<string, number>();
  const seen = new Set<number>();
  buf = [];
  for await (const row of csvRows(PROFILES)) {
    if (!header) {
      header = row.map((h) => h.trim());
      continue;
    }
    if (n >= LIMIT) break;
    const r = Object.fromEntries(header.map((h, i) => [h, (row[i] ?? "").trim()]));
    const id = int(r["Source record ID"]);
    if (id === null || seen.has(id)) {
      skipped++;
      continue;
    }
    seen.add(id);
    const code = r["Council code"] || null;
    const known = code ? REGISTER_COUNCILS[code] : undefined;
    const council = known?.name ?? r["Medical council"] ?? "";
    const number = r["Registration number"] ?? "";
    const regDate = dateOf(r["Registration date"]);
    const primaryYear = int(r["Qualification year"]);
    const extra = quals.get(id) ?? [];
    extra.sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
    const c = classify({
      name: r["Doctor name"] ?? "",
      number,
      removed: r["Removal status (source)"] === "1",
      primaryQualification: r["Qualification"] || null,
      primaryYear,
      registrationYear: regDate ? Number(regDate.slice(0, 4)) : null,
      additional: extra.map((e) => ({ degree: e.degree, year: e.year })),
    });
    cats.set(c.category, (cats.get(c.category) ?? 0) + 1);
    const tokens = c.nameClean ? nameTokens(c.nameClean) : [];
    buf.push(
      [
        id, qq(r["Doctor name"] ?? ""), qq(council), q(code), qq(number), qq(normalizeKey(number)), qq(normalizeKey(council)), regDate ?? "", plausibleYear(int(r["Year of information"])) ?? "", q(r["Qualification"]), plausibleYear(primaryYear) ?? "", q(r["University"]), q(r["UPRN"]), int(r["Additional qualifications count"]) ?? extra.length, r["Removal status (source)"] === "1" ? "t" : "f", q(r["Data notes"]), q(r["Source request URL"]), tsOf(r["Retrieved at (UTC)"]) ?? "",
        q(c.nameClean), q(pgArray(tokens)), q(c.nameClean ? nameSortedKey(c.nameClean) : null), q(known?.stateSlug ?? null), c.eraYear ?? "", qq(c.category), q(c.specialty?.key ?? null), q(c.specialty?.basis ?? null), c.specialty?.rank ?? 0,
      ].join(","),
    );
    n++;
    if (buf.length >= 5000) {
      await writeAll(pw, buf.join("\n") + "\n");
      buf = [];
    }
    if (n % 100000 === 0) console.log(`  ${n} rows · ${elapsed()}`);
  }
  if (buf.length) await writeAll(pw, buf.join("\n") + "\n");
  pw.end();
  await once(pw, "finish").catch(() => {});
  console.log(`${n} register entries loaded (${skipped} skipped: no id or duplicate id) · ${elapsed()}`);
  console.log("categories:", Object.fromEntries([...cats.entries()].sort((a, b) => b[1] - a[1])));

  const [{ count }] = await sql`select count(*)::int as count from nmc_register`;
  console.log(`nmc_register now holds ${count} rows`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
