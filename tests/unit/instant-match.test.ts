import assert from "node:assert/strict";
import { test } from "node:test";

import { accountNameMatches } from "../../lib/nmc/instant-match";

const ok = (reg: string, acc: string) => assert.equal(accountNameMatches(reg, acc).ok, true, `${acc} ↔ ${reg} should match`);
const no = (reg: string, acc: string) => assert.equal(accountNameMatches(reg, acc).ok, false, `${acc} ↔ ${reg} should not match`);

test("same person, register order and initials", () => {
  ok("RAO ASHA K", "Asha Rao");
  ok("ASHA K RAO", "Dr. Asha Rao");
  ok("ASHA K RAO", "Asha Krishna Rao");
  ok("AGRAWAL ASHOK", "Ashok Agrawal");
  ok("RAMESH K", "Ramesh K");
});

test("a middle or maiden name the doctor drops is allowed once", () => {
  ok("ASHA RANI RAO", "Asha Rao");
  no("ASHA RANI DEVI RAO", "Asha Rao");
});

test("near spellings of long words agree", () => {
  ok("MOHAMMAD IRFAN KHAN", "Mohammed Irfan Khan");
  ok("SRINIVAS MURTHY", "Shrinivas Murthy");
});

test("different people are refused", () => {
  no("ASHA RAO", "Asha Shetty");
  no("RAJESH KUMAR", "Rakesh Kumar");
  no("RAMESH NAIR", "Rajesh Nair");
  no("ASHA RAO", "A Rao");
  no("ASHA RAO", "Asha");
  no("ASHA RAO", "");
});

test("one register word cannot satisfy two account words", () => {
  no("ASHA RAO", "Asha Asha Rao Rao Kumar");
});
