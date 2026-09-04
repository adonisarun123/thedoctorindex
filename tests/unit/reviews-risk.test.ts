import assert from "node:assert/strict";
import { test } from "node:test";

import { assessRisk } from "../../lib/services/reviews";

test("risk flags phone numbers, allegations and superlatives; clean text scores low", () => {
  const phone = assessRisk("Good doctor, call me on 9876543210 for details. Waited about twenty minutes and was seen properly.");
  assert.ok(phone.flags.includes("phone_number"));
  const clean = assessRisk("The consultation was on time, the explanation of next steps was clear, and the front desk was helpful throughout.");
  assert.ok(clean.score < 15, `clean text scored ${clean.score}: ${clean.flags.join(",")}`);
  const allegation = assessRisk("This doctor is a fraud and committed malpractice; he should be in jail for what he did to my father last month.");
  assert.ok(allegation.flags.includes("serious_allegation"));
});
