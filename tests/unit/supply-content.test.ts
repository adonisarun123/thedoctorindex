import assert from "node:assert/strict";
import { test } from "node:test";

import type { SupplyProfile } from "../../lib/data/index";
import {
  concentrationSentence,
  councilSentence,
  gapSentence,
  listingFaq,
  placementSentence,
  qualificationSentence,
  share,
  singletonSentence,
  subspecialtySentence,
  supplyFacts,
  verificationSentence,
} from "../../lib/content/supply";

/**
 * These guard one rule: a browse page says only what its own records support.
 *
 * The failure mode being tested for is not a crash — it is a sentence that
 * renders on 8,715 listing pages with a place name swapped in and a zero where
 * a number should be. Every helper must return null rather than produce one.
 */

const empty: SupplyProfile = {
  total: 0,
  withRegistration: 0,
  registerChecked: 0,
  claimed: 0,
  withAbout: 0,
  withExperience: 0,
  medianYears: null,
  facilities: 0,
  localities: 0,
  withFee: 0,
  feeMin: null,
  feeMax: null,
  qualifications: [],
  councils: [],
  subspecialties: [],
};

/** Indore general practice, as measured on 21 Sep 2026. */
const indore: SupplyProfile = {
  ...empty,
  total: 719,
  withRegistration: 142,
  registerChecked: 138,
  withAbout: 70,
  facilities: 719,
  localities: 95,
  qualifications: [
    { name: "MBBS", n: 715 },
    { name: "FRCS", n: 4 },
  ],
  councils: [{ name: "Madhya Pradesh Medical Council", n: 141 }],
};

/** A locality page holding exactly one doctor — 3,856 combinations look like this. */
const single: SupplyProfile = { ...empty, total: 1, facilities: 1, localities: 1 };

test("nothing is said about a place with no records", () => {
  assert.equal(placementSentence(empty, "1 cardiologist", "Indiranagar"), null);
  assert.equal(verificationSentence(empty), null);
  assert.equal(qualificationSentence(empty), null);
  assert.equal(councilSentence(empty), null);
  assert.equal(subspecialtySentence(empty), null);
  assert.equal(gapSentence(empty), null);
  assert.deepEqual(supplyFacts(empty), []);
  assert.deepEqual(listingFaq(empty, { one: "Cardiologist", plural: "Cardiologists" }, "Indiranagar", []), []);
});

test("percentages are withheld below the sample floor", () => {
  assert.equal(share(1, 2), null, "one doctor in two is not 50%");
  assert.equal(share(19, 19), null);
  assert.equal(share(142, 719), "20%");
  assert.equal(share(1, 500), "under 1%");
  assert.equal(share(0, 500), null);
});

test("a one-doctor page states the one record without dressing it as a mix", () => {
  const s = placementSentence(single, "1 cardiologist", "Indiranagar, Bengaluru");
  assert.ok(s?.includes("1 cardiologist"));
  assert.ok(s?.includes("one locality"));
  assert.equal(qualificationSentence({ ...single, qualifications: [{ name: "MBBS", n: 1 }] }), null, "one degree is not a distribution");
  assert.equal(gapSentence(single), null);
  const v = verificationSentence(single);
  assert.ok(v?.startsWith("Of the single record"));
  assert.ok(v?.includes("no record here carries a council registration number yet"));
});

test("verification is reported as records checked, never as a quality claim", () => {
  const v = verificationSentence(indore)!;
  assert.ok(v.includes("142 (20%) carry a council registration number on record"));
  assert.ok(v.includes("138 of those have been checked against a register"));
  assert.ok(!/verified/i.test(v), "the sentence must not use the word verified");
});

