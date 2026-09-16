import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { config } from "dotenv";

import { NmcClient, matchOnRegister, type ProfileForNmc } from "../lib/enrich/nmc";

config({ path: ".env.local" });
config();

/**
 * Find a registration number for every harvested doctor, against the NMC/State
 * Medical Council register.
 *
 *   npm run db:match -- [--dir data/private/harvest] [--concurrency 3] [--limit N] [--state karnataka]
 *
 * Harvested hospital rosters give a name, a speciality and a place of work, but
 * almost never a registration number. The register is the only authority that
 * can turn a name into one, so this runs before import: a doctor we cannot
 * place on the register is not published, they are held as a draft.
 *
 * Identity, deliberately, is the registration number and nothing else. Two
 * hospital pages for "Suresh Kumar, cardiologist" are the same person only if
 * the register says so; matching on name alone would merge two real doctors
 * into one profile, which on a medical directory is a lie, not a tidy-up.
 *
 * Matching is `matchOnRegister` — the same unique-tight-match-only rule the
 * background worker uses. Ambiguous and not_found are recorded with their
 * candidates and never guessed at.
 *
 * Politeness: searches are memoised to disk by (name token, council). Thousands
 * of doctors share a few hundred surnames, so the register sees one query per
 * surname per council instead of one per doctor — an order of magnitude fewer
 * requests than the naive loop. Detail lookups happen only on a unique match.
 * Resumable: rerunning skips names already resolved in matched.json.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const DIR = arg("--dir", "data/private/harvest");
const CONCURRENCY = Math.max(1, Math.min(4, Number(arg("--concurrency", "3"))));
const LIMIT = Number(arg("--limit", String(Infinity)));
const STATE = arg("--state", "karnataka");
const OUT = join(DIR, "matched.json");
const MEMO = join(DIR, ".register-memo.json");

type Harvested = {
  name: string;
  specialty?: string;
  qualifications?: string[];
  hospital?: string;
  source_url: string;
  registration_number?: string | null;
  [k: string]: unknown;
};

type Matched = Harvested & {
  nmc: {
    status: string;
    number: string | null;
    council: string | null;
    registered_year: number | null;
    degree: string | null;
    university: string | null;
    place: string | null;
    candidates: number;
    query: string;
  };
};

/** Disk-backed memo so a re-run, or a second pass over a new hospital, costs the register nothing. */
function loadMemo(): Map<string, { total: number; rows: unknown[] }> {
  if (!existsSync(MEMO)) return new Map();
  try {
    return new Map(Object.entries(JSON.parse(readFileSync(MEMO, "utf8"))));
  } catch {
    return new Map();
  }
}

function memoisedClient(memo: Map<string, { total: number; rows: unknown[] }>, onWrite: () => void) {
  const client = new NmcClient({ pauseMs: Number(arg("--pause", "1200")) });

  /**
   * The register's detail endpoint answers 500 for a minority of entries, and a
   * throw there discarded a match we had already found. Keep the match, lose the
   * degree line, and flag it: `detailFailed` makes the outcome publishable but
   * NOT verified, so the background worker re-checks it later — including the
   * struck-off status, which is the one thing detail is needed for.
   */
  const realDetail = client.detail.bind(client);
  let detailFailed = false;
  client.detail = (async (row: Parameters<typeof realDetail>[0]) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await realDetail(row);
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    detailFailed = true;
    return { degree: null, university: null, yearOfPassing: null, registrationDate: null, place: null, removed: false };
  }) as typeof client.detail;
  (client as unknown as { takeDetailFailed: () => boolean }).takeDetailFailed = () => {
    const v = detailFailed;
    detailFailed = false;
    return v;
  };

  const realSearch = client.search.bind(client);
  client.search = (async (params: Parameters<typeof realSearch>[0], max?: number) => {
    const key = JSON.stringify([params.name ?? "", params.registrationNo ?? "", params.smcId ?? "", params.year ?? ""]);
    const hit = memo.get(key);
    if (hit) return hit as Awaited<ReturnType<typeof realSearch>>;
    const res = await realSearch(params, max);
    memo.set(key, res);
    onWrite();
    return res;
  }) as typeof client.search;
  return client;
}

