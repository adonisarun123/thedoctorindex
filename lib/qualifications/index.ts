import { BRANCHES } from "@/lib/qualifications/entries/branches";
import { DIPLOMAS } from "@/lib/qualifications/entries/diplomas";
import { MODERN_DEGREES } from "@/lib/qualifications/entries/modern";
import { OTHER_QUALIFICATIONS } from "@/lib/qualifications/entries/other";
import { normalizeDegree, type QualificationEntry, type QualificationKind } from "@/lib/qualifications/types";

export * from "@/lib/qualifications/types";

/** Every qualification page, in hub order. */
export const QUALIFICATIONS: QualificationEntry[] = [...MODERN_DEGREES, ...BRANCHES, ...DIPLOMAS, ...OTHER_QUALIFICATIONS];

export const QUALIFICATION_GROUPS: Array<{ kind: QualificationKind; name: string; blurb: string }> = [
  { kind: "primary", name: "Primary degrees", blurb: "The degree that puts someone on a register and licenses practice of a system of medicine. One per system." },
  { kind: "postgraduate", name: "Postgraduate degrees", blurb: "Three years after the primary degree; what makes a specialist. The branch in brackets is the speciality." },
  { kind: "superspecialty", name: "Super-speciality degrees", blurb: "Three more years after a postgraduate degree; the cardiologist, the neurosurgeon, the urologist." },
  { kind: "diploma", name: "Postgraduate diplomas", blurb: "Two years after the primary degree in one branch. A recognised specialist qualification, shorter than the degree." },
  { kind: "fellowship", name: "Fellowships and memberships by examination", blurb: "Examined qualifications awarded by a college or board rather than a university. Recognised, or at least earned." },
  { kind: "membership", name: "Memberships and society fellowships", blurb: "Letters on a letterhead that record membership of a body. Some are examined; most are not. None replaces a degree." },
  { kind: "doctorate", name: "Research doctorates", blurb: "The PhD: research training, not a clinical qualification." },
];

const BY_SLUG = new Map(QUALIFICATIONS.map((q) => [q.slug, q]));
/** Compiled once; branch pages come first so the most specific page wins. */
const MATCHERS: Array<{ re: RegExp; entry: QualificationEntry }> = [
  ...BRANCHES.map((entry) => ({ re: new RegExp(entry.pattern), entry })),
  ...QUALIFICATIONS.filter((q) => !q.parent).map((entry) => ({ re: new RegExp(entry.pattern), entry })),
];

export function qualificationBySlug(slug: string): QualificationEntry | null {
  return BY_SLUG.get(slug) ?? null;
}

/** The page for a degree string as written on a profile, if one exists. Branch pages win over their parent. */
export function qualificationForDegree(degree: string | null | undefined): QualificationEntry | null {
  if (!degree) return null;
  const norm = normalizeDegree(degree);
  if (!norm) return null;
  return MATCHERS.find((m) => m.re.test(norm))?.entry ?? null;
}

export function qualificationsOf(kind: QualificationKind): QualificationEntry[] {
  return QUALIFICATIONS.filter((q) => q.kind === kind && !q.parent);
}

/** Branches of a base degree. */
export function branchesOf(slug: string): QualificationEntry[] {
  return QUALIFICATIONS.filter((q) => q.parent === slug);
}

export function relatedQualifications(q: QualificationEntry, count = 3): QualificationEntry[] {
  const out: QualificationEntry[] = [];
  const add = (x: QualificationEntry | null) => {
    if (x && x.slug !== q.slug && !out.some((y) => y.slug === x.slug)) out.push(x);
  };
  (q.related ?? []).forEach((s) => add(qualificationBySlug(s)));
  if (q.parent) add(qualificationBySlug(q.parent));
  QUALIFICATIONS.filter((x) => x.kind === q.kind && x.system === q.system).forEach(add);
  QUALIFICATIONS.forEach(add);
  return out.slice(0, count);
}
