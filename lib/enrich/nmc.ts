import { coreTokens, nameCovers, nameTight, queryToken } from "@/lib/enrich/names";

/**
 * NMC Indian Medical Register client and matcher.
 *
 * The register (nmc.org.in › Information Desk › Indian Medical Register) is a
 * public verification service. Since the site was rebuilt (seen 27 Sep 2026)
 * its search page calls one JSON endpoint:
 *
 *   GET https://nmc.org.in/indian-medical-register/search
 *       ?search_type=name|reg_no|year|state|advance
 *       &name=&reg_no=&year=&state=<council code>&page=N&per_page=25|50|100
 *
 * Each result row already carries the registration date, primary degree,
 * university and struck-off status, so there is no separate detail call any
 * more. `per_page` is capped at 100 (larger values silently fall back to 25).
 * `name` is a substring match on the register's name string, so word order
 * matters; `reg_no` is a substring match, so exactness is enforced here.
 *
 * We query it the way its own search form does, one request at a time with a
 * pause between requests, and keep only professional data: registration
 * number, council, year, primary degree and university. Father's name, date of
 * birth and addresses are never stored (an address is reduced to a district /
 * state hint for staff disambiguation and never persisted beyond that).
 *
 * Modern-medicine councils only: dentists, AYUSH and allied professions are on
 * other registers and are marked not_applicable by the worker.
 *
 * `npm run db:enrich` still runs with NODE_EXTRA_CA_CERTS pointing at the
 * SSL.com intermediate in lib/enrich/certs/; the rebuilt host serves a full
 * chain, so the extra trust is now redundant but harmless. Trust is added,
 * never relaxed.
 */

