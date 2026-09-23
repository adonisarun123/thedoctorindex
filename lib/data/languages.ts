/**
 * Spoken languages — one canonical spelling each, and nothing that is not a
 * language.
 *
 * Hospital harvests scraped whatever sat near a "Languages" heading, so stored
 * values included "Know More", "&times;", "2 months ago", reviewers' names and
 * "Best pediatrician". Each of those also earned the languages quality points.
 * The rule here is an allowlist: a token is kept only if it maps to a known
 * language. A doctor with a language missing from the list loses it rather
 * than the site publishing scraper debris — add the language here instead.
 */

const CANONICAL = [
  // The Eighth Schedule's 22, plus English.
  "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", "Kashmiri",
  "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", "Odia", "Punjabi",
  "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu",
  // Widely spoken regional languages that recur in the records.
  "Tulu", "Kodava", "Bhojpuri", "Rajasthani", "Haryanvi", "Marwari", "Chhattisgarhi", "Garhwali",
  "Kumaoni", "Awadhi", "Magahi", "Khasi", "Mizo", "Garo", "Kokborok", "Bhili", "Gondi", "Sourashtra",
  "Saurashtra", "Byari", "Lambadi",
  // Languages patients travel with.
  "Arabic", "Persian", "French", "German", "Spanish", "Russian", "Japanese", "Mandarin",
  "Sinhala", "Swahili", "Somali", "Amharic", "Dari", "Pashto", "Burmese", "Thai", "Indonesian",
  "Portuguese", "Italian", "Dutch",
] as const;

/** Misspellings and older names seen in the records, mapped to the canonical form. */
const ALIASES: Record<string, string> = {
  bangla: "Bengali",
  oriya: "Odia",
  odiya: "Odia",
  telegu: "Telugu",
  telgu: "Telugu",
  kanada: "Kannada",
  kannda: "Kannada",
  kanadda: "Kannada",
  malyalam: "Malayalam",
  malayalm: "Malayalam",
  marati: "Marathi",
  hind: "Hindi",
  englsih: "English",
  engish: "English",
  farsi: "Persian",
  chinese: "Mandarin",
  meitei: "Manipuri",
  coorgi: "Kodava",
  kodagu: "Kodava",
};

const LOOKUP = new Map<string, string>([
  ...CANONICAL.map((l) => [l.toLowerCase(), l] as [string, string]),
  ...Object.entries(ALIASES),
]);

function decodeEntities(v: string): string {
  return v.replace(/&amp;/gi, "&").replace(/&times;/gi, "×").replace(/&nbsp;/gi, " ").replace(/&#39;|&apos;/gi, "'");
}

/**
 * Canonical languages from raw values. Compound values ("English, Hindi",
 * "Tulu & Bengali", "and Marathi.") are split; "Telugu- Spoken" loses the
 * suffix; anything that is not a known language is dropped. Order is kept,
 * duplicates removed.
 */
export function normalizeLanguages(raw: readonly string[]): string[] {
  const out: string[] = [];
  for (const value of raw) {
    const parts = decodeEntities(String(value ?? ""))
      .split(/,|&|\/|;|\||\band\b/i)
      .map((p) => p.replace(/[-–]\s*spoken\b/i, "").replace(/\bspoken\b/i, "").replace(/[.:()\s]+$/g, "").replace(/^[.:()\s]+/g, "").trim());
    for (const p of parts) {
      const hit = LOOKUP.get(p.toLowerCase());
      if (hit && !out.includes(hit)) out.push(hit);
    }
  }
  return out;
}

export const KNOWN_LANGUAGES: readonly string[] = CANONICAL;
