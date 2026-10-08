import "server-only";

import { unstable_cache } from "next/cache";

import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { askJson } from "@/lib/news/llm";
import { rateLimit } from "@/lib/security/rate-limit";
import type { SpecialtyKey } from "@/lib/types";

/**
 * Plain-language search: "my son has had fever for 3 days, near HSR" or a
 * query typed or spoken in Hindi, Kannada or Tamil, read into the filters the
 * directory already has (speciality, place, doctor's name).
 *
 * Two layers, deliberately separate:
 *   1. redFlag() — deterministic patterns for a possible emergency or a
 *      mental-health crisis. Runs on every query, costs nothing, and never
 *      depends on the model being up.
 *   2. interpretQuery() — a small model call, only for sentence-like or
 *      non-Latin queries the speciality resolver could not place. Cached per
 *      normalised query for 30 days and rate-limited, so a crawler or a loop
 *      cannot run up the bill. Any failure returns null and the ordinary
 *      keyword search runs as before.
 *
 * Neither layer diagnoses. The model picks which kind of doctor to see first;
 * it never names a condition back to the patient.
 */

export type RedFlag = "emergency" | "mental-health";

const MENTAL_HEALTH: RegExp[] = [
  /\bsuicid/i,
  /\bkill(ing)?\s+my\s*self\b/i,
  /\bwant(s|ed)?\s+to\s+die\b/i,
  /\bend(ing)?\s+my\s+life\b/i,
  /\bdon'?t\s+want\s+to\s+(live|be\s+alive)\b/i,
  /\bself[\s-]?harm/i,
  /\bcutting\s+my\s*self\b/i,
  /\b(aatmahatya|atmahatya|khudkushi)\b/i,
  /आत्महत्या|ख़ुदकुशी|खुदकुशी|ಆತ್ಮಹತ್ಯೆ|தற்கொலை|ఆత్మహత్య|ആത്മഹത്യ/,
];

