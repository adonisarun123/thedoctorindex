import assert from "node:assert/strict";
import { test } from "node:test";

import { cleanPersonName, slugify } from "../../lib/services/doctors";

test("honorifics come off the stored name, with or without a space", () => {
  assert.equal(cleanPersonName("Dr Vijay Kumar Prasad"), "Vijay Kumar Prasad");
  assert.equal(cleanPersonName("Dr. Bhavsagar Neena"), "Bhavsagar Neena");
  assert.equal(cleanPersonName("Dr.Abhishek Anand"), "Abhishek Anand");
  assert.equal(cleanPersonName("DR.  Soni D.K."), "Soni D.K.");
  assert.equal(cleanPersonName("Dr. Prof. Meera Iyer"), "Meera Iyer");
  assert.equal(cleanPersonName("  Ananya   Rao  "), "Ananya Rao");
});

test("a name that merely starts with those letters is left alone", () => {
  for (const n of ["Drishti Sharma", "Mrinalini Bose", "Mستafa", "Missa Kaur", "Drona Acharya"]) {
    assert.equal(cleanPersonName(n), n.replace(/\s+/g, " ").trim(), n);
  }
});

test("cleaning the name removes the honorific from the slug too", () => {
  assert.equal(slugify(cleanPersonName("Dr.Abhishek Anand"), "7440ea"), "abhishek-anand-7440ea");
});
