"use server";

import { getDashboardContext } from "@/lib/dashboard";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";
import { askJson } from "@/lib/news/llm";
import { rateLimit } from "@/lib/security/rate-limit";
import { SUPERLATIVE } from "@/lib/services/doctors";

/**
 * Drafting assistant for the doctor's "Professional introduction".
 *
 * It writes ONLY from the facts already on the profile — qualifications,
 * practices, experience, languages, services — and returns a draft. Nothing
 * is saved: the doctor reads it, edits it and publishes it through the normal
 * save, which runs the same superlative check as hand-typed text. That keeps
 * the doctor as the author of every published word, which is the point: an
 * introduction the doctor approved is original content, a bulk-generated one
 * is not.
 */
export interface DraftState {
  draft?: string;
  error?: string;
}

const PER_DAY = 10;

const SYSTEM = `You draft the "Professional introduction" for a doctor's profile on The Doctor Index, a directory of doctors in India.
Write 70-130 words, third person, plain professional English, starting with the doctor's name as given.
Use ONLY the facts supplied. Do not invent qualifications, institutions, years, conditions, procedures, outcomes, awards or patient numbers.
Never use superlatives or rankings (best, top, leading, renowned, expert, world-class, no. 1, most trusted), never promise results or cures, never give medical advice.
If a fact is missing, leave it out; do not write around the gap.
Reply with one JSON object only: {"about": "<the introduction>"}`;

export async function draftAboutAction(): Promise<DraftState> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) return { error: "The drafting assistant is not configured on this site yet." };
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can draft their introduction." };
    const limit = await rateLimit(`about-draft:${ctx.doctorId}`, PER_DAY, 86_400);
    if (!limit.ok) return { error: `You can create ${PER_DAY} drafts a day. Try again tomorrow, or edit the last draft by hand.` };

    const d = ctx.doctor;
    const facts = {
      name: displayName(d),
      speciality: SPECIALTIES[d.specialty]?.name ?? null,
      subspecialities: d.subspecialties,
      qualifications: d.qualifications.map((q) => [q.degree, q.institution, q.year || null].filter(Boolean).join(", ")),
      yearsOfExperience: d.yearsOfExperience > 0 ? d.yearsOfExperience : null,
      experience: d.experience.map((e) => `${e.role}, ${e.place} (${e.from}–${e.to ?? "present"})`),
      practices: d.practices.map((p) => [p.facility, p.localityName, p.city].filter(Boolean).join(", ")),
      languages: d.languages,
      consultationModes: d.modes,
      servicesAndConditionsManaged: d.services,
      verifiedMemberships: d.credentials.filter((c) => c.state === "verified" && c.kind === "membership").map((c) => c.title),
    };

    let about = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await askJson<{ about?: unknown }>({
        system: SYSTEM,
        user: JSON.stringify(facts),
        model: process.env.DRAFT_MODEL || "claude-sonnet-5-5",
        maxTokens: 600,
        timeoutMs: 30_000,
      });
      about = typeof r.about === "string" ? r.about.trim() : "";
      if (about && !SUPERLATIVE.test(about)) break;
      about = "";
    }
    if (!about) return { error: "Couldn't produce a draft that meets the site's wording rules. Please try again." };
    return { draft: about };
  } catch {
    return { error: "The drafting assistant is unavailable right now. Please try again in a minute." };
  }
}
