import type { DraftBlock, DraftSection, DraftSource, DraftTerm } from "@/lib/conditions/types";

/**
 * Turns one compiled draft (the TDI_2500 import JSON) into the stored shape.
 *
 * Pure and dependency-free so tests can run it on fixtures. Each repair it
 * makes is recorded in `notes`, stored on the row as `cleanup_notes`, so an
 * editor can see what the importer changed rather than trust it blindly.
 *
 * Repairs, all measured on the 1 Oct 2026 import:
 *   1. Detached lists (588 sections). The compiler stored a section's
 *      paragraphs and list items separately, so "Each type of cell has a
 *      different job:" printed with its list two paragraphs later. A single
 *      lead-in ending in ':' gets its list back directly under it. Where a
 *      section has two or more lead-ins the split cannot be recovered; the
 *      list stays at the end and the section is noted for an editor.
 *   2. Stray agency bylines (255), e.g. a bare "NIH: National Cancer
 *      Institute" line left over from the source page's footer.
 *   3. US population risk factors stated as race ("Being white"). Correct for
 *      the US cohort the source describes, wrong as advice to a reader in
 *      India. Removed and noted.
 *   4. HPO term sections. Orphanet drafts emitted every clinical term as its
 *      own H2 — up to 60 per page. They are folded into one term list under
 *      the "Reported clinical features" section.
 */

export interface RawSection {
  heading: string;
  paragraphs: string[];
  items: string[] | null;
  source_ids: string[];
  kind: string;
}

export interface RawSource {
  id: string;
  label: string;
  url: string;
  rights: string;
  version: string | null;
  retrieved_on: string | null;
}

export interface RawCondition {
  id: string;
  condition_name: string;
  slug: string;
  meta_description: string;
  department: string;
  doctor: string;
  additional_departments: string | null;
  scope: string;
  other_names: string | null;
  source_collection: string;
  source_gaps: string[];
  review_flags: string[];
  sections: RawSection[];
  sources: RawSource[];
  attribution: string;
  hpo_citation: string | null;
  content_sha256: string;
  compiled_on: string;
  word_count: number;
}

export interface CleanResult {
  sections: DraftSection[];
  sources: DraftSource[];
  otherNames: string[];
  orphaCode: string | null;
  notes: string[];
}

const STRAY_LINE = /^(NIH|National [A-Z][A-Za-z ]+|Centers for Disease Control[A-Za-z ]*|U\.S\. [A-Za-z ]+|Agency for [A-Za-z ]+|Office on [A-Za-z ]+)(:[^.]*)?$/;
const RACE_RISK = /^(Being|Are|Is)\s+(white|black|african[- ]american|hispanic|latino|asian|native american|caucasian)\b/i;
const FREQUENCY = /^Reported frequency:\s*(.+?)\.?$/;
const TERM_HEADS = new Set(["Reported clinical features and what the terms mean", "Understanding terms used in the source"]);

