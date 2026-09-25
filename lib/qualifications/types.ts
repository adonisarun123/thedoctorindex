import type { Block, Faq } from "@/lib/blog/types";
import { hrefs, words } from "@/lib/content/text";
import { article } from "@/lib/registers/types";
import type { RegisterSource } from "@/lib/registers/types";
import type { SpecialtyKey } from "@/lib/types";

/**
 * The qualification pages: one page per degree, diploma or fellowship a
 * profile on this site can record (/qualifications/<slug>).
 *
 * A qualification string on a profile — "MBBS, MD (Medicine), FICS" — is
 * three different kinds of claim: a primary degree that licenses practice, a
 * postgraduate degree that makes a specialist, and a fellowship that may be
 * a membership of a society. Patients read them as one string. Each page here
 * says, for one of them, what it is, who awards it, what it qualifies the
 * holder to do, where it is checked, and — measured from the profiles here —
 * how many doctors record it, in which branches, in which specialities and
 * cities. Like the register pages, the prose is data so it is testable.
 */

export type QualificationKind = "primary" | "postgraduate" | "superspecialty" | "diploma" | "fellowship" | "membership" | "doctorate";
export type System = "modern" | "dental" | "ayush" | "allied";

export interface QualificationEntry {
  slug: string;
  /** As written on certificates: MBBS, MD, D.Ortho, FRCS. */
  abbr: string;
  /** Expanded name. */
  name: string;
  kind: QualificationKind;
  system: System;
  /** Who awards it — universities, NBEMS, a Royal College, a society. */
  awardedBy: string;
  /** Length of the course, where it is fixed. */
  duration?: string;
  /** Entry route — NEET-UG, NEET-PG, NEET-SS, an examination, a nomination. */
  entry?: string;
  /** Register page for the body holders register with. */
  registerSlug: string;
  /** Postgres regex on the normalised degree string (upper-case alphanumerics and parentheses). */
  pattern: string;
  /** For a branch page (MD General Medicine): the base degree's slug. */
  parent?: string;
  /** For a branch page: the speciality its holders practise. */
  specialty?: SpecialtyKey;
  /** One sentence, ≤155 characters — the meta description. */
  standfirst: string;
  body: Block[];
  faqs: Faq[];
  checkedOn: string;
  sources: RegisterSource[];
  related?: string[];
}

export function qualificationStrings(q: QualificationEntry): string[] {
  const blocks = q.body.flatMap((b): string[] => {
    switch (b.k) {
      case "p":
      case "h2":
      case "h3":
        return [b.text];
      case "ul":
      case "ol":
        return b.items;
      case "note":
        return [b.title ?? "", b.text];
      case "quote":
        return [b.text, b.source ?? ""];
      case "steps":
        return b.items.flatMap((s) => [s.title, s.text]);
      case "table":
        return [b.caption ?? "", ...b.head, ...b.rows.flat()];
    }
  });
  return [q.name, q.standfirst, ...blocks, ...q.faqs.flatMap((f) => [f.q, f.a])].filter(Boolean);
}

export function qualificationWordCount(q: QualificationEntry): number {
  return qualificationStrings(q).reduce((n, s) => n + words(s), 0);
}

export function qualificationLinks(q: QualificationEntry): string[] {
  return [...new Set(qualificationStrings(q).flatMap(hrefs))];
}

/** The same normalisation the database query applies before matching `pattern`. */
export function normalizeDegree(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9()]/g, "");
}

export { article };

/** "an MBBS", "a DNB", "an FRCS" — abbreviation with its article. */
export function abbrWithArticle(abbr: string): string {
  return `${article(abbr)} ${abbr}`;
}

/** Branch labels arrive as written on certificates; make "PSYCHIATRY" and "gynaecology" read alike. */
export function tidyBranch(label: string): string {
  return label
    .split(/\s+/)
    .map((w) => (w.length <= 3 && w === w.toUpperCase() ? w : w[0]?.toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of");
}