async function main() {
  // Harvest outputs only: not the memo, not the matched output, not pre-rerun snapshots.
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.startsWith(".") && !f.startsWith("matched") && !/\.(pre|bak)\.json$/.test(f));
  const records: Harvested[] = [];
  for (const f of files) {
    const parsed = JSON.parse(readFileSync(join(DIR, f), "utf8")) as unknown;
    if (!Array.isArray(parsed)) {
      console.log(`  skipping ${f} (not a harvest array)`);
      continue;
    }
    for (const r of parsed as Harvested[]) if (r?.name && r.source_url) records.push({ ...r, _file: f } as Harvested);
  }
  console.log(`${records.length} harvested records from ${files.length} files`);

  const done = new Map<string, Matched["nmc"]>();
  if (existsSync(OUT)) {
    for (const m of JSON.parse(readFileSync(OUT, "utf8")) as Matched[]) {
      // Errors are a failure to ask, not an answer — always retry them.
      if (m.nmc && m.nmc.status !== "error") done.set(`${m.name.toLowerCase()}|${(m.registration_number ?? "").toLowerCase()}`, m.nmc);
    }
    console.log(`resuming: ${done.size} names already resolved`);
  }

  const memo = loadMemo();
  let memoDirty = 0;
  const flush = () => {
    if (++memoDirty % 25 === 0) writeFileSync(MEMO, JSON.stringify(Object.fromEntries(memo)));
  };

  const todo = records.slice(0, LIMIT);
  const out: Matched[] = [];
  let i = 0;
  let resolved = 0;
  const counts: Record<string, number> = {};

  const worker = async (w: number) => {
    const client = memoisedClient(memo, flush);
    while (true) {
      const n = i++;
      if (n >= todo.length) return;
      const r = todo[n];
      const key = `${r.name.toLowerCase()}|${(r.registration_number ?? "").toLowerCase()}`;
      const cached = done.get(key);
      if (cached) {
        out.push({ ...r, nmc: cached });
        counts[cached.status] = (counts[cached.status] ?? 0) + 1;
        continue;
      }
      const profile: ProfileForNmc = {
        name: r.name,
        stateSlug: STATE,
        registration: r.registration_number ? { number: String(r.registration_number), council: "Karnataka Medical Council" } : null,
      };
      let nmc: Matched["nmc"];
      try {
        const res = await matchOnRegister(client, profile);
        const match = "match" in res ? res.match : null;
        const noDetail = (client as unknown as { takeDetailFailed: () => boolean }).takeDetailFailed();
        nmc = {
          // A match whose detail we could not read is real, but unconfirmed:
          // build-import will publish it without stamping it verified.
          status: noDetail && (res.status === "confirmed" || res.status === "matched") ? `${res.status}_no_detail` : res.status,
          number: match?.registrationNo ?? null,
          council: match?.council ?? null,
          registered_year: match?.year ?? null,
          degree: match?.detail?.degree ?? null,
          university: match?.detail?.university ?? null,
          place: match?.detail?.place ?? null,
          candidates: "candidates" in res ? (res.candidates?.length ?? 0) : 0,
          query: res.query ?? "",
        };
      } catch (e) {
        nmc = { status: "error", number: null, council: null, registered_year: null, degree: null, university: null, place: null, candidates: 0, query: String((e as Error).message).slice(0, 200) };
      }
      done.set(key, nmc);
      out.push({ ...r, nmc });
      counts[nmc.status] = (counts[nmc.status] ?? 0) + 1;
      if (nmc.number) resolved++;
      if (out.length % 50 === 0) {
        writeFileSync(OUT, JSON.stringify(out, null, 1));
        writeFileSync(MEMO, JSON.stringify(Object.fromEntries(memo)));
        console.log(`[w${w}] ${out.length}/${todo.length} · with number ${resolved} · ${Object.entries(counts).map(([k, v]) => `${k}:${v}`).join(" ")}`);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, w) => worker(w + 1)));
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  writeFileSync(MEMO, JSON.stringify(Object.fromEntries(memo)));
  console.log(`\ndone: ${out.length} records · ${resolved} with a registration number`);
  console.log(Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${k}: ${v}`).join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
