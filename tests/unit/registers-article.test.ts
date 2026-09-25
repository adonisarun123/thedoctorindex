import assert from "node:assert/strict";
import { test } from "node:test";

import { article } from "../../lib/registers";

test("articles follow the sound of the name, not its first letter", () => {
  assert.equal(article("KMC"), "a");
  assert.equal(article("RCI"), "an");
  assert.equal(article("MPMC"), "an");
  assert.equal(article("HMC"), "an");
  assert.equal(article("UPMC"), "a");
  assert.equal(article("NCISM"), "an");
  assert.equal(article("Assam Medical Council"), "an");
  assert.equal(article("Uttarakhand Medical Council"), "an");
  assert.equal(article("Karnataka State Dental Council"), "a");
  assert.equal(article("Indian Association of Physiotherapists"), "an");
});
