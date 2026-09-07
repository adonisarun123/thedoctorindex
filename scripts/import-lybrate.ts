import { readFileSync } from "node:fs";

import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { customAlphabet } from "nanoid";
import postgres from "postgres";

import { SPECIALTIES } from "../lib/data/taxonomy";
import * as s from "../lib/db/schema";
import { syncTaxonomy } from "../lib/db/taxonomy-sync";
import { placeName, placeSlug } from "../lib/geo-names";
import { slugify } from "../lib/services/doctors";
import { localityKeyFor } from "../lib/services/places-pure";

config({ path: ".env.local" });
config();

/**
 * Lybrate city listing export → The Doctor Index.
 *
 *   npm run db:import:lybrate -- --file data/private/lybrate-bangalore.csv --dry
 *   npm run db:import:lybrate -- --file data/private/lybrate-bangalore.csv
 *
 * The source is a third-party directory, not our own archive, so this importer
 * is deliberately narrower than the DrData one:
 *
 *  - Facts only. Name, speciality, qualifications, registration, clinic,
 *    languages, experience and consult fee cross over. Lybrate's score,
 *    rating count and review count do NOT: their review signal is theirs, and
 *    republishing it as ours would be a claim we cannot stand behind.
 *  - Nothing is presented as verified. Registration and qualifications land in
 *    the "submitted" state with no checked-on date, the practice has no
 *    confirmedOn, the fee has no feeCheckedOn, and every profile is unclaimed.
 *  - A row only goes live if it is coherent: a retrieved profile, a mappable
 *    speciality, a resolvable city, and a clinic address. Anything else is
 *    written as `draft` with the reasons in the audit row, so it waits in
 *    /admin/doctors instead of reaching a patient or the sitemap.
 *  - Provenance on every record: source = "import:lybrate", source_ref = the
 *    export's Record ID, plus one audit row carrying the source's own notes.
 *  - Idempotent on (source, source_ref); a name+city collision with a profile
 *    already in the database is reported and skipped rather than duplicated.
 */

type Row = Record<string, string>;
const CURRENT_YEAR = new Date().getUTCFullYear();
const publicIdGen = customAlphabet("0123456789abcdef", 6);

/* ------------------------------------------------------------------------ */
/* CSV                                                                       */
/* ------------------------------------------------------------------------ */

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      cur.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      cur.push(field);
      field = "";
      rows.push(cur);
      cur = [];
    } else field += c;
  }
  if (field !== "" || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

function loadRows(file: string): Row[] {
  const raw = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
  const h = raw.findIndex((r) => r[0]?.trim() === "Record ID");
  if (h < 0) throw new Error("No header row starting with 'Record ID'");
  const header = raw[h].map((x) => x.trim());
  return raw
    .slice(h + 1)
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(header.map((k, i) => [k, (r[i] ?? "").trim()])));
}

/* ------------------------------------------------------------------------ */
/* Normalisation                                                             */
/* ------------------------------------------------------------------------ */

