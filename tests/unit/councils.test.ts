import assert from "node:assert/strict";
import { test } from "node:test";

import { COUNCIL_NAMES, councilKind, isMedicalCouncil, registrationNoun } from "../../lib/data/councils";
import { councilId } from "../../lib/enrich/nmc";

test("every listed body classifies into its own group", () => {
  assert.equal(councilKind("Karnataka Medical Council"), "medical");
  assert.equal(councilKind("Karnataka State Dental Council"), "dental");
  assert.equal(councilKind("National Commission for Indian System of Medicine"), "ayush");
  assert.equal(councilKind("Indian Association of Physiotherapists"), "allied");
  assert.equal(councilKind("Maharashtra State Council for Occupational Therapy and Physiotherapy"), "allied");
});

test("unlisted bodies are still accepted and classified by wording", () => {
  assert.equal(councilKind("Kerala State Dental Council"), "dental");
  assert.equal(councilKind("Some Physiotherapy Council"), "allied");
  assert.equal(councilKind("Goa Medical Council"), "medical");
  assert.equal(councilKind("Random Society"), "other");
  assert.equal(councilKind(null), "other");
});

test("only medical councils go to the NMC register", () => {
  for (const c of COUNCIL_NAMES) {
    const medical = isMedicalCouncil(c);
    const id = councilId(c);
    if (medical) assert.ok(id !== null, `${c} should map to a register council id`);
    else assert.equal(id, null, `${c} must not be searched on the NMC register`);
  }
});

test("registration noun follows the body", () => {
  assert.equal(registrationNoun("Tamil Nadu Medical Council"), "Medical registration");
  assert.equal(registrationNoun("Indian Association of Physiotherapists"), "Professional registration");
});
