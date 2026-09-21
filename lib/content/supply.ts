import type { MixEntry, SupplyProfile } from "@/lib/data";

/**
 * Prose and fact rows derived from measured supply.
 *
 * The rule this file exists to enforce: a browse page may say only what the
 * records under it support, in figures taken from those records. Nothing here
 * emits a sentence from a template with a place name swapped in — every
 * function returns `null` when the data behind it is absent, and the caller
 * renders nothing rather than a zero, an empty range or a hedge.
 *
 * That constraint is not stylistic. 23,000 near-identical browse pages on a
 * young YMYL health domain is the scaled-content signal that keeps pages in
 * "Crawled – currently not indexed"; the only copy worth adding at this scale
 * is copy that differs page to page because the data does.
 */

export interface SupplyFact {
  label: string;
  value: string;
  /** Shown smaller under the value. Omitted when there is nothing honest to add. */
  note?: string;
}

const fmt = (n: number): string => n.toLocaleString("en-IN");

/**
 * Share as a percentage, but only where a percentage means anything. Under 20
 * records "50% have a registration" is one doctor in two, and reads as a
 * statistic when it is an anecdote.
 */
const MIN_FOR_PERCENT = 20;

export function share(part: number, whole: number): string | null {
  if (whole < MIN_FOR_PERCENT || part <= 0) return null;
  const pct = Math.round((part / whole) * 100);
  return pct < 1 ? "under 1%" : `${pct}%`;
}

