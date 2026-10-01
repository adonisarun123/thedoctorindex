import type { SpecialtyKey } from "@/lib/types";

/**
 * Condition library content model.
 *
 * Two layers, deliberately kept apart:
 *
 *   draft    — a compiled source draft (MedlinePlus / Orphanet / HPO) stored
 *              in the `conditions` table. Attributed, unreviewed, rendered
 *              noindex. Text is shown as plain text, never through the inline
 *              link syntax, because it is third-party copy.
 *   article  — an original TDI article for the same slug, written for India,
 *              held as data in lib/conditions/articles. Only an article with a
 *              named clinician sign-off can make a condition indexable.
 */

export type DraftBlock = { k: "p"; text: string } | { k: "ul"; items: string[] };

/** One HPO-defined clinical term reported for the condition. */
export interface DraftTerm {
  term: string;
  /** Orphanet frequency label, e.g. "Very frequent (99-80%)". */
  frequency: string | null;
  definition: string | null;
}

export interface DraftSection {
  heading: string;
  /** `source` = attributed third-party text; `orientation` = TDI's shared consultation copy. */
  kind: "source" | "orientation";
  sourceIds: string[];
  blocks: DraftBlock[];
  /** Present on the clinical-features section: the term list under it. */
  terms?: DraftTerm[];
}

export interface DraftSource {
  id: string;
  label: string;
  url: string;
  rights: string;
  version: string | null;
  retrievedOn: string | null;
}

/** The row a page renders, as read from the database. */
export interface ConditionDraft {
  slug: string;
  sourceId: string;
  name: string;
  otherNames: string[];
  department: string;
  departmentSlug: string;
  specialtyKey: SpecialtyKey | null;
  clinicianLabel: string;
  additionalDepartments: string | null;
  scope: string;
  sourceCollection: string;
  orphaCode: string | null;
  metaDescription: string;
  sections: DraftSection[];
  sources: DraftSource[];
  attribution: string;
  hpoCitation: string | null;
  reviewFlags: string[];
  sourceGaps: string[];
  wordCount: number;
  uniqueWordCount: number;
  compiledOn: string;
  updatedAt: string;
}

/** Index row for hubs and A–Z lists. */
export interface ConditionSummary {
  slug: string;
  name: string;
  department: string;
  departmentSlug: string;
  specialtyKey: SpecialtyKey | null;
}
