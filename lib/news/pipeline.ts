import "server-only";

import { desc, eq, inArray, sql } from "drizzle-orm";

import { sendEmail } from "@/lib/auth/mailer";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { type LlmUsage, askJson } from "@/lib/news/llm";
import { NEWS_BUFFER_MIN, NEWS_CATEGORIES, type NewsNumber, type NewsSource, fingerprint, isCategory, istDay } from "@/lib/news/format";
import { DISCOVERY_QUERIES, type Hit, type Page, newsSearch, readPage } from "@/lib/news/sources";
import { bufferCount, createStory, publishDue, publishedTodayCount } from "@/lib/services/news";
import { absoluteUrl } from "@/lib/site";

/**
 * The daily newsroom run (cron: /api/cron/news).
 *
 *  1 discover   Serper Google News, past 24h, a fixed set of queries
 *  2 triage     one model call groups hits into candidate stories and scores them
 *  3 corroborate a targeted search per candidate for independent reporting
 *  4 read       fetch each source page's text
 *  5 draft      the model writes the TDi story from those texts only
 *  6 check      a second, separate call checks every statement against the texts
 *  7 match      the doctor is looked up among published TDi profiles
 *  8 store      createStory → autoGate decides draft (human) or buffer
 *  9 publish    publishDue fills today's slots from the buffer
 *
 * Every step degrades rather than fails the run: an unreadable page becomes
 * a weak source, a failed draft is skipped. The run fails only when it cannot
 * talk to the database or to either API at all — and then staff are emailed.
 */

const MAX_CANDIDATES = 4;
const BUDGET_MS = 230_000;

interface Candidate {
  items: number[];
  subject: string;
  event: string;
  category: string;
  score: number;
  where: "india" | "abroad";
}

interface Draft {
  headline: string;
  dek: string;
  highlights: string[];
  whyItMatters: string;
  body: string;
  numbers: NewsNumber[];
  category: string;
  subjectName: string;
  subjectRole: string;
  place: string;
  city: string | null;
  abroad: boolean;
  specialtyKey: string | null;
  eventDate: string | null;
  sourcesUsed: number[];
  /** 5-8 words naming the event, for de-duplication. */
  eventKey?: string;
  skip?: string;
}

export interface RunReport {
  day: string;
  hits: number;
  fresh: number;
  candidates: Array<{ subject: string; event: string; score: number; outcome: string }>;
  drafted: number;
  autoApproved: number;
  published: number;
  buffer: number;
  usage: LlmUsage;
  /** Which search backend answered: serper, or the claude fallback. */
  via: string[];
  ms: number;
}

const SYSTEM_RULES = `You are the TDi Newsdesk, the news team of The Doctor Index, an Indian directory of verified doctors.
You report achievements and appointments of individual medical doctors practising in India, and of Indian-origin doctors practising abroad.
Hard rules:
- Use ONLY facts stated in the source texts provided. Never add facts from memory. If a fact is not in a source, leave it out.
- Write in your own words. Never copy a sentence; short quotations must be in quotation marks and attributed to the person and source.
- No superlatives or rankings in your own voice (best, top, leading, renowned, world-class, number one). Attribute claims of "first": "the hospital says it is the first…".
- No claims of cure, guaranteed results, or success rates stated as fact in your own voice; attribute them.
- Never name or identify a patient unless the source names them with consent context; prefer "a 54-year-old patient from Mysuru".
- Indian English spelling. Calm, factual, warm. Reply with a single JSON object and nothing else.`;

/* ------------------------------------------------------------------------- */
/* Doctor matching                                                           */
/* ------------------------------------------------------------------------- */

