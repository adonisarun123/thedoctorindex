import assert from "node:assert/strict";
import { test } from "node:test";

import { displayName, honorific, isPhysician, postnominal } from "../../lib/display-name";

test("medical, dental and AYUSH practitioners are 'Dr'", () => {
  assert.equal(displayName({ name: "Sanjana L", specialty: "gynaecology" }), "Dr Sanjana L");
  assert.equal(honorific("dentistry"), "Dr ");
  assert.equal(isPhysician("gynaecology"), true);
});

test("physiotherapists are 'Dr <Name> (PT)' and never IndividualPhysician", () => {
  assert.equal(displayName({ name: "Atharva Mishra", specialty: "physiotherapy" }), "Dr Atharva Mishra (PT)");
  assert.equal(honorific("physiotherapy"), "Dr ");
  assert.equal(postnominal("physiotherapy"), "PT");
  assert.equal(isPhysician("physiotherapy"), false);
});

test("a physiotherapist's stored degree tail or PT token is not doubled", () => {
  assert.equal(
    displayName({ name: "M. Charles Finney, PT, BPT, MPT (Neuro)", specialty: "physiotherapy" }),
    "Dr M. Charles Finney (PT)",
  );
  assert.equal(displayName({ name: "Priyanka Anarkat Pt", specialty: "physiotherapy" }), "Dr Priyanka Anarkat (PT)");
  assert.equal(displayName({ name: "PT Shiny Hepzibah S", specialty: "physiotherapy" }), "Dr Shiny Hepzibah S (PT)");
  assert.equal(displayName({ name: "Dr.sunil Reddy", specialty: "physiotherapy" }), "Dr sunil Reddy (PT)");
});

test("other allied-health professionals carry no 'Dr'", () => {
  for (const k of ["clinical-psychology", "dietetics", "audiology", "occupational-therapy"]) {
    assert.equal(honorific(k), "", k);
    assert.equal(postnominal(k), "", k);
  }
  assert.equal(displayName({ name: "Meera Rao", specialty: "dietetics" }), "Meera Rao");
});

test("a title left in the stored name is never doubled", () => {
  assert.equal(displayName({ name: "Dr. Abhishek Anand", specialtyKey: "medical-oncology" }), "Dr Abhishek Anand");
});
