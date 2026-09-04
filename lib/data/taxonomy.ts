import type { Locality, LocalityKey, Specialty, SpecialtyKey } from "@/lib/types";

/**
 * Controlled taxonomy. Adding a speciality here is a governed act: it needs a
 * canonical slug, its patient-language aliases, and original medically reviewed
 * guidance before any page for it can be indexed.
 */
export const SPECIALTIES: Record<SpecialtyKey, Specialty> = {
  cardiology: {
    key: "cardiology",
    name: "Cardiology",
    plural: "Cardiologists",
    one: "Cardiologist",
    aOne: "a cardiologist",
    slug: "cardiologists",
    department: "Heart & Vascular",
    aliases: ["heart specialist", "heart doctor", "cardiac specialist", "heart"],
    guide:
      "Cardiologists diagnose and treat conditions of the heart and blood vessels — chest pain, palpitations, blood pressure that is hard to control, heart failure and rhythm problems. A referral from a physician is common but not required. Emergency chest pain is not a directory matter: call 108.",
    when: [
      "Chest pain or tightness on exertion",
      "Palpitations or a racing heartbeat",
      "Breathlessness that is new or worsening",
      "Blood pressure that stays high on treatment",
      "Follow-up after an angioplasty, bypass or heart attack",
    ],
    reviewedOn: "12 Aug 2026",
  },
  dermatology: {
    key: "dermatology",
    name: "Dermatology",
    plural: "Dermatologists",
    one: "Dermatologist",
    aOne: "a dermatologist",
    slug: "dermatologists",
    department: "Skin & Hair",
    aliases: ["skin specialist", "skin doctor", "hair doctor", "skin"],
    guide:
      "Dermatologists treat conditions of the skin, hair and nails — from acne, eczema and psoriasis to hair loss and skin growths that change in size or colour. Many concerns are settled in one or two consultations.",
    when: [
      "A mole or growth that changes shape, size or colour",
      "Acne that has not responded to over-the-counter treatment",
      "Persistent rash, itching or scaling",
      "Sudden or patchy hair loss",
      "Recurring skin infections",
    ],
    reviewedOn: "12 Aug 2026",
  },
  orthopaedics: {
    key: "orthopaedics",
    name: "Orthopaedics",
    plural: "Orthopaedic surgeons",
    one: "Orthopaedic surgeon",
    aOne: "an orthopaedic surgeon",
    slug: "orthopaedic-surgeons",
    department: "Bones & Joints",
    aliases: ["bone specialist", "bone doctor", "joint pain", "ortho", "orthopedics"],
    guide:
      "Orthopaedic surgeons manage injuries and disorders of bones, joints, ligaments and the spine. Not every consultation ends in surgery — a large share of orthopaedic care is physiotherapy, injection and load management.",
    when: [
      "Joint pain that limits walking, standing or sleep",
      "An injury with swelling or an inability to bear weight",
      "Back or neck pain radiating into a limb",
      "Sports injuries that keep recurring",
      "A second opinion before a planned joint replacement",
    ],
    reviewedOn: "12 Aug 2026",
  },
  paediatrics: {
    key: "paediatrics",
    name: "Paediatrics",
    plural: "Paediatricians",
    one: "Paediatrician",
    aOne: "a paediatrician",
    slug: "paediatricians",
    department: "Child Health",
    aliases: ["child specialist", "children doctor", "kids doctor", "child doctor", "pediatrics"],
    guide:
      "Paediatricians care for infants, children and adolescents — growth and development, immunisation, common infections and long-term childhood conditions. Most families choose a paediatrician close to home for continuity.",
    when: [
      "Routine immunisation and growth monitoring",
      "Fever, cough or a stomach upset that is not settling",
      "Concerns about feeding, weight or developmental milestones",
      "Recurrent ear, throat or chest infections",
      "Adolescent health and school-related concerns",
    ],
    reviewedOn: "12 Aug 2026",
  },
};

export const SPECIALTY_KEYS = Object.keys(SPECIALTIES) as SpecialtyKey[];

const SLUG_TO_SPECIALTY: Record<string, SpecialtyKey> = Object.fromEntries(
  SPECIALTY_KEYS.map((k) => [SPECIALTIES[k].slug, k]),
);

export function specialtyBySlug(slug: string): Specialty | null {
  const key = SLUG_TO_SPECIALTY[slug];
  return key ? SPECIALTIES[key] : null;
}

/**
 * The /specialties/ hub is addressed by the speciality itself (cardiology),
 * while listing pages are addressed by the practitioner noun (cardiologists).
 * A speciality is a field of medicine; the people are what a patient browses.
 */
export function specialtyByKey(key: string): Specialty | null {
  return (SPECIALTIES as Record<string, Specialty>)[key] ?? null;
}

/**
 * Location hierarchy. Only Bengaluru is open in this build; the shape is
 * country > state > city > locality so additional cities are data, not code.
 */
export const LOCALITIES: Record<LocalityKey, Locality> = {
  indiranagar: mk("indiranagar", "Indiranagar", 12.9784, 77.6408),
  koramangala: mk("koramangala", "Koramangala", 12.9352, 77.6245),
  jayanagar: mk("jayanagar", "Jayanagar", 12.9308, 77.5838),
  whitefield: mk("whitefield", "Whitefield", 12.9698, 77.75),
  "hsr-layout": mk("hsr-layout", "HSR Layout", 12.9116, 77.6389),
  malleshwaram: mk("malleshwaram", "Malleshwaram", 13.0031, 77.5643),
};

/**
 * Approximate locality centroids (WGS84, ~4 decimal places). They stand in
 * for a facility's own coordinates until the geocoder (GEOCODING_* in .env)
 * has run, and are the anchor for "near me" distances in the meantime.
 */
function mk(key: LocalityKey, name: string, lat: number, lng: number): Locality {
  return {
    key,
    name,
    city: "Bengaluru",
    citySlug: "bengaluru",
    state: "Karnataka",
    stateSlug: "karnataka",
    lat,
    lng,
  };
}

export const LOCALITY_KEYS = Object.keys(LOCALITIES) as LocalityKey[];

export const CITY = {
  name: "Bengaluru",
  slug: "bengaluru",
  state: "Karnataka",
  stateSlug: "karnataka",
} as const;

export function localityBySlug(slug: string): Locality | null {
  return (LOCALITIES as Record<string, Locality>)[slug] ?? null;
}

/**
 * Maps a free-text patient query onto one canonical speciality. Synonyms with
 * the same search intent resolve to the same page; they never get one of
 * their own.
 */
export function resolveSpecialtyQuery(query: string): Specialty | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const key of SPECIALTY_KEYS) {
    const s = SPECIALTIES[key];
    if (
      s.name.toLowerCase().includes(q) ||
      s.plural.toLowerCase().includes(q) ||
      s.one.toLowerCase().includes(q) ||
      s.slug.includes(q)
    ) {
      return s;
    }
    if (s.aliases.some((a) => a.includes(q) || q.includes(a))) return s;
  }
  return null;
}

export function resolveLocalityQuery(query: string): Locality | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const key of LOCALITY_KEYS) {
    if (LOCALITIES[key].name.toLowerCase().includes(q)) return LOCALITIES[key];
  }
  return null;
}