const CITY_ALIASES: Record<string, string[]> = {
  bengaluru: ["bangalore", "bengaluru"],
  mumbai: ["mumbai", "bombay"],
  chennai: ["chennai", "madras"],
  kolkata: ["kolkata", "calcutta"],
  gurugram: ["gurugram", "gurgaon"],
  "new-delhi": ["delhi", "new delhi"],
  delhi: ["delhi", "new delhi"],
  thiruvananthapuram: ["thiruvananthapuram", "trivandrum"],
  kochi: ["kochi", "cochin"],
  mysuru: ["mysuru", "mysore"],
  puducherry: ["puducherry", "pondicherry"],
};

const bare = (name: string) => name.toLowerCase().replace(/^(dr|prof|professor)\.?\s+/g, "").replace(/^(dr|prof)\.?\s+/g, "").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();

/**
 * A published TDi profile for the person a story names: same name (honorifics
 * and punctuation ignored), and — so a common name is never attached to the
 * wrong doctor — the same city or the same speciality. When two or more
 * profiles share the name, both city and speciality must agree and leave one.
 */
export async function matchDoctor(name: string, place: string, specialtyKey: string | null): Promise<{ doctorId: string; matchedBy: string } | null> {
  const b = bare(name);
  if (b.split(" ").length < 2) return null;
  const rows = (await getDb().execute(sql`
    select d.id, d.name, d.specialty_key as specialty, coalesce(array_agg(distinct l.city_slug) filter (where l.city_slug is not null), '{}') as cities
    from doctors d
    left join doctor_practices p on p.doctor_id = d.id and p.active
    left join facilities f on f.id = p.facility_id
    left join localities l on l.key = f.locality_key
    where d.status = 'published' and d.name ilike ${`%${b.split(" ").slice(-1)[0]}%`} and d.name ilike ${`%${b.split(" ")[0]}%`}
    group by d.id
    limit 50
  `)) as unknown as Array<{ id: string; name: string; specialty: string; cities: string[] }>;
  const same = rows.filter((r) => bare(r.name) === b);
  if (!same.length) return null;
  const p = place.toLowerCase();
  const cityOk = (r: { cities: string[] }) => r.cities.some((c) => (CITY_ALIASES[c] ?? [c.replace(/-/g, " ")]).some((a) => p.includes(a)));
  const specOk = (r: { specialty: string }) => Boolean(specialtyKey) && r.specialty === specialtyKey;
  if (same.length === 1) {
    const r = same[0];
    if (cityOk(r) && specOk(r)) return { doctorId: r.id, matchedBy: "name+city+specialty" };
    if (cityOk(r)) return { doctorId: r.id, matchedBy: "name+city" };
    if (specOk(r)) return { doctorId: r.id, matchedBy: "name+specialty" };
    return null;
  }
  const both = same.filter((r) => cityOk(r) && specOk(r));
  return both.length === 1 ? { doctorId: both[0].id, matchedBy: "name+city+specialty" } : null;
}

/* ------------------------------------------------------------------------- */
/* Steps                                                                     */
/* ------------------------------------------------------------------------- */

async function discover(report: { via: string[] }): Promise<Hit[]> {
  const all = await Promise.allSettled(DISCOVERY_QUERIES.map((q) => newsSearch(q)));
  const done = all.filter((r): r is PromiseFulfilledResult<{ hits: Hit[]; via: "serper" | "claude" }> => r.status === "fulfilled");
  report.via = Array.from(new Set(done.map((r) => r.value.via)));
  const ok = done.flatMap((r) => r.value.hits);
  if (!done.length) throw new Error(`Search failed for every query: ${(all[0] as PromiseRejectedResult).reason}`);
  const byUrl = new Map<string, Hit>();
  for (const h of ok) if (!byUrl.has(h.url)) byUrl.set(h.url, h);
  return Array.from(byUrl.values());
}

