import type { PlaceHit } from "@/lib/enrich/google";
import { coreTokens } from "@/lib/enrich/names";
import { listingNamesDoctor, pickRegisterMatch, type RegisterDoctor, type RegisterMatch } from "@/lib/nmc/research-match";

/**
 * Placing a register-built profile from a Google results page (Serper.dev).
 * Pure, unit-tested.
 *
 * Two paths, in order:
 *   1. Listings — the local pack (`places`) and the knowledge panel, which
 *      carry a business name and an address. These go through the same
 *      strict rule as a Places search (lib/nmc/research-match.ts).
 *   2. Organic results — titles and snippets. Weaker evidence, so the bar is
 *      higher: at least two results must name the doctor AND agree on one
 *      city in the council's state; a practice name is taken only when the
 *      text says where the doctor practises; two different cities is an
 *      ambiguity; a stated years-of-experience that contradicts the register
 *      by more than 12 years is a different person.
 *
 * Nothing is fetched from the linked pages. What is kept is the practice
 * name, the city (and locality when named) and the URL that said so.
 */

export interface SerpPlace {
  title: string;
  address?: string;
  category?: string;
  phoneNumber?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  cid?: string;
}
export interface SerpOrganic {
  title: string;
  link: string;
  snippet?: string;
}
export interface SerpResponse {
  places?: SerpPlace[];
  knowledgeGraph?: { title?: string; type?: string; description?: string; website?: string; attributes?: Record<string, string> };
  organic?: SerpOrganic[];
}

const HEALTH_WORDS = /doctor|clinic|hospital|health|medical|physician|surgeon|dentist|nursing|physio|specialist|care|centre|center|polyclinic|diagnostic|maternity|eye|heart|skin|child|dental|ologist|iatrist|cardio|ortho|derm|gyn|p(?:a)?edia|neuro|\buro|nephro|gastro|onco|\bent\b|psych|radiol|anaes|anesth|pulmon|chest|diabet|endocrin|rheumat|haemat|hemat/i;
const PRACTICE_WORDS = /hospitals?|clinic|nursing home|medical (?:college|centre|center)|health ?care|health (?:centre|center)|institute of|polyclinic|diagnostic|medicity|infirmary|sanatorium|maternity (?:home|centre|center)|multi ?special|super ?special|cancer (?:centre|center|institute)|eye (?:centre|center|institute)|heart (?:centre|center|institute)|dental (?:centre|center)|care (?:centre|center)|(?:heart|eye|skin|child|dental|kidney|cancer|women'?s?|mother|fertility) care/i;

/** Local-pack and knowledge-panel entries as PlaceHits, so the Places rule applies unchanged. */
export function listingsOf(r: SerpResponse): PlaceHit[] {
  const hits: PlaceHit[] = [];
  for (const p of r.places ?? []) {
    if (!p.title || !p.address) continue;
    hits.push({ id: p.cid ? `cid:${p.cid}` : `serp:${p.title}|${p.address}`, name: p.title, address: p.address, phone: p.phoneNumber ?? null, website: p.website ?? null, mapsUri: p.cid ? `https://maps.google.com/?cid=${p.cid}` : "", types: HEALTH_WORDS.test(p.category ?? "") ? ["doctor"] : [], lat: p.latitude ?? null, lng: p.longitude ?? null });
  }
  const kg = r.knowledgeGraph;
  const addr = kg?.attributes?.Address ?? kg?.attributes?.address;
  if (kg?.title && addr) {
    hits.push({ id: `kg:${kg.title}|${addr}`, name: kg.title, address: addr, phone: kg.attributes?.Phone ?? kg.attributes?.phone ?? null, website: kg.website ?? null, mapsUri: "", types: HEALTH_WORDS.test(`${kg.type ?? ""} ${kg.description ?? ""}`) ? ["doctor"] : [], lat: null, lng: null });
  }
  return hits;
}

export interface OrganicEvidence {
  status: "matched" | "no_match" | "ambiguous";
  city: string | null;
  locality: string | null;
  practice: string | null;
  urls: string[];
  reasons: string[];
}

export interface CityIndex {
  /** Canonical city name (as the localities table spells it) by lower-case name or alias. */
  byName: Map<string, string>;
}

export const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru", bengaluru: "Bengaluru", mysore: "Mysuru", mangalore: "Mangaluru", hubli: "Hubballi", belgaum: "Belagavi", gulbarga: "Kalaburagi", bellary: "Ballari", bombay: "Mumbai", poona: "Pune", madras: "Chennai", calcutta: "Kolkata", baroda: "Vadodara", trivandrum: "Thiruvananthapuram", cochin: "Kochi", calicut: "Kozhikode", trichy: "Tiruchirappalli", vizag: "Visakhapatnam", gurgaon: "Gurugram", allahabad: "Prayagraj", benares: "Varanasi", banaras: "Varanasi", pondicherry: "Puducherry", simla: "Shimla", cawnpore: "Kanpur", "new delhi": "Delhi", secunderabad: "Hyderabad", navi_mumbai: "Navi Mumbai",
};