function list(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** "719 general physicians", "1 general physician" — the subject of most sentences below. */
export function countPhrase(n: number, one: string, plural: string): string {
  return `${fmt(n)} ${n === 1 ? one.toLowerCase() : plural.toLowerCase()}`;
}

/**
 * Where the pool practises. Facilities and localities are the two figures that
 * are populated for essentially every imported record, so this is the one
 * sentence that survives on a thin page.
 */
export function placementSentence(p: SupplyProfile, subject: string, placeName: string): string | null {
  if (p.total <= 0) return null;
  const parts: string[] = [`The index holds ${subject} in ${placeName}`];
  if (p.facilities > 0) parts.push(`across ${fmt(p.facilities)} practice ${p.facilities === 1 ? "address" : "addresses"}`);
  if (p.localities > 1) parts.push(`in ${fmt(p.localities)} localities`);
  else if (p.localities === 1) parts.push("in one locality");
  return `${parts.join(" ")}.`;
}

/**
 * What has and has not been checked. Stated as counts of records, never as a
 * quality claim about the doctors: a registration that is on file but not yet
 * checked is exactly that, and the sentence says so.
 */
export function verificationSentence(p: SupplyProfile): string | null {
  if (p.total <= 0) return null;
  const bits: string[] = [];
  if (p.withRegistration > 0) {
    const pct = share(p.withRegistration, p.total);
    bits.push(`${fmt(p.withRegistration)}${pct ? ` (${pct})` : ""} carry a council registration number on record`);
    if (p.registerChecked > 0) bits.push(`${fmt(p.registerChecked)} of those have been checked against a register`);
  } else {
    bits.push("no record here carries a council registration number yet");
  }
  if (p.claimed > 0) bits.push(`${fmt(p.claimed)} ${p.claimed === 1 ? "has" : "have"} been claimed by the doctor`);
  const lead = p.total === 1 ? "Of the single record" : `Of the ${fmt(p.total)} records`;
  return `${lead}, ${list(bits)}.`;
}

/** Recorded degrees. Two or more, or it is a fact about one doctor dressed as a mix. */
export function qualificationSentence(p: SupplyProfile): string | null {
  const shown = p.qualifications.filter((q) => q.n > 0).slice(0, 4);
  if (shown.length === 0 || p.total < 3) return null;
  const phrases = shown.map((q) => `${q.name} (${fmt(q.n)})`);
  return `The degrees recorded most often are ${list(phrases)}.`;
}

/** Which registers the numbers on file were issued by. */
export function councilSentence(p: SupplyProfile): string | null {
  const shown = p.councils.filter((c) => c.n > 0).slice(0, 3);
  if (shown.length === 0) return null;
  // Carries its count even when there is only one council: an answer with no
  // figure in it is the same string on every page that shares that register.
  if (shown.length === 1) return `All ${fmt(shown[0].n)} ${shown[0].n === 1 ? "registration" : "registrations"} on file here were issued by the ${shown[0].name}.`;
  const phrases = shown.map((c) => `${c.name} (${fmt(c.n)})`);
  return `Registrations on file were issued by ${list(phrases)}.`;
}

/** Declared areas of focus, where enough records declare one to be worth naming. */
export function subspecialtySentence(p: SupplyProfile): string | null {
  const shown = p.subspecialties.filter((x) => x.n > 0).slice(0, 4);
  if (shown.length === 0) return null;
  const phrases = shown.map((x) => `${x.name} (${fmt(x.n)})`);
  return `Areas of focus named on these profiles include ${list(phrases)}.`;
}

/**
 * Where a place's records concentrate — top specialities in a city, top
 * cities in a state, top localities. Needs at least two entries and a real
 * total, or there is no distribution to describe.
 */
export function concentrationSentence(
  entries: MixEntry[],
  total: number,
  noun: { singular: string; plural: string },
  /**
   * A place name to drop from the distribution. Records with no locality on
   * file are placed against the locality that carries the city's own name, so
   * "the best-supplied localities in Indore are Indore (1,236)…" is an artifact
   * of that fallback restated as a finding. Dropping it leaves a distribution
   * that says something; the total is unchanged, so the percentage still
   * describes the share of the whole.
   */
  exclude?: string,
): string | null {
  const shown = entries.filter((e) => e.n > 0 && (!exclude || e.name.toLowerCase() !== exclude.toLowerCase())).slice(0, 3);
  if (shown.length < 2 || total <= 0) return null;
  const covered = shown.reduce((a, e) => a + e.n, 0);
  const pct = share(covered, total);
  const phrases = shown.map((e) => `${e.name} (${fmt(e.n)})`);
  const tail = pct ? ` — together ${pct} of the records here` : "";
  return `The best-supplied ${noun.plural} are ${list(phrases)}${tail}.`;
}

/** How thinly the tail is spread: the count of entries holding exactly one record. */
export function singletonSentence(entries: MixEntry[], noun: { singular: string; plural: string }): string | null {
  const ones = entries.filter((e) => e.n === 1).length;
  if (ones < 2 || entries.length < 4) return null;
  return `${fmt(ones)} ${noun.plural} hold a single record.`;
}

/**
 * Fact rows for the panel. A field with no data produces no row: a "Fee range"
 * row reading "—" on 95% of pages is the boilerplate this whole module exists
 * to avoid.
 */
export function supplyFacts(p: SupplyProfile): SupplyFact[] {
  const rows: SupplyFact[] = [];
  if (p.total > 0) rows.push({ label: "Profiles", value: fmt(p.total) });
  if (p.facilities > 0) rows.push({ label: "Practice addresses", value: fmt(p.facilities) });
  if (p.localities > 0) rows.push({ label: "Localities", value: fmt(p.localities) });
  if (p.withRegistration > 0) {
    const pct = share(p.withRegistration, p.total);
    rows.push({
      label: "Registration on record",
      value: fmt(p.withRegistration),
      note: p.registerChecked > 0 ? `${fmt(p.registerChecked)} checked against a register${pct ? ` · ${pct} of profiles` : ""}` : pct ? `${pct} of profiles` : undefined,
    });
  }
  if (p.claimed > 0) rows.push({ label: "Claimed by the doctor", value: fmt(p.claimed) });
  if (p.withAbout > 0) rows.push({ label: "With a written profile", value: fmt(p.withAbout) });
  /*
   * Indore records a practice start year on 4 of 4,186 profiles. "Median years
   * in practice: 18" beside a 4,186 headline reads as a fact about the city
   * when it is a fact about four doctors, so the row needs a real sample
   * behind it before it appears at all.
   */
  const MIN_FOR_MEDIAN = 20;
  if (p.withExperience >= MIN_FOR_MEDIAN && p.medianYears !== null) {
    rows.push({
      label: "Median years in practice",
      value: fmt(p.medianYears),
      note: `from ${countPhrase(p.withExperience, "profile", "profiles")} recording a start year`,
    });
  }
  if (p.withFee > 0 && p.feeMin !== null && p.feeMax !== null) {
    rows.push({
      label: "Consultation fee",
      value: p.feeMin === p.feeMax ? `₹${fmt(p.feeMin)}` : `₹${fmt(p.feeMin)}–₹${fmt(p.feeMax)}`,
      note: `recorded on ${countPhrase(p.withFee, "profile", "profiles")}`,
    });
  }
  return rows;
}

/**
 * The honest statement of what is missing, so a sparse page says so in its own
 * words rather than looking complete. Returns null when nothing material is
 * absent.
 */
export function gapSentence(p: SupplyProfile): string | null {
  if (p.total < 3) return null;
  const missing: string[] = [];
  if (p.withRegistration < p.total) missing.push(`${fmt(p.total - p.withRegistration)} without a registration number on record`);
  if (p.withAbout < p.total) missing.push(`${fmt(p.total - p.withAbout)} without a written profile`);
  if (p.withExperience < p.total) missing.push(`${fmt(p.total - p.withExperience)} without a recorded practice start year`);
  if (missing.length === 0) return null;
  return `Still incomplete: ${list(missing)}. Each profile states which of its own details have been checked and when.`;
}

/* ---------------------------------------------------------------------------
   Listing FAQ.

   Every answer is built from counts measured on the page's own pool, and a
   question whose data is absent is not asked. That is the whole design: a
   fixed seven-question FAQ across 8,715 listing pages would be 8,715 copies of
   the same answers with a place name swapped, which is the scaled-content
   pattern this module exists to avoid. A sparse locality page gets two
   questions; Indore's general physicians get five.

   The same array feeds the visible block and the FAQPage markup, so the
   markup can never assert a question the page does not show.
--------------------------------------------------------------------------- */

export interface Faq {
  q: string;
  a: string;
}

export function listingFaq(
  p: SupplyProfile,
  s: { one: string; plural: string },
  placeName: string,
  localities: MixEntry[],
  /** Dropped from the locality answer — see concentrationSentence. */
  excludeLocality?: string,
): Faq[] {
  const out: Faq[] = [];
  const plural = s.plural.toLowerCase();
  const one = s.one.toLowerCase();
  if (p.total <= 0) return out;

  out.push({
    q: `How many ${plural} are listed in ${placeName}?`,
    a: `${fmt(p.total)}${p.facilities > 0 ? `, practising at ${fmt(p.facilities)} ${p.facilities === 1 ? "address" : "addresses"}` : ""}${p.localities > 1 ? ` across ${fmt(p.localities)} localities` : ""}. The index lists every ${one} on record here, not a ranked or paid selection.`,
  });

  out.push({
    q: `Have these ${plural} been verified?`,
    a:
      p.withRegistration > 0
        ? `${fmt(p.withRegistration)} of the ${fmt(p.total)} carry a council registration number on record${p.registerChecked > 0 ? `, and ${fmt(p.registerChecked)} of those numbers have been checked against a register` : `, none of which has been checked against a register yet`}. Each profile states its own position; nothing here is marked verified on the strength of the page it sits on.`
        : `No record on this page carries a council registration number yet. Each profile says so on its own page rather than implying a check that has not happened.`,
  });

  const quals = p.qualifications.filter((q) => q.n > 0).slice(0, 4);
  if (quals.length > 0 && p.total >= 3) {
    out.push({
      q: `What qualifications do ${plural} in ${placeName} hold?`,
      a: `The degrees recorded most often are ${list(quals.map((q) => `${q.name} (${fmt(q.n)} ${q.n === 1 ? "profile" : "profiles"})`))}. Qualifications are shown as recorded, with the source noted on each profile.`,
    });
  }

  const councils = p.councils.filter((c) => c.n > 0).slice(0, 3);
  if (councils.length > 0) {
    out.push({
      q: `Which councils issued their registrations?`,
      a:
        councils.length === 1
          ? `All ${fmt(councils[0].n)} ${councils[0].n === 1 ? "registration" : "registrations"} on file here were issued by the ${councils[0].name}.`
          : `${list(councils.map((c) => `${c.name} (${fmt(c.n)})`))}.`,
    });
  }

  const locs = localities.filter((l) => l.n > 0 && (!excludeLocality || l.name.toLowerCase() !== excludeLocality.toLowerCase())).slice(0, 5);
  if (locs.length >= 2) {
    out.push({
      q: `Where in ${placeName} do they practise?`,
      a: `Most records cluster in ${list(locs.map((l) => `${l.name} (${fmt(l.n)})`))}. A locality page opens for browsing once enough ${plural} practise there.`,
    });
  }

  if (p.withFee > 0 && p.feeMin !== null && p.feeMax !== null) {
    out.push({
      q: `What does a consultation cost?`,
      a: `${fmt(p.withFee)} of these profiles record a consultation fee, ranging from ₹${fmt(p.feeMin)} to ₹${fmt(p.feeMax)}. Fees are shown with the date they were last confirmed, and the rest record none.`,
    });
  }

  return out;
}