const EMERGENCY: RegExp[] = [
  /\bchest\s+(pain|pressure|tightness|heaviness)\b/i,
  /\bpain\s+in\s+(my\s+|the\s+|his\s+|her\s+)?chest\b/i,
  /\bheart\s+attack\b/i,
  /\b(can'?t|cannot|unable\s+to|struggling\s+to)\s+breathe?\b/i,
  /\b(difficulty|trouble)\s+breathing\b/i,
  /\bnot\s+breathing\b/i,
  /\bchoking\b/i,
  /\bface\s+(is\s+)?droop/i,
  /\bslurred\s+speech\b/i,
  /\bsudden\s+(weakness|numbness|paralysis|loss\s+of\s+vision)\b/i,
  /\b(unconscious|unresponsive|not\s+responding|passed\s+out|collapsed)\b/i,
  /\b(having|had)\s+(a\s+)?(seizure|fit|fits|convulsions?)\b/i,
  /\b(heavy|severe|uncontrolled|non[\s-]?stop)\s+bleeding\b/i,
  /\bbleeding\s+(heavily|won'?t\s+stop|not\s+stopping)\b/i,
  /\b(vomiting|coughing\s+(up\s+)?)blood\b/i,
  /\boverdose\b/i,
  /\b(poisoning|poisoned|drank\s+poison|swallowed\s+poison)\b/i,
  /\bsnake\s*bite\b/i,
  /\b(severe|major|bad)\s+burns?\b/i,
  /\b(head\s+injury|road\s+accident)\b/i,
  /\b(baby|infant|newborn)\b.*\b(not\s+breathing|turning\s+blue|unresponsive|limp)\b/i,
  /\b(seene|sine)\s+(me|mein|mai)\s+dard\b/i,
  /\b(saans|sans)\s+(nahi|nahin|lene\s+me)\b/i,
  /\bbehosh\b/i,
  /सीने\s*में\s*दर्द|छाती\s*में\s*दर्द|सांस\s*नहीं|साँस\s*नहीं|बेहोश|ಎದೆ\s*ನೋವು|ಉಸಿರಾಟದ\s*ತೊಂದರೆ|நெஞ்சு\s*வலி|மூச்சு\s*திணறல்|ఛాతీ\s*నొప్పి/,
];

export function redFlag(text: string): RedFlag | null {
  if (!text) return null;
  if (MENTAL_HEALTH.some((r) => r.test(text))) return "mental-health";
  if (EMERGENCY.some((r) => r.test(text))) return "emergency";
  return null;
}

export interface Reading {
  specialty: SpecialtyKey | null;
  place: string | null;
  doctorName: string | null;
  urgent: boolean;
  /** Short English rendering of the query, shown back as "we read this as". */
  english: string | null;
}

/**
 * Identifiers a visitor might type into a search box (a phone number, an
 * email, an Aadhaar or hospital number) are replaced before the query goes to
 * the model provider or into the cache. The model needs the complaint and the
 * place, never who is asking.
 */
export function redactIdentifiers(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[email]")
    .replace(/(\+?91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/g, "[phone]")
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[number]")
    // 7+ digits: hospital and patient numbers. A 6-digit PIN code is a place and is kept.
    .replace(/\b\d{7,}\b/g, "[number]");
}

/** Worth a model call: reads like a sentence, or is not in Latin script. */
export function needsReading(q: string): boolean {
  const t = q.trim();
  if (t.length < 4 || t.length > 240) return false;
  // eslint-disable-next-line no-control-regex
  if (/[^\u0000-ɏ]/.test(t)) return true;
  return t.split(/\s+/).length >= 3;
}

/** Specialities a patient books directly; diagnostics and non-clinical roles are left out of the model's choices. */
const NOT_BOOKABLE = /non-clinical|pathology|radiology|anaesthesiology|nuclear medicine/i;
const CHOICES = SPECIALTY_KEYS.filter((k) => !NOT_BOOKABLE.test(SPECIALTIES[k].name));

const SYSTEM = `You read a patient's search on The Doctor Index, a directory of doctors in India, and turn it into filters.
The query may be in English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi or Bengali, in native script or romanised.
Reply with ONE JSON object and nothing else:
{"specialty": <one key from the list, or null>, "place": <an Indian city or locality named in the query, as written in English, or null>, "doctorName": <a doctor's name if the query names one, without "Dr", or null>, "urgent": <true only if the text describes a possible emergency happening now: chest pain, stroke signs, severe breathing trouble, unconsciousness, seizure, heavy bleeding, poisoning, serious injury, or thoughts of suicide or self-harm>, "english": <the query restated in plain English, max 12 words>}
Rules:
- specialty is the kind of doctor the patient should book FIRST. For vague or general symptoms (fever, weakness, body pain) choose general-practice or internal-medicine; for a child choose paediatrics unless a specific specialist is obvious.
- Prefer the medical speciality over the surgical one (gastroenterology before gi-surgery, neurology before neurosurgery, cardiology before cardiothoracic surgery) unless the query asks for an operation or a surgeon.
- For a possible emergency set urgent true and still choose the speciality for follow-up care, not emergency-medicine.
- Never diagnose and never add facts that are not in the query.
- If the query is only a doctor's name, set specialty to null.
Specialty keys:
${CHOICES.map((k) => `${k} = ${SPECIALTIES[k].name}`).join("\n")}`;

interface Raw {
  specialty?: unknown;
  place?: unknown;
  doctorName?: unknown;
  urgent?: unknown;
  english?: unknown;
}

const str = (v: unknown, max = 80): string | null => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

/** One uncached model read. Exported for the smoke script; the site goes through readCached. */
export async function readQuery(normalised: string): Promise<Reading> {
  const raw = await askJson<Raw>({
    system: SYSTEM,
    user: normalised,
    model: process.env.SEARCH_MODEL || "claude-haiku-5-5",
    maxTokens: 300,
    timeoutMs: 7000,
    noThinking: true,
  });
  const key = typeof raw.specialty === "string" && (CHOICES as string[]).includes(raw.specialty) ? (raw.specialty as SpecialtyKey) : null;
  return {
    specialty: key,
    place: str(raw.place, 60),
    doctorName: str(typeof raw.doctorName === "string" ? raw.doctorName.replace(/^dr\.?\s+/i, "") : null, 60),
    urgent: raw.urgent === true,
    english: str(raw.english, 120),
  };
}

const readCached = unstable_cache(
  readQuery,
  ["search-interpret-v1"],
  { revalidate: 60 * 60 * 24 * 30, tags: ["search-interpret"] },
);

/** Per visitor and site-wide ceilings on model calls (cache hits count too; they are cheap). */
const PER_IP_PER_HOUR = 40;
const SITE_PER_DAY = 3000;

export async function interpretQuery(query: string, ipKey: string | null): Promise<Reading | null> {
  if (!process.env.ANTHROPIC_API_KEY || !needsReading(query)) return null;
  const normalised = redactIdentifiers(query).toLowerCase().replace(/\s+/g, " ").trim();
  try {
    const [site, visitor] = await Promise.all([
      rateLimit("search-read:site", SITE_PER_DAY, 86_400),
      ipKey ? rateLimit(`search-read:${ipKey}`, PER_IP_PER_HOUR, 3600) : Promise.resolve({ ok: true, remaining: 1 }),
    ]);
    if (!site.ok || !visitor.ok) return null;
    return await readCached(normalised);
  } catch {
    // Model down, slow, or a reply that did not parse: fall back to keyword search.
    return null;
  }
}
