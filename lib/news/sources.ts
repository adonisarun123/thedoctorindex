import "server-only";

/**
 * Finding and reading reporting: Serper's Google News endpoint for discovery
 * and corroboration, and a plain fetch + paragraph extraction for the text a
 * story is checked against. Nothing here is stored except the URL and the
 * facts the drafting step takes from it.
 */

export interface Hit {
  url: string;
  title: string;
  snippet: string;
  source: string;
  date: string;
}

/** Discovery queries. Each costs one Serper credit per run. */
export const DISCOVERY_QUERIES = [
  "Indian doctor wins award",
  "doctor honoured award India hospital",
  "first in India surgery doctors hospital",
  "rare surgery performed doctors India first time",
  "doctor appointed director AIIMS",
  "doctor appointed dean medical college India",
  "Indian-origin doctor award",
  "Indian-origin doctor appointed",
  "Indian doctor research study published",
  "Padma Shri doctor",
  "Dr B C Roy award doctor",
  "doctor elected president association India medical",
];

/** Outlets we do not use as sources: aggregators, doctor marketplaces, press-release farms, social. */
const BLOCKED = /(practo|lybrate|justdial|sulekha|credihealth|medifee|quora|facebook|instagram|linkedin|youtube|twitter|x\.com|reddit|pinterest|prnewswire|openPR|einpresswire|newsvoir|scoopwhoop|wikipedia)/i;

export function usableUrl(url: string): boolean {
  return /^https?:\/\//.test(url) && !BLOCKED.test(url);
}

