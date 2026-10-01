import assert from "node:assert/strict";
import { test } from "node:test";

import { actionFor, parseQuery } from "../../lib/nmc/claim-search";

test("parseQuery reads a registration number", () => {
  assert.deepEqual(parseQuery("KMC-58412"), { kind: "number", number: "KMC58412" });
  assert.deepEqual(parseQuery("58412"), { kind: "number", number: "58412" });
  assert.deepEqual(parseQuery("  HN 5069 "), { kind: "number", number: "HN5069" });
});

test("parseQuery reads a name, dropping the title", () => {
  const q = parseQuery("Dr. Anil Kumar Rao");
  assert.equal(q.kind, "name");
  if (q.kind === "name") assert.deepEqual(q.tokens, ["anil", "kumar", "rao"]);
});

test("parseQuery refuses a one-word name and short input", () => {
  assert.equal(parseQuery("Rao").kind, "invalid");
  assert.equal(parseQuery("ab").kind, "invalid");
  assert.equal(parseQuery("Dr. Rao").kind, "invalid");
});

test("parseQuery does not treat a name with a stray digit as a number", () => {
  assert.equal(parseQuery("Anil Kumar Rao 2").kind, "name");
});

const doc = (over: Partial<{ slug: string; status: string; claimed: boolean; mergedIntoId: string | null }> = {}) => ({ slug: "a-b-123456", status: "published", claimed: false, mergedIntoId: null, ...over });

test("actionFor never offers a struck-off registration, whatever profile exists", () => {
  assert.deepEqual(actionFor(true, doc()), { kind: "removed" });
  assert.deepEqual(actionFor(true, null), { kind: "removed" });
});

test("actionFor offers creation when no profile exists", () => {
  assert.deepEqual(actionFor(false, null), { kind: "create" });
});

test("actionFor offers a claim on a published or draft unclaimed profile", () => {
  assert.deepEqual(actionFor(false, doc()), { kind: "claim-published", slug: "a-b-123456" });
  assert.deepEqual(actionFor(false, doc({ status: "draft" })), { kind: "claim-draft" });
});

test("actionFor shows a claimed profile only when it is public", () => {
  assert.deepEqual(actionFor(false, doc({ claimed: true })), { kind: "claimed", slug: "a-b-123456" });
  assert.deepEqual(actionFor(false, doc({ claimed: true, status: "draft" })), { kind: "claimed", slug: null });
});

test("actionFor leaves suspended and retired profiles alone", () => {
  assert.deepEqual(actionFor(false, doc({ status: "suspended" })), { kind: "unavailable" });
  assert.deepEqual(actionFor(false, doc({ status: "retired" })), { kind: "unavailable" });
});