test("fact rows appear only where the field holds data", () => {
  const labels = supplyFacts(indore).map((f) => f.label);
  assert.ok(labels.includes("Profiles"));
  assert.ok(labels.includes("Registration on record"));
  assert.ok(!labels.includes("Consultation fee"), "no fee is recorded, so no fee row");
  assert.ok(!labels.includes("Median years in practice"), "no start year is recorded, so no experience row");

  assert.ok(
    !supplyFacts({ ...indore, withExperience: 4, medianYears: 18 }).some((f) => f.label === "Median years in practice"),
    "a median drawn from 4 of 4,186 profiles is a fact about four doctors, not about Indore",
  );
  const withExp = supplyFacts({ ...indore, withExperience: 220, medianYears: 18 });
  assert.equal(withExp.find((f) => f.label === "Median years in practice")?.value, "18");

  const withFee = supplyFacts({ ...indore, withFee: 12, feeMin: 300, feeMax: 1200 });
  const fee = withFee.find((f) => f.label === "Consultation fee");
  assert.equal(fee?.value, "₹300–₹1,200");
  assert.ok(fee?.note?.includes("12 profiles"));
});

test("a distribution needs at least two entries to be described", () => {
  const noun = { singular: "locality", plural: "localities" };
  assert.equal(concentrationSentence([{ name: "Vijay Nagar", n: 40 }], 719, noun), null);
  assert.equal(concentrationSentence([], 719, noun), null);
  const s = concentrationSentence([{ name: "Vijay Nagar", n: 40 }, { name: "Palasia", n: 30 }], 719, noun)!;
  assert.ok(s.includes("Vijay Nagar (40)") && s.includes("Palasia (30)"));
  assert.ok(s.includes("10% of the records here"));

  // Records with no locality on file land on the locality carrying the city's
  // own name, which would otherwise top every city's distribution with itself.
  const withCityBucket = [{ name: "Indore", n: 1236 }, { name: "Vijay Nagar", n: 245 }, { name: "Ab Road", n: 170 }, { name: "Mhow", n: 90 }];
  const dropped = concentrationSentence(withCityBucket, 4186, noun, "Indore")!;
  assert.ok(!dropped.includes("Indore (1,236)"), "the city's own bucket must not be reported as its best-supplied locality");
  assert.ok(dropped.includes("Vijay Nagar (245)") && dropped.includes("Mhow (90)"));

  const keptFaq = listingFaq({ ...indore }, { one: "General physician", plural: "General physicians" }, "Indore", withCityBucket, "Indore")
    .find((f) => f.q.startsWith("Where in"))!;
  assert.ok(!keptFaq.a.includes("Indore (1,236)"));
  assert.equal(singletonSentence([{ name: "a", n: 1 }], noun), null);
  assert.equal(
    singletonSentence([{ name: "a", n: 1 }, { name: "b", n: 1 }, { name: "c", n: 4 }, { name: "d", n: 9 }], noun),
    "2 localities hold a single record.",
  );
});

test("the FAQ asks only questions its data can answer", () => {
  const s = { one: "General physician", plural: "General physicians" };
  const thin = listingFaq(single, s, "Indiranagar, Bengaluru", []);
  assert.equal(thin.length, 2, "a one-doctor page gets the count and the verification question, nothing else");
  assert.ok(thin[1].a.includes("No record on this page carries a council registration number yet"));

  const rich = listingFaq(indore, s, "Indore", [
    { name: "Vijay Nagar", n: 40 },
    { name: "Palasia", n: 30 },
  ]);
  const qs = rich.map((f) => f.q);
  assert.ok(qs.some((q) => q.startsWith("How many general physicians are listed in Indore")));
  assert.ok(qs.some((q) => q.includes("Which councils")));
  assert.ok(qs.some((q) => q.includes("Where in Indore")));
  assert.ok(!qs.some((q) => q.includes("consultation cost")), "no fee data, so no fee question");
  for (const f of rich) assert.ok(f.a.trim().length > 30, `answer to "${f.q}" is too short to be an answer`);
});

test("every answer carries a figure from this page's own records", () => {
  const rich = listingFaq(indore, { one: "General physician", plural: "General physicians" }, "Indore", [
    { name: "Vijay Nagar", n: 40 },
    { name: "Palasia", n: 30 },
  ]);
  for (const f of rich) {
    assert.match(f.a, /\d/, `answer to "${f.q}" contains no measured figure — it would be identical on every page`);
  }
});

test("the gap sentence names what is missing rather than implying completeness", () => {
  const g = gapSentence(indore)!;
  assert.ok(g.includes("577 without a registration number on record"));
  assert.ok(g.includes("649 without a written profile"));
  assert.ok(g.includes("719 without a recorded practice start year"));
});