async function triage(hits: Hit[], usage: LlmUsage): Promise<Candidate[]> {
  if (!hits.length) return [];
  const list = hits.map((h, i) => `[${i}] ${h.title} | ${h.source} | ${h.date} | ${h.snippet}`).join("\n");
  const out = await askJson<{ stories: Candidate[] }>({
    system: SYSTEM_RULES,
    usage,
    maxTokens: 3000,
    user: `Below are today's news search results. Group results that report the SAME event about the SAME named doctor, and keep only stories that are:
- about one or more named individual medical doctors (physicians, surgeons, dentists) — not hospitals alone, not companies, not non-medical scientists;
- an achievement or appointment: award, honour, recognition, medical first or rare procedure, published research, election to a professional body, senior appointment, milestone, or a notable life-saving act (e.g. saving a passenger mid-flight);
- about a doctor practising in India, or an Indian-origin doctor practising abroad.
Exclude: crime, negligence, disputes, deaths and obituaries, politics, protests, strikes, advertorials and "sponsored" content, events older than 7 days, and anything where the doctor is not named.
Score newsworthiness 1–10 for Indian patients and doctors (national award or genuine first = 8–10; local felicitation = 3–4).
Categories: ${Object.keys(NEWS_CATEGORIES).join(", ")}.
Return {"stories":[{"items":[indices],"subject":"Dr Full Name","event":"5-8 word description of the event","category":"…","score":n,"where":"india"|"abroad"}]} — best first, at most 8. Return {"stories":[]} if none qualify.

${list}`,
  });
  return (out.stories ?? []).filter((c) => c.items?.length && c.subject && c.score >= 5);
}

async function corroborate(c: Candidate, known: Set<string>): Promise<Hit[]> {
  const surname = bare(c.subject).split(" ").slice(-1)[0];
  try {
    const { hits } = await newsSearch(`"${bare(c.subject)}" ${c.event}`, { tbs: "qdr:w", num: 10, maxAgeDays: 10 });
    return hits.filter((h) => !known.has(h.url) && h.title.toLowerCase().includes(surname)).slice(0, 3);
  } catch {
    return [];
  }
}

async function draft(c: Candidate | null, pages: Page[], usage: LlmUsage): Promise<Draft> {
  const texts = pages.map((p, i) => `<source index="${i}" publisher="${p.publisher}" date="${p.publishedOn ?? "unknown"}" url="${p.url}">\n${p.title}\n${p.text}\n</source>`).join("\n\n");
  return askJson<Draft>({
    system: SYSTEM_RULES,
    usage,
    maxTokens: 4000,
    user: `Write a TDi Newsdesk story about: ${c ? `${c.subject} — ${c.event}` : "the named doctor these sources report on (their achievement or appointment)"}.

${texts}

If the sources do not report one or more NAMED medical doctors doing something noteworthy (an achievement, appointment, first, research, honour or life-saving act), return {"skip":"reason"}. A team of named doctors is fine. Missing details (institution, city) are not a reason to skip — leave those fields empty rather than guessing.

Otherwise return JSON with exactly these fields:
- headline: 45–100 characters, specific, active voice, names the doctor or their role and place. No clickbait, no question marks.
- dek: 90–190 characters standfirst that adds what the headline leaves out.
- highlights: exactly 3 strings, each one concrete fact under 150 characters.
- whyItMatters: 2–3 sentences (60–400 characters) on what this means for patients or for healthcare in India, grounded in the sources; general context only, no medical advice.
- body: 300–600 words in this syntax: paragraphs separated by blank lines, "## " section headings (2–3 of them, e.g. "## The procedure", "## About Dr X", "## What comes next"), "- " for bullets. Lead with the news; then context; then the doctor's background as the sources give it. Attribute with "according to <publisher>". No links. Never write about the sources themselves, about what they omit, or about what The Doctor Index did or did not add — just report.
- numbers: 0–3 objects {"value":"…","label":"…"} — only figures stated in a source (e.g. {"value":"14 hours","label":"length of the surgery"}). Empty array if none are striking.
- category: one of ${Object.keys(NEWS_CATEGORIES).join(", ")}.
- subjectName: the doctor's name as "Dr First Last"; for a team, the lead doctor or "Dr A, Dr B and Dr C".
- subjectRole: role and institution, e.g. "Head of Neurosurgery, Manipal Hospital" ("" if the sources do not say).
- place: "City, State" in India, or "City, Country" abroad ("" if the sources do not say where they practise).
- city: the Indian city name, or null if abroad.
- abroad: true if they practise outside India.
- specialtyKey: the closest of [${SPECIALTY_KEYS.join(", ")}] or null.
- eventDate: YYYY-MM-DD if a source states it, else null.
- sourcesUsed: indices of the sources you actually used.
- eventKey: 5–8 words naming the event (e.g. "B C Roy award 2026 cardiology").`,
  });
}

