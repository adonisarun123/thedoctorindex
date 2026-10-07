import { words } from "@/lib/content/text";

/**
 * Newsroom: the pure half (no database, no React), unit-tested in
 * tests/unit/news.test.ts. The rules that decide whether a story may publish
 * without a human live here so they can be read and tested in one place.
 */

export const NEWS_CATEGORIES = {
  award: { label: "Award", plural: "Awards & honours" },
  research: { label: "Research", plural: "Research" },
  first: { label: "Medical first", plural: "Medical firsts" },
  appointment: { label: "Appointment", plural: "Appointments" },
  recognition: { label: "Recognition", plural: "Recognition" },
  public_health: { label: "Public health", plural: "Public health" },
  milestone: { label: "Milestone", plural: "Milestones" },
  in_action: { label: "Doctors in action", plural: "Doctors in action" },
} as const;
export type NewsCategory = keyof typeof NEWS_CATEGORIES;
export const isCategory = (c: string): c is NewsCategory => c in NEWS_CATEGORIES;

export const NEWS_DESK = "TDi Newsdesk";
/** At most this many stories go live per IST calendar day; the rest wait in the buffer. */
export const NEWS_DAILY_MAX = 2;
/** Below this many approved stories in the buffer, staff get an alert. */
export const NEWS_BUFFER_MIN = 3;

export const NEWS_LIMITS = {
  headlineMin: 30,
  /** Google truncates NewsArticle headlines past 110 characters. */
  headlineMax: 110,
  dekMin: 60,
  dekMax: 200,
  highlightMax: 160,
  bodyMinWords: 250,
  bodyMaxWords: 1500,
} as const;

export interface NewsSource {
  url: string;
  publisher: string;
  title: string;
  /** ISO date (YYYY-MM-DD) when known. */
  publishedOn?: string | null;
}

export interface NewsNumber {
  value: string;
  label: string;
}

export interface StoryInput {
  headline: string;
  dek: string;
  highlights: string[];
  whyItMatters: string;
  body: string;
  numbers: NewsNumber[];
  category: string;
  subjectName: string;
  sources: NewsSource[];
}

/** Lower-case, hyphenated, ASCII, at most 80 characters, cut on a hyphen. */
export function newsSlug(input: string): string {
  const s = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (s.length <= 80) return s;
  const cut = s.slice(0, 80);
  const at = cut.lastIndexOf("-");
  return (at > 40 ? cut.slice(0, at) : cut).replace(/-+$/, "");
}

/**
 * Same event, same story: the person's name without honorifics plus the
 * event's key words, sorted. Two outlets reporting one award collapse to one
 * fingerprint even with different headlines.
 */
export function fingerprint(subjectName: string, eventKey: string): string {
  const name = subjectName
    .toLowerCase()
    .replace(/^(dr|prof|professor)\.?\s+/g, "")
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const STOP = new Set(["the", "a", "an", "of", "for", "to", "in", "at", "and", "on", "with", "by", "dr", "is", "has", "as"]);
  const key = Array.from(new Set(eventKey.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w))))
    .sort()
    .slice(0, 8)
    .join("-");
  return `${name.replace(/ /g, "-")}::${key}`;
}

/**
 * The newsroom behind a URL, reduced to its registrable domain and folded
 * into syndication families, so two outlets of one group are not counted as
 * two independent sources.
 */
export function publisherDomain(url: string): string {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^(www|m|amp)\./, "");
  } catch {
    return url;
  }
  const parts = host.split(".");
  const twoLevel = parts.length > 2 && /^(co|com|org|net|gov|ac|edu|nic|res)$/.test(parts[parts.length - 2] ?? "");
  const base = parts.slice(twoLevel ? -3 : -2).join(".");
  const FAMILIES: Record<string, string> = {
    "indiatimes.com": "times",
    "timesofindia.com": "times",
    "economictimes.com": "times",
    "hindustantimes.com": "ht",
    "livemint.com": "ht",
    "ndtv.com": "ndtv",
    "indianexpress.com": "ie",
    "financialexpress.com": "ie",
  };
  return FAMILIES[base] ?? base;
}

/** Distinct newsrooms among the sources. */
export function independentSourceCount(sources: NewsSource[]): number {
  return new Set(sources.map((s) => publisherDomain(s.url))).size;
}

export interface AutoGate {
  eligible: boolean;
  notes: string[];
}

/**
 * Option C (agreed 7 Oct 2026): a story publishes itself only when it has two
 * or more independent sources AND its doctor is matched to a TDi profile.
 * Two mechanical conditions sit beside that: the claims check passed (every
 * highlight and figure is supported by a source text) and no editorial
 * problem was found. Anything else is read by a human first.
 */
/** Older than this, a story is not news without an editor deciding it still is. */
export const NEWS_FRESH_DAYS = 14;

