import assert from "node:assert/strict";
import { test } from "node:test";

import { displayName, honorific } from "../../lib/display-name";

test("medical, dental and AYUSH practitioners are 'Dr'", () => {
  assert.equal(displayName({ name: "Sanjana L", specialty: "gynaecology" }), "Dr Sanjana L");
  assert.equal(honorific("dentistry"), "Dr ");
});

test("allied-health professionals carry no 'Dr'", () => {
  for (const k of ["physiotherapy", "clinical-psychology"]) {
    assert.equal(honorific(k), "", k);
  }
  assert.equal(displayName({ name: "Atharva Mishra", specialty: "physiotherapy" }), "Atharva Mishra");
});

test("a title left in the stored name is never doubled", () => {
  assert.equal(displayName({ name: "Dr. Abhishek Anand", specialtyKey: "medical-oncology" }), "Dr Abhishek Anand");
});
