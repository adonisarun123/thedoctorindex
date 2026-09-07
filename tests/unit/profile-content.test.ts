import assert from "node:assert/strict";
import { test } from "node:test";

import { addressLine, buildFaq, facilityLabel, summarySentence } from "../../lib/seo/profile-content";
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
  assert.ok(faqs.length >= 6 && faqs.length <= 7);
  assert.ok(faqs.every((f) => f.q.endsWith("?") && f.a.length > 20));
  const bare = { ...d!, practices: d!.practices.map((p) => ({ ...p, feeInr: null, feeCheckedOn: null, days: "", hours: "" })) };
  const fee = buildFaq(bare).find((f) => f.q.includes("fee"))!.a;
  assert.match(fee, /has not been confirmed/);
  const timing = buildFaq(bare).find((f) => f.q.includes("timings"))!.a;
  assert.match(timing, /not on record/);
});
