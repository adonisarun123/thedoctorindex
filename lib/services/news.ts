import "server-only";

import { and, asc, desc, eq, gte, inArray, isNotNull, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { NEWS_DAILY_MAX, type NewsNumber, type NewsSource, autoGate, istDayStart, newsSlug, storyProblems } from "@/lib/news/format";
import { audit } from "@/lib/services/audit";

/**
 * Newsroom service (see the newsStories table for the rules).
 *
 *   draft ──approve──▶ approved (buffer) ──slot──▶ published ──▶ withdrawn
 *     └──reject──▶ rejected          staff "publish now" skips the buffer
 *
 * The pipeline (lib/news/pipeline.ts) writes drafts, and marks a draft
 * `approved` itself only when autoGate passes. Nothing publishes except
 * through `publishDue` (the daily slot) or a staff "publish now", so the
 * NEWS_DAILY_MAX cap holds whichever path a story took.
 */

export type StoryRow = typeof s.newsStories.$inferSelect;

export interface StoryDoctor {
  id: string;
  slug: string;
  name: string;
  specialtyKey: string;
  claimed: boolean;
  photoUrl: string | null;
  registrationChecked: boolean;
  tdiId: string | null;
  primary: boolean;
}

export const storySources = (r: Pick<StoryRow, "sources">) => (Array.isArray(r.sources) ? (r.sources as NewsSource[]) : []);
export const storyNumbers = (r: Pick<StoryRow, "numbers">) => (Array.isArray(r.numbers) ? (r.numbers as NewsNumber[]) : []);

/** Live TDi profiles a story is linked to. A doctor whose profile is not published is simply not shown. */
export async function doctorsForStories(storyIds: string[]): Promise<Map<string, StoryDoctor[]>> {
  const out = new Map<string, StoryDoctor[]>();
  if (!storyIds.length) return out;
  const rows = await getDb()
    .select({
      storyId: s.newsStoryDoctors.storyId,
      primary: s.newsStoryDoctors.primary,
      id: s.doctors.id,
      slug: s.doctors.slug,
      name: s.doctors.name,
      specialtyKey: s.doctors.specialtyKey,
      claimed: s.doctors.claimed,
      photoFileId: s.doctors.photoFileId,
      photoConsent: s.doctors.photoConsent,
      tdiId: s.doctors.tdiId,
      checked: sql<boolean>`exists (select 1 from medical_registrations r where r.doctor_id = ${s.doctors.id} and r.is_primary and r.checked_on is not null)`,
    })
    .from(s.newsStoryDoctors)
    .innerJoin(s.doctors, eq(s.doctors.id, s.newsStoryDoctors.doctorId))
    .where(and(inArray(s.newsStoryDoctors.storyId, storyIds), eq(s.doctors.status, "published")))
    .orderBy(desc(s.newsStoryDoctors.primary));
  for (const r of rows) {
    const list = out.get(r.storyId) ?? [];
    list.push({
      id: r.id,
      slug: r.slug,
      name: r.name,
      specialtyKey: r.specialtyKey,
      claimed: r.claimed,
      photoUrl: r.photoFileId && r.photoConsent ? `/photos/${r.photoFileId}` : null,
      registrationChecked: Boolean(r.checked),
      tdiId: r.tdiId,
      primary: r.primary,
    });
    out.set(r.storyId, list);
  }
  return out;
}

/* ------------------------------------------------------------------------- */
/* Public reads                                                              */
/* ------------------------------------------------------------------------- */

const isLive = eq(s.newsStories.status, "published");

export async function getPublishedStory(slug: string): Promise<{ story: StoryRow; doctors: StoryDoctor[] } | null> {
  const [story] = await getDb().select().from(s.newsStories).where(and(eq(s.newsStories.slug, slug), isLive)).limit(1);
  if (!story) return null;
  const docs = await doctorsForStories([story.id]);
  return { story, doctors: docs.get(story.id) ?? [] };
}

export type StoryListItem = Pick<StoryRow, "id" | "slug" | "headline" | "dek" | "category" | "subjectName" | "subjectRole" | "place" | "abroad" | "publishedAt" | "updatedAt" | "correctedAt" | "highlights" | "specialtyKey">;

const listCols = {
  id: s.newsStories.id,
  slug: s.newsStories.slug,
  headline: s.newsStories.headline,
  dek: s.newsStories.dek,
  category: s.newsStories.category,
  subjectName: s.newsStories.subjectName,
  subjectRole: s.newsStories.subjectRole,
  place: s.newsStories.place,
  abroad: s.newsStories.abroad,
  publishedAt: s.newsStories.publishedAt,
  updatedAt: s.newsStories.updatedAt,
  correctedAt: s.newsStories.correctedAt,
  highlights: s.newsStories.highlights,
  specialtyKey: s.newsStories.specialtyKey,
};

export async function listPublishedStories(opts: { category?: string; limit?: number; since?: Date; excludeId?: string } = {}): Promise<StoryListItem[]> {
  const where = [isLive];
  if (opts.category) where.push(eq(s.newsStories.category, opts.category));
  if (opts.since) where.push(gte(s.newsStories.publishedAt, opts.since));
  const rows = await getDb()
    .select(listCols)
    .from(s.newsStories)
    .where(and(...where))
    .orderBy(desc(s.newsStories.publishedAt))
    .limit((opts.limit ?? 60) + (opts.excludeId ? 1 : 0));
  return opts.excludeId ? rows.filter((r) => r.id !== opts.excludeId).slice(0, opts.limit ?? 60) : rows;
}

/** Published stories that mention a doctor, newest first — the "In the news" block on a profile. */
export async function storiesForDoctor(doctorId: string, limit = 5): Promise<StoryListItem[]> {
  return getDb()
    .select(listCols)
    .from(s.newsStories)
    .innerJoin(s.newsStoryDoctors, eq(s.newsStoryDoctors.storyId, s.newsStories.id))
    .where(and(isLive, eq(s.newsStoryDoctors.doctorId, doctorId)))
    .orderBy(desc(s.newsStories.publishedAt))
    .limit(limit);
}

/** Categories that have at least one published story, with counts, for the hub's filter row. */
export async function categoryCounts(): Promise<Record<string, number>> {
  const rows = await getDb()
    .select({ category: s.newsStories.category, n: sql<number>`count(*)::int` })
    .from(s.newsStories)
    .where(isLive)
    .groupBy(s.newsStories.category);
  return Object.fromEntries(rows.map((r) => [r.category, Number(r.n)]));
}

/* ------------------------------------------------------------------------- */
/* Publishing                                                                */
/* ------------------------------------------------------------------------- */

export async function publishedTodayCount(now = new Date()): Promise<number> {
  const [r] = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(s.newsStories)
    .where(and(isLive, gte(s.newsStories.publishedAt, istDayStart(now))));
  return Number(r?.n ?? 0);
}

export async function bufferCount(): Promise<number> {
  const [r] = await getDb().select({ n: sql<number>`count(*)::int` }).from(s.newsStories).where(eq(s.newsStories.status, "approved"));
  return Number(r?.n ?? 0);
}

async function markPublished(row: StoryRow, actorUserId: string | null, now: Date, how: string): Promise<void> {
  await getDb().update(s.newsStories).set({ status: "published", publishedAt: row.publishedAt ?? now, updatedAt: now }).where(eq(s.newsStories.id, row.id));
  await audit({ actorUserId, actorRole: actorUserId ? "staff" : "system", action: `news.published.${how}`, entityType: "news_story", entityId: row.id, after: { slug: row.slug } });
}

/**
 * Fill today's slots from the buffer: freshest event first, then oldest in
 * the queue. Returns what went live. Called by the daily cron and the
 * afternoon safety-net run; calling it twice is harmless.
 */
export async function publishDue(now = new Date()): Promise<StoryRow[]> {
  const slots = NEWS_DAILY_MAX - (await publishedTodayCount(now));
  if (slots <= 0) return [];
  const due = await getDb()
    .select()
    .from(s.newsStories)
    .where(eq(s.newsStories.status, "approved"))
    .orderBy(sql`${s.newsStories.eventDate} desc nulls last`, asc(s.newsStories.createdAt))
    .limit(slots);
  for (const row of due) await markPublished(row, null, now, "slot");
  return due;
}

/* ------------------------------------------------------------------------- */
/* Staff                                                                     */
/* ------------------------------------------------------------------------- */

export type QueueView = "review" | "buffer" | "published" | "rejected";

export async function listNewsQueue(view: QueueView) {
  const status = view === "review" ? "draft" : view === "buffer" ? "approved" : view === "published" ? "published" : "rejected";
  const rows = await getDb()
    .select()
    .from(s.newsStories)
    .where(view === "rejected" ? inArray(s.newsStories.status, ["rejected", "withdrawn"]) : eq(s.newsStories.status, status))
    .orderBy(view === "published" ? desc(s.newsStories.publishedAt) : desc(s.newsStories.createdAt))
    .limit(100);
  const docs = await doctorsForStories(rows.map((r) => r.id));
  return rows.map((r) => ({ ...r, doctors: docs.get(r.id) ?? [] }));
}

export async function newsCounts(): Promise<{ review: number; buffer: number; today: number; lastRun: typeof s.newsRuns.$inferSelect | null }> {
  const db = getDb();
  const [c] = await db
    .select({
      review: sql<number>`count(*) filter (where status = 'draft')::int`,
      buffer: sql<number>`count(*) filter (where status = 'approved')::int`,
    })
    .from(s.newsStories);
  const [lastRun] = await db.select().from(s.newsRuns).orderBy(desc(s.newsRuns.startedAt)).limit(1);
  return { review: Number(c?.review ?? 0), buffer: Number(c?.buffer ?? 0), today: await publishedTodayCount(), lastRun: lastRun ?? null };
}

export type StoryDecision = "approve" | "publish" | "reject" | "withdraw" | "restore";

/**
 * approve  draft → buffer (goes live in the next free daily slot)
 * publish  draft/buffer → live now (counts against today's cap only as information: staff may exceed it)
 * reject   draft/buffer → rejected (note required)
 * withdraw live → withdrawn (note required; the URL then 404s)
 * restore  rejected → draft
 */
export async function decideStory(id: string, decision: StoryDecision, staffUserId: string, note?: string): Promise<StoryRow> {
  const db = getDb();
  const [row] = await db.select().from(s.newsStories).where(eq(s.newsStories.id, id)).limit(1);
  if (!row) throw new Error("Story not found.");
  const now = new Date();
  const n = note?.trim() || null;
  const decided = { reviewerNote: n ?? row.reviewerNote, decidedAt: now, decidedByUserId: staffUserId, updatedAt: now };

  if (decision === "approve" || decision === "publish") {
    if (!["draft", "approved"].includes(row.status)) throw new Error("Only a draft or buffered story can be approved.");
    const problems = storyProblems({ ...row, numbers: storyNumbers(row), sources: storySources(row) });
    if (problems.length) throw new Error(`Fix before approving: ${problems.join(" ")}`);
    await db.update(s.newsStories).set({ ...decided, status: "approved" }).where(eq(s.newsStories.id, id));
    if (decision === "publish") await markPublished({ ...row, status: "approved" }, staffUserId, now, "staff");
    else await audit({ actorUserId: staffUserId, actorRole: "staff", action: "news.approved", entityType: "news_story", entityId: id, before: { status: row.status } });
  } else if (decision === "reject" || decision === "withdraw") {
    if (!n) throw new Error("Give a reason — it is kept in the audit log.");
    if (decision === "reject" && !["draft", "approved"].includes(row.status)) throw new Error("Only a draft or buffered story can be rejected; withdraw a live one.");
    if (decision === "withdraw" && row.status !== "published") throw new Error("Only a live story can be withdrawn.");
    await db.update(s.newsStories).set({ ...decided, status: decision === "reject" ? "rejected" : "withdrawn" }).where(eq(s.newsStories.id, id));
    await audit({ actorUserId: staffUserId, actorRole: "staff", action: `news.${decision}`, entityType: "news_story", entityId: id, before: { status: row.status }, reason: n });
  } else {
    if (row.status !== "rejected") throw new Error("Only a rejected story can be restored.");
    await db.update(s.newsStories).set({ ...decided, status: "draft" }).where(eq(s.newsStories.id, id));
    await audit({ actorUserId: staffUserId, actorRole: "staff", action: "news.restored", entityType: "news_story", entityId: id });
  }
  const [after] = await db.select().from(s.newsStories).where(eq(s.newsStories.id, id)).limit(1);
  return after;
}

export interface StoryEdit {
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
  /** Required when editing a live story: printed on the page as a dated correction. */
  correction?: string;
}

/**
 * Staff edit. The newsroom's copy is ours, so staff may edit it (unlike a
 * doctor's article). A substantive edit to a live story must carry a
 * correction note, which the page shows with its date.
 */
export async function editStory(id: string, e: StoryEdit, staffUserId: string): Promise<StoryRow> {
  const db = getDb();
  const [row] = await db.select().from(s.newsStories).where(eq(s.newsStories.id, id)).limit(1);
  if (!row) throw new Error("Story not found.");
  const clean = {
    headline: e.headline.replace(/\s+/g, " ").trim(),
    dek: e.dek.replace(/\s+/g, " ").trim(),
    highlights: e.highlights.map((h) => h.replace(/\s+/g, " ").trim()).filter(Boolean),
    whyItMatters: e.whyItMatters.replace(/\s+/g, " ").trim(),
    body: e.body.replace(/\r\n?/g, "\n").trim(),
    numbers: e.numbers.filter((x) => x.value.trim() && x.label.trim()),
    category: e.category,
    subjectName: e.subjectName.trim(),
    subjectRole: e.subjectRole.trim(),
    place: e.place.trim(),
  };
  const problems = storyProblems({ ...clean, sources: storySources(row) });
  if (problems.length && row.status !== "draft") throw new Error(problems.join(" "));
  const now = new Date();
  const live = row.status === "published";
  if (live && !e.correction?.trim()) throw new Error("This story is live. Say what changed in the correction note — it is shown on the page.");
  // Once live, the URL never changes.
  const slug = row.publishedAt ? row.slug : await uniqueSlug(newsSlug(clean.headline), row.id);
  await db
    .update(s.newsStories)
    .set({ ...clean, slug, updatedAt: now, ...(live ? { correction: e.correction!.trim(), correctedAt: now } : {}) })
    .where(eq(s.newsStories.id, id));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: live ? "news.corrected" : "news.edited", entityType: "news_story", entityId: id, before: { headline: row.headline }, after: { headline: clean.headline }, reason: e.correction ?? null });
  const [after] = await db.select().from(s.newsStories).where(eq(s.newsStories.id, id)).limit(1);
  return after;
}

