import assert from "node:assert/strict";
import { test } from "node:test";

import { buildQuery, parsePlaces, pickBest, scoreHit, type ProfileForGoogle } from "../../lib/enrich/google";
import { coreTokens, nameCovers, nameTight, nameTokens, phoneDigits, queryToken, similarity } from "../../lib/enrich/names";
import { COUNCILS_BY_STATE, NmcClient, councilId, matchOnRegister, parseRow, placeHint } from "../../lib/enrich/nmc";

test("name tokens drop honorifics, brackets and maiden-name notes", () => {
  assert.deepEqual(nameTokens("Dr. AGRAWAL ASHOK"), ["agrawal", "ashok"]);
  assert.deepEqual(nameTokens("Mittal Ku. Neena Now Agrawal (Smt.) Neena"), ["mittal", "neena"]);
  assert.deepEqual(coreTokens("R. K. Sharma"), ["sharma"]);
  assert.equal(queryToken("Agrawal Ashok Kumar"), "agrawal");
});

test("coverage is order-free and tolerates a middle name; tight rejects long extras", () => {
  assert.equal(nameCovers("Agrawal Ashok Kumar", "AGRAWAL ASHOK"), true);
  assert.equal(nameCovers("Ashok Kumar Agrawal", "Agrawal Ashok"), true);
  assert.equal(nameCovers("Agrawal Ashish", "Agrawal Ashok"), false);
  assert.equal(nameCovers("Agrawal A K", "Agrawal Ashok"), false);
  assert.equal(nameCovers("Agrawal Ashok", "Agrawal A K"), false, "initial K has no matching token");
  assert.equal(nameCovers("Agrawal Ashok Kumar", "A K Agrawal"), true);
  assert.equal(nameTight("Agrawal Ashok Kumar", "Agrawal Ashok"), true);
  assert.equal(nameTight("Agrawal Ashok Kumar Prasad", "Agrawal Ashok"), false);
});

test("council names map to register ids; non-modern councils map to none", () => {
  assert.equal(councilId("Madhya Pradesh Medical Council"), 15);
  assert.equal(councilId("MPMC"), 15);
  assert.equal(councilId("Mahakaushal Medical Council"), 35);
  assert.equal(councilId("Karnataka Medical Council"), 13);
  assert.equal(councilId("Medical Council of India"), 46);
  assert.equal(councilId("Dental Council of India"), null);
  assert.equal(councilId("State Homoeopathy Council Bhopal Mp"), null);
  assert.equal(councilId("Council not stated"), null);
  assert.deepEqual(COUNCILS_BY_STATE["madhya-pradesh"], [15, 35, 28]);
});

test("register rows parse without keeping the father's name; place hints drop house detail", () => {
  const row = parseRow([1, 1987, "7975", "Madhya Pradesh Medical Council", "Agrawal Neena", "Dr. K N Mittal", "<a href=\"javascript:void(0);\" onclick=\"openDoctorDetailsnew('399156', '7975')\">View</a>"]);
  assert.deepEqual(row, { year: 1987, registrationNo: "7975", council: "Madhya Pradesh Medical Council", name: "Agrawal Neena", doctorId: "399156" });
  assert.equal(Object.keys(row!).includes("fatherName"), false);
  assert.equal(placeHint("M. I. G. No. I Civil Lines, Shahdol, M. P"), "Shahdol, M. P");
  assert.equal(placeHint("Indore"), null);
});

function fakeRegister(rows: Array<[string, string, string, string]>, details: Record<string, Record<string, unknown>> = {}) {
  const calls: string[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push(url);
    if (url.includes("indian-medical-register")) return new Response("<html/>", { status: 200, headers: { "set-cookie": "JSESSIONID=abc; Path=/" } });
    if (url.includes("getPaginatedDoctor")) {
      const q = new URL(url).searchParams;
      const name = (q.get("name") ?? "").toLowerCase();
      const no = q.get("registrationNo") ?? "";
      const smc = q.get("smcId") ?? "";
      const hits = rows.filter(([id, regNo, council, nm]) => (no ? regNo === no : nm.toLowerCase().includes(name)) && (!smc || council === smc)).map(([id, regNo, council, nm], i) => [i + 1, 1990, regNo, council === "15" ? "Madhya Pradesh Medical Council" : "Other Council", nm, "Father", `<a onclick="openDoctorDetailsnew('${id}', '${regNo}')">View</a>`]);
      return Response.json({ recordsFiltered: hits.length, data: hits });
    }
    if (url.includes("getDoctorDetailsByIdImrExt")) {
      const body = JSON.parse(String(init?.body ?? "{}"));
      return Response.json({ doctorDegree: "MBBS", university: "Devi Ahilya", yearOfPassing: 1988, addressLine1: "12 Palasia, Indore, M.P", removedStatus: false, ...(details[body.doctorId] ?? {}) });
    }
    return new Response("nope", { status: 404 });
  }) as typeof fetch;
  return { client: new NmcClient({ pauseMs: 0, fetchImpl }), calls };
}

