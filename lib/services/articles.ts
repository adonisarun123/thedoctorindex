import "server-only";

import { and, desc, eq, isNotNull, isNull, ne, or } from "drizzle-orm";

import { type ArticleInput, articleProblems, normaliseSlug, normaliseSourceUrl } from "@/lib/articles/format";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { SUPERLATIVE } from "@/lib/services/doctors";

/**
 * Doctor articles (see the doctorArticles table for the rules).
 *
 * Lifecycle:  draft → submitted → published | rejected
 *             published → withdrawn (by the doctor)
 *             published + edit → revision held; live text unchanged until approved
 *
 * The registration printed on an article is copied from the doctor's primary,
 * register-checked registration at the moment staff approve it.
 */

export type ArticleRow = typeof s.doctorArticles.$inferSelect;
export interface ArticleRevision {
  title: string;
  description: string;
  body: string;
  sourceUrl: string | null;
}

export interface Eligibility {
  ok: boolean;
  reason?: string;
  council?: string;
  number?: string;
}

/**
 * May this user publish under this doctor's name? Claimed by them, profile
 * published, and a primary registration that has been checked against the
 * register. Evaluated on every write and again at approval.
 */
export async function authorEligibility(doctorId: string, userId: string | null): Promise<Eligibility> {
  const db = getDb();
  const [d] = await db
    .select({ status: s.doctors.status, claimed: s.doctors.claimed, owner: s.doctors.claimedByUserId })
    .from(s.doctors)
    .where(eq(s.doctors.id, doctorId))
    .limit(1);
  if (!d) return { ok: false, reason: "Profile not found." };
  if (!d.claimed || !d.owner) return { ok: false, reason: "Claim your profile first. Articles are published only under a claimed profile." };
  if (userId && d.owner !== userId) return { ok: false, reason: "Only the doctor who claimed this profile can publish articles under it." };
  if (d.status !== "published") return { ok: false, reason: "Your profile must be live before you can publish articles." };
  const [reg] = await db
    .select({ council: s.medicalRegistrations.council, number: s.medicalRegistrations.number })
    .from(s.medicalRegistrations)
    .where(and(eq(s.medicalRegistrations.doctorId, doctorId), eq(s.medicalRegistrations.isPrimary, true), isNotNull(s.medicalRegistrations.checkedOn)))
    .limit(1);
  if (!reg) return { ok: false, reason: "Your registration number has not yet been checked against the register. Articles open once it has — see Verification & changes." };
  return { ok: true, council: reg.council, number: reg.number };
}

async function requireEligible(doctorId: string, userId: string): Promise<Eligibility> {
  const e = await authorEligibility(doctorId, userId);
  if (!e.ok) throw new Error(e.reason);
  return e;
}

function clean(raw: ArticleInput): ArticleInput {
  return {
    slug: normaliseSlug(raw.slug || raw.title),
    title: raw.title.replace(/\s+/g, " ").trim(),
    description: raw.description.replace(/\s+/g, " ").trim(),
    body: raw.body.replace(/\r\n?/g, "\n").trim(),
    sourceUrl: normaliseSourceUrl(raw.sourceUrl),
  };
}

function check(a: ArticleInput, forSubmit: boolean) {
  const problems = articleProblems(a, { forSubmit });
  if (SUPERLATIVE.test(a.title) || SUPERLATIVE.test(a.description)) {
    problems.push("Superlatives such as “best” or “top” are not allowed in the title or description.");
  }
  if (problems.length) throw new Error(problems.join(" "));
}

async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const where = exceptId ? and(eq(s.doctorArticles.slug, slug), ne(s.doctorArticles.id, exceptId)) : eq(s.doctorArticles.slug, slug);
  const rows = await getDb().select({ id: s.doctorArticles.id }).from(s.doctorArticles).where(where).limit(1);
  return rows.length > 0;
}

export async function listArticlesForDoctor(doctorId: string): Promise<ArticleRow[]> {
  return getDb().select().from(s.doctorArticles).where(eq(s.doctorArticles.doctorId, doctorId)).orderBy(desc(s.doctorArticles.updatedAt));
}

export async function getArticleForDoctor(id: string, doctorId: string): Promise<ArticleRow | null> {
  const [row] = await getDb()
    .select()
    .from(s.doctorArticles)
    .where(and(eq(s.doctorArticles.id, id), eq(s.doctorArticles.doctorId, doctorId)))
    .limit(1);
  return row ?? null;
}

/**
 * Create or update an article. `submit` sends it (or, for a published
 * article, the edit) to the review queue; otherwise it is saved privately.
 */
