import assert from "node:assert/strict";
import { test } from "node:test";

import type { PlaceHit } from "../../lib/enrich/google";
import { buildRegisterQuery, listingNamesDoctor, parseIndianAddress, pickRegisterMatch } from "../../lib/nmc/research-match";

const hit = (name: string, address: string, types: string[] = ["doctor"]): PlaceHit => ({ id: name, name, address, phone: null, website: null, mapsUri: "", types, lat: null, lng: null });
const d = { name: "Ramesh Kumar", specialtyName: "Cardiology", stateName: "Karnataka" };

test("query is name, speciality, state", () => {
  assert.equal(buildRegisterQuery(d), "Dr Ramesh Kumar Cardiology, Karnataka, India");
});

test("listing must name the doctor", () => {
  assert.equal(listingNamesDoctor("Dr. Ramesh Kumar's Heart Clinic", "Ramesh Kumar"), true);
  assert.equal(listingNamesDoctor("Dr Ramesh Clinic", "Ramesh Kumar"), false);
  assert.equal(listingNamesDoctor("Apollo Hospitals Bannerghatta", "Ramesh Kumar"), false);
  assert.equal(listingNamesDoctor("Dr Kumar Ramesh Prasad", "Prasad Ramesh Kumar"), true);
  assert.equal(listingNamesDoctor("Dr Ramesh Kumar", "Prasad Ramesh Kumar Singh"), false);
  assert.equal(listingNamesDoctor("Dr Ramesh", "Ramesh"), false);
});

test("exactly one passing listing is a match; two is ambiguous; none is no_match", () => {
  const m = pickRegisterMatch([hit("Dr Ramesh Kumar Heart Care", "3rd Cross, Jayanagar, Bengaluru, Karnataka 560011, India"), hit("Manipal Hospital", "Old Airport Rd, Bengaluru, Karnataka, India", ["hospital"])], d, "q");
  assert.equal(m.status, "matched");
  assert.equal(m.best?.name, "Dr Ramesh Kumar Heart Care");
  const a = pickRegisterMatch([hit("Dr Ramesh Kumar Heart Care", "Jayanagar, Bengaluru, Karnataka, India"), hit("Dr Ramesh Kumar Clinic", "MG Road, Mysuru, Karnataka, India")], d, "q");
  assert.equal(a.status, "ambiguous");
  const n = pickRegisterMatch([hit("Dr Ramesh Kumar Heart Care", "Anna Nagar, Chennai, Tamil Nadu, India")], d, "q");
  assert.equal(n.status, "no_match");
  const t = pickRegisterMatch([hit("Dr Ramesh Kumar", "Bengaluru, Karnataka, India", ["lawyer"])], d, "q");
  assert.equal(t.status, "no_match");
});

test("the same place listed twice is one match", () => {
  const m = pickRegisterMatch([hit("Dr Ramesh Kumar Heart Care", "3rd Cross, Jayanagar, Bengaluru, Karnataka 560011, India"), hit("Dr Ramesh Kumar Heart Care", "3rd Cross, Jayanagar, Bengaluru, Karnataka 560011, India")], d, "q");
  assert.equal(m.status, "matched");
});

test("parseIndianAddress finds city, area and pincode", () => {
  assert.deepEqual(parseIndianAddress("12, 1st Main Rd, Jayanagar, Bengaluru, Karnataka 560011, India", "Karnataka"), { city: "Bengaluru", area: "Jayanagar", postalCode: "560011", street: "12, 1st Main Rd, Jayanagar" });
  assert.deepEqual(parseIndianAddress("Civil Lines, Jaipur, Rajasthan 302006, India", "Rajasthan"), { city: "Jaipur", area: "Civil Lines", postalCode: "302006", street: "Civil Lines" });
  assert.equal(parseIndianAddress("Cuttack Rd, Bhubaneswar, Odisha, India", "Odisha").city, "Bhubaneswar");
  assert.equal(parseIndianAddress("Cuttack Rd, Bhubaneswar, Orissa, India", "Odisha").city, "Bhubaneswar");
  assert.equal(parseIndianAddress("Sector 5, Panchkula, Haryana 134109, India", "Haryana").area, null);
});
