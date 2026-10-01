import assert from "node:assert/strict";
import { test } from "node:test";

import { credentialsFromRoster, degreeFamily, pickByCredentials } from "../../lib/nmc/disambiguate";

test("degreeFamily reads whole degree words only", () => {
  assert.equal(degreeFamily("M.D."), "md");
  assert.equal(degreeFamily("MS"), "ms");
  assert.equal(degreeFamily("D.N.B"), "dnb");
  assert.equal(degreeFamily("DM"), "dm");
  assert.equal(degreeFamily("DMRD"), "diploma");
  assert.equal(degreeFamily("M.Ch"), "mch");
  assert.equal(degreeFamily("MBBS"), "mbbs");
});

test("credentialsFromRoster pairs a degree with the year in its own string", () => {
  const c = credentialsFromRoster(["MBBS 1977 MAMC", "India MD 1981 MAMC", "MRCP(UK) 1995 Royal College of Physicians"]);
  assert.deepEqual(c.filter((x) => x.family !== "other"), [{ family: "mbbs", year: 1977 }, { family: "md", year: 1981 }]);
});

test("credentialsFromRoster reads dashes and 'passed in' forms", () => {
  const c = credentialsFromRoster(["MBBS – 1984 (All India Institute of Medical Sciences", "MS (Gen. Surgery) passed in 1999 from South Gujarat University"]);
  assert.ok(c.some((x) => x.family === "mbbs" && x.year === 1984));
  assert.ok(c.some((x) => x.family === "ms" && x.year === 1999));
});

test("credentialsFromRoster does not carry a year over from another string", () => {
  assert.deepEqual(credentialsFromRoster(["MBBS", "Experience 25 years"]), []);
});

const a = { key: "a", quals: [{ degree: "MBBS", year: 1977 }, { degree: "MD(Medicine)", year: 1981 }] };
const b = { key: "b", quals: [{ degree: "MBBS", year: 1990 }, { degree: "MD", year: 1994 }] };

test("pickByCredentials picks the one candidate that shares a postgraduate degree and year", () => {
  assert.equal(pickByCredentials(["MBBS 1977 MAMC", "MD 1981 MAMC"], [a, b]), "a");
});

test("pickByCredentials declines when the roster shares nothing", () => {
  assert.equal(pickByCredentials(["MD 2005 AIIMS"], [a, b]), null);
});

test("pickByCredentials declines when two candidates both match", () => {
  assert.equal(pickByCredentials(["MD 1981 AIIMS"], [a, { key: "c", quals: [{ degree: "MD", year: 1981 }] }]), null);
});

test("pickByCredentials declines when the roster has no years", () => {
  assert.equal(pickByCredentials(["MBBS", "MD"], [a, b]), null);
});

test("pickByCredentials does not accept a lone MBBS year", () => {
  assert.equal(pickByCredentials(["MBBS 1977"], [a, b]), null);
});

test("pickByCredentials accepts two non-postgraduate matches", () => {
  const d = { key: "d", quals: [{ degree: "MBBS", year: 1977 }, { degree: "DGO", year: 1980 }] };
  assert.equal(pickByCredentials(["MBBS 1977", "DGO 1980"], [d, b]), "d");
});