test("number on file that the register knows under the same name is confirmed", async () => {
  const { client } = fakeRegister([["1", "7975", "15", "Agrawal Ashok Kumar"]]);
  const out = await matchOnRegister(client, { name: "AGRAWAL ASHOK", stateSlug: "madhya-pradesh", registration: { number: "7975", council: "Madhya Pradesh Medical Council" } });
  assert.equal(out.status, "confirmed");
  assert.equal("match" in out && out.match.detail?.degree, "MBBS");
});

test("number on file under a different name is reported, not confirmed", async () => {
  const { client } = fakeRegister([["1", "7975", "15", "Verma Sunita"], ["2", "8001", "15", "Agrawal Ashok"]]);
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: { number: "7975", council: "Madhya Pradesh Medical Council" } });
  assert.equal(out.status, "number_mismatch");
});

test("without a number, exactly one tight name match fills the registration", async () => {
  const { client } = fakeRegister([["1", "8001", "15", "Agrawal Ashok Kumar"], ["2", "8002", "15", "Agrawal Ashish"], ["3", "8003", "15", "Agrawal Ashok Kumar Prasad Rao"]]);
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: null });
  assert.equal(out.status, "matched");
  assert.equal("match" in out && out.match.registrationNo, "8001");
});

test("two tight matches are ambiguous and carry candidates with register detail", async () => {
  const { client } = fakeRegister([["1", "8001", "15", "Agrawal Ashok"], ["2", "8002", "15", "Ashok Agrawal"]]);
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: null });
  assert.equal(out.status, "ambiguous");
  assert.equal("candidates" in out && out.candidates.length, 2);
  assert.equal("candidates" in out && out.candidates[0].detail?.place, "Indore, M.P");
});

test("a struck-off unique match is never filled", async () => {
  const { client } = fakeRegister([["1", "8001", "15", "Agrawal Ashok"]], { "1": { removedStatus: true } });
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: null });
  assert.equal(out.status, "removed");
});

test("single-token names and unknown states are not searched", async () => {
  const { client, calls } = fakeRegister([["1", "8001", "15", "Agrawal Ashok"]]);
  assert.equal((await matchOnRegister(client, { name: "Agrawal", stateSlug: "madhya-pradesh", registration: null })).status, "not_found");
  assert.equal((await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: null, registration: null })).status, "not_found");
  assert.equal(calls.filter((c) => c.includes("getPaginatedDoctor")).length, 0);
});

const profile: ProfileForGoogle = { doctorName: "Agrawal Ashok", facilityName: "Dr. Agrawal Clinic", address: "12 Palasia Square", postalCode: "452001", phone: "+91 98260 12345", localityName: "Palasia", cityName: "Indore", stateName: "Madhya Pradesh", lat: 22.72, lng: 75.88 };

test("google query anchors the clinic to locality, city and state", () => {
  assert.equal(buildQuery(profile), "Dr. Agrawal Clinic Dr Agrawal Ashok, Palasia, Indore, Madhya Pradesh");
  assert.equal(buildQuery({ ...profile, facilityName: null, localityName: "Indore" }), "Dr Agrawal Ashok, Indore, Madhya Pradesh");
});

test("google hits need the name plus place or phone to match; a distant listing is rejected", () => {
  const good = { id: "p1", name: "Dr Ashok Agrawal Clinic", address: "12, Palasia Square, Indore, Madhya Pradesh 452001, India", phone: "098260 12345", website: null, mapsUri: "https://maps.google.com/?cid=1", types: ["doctor"], lat: 22.721, lng: 75.881 };
  const s1 = scoreHit(good, profile);
  assert.ok(s1.score >= 100, `score ${s1.score}: ${s1.reasons.join(", ")}`);
  assert.equal(s1.addressMatch, true);
  const wrongCity = { ...good, id: "p2", address: "MG Road, Bhopal, Madhya Pradesh 462001, India", phone: null, lat: 23.25, lng: 77.41 };
  assert.ok(scoreHit(wrongCity, profile).score < 75);
  const nameOnly = { ...good, id: "p3", address: "Somewhere, Indore, Madhya Pradesh, India", phone: null, lat: null, lng: null };
  const s3 = scoreHit(nameOnly, profile);
  assert.ok(s3.score < 75 && s3.score >= 50, `score ${s3.score}`);
  const best = pickBest([wrongCity, good, nameOnly], profile, "q");
  assert.equal(best.status, "matched");
  assert.equal(best.best?.id, "p1");
  assert.equal(pickBest([wrongCity], profile, "q").status, "no_match");
});

test("places responses parse into hits and phone digits normalise", () => {
  const hits = parsePlaces({ places: [{ id: "x", displayName: { text: "Clinic" }, formattedAddress: "A, Indore", nationalPhoneNumber: "098260 12345", googleMapsUri: "https://maps.google.com/?cid=9", types: ["doctor"], location: { latitude: 1, longitude: 2 } }, { id: "", displayName: { text: "broken" } }] });
  assert.equal(hits.length, 1);
  assert.equal(hits[0].lat, 1);
  assert.equal(phoneDigits("+91 98260 12345"), "9826012345");
  assert.equal(phoneDigits("098260 12345"), "9826012345");
  assert.ok(similarity("Dr Agrawal Clinic", "Dr. Agrawal Clinic") > 0.9);
});