export async function serperNews(q: string, opts: { tbs?: string; num?: number } = {}): Promise<Hit[]> {
  const key = process.env.SERPER_API_KEY;
  if (!key) throw new Error("SERPER_API_KEY is not set.");
  const res = await fetch("https://google.serper.dev/news", {
    method: "POST",
    headers: { "X-API-KEY": key, "Content-Type": "application/json" },
    body: JSON.stringify({ q, gl: "in", hl: "en", num: opts.num ?? 10, tbs: opts.tbs ?? "qdr:d" }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Serper ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as { news?: Array<{ link: string; title: string; snippet?: string; source?: string; date?: string }> };
  return (data.news ?? [])
    .map((n) => ({ url: n.link, title: n.title, snippet: n.snippet ?? "", source: n.source ?? "", date: n.date ?? "" }))
    .filter((h) => usableUrl(h.url));
}

export interface Page {
  url: string;
  publisher: string;
  title: string;
  publishedOn: string | null;
  text: string;
  /** False when only the search snippet could be read: such a source cannot count towards the two-source rule. */
  full: boolean;
}

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…" };
function decode(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
const meta = (html: string, prop: string) => {
  const m = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i").exec(html) ?? new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, "i").exec(html);
  return m ? decode(m[1]).trim() : null;
};

/**
 * The readable text of a news page: its <p> paragraphs (inside <article>
 * when there is one), deduplicated, capped. Pages that block us or render
 * client-side come back with little or no text; the caller then relies on
 * the search snippet and treats the source as weak.
 */
export async function readPage(hit: Pick<Hit, "url" | "title" | "source" | "snippet" | "date">): Promise<Page> {
  let html = "";
  try {
    const res = await fetch(hit.url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36 TheDoctorIndexNewsdesk/1.0", Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    if (res.ok && (res.headers.get("content-type") ?? "").includes("html")) html = (await res.text()).slice(0, 1_500_000);
  } catch {
    /* unreachable page: snippet only */
  }
  const scope = /<article[\s\S]*?<\/article>/i.exec(html)?.[0] ?? html;
  const paras = Array.from(scope.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map((m) => decode(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 40 && !/cookie|subscribe|sign up|newsletter|advertisement|all rights reserved/i.test(p));
  const seen = new Set<string>();
  const text = paras.filter((p) => (seen.has(p) ? false : (seen.add(p), true))).join("\n").slice(0, 9000);
  const published = meta(html, "article:published_time") ?? meta(html, "datePublished") ?? /"datePublished"\s*:\s*"([^"]+)"/.exec(html)?.[1] ?? null;
  return {
    url: hit.url,
    publisher: meta(html, "og:site_name") || hit.source || publisherName(hit.url),
    title: meta(html, "og:title") || hit.title || publisherName(hit.url),
    publishedOn: published && /^\d{4}-\d{2}-\d{2}/.test(published) ? published.slice(0, 10) : null,
    text: text.length >= 300 ? text : `${hit.title}. ${hit.snippet}`,
    full: text.length >= 300,
  };
}

/** "3 hours ago" / "2 days ago" / a date string → age in days, or null when unknown. */
export function ageDays(pageAge: string | null | undefined, now = Date.now()): number | null {
  if (!pageAge) return null;
  const m = /^(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago$/i.exec(pageAge.trim());
  if (m) {
    const n = Number(m[1]);
    const per: Record<string, number> = { minute: 1 / 1440, hour: 1 / 24, day: 1, week: 7, month: 30, year: 365 };
    return n * per[m[2].toLowerCase()];
  }
  const t = Date.parse(pageAge);
  return Number.isNaN(t) ? null : (now - t) / 86_400_000;
}

/**
 * Fallback discovery when Serper is unavailable (no credits, outage): the
 * Anthropic API's web search tool, one search per query, keeping only
 * results the index dates to the last `maxAgeDays`. Costs a search fee per
 * query on the Anthropic bill, so it runs only when Serper fails.
 */
export async function claudeSearch(q: string, maxAgeDays = 3): Promise<Hit[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set.");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.NEWS_SEARCH_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 64,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 1, user_location: { type: "approximate", country: "IN" } }],
      tool_choice: { type: "tool", name: "web_search" },
      messages: [{ role: "user", content: `Search the latest news (last few days) for: ${q}` }],
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`Anthropic web search ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as { content: Array<{ type: string; content?: Array<{ type: string; url: string; title: string; page_age?: string | null }> }> };
  const out: Hit[] = [];
  for (const block of data.content) {
    if (block.type !== "web_search_tool_result" || !Array.isArray(block.content)) continue;
    for (const r of block.content) {
      const age = ageDays(r.page_age);
      if (r.type !== "web_search_result" || age === null || age > maxAgeDays || !usableUrl(r.url)) continue;
      out.push({ url: r.url, title: r.title, snippet: "", source: new URL(r.url).hostname.replace(/^www\./, ""), date: r.page_age ?? "" });
    }
  }
  return out;
}

/** Serper first; the Anthropic web search when Serper refuses (credits, outage). */
export async function newsSearch(q: string, opts: { tbs?: string; num?: number; maxAgeDays?: number } = {}): Promise<{ hits: Hit[]; via: "serper" | "claude" }> {
  try {
    return { hits: await serperNews(q, opts), via: "serper" };
  } catch (e) {
    if (!process.env.ANTHROPIC_API_KEY) throw e;
    return { hits: await claudeSearch(q, opts.maxAgeDays ?? 3), via: "claude" };
  }
}

/** "www.deccanherald.com" → "Deccan Herald" for the outlets we see most; otherwise the bare host. */
export function publisherName(url: string): string {
  const host = new URL(url).hostname.replace(/^(www|m|amp)\./, "");
  const KNOWN: Record<string, string> = {
    "medicaldialogues.in": "Medical Dialogues", "thehindu.com": "The Hindu", "timesofindia.indiatimes.com": "The Times of India", "deccanherald.com": "Deccan Herald",
    "indianexpress.com": "The Indian Express", "hindustantimes.com": "Hindustan Times", "ndtv.com": "NDTV", "thehansindia.com": "The Hans India", "newindianexpress.com": "The New Indian Express",
    "pib.gov.in": "Press Information Bureau", "economictimes.indiatimes.com": "The Economic Times", "livemint.com": "Mint", "thequint.com": "The Quint", "theprint.in": "ThePrint", "news18.com": "News18",
  };
  return KNOWN[host] ?? host;
}

/**
 * Health and doctor news sections of Indian outlets. Their front pages are
 * read the way a person browsing would: one request per section per run, the
 * article links and headlines only. This is the discovery path that needs no
 * search API, so the day never depends on one vendor's credits.
 */
export const SECTION_PAGES = [
  "https://medicaldialogues.in/news/health/doctors",
  "https://medicaldialogues.in/news/health/hospital-diagnostics",
  "https://www.thehindu.com/sci-tech/health/",
  "https://indianexpress.com/section/lifestyle/health/",
  "https://www.thehansindia.com/life-style/health",
  "https://health.economictimes.indiatimes.com/news/industry",
  "https://www.biospectrumindia.com/news/",
];

/** Article links on a section page: same site, article-shaped path, a headline of 30+ characters. */
export function extractArticleLinks(html: string, pageUrl: string): Array<{ url: string; title: string }> {
  const base = new URL(pageUrl);
  const host = base.hostname.replace(/^www\./, "");
  const out = new Map<string, string>();
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let url: URL;
    try {
      url = new URL(decode(m[1]), base);
    } catch {
      continue;
    }
    if (url.hostname.replace(/^www\./, "") !== host) continue;
    const path = url.pathname;
    // Article URLs carry a long slug or a numeric id; section and tag pages do not.
    if (!(/\d{4,}/.test(path) || (path.split("/").pop() ?? "").split("-").length >= 6)) continue;
    if (/\/(tag|tags|topic|author|video|videos|photos|gallery|live)\//i.test(path)) continue;
    const text = decode(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    const title = text.length >= 30 ? text : (path.split("/").filter(Boolean).pop() ?? "").replace(/-\d+$/, "").replace(/[-_]+/g, " ");
    url.search = "";
    url.hash = "";
    const key = url.toString();
    if (title.length >= 30 && (!out.has(key) || (out.get(key)!.length < title.length && title.length < 200))) out.set(key, title.slice(0, 200));
  }
  return Array.from(out, ([url, title]) => ({ url, title }));
}

export async function sectionHits(pages: string[] = SECTION_PAGES): Promise<Hit[]> {
  const results = await Promise.allSettled(
    pages.map(async (page) => {
      const res = await fetch(page, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36 TheDoctorIndexNewsdesk/1.0", Accept: "text/html" },
        redirect: "follow",
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) return [];
      const html = await res.text();
      return extractArticleLinks(html, page).map((l) => ({ url: l.url, title: l.title, snippet: "", source: publisherName(l.url), date: "" }));
    }),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])).filter((h) => usableUrl(h.url));
}