const clean = (v: string) => v.replace(/\s+/g, " ").trim();
/** Excel error strings and placeholders that mean "no value". */
const isNull = (v: string) => !v || /^(#REF!|#N\/A|NA|N\/A|-|--|nil|none|null)$/i.test(v.trim());
const val = (v: string | undefined) => (v && !isNull(v) ? clean(v) : "");

/** "Dr. Capt Manjunath S B" → "Capt Manjunath S B". Titles off, case preserved. */
function personName(raw: string): string | null {
  let n = clean(raw)
    .replace(/^(dr\.?|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "")
    .replace(/\s*\(.*?\)\s*$/, "")
    .replace(/[^\p{L}\p{M}.' -]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  // "Dr Vikas Yadav Yadav" — the export doubles a surname on some rows.
  const parts = n.split(" ");
  if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === parts[parts.length - 2].toLowerCase()) {
    parts.pop();
    n = parts.join(" ");
  }
  if (n.length < 2 || n.length > 80) return null;
  return n;
}

/**
 * The export lists some clinics as if they were doctors ("Happy Teeth",
 * "Raheja Fortis Hospital"). A name that is the clinic's own, or that reads as
 * an organisation, is held for a human rather than published as a person.
 */
const ORG_WORDS = /\b(clinic|clinics|hospital|hospitals|centre|center|institute|polyclinic|dental|dentistry|teeth|care|cares|health|healthcare|diagnostics|laborator|nursing home|speciality|specialty|surgical)\b/i;

function looksLikeOrganisation(name: string, clinic: string): boolean {
  if (ORG_WORDS.test(name)) return true;
  const c = clean(clinic).toLowerCase();
  return Boolean(c) && c === name.toLowerCase();
}

/** Lybrate's speciality labels are its own; they map here, not in the registry. */
const SPECIALTY_BY_LABEL: Record<string, string> = {
  DENTIST: "dentistry",
  "GENERAL PHYSICIAN": "general-practice",
  CARDIOLOGIST: "cardiology",
  PSYCHIATRIST: "psychiatry",
  DERMATOLOGIST: "dermatology",
  NEUROLOGIST: "neurology",
  UROLOGIST: "urology",
  SEXOLOGIST: "sexual-medicine",
  GYNAECOLOGIST: "gynaecology",
  GYNECOLOGIST: "gynaecology",
  OBSTETRICIAN: "gynaecology",
  "IVF SPECIALIST": "gynaecology",
  OPHTHALMOLOGIST: "ophthalmology",
  ORTHOPEDIST: "orthopaedics",
  ORTHOPAEDIST: "orthopaedics",
  PEDIATRICIAN: "paediatrics",
  PAEDIATRICIAN: "paediatrics",
  "ENT SPECIALIST": "ent",
  ENDOCRINOLOGIST: "endocrinology",
  GASTROENTEROLOGIST: "gastroenterology",
  NEPHROLOGIST: "nephrology",
  ONCOLOGIST: "medical-oncology",
  PSYCHOLOGIST: "clinical-psychology",
  PHYSIOTHERAPIST: "physiotherapy",
  DIETITIAN: "dietetics",
  "DIETITIAN/NUTRITIONIST": "dietetics",
  PULMONOLOGIST: "pulmonology",
  RHEUMATOLOGIST: "rheumatology",
  DIABETOLOGIST: "diabetology",
  "PLASTIC SURGEON": "plastic-surgery",
  "GENERAL SURGEON": "general-surgery",
  RADIOLOGIST: "radiology",
  PATHOLOGIST: "pathology",
  AUDIOLOGIST: "audiology",
  HOMEOPATH: "ayush",
  AYURVEDA: "ayush",
  "UNANI SPECIALIST": "ayush",
  TRICHOLOGIST: "dermatology",
  COSMETOLOGIST: "cosmetology",
  ACUPUNCTURIST: "acupuncture",
  GERIATRICIAN: "geriatrics",
  HEMATOLOGIST: "haematology",
  "NEURO SURGEON": "neurosurgery",
  NEUROSURGEON: "neurosurgery",
};

/** Cities whose state the export left blank. Anything else stays unresolved. */
const STATE_BY_CITY: Record<string, string> = {
  BENGALURU: "Karnataka",
  MYSURU: "Karnataka",
  MANGALURU: "Karnataka",
  MOODBIDRI: "Karnataka",
  HUBLI: "Karnataka",
  CHENNAI: "Tamil Nadu",
  COIMBATORE: "Tamil Nadu",
  HYDERABAD: "Telangana",
  DELHI: "Delhi",
  "NEW DELHI": "Delhi",
  NOIDA: "Uttar Pradesh",
  GHAZIABAD: "Uttar Pradesh",
  GURUGRAM: "Haryana",
  FARIDABAD: "Haryana",
  MUMBAI: "Maharashtra",
  PUNE: "Maharashtra",
  THANE: "Maharashtra",
  NAGPUR: "Maharashtra",
  KOLKATA: "West Bengal",
  AHMEDABAD: "Gujarat",
  SURAT: "Gujarat",
  JAIPUR: "Rajasthan",
  LUCKNOW: "Uttar Pradesh",
  KOCHI: "Kerala",
  THIRUVANANTHAPURAM: "Kerala",
  BHOPAL: "Madhya Pradesh",
  INDORE: "Madhya Pradesh",
  CHANDIGARH: "Chandigarh",
};

/** Source spellings that must land on the city the site already uses. */
const CITY_CANONICAL: Record<string, string> = {
  BANGALORE: "Bengaluru",
  BENGALOORU: "Bengaluru",
  BOMBAY: "Mumbai",
  CALCUTTA: "Kolkata",
  MADRAS: "Chennai",
  MYSORE: "Mysuru",
  MANGALORE: "Mangaluru",
  TRIVANDRUM: "Thiruvananthapuram",
  GURGAON: "Gurugram",
};

/**
 * "Opposite hong kong bazar, Gurgaon" and "Malleswaram, Bangalore" are address
 * fragments the export put in the city column; the city is the last segment.
 */
function cityName(raw: string): string {
  const t = val(raw);
  if (!t) return "";
  const last = t.split(",").map((x) => clean(x)).filter(Boolean).pop() ?? "";
  if (last.length < 3 || last.length > 40) return "";
  return CITY_CANONICAL[last.toUpperCase()] ?? last;
}

function councilName(raw: string): string {
  const t = val(raw);
  if (!t) return "";
  const k = t.toUpperCase().replace(/[^A-Z]/g, "");
  const known: Record<string, string> = {
    KMC: "Karnataka Medical Council",
    KSMC: "Karnataka Medical Council",
    KARNATKAMEDICALCOUNCIL: "Karnataka Medical Council",
    KSDC: "Karnataka State Dental Council",
    KDC: "Karnataka State Dental Council",
    KARNATAKASTATEDENTALCOUNCL: "Karnataka State Dental Council",
    KARNATAKADENTALCOUNCIL: "Karnataka State Dental Council",
    MCI: "Medical Council of India",
    NMC: "National Medical Commission",
    DCI: "Dental Council of India",
    TNMC: "Tamil Nadu Medical Council",
    APMC: "Andhra Pradesh Medical Council",
    DMC: "Delhi Medical Council",
    MMC: "Maharashtra Medical Council",
  };
  if (known[k]) return known[k];
  return placeName(t).replace(/\bOf\b/g, "of").replace(/\bAnd\b/g, "and");
}

function phone(raw: string): string | null {
  const digits = val(raw).replace(/[^\d+]/g, "");
  const m = /(\d{10})$/.exec(digits.replace(/^\+?91/, ""));
  return m ? `+91${m[1]}` : null;
}

/** "₹500" → 500. Anything outside a sane consult-fee range is dropped. */
function fee(raw: string): number | null {
  const n = Number(val(raw).replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n >= 10 && n <= 100000 ? n : null;
}

/** The export shouts some clinic names and addresses; title-case those only. */
function titleIfShouty(v: string): string {
  const t = val(v);
  if (!t || t !== t.toUpperCase()) return t;
  return placeName(t)
    .replace(/\b(Rd|Road|St|Street|Nagar|Marg|Opp|Cross|Main|Block|Layout|Phase|Sector|Floor)\b/gi, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())
    .replace(/\bOf\b/g, "of")
    .replace(/\bAnd\b/g, "and");
}

const splitList = (v: string, sep = /[;|]/) => val(v).split(sep).map((x) => clean(x)).filter(Boolean);

/** Split on commas outside parentheses — "MBBS, MS (Ortho), DNB". */
function splitDegrees(v: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const c of val(v)) {
    if (c === "(") depth++;
    if (c === ")") depth = Math.max(0, depth - 1);
    if (c === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((x) => clean(x)).filter(Boolean);
}

/* ------------------------------------------------------------------------ */
/* Preparation                                                               */
/* ------------------------------------------------------------------------ */

interface Prepared {
  ref: string;
  name: string;
  specialtyKey: string;
  subspecialties: string[];
  languages: string[];
  modes: Array<"In person" | "Online">;
  practiceStartYear: number | null;
  registration: { number: string; council: string } | null;
  qualifications: string[];
  place: { state: string; city: string; locality: string | null } | null;
  facility: { name: string; address: string; postalCode: string | null; phone: string | null; website: string | null; feeInr: number | null } | null;
  sourceNotes: string;
  holdReasons: string[];
}

function prepare(r: Row): { ok: Prepared } | { skip: string } {
  const ref = val(r["Record ID"]);
  if (!ref) return { skip: "no Record ID" };
  // The listing name is sometimes fuller than the profile name ("Dr Pramod
  // Adiga" vs "Dr Pramod"); take the longer when one extends the other.
  const profileName = personName(val(r["Profile name"]));
  const listingName = personName(val(r["Listing name"]));
  const name =
    profileName && listingName && listingName.toLowerCase().startsWith(profileName.toLowerCase()) && listingName.length > profileName.length
      ? listingName
      : profileName ?? listingName;
  if (!name) return { skip: "name unusable" };

  const label = (val(r["Profile specialty"]) || val(r["Requested specialty"])).toUpperCase();
  const specialtyKey = SPECIALTY_BY_LABEL[label];
  if (!specialtyKey) return { skip: `speciality "${label || "—"}" unmapped` };

  const holdReasons: string[] = [];
  const notes = val(r["Data notes"]);
  const status = val(r["Profile status"]);
  if (/profile unavailable/i.test(status)) holdReasons.push("profile never retrieved from the source");
  if (looksLikeOrganisation(name, val(r["Primary clinic"]))) holdReasons.push("listing looks like a clinic or hospital, not a person");
  if (/mismatch/i.test(notes)) holdReasons.push("speciality/qualification mismatch flagged by the source");

  const city = cityName(r["Clinic city"]) || cityName(r["Profile city"]);
  // A known city fixes its own state: the export's State column is wrong on
  // rows where it was copied from the doctor's other listing.
  const state = (city ? STATE_BY_CITY[city.toUpperCase()] ?? "" : "") || val(r["State"]);
  const place = city && state ? { state, city, locality: val(r["Locality"]) || null } : null;
  if (!place) holdReasons.push("clinic city or state could not be resolved");

  const address = titleIfShouty(r["Clinic address"]);
  const clinic = titleIfShouty(r["Primary clinic"]);
  if (!address) holdReasons.push("no clinic address in the export");

  // The subspecialty list is copied from the source and is wrong on the rows
  // it flags; drop it there rather than publishing a gynaecologist dentist.
  const mismatch = /mismatch/i.test(notes);
  const specialtyOne = SPECIALTIES[specialtyKey as keyof typeof SPECIALTIES].one.toUpperCase();
  const subspecialties = mismatch
    ? []
    : splitList(r["Subspecialties"]).filter((x) => x.toUpperCase() !== specialtyOne && x.length <= 60).slice(0, 6);

  const exp = Number(val(r["Experience (years)"]));
  const practiceStartYear = exp > 0 && exp < 70 ? CURRENT_YEAR - Math.round(exp) : null;

  const regNo = val(r["Registration number"]);
  const registration = regNo ? { number: regNo, council: councilName(r["Registration authority"]) || "Council not stated" } : null;

  const clinicFee = fee(r["Clinic fee (INR)"]);
  const onlineFee = fee(r["Online fee (INR)"]);
  const modes: Array<"In person" | "Online"> = onlineFee ? ["In person", "Online"] : ["In person"];

  const website = /^https?:\/\//i.test(val(r["Website"])) ? val(r["Website"]) : null;
  const facility =
    address || clinic
      ? {
          name: clinic || "Consulting practice",
          address: address || `${place?.locality ?? place?.city ?? ""}`,
          postalCode: /^\d{6}$/.test(val(r["Pincode"])) ? val(r["Pincode"]) : null,
          phone: phone(r["Public phone"]),
          website,
          feeInr: clinicFee,
        }
      : null;

  return {
    ok: {
      ref,
      name,
      specialtyKey,
      subspecialties,
      languages: splitList(r["Languages"]).slice(0, 8),
      modes,
      practiceStartYear,
      registration,
      qualifications: splitDegrees(r["Qualifications"]).filter((d) => d.length >= 2 && d.length <= 80).slice(0, 8),
      place,
      facility,
      sourceNotes: notes,
      holdReasons,
    },
  };
}

/* ------------------------------------------------------------------------ */
/* Import                                                                    */
/* ------------------------------------------------------------------------ */

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const has = (name: string) => process.argv.includes(`--${name}`);

async function main() {
  const file = arg("file");
  if (!file) {
    console.error("usage: npm run db:import:lybrate -- --file <csv> [--dry] [--limit N] [--all-draft]");
    process.exit(2);
  }
  const dry = has("dry");
  const allDraft = has("all-draft");
  const limit = Number(arg("limit") ?? Infinity);
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const rows = loadRows(file).slice(0, limit);
  console.log(`${rows.length} rows read from ${file}`);

  const prepared: Prepared[] = [];
  const skips = new Map<string, number>();
  for (const r of rows) {
    const p = prepare(r);
    if ("skip" in p) skips.set(p.skip, (skips.get(p.skip) ?? 0) + 1);
    else prepared.push(p.ok);
  }

  // Registrations are unique per council+number; keep the first, hold the rest.
  const seenReg = new Set<string>();
  for (const p of prepared) {
    if (!p.registration) continue;
    const k = `${p.registration.council.toUpperCase().replace(/[^A-Z0-9]/g, "")}|${p.registration.number.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
    if (seenReg.has(k)) {
      p.holdReasons.push("duplicate registration number inside the export");
      p.registration = null;
    } else seenReg.add(k);
  }

  const live = prepared.filter((p) => !allDraft && p.holdReasons.length === 0);
  const held = prepared.filter((p) => allDraft || p.holdReasons.length > 0);
  const bySpec = new Map<string, number>();
  for (const p of prepared) bySpec.set(p.specialtyKey, (bySpec.get(p.specialtyKey) ?? 0) + 1);
  console.log(`${prepared.length} importable · ${live.length} published · ${held.length} draft`);
  for (const [why, n] of [...skips.entries()].sort((a, b) => b[1] - a[1])) console.log(`  skipped ${n}: ${why}`);
  const holds = new Map<string, number>();
  for (const p of held) for (const h of p.holdReasons) holds.set(h, (holds.get(h) ?? 0) + 1);
  for (const [why, n] of [...holds.entries()].sort((a, b) => b[1] - a[1])) console.log(`  held ${n}: ${why}`);
  console.log("  by speciality: " + [...bySpec.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(", "));

  if (dry) {
    console.log("\nDry run — nothing written. Sample:");
    for (const p of prepared.slice(0, 3)) console.log(JSON.stringify(p, null, 1));
    return;
  }

  const client = postgres(url, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  await syncTaxonomy(db);

  /* Geography */
  const places = new Map<string, { state: string; city: string; locality: string | null }>();
  for (const p of prepared) {
    if (!p.place) continue;
    places.set(`${p.place.state}|${p.place.city}|`, { ...p.place, locality: null });
    if (p.place.locality) places.set(`${p.place.state}|${p.place.city}|${p.place.locality}`, p.place);
  }
  const localityRows = [...places.values()]
    .map((pl) => {
      const state = placeName(pl.state);
      const city = placeName(pl.city);
      const locality = pl.locality ? placeName(pl.locality) : city;
      const stateSlug = placeSlug(state);
      const citySlug = placeSlug(city);
      const slug = pl.locality ? placeSlug(locality) : citySlug;
      return { key: localityKeyFor(citySlug, slug), slug, name: locality, city, citySlug, state, stateSlug, sort: pl.locality ? 100 : 0 };
    })
    .filter((l) => l.key && l.slug);
  // Dedupe on key, and let every unique constraint (key, and state/city/slug)
  // absorb a row the table already holds — an existing locality may have been
  // created under a different key by an earlier import.
  const uniqueLocalities = [...new Map(localityRows.map((l) => [l.key, l])).values()];
  for (const l of uniqueLocalities) {
    await db.insert(s.localities).values(l).onConflictDoNothing();
  }
  const allLoc = await db.select({ key: s.localities.key, slug: s.localities.slug, stateSlug: s.localities.stateSlug, citySlug: s.localities.citySlug }).from(s.localities);
  const locKey = new Map(allLoc.map((l) => [`${l.stateSlug}/${l.citySlug}/${l.slug}`, l.key]));
  const keyFor = (pl: { state: string; city: string; locality: string | null } | null) => {
    if (!pl) return null;
    const stateSlug = placeSlug(placeName(pl.state));
    const citySlug = placeSlug(placeName(pl.city));
    const slug = pl.locality ? placeSlug(placeName(pl.locality)) : citySlug;
    return locKey.get(`${stateSlug}/${citySlug}/${slug}`) ?? locKey.get(`${stateSlug}/${citySlug}/${citySlug}`) ?? null;
  };
  console.log(`geography: ${localityRows.length} places ensured (${allLoc.length} localities in table)`);

  /* Idempotence: this export's own refs, and name collisions with anything already loaded. */
  const existingRefs = new Set(
    (await db.select({ ref: s.doctors.sourceRef }).from(s.doctors).where(sql`${s.doctors.source} = 'import:lybrate'`)).map((r) => r.ref),
  );
  const existingNames = new Set((await db.select({ name: s.doctors.name }).from(s.doctors)).map((r) => r.name.toLowerCase()));
  const todo: Array<Prepared & { status: "published" | "draft" }> = [];
  let dupRef = 0;
  let dupName = 0;
  for (const p of prepared) {
    if (existingRefs.has(p.ref)) {
      dupRef++;
      continue;
    }
    if (existingNames.has(p.name.toLowerCase())) {
      dupName++;
      continue;
    }
    existingNames.add(p.name.toLowerCase());
    todo.push({ ...p, status: allDraft || p.holdReasons.length ? "draft" : "published" });
  }
  console.log(`${dupRef} already imported · ${dupName} name already in the database · ${todo.length} to write`);

  const usedIds = new Set((await db.select({ id: s.doctors.publicId }).from(s.doctors)).map((r) => r.id));
  const newId = () => {
    let id = publicIdGen();
    while (usedIds.has(id)) id = publicIdGen();
    usedIds.add(id);
    return id;
  };

  let written = 0;
  const CHUNK = 100;
  for (let i = 0; i < todo.length; i += CHUNK) {
    const batch = todo.slice(i, i + CHUNK);
    await db.transaction(async (tx) => {
      const docs = await tx
        .insert(s.doctors)
        .values(
          batch.map((p) => {
            const publicId = newId();
            return {
              publicId,
              slug: slugify(p.name, publicId),
              name: p.name,
              gender: null,
              specialtyKey: p.specialtyKey,
              subspecialties: p.subspecialties,
              practiceStartYear: p.practiceStartYear,
              languages: p.languages,
              modes: p.modes,
              about: "",
              services: [] as string[],
              status: p.status,
              source: "import:lybrate",
              sourceRef: p.ref,
              sourceUrl: null,
              claimed: false,
              // Nothing here is verified, so only the "no reviews to reply to" point.
              qualityScore: 2,
              publishedAt: p.status === "published" ? new Date() : null,
              lastVerifiedOn: null,
            };
          }),
        )
        .returning({ id: s.doctors.id, sourceRef: s.doctors.sourceRef });
      const idByRef = new Map(docs.map((d) => [d.sourceRef, d.id]));

      const regs = batch
        .filter((p) => p.registration)
        .map((p) => ({
          doctorId: idByRef.get(p.ref)!,
          number: p.registration!.number,
          numberNormalized: p.registration!.number.toUpperCase().replace(/[^A-Z0-9]/g, ""),
          council: p.registration!.council,
          councilNormalized: p.registration!.council.toUpperCase().replace(/[^A-Z0-9]/g, ""),
          checkedOn: null,
          source: null,
          isPrimary: true,
        }));
      if (regs.length) await tx.insert(s.medicalRegistrations).values(regs).onConflictDoNothing();

      const quals = batch.flatMap((p) =>
        p.qualifications.map((degree, sort) => ({
          doctorId: idByRef.get(p.ref)!,
          degree,
          institution: "Awarding body not stated",
          year: null,
          state: "submitted" as const,
          checkedOn: null,
          sort,
        })),
      );
      for (let j = 0; j < quals.length; j += 500) await tx.insert(s.doctorQualifications).values(quals.slice(j, j + 500));

      const withFacility = batch.filter((p) => p.facility && keyFor(p.place));
      if (withFacility.length) {
        const facs = await tx
          .insert(s.facilities)
          .values(
            withFacility.map((p) => ({
              name: p.facility!.name,
              localityKey: keyFor(p.place)!,
              address: p.facility!.address,
              postalCode: p.facility!.postalCode,
              phone: p.facility!.phone,
              website: p.facility!.website,
              confirmedOn: null,
            })),
          )
          .returning({ id: s.facilities.id });
        await tx.insert(s.doctorPractices).values(
          withFacility.map((p, k) => ({
            doctorId: idByRef.get(p.ref)!,
            facilityId: facs[k].id,
            days: "",
            hours: "",
            feeInr: p.facility!.feeInr,
            feeCheckedOn: null,
            confirmedOn: null,
            phone: p.facility!.phone,
            sort: 0,
          })),
        );
      }

      await tx.insert(s.auditLogs).values(
        batch.map((p) => ({
          actorRole: "system",
          action: "doctor.imported",
          entityType: "doctor",
          entityId: idByRef.get(p.ref)!,
          reason: p.holdReasons.length ? `held as draft: ${p.holdReasons.join("; ")}` : null,
          after: {
            source: "Lybrate city listing export",
            sourceRef: p.ref,
            sourceNotes: p.sourceNotes,
            holdReasons: p.holdReasons,
            status: p.status,
            ratingsImported: false,
          },
        })),
      );
    });
    written += batch.length;
    console.log(`  ${written}/${todo.length} written`);
  }

  const pub = todo.filter((p) => p.status === "published").length;
  console.log(`\ndone: ${written} profiles written (${pub} published, ${written - pub} draft), all unclaimed, registration/qualifications "submitted" (not yet checked).`);
  console.log("next: npm run db:maintenance, then work the drafts in /admin/doctors.");
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