async function checkClaims(d: Draft, pages: Page[], usage: LlmUsage): Promise<{ ok: boolean; checked: number; unsupported: string[] }> {
  const texts = pages.map((p, i) => `<source index="${i}" publisher="${p.publisher}">\n${p.title}\n${p.text}\n</source>`).join("\n\n");
  const out = await askJson<{ statements: Array<{ text: string; supported: boolean }> }>({
    system: "You are a strict fact-checker. You compare a news story against its source texts and report, statement by statement, whether the sources support it. A statement is supported only if a source states it or it follows directly from what a source states. Background framing that asserts no specific fact (e.g. 'this matters because heart disease is common') counts as supported only if it is general and uncontroversial. Attribution itself ('according to <publisher>', 'the hospital said') is not a statement to check — check only the fact being attributed. Reply with one JSON object.",
    usage,
    maxTokens: 3000,
    user: `Sources:\n${texts}\n\nStory:\nHEADLINE: ${d.headline}\nSTANDFIRST: ${d.dek}\nHIGHLIGHTS:\n${d.highlights.map((h) => `- ${h}`).join("\n")}\nNUMBERS:\n${d.numbers.map((n) => `- ${n.value}: ${n.label}`).join("\n") || "(none)"}\nROLE: ${d.subjectName}, ${d.subjectRole}, ${d.place}\nBODY:\n${d.body}\n\nList every factual statement in the headline, standfirst, highlights, numbers, role line and body (names, roles, places, dates, figures, events, quotes). Return {"statements":[{"text":"…","supported":true|false}]}.`,
  });
  const st = out.statements ?? [];
  const unsupported = st.filter((x) => !x.supported).map((x) => x.text);
  return { ok: st.length > 0 && unsupported.length === 0, checked: st.length, unsupported };
}

async function markSeen(urls: string[], outcome: string, storyId: string | null = null) {
  if (!urls.length) return;
  await getDb()
    .insert(s.newsSeenUrls)
    .values(urls.map((url) => ({ url, outcome, storyId })))
    .onConflictDoUpdate({ target: s.newsSeenUrls.url, set: { outcome, storyId, seenAt: new Date() } });
}

/**
 * Draft, check, match and store one story from pages already read. Shared by
 * the daily run and by staff's "draft from links" (draftFromUrls).
 */