export function tidy(text: string): string {
  return text
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitOtherNames(value: string | null, name: string): string[] {
  if (!value) return [];
  const seen = new Set([name.toLowerCase()]);
  const out: string[] = [];
  for (const part of value.split(/;\s*/)) {
    const t = tidy(part);
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
  }
  return out;
}

export function orphaCodeFrom(sources: RawSource[]): string | null {
  for (const s of sources) {
    const m = /orpha\.net\/[a-z]{2}\/disease\/detail\/(\d+)/.exec(s.url);
    if (m) return m[1];
  }
  return null;
}

function isTermSection(s: RawSection, hpoIds: Set<string>): boolean {
  if (s.kind !== "source" || TERM_HEADS.has(s.heading)) return false;
  if ((s.items ?? []).length > 0 || s.paragraphs.length === 0 || s.paragraphs.length > 2) return false;
  if (s.heading.length > 90) return false;
  return s.source_ids.some((id) => hpoIds.has(id)) || FREQUENCY.test(s.paragraphs[0] ?? "");
}

function toTerm(s: RawSection): DraftTerm {
  let frequency: string | null = null;
  const rest: string[] = [];
  for (const p of s.paragraphs) {
    const m = FREQUENCY.exec(tidy(p));
    if (m && frequency === null) frequency = m[1];
    else rest.push(tidy(p));
  }
  return { term: tidy(s.heading), frequency, definition: rest.join(" ") || null };
}

/** Rebuild one section's block order and apply the line-level repairs. */
export function sectionBlocks(s: RawSection, notes: string[]): DraftBlock[] {
  const paragraphs: string[] = [];
  for (const raw of s.paragraphs) {
    const p = tidy(raw);
    if (!p) continue;
    if (STRAY_LINE.test(p)) {
      notes.push(`Dropped stray source line "${p}" from "${s.heading}"`);
      continue;
    }
    paragraphs.push(p);
  }
  const items: string[] = [];
  for (const raw of s.items ?? []) {
    const i = tidy(raw);
    if (!i) continue;
    if (RACE_RISK.test(i)) {
      notes.push(`Removed US population risk factor "${i}" from "${s.heading}"`);
      continue;
    }
    items.push(i);
  }

  const blocks: DraftBlock[] = paragraphs.map((text) => ({ k: "p", text }));
  if (!items.length) return blocks;

  const leadIns = paragraphs.map((p, i) => (p.endsWith(":") ? i : -1)).filter((i) => i >= 0);
  if (leadIns.length === 1 && leadIns[0] < paragraphs.length - 1) {
    blocks.splice(leadIns[0] + 1, 0, { k: "ul", items });
    notes.push(`Re-attached list to its lead-in in "${s.heading}"`);
    return blocks;
  }
  if (leadIns.length > 1) notes.push(`List order uncertain in "${s.heading}" (${leadIns.length} lead-ins); editor check needed`);
  blocks.push({ k: "ul", items });
  return blocks;
}

export function cleanCondition(raw: RawCondition): CleanResult {
  const notes: string[] = [];
  const hpoIds = new Set(raw.sources.filter((s) => /Phenotype/i.test(s.label)).map((s) => s.id));
  const sections: DraftSection[] = [];

  for (const s of raw.sections) {
    const last = sections[sections.length - 1];
    if (last?.terms && isTermSection(s, hpoIds)) {
      last.terms.push(toTerm(s));
      for (const id of s.source_ids) if (!last.sourceIds.includes(id)) last.sourceIds.push(id);
      continue;
    }
    const section: DraftSection = {
      heading: tidy(s.heading),
      kind: s.kind === "orientation" ? "orientation" : "source",
      sourceIds: [...s.source_ids],
      blocks: sectionBlocks(s, notes),
    };
    if (TERM_HEADS.has(s.heading)) section.terms = [];
    sections.push(section);
  }

  // A term run that never arrived leaves an empty list; drop the property.
  for (const s of sections) if (s.terms && s.terms.length === 0) delete s.terms;
  const folded = sections.reduce((n, s) => n + (s.terms?.length ?? 0), 0);
  if (folded) notes.push(`Folded ${folded} clinical-term sections into one term list`);

  // Orphan term sections (no head before them) are left as ordinary sections;
  // they still render, just as headings.
  const sources: DraftSource[] = raw.sources.map((s) => ({
    id: s.id,
    label: tidy(s.label),
    url: s.url,
    rights: s.rights,
    version: s.version,
    retrievedOn: s.retrieved_on,
  }));

  return {
    sections,
    sources,
    otherNames: splitOtherNames(raw.other_names, raw.condition_name),
    orphaCode: orphaCodeFrom(raw.sources),
    notes,
  };
}

/** Every paragraph and list item in a cleaned body, for word and duplication counts. */
export function bodyStrings(sections: DraftSection[]): string[] {
  const out: string[] = [];
  for (const s of sections) {
    for (const b of s.blocks) {
      if (b.k === "p") out.push(b.text);
      else out.push(...b.items);
    }
    for (const t of s.terms ?? []) if (t.definition) out.push(t.definition);
  }
  return out;
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
