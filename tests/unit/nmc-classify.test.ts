import assert from "node:assert/strict";
import { test } from "node:test";

import { classify, cleanName, eraYearOf, nameSortedKey, readDegree, readSpecialty } from "../../lib/nmc/classify";

test("cleanName tidies register spellings without reordering tokens", () => {
  assert.equal(cleanName("JAISWAL KAMDNAYA RAMCTION ."), "Jaiswal Kamdnaya Ramction");
  assert.equal(cleanName("NILKANTA (SMT.)SHIVAKAMU ."), "Nilkanta Shivakamu");
  assert.equal(cleanName("DAVE,SOMNATH AMBASHANKAR ."), "Dave Somnath Ambashankar");
  assert.equal(cleanName("G. Mc. Subbe Gowda"), "G. Mc. Subbe Gowda");
  assert.equal(cleanName("K.P.Bhaskara Menon"), "K.P. Bhaskara Menon");
  assert.equal(cleanName("Dr. Anita Sharma"), "Anita Sharma");
  assert.equal(cleanName("Kaur (Ku) Harjeet Now Bansal (Smt.) Harjeet Kaur"), "Kaur Harjeet Now Bansal Harjeet Kaur");
});

test("cleanName rejects what is not a personal name", () => {
  assert.equal(cleanName(""), null);
  assert.equal(cleanName(" . "), null);
  assert.equal(cleanName("A B"), null);
  assert.equal(cleanName("Name missing 123"), null);
  assert.equal(cleanName("NOT AVAILABLE"), null);
  assert.equal(cleanName("x".repeat(90)), null);
});

test("nameSortedKey is order-free", () => {
  assert.equal(nameSortedKey("Sharma Anita"), nameSortedKey("Dr Anita Sharma"));
  assert.notEqual(nameSortedKey("Anita Sharma"), nameSortedKey("Anita Kumar Sharma"));
});

const cases: Array<[string, string | null, number]> = [
  ["M.D.(GENERAL MEDICINE)", "internal-medicine", 2],
  ["MD (GEN.MED.)", "internal-medicine", 2],
  ["MD (COMM.MED.)", "non-clinical-medicine", 2],
  ["DOCTOR OF MEDICINE - GENERAL MEDICINE", "internal-medicine", 2],
  ["M.S.(GENERAL SURGERY)", "general-surgery", 2],
  ["M.S. (GENL. SURG.)", "general-surgery", 2],
  ["DCH", "paediatrics", 1],
  ["DIPLOMA IN CHILD HEALTH", "paediatrics", 1],
  ["MD (PAED.)", "paediatrics", 2],
  ["MD (ANAES.)", "anaesthesiology", 2],
  ["D.A.", "anaesthesiology", 1],
  ["M.D.(RADIO DIAGNOSIS)", "radiology", 2],
  ["DMRD", "radiology", 1],
  ["D.G.O.", "gynaecology", 1],
  ["DIP.OBG", "gynaecology", 1],
  ["DIPLOMATE N.B. (OBST. & GYNAE.)", "gynaecology", 2],
  ["M.S.(ORTHOPAEDICS)", "orthopaedics", 2],
  ["D.ORTHO.", "orthopaedics", 1],
  ["MS (OPHTH.)", "ophthalmology", 2],
  ["D.O.M.S.", "ophthalmology", 1],
  ["M.S.(OTO-RHINO-LARYNGOLOGY)", "ent", 2],
  ["DLO", "ent", 1],
  ["MD (PATH.)", "pathology", 2],
  ["M.D.(MICROBIOLOGY)", "pathology", 2],
  ["M.D.(PSYCHIATRY)", "psychiatry", 2],
  ["DPM", "psychiatry", 1],
  ["MD (DERM., VEN. & LEPROSY)", "dermatology", 2],
  ["DDVL", "dermatology", 1],
  ["DTCD", "pulmonology", 1],
  ["MD (T.B. & CHEST)", "pulmonology", 2],
  ["DM (CARDIOLOGY)", "cardiology", 3],
  ["M.CH.(NEURO SURGERY)", "neurosurgery", 3],
  ["DM (NEUROLOGY)", "neurology", 3],
  ["M.CH. (CARDIO THORACIC SURGERY)", "cardiothoracic-surgery", 3],
  ["M.CH (UROLOGY)", "urology", 3],
  ["DM (NEPHROLOGY)", "nephrology", 3],
  ["DM (GASTROENTEROLOGY)", "gastroenterology", 3],
  ["M.CH. (SURGICAL GASTROENTEROLOGY)", "gi-surgery", 3],
  ["M.CH (PLASTIC SURGERY)", "plastic-surgery", 3],
  ["M.CH (PAEDIATRIC SURGERY)", "paediatric-surgery", 3],
  ["M.CH (SURGICAL ONCOLOGY)", "surgical-oncology", 3],
  ["DM (MEDICAL ONCOLOGY)", "medical-oncology", 3],
  ["MD (RADIOTHERAPY)", "radiation-oncology", 2],
  ["DM (ENDOCRINOLOGY)", "endocrinology", 3],
  ["MD (EMERGENCY MEDICINE)", "emergency-medicine", 2],
  ["MD (COMMUNITY MEDICINE)", "non-clinical-medicine", 2],
  ["MD (PHARMACOLOGY)", "non-clinical-medicine", 2],
  ["MD (FORENSIC MEDICINE)", "non-clinical-medicine", 2],
  ["M.D. (PHYSICAL MEDICINE & REHABILITATION)", "physical-medicine-rehabilitation", 2],
  ["DNB (FAMILY MEDICINE)", "general-practice", 2],
  ["MD (TRANSFUSION MEDICINE)", "pathology", 2],
  ["DM (CRITICAL CARE)", "critical-care", 3],
];