const BASE = "https://nmc.org.in";
const PAGE = `${BASE}/information-desk/indian-medical-register`;
const SEARCH = `${BASE}/indian-medical-register/search`;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 TheDoctorIndex-verification/1.0 (+https://www.thedoctorindex.com/policies/verification)";
const PER_PAGE = 100;

/**
 * Council codes as the register's own council select lists them (GET
 * /indian-medical-register/states, 27 Sep 2026), each with the council name
 * as this site stores it. The register's own labels are not always right:
 * Madhya Pradesh rows (state_code MAD) come back labelled "Tamil Nadu Medical
 * Council", so a row's council is taken from its code whenever the label
 * contradicts it (see `rowCouncil`).
 */
export const COUNCILS: Record<string, string> = {
  AND: "Andhra Pradesh Medical Council",
  ARU: "Arunachal Pradesh Medical Council",
  ASS: "Assam Medical Council",
  BIH: "Bihar Medical Council",
  CHA: "Chattisgarh Medical Council",
  DEL: "Delhi Medical Council",
  GOA: "Goa Medical Council",
  GUJ: "Gujarat Medical Council",
  HAR: "Haryana Medical Council",
  HIM: "Himachal Pradesh Medical Council",
  JAM: "Jammu & Kashmir Medical Council",
  JHA: "Jharkhand Medical Council",
  KAR: "Karnataka Medical Council",
  MAD: "Madhya Pradesh Medical Council",
  MAH: "Maharashtra Medical Council",
  MAN: "Manipur Medical Council",
  MCI: "Medical Council of India",
  MIZ: "Mizoram Medical Council",
  NAG: "Nagaland Medical Council",
  ORI: "Orissa Council of Medical Registration",
  PUN: "Punjab Medical Council",
  RAJ: "Rajasthan Medical Council",
  SIK: "Sikkim Medical Council",
  TAM: "Tamil Nadu Medical Council",
  TEL: "Telangana State Medical Council",
  TC: "Kerala State Medical Council",
  TRI: "Tripura State Medical Council",
  UP: "Uttar Pradesh Medical Council",
  UTT: "Uttarakhand Medical Council",
  WES: "West Bengal Medical Council",
};

/**
 * Search without a council filter. Used for medical councils the register no
 * longer lists as a filter (Meghalaya, Chandigarh, Pondicherry): the number or
 * name match is still exact, it just is not narrowed by council first.
 */
export const ANY_COUNCIL = "*";

/** Councils to search for a doctor practising in a state: the current council first, then neighbours that issued numbers there, then the all-India register. */
export const COUNCILS_BY_STATE: Record<string, string[]> = {
  "andhra-pradesh": ["AND", "TEL"],
  "arunachal-pradesh": ["ARU", "ASS"],
  assam: ["ASS"],
  bihar: ["BIH"],
  chhattisgarh: ["CHA", "MAD"],
  chandigarh: ["PUN", "HAR"],
  delhi: ["DEL"],
  goa: ["GOA", "MAH"],
  gujarat: ["GUJ", "MAH"],
  haryana: ["HAR", "PUN"],
  "himachal-pradesh": ["HIM", "PUN"],
  "jammu-and-kashmir": ["JAM"],
  jharkhand: ["JHA", "BIH"],
  karnataka: ["KAR"],
  kerala: ["TC"],
  "madhya-pradesh": ["MAD"],
  maharashtra: ["MAH"],
  manipur: ["MAN"],
  meghalaya: ["ASS"],
  mizoram: ["MIZ"],
  nagaland: ["NAG"],
  odisha: ["ORI"],
  puducherry: ["TAM"],
  punjab: ["PUN"],
  rajasthan: ["RAJ"],
  sikkim: ["SIK"],
  "tamil-nadu": ["TAM"],
  telangana: ["TEL", "AND"],
  tripura: ["TRI"],
  "uttar-pradesh": ["UP"],
  uttarakhand: ["UTT", "UP"],
  "west-bengal": ["WES"],
};

/**
 * Map a council name as written in the profile to the register's council code,
 * ANY_COUNCIL for a medical council the register cannot filter on, or null
 * when it is not a modern-medicine council at all. Historical councils map to
 * the state council that now holds their records.
 */
export function councilId(name: string | null | undefined): string | null {
  if (!name) return null;
  const n = name.toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
  if (/dental|homoeo|homeo|ayur|unani|siddha|sowa|naturopath|paramedical|rehabilitation|nursing|pharmac|physio|occupational|allied|indian medicine|indian system/.test(n)) return null;
  const aliases: Array<[RegExp, string]> = [
    [/\bmpmc\b|madhya pradesh|^mp\b|^m p\b|mahakoshal|mahakaushal|bhopal/, "MAD"],
    [/uttar pradesh|^up\b|upmc|bareilly/, "UP"],
    [/maharashtra|^mmc\b|bombay|vidharba|vidarbha/, "MAH"],
    [/karnataka|^kmc\b|mysore/, "KAR"],
    [/tamil ?nadu|tnmc|madras/, "TAM"],
    [/kerala|travancore/, "TC"],
    [/telangana|hyderabad/, "TEL"],
    [/andhra|^ap\b/, "AND"],
    [/west bengal|^wb\b/, "WES"],
    [/gujarat/, "GUJ"],
    [/rajasthan/, "RAJ"],
    [/bihar/, "BIH"],
    [/delhi|^dmc\b/, "DEL"],
    [/punjab/, "PUN"],
    [/haryana/, "HAR"],
    [/chattisgarh|chhattisgarh/, "CHA"],
    [/jharkhand/, "JHA"],
    [/orissa|odisha/, "ORI"],
    [/assam/, "ASS"],
    [/uttarakhand|uttaranchal/, "UTT"],
    [/himachal|himanchal/, "HIM"],
    [/jammu|kashmir/, "JAM"],
    [/goa\b/, "GOA"],
    [/tripura/, "TRI"],
    [/sikkim/, "SIK"],
    [/manipur/, "MAN"],
    [/mizoram/, "MIZ"],
    [/nagaland/, "NAG"],
    [/arunachal/, "ARU"],
    [/chandigarh|pondicherry|puducherry|meghalaya/, ANY_COUNCIL],
    [/medical council of india|^mci\b|national medical commission|^nmc\b/, "MCI"],
  ];
  for (const [re, id] of aliases) if (re.test(n)) return id;
  return null;
}

export interface RegisterRow {
  year: number | null;
  registrationNo: string;
  council: string;
  name: string;
  /** Register's internal row id. */
  doctorId: string;
}

export interface RegisterDetail {
  degree: string | null;
  university: string | null;
  yearOfPassing: number | null;
  registrationDate: string | null;
  /** Address reduced to a place hint (district / state words). Never the full address. */
  place: string | null;
  removed: boolean;
}

export interface Candidate extends RegisterRow {
  detail?: RegisterDetail;
}

export type NmcOutcome =
  | { status: "confirmed"; match: Candidate; query: string }
  /** A unique name match; `replaces` is set when the profile carried a number that belongs to someone else on the register. */
  | { status: "matched"; match: Candidate; query: string; replaces?: Candidate[] }
  | { status: "ambiguous"; candidates: Candidate[]; query: string }
  | { status: "number_mismatch"; candidates: Candidate[]; query: string }
  | { status: "removed"; match: Candidate; query: string }
  | { status: "not_found"; query: string };

export interface NmcClientOptions {
  /** Milliseconds to wait between requests. Default 1100. */
  pauseMs?: number;
  fetchImpl?: typeof fetch;
  log?: (msg: string) => void;
}

/** One row as the register's JSON search returns it. Only the fields we read are typed. */
export interface RegisterApiRow {
  id: number | string;
  name?: string | null;
  registration_no?: string | null;
  registration_date?: string | null;
  state_medical_council?: string | null;
  state_code?: string | null;
  year_of_info?: number | string | null;
  permanent_address?: string | null;
  qualification?: string | null;
  qualification_year?: string | number | null;
  university?: string | null;
  removed_status?: unknown;
}

export class NmcClient {
  private lastAt = 0;
  private readonly pauseMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly log: (msg: string) => void;
  /** Detail travels with each search row now; kept here so `detail()` costs no request. */
  private readonly details = new Map<string, RegisterDetail>();
  requests = 0;

  constructor(opts: NmcClientOptions = {}) {
    this.pauseMs = opts.pauseMs ?? 1100;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.log = opts.log ?? (() => {});
  }

  private async pace() {
    const wait = this.lastAt + this.pauseMs - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastAt = Date.now();
  }

  private headers(): Record<string, string> {
    return { "User-Agent": UA, Referer: PAGE, Accept: "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest" };
  }

  /** GET with one retry on a 5xx or a dropped connection. */
  private async get(url: string): Promise<Response> {
    this.requests++;
    let res: Response;
    try {
      res = await this.fetchImpl(url, { headers: this.headers() });
    } catch {
      await new Promise((r) => setTimeout(r, 2500));
      this.requests++;
      return this.fetchImpl(url, { headers: this.headers() });
    }
    if (res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2500));
      this.requests++;
      res = await this.fetchImpl(url, { headers: this.headers() });
    }
    return res;
  }

  /**
   * Paginated search. `name` is a substring match on the register's name
   * string; `registrationNo` is a substring match (callers enforce exactness);
   * `smcId` is a council code from COUNCILS, or ANY_COUNCIL / absent for none.
   */
  async search(params: { name?: string; registrationNo?: string; smcId?: string; year?: number }, max = 500): Promise<{ total: number; rows: RegisterRow[] }> {
    const rows: RegisterRow[] = [];
    let total = 0;
    const state = params.smcId && params.smcId !== ANY_COUNCIL ? params.smcId : "";
    for (let page = 1; rows.length < max; page++) {
      await this.pace();
      const q = new URLSearchParams({ search_type: "advance", name: params.name ?? "", reg_no: params.registrationNo ?? "", year: params.year ? String(params.year) : "", state, page: String(page), per_page: String(PER_PAGE) });
      const res = await this.get(`${SEARCH}?${q}`);
      if (!res.ok) throw new Error(`nmc search ${res.status}`);
      const type = res.headers.get("content-type") ?? "";
      if (!type.includes("json")) throw new Error(`nmc search returned ${type || "no content type"} (register page changed?)`);
      const body = (await res.json()) as { success?: boolean; data?: RegisterApiRow[]; pagination?: { total?: number; total_pages?: number; per_page?: number } };
      if (body.success === false) throw new Error("nmc search success=false");
      total = Number(body.pagination?.total ?? 0);
      const data = body.data ?? [];
      for (const r of data) {
        const parsed = parseRow(r);
        if (!parsed) continue;
        rows.push(parsed);
        this.details.set(parsed.doctorId, detailOf(r));
      }
      const pages = Number(body.pagination?.total_pages ?? 1);
      if (!data.length || page >= pages || rows.length >= total) break;
    }
    this.log(`nmc search ${JSON.stringify(params)} → ${rows.length}/${total}`);
    return { total, rows };
  }

  /** Register detail for a row returned by `search`. No request: the search row carried it. */
  async detail(row: RegisterRow): Promise<RegisterDetail> {
    const d = this.details.get(row.doctorId);
    if (!d) throw new Error(`nmc detail: row ${row.doctorId} was not returned by a search in this session`);
    return d;
  }
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s && s !== "null" && s !== "None" && s !== "N/A" ? s : null;
}
function num(v: unknown): number | null {
  const n = Number(String(v ?? "").replace(/[^0-9]/g, "").slice(0, 4));
  return Number.isFinite(n) && n > 1900 && n < 2100 ? n : null;
}