export async function saveArticle(
  who: { doctorId: string; userId: string },
  id: string | null,
  raw: ArticleInput,
  submit: boolean,
): Promise<{ id: string; status: string; revision: boolean }> {
  await requireEligible(who.doctorId, who.userId);
  const db = getDb();
  const now = new Date();
  const existing = id ? await getArticleForDoctor(id, who.doctorId) : null;
  if (id && !existing) throw new Error("Article not found.");

  // The URL of a published article is fixed: changing it would break every link to it.
  const a = clean(existing && existing.publishedAt ? { ...raw, slug: existing.slug } : raw);
  check(a, submit);
  if (await slugTaken(a.slug, existing?.id)) throw new Error(`The URL /articles/${a.slug} is already taken. Choose another.`);

  if (existing && existing.status === "published") {
    const revision: ArticleRevision = { title: a.title, description: a.description, body: a.body, sourceUrl: a.sourceUrl };
    await db
      .update(s.doctorArticles)
      .set({ revision, revisionSubmittedAt: submit ? now : null, updatedAt: now })
      .where(eq(s.doctorArticles.id, existing.id));
    await audit({ actorUserId: who.userId, actorRole: "doctor", action: submit ? "article.revision_submitted" : "article.revision_saved", entityType: "doctor_article", entityId: existing.id, after: { title: a.title } });
    return { id: existing.id, status: "published", revision: true };
  }

  const status = submit ? "submitted" : "draft";
  if (existing) {
    await db
      .update(s.doctorArticles)
      .set({ ...a, status, submittedAt: submit ? now : existing.submittedAt, updatedAt: now })
      .where(eq(s.doctorArticles.id, existing.id));
    await audit({ actorUserId: who.userId, actorRole: "doctor", action: submit ? "article.submitted" : "article.saved", entityType: "doctor_article", entityId: existing.id, before: { status: existing.status }, after: { status, slug: a.slug } });
    return { id: existing.id, status, revision: false };
  }
  const [row] = await db
    .insert(s.doctorArticles)
    .values({ ...a, doctorId: who.doctorId, authorUserId: who.userId, status, submittedAt: submit ? now : null })
    .returning({ id: s.doctorArticles.id });
  await audit({ actorUserId: who.userId, actorRole: "doctor", action: submit ? "article.submitted" : "article.created", entityType: "doctor_article", entityId: row.id, after: { status, slug: a.slug } });
  return { id: row.id, status, revision: false };
}

/** Doctor takes an article down (published → withdrawn) or back from review (submitted → draft), or drops a pending edit. */
export async function withdrawArticle(who: { doctorId: string; userId: string }, id: string, what: "article" | "revision"): Promise<ArticleRow> {
  const existing = await getArticleForDoctor(id, who.doctorId);
  if (!existing) throw new Error("Article not found.");
  const now = new Date();
  let patch: Partial<ArticleRow>;
  if (what === "revision") patch = { revision: null, revisionSubmittedAt: null };
  else if (existing.status === "published") patch = { status: "withdrawn", revision: null, revisionSubmittedAt: null };
  else if (existing.status === "submitted") patch = { status: "draft" };
  else throw new Error("Only a submitted or published article can be withdrawn.");
  await getDb().update(s.doctorArticles).set({ ...patch, updatedAt: now }).where(eq(s.doctorArticles.id, id));
  await audit({ actorUserId: who.userId, actorRole: "doctor", action: what === "revision" ? "article.revision_discarded" : "article.withdrawn", entityType: "doctor_article", entityId: id, before: { status: existing.status } });
  return { ...existing, ...patch } as ArticleRow;
}

/** Delete a draft that was never published. Published history is kept (withdraw instead). */
export async function deleteDraftArticle(who: { doctorId: string; userId: string }, id: string): Promise<void> {
  const existing = await getArticleForDoctor(id, who.doctorId);
  if (!existing) throw new Error("Article not found.");
  if (existing.publishedAt) throw new Error("A published article cannot be deleted. Withdraw it instead.");
  await getDb().delete(s.doctorArticles).where(eq(s.doctorArticles.id, id));
  await audit({ actorUserId: who.userId, actorRole: "doctor", action: "article.deleted", entityType: "doctor_article", entityId: id, before: { slug: existing.slug, status: existing.status } });
}

/* ------------------------------------------------------------------------- */
/* Staff                                                                     */
/* ------------------------------------------------------------------------- */

/** Articles waiting for a decision: new submissions and submitted edits to live ones. */
export async function listArticleQueue(all = false) {
  return getDb().query.doctorArticles.findMany({
    where: all ? undefined : or(eq(s.doctorArticles.status, "submitted"), isNotNull(s.doctorArticles.revisionSubmittedAt)),
    with: { doctor: true, author: true },
    orderBy: [desc(s.doctorArticles.updatedAt)],
    limit: 150,
  });
}

/**
 * Approve or reject. Staff do not edit the text: approval publishes exactly
 * what the doctor submitted; rejection returns it with a note.
 */