for (const [degree, key, rank] of cases) {
  test(`readDegree ${degree} → ${key} r${rank}`, () => {
    const r = readDegree(degree);
    assert.equal(r.key, key);
    assert.equal(r.rank, rank);
  });
}

test("readDegree leaves primaries, bare PG degrees and junk alone", () => {
  for (const d of ["MBBS", "M.B.B.S.", "M B B S", "- MBBS -", "BACHELOR OF MEDICINE, BACHELOR", "MD PHYSICIAN", "M.D.'PHYSICIAN'", "DOCTOR OF MEDICINE - EQUIVALEN", "LMP", "L.C.P.S.", "M.B.B.Ch."]) {
    assert.deepEqual(readDegree(d, "primary"), { key: null, rank: 0, pgUnspecified: false }, d);
  }
  for (const d of ["MD", "M.S", "DNB", "D.M", "M.CH", "DOCTOR OF MEDICINE"]) {
    const r = readDegree(d);
    assert.equal(r.key, null, d);
    assert.equal(r.pgUnspecified, true, d);
  }
  for (const d of ["-", "#N/A", "NULL", "", "CERTIFICATE OF WEST BENGAL STA"]) {
    assert.equal(readDegree(d).key, null, d);
    assert.equal(readDegree(d).pgUnspecified, false, d);
  }
});

test("readSpecialty takes the highest-ranked degree", () => {
  const { reading } = readSpecialty("MBBS", ["DCH", "MD (PAEDIATRICS)", "DM (NEONATOLOGY)"]);
  assert.equal(reading?.key, "paediatrics");
  assert.equal(reading?.rank, 2);
  const r2 = readSpecialty("MBBS", ["MD (MEDICINE)", "DM (CARDIOLOGY)"]);
  assert.equal(r2.reading?.key, "cardiology");
  assert.equal(r2.reading?.basis, "DM (CARDIOLOGY)");
});

test("eraYearOf ignores the registration date when a qualification carries a year", () => {
  assert.equal(eraYearOf({ primaryYear: 1942, registrationYear: 2024, additional: [] }), 1942);
  assert.equal(eraYearOf({ primaryYear: 1942, registrationYear: 2024, additional: [{ degree: "DCH", year: 1950 }] }), 1950);
  assert.equal(eraYearOf({ primaryYear: null, registrationYear: 2019, additional: [] }), 2019);
  assert.equal(eraYearOf({ primaryYear: 2088, registrationYear: 1, additional: [] }), null);
});

test("classify orders the gates: struck-off, number, name, era, degree", () => {
  const base = { name: "Anita Sharma", number: "12345", removed: false, primaryQualification: "MBBS", primaryYear: 2005, registrationYear: 2006, additional: [] as Array<{ degree: string; year: number | null }> };
  assert.equal(classify(base).category, "mbbs-only");
  assert.equal(classify({ ...base, additional: [{ degree: "MD (GENERAL MEDICINE)", year: 2010 }] }).category, "specialist");
  assert.equal(classify({ ...base, additional: [{ degree: "DM (CARDIOLOGY)", year: 2013 }] }).category, "superspecialist");
  assert.equal(classify({ ...base, additional: [{ degree: "DCH", year: 2008 }] }).category, "diploma-specialist");
  assert.equal(classify({ ...base, additional: [{ degree: "MD", year: 2010 }] }).category, "pg-unspecified");
  assert.equal(classify({ ...base, primaryYear: 1962, additional: [{ degree: "MD (GENERAL MEDICINE)", year: 1966 }] }).category, "pre-1980");
  assert.equal(classify({ ...base, removed: true }).category, "struck-off");
  assert.equal(classify({ ...base, number: " " }).category, "no-number");
  assert.equal(classify({ ...base, name: "." }).category, "name-unusable");
  assert.equal(classify({ ...base, primaryYear: null, registrationYear: null }).eraYear, null);
});
