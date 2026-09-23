import { SPECIALTIES } from "@/lib/data/specialties";

/**
 * Subspecialities worth showing.
 *
 * Imported records carry category tags in this field that are not
 * subspecialities at all: the system of medicine ("Allopathic Medicine", on
 * 3,700 profiles), a job title ("Senior Consultant"), or the speciality restated
 * in lay words ("Orthopaedician" on an orthopaedist, "Eye Care" on an
 * ophthalmologist). Rendered, they read as padding — and in `knowsAbout` they
 * tell a search engine nothing. This keeps the genuine ones ("Joint
 * Replacement", "Interventional Cardiology") and drops the rest.
 *
 * Applied when a record is read and when one is written, so stored values
 * are left as imported and the rule can change without a data migration.
 */

const GENERIC = new Set(
  [
    "allopathic", "allopathic medicine", "allopathic general medicine", "allopathic family medicine", "allpathic general medicine",
    "consultant", "senior consultant", "junior consultant", "associate consultant", "chief consultant", "visiting consultant",
    "specialist", "doctor", "physician", "surgeon", "general", "others", "other",
    "medicine specialist and medical consultant", "medical consultant", "medicine specialist",
    "homoeopathic specialist", "homeopathic specialist", "homeopathic", "homoeopathic", "homeopathy", "homoeopathy",
    "ayurved specialist", "ayurvedic", "ayurveda", "ayurvedic specialist", "unani", "siddha",
    "dentist", "dental surgery", "orthopaedician", "orthopedician", "child specialist", "heart specialist",
    "kidney specialist", "lady doctor", "gynaecology and lady doctor", "women care", "child care", "eye care",
    "skin and vd", "mental disorder treatment", "neurology treatment", "dermatology and skin care",
    "chiropractic and physiotherapy", "food and nutrition", "dietician and nutritionist",
  ].map((x) => x.toLowerCase()),
);

const norm = (v: string) => v.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();

export function cleanSubspecialties(raw: readonly string[], specialtyKey?: string | null): string[] {
  const sp = specialtyKey ? SPECIALTIES[specialtyKey] : undefined;
  const restates = new Set(
    sp ? [sp.name, sp.plural, sp.one, ...sp.aliases].map(norm) : [],
  );
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of raw) {
    const v = String(value ?? "").replace(/\s+/g, " ").trim();
    const n = norm(v);
    // "Allopathic …" in any spelling ("Allpathic", "Madicine") names the system, not a subspeciality.
    if (!n || n.length < 3 || GENERIC.has(n) || /^all?o?pathic\b/.test(n) || restates.has(n) || seen.has(n)) continue;
    seen.add(n);
    out.push(v);
  }
  return out;
}
