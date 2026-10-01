import { blockStrings, type Block, type Faq } from "@/lib/blog/types";
import { hrefs, words } from "@/lib/content/text";
import type { SpecialtyKey } from "@/lib/types";

/**
 * An original condition article: TDI's own copy for one condition slug,
 * written for a reader in India, stored as data so it can be measured and
 * tested like the blog (lib/blog/types.ts supplies the block model).
 *
 * The compiled draft for the same slug stays in the database as the research
 * source; once an article exists the page renders the article instead and
 * lists the draft's sources it drew on.
 */

export interface ClinicalReviewer {
  /** As registered, e.g. "Dr Ananya Rao". */
  name: string;
  /** Highest relevant qualification, e.g. "MD (General Medicine)". */
  qualification: string;
  /** Council and number exactly as on the register. */
  council: string;
  registration: string;
  /** Their profile on the directory, when they have one. */
  doctorSlug?: string;
}

export interface ConditionArticle {
  /** Must equal a slug in the `conditions` table. */
  slug: string;
  /** H1. */
  title: string;
  /** Title tag when the H1 reads badly in a result. */
  metaTitle?: string;
  /** Under the H1 and the meta description: ≤155 characters. */
  standfirst: string;
  /** The query this article is written to answer. Recorded, never rendered. */
  targetQuery: string;
  /** Department slug (lib/conditions/departments.ts) — must match the draft's. */
  department: string;
  /** Speciality the reader is routed to. */
  specialty: SpecialtyKey;
  /** Other specialities that commonly share care, linked under the main CTA. */
  alsoSee?: SpecialtyKey[];
  author: string;
  /** "01 Oct 2026" */
  writtenOn: string;
  updatedOn: string;
  /**
   * Null until a named registered doctor has read and signed off this exact
   * text. Never fill this with a role, a placeholder or "on file".
   */
  reviewer: ClinicalReviewer | null;
  /** "" until reviewed. A date without a reviewer is rejected by the tests. */
  reviewedOn: string;
  /** Named symptoms the body discusses; emitted as signOrSymptom. */
  symptoms: string[];
  /** Named tests the body discusses; emitted as typicalTest. */
  tests: string[];
  /** Named treatment approaches the body discusses; emitted as possibleTreatment. */
  treatments: string[];
  body: Block[];
  faqs: Faq[];
  /** External references actually used. */
  sources: Array<{ label: string; url: string }>;
}

export function articleStrings(a: ConditionArticle): string[] {
  return [...a.body.flatMap(blockStrings), ...a.faqs.flatMap((f) => [f.q, f.a])];
}

export function articleWordCount(a: ConditionArticle): number {
  return articleStrings(a).reduce((n, s) => n + words(s), 0);
}

export function articleLinks(a: ConditionArticle): string[] {
  return articleStrings(a).flatMap(hrefs);
}
