/**
 * Find a doctor's papers on PubMed or ORCID so they can add them to their
 * profile with a tick instead of typing each one.
 *
 * Nothing found here is taken as proof of authorship: names collide (there are
 * hundreds of "Shetty D" in Indian PubMed affiliations), so the doctor picks
 * their own papers and each lands as a self-reported publication, shown as
 * such until staff confirm it — the same state as one typed by hand.
 *
 * Network calls use NCBI E-utilities (tool/email identified, NCBI_API_KEY used
 * when set) and the public ORCID API. Parsing is pure and unit-tested.
 */

export interface FoundPaper {
  /** Stable key for de-duplication: pmid:<n>, doi:<x> or title:<normalised>. */
  key: string;
  title: string;
  journal: string | null;
  year: number | null;
  url: string | null;
  /** First few authors, for the doctor to recognise their own work. */
  authors: string[];
}

const UA_TOOL = "thedoctorindex";
const UA_EMAIL = process.env.NCBI_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@thedoctorindex.in";

/** "Dr. Ananya K. Rao" → "Rao AK" (PubMed's author form). */
export function pubmedAuthor(fullName: string): string {
  const parts = fullName
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .replace(/[(),]/g, " ")
    .split(/\s+/)
    .map((p) => p.replace(/\./g, ""))
    .filter((p) => /[a-z]/i.test(p) && !/^(md|ms|mbbs|dnb|dm|mch|frcs|mrcp|pt)$/i.test(p));
  if (!parts.length) return "";
  const last = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((p) => p[0].toUpperCase()).join("");
  return initials ? `${last} ${initials}` : last;
}

/** The esearch term: author, optionally narrowed by affiliation words (India by default). */
export function pubmedTerm(author: string, affiliation = "India"): string {
  const a = author.trim().replace(/"/g, "");
  const aff = affiliation
    .split(/[,;]+/)
    .map((x) => x.trim().replace(/"/g, ""))
    .filter(Boolean)
    .map((x) => `"${x}"[Affiliation]`);
  return [`${a}[Author]`, ...aff].join(" AND ");
}

export function normTitle(t: string): string {
  return t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function cleanTitle(t: string): string {
  return t.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/\.$/, "").trim();
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Parse an esummary JSON response. */
export function parsePubmedSummary(json: any): FoundPaper[] {
  const r = json?.result;
  if (!r || !Array.isArray(r.uids)) return [];
  return r.uids
    .map((uid: string) => r[uid])
    .filter((d: any) => d && d.title)
    .map((d: any): FoundPaper => {
      const year = Number(String(d.pubdate ?? d.sortpubdate ?? "").slice(0, 4)) || null;
      return {
        key: `pmid:${d.uid}`,
        title: cleanTitle(String(d.title)),
        journal: d.fulljournalname || d.source || null,
        year,
        url: `https://pubmed.ncbi.nlm.nih.gov/${d.uid}/`,
        authors: Array.isArray(d.authors) ? d.authors.slice(0, 4).map((a: any) => String(a.name)) : [],
      };
    });
}

/** Parse ORCID /works JSON. */
export function parseOrcidWorks(json: any): FoundPaper[] {
  const groups: any[] = Array.isArray(json?.group) ? json.group : [];
  const out: FoundPaper[] = [];
  for (const g of groups) {
    const w = g?.["work-summary"]?.[0];
    const title = w?.title?.title?.value;
    if (!title) continue;
    const ids: any[] = w?.["external-ids"]?.["external-id"] ?? [];
    const doi = ids.find((x) => x["external-id-type"] === "doi")?.["external-id-value"];
    const pmid = ids.find((x) => x["external-id-type"] === "pmid")?.["external-id-value"];
    const url = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : doi ? `https://doi.org/${doi}` : w?.url?.value ?? null;
    out.push({
      key: pmid ? `pmid:${pmid}` : doi ? `doi:${String(doi).toLowerCase()}` : `title:${normTitle(title)}`,
      title: cleanTitle(String(title)),
      journal: w?.["journal-title"]?.value ?? null,
      year: Number(w?.["publication-date"]?.year?.value) || null,
      url,
      authors: [],
    });
  }
  return out;
}

/* eslint-enable @typescript-eslint/no-explicit-any */

/** Accepts "0000-0002-1825-0097" or an orcid.org URL; returns the bare iD or null. Checks the ISO 7064 check digit. */
export function parseOrcidId(input: string): string | null {
  const m = /(\d{4})-?(\d{4})-?(\d{4})-?(\d{3}[\dX])/i.exec(input.trim());
  if (!m) return null;
  const id = `${m[1]}-${m[2]}-${m[3]}-${m[4].toUpperCase()}`;
  const digits = id.replace(/-/g, "");
  let total = 0;
  for (const c of digits.slice(0, 15)) total = (total + Number(c)) * 2;
  const check = (12 - (total % 11)) % 11;
  return (check === 10 ? "X" : String(check)) === digits[15] ? id : null;
}

/** Drop papers already on the profile (by link or title). */
export function withoutExisting(found: FoundPaper[], existing: Array<{ title: string; url?: string | null }>): FoundPaper[] {
  const titles = new Set(existing.map((e) => normTitle(e.title)));
  const urls = new Set(existing.map((e) => e.url).filter(Boolean) as string[]);
  return found.filter((p) => !titles.has(normTitle(p.title)) && !(p.url && urls.has(p.url)));
}

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, { headers: { Accept: "application/json", ...headers }, signal: AbortSignal.timeout(12_000), cache: "no-store" });
  if (!res.ok) throw new Error(`${new URL(url).hostname} answered ${res.status}`);
  return res.json();
}

export async function searchPubmed(author: string, affiliation = "India", max = 40): Promise<{ total: number; papers: FoundPaper[] }> {
  const key = process.env.NCBI_API_KEY ? `&api_key=${encodeURIComponent(process.env.NCBI_API_KEY)}` : "";
  const id = `&tool=${UA_TOOL}&email=${encodeURIComponent(UA_EMAIL)}${key}`;
  const base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  const s = (await getJson(`${base}/esearch.fcgi?db=pubmed&retmode=json&sort=pub_date&retmax=${max}&term=${encodeURIComponent(pubmedTerm(author, affiliation))}${id}`)) as {
    esearchresult?: { count?: string; idlist?: string[] };
  };
  const ids = s.esearchresult?.idlist ?? [];
  const total = Number(s.esearchresult?.count ?? 0);
  if (!ids.length) return { total, papers: [] };
  const sum = await getJson(`${base}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}${id}`);
  return { total, papers: parsePubmedSummary(sum) };
}

export async function fetchOrcidWorks(orcid: string): Promise<FoundPaper[]> {
  return parseOrcidWorks(await getJson(`https://pub.orcid.org/v3.0/${orcid}/works`));
}