/** A free slug: the base, or base-2, base-3 … */
export async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  const rows = await getDb()
    .select({ id: s.newsStories.id, slug: s.newsStories.slug })
    .from(s.newsStories)
    .where(sql`${s.newsStories.slug} = ${base} or ${s.newsStories.slug} like ${`${base}-%`}`);
  const taken = new Set(rows.filter((r) => r.id !== exceptId).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

/* ------------------------------------------------------------------------- */
/* Creating stories (pipeline and staff)                                     */
/* ------------------------------------------------------------------------- */

export interface NewStory {
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
  abroad: boolean;
  specialtyKey: string | null;
  sources: NewsSource[];
  fingerprint: string;
  eventDate: string | null;
  origin: "pipeline" | "staff";
  doctors: Array<{ doctorId: string; primary: boolean; matchedBy: string }>;
  claims: { ok: boolean; checked: number; unsupported: string[] } | null;
}

/**
 * Store a story. The auto gate decides draft (a human reads it) or approved
 * (it waits for a slot). A fingerprint already on file returns null: the
 * event is covered, and its sources are merged into the existing story.
 */
export async function createStory(n: NewStory): Promise<{ row: StoryRow; gate: ReturnType<typeof autoGate> } | null> {
  const db = getDb();
  const [dupe] = await db.select().from(s.newsStories).where(eq(s.newsStories.fingerprint, n.fingerprint)).limit(1);
  if (dupe) {
    const have = new Set(storySources(dupe).map((x) => x.url));
    const extra = n.sources.filter((x) => !have.has(x.url));
    if (extra.length) await db.update(s.newsStories).set({ sources: [...storySources(dupe), ...extra], updatedAt: new Date() }).where(eq(s.newsStories.id, dupe.id));
    return null;
  }
  const problems = storyProblems(n);
  const gate = autoGate({ sources: n.sources, matchedDoctor: n.doctors.some((d) => d.primary), claimsOk: n.claims?.ok ?? false, problems });
  const slug = await uniqueSlug(newsSlug(n.headline));
  const [row] = await db
    .insert(s.newsStories)
    .values({
      slug,
      headline: n.headline,
      dek: n.dek,
      highlights: n.highlights,
      whyItMatters: n.whyItMatters,
      body: n.body,
      numbers: n.numbers,
      category: n.category,
      subjectName: n.subjectName,
      subjectRole: n.subjectRole,
      place: n.place,
      abroad: n.abroad,
      specialtyKey: n.specialtyKey,
      sources: n.sources,
      fingerprint: n.fingerprint,
      eventDate: n.eventDate,
      origin: n.origin,
      status: gate.eligible ? "approved" : "draft",
      autoEligible: gate.eligible,
      gateNotes: gate.notes,
      verification: n.claims,
    })
    .returning();
  if (n.doctors.length) await db.insert(s.newsStoryDoctors).values(n.doctors.map((d) => ({ storyId: row.id, ...d }))).onConflictDoNothing();
  await audit({ actorUserId: null, actorRole: "system", action: gate.eligible ? "news.drafted.auto_approved" : "news.drafted", entityType: "news_story", entityId: row.id, after: { slug, gate: gate.notes } });
  return { row, gate };
}

/** Link or unlink a TDi profile to a story (staff). */
export async function linkDoctor(storyId: string, doctorId: string, primary: boolean, staffUserId: string): Promise<void> {
  await getDb().insert(s.newsStoryDoctors).values({ storyId, doctorId, primary, matchedBy: "staff" }).onConflictDoUpdate({ target: [s.newsStoryDoctors.storyId, s.newsStoryDoctors.doctorId], set: { primary, matchedBy: "staff" } });
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "news.doctor_linked", entityType: "news_story", entityId: storyId, after: { doctorId, primary } });
}
export async function unlinkDoctor(storyId: string, doctorId: string, staffUserId: string): Promise<void> {
  await getDb().delete(s.newsStoryDoctors).where(and(eq(s.newsStoryDoctors.storyId, storyId), eq(s.newsStoryDoctors.doctorId, doctorId)));
  await audit({ actorUserId: staffUserId, actorRole: "staff", action: "news.doctor_unlinked", entityType: "news_story", entityId: storyId, after: { doctorId } });
}

/** Everything for the sitemaps: live stories with their dates. */
export async function listStoriesForSitemap() {
  return getDb()
    .select({ slug: s.newsStories.slug, headline: s.newsStories.headline, publishedAt: s.newsStories.publishedAt, updatedAt: s.newsStories.updatedAt, correctedAt: s.newsStories.correctedAt })
    .from(s.newsStories)
    .where(and(isLive, isNotNull(s.newsStories.publishedAt)))
    .orderBy(desc(s.newsStories.publishedAt));
}