async function buildStory(c: Candidate | null, pages: Page[], usage: LlmUsage, origin: "pipeline" | "staff"): Promise<{ outcome: string; created: Awaited<ReturnType<typeof createStory>> }> {
  const urls = pages.map((p) => p.url);
  const d = await draft(c, pages, usage);
  if (d.skip || !d.headline) {
    await markSeen(urls, `skipped:${(d.skip ?? "no draft").slice(0, 80)}`);
    return { outcome: `skipped: ${d.skip ?? "no draft"}`, created: null };
  }
  const usedPages = d.sourcesUsed?.length ? d.sourcesUsed.map((i) => pages[i]).filter(Boolean) : pages;
  const claims = await checkClaims(d, usedPages, usage);
  const specialtyKey = d.specialtyKey && d.specialtyKey in SPECIALTIES ? d.specialtyKey : null;
  const m = d.abroad ? null : await matchDoctor(d.subjectName, `${d.place} ${d.city ?? ""}`, specialtyKey);
  const sources: NewsSource[] = usedPages.map((p) => ({ url: p.url, publisher: p.publisher, title: p.title, publishedOn: p.publishedOn }));
  const created = await createStory({
    headline: d.headline.trim(),
    dek: d.dek.trim(),
    highlights: (d.highlights ?? []).slice(0, 3).map((h) => h.trim()),
    whyItMatters: (d.whyItMatters ?? "").trim(),
    body: (d.body ?? "").trim(),
    numbers: (d.numbers ?? []).filter((n) => n?.value && n?.label).slice(0, 3),
    category: isCategory(d.category) ? d.category : (c?.category ?? "recognition"),
    subjectName: d.subjectName,
    subjectRole: d.subjectRole ?? "",
    place: d.place ?? "",
    abroad: Boolean(d.abroad),
    specialtyKey,
    sources,
    fingerprint: fingerprint(c?.subject ?? d.subjectName, c?.event ?? d.eventKey ?? d.headline),
    eventDate: d.eventDate && /^\d{4}-\d{2}-\d{2}$/.test(d.eventDate) ? d.eventDate : null,
    origin,
    doctors: m ? [{ doctorId: m.doctorId, primary: true, matchedBy: m.matchedBy }] : [],
    claims,
    weakUrls: usedPages.filter((p) => !p.full).map((p) => p.url),
  });
  await markSeen(urls, created ? "drafted" : "duplicate", created?.row.id ?? null);
  if (!created) return { outcome: "duplicate of an existing story (sources merged)", created };
  return { outcome: created.gate.eligible ? "auto-approved → buffer" : `needs review: ${created.gate.notes.join("; ")}`, created };
}

