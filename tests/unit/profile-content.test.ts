import assert from "node:assert/strict";
import { test } from "node:test";

import { addressLine, buildFaq, facilityLabel, summarySentence, supplySentence } from "../../lib/seo/profile-content";
import { seedSource } from "../../lib/data/seed-source";

test("facility and address lines say each part once", () => {
  const p = { facility: "Dr. Agrawal Clinic, Indore", address: "Dr. Agrawal Clinic, Shop No.31, Nagar Nigam Market, Near Janjeerwala Chowk, Indore", postalCode: "", city: "Indore" };
  assert.equal(facilityLabel(p), "Dr. Agrawal Clinic");
  assert.equal(addressLine(p), "Dr. Agrawal Clinic, Shop No.31, Nagar Nigam Market, Near Janjeerwala Chowk, Indore");
  assert.equal(addressLine({ facility: "Medlilly", address: "Cherukode", postalCode: "676542", city: "Malappuram" }), "Medlilly, Cherukode, 676542, Malappuram");
});

test("summary and FAQ are built from the record and never invent a fee or a timing", async () => {
  const [first] = await seedSource.getListing("cardiology", {}, 1);
  const d = await seedSource.getDoctorBySlug(first.slug);
  assert.ok(d);
  const summary = summarySentence(d!);
  assert.match(summary, new RegExp(`^Dr ${d!.name} is `));
  assert.match(summary, /Registered with the .* checked against the register on/);
  const faqs = buildFaq(d!);
  assert.ok(faqs.length >= 11 && faqs.length <= 12, `unexpected FAQ count ${faqs.length}`);
  assert.equal(new Set(faqs.map((f) => f.q)).size, faqs.length, "FAQ questions must be unique");
  assert.ok(faqs.every((f) => f.q.endsWith("?") && f.a.length > 20));
  const bare = { ...d!, practices: d!.practices.map((p) => ({ ...p, feeInr: null, feeCheckedOn: null, days: "", hours: "" })) };
  const fee = buildFaq(bare).find((f) => f.q.includes("fee"))!.a;
  assert.match(fee, /has not been confirmed/);
  const timing = buildFaq(bare).find((f) => f.q.includes("timings"))!.a;
  assert.match(timing, /not on record/);
});

test("the extra FAQ answers state an absence rather than filling it in", async () => {
  const [first] = await seedSource.getListing("cardiology", {}, 1);
  const d = (await seedSource.getDoctorBySlug(first.slug))!;
  const bare: typeof d = { ...d, languages: [], modes: [], practiceStartYear: 0, yearsOfExperience: 0, claimed: false };
  const by = (needle: string) => buildFaq(bare).find((f) => f.q.includes(needle))!.a;
  assert.match(by("languages"), /No consultation languages are on record/);
  assert.match(by("online"), /not on record/);
  assert.match(by("practising"), /not on record|does not state years of experience/);
  assert.match(by("claimed this profile"), /^No\./);
  assert.match(by("check"), /National Medical Commission register/);
  // Nothing in the extra answers may assert a fact the record does not hold.
  for (const f of buildFaq(bare)) assert.ok(!/probably|likely|one of the best|highly experienced/i.test(f.a), f.q);
});

test("supply sentence uses measured counts and stays silent when there are none", async () => {
  const [first] = await seedSource.getListing("cardiology", {}, 1);
  const d = (await seedSource.getDoctorBySlug(first.slug))!;
  assert.equal(supplySentence(d, { locality: 0, city: 0, cityAllSpecialties: 0 }), null);
  const one = supplySentence(d, { locality: 1, city: 12, cityAllSpecialties: 400 })!;
  assert.match(one, /is the only /);
  assert.match(one, /12/);
  assert.match(one, /not of every doctor practising there/);
  const many = supplySentence(d, { locality: 9, city: 12, cityAllSpecialties: 400 })!;
  assert.match(many, /^9 /);
  assert.ok(!many.includes("undefined") && !many.includes("NaN"));
  const placeless = supplySentence({ ...d, practices: [] }, { locality: 5, city: 5, cityAllSpecialties: 5 });
  assert.equal(placeless, null);
});
