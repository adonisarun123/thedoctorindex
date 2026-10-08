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