/** The register reports struck-off entries as a truthy removed_status (1, "1", true, "true", "Yes"); null / 0 mean on the register. */
export function isRemoved(v: unknown): boolean {
  if (v === true) return true;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "y" || s === "removed";
}

/** Reduce an address to its last two place parts (district, state), dropping house-level detail, PIN codes and the country. */
export function placeHint(line: string | null): string | null {
  if (!line) return null;
  const parts = line
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && !/^\d{3}\s?\d{3}$/.test(p) && !/^india$/i.test(p));
  const deduped = parts.filter((p, i) => i === 0 || p.toLowerCase() !== parts[i - 1].toLowerCase());
  if (deduped.length <= 1) return null;
  return deduped.slice(-2).join(", ").slice(0, 60);
}

/** A search row reduced to what we keep. Father's name, date of birth and address are dropped on purpose. */
export function parseRow(r: RegisterApiRow): RegisterRow | null {
  if (!r || r.id === undefined || r.id === null) return null;
  const registrationNo = str(r.registration_no);
  const name = str(r.name);
  if (!registrationNo || !name) return null;
  return { year: num(r.year_of_info), registrationNo, council: rowCouncil(r), name, doctorId: String(r.id) };
}

/** The row's council: the register's label, unless it names a different council than the row's code, in which case the code wins. */
export function rowCouncil(r: Pick<RegisterApiRow, "state_medical_council" | "state_code">): string {
  const label = str(r.state_medical_council);
  const code = str(r.state_code)?.toUpperCase() ?? null;
  const byCode = code ? COUNCILS[code] : undefined;
  if (!byCode) return label ?? "";
  if (!label) return byCode;
  const labelCode = councilId(label);
  return labelCode && labelCode !== code ? byCode : label;
}

