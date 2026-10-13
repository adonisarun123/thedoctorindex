import assert from "node:assert/strict";
import { test } from "node:test";

import { emailDomain, facilityMatchesHospital, hospitalForEmail } from "@/lib/registers/hospital-domains";

test("email domain parsing", () => {
  assert.equal(emailDomain("Anita.Rao@ManipalHospitals.com"), "manipalhospitals.com");
  assert.equal(emailDomain("not an email"), null);
  assert.equal(emailDomain(null), null);
});

test("hospital domains match the chain, sub-domains included, gmail never", () => {
  assert.equal(hospitalForEmail("a@manipalhospitals.com")?.hospital, "Manipal Hospitals");
  assert.equal(hospitalForEmail("a@mail.narayanahealth.org")?.hospital, "Narayana Health");
  assert.equal(hospitalForEmail("a@gmail.com"), null);
  assert.equal(hospitalForEmail("a@manipalhospitals.com.evil.net"), null);
});

test("facility must be the same hospital", () => {
  const manipal = hospitalForEmail("a@manipalhospitals.com")!;
  assert.equal(facilityMatchesHospital(manipal, ["Manipal Hospital, Old Airport Road"]), true);
  assert.equal(facilityMatchesHospital(manipal, ["Columbia Asia Hospital, Hebbal"]), true);
  assert.equal(facilityMatchesHospital(manipal, ["Apollo Hospitals, Bannerghatta Road"]), false);
  assert.equal(facilityMatchesHospital(manipal, []), false);
});