export function buildCityIndex(cities: string[]): CityIndex {
  const byName = new Map<string, string>();
  for (const c of cities) byName.set(c.toLowerCase(), c);
  // An alias only when its city is in this list — "New Delhi" must not put Delhi into Karnataka.
  for (const [alias, canon] of Object.entries(CITY_ALIASES)) {
    const known = byName.get(canon.toLowerCase());
    if (known && !byName.has(alias)) byName.set(alias.replace(/_/g, " "), known);
  }
  return { byName };
}

/** The city named in a piece of text, longest name first so "Navi Mumbai" wins over "Mumbai". */
export function cityIn(text: string, idx: CityIndex): string | null {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  let best: string | null = null;
  let bestLen = 0;
  for (const [name, canon] of idx.byName) {
    if (name.length > bestLen && t.includes(` ${name} `)) {
      best = canon;
      bestLen = name.length;
    }
  }
  return best;
}

/** "… practises at Manipal Hospital, Old Airport Road …" → "Manipal Hospital". Short, no digits, no degrees, no aggregator names. */
export function practiceIn(text: string): string | null {
  // "Medical College" or "Hospital" alone names nothing: something must identify the place beyond the noun.
  const identifies = (c: string) => /[A-Z][A-Za-z'.-]+/.test(c.replace(new RegExp(PRACTICE_WORDS.source, "gi"), "").replace(/\b(of|the|and|for|general|district|government|govt|private|city|new|old|main|multi|super|research|sciences?|institute|college|university|hospitals?|clinics?|centre|center|medical|health|care|trust|society)\b/gi, "").trim());
  const ok = (c: string) =>
    c.length >= 6 && c.length <= 50 && c.split(" ").length <= 7 && PRACTICE_WORDS.test(c) && identifies(c) && !/\d/.test(c) && !/\b(book|from|and|mbbs|md|ms|dnb|am|pm|years?|yrs|exp|experience|reviews?|fees?|appointment|online|near|best|top|welcome|trusted|association|director|degree|qualification|providing|quality|service|services|list|doctors|find|about|contact|home|locations?|university|academy|department|dept)\b/i.test(c) && !/practo|justdial|lybrate|apollo ?247|credihealth|sulekha|linkedin|facebook|youtube|instagram/i.test(c) && !/^dr\b/i.test(c);
  const pick = (raw: string) => {
    const found = raw
      .replace(/^the\s+/i, "")
      .replace(/\b(St|Mt|Ft)\.\s/g, "$1\u00a7 ") // keep "St. Philomena's" whole through the split on full stops
      .split(/[,.;|()]/)
      .map((x) => x.split(/\s+(?:in|at|on|near|located|since|for|is|has|with|where|who)\s+/)[0].replace(/\s+/g, " ").replace(/[\s&\-–—]+$/, "").trim())
      .find(ok);
    return found ? found.replace(/\u00a7/g, ".") : null;
  };
  const m = text.match(/(?:[Pp]racti[cs](?:es|ing)?|[Cc]onsult(?:s|ing|ant)?|[Ww]ork(?:s|ing)?|[Aa]ttached to|[Aa]ssociated with|[Aa]vailable|[Vv]isiting)\s+(?:at|in|with)\s+(?:the\s+)?([A-Z][A-Za-z0-9&'.\- ,]{3,90})/);
  if (m) {
    const c = pick(m[1]);
    if (c) return c;
  }
  // "Dr X - Cardiologist | Fortis Hospital Bannerghatta"
  for (const seg of text.split(/\s[|\-–—]\s/)) {
    const c = pick(seg);
    if (c) return c;
  }
  return null;
}

export function yearsIn(text: string): number | null {
  const m = text.match(/(\d{1,2})\+?\s*(?:years?|yrs)\b(?:\s+of)?\s+(?:exp|experience|practice)/i);
  return m ? Number(m[1]) : null;
}

/** Words a result must carry to count as being about this speciality — the namesake filter. */
export const SPECIALTY_TERMS: Record<string, RegExp> = {
  Cardiology: /cardio|heart/i,
  "Internal medicine": /physician|general medicine|internal medicine|medicine specialist|diabet/i,
  Paediatrics: /p(?:a)?ediatric|child|neonat/i,
  "Obstetrics & gynaecology": /gyn(?:a)?ec|obstet|fertility|ivf|women/i,
  "General surgery": /surg/i,
  Anaesthesiology: /an(?:a)?esth|pain|critical|icu/i,
  "Pathology & microbiology": /patholog|microbiolog|lab|diagnostic|transfusion|blood bank/i,
  Orthopaedics: /orthop|bone|joint|spine|trauma/i,
  Ophthalmology: /ophthalm|eye|retina|cataract/i,
  Radiology: /radiolog|imaging|sonolog|ultrasound|mri|ct scan/i,
  "Ear, nose & throat": /\bent\b|otolaryng|otorhino|ear|nose|throat|sinus/i,
  Dermatology: /dermat|skin|hair|cosmet|venere|leprosy/i,
  Psychiatry: /psychiat|mental|psych/i,
  Pulmonology: /pulmon|chest|respir|lung|tb|asthma|sleep/i,
  Neurology: /neurolog|neuro|stroke|epilep/i,
  Urology: /urolog|kidney stone|prostate|androlog/i,
  Nephrology: /nephrolog|kidney|dialysis|renal/i,
  Gastroenterology: /gastro|liver|hepat|endoscop/i,
  Neurosurgery: /neurosurg|brain|spine/i,
  "Plastic & cosmetic surgery": /plastic|cosmetic|reconstruct|aesthetic|burn/i,
  "Paediatric surgery": /p(?:a)?ediatric surg|child.*surg/i,
  "Surgical oncology": /onco|cancer|tumou?r/i,
  "Radiation oncology": /onco|cancer|radiation|radiother/i,
  "Medical oncology": /onco|cancer|chemo|h(?:a)?emat/i,
  Endocrinology: /endocrin|diabet|thyroid|hormone/i,
  Diabetology: /diabet|endocrin|sugar/i,
  Rheumatology: /rheumat|arthritis|joint/i,
  Haematology: /h(?:a)?emat|blood|leuk|bone marrow|onco/i,
  "Critical care medicine": /critical|intensiv|icu/i,
  "Emergency medicine": /emergency|trauma|casualty/i,
  "Infectious diseases": /infect|hiv|tropical|fever/i,
  "Geriatric medicine": /geriat|elder|senior|old age/i,
  "Nuclear medicine": /nuclear|pet|scintig|isotope/i,
  "Physical medicine and rehabilitation": /rehab|physical medicine|physiatr|pmr/i,
  "Organ transplantation": /transplant/i,
  "Cardiothoracic & vascular surgery": /cardi|thoracic|vascular|ctvs|heart surg/i,
  "Gastrointestinal surgery": /gastro|liver|hepat|surg|bariatric|laparosc/i,
  "General practice": /physician|family|general practi|gp\b|clinic/i,
};
const EXCLUDED_DOMAINS = /indiankanoon|casemine|lawyerservices|judis|\.nic\.in\/judg|courtkutchehry|scconline|manupatra|legitquest|ecourts|obituar|rip\b|wikipedia|reddit|quora|tressless|facebook|youtube|instagram|twitter|x\.com|pinterest|forum/i;

export function organicEvidence(results: SerpOrganic[], d: RegisterDoctor & { eraYear: number | null }, idx: CityIndex): OrganicEvidence {
  const terms = SPECIALTY_TERMS[d.specialtyName];
  const named = results.filter((r) => !EXCLUDED_DOMAINS.test(r.link) && listingNamesDoctor(`${r.title} ${r.snippet ?? ""}`, d.name) && (!terms || terms.test(`${r.title} ${r.snippet ?? ""}`)));
  if (named.length < 2) return { status: "no_match", city: null, locality: null, practice: null, urls: [], reasons: [named.length ? "only one result names the doctor and the speciality" : "no result names the doctor and the speciality"] };
  const cities = new Map<string, SerpOrganic[]>();
  const contradictions: string[] = [];
  for (const r of named) {
    const text = `${r.title} ${r.snippet ?? ""}`;
    const yrs = yearsIn(text);
    if (yrs !== null && d.eraYear !== null && Math.abs(2026 - d.eraYear - yrs) > 12) {
      contradictions.push(`${yrs} years vs register ${d.eraYear}`);
      continue;
    }
    const city = cityIn(text, idx);
    if (!city) continue;
    cities.set(city, [...(cities.get(city) ?? []), r]);
  }
  if (cities.size === 0) return { status: "no_match", city: null, locality: null, practice: null, urls: [], reasons: contradictions.length ? contradictions : ["no result names a known city in the state"] };
  if (cities.size > 1) return { status: "ambiguous", city: null, locality: null, practice: null, urls: [], reasons: [`results place the name in ${[...cities.keys()].join(" and ")}`] };
  const [[city, agree]] = cities;
  if (agree.length < 2) return { status: "no_match", city, locality: null, practice: null, urls: agree.map((r) => r.link), reasons: ["only one result places the doctor"] };
  // The practice: named by one result for a three-token name; a two-token name ("Sanjay Kumar") is common enough that two results must name the same practice.
  const practices = new Map<string, { name: string; n: number }>();
  for (const r of agree) {
    const pr = practiceIn(`${r.title}. ${r.snippet ?? ""}`);
    if (!pr) continue;
    const k = pr.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(hospitals?|clinics?|the)\b/g, "").trim();
    practices.set(k, { name: practices.get(k)?.name ?? pr, n: (practices.get(k)?.n ?? 0) + 1 });
  }
  const ranked = [...practices.values()].sort((a, b) => b.n - a.n);
  const need = coreTokens(d.name).length >= 3 ? 1 : 2;
  const practice = ranked.length && ranked[0].n >= need ? ranked[0].name : null;
  if (!practice) return { status: "no_match", city, locality: null, practice: null, urls: agree.map((r) => r.link), reasons: [ranked.length ? `${agree.length} results agree on ${city}; practice "${ranked[0].name}" named once, two-token name needs two` : `${agree.length} results agree on ${city} but none names a practice`] };
  const locality = localityIn(agree.map((r) => `${r.title} ${r.snippet ?? ""}`).join(" "), city, idx);
  return { status: "matched", city, locality, practice, urls: agree.map((r) => r.link), reasons: [`${agree.length} results name the doctor in ${city}`, `practice: ${practice}`] };
}

/** "Cardiologist in Jayanagar, Bangalore" → "Jayanagar" (any spelling of the city the index knows). */
export function localityIn(text: string, city: string, idx?: CityIndex): string | null {
  const names = idx ? [...idx.byName.entries()].filter(([, canon]) => canon === city).map(([n]) => n) : [city.toLowerCase()];
  const alt = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`\\b(?:in|at)\\s+([A-Z][A-Za-z.' ]{2,30}?),\\s*(?:${alt})\\b`, "i");
  const m = text.match(re);
  const loc = m?.[1]?.trim() ?? null;
  return loc && !PRACTICE_WORDS.test(loc) && !/^dr\b/i.test(loc) ? loc : null;
}

export interface SerpOutcome {
  listing: RegisterMatch;
  organic: OrganicEvidence;
}

export function readSerp(r: SerpResponse, d: RegisterDoctor & { eraYear: number | null }, query: string, idx: CityIndex): SerpOutcome {
  const listing = pickRegisterMatch(listingsOf(r), d, query);
  const organic = organicEvidence(r.organic ?? [], d, idx);
  return { listing, organic };
}

export { coreTokens };