export function detailOf(r: RegisterApiRow): RegisterDetail {
  return {
    degree: str(r.qualification),
    university: str(r.university),
    yearOfPassing: num(r.qualification_year),
    registrationDate: str(r.registration_date),
    place: placeHint(str(r.permanent_address)),
    removed: isRemoved(r.removed_status),
  };
}

const normNo = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * What to send the register for a number as written on a profile, and how to
 * recognise the same number in its answer. "MP-87 / 2007" is number MP-87 of
 * 2007: the register is queried with "MP-87" and a row is accepted when its number equals MP-87 or the
 * whole string. Plain numbers ("12345") accept "12345" and a council-prefixed
 * form of it ("MP-12345").
 */
export function registrationQuery(raw: string): { queryNumber: string; accept: (rowNumber: string) => boolean } {
  const trimmed = raw.trim();
  const parts = trimmed.split(/\s*\/\s*/);
  // "MP-87 / 2007" is number MP-87 of 2007: drop a trailing year. Any other
  // slashed form ("DMC/R/1053", "TSMC/FMR/19132") is the number itself, and the
  // rebuilt register searches it as written.
  const yearTail = parts.length > 1 && /^(19|20)\d{2}$/.test(parts[parts.length - 1]);
  const kept = yearTail ? parts.slice(0, -1) : parts;
  const clean = (s: string) => s.replace(/[^A-Za-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const queryNumber = kept.map(clean).filter(Boolean).join("/") || clean(trimmed);
  const wanted = new Set([normNo(queryNumber), normNo(trimmed)].filter(Boolean));
  const digitsOnly = /^\d+$/.test(queryNumber);
  return {
    queryNumber,
    accept: (rowNumber: string) => {
      const n = normNo(rowNumber);
      if (wanted.has(n)) return true;
      if (digitsOnly) return /^[A-Z]{1,4}/.test(n) && n.replace(/^[A-Z]+/, "") === queryNumber;
      return false;
    },
  };
}

export interface ProfileForNmc {
  name: string;
  stateSlug: string | null;
  registration: { number: string; council: string } | null;
}

/**
 * Match one profile against the register.
 *
 * 1. With a number on file: exact number search (within the council when known).
 *    A row whose name covers the profile's name confirms it; rows that do not
 *    are reported as number_mismatch for staff.
 * 2. Without one (or when the number is unknown to the register): search the
 *    surname-ish token in each council that issues numbers for the state,
 *    keep rows whose name tightly covers the profile's name, and fill the
 *    number only when exactly one row survives. Two or more → ambiguous, with
 *    candidates for staff. Struck-off entries are never filled.
 */
export async function matchOnRegister(client: NmcClient, p: ProfileForNmc, opts: { maxCandidates?: number; log?: (m: string) => void } = {}): Promise<NmcOutcome> {
  const log = opts.log ?? (() => {});
  const maxCandidates = opts.maxCandidates ?? 6;

  let wrongNumber: Candidate[] = [];
  const queries: string[] = [];
  if (p.registration?.number && /\d/.test(p.registration.number)) {
    const { queryNumber, accept } = registrationQuery(p.registration.number);
    const smc = councilId(p.registration.council);
    // The register's registrationNo filter is a prefix match, so exactness is enforced here.
    // Councils store the same number as "MP-3037" or "3037"; try the written form, then the digits.
    const forms = [queryNumber];
    const digits = queryNumber.replace(/^[A-Za-z]+-?/, "");
    if (digits && digits !== queryNumber && /^\d+$/.test(digits)) forms.push(digits);
    let exact: RegisterRow[] = [];
    for (const form of forms) {
      const { rows } = await client.search({ registrationNo: form, smcId: smc ?? undefined });
      const acceptForm = form === queryNumber ? accept : registrationQuery(form).accept;
      exact = rows.filter((r) => acceptForm(r.registrationNo));
      queries.push(`no:${form}${smc ? ` smc:${smc}` : ""} (${rows.length} rows, ${exact.length} exact)`);
      log(`  number search ${form} smc ${smc ?? "-"} → ${rows.length} rows, ${exact.length} exact`);
      if (exact.length) break;
    }
    const covering = exact.filter((r) => nameCovers(r.name, p.name));
    if (covering.length >= 1) {
      const best = covering.find((r) => nameTight(r.name, p.name)) ?? covering[0];
      const detail = await client.detail(best);
      const query = queries.join("; ");
      if (detail.removed) return { status: "removed", match: { ...best, detail }, query };
      return { status: "confirmed", match: { ...best, detail }, query };
    }
    // The number belongs to someone else: remember them, then try the name like any unregistered profile.
    wrongNumber = exact.slice(0, maxCandidates);
  }

  const token = queryToken(p.name);
  const councils = p.stateSlug ? (COUNCILS_BY_STATE[p.stateSlug] ?? []) : [];
  if (!token || coreTokens(p.name).length < 2 || !councils.length) {
    const why = !token || coreTokens(p.name).length < 2 ? `name:${p.name} (too short to match safely)` : `name:${token} (no council for state ${p.stateSlug ?? "unknown"})`;
    queries.push(why);
    if (wrongNumber.length) return { status: "number_mismatch", candidates: wrongNumber, query: queries.join("; ") };
    return { status: "not_found", query: queries.join("; ") };
  }

  const seen = new Map<string, RegisterRow>();
  for (const smc of councils) {
    const { total, rows } = await client.search({ name: token, smcId: smc }, 2000);
    queries.push(`name:${token} smc:${smc} (${total})`);
    log(`  name search ${token} smc ${smc} → ${rows.length}/${total}`);
    for (const r of rows) if (nameTight(r.name, p.name)) seen.set(`${r.council}|${r.registrationNo}`, r);
    if (seen.size > maxCandidates) break;
  }
  const query = queries.join("; ");
  const tight = [...seen.values()];
  if (tight.length === 0) {
    if (wrongNumber.length) return { status: "number_mismatch", candidates: wrongNumber, query };
    return { status: "not_found", query };
  }
  if (tight.length === 1) {
    const detail = await client.detail(tight[0]);
    if (detail.removed) return { status: "removed", match: { ...tight[0], detail }, query };
    return { status: "matched", match: { ...tight[0], detail }, query, replaces: wrongNumber.length ? wrongNumber : undefined };
  }
  const candidates: Candidate[] = [];
  for (const r of [...wrongNumber, ...tight].slice(0, maxCandidates + wrongNumber.length)) {
    try {
      candidates.push({ ...r, detail: await client.detail(r) });
    } catch {
      candidates.push(r);
    }
  }
  return { status: "ambiguous", candidates, query };
}
