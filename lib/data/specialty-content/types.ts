import type { SpecialtyKey } from "@/lib/types";

/**
 * Long-form content for a speciality page, kept apart from the registry entry
 * in lib/data/specialties.ts.
 *
 * `reviewedOn` in the registry covers `guide` and `when` only. This content has
 * its own `reviewedOn` and is labelled "not yet reviewed by a clinician" until a
 * named clinician signs *this* text off — an old review date never carries
 * over to newer text. `writtenOn` is when the text was last substantively
 * changed.
 *
 * Rules for writing it: general orientation only; no doses, no drug names as
 * advice, no success rates, prices or waiting times (they vary and date fast);
 * say "usually" where practice varies; anything urgent points to 108.
 */
export interface SpecialtyContent {
  key: SpecialtyKey;
  writtenOn: string;
  /** "" until a named clinician has reviewed this text. */
  reviewedOn: string;
  reviewedBy?: string;
  /** Two or three paragraphs on what the specialist does and how care is organised in India. */
  overview: string[];
  /** Conditions, each with one plain-language line. */
  conditions: Array<{ name: string; note: string }>;
  /** Tests and procedures a patient is likely to meet, each with what it is for. */
  tests: Array<{ name: string; note: string }>;
  /** How this speciality differs from its nearest neighbours. `key` must be a live speciality. */
  versus: Array<{ key: SpecialtyKey; text: string }>;
  /** What to bring and what usually happens at a first consultation. */
  firstVisit: string[];
  /** Symptoms that need emergency care rather than an appointment. */
  urgent: string[];
  /** Questions answered on the page; also emitted as FAQPage from this same array. */
  faqs: Array<{ q: string; a: string }>;
}