export function autoGate(input: { sources: NewsSource[]; matchedDoctor: boolean; claimsOk: boolean; problems: string[]; eventDate?: string | null; now?: Date }): AutoGate {
  const notes: string[] = [];
  const now = (input.now ?? new Date()).getTime();
  const dated = [input.eventDate, ...input.sources.map((s) => s.publishedOn)].filter((d): d is string => Boolean(d && /^\d{4}-\d{2}-\d{2}/.test(d)));
  const newest = dated.length ? Math.max(...dated.map((d) => Date.parse(d.slice(0, 10)))) : null;
  if (newest === null) notes.push("No source or event date — cannot confirm this is recent.");
  else if ((now - newest) / 86_400_000 > NEWS_FRESH_DAYS) notes.push(`Newest report is over ${NEWS_FRESH_DAYS} days old.`);
  const n = independentSourceCount(input.sources);
  if (n < 2) notes.push(`Only ${n} independent source${n === 1 ? "" : "s"} — needs 2 to publish without review.`);
  if (!input.matchedDoctor) notes.push("Doctor not matched to a TDi profile.");
  if (!input.claimsOk) notes.push("Claims check flagged statements a source does not support.");
  for (const p of input.problems) notes.push(p);
  return { eligible: notes.length === 0, notes };
}

/** Superlatives and promises the newsroom must not print in its own voice. */
export const BANNED_IN_OWN_VOICE = /\b(best|top|no\.?\s?1|number one|leading|renowned|world-?class|miracle|cure[sd]?|guarantee[sd]?|100% success)\b/i;

/** Every editorial problem with a story, in reading order. Empty when it may publish. */
export function storyProblems(s: StoryInput): string[] {
  const L = NEWS_LIMITS;
  const out: string[] = [];
  if (s.headline.length < L.headlineMin || s.headline.length > L.headlineMax) out.push(`Headline must be ${L.headlineMin}–${L.headlineMax} characters (now ${s.headline.length}).`);
  if (s.dek.length < L.dekMin || s.dek.length > L.dekMax) out.push(`Standfirst must be ${L.dekMin}–${L.dekMax} characters (now ${s.dek.length}).`);
  if (s.highlights.length !== 3) out.push("Exactly three key highlights are required.");
  if (s.highlights.some((h) => h.length > L.highlightMax)) out.push(`Each highlight must be under ${L.highlightMax} characters.`);
  if (s.whyItMatters.trim().length < 60) out.push("“Why it matters for patients” needs at least a sentence or two.");
  const n = words(s.body);
  if (n < L.bodyMinWords) out.push(`Body is ${n} words; needs at least ${L.bodyMinWords}.`);
  if (n > L.bodyMaxWords) out.push(`Body is ${n} words; keep it under ${L.bodyMaxWords}.`);
  if (/^\s*#\s/m.test(s.body)) out.push("Use ## for headings — the headline is the page's H1.");
  if (!isCategory(s.category)) out.push(`Unknown category “${s.category}”.`);
  if (!s.subjectName.trim()) out.push("The story must name who it is about.");
  if (!s.sources.length) out.push("At least one source is required.");
  for (const src of s.sources) if (!/^https?:\/\//.test(src.url)) out.push(`Source “${src.publisher}” has no usable link.`);
  if (s.numbers.length > 4) out.push("At most four figures in “By the numbers”.");
  // The story reports the news; it does not narrate its own sourcing.
  if (/\b(the (report|source|sources|article)s? (does not|do not|doesn'?t|don'?t|names?|gives?)|the doctor index (has|have) not)\b/i.test(s.body)) out.push("The body comments on its sources (e.g. “the report does not say…”); rewrite it as reporting.");
  // Quoted words are the source's; our own copy may not use them.
  const own = [s.headline, s.dek, ...s.highlights, s.whyItMatters].join(" \n ").replace(/[“"][^”"]*[”"]/g, "");
  const m = BANNED_IN_OWN_VOICE.exec(own);
  if (m) out.push(`“${m[0]}” is not allowed in the headline, standfirst, highlights or patient panel.`);
  return out;
}

/** YYYY-MM-DD of an instant in India Standard Time. */
export function istDay(d: Date = new Date()): string {
  return new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}

/** Start of the IST calendar day containing `d`, as a UTC instant. */
export function istDayStart(d: Date = new Date()): Date {
  return new Date(`${istDay(d)}T00:00:00+05:30`);
}

export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(words(body) / 220));
}

/** "Dr. Priya Rao" → "PR" */
export function initials(name: string): string {
  return name
    .replace(/^(dr|prof)\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "7 Oct 2026" in IST. */
export function istDate(d: Date): string {
  const t = new Date(d.getTime() + 330 * 60_000);
  return `${t.getUTCDate()} ${MON[t.getUTCMonth()]} ${t.getUTCFullYear()}`;
}

/** "7 Oct 2026, 6:05 am IST" */
export function istDateTime(d: Date): string {
  const t = new Date(d.getTime() + 330 * 60_000);
  const h = t.getUTCHours();
  const m = String(t.getUTCMinutes()).padStart(2, "0");
  return `${istDate(d)}, ${h % 12 || 12}:${m} ${h < 12 ? "am" : "pm"} IST`;
}