export async function decideArticle(id: string, decision: "published" | "rejected", staffUserId: string, note?: string): Promise<ArticleRow> {
  const db = getDb();
  const [row] = await db.select().from(s.doctorArticles).where(eq(s.doctorArticles.id, id)).limit(1);
  if (!row) throw new Error("Article not found.");
  const isRevision = row.status === "published" && row.revisionSubmittedAt !== null;
  if (row.status !== "submitted" && !isRevision) throw new Error("This article is not waiting for a decision.");
  if (decision === "rejected" && !note?.trim()) throw new Error("Give the doctor a reason so they can fix it.");
  const now = new Date();
  const decided = { reviewerNote: note?.trim() || null, decidedAt: now, decidedByUserId: staffUserId, updatedAt: now };

  let patch: Partial<ArticleRow>;
  if (decision === "rejected") {
    // A rejected edit stays saved for the doctor to fix; the live version is untouched.
    patch = isRevision ? { ...decided, revisionSubmittedAt: null } : { ...decided, status: "rejected" };
  } else {
    const e = await authorEligibility(row.doctorId, null);
    if (!e.ok) throw new Error(`Cannot publish: ${e.reason}`);
    const reg = { registrationCouncil: e.council!, registrationNumber: e.number! };
    if (isRevision) {
      const r = row.revision as ArticleRevision;
      patch = { ...decided, ...reg, title: r.title, description: r.description, body: r.body, sourceUrl: r.sourceUrl, revision: null, revisionSubmittedAt: null };
    } else {
      patch = { ...decided, ...reg, status: "published", publishedAt: row.publishedAt ?? now };
    }
  }
  await db.update(s.doctorArticles).set(patch).where(eq(s.doctorArticles.id, id));
  await audit({
    actorUserId: staffUserId,
    actorRole: "staff",
    action: `article.${isRevision ? "revision_" : ""}${decision === "published" ? "approved" : "rejected"}`,
    entityType: "doctor_article",
    entityId: id,
    before: { status: row.status },
    after: { status: patch.status ?? row.status, registration: patch.registrationNumber ?? row.registrationNumber },
    reason: note ?? null,
  });
  return { ...row, ...patch } as ArticleRow;
}

/* ------------------------------------------------------------------------- */
/* Public reads                                                              */
/* ------------------------------------------------------------------------- */

const live = and(eq(s.doctorArticles.status, "published"), eq(s.doctors.status, "published"));

/** A published article and its doctor, or null (unknown slug, withdrawn, or the doctor's profile is not live). */
export async function getPublishedArticle(slug: string) {
  const [row] = await getDb()
    .select({ article: s.doctorArticles, doctorSlug: s.doctors.slug, doctorName: s.doctors.name, specialty: s.doctors.specialtyKey })
    .from(s.doctorArticles)
    .innerJoin(s.doctors, eq(s.doctors.id, s.doctorArticles.doctorId))
    .where(and(eq(s.doctorArticles.slug, slug), live))
    .limit(1);
  return row ?? null;
}

export async function listPublishedArticles(opts: { doctorId?: string; limit?: number } = {}) {
  return getDb()
    .select({
      slug: s.doctorArticles.slug,
      title: s.doctorArticles.title,
      description: s.doctorArticles.description,
      body: s.doctorArticles.body,
      sourceUrl: s.doctorArticles.sourceUrl,
      publishedAt: s.doctorArticles.publishedAt,
      updatedAt: s.doctorArticles.updatedAt,
      decidedAt: s.doctorArticles.decidedAt,
      registrationCouncil: s.doctorArticles.registrationCouncil,
      registrationNumber: s.doctorArticles.registrationNumber,
      doctorId: s.doctors.id,
      doctorName: s.doctors.name,
      doctorSlug: s.doctors.slug,
      specialty: s.doctors.specialtyKey,
    })
    .from(s.doctorArticles)
    .innerJoin(s.doctors, eq(s.doctors.id, s.doctorArticles.doctorId))
    .where(opts.doctorId ? and(live, eq(s.doctorArticles.doctorId, opts.doctorId)) : live)
    .orderBy(desc(s.doctorArticles.publishedAt))
    .limit(opts.limit ?? 500);
}

/** Indexable = published, doctor live, and first published here (no external canonical). */
export async function listIndexableArticles() {
  return getDb()
    .select({ slug: s.doctorArticles.slug, decidedAt: s.doctorArticles.decidedAt, publishedAt: s.doctorArticles.publishedAt })
    .from(s.doctorArticles)
    .innerJoin(s.doctors, eq(s.doctors.id, s.doctorArticles.doctorId))
    .where(and(live, isNull(s.doctorArticles.sourceUrl)))
    .orderBy(desc(s.doctorArticles.publishedAt));
}
