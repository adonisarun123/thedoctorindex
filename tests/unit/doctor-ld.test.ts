import assert from "node:assert/strict";
import { test } from "node:test";

import { SEED_DOCTORS } from "../../lib/data/doctors";
import { doctorLd } from "../../lib/seo/structured-data";
import { seedSource } from "../../lib/data/seed-source";
import type { DoctorView } from "../../lib/types";

/**
 * Regression guards for claims the markup must never make up. Before 16 Sep
 * 2026 every record without a gender on file (24,440 of 24,445) was published
 * as `gender: Female`, and every record without a council registration number
 * (17,201) carried an `identifier` whose value was the display em dash.
 */
const base = { ...SEED_DOCTORS.find((d) => d.status === "active")!, slug: "seed-doctor" } as unknown as DoctorView;

const mainEntity = (d: DoctorView) => (doctorLd(d) as { mainEntity: Record<string, unknown> }).mainEntity;

test("gender is omitted rather than guessed when none is on record", () => {
  assert.equal(mainEntity({ ...base, gender: "F" }).gender, "Female");
  assert.equal(mainEntity({ ...base, gender: "M" }).gender, "Male");
  assert.ok(!("gender" in mainEntity({ ...base, gender: null })), "no gender key when unknown");
});

test("a registration identifier is emitted only for a real number", () => {
  const withNumber = mainEntity({ ...base, registration: { ...base.registration, number: "KMC/12345", council: "Karnataka Medical Council" } });
  assert.equal((withNumber.identifier as { value: string }).value, "KMC/12345");

  for (const number of ["", "—"]) {
    const none = mainEntity({ ...base, registration: { ...base.registration, number } });
    assert.ok(!("identifier" in none), `no identifier for number ${JSON.stringify(number)}`);
  }
});

test("hasCredential is dropped rather than emitted empty", () => {
  const unverified = mainEntity({ ...base, qualifications: base.qualifications.map((q) => ({ ...q, state: "submitted" as const })) });
  assert.ok(!("hasCredential" in unverified));
  const verified = mainEntity({ ...base, qualifications: base.qualifications.map((q) => ({ ...q, state: "verified" as const })) });
  assert.ok(Array.isArray(verified.hasCredential) && (verified.hasCredential as unknown[]).length > 0);
});

test("aggregateRating is emitted only from a real rollup, and never per review", async () => {
  const [first] = await seedSource.getListing("cardiology", {}, 1);
  const d = (await seedSource.getDoctorBySlug(first.slug))!;

  const none = doctorLd({ ...d, rating: { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] } } as typeof d) as Record<string, any>;
  assert.equal("aggregateRating" in (none.mainEntity as Record<string, unknown>), false);

  const rated = doctorLd({ ...d, rating: { average: 4.26, count: 17, distribution: [0, 1, 2, 5, 9] } } as typeof d) as Record<string, any>;
  const agg = (rated.mainEntity as Record<string, any>).aggregateRating;
  assert.equal(agg.ratingValue, 4.3);
  assert.equal(agg.reviewCount, 17);
  assert.equal(agg.bestRating, 5);
  // Individual reviews carry four dimension scores and no overall star, so no
  // per-review rating may appear anywhere in the graph.
  assert.ok(!JSON.stringify(rated).includes('"reviewRating"'));
  assert.ok(!JSON.stringify(rated).includes('"Review"'));
});

test("only credentials checked with the issuer reach structured data", async () => {
  const [first] = await seedSource.getListing("cardiology", {}, 1);
  const base = (await seedSource.getDoctorBySlug(first.slug))!;
  const d = {
    ...base,
    credentials: [
      { id: "a1", kind: "award" as const, title: "Young Investigator Award", issuer: "Cardiological Society of India", year: 2016, url: null, state: "verified" as const },
      { id: "a2", kind: "award" as const, title: "Clinician of the Year", issuer: "Somewhere", year: 2021, url: null, state: "submitted" as const },
      { id: "m1", kind: "membership" as const, title: "Fellow", issuer: "Royal College", year: null, url: null, state: "verified" as const },
      { id: "m2", kind: "membership" as const, title: "Member", issuer: "Unchecked Society", year: null, url: null, state: "submitted" as const },
      { id: "p1", kind: "publication" as const, title: "Radial versus femoral access", issuer: "Indian Heart Journal", year: 2019, url: "https://example.org/x", state: "verified" as const },
      { id: "p2", kind: "publication" as const, title: "Unchecked paper", issuer: null, year: null, url: null, state: "submitted" as const },
    ],
  };
  const ld = doctorLd(d as typeof base) as Record<string, any>;
  const me = ld.mainEntity as Record<string, any>;
  const json = JSON.stringify(ld);

  assert.deepEqual(me.award, ["Young Investigator Award, Cardiological Society of India, 2016"]);
  assert.deepEqual(me.memberOf, [{ "@type": "Organization", name: "Royal College" }]);
  assert.equal(me.subjectOf.length, 1);
  assert.equal(me.subjectOf[0]["@type"], "ScholarlyArticle");
  assert.equal(me.subjectOf[0].url, "https://example.org/x");

  // Nothing the doctor merely asserted is published as a credential.
  for (const unchecked of ["Clinician of the Year", "Unchecked Society", "Unchecked paper"]) {
    assert.ok(!json.includes(unchecked), `${unchecked} must not appear in the graph`);
  }

  // A profile with nothing checked emits none of these keys at all.
  const noneChecked = doctorLd({ ...d, credentials: d.credentials.filter((c) => c.state === "submitted") } as typeof base) as Record<string, any>;
  for (const key of ["award", "memberOf", "subjectOf"]) assert.equal(key in (noneChecked.mainEntity as Record<string, unknown>), false, key);
});