/** Staff (or the CLI) hand over 1–4 links about one event; the story is drafted, checked and queued like any other. */
export async function draftFromUrls(urls: string[]): Promise<{ outcome: string; storyId: string | null; usage: LlmUsage }> {
  const clean = Array.from(new Set(urls.map((u) => u.trim()).filter((u) => /^https?:\/\//.test(u)))).slice(0, 4);
  if (!clean.length) throw new Error("Give at least one link to a news report.");
  const usage: LlmUsage = { input: 0, output: 0 };
  const pages = await Promise.all(clean.map((url) => readPage({ url, title: "", source: "", snippet: "", date: "" })));
  if (!pages.some((p) => p.full)) throw new Error("None of these pages could be read (blocked or rendered by script). Try another outlet's report.");
  const r = await buildStory(null, pages.filter((p) => p.full), usage, "staff");
  return { outcome: r.outcome, storyId: r.created?.row.id ?? null, usage };
}

/* ------------------------------------------------------------------------- */
/* Runs                                                                      */
/* ------------------------------------------------------------------------- */

export async function runNewsPipeline(opts: { publish?: boolean } = {}): Promise<RunReport> {
  const t0 = Date.now();
  const db = getDb();
  const [run] = await db.insert(s.newsRuns).values({}).returning({ id: s.newsRuns.id });
  const usage: LlmUsage = { input: 0, output: 0 };
  const report: RunReport = { day: istDay(), hits: 0, fresh: 0, candidates: [], drafted: 0, autoApproved: 0, published: 0, buffer: 0, usage, via: [], ms: 0 };
  try {
    const hits = await discover(report);
    report.hits = hits.length;
    const seen = new Set((await db.select({ url: s.newsSeenUrls.url }).from(s.newsSeenUrls).where(inArray(s.newsSeenUrls.url, hits.map((h) => h.url).concat([""])))).map((r) => r.url));
    const fresh = hits.filter((h) => !seen.has(h.url));
    report.fresh = fresh.length;

    const candidates = (await triage(fresh, usage)).sort((a, b) => b.score - a.score).slice(0, MAX_CANDIDATES);
    const used = new Set<number>();
    for (const c of candidates) c.items.forEach((i) => used.add(i));
    await markSeen(fresh.filter((_, i) => !used.has(i)).map((h) => h.url), "skipped:triage");

    const known = new Set(hits.map((h) => h.url));
    const results = await Promise.allSettled(
      candidates.map(async (c) => {
        if (Date.now() - t0 > BUDGET_MS) return { c, outcome: "skipped: time budget" };
        const primary = c.items.map((i) => fresh[i]).filter(Boolean);
        const extra = await corroborate(c, known);
        const pages = await Promise.all([...primary, ...extra].slice(0, 4).map((h) => readPage(h)));
        const r = await buildStory(c, pages, usage, "pipeline");
        if (r.created) {
          report.drafted++;
          if (r.created.gate.eligible) report.autoApproved++;
        }
        return { c, outcome: r.outcome };
      }),
    );
    for (const r of results) {
      if (r.status === "fulfilled") report.candidates.push({ subject: r.value.c.subject, event: r.value.c.event, score: r.value.c.score, outcome: r.value.outcome });
      else report.candidates.push({ subject: "?", event: "?", score: 0, outcome: `error: ${String(r.reason).slice(0, 200)}` });
    }

    if (opts.publish !== false) report.published = (await publishDue()).length;
    report.buffer = await bufferCount();
    report.ms = Date.now() - t0;
    await db.update(s.newsRuns).set({ finishedAt: new Date(), ok: true, report }).where(eq(s.newsRuns.id, run.id));
    return report;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    report.ms = Date.now() - t0;
    await db.update(s.newsRuns).set({ finishedAt: new Date(), ok: false, error: msg.slice(0, 1000), report }).where(eq(s.newsRuns.id, run.id));
    // Even a failed discovery run must not leave the day empty.
    if (opts.publish !== false) await publishDue().catch(() => []);
    await alertStaff("Newsroom run failed", `The daily news run failed:\n\n${msg}\n\n${opts.publish !== false ? "Anything in the buffer was still published. " : ""}Check ${absoluteUrl("/admin/news")}.`);
    throw e;
  }
}

/**
 * Afternoon safety net: fill any empty slot from the buffer, then alert if
 * the day is still empty or the buffer is running low.
 */
export async function runNewsSafetyNet(): Promise<{ published: number; today: number; buffer: number; review: number; alerted: boolean }> {
  const published = (await publishDue()).length;
  const today = await publishedTodayCount();
  const buffer = await bufferCount();
  const [r] = await getDb().select({ n: sql<number>`count(*)::int` }).from(s.newsStories).where(eq(s.newsStories.status, "draft"));
  const review = Number(r?.n ?? 0);
  const [lastRun] = await getDb().select().from(s.newsRuns).orderBy(desc(s.newsRuns.startedAt)).limit(1);
  let alerted = false;
  if (today === 0 || buffer < NEWS_BUFFER_MIN) {
    alerted = true;
    await alertStaff(
      today === 0 ? "No news story published today" : `News buffer low (${buffer})`,
      [
        today === 0 ? "Nothing has been published on /news today and the buffer is empty." : `Today: ${today} published. Buffer: ${buffer} (minimum ${NEWS_BUFFER_MIN}).`,
        `Stories waiting for your review: ${review}. Approving them refills the buffer.`,
        lastRun ? `Last pipeline run: ${lastRun.ok === false ? `FAILED — ${lastRun.error}` : "ok"}.` : "The pipeline has not run yet.",
        `Review: ${absoluteUrl("/admin/news")}`,
      ].join("\n\n"),
    );
  }
  return { published, today, buffer, review, alerted };
}

async function alertStaff(subject: string, text: string): Promise<void> {
  const to = process.env.NEWS_ALERT_EMAIL || process.env.STAFF_BOOTSTRAP_ADMIN_EMAIL;
  if (!to) return;
  try {
    await sendEmail({ to, subject: `[TDi Newsdesk] ${subject}`, text });
  } catch {
    /* alerting must never break the run */
  }
}
