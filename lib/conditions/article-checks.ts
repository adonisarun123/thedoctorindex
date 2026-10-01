import { articleLinks, articleWordCount, type ConditionArticle } from "@/lib/conditions/article";
import { DEPARTMENTS } from "@/lib/conditions/departments";
import { SPECIALTIES } from "@/lib/data/taxonomy";

/**
 * The editorial bar for an original condition article, as a list of
 * problems (empty = passes). Used by tests/unit/conditions.test.ts and by
 * scripts/check-condition-article.ts so a writer can check one file before
 * it is registered.
 */

export const MIN_WORDS = 1000;
const DESCRIPTION_MAX = 155;
const TITLE_MAX = 60;
const LINK_OK = /^\/(conditions|specialties|doctors|health-guides|blog)\//;
const BANNED: Array<[RegExp, string]> = [
  [/\b\d+(\.\d+)?\s?(mg|mcg|ml|units?|iu)\b/i, "dose"],
  [/\bguarantee/i, "guarantee"],
  [/\b(permanent|complete|100%|guaranteed) cure/i, "cure claim"],
  [/\bbest (doctor|hospital|treatment)/i, "superlative"],
  [/₹\s?\d|\bRs\.?\s?\d/i, "price"],
  [/\bmiracle\b/i, "miracle"],
  [/\d+(\.\d+)?\s?%/, "percentage — leave statistics to the reviewer"],
  [/\b(lakh|crore|million|billion) (people|indians|cases)\b/i, "prevalence figure"],
];

export function articleProblems(a: ConditionArticle): string[] {
  const p: string[] = [];
  const words = articleWordCount(a);
  if (words < MIN_WORDS) p.push(`${words} words (min ${MIN_WORDS})`);
  if (a.standfirst.length > DESCRIPTION_MAX) p.push(`standfirst ${a.standfirst.length} chars (max ${DESCRIPTION_MAX})`);
  if ((a.metaTitle ?? a.title).length > TITLE_MAX) p.push(`title tag ${(a.metaTitle ?? a.title).length} chars (max ${TITLE_MAX}); set metaTitle`);
  if (a.body.filter((b) => b.k === "h2").length < 5) p.push("fewer than 5 h2 sections");
  if (a.faqs.length < 3) p.push("fewer than 3 FAQs");
  for (const f of a.faqs) if (f.a.split(/\s+/).length < 25) p.push(`FAQ answer under 25 words: ${f.q}`);
  if (!DEPARTMENTS.some((d) => d.slug === a.department)) p.push(`unknown department ${a.department}`);
  if (!SPECIALTIES[a.specialty]) p.push(`unknown specialty ${a.specialty}`);
  for (const k of a.alsoSee ?? []) if (!SPECIALTIES[k]) p.push(`unknown alsoSee ${k}`);
  if (a.sources.length < 2) p.push("fewer than 2 sources");
  for (const s of a.sources) if (!/^https:\/\//.test(s.url)) p.push(`source not https: ${s.url}`);
  if (a.reviewedOn && !a.reviewer) p.push("review date without a reviewer");
  if (a.reviewer && !a.reviewedOn) p.push("reviewer without a date");
  const links = articleLinks(a);
  for (const href of links) if (href.startsWith("/") && !LINK_OK.test(href)) p.push(`internal link outside allowed sections: ${href}`);
  if (!links.some((h) => h.startsWith("/doctors/") || h.startsWith("/specialties/"))) p.push("no link to a doctor listing or speciality");
  const text = JSON.stringify(a.body) + JSON.stringify(a.faqs);
  for (const [re, why] of BANNED) {
    const m = re.exec(text);
    if (m) p.push(`banned (${why}): "${m[0]}"`);
  }
  const lower = text.toLowerCase();
  for (const n of [...a.symptoms, ...a.tests, ...a.treatments]) if (!lower.includes(n.toLowerCase())) p.push(`markup entity not on page: "${n}"`);
  if (!/\b(112|108)\b/.test(text)) p.push("no emergency number");
  return p;
}
