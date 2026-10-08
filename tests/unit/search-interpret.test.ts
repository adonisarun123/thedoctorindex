import assert from "node:assert/strict";
import { test } from "node:test";

import { needsReading, redFlag } from "../../lib/search/interpret";

test("redFlag catches emergencies in English, Hinglish and Indian scripts", () => {
  for (const q of [
    "chest pain since morning",
    "my father can't breathe",
    "mother passed out in the bathroom",
    "slurred speech and face drooping",
    "heavy bleeding after delivery",
    "child swallowed poison",
    "seene mein dard",
    "सीने में दर्द हो रहा है",
    "ಎದೆ ನೋವು",
    "நெஞ்சு வலி",
  ]) assert.equal(redFlag(q), "emergency", q);
});

test("redFlag routes self-harm language to the mental-health notice first", () => {
  for (const q of ["I want to die", "thinking about suicide", "आत्महत्या", "kill myself chest pain"]) assert.equal(redFlag(q), "mental-health", q);
});

test("redFlag stays quiet on ordinary searches", () => {
  for (const q of ["cardiologist in indiranagar", "knee pain", "skin allergy doctor", "Dr Sharma", "epilepsy specialist", "asthma doctor near me"]) assert.equal(redFlag(q), null, q);
});

test("needsReading only sends sentences and non-Latin queries to the model", () => {
  assert.equal(needsReading("cardiology"), false);
  assert.equal(needsReading("skin doctor"), false);
  assert.equal(needsReading("my son has fever for three days"), true);
  assert.equal(needsReading("पेट दर्द"), true);
  assert.equal(needsReading("x".repeat(300)), false);
});

test("redactIdentifiers strips contact details and ID numbers but keeps the complaint", async () => {
  const { redactIdentifiers } = await import("../../lib/search/interpret");
  assert.equal(redactIdentifiers("fever 3 days call 9845012345"), "fever 3 days call [phone]");
  assert.equal(redactIdentifiers("+91 98450 12345 knee pain"), "[phone] knee pain");
  assert.equal(redactIdentifiers("me at a.b@example.com rash"), "me at [email] rash");
  assert.equal(redactIdentifiers("aadhaar 1234 5678 9012 sugar"), "aadhaar [number] sugar");
  assert.equal(redactIdentifiers("UHID 20231187 follow up"), "UHID [number] follow up");
  assert.equal(redactIdentifiers("child 2 years cough near 560102"), "child 2 years cough near 560102");
});
