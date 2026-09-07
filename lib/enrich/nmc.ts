import { coreTokens, nameCovers, nameTight, queryToken } from "@/lib/enrich/names";

/**
 * NMC Indian Medical Register client and matcher.
 *
 * The register (nmc.org.in › Information Desk › Indian Medical Register) is a
 * public verification service. We query it the way its own search form does,
 * one request at a time with a pause between requests, and keep only
 * professional data: registration number, council, year, primary degree and
 * university. Father's name, date of birth and addresses are never stored.
 *
 * Modern-medicine councils only: dentists, AYUSH and allied professions are on
 * other registers and are marked not_applicable by the worker.
 *
 * nmc.org.in serves its certificate without the SSL.com intermediate, which
 * Node rejects ("unable to verify the first certificate"). `npm run db:enrich`
 * therefore runs with NODE_EXTRA_CA_CERTS pointing at that intermediate
 * (lib/enrich/certs/, fingerprint BF:BC:39:E9…0C:69, fetched from the URL in
 * the leaf certificate's Authority Information Access). Trust is added, never
 * relaxed.
 */

const BASE = "https://www.nmc.org.in";
const PAGE = `${BASE}/information-desk/indian-medical-register/`;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 TheDoctorIndex-verification/1.0 (+https://www.thedoctorindex.com/policies/verification)";

/** State Medical Council ids as the register numbers them (from its own council select). */
export const COUNCILS: Record<number, string> = {
  1: "Andhra Pradesh Medical Council",
  2: "Arunachal Pradesh Medical Council",
  3: "Assam Medical Council",
  4: "Bihar Medical Council",
  5: "Chattisgarh Medical Council",
  6: "Delhi Medical Council",
  7: "Goa Medical Council",
  8: "Gujarat Medical Council",
  9: "Haryana Medical Council",
  10: "Himachal Pradesh Medical Council",
  11: "Jammu & Kashmir Medical Council",
  12: "Jharkhand Medical Council",
  13: "Karnataka Medical Council",
  14: "Kerala Medical Council",
  15: "Madhya Pradesh Medical Council",
  16: "Maharashtra Medical Council",
  17: "Orissa Council of Medical Registration",
  18: "Punjab Medical Council",
  19: "Rajasthan Medical Council",
  20: "Sikkim Medical Council",
  21: "Tamil Nadu Medical Council",
  22: "Tripura State Medical Council",
  23: "Uttar Pradesh Medical Council",
  24: "Uttarakhand Medical Council",
  25: "West Bengal Medical Council",
  26: "Manipur Medical Council",
  27: "Bareilly Medical Council",
  28: "Bhopal Medical Council",
  29: "Bombay Medical Council",
  30: "Chandigarh Medical Council",
  33: "Travancore Cochin Medical Council",
  35: "Mahakoshal Medical Council",
  36: "Madras Medical Council",
  37: "Mysore Medical Council",
  38: "Pondicherry Medical Council",
  40: "Vidharba Medical Council",
  41: "Nagaland Medical Council",
  42: "Mizoram Medical Council",
  43: "Telangana State Medical Council",
  45: "Hyderabad Medical Council",
  46: "Medical Council of India",
  51: "Meghalaya Medical Council",
};

/** Councils to search for a doctor practising in a state: the current council first, then the historical ones that issued numbers there. */
export const COUNCILS_BY_STATE: Record<string, number[]> = {
  "andhra-pradesh": [1, 45],
  "arunachal-pradesh": [2],
  assam: [3],
  bihar: [4],
  chhattisgarh: [5, 15],
  chandigarh: [30, 18],
  delhi: [6],
  goa: [7, 29],
  gujarat: [8, 29],
  haryana: [9, 18],
  "himachal-pradesh": [10, 18],
  "jammu-and-kashmir": [11],
  jharkhand: [12, 4],
  karnataka: [13, 37],
  kerala: [14, 33],
  "madhya-pradesh": [15, 35, 28],
  maharashtra: [16, 29, 40],
  manipur: [26],
  meghalaya: [51, 3],
  mizoram: [42],
  nagaland: [41],
  odisha: [17],
  puducherry: [38, 36],
  punjab: [18],
  rajasthan: [19],
  sikkim: [20],
  "tamil-nadu": [21, 36],
  telangana: [43, 45, 1],
  tripura: [22],
  "uttar-pradesh": [23, 27],
  uttarakhand: [24, 23],
  "west-bengal": [25],
};

/** Map a council name as written in the profile to the register's id, or null when it is not a modern-medicine council the register knows. */
export function councilId(name: string | null | undefined): number | null {
  if (!name) return null;
  const n = name.toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
  if (/dental|homoeo|homeo|ayur|unani|siddha|paramedical|rehabilitation|nursing|pharmacy|physio|indian medicine/.test(n)) return null;
  const aliases: Array<[RegExp, number]> = [
    [/\bmpmc\b|madhya pradesh|^mp\b|^m p\b/, 15],
    [/mahakoshal|mahakaushal/, 35],
    [/bhopal/, 28],
    [/uttar pradesh|^up\b|upmc/, 23],
    [/bareilly/, 27],
    [/maharashtra|^mmc\b/, 16],
    [/bombay/, 29],
    [/vidharba|vidarbha/, 40],
    [/karnataka|^kmc\b/, 13],
    [/mysore/, 37],
    [/tamil ?nadu|tnmc/, 21],
    [/madras/, 36],
    [/kerala|travancore/, 14],
    [/telangana/, 43],
    [/hyderabad/, 45],
    [/andhra|^ap\b/, 1],
    [/west bengal|^wb\b/, 25],
    [/gujarat/, 8],
    [/rajasthan/, 19],
    [/bihar/, 4],
    [/delhi|^dmc\b/, 6],
    [/punjab/, 18],
    [/haryana/, 9],
    [/chattisgarh|chhattisgarh/, 5],
    [/jharkhand/, 12],
    [/orissa|odisha/, 17],
    [/assam/, 3],
    [/uttarakhand|uttaranchal/, 24],
    [/himachal/, 10],
    [/jammu|kashmir/, 11],
    [/goa\b/, 7],
    [/chandigarh/, 30],
    [/pondicherry|puducherry/, 38],
    [/tripura/, 22],
    [/sikkim/, 20],
    [/manipur/, 26],
    [/meghalaya/, 51],
    [/mizoram/, 42],
    [/nagaland/, 41],
    [/arunachal/, 2],
    [/medical council of india|^mci\b|national medical commission|^nmc\b/, 46],
  ];
  for (const [re, id] of aliases) if (re.test(n)) return id;
  return null;
}

export interface RegisterRow {
  year: number | null;
  registrationNo: string;
  council: string;
  name: string;
  /** Register's internal id, needed for the detail call. */
  doctorId: string;
}

export interface RegisterDetail {
  degree: string | null;
  university: string | null;
  yearOfPassing: number | null;
  registrationDate: string | null;
  /** First address line, reduced to a place hint (district / city words). Never the full address. */
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

export class NmcClient {
  private cookie = "";
  private lastAt = 0;
  private readonly pauseMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly log: (msg: string) => void;
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

  /** GET with one retry on a 5xx or a dropped connection; the register answers 500 to malformed queries and, occasionally, to good ones. */
  private async get(url: string): Promise<Response> {
    let res = await this.fetchImpl(url, { headers: this.headers() });
    if (res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2500));
      this.requests++;
      res = await this.fetchImpl(url, { headers: this.headers() });
    }
    return res;
  }

  private headers(json = false): Record<string, string> {
    const h: Record<string, string> = { "User-Agent": UA, Referer: PAGE, Accept: "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest" };
    if (this.cookie) h.Cookie = this.cookie;
    if (json) h["Content-Type"] = "application/json";
    return h;
  }

  /** The register's search rejects requests without the session cookie its page sets. */
  async session(): Promise<void> {
    if (this.cookie) return;
    await this.pace();
    this.requests++;
    const res = await this.fetchImpl(PAGE, { headers: { "User-Agent": UA }, redirect: "follow" });
    const raw = (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
    const single = res.headers.get("set-cookie");
    const jar = raw.length ? raw : single ? [single] : [];
    this.cookie = jar.map((c) => c.split(";")[0]).join("; ");
    this.log(`nmc session ${res.status} cookies=${jar.length}`);
  }

  /** Paginated search. `name` is a substring match on the register's name field; `registrationNo` is exact. */
  async search(params: { name?: string; registrationNo?: string; smcId?: number; year?: number }, max = 500): Promise<{ total: number; rows: RegisterRow[] }> {
    await this.session();
    const rows: RegisterRow[] = [];
    let total = 0;
    for (let start = 0; start < max; start += 500) {
      await this.pace();
      this.requests++;
      const q = new URLSearchParams({
        service: "getPaginatedDoctor",
        draw: "1",
        start: String(start),
        length: "500",
        name: params.name ?? "",
        registrationNo: params.registrationNo ?? "",
        smcId: params.smcId ? String(params.smcId) : "",
        year: params.year ? String(params.year) : "",
      });
      const res = await this.get(`${BASE}/MCIRest/open/getPaginatedData?${q}`);
      if (!res.ok) throw new Error(`nmc search ${res.status}`);
      const body = (await res.json()) as { recordsFiltered?: number; recordsTotal?: number; data?: unknown[][] };
      total = Number(body.recordsFiltered ?? body.recordsTotal ?? 0);
      for (const r of body.data ?? []) {
        const parsed = parseRow(r);
        if (parsed) rows.push(parsed);
      }
      if (rows.length >= total || (body.data ?? []).length < 500) break;
    }
    return { total, rows };
  }

  async detail(row: RegisterRow): Promise<RegisterDetail> {
    await this.session();
    await this.pace();
    this.requests++;
    const res = await this.fetchImpl(`${BASE}/MCIRest/open/getDataFromService?service=getDoctorDetailsByIdImrExt`, {
      method: "POST",
      headers: this.headers(true),
      body: JSON.stringify({ doctorId: row.doctorId, regdNoValue: row.registrationNo }),
    });
    if (!res.ok) throw new Error(`nmc detail ${res.status}`);
    const d = (await res.json()) as Record<string, unknown>;
    return {
      degree: str(d.doctorDegree),
      university: str(d.university),
      yearOfPassing: num(d.yearOfPassing) ?? num(d.monthandyearOfPass),
      registrationDate: str(d.regDate) ?? str(d.registrationDate),
      place: placeHint(str(d.addressLine1)),
      removed: d.removedStatus === true || d.removedStatus === "true",
    };
  }
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s && s !== "null" && s !== "None" ? s : null;
}
function num(v: unknown): number | null {
  const n = Number(String(v ?? "").replace(/[^0-9]/g, "").slice(0, 4));
  return Number.isFinite(n) && n > 1900 && n < 2100 ? n : null;
}

/** Reduce an address line to its last two comma-separated parts (district, state), dropping house-level detail. */
export function placeHint(line: string | null): string | null {
  if (!line) return null;
  const parts = line.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return null;
  return parts.slice(-2).join(", ").slice(0, 60);
}

/** A DataTables row: [sl, year, regNo, council, name, fatherName, viewLink]. Father's name is dropped on purpose. */
export function parseRow(r: unknown[]): RegisterRow | null {
  if (!Array.isArray(r) || r.length < 7) return null;
  const link = String(r[6] ?? "");
  const m = link.match(/openDoctorDetailsnew\('([^']+)'/);
  if (!m) return null;
  return { year: num(r[1]), registrationNo: String(r[2] ?? "").trim(), council: String(r[3] ?? "").trim(), name: String(r[4] ?? "").trim(), doctorId: m[1] };
}

const normNo = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * What to send the register for a number as written on a profile, and how to
 * recognise the same number in its answer. "MP-87 / 2007" is number MP-87 of
 * 2007: the register is queried with "MP-87" (slashes and spaces make it
 * answer 500) and a row is accepted when its number equals MP-87 or the
 * whole string. Plain numbers ("12345") accept "12345" and a council-prefixed
 * form of it ("MP-12345").
 */
export function registrationQuery(raw: string): { queryNumber: string; accept: (rowNumber: string) => boolean } {
  const trimmed = raw.trim();
  const [head] = trimmed.split(/\s*\/\s*/);
  const queryNumber = (head || trimmed).replace(/[^A-Za-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
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
