import assert from "node:assert/strict";
import { test } from "node:test";

import { enquiryTemplatePayload, normaliseWhatsappNumber } from "../../lib/whatsapp";

test("Indian mobiles normalise to +91; junk is refused", () => {
  assert.equal(normaliseWhatsappNumber("98458 60005"), "+919845860005");
  assert.equal(normaliseWhatsappNumber("+91-98458-60005"), "+919845860005");
  assert.equal(normaliseWhatsappNumber("09845860005"), "+919845860005");
  assert.equal(normaliseWhatsappNumber("12345"), null);
  assert.equal(normaliseWhatsappNumber("5845860005"), null);
  assert.equal(normaliseWhatsappNumber("+44 7700 900123"), "+447700900123");
  assert.equal(normaliseWhatsappNumber(""), null);
});

test("template payload carries no patient data and three body parameters", () => {
  const p = enquiryTemplatePayload("+919845860005", "Dr Ananya Rao", null, "https://x.in/dashboard/enquiries", "tdi_enquiry", "en");
  assert.equal(p.to, "919845860005");
  assert.equal(p.template.name, "tdi_enquiry");
  assert.deepEqual(p.template.components[0].parameters.map((x) => x.text), ["Dr Ananya Rao", "not given", "https://x.in/dashboard/enquiries"]);
});
