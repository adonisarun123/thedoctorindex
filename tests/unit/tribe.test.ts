import assert from "node:assert/strict";
import { test } from "node:test";

import { financialYear, inviteMessage, joinPath, levelFor, parseReferralCode, progressFor, rewardFor, tribeChannel } from "../../lib/tribe";

test("levels: ten verified per level, capped at the maximum", () => {
  assert.equal(levelFor(0, 10, 50), 0);
  assert.equal(levelFor(9, 10, 50), 0);
  assert.equal(levelFor(10, 10, 50), 1);
  assert.equal(levelFor(19, 10, 50), 1);
  assert.equal(levelFor(500, 10, 50), 50);
  assert.equal(levelFor(5000, 10, 50), 50);
  assert.equal(levelFor(-3, 10, 50), 0);
});

test("progress reports the next threshold and percentage", () => {
  const p = progressFor(13, 10, 50);
  assert.equal(p.level, 1);
  assert.equal(p.nextAt, 20);
  assert.equal(p.remaining, 7);
  assert.equal(p.pct, 30);
  assert.equal(p.maxed, false);
  const top = progressFor(700, 10, 50);
  assert.equal(top.level, 50);
  assert.equal(top.remaining, 0);
  assert.equal(top.pct, 100);
  assert.equal(top.maxed, true);
});

test("codes: DR + six unambiguous characters, case-insensitive input, junk dropped", () => {
  assert.equal(parseReferralCode("dr7k3p9q"), "DR7K3P9Q");
  assert.equal(parseReferralCode(" DR7K3P9Q "), "DR7K3P9Q");
  assert.equal(parseReferralCode("DR7K3P90"), null); // 0 is not in the alphabet
  assert.equal(parseReferralCode("DR7K3P9"), null);
  assert.equal(parseReferralCode("XX7K3P9Q"), null);
  assert.equal(parseReferralCode("DR7K3P9Q; drop table"), null);
  assert.equal(parseReferralCode(undefined), null);
});

test("cash cap: vouchers until the FY cap, recognition after", () => {
  assert.deepEqual(rewardFor(0, 500, 20000), { kind: "voucher", amountInr: 500 });
  assert.deepEqual(rewardFor(19500, 500, 20000), { kind: "voucher", amountInr: 500 });
  assert.deepEqual(rewardFor(20000, 500, 20000), { kind: "recognition", amountInr: 0 });
  assert.deepEqual(rewardFor(19600, 500, 20000), { kind: "recognition", amountInr: 0 });
  assert.deepEqual(rewardFor(1_000_000, 500, 0), { kind: "voucher", amountInr: 500 }); // no cap
  assert.deepEqual(rewardFor(0, 0, 20000), { kind: "recognition", amountInr: 0 }); // no cash programme
});

test("financial year runs April to March", () => {
  assert.equal(financialYear(new Date("2026-09-29T00:00:00Z")).label, "2026-27");
  assert.equal(financialYear(new Date("2027-03-31T23:00:00Z")).label, "2026-27");
  assert.equal(financialYear(new Date("2027-04-01T00:00:00Z")).label, "2027-28");
});

test("invite links and message never mention the reward", () => {
  assert.equal(joinPath("DR7K3P9Q"), "/join?ref=DR7K3P9Q");
  assert.equal(joinPath("DR7K3P9Q", "asha-rao-1a2b3c"), "/join?ref=DR7K3P9Q&p=asha-rao-1a2b3c");
  const m = inviteMessage({ inviterName: "Dr Asha Rao", url: "https://x.test/join?ref=DR7K3P9Q", colleagueName: "Vikram Nair" });
  assert.match(m, /^Dr Vikram Nair, /);
  assert.match(m, /https:\/\/x\.test\/join\?ref=DR7K3P9Q/);
  assert.doesNotMatch(m, /voucher|amazon|reward|₹/i);
  assert.equal(tribeChannel("WhatsApp"), "whatsapp");
  assert.equal(tribeChannel("tiktok"), "link");
});
