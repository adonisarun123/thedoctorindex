import assert from "node:assert/strict";
import { test } from "node:test";

import { buildCityIndex, cityIn, listingsOf, localityIn, organicEvidence, practiceIn, readSerp, yearsIn } from "../../lib/nmc/serp-match";

const idx = buildCityIndex(["Bengaluru", "Mysuru", "Hubballi", "Navi Mumbai", "Mumbai"]);
const d = { name: "Ramesh Kumar", specialtyName: "Cardiology", stateName: "Karnataka", eraYear: 2005 };

test("cityIn resolves aliases and prefers the longer name", () => {
  assert.equal(cityIn("Cardiologist in Jayanagar, Bangalore", idx), "Bengaluru");
  assert.equal(cityIn("Clinic at Vashi, Navi Mumbai", idx), "Navi Mumbai");
  assert.equal(cityIn("Best doctor in Chennai", idx), null);
  assert.equal(cityIn("AIIMS, New Delhi", idx), null);
});

test("practiceIn reads where the doctor practises, not the aggregator", () => {
  assert.equal(practiceIn("Dr. Ramesh Kumar is a Cardiologist in Bengaluru and practises at Manipal Hospital, Old Airport Road."), "Manipal Hospital");
  assert.equal(practiceIn("Dr Ramesh Kumar - Cardiologist | Fortis Hospital Bannerghatta"), "Fortis Hospital Bannerghatta");
  assert.equal(practiceIn("Dr Ramesh Kumar - Cardiologist in Jayanagar | Practo"), null);
  assert.equal(practiceIn("consults at the Ramesh Kumar Heart Care Centre in Jayanagar"), "Ramesh Kumar Heart Care Centre");
  assert.equal(practiceIn("Physical Medicine & Rehabilitation, Kims Hospitals, Electronic City, Bengaluru."), "Kims Hospitals");
  assert.equal(practiceIn("03:00 PM Book Clinic Visit"), null);
  assert.equal(practiceIn("General Medicine from NBE New Delhi in 2019 and MBBS from Government Medical College"), null);
  assert.equal(practiceIn("Consultant at Karnataka Institute of Medical Sciences, Hubli"), "Karnataka Institute of Medical Sciences");
  assert.equal(practiceIn("Dr X | Medical Director"), null);
  assert.equal(practiceIn("Dr X practises at Medical College"), null);
  assert.equal(practiceIn("Dr X practises at Government Hospital"), null);
  assert.equal(practiceIn("Dr X practises at St. Philomena's Hospital"), "St. Philomena's Hospital");
  assert.equal(practiceIn("Welcome to Mitra Hospital"), null);
  assert.equal(practiceIn("Trusted Medical Specialist"), null);
  assert.equal(practiceIn("Dr X is providing quality medical service to his patients"), null);
});

test("yearsIn and localityIn", () => {
  assert.equal(yearsIn("has 21 years of experience"), 21);
  assert.equal(yearsIn("15+ yrs exp"), 15);
  assert.equal(yearsIn("since 2005"), null);
  assert.equal(localityIn("Cardiologist in Jayanagar, Bengaluru", "Bengaluru"), "Jayanagar");
  assert.equal(localityIn("Cardiologist in Jayanagar, Bangalore", "Bengaluru", idx), "Jayanagar");
  assert.equal(localityIn("at Manipal Hospital, Bengaluru", "Bengaluru"), null);
});

const org = (title: string, snippet: string, link = "https://example.com/x") => ({ title, snippet, link });

test("organic: two results agreeing on a city and one naming a practice is a match", () => {
  const e = organicEvidence(
    [org("Dr. Ramesh Kumar - Cardiologist in Jayanagar, Bangalore | Practo", "Dr. Ramesh Kumar is a Cardiologist in Jayanagar, Bangalore and has 20 years of experience. He practises at Sagar Hospital in Jayanagar, Bangalore."), org("Dr Ramesh Kumar | Sagar Hospitals", "Consultant Cardiologist, Bengaluru", "https://sagarhospitals.in/dr-ramesh"), org("Best cardiologists in Mysuru", "List of doctors")],
    d,
    idx,
  );
  assert.equal(e.status, "matched");
  assert.equal(e.city, "Bengaluru");
  assert.equal(e.locality, "Jayanagar");
  assert.equal(e.practice, "Sagar Hospital");
  assert.equal(e.urls.length, 2);
});

test("organic: one result, two cities, or a contradicting experience does not match", () => {
  assert.equal(organicEvidence([org("Dr Ramesh Kumar cardiologist Bengaluru", "practises at Sagar Hospital")], d, idx).status, "no_match");
  assert.equal(organicEvidence([org("Dr Ramesh Kumar cardiologist, Bengaluru", "practises at Sagar Hospital"), org("Dr Ramesh Kumar cardiologist, Mysuru", "practises at JSS Hospital")], d, idx).status, "ambiguous");
  const e = organicEvidence([org("Dr Ramesh Kumar cardiologist, Bengaluru", "40 years of experience, practises at Sagar Hospital"), org("Dr Ramesh Kumar cardiologist, Bengaluru", "38 years experience at Sagar Hospital")], d, idx);
  assert.equal(e.status, "no_match");
  assert.match(e.reasons[0], /years vs register/);
  // A namesake in another speciality, or a court record, is not evidence.
  const dentist = organicEvidence([org("Dr Ramesh Kumar - Dentist in Jayanagar, Bangalore", "BDS, practises at Apollo Dental Clinic"), org("Dr Ramesh Kumar Dental, Bengaluru", "dentist")], d, idx);
  assert.equal(dentist.status, "no_match");
  const court = organicEvidence([org("Ramesh Kumar vs State", "cardiologist Bengaluru, practises at Sagar Hospital", "https://indiankanoon.org/doc/1"), org("Dr Ramesh Kumar cardiologist Bengaluru", "Sagar Hospital")], d, idx);
  assert.equal(court.status, "no_match");
  const noPractice = organicEvidence([org("Dr Ramesh Kumar, Bengaluru", "cardiologist"), org("Dr Ramesh Kumar Bengaluru reviews", "cardiologist")], d, idx);
  assert.equal(noPractice.status, "no_match");
  assert.equal(noPractice.city, "Bengaluru");
});

test("listings from the local pack go through the Places rule", () => {
  const r = { places: [{ title: "Dr Ramesh Kumar Heart Clinic", address: "3rd Block, Jayanagar, Bengaluru, Karnataka 560011", category: "Cardiologist", phoneNumber: "080 1234", latitude: 12.9, longitude: 77.6, cid: "123" }], organic: [] };
  assert.equal(listingsOf(r)[0].types[0], "doctor");
  const out = readSerp(r, d, "q", idx);
  assert.equal(out.listing.status, "matched");
  assert.equal(out.listing.best?.id, "cid:123");
  const wrongState = readSerp({ places: [{ ...r.places[0], address: "Anna Nagar, Chennai, Tamil Nadu" }] }, d, "q", idx);
  assert.equal(wrongState.listing.status, "no_match");
});
