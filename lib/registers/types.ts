import type { CouncilKind } from "@/lib/data/councils";
import type { Block, Faq } from "@/lib/blog/types";
import { hrefs, words } from "@/lib/content/text";

/**
 * The register pages: one page per council or registering body a profile on
 * this site can cite (/registers/<slug>).
 *
 * Why these exist. A patient who wants to check a doctor has to know two
 * things — which body issued the number and where that body's register is
 * searched. Both are scattered across 30-odd council sites of varying age.
 * Each page here states, for one body, what it registers, where its public
 * search is (only where we saw one), what the numbers on this site look like
 * for it (measured, not asserted), and how many profiles here cite it and how
 * many of those have been checked against a register.
 *
 * The prose is data, not JSX, for the same reason the blog is: length, links
 * and questions are computable, so tests/unit/registers.test.ts can hold every
 * entry to a floor and check that every internal link resolves.
 *
 * Facts about a body (address, website, statute) carry `checkedOn`: the date
 * they were read from the source named in `sources`. A field we could not
 * verify is left out, never guessed — a wrong register URL sends a patient to
 * the wrong place, which is worse than no URL.
 */

export interface RegisterSource {
  label: string;
  url: string;
}

export type Profession =
  | "doctors"
  | "dentists"
  | "AYUSH practitioners"
  | "allied health professionals"
  | "physiotherapists"
  | "rehabilitation professionals";

export interface RegisterEntry {
  slug: string;
  /** Full name as the body styles itself. */
  name: string;
  /** Common abbreviation, if one is in use (KMC, MPMC). */
  short?: string;
  kind: CouncilKind;
  /** Which profession's registrations this body issues — used in copy. */
  profession: Profession;
  /** State the body serves, when it is a state body; links to /doctors/<stateSlug>. */
  state?: { name: string; slug: string };
  /** Office location as listed by the source in `sources`. */
  office?: string;
  /** Official website, as listed by the source. Never inferred. */
  website?: string;
  /** Public register search page on the body's own site, only when we opened it. */
  search?: { url: string; note: string };
  /** Whether the NMC Indian Medical Register is the right place to look up this body's numbers. */
  onNmcRegister: boolean;
  /**
   * Council strings as stored on profiles here, normalised the way
   * medical_registrations.council_normalized is (upper-case, alphanumerics
   * only). Every spelling seen in the data that means this body.
   */
  match: string[];
  /** One-sentence summary, also the meta description (keep under 155). */
  standfirst: string;
  body: Block[];
  faqs: Faq[];
  /** Date the facts above were read from the sources. */
  checkedOn: string;
  sources: RegisterSource[];
  /** Slugs of two or three related registers. */
  related?: string[];
}

export function registerStrings(r: RegisterEntry): string[] {
  const blocks = r.body.flatMap((b): string[] => {
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
  return [r.name, r.standfirst, ...blocks, ...r.faqs.flatMap((f) => [f.q, f.a])].filter(Boolean);
}

export function registerWordCount(r: RegisterEntry): number {
  return registerStrings(r).reduce((n, s) => n + words(s), 0);
}

export function registerLinks(r: RegisterEntry): string[] {
  return [...new Set(registerStrings(r).flatMap(hrefs))];
}

/** Upper-case alphanumerics only — the same rule as `council_normalized` in the database. */
export function normalizeCouncil(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * "a" or "an" before a name, by sound. Initialisms are read letter by letter,
 * so "an RCI registration" and "an MPMC number" but "a KMC number"; words go
 * by their first letter, with the "yoo" sound treated as a consonant.
 */
export function article(name: string): "a" | "an" {
  const first = name.trim()[0]?.toUpperCase() ?? "";
  const initialism = /^[A-Z]{2,6}\b/.test(name.trim());
  if (initialism) return "AEFHILMNORSX".includes(first) ? "an" : "a";
  if (/^(uni|use|eu|one)/i.test(name.trim())) return "a";
  return "AEIOU".includes(first) ? "an" : "a";
}

/** "a KMC" / "an RCI" / "an Assam Medical Council" — the name with its article. */
export function withArticle(name: string): string {
  return `${article(name)} ${name}`;
}
