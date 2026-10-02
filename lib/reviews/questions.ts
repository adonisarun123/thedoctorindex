import "server-only";

import { and, asc, eq, isNull, or } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import type { ReviewQuestion } from "@/lib/reviews/score";

/** Core questions plus this speciality's, active only, in display order. */
export async function questionsForSpecialty(specialtyKey: string): Promise<ReviewQuestion[]> {
  return getDb()
    .select({ key: s.reviewQuestions.key, label: s.reviewQuestions.label, help: s.reviewQuestions.help, specialtyKey: s.reviewQuestions.specialtyKey })
    .from(s.reviewQuestions)
    .where(and(eq(s.reviewQuestions.active, true), or(isNull(s.reviewQuestions.specialtyKey), eq(s.reviewQuestions.specialtyKey, specialtyKey))))
    .orderBy(asc(s.reviewQuestions.sort), asc(s.reviewQuestions.key));
}

/** Every question ever asked, retired ones included, so old ratings keep their labels. */
export async function questionLabels(): Promise<Map<string, { label: string; sort: number }>> {
  const rows = await getDb().select({ key: s.reviewQuestions.key, label: s.reviewQuestions.label, sort: s.reviewQuestions.sort }).from(s.reviewQuestions);
  return new Map(rows.map((r) => [r.key, { label: r.label, sort: r.sort }]));
}

export async function listAllQuestions() {
  return getDb().select().from(s.reviewQuestions).orderBy(asc(s.reviewQuestions.specialtyKey), asc(s.reviewQuestions.sort), asc(s.reviewQuestions.key));
}

export async function saveQuestion(input: { key: string; label: string; help: string; specialtyKey: string | null; sort: number; active: boolean }) {
  const key = input.key.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9.\-_]{1,60}$/.test(key)) throw new Error("Key: lowercase letters, digits, dot, dash or underscore.");
  if (!input.label.trim()) throw new Error("A question needs a label.");
  await getDb()
    .insert(s.reviewQuestions)
    .values({ key, label: input.label.trim(), help: input.help.trim(), specialtyKey: input.specialtyKey || null, sort: input.sort, active: input.active })
    // A key's meaning is fixed once ratings exist, so only wording, order and active state change.
    .onConflictDoUpdate({ target: s.reviewQuestions.key, set: { label: input.label.trim(), help: input.help.trim(), sort: input.sort, active: input.active } });
}
