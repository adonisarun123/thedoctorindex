import assert from "node:assert/strict";
import { test } from "node:test";

import { buildQuery, parsePlaces, pickBest, scoreHit, type ProfileForGoogle } from "../../lib/enrich/google";
import { coreTokens, nameCovers, nameTight, nameTokens, phoneDigits, queryToken, similarity } from "../../lib/enrich/names";
import { ANY_COUNCIL, COUNCILS, COUNCILS_BY_STATE, NmcClient, councilId, detailOf, isRemoved, rowCouncil, matchOnRegister, parseRow, placeHint } from "../../lib/enrich/nmc";

test("name tokens drop honorifics, brackets and maiden-name notes", () => {
  assert.deepEqual(nameTokens("Dr. AGRAWAL ASHOK"), ["agrawal", "ashok"]);
  assert.deepEqual(nameTokens("Mittal Ku. Neena Now Agrawal (Smt.) Neena"), ["mittal", "neena", "agrawal"]);
  assert.equal(nameCovers("Kaur (Ku)  Harjeet Now Bansal (Smt.)  Harjeet Kaur", "Bansal Harjeet Kaur"), true);
  assert.equal(nameTight("Kaur (Ku)  Harjeet Now Bansal (Smt.)  Harjeet Kaur", "Bansal Harjeet Kaur"), true);
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

test("council names map to register codes; non-modern councils map to none", () => {
  assert.equal(councilId("Madhya Pradesh Medical Council"), "MAD");
  assert.equal(councilId("MPMC"), "MAD");
  assert.equal(councilId("Mahakaushal Medical Council"), "MAD", "historical councils map to the state council that now holds them");
  assert.equal(councilId("Mysore Medical Council"), "KAR");
  assert.equal(councilId("Karnataka Medical Council"), "KAR");
  assert.equal(councilId("Kerala State Medical Council"), "TC");
  assert.equal(councilId("Gujarat Medical Council"), "GUJ");
  assert.equal(councilId("Medical Council of India"), "MCI");
  assert.equal(councilId("Pondicherry Medical Council"), ANY_COUNCIL, "medical, but not a filter the register offers");
  assert.equal(councilId("Dental Council of India"), null);
  assert.equal(councilId("State Homoeopathy Council Bhopal Mp"), null);
  assert.equal(councilId("Travancore-Cochin Medical Council (Indian medicine)"), null);
  assert.equal(councilId("Council not stated"), null);
  assert.deepEqual(COUNCILS_BY_STATE.gujarat, ["GUJ", "MAH"]);
  for (const codes of Object.values(COUNCILS_BY_STATE)) for (const c of codes) assert.ok(COUNCILS[c], `${c} is a council code the register lists`);
});

test("register rows parse without keeping father's name, DOB or address; place hints drop house detail, PIN and country", () => {
  const api = { id: 13584393, name: "Agrawal Neena", father_name: "K N Mittal", dob: "1960-01-01 00:00:00", registration_no: "7975", registration_date: "11-02-1987", state_medical_council: "Madhya Pradesh Medical Council", year_of_info: 1987, permanent_address: "D 203,SECTOR-2,SUNCITY,BOPAL,AHMEDABAD,,AHMEDABAD,GUJARAT,380058,INDIA", qualification: "M.B.B.S.", qualification_year: "1985", university: "Devi Ahilya", removed_status: null };
  const row = parseRow(api);
  assert.deepEqual(row, { year: 1987, registrationNo: "7975", council: "Madhya Pradesh Medical Council", name: "Agrawal Neena", doctorId: "13584393" });
  for (const k of ["fatherName", "father_name", "dob", "permanent_address"]) assert.equal(Object.keys(row!).includes(k), false);
  const d = detailOf(api);
  assert.deepEqual(d, { degree: "M.B.B.S.", university: "Devi Ahilya", yearOfPassing: 1985, registrationDate: "11-02-1987", place: "AHMEDABAD, GUJARAT", removed: false });
  assert.equal(placeHint("M. I. G. No. I Civil Lines, Shahdol, M. P"), "Shahdol, M. P");
  assert.equal(placeHint("Indore"), null);
  assert.equal(isRemoved(null), false);
  assert.equal(isRemoved(0), false);
  assert.equal(isRemoved("0"), false);
  assert.equal(isRemoved(1), true);
  assert.equal(isRemoved("true"), true);
  assert.equal(parseRow({ id: 1, name: "", registration_no: "1" }), null);
});

/** rows: [id, regNo, council code, name]; codes other than MAD render as "Other Council". */
function fakeRegister(rows: Array<[string, string, string, string]>, details: Record<string, Record<string, unknown>> = {}) {
  const calls: string[] = [];
  const fetchImpl = (async (input: string | URL | Request) => {
    const url = String(input);
    calls.push(url);
    if (url.includes("/indian-medical-register/search")) {
      const q = new URL(url).searchParams;
      const name = (q.get("name") ?? "").toLowerCase();
      const no = q.get("reg_no") ?? "";
      const state = q.get("state") ?? "";
      const perPage = Number(q.get("per_page") ?? "25");
      const page = Number(q.get("page") ?? "1");
      const all = rows
        .filter(([, regNo, code, nm]) => (no ? regNo.includes(no) : nm.toLowerCase().includes(name)) && (!state || code === state))
        .map(([id, regNo, code, nm]) => ({ id: Number(id), name: nm, father_name: "Father", dob: "1960-01-01 00:00:00", registration_no: regNo, registration_date: "01-01-1990", state_medical_council: code === "MAD" ? "Madhya Pradesh Medical Council" : "Other Council", year_of_info: 1990, permanent_address: "12 Palasia, Indore, M.P,452001,INDIA", qualification: "MBBS", qualification_year: "1988", university: "Devi Ahilya", removed_status: null, ...(details[id] ?? {}) }));
      const data = all.slice((page - 1) * perPage, page * perPage);
      return Response.json({ success: true, data, pagination: { total: all.length, count: data.length, per_page: perPage, current_page: page, total_pages: Math.max(1, Math.ceil(all.length / perPage)) } });
    }
    return new Response("<html>Page Not Found</html>", { status: 404, headers: { "content-type": "text/html" } });
  }) as typeof fetch;
  return { client: new NmcClient({ pauseMs: 0, fetchImpl }), calls };
}

test("number on file that the register knows under the same name is confirmed", async () => {
  const { client } = fakeRegister([["1", "7975", "MAD", "Agrawal Ashok Kumar"]]);
  const out = await matchOnRegister(client, { name: "AGRAWAL ASHOK", stateSlug: "madhya-pradesh", registration: { number: "7975", council: "Madhya Pradesh Medical Council" } });
  assert.equal(out.status, "confirmed");
  assert.equal("match" in out && out.match.detail?.degree, "MBBS");
});

test("a wrong number on file is replaced by a unique name match, and reported when the name is not found", async () => {
  const { client } = fakeRegister([["1", "7975", "MAD", "Verma Sunita"], ["2", "8001", "MAD", "Agrawal Ashok"]]);
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: { number: "7975", council: "Madhya Pradesh Medical Council" } });
  assert.equal(out.status, "matched");
  assert.equal("match" in out && out.match.registrationNo, "8001");
  assert.equal("replaces" in out && out.replaces?.[0].name, "Verma Sunita");
  const none = await matchOnRegister(client, { name: "Mehta Rakesh", stateSlug: "madhya-pradesh", registration: { number: "7975", council: "Madhya Pradesh Medical Council" } });
  assert.equal(none.status, "number_mismatch");
});

test("a prefixed number the register stores without its prefix is still confirmed", async () => {
  const { client, calls } = fakeRegister([["1", "3037", "MAD", "Sahu (Miss.) Jaishree"]]);
  const out = await matchOnRegister(client, { name: "Sahu Jaishree", stateSlug: "madhya-pradesh", registration: { number: "MP-3037", council: "Madhya Pradesh Medical Council" } });
  assert.equal(out.status, "confirmed");
  assert.equal(calls.filter((c) => c.includes("reg_no=3037")).length, 1);
});

test("without a number, exactly one tight name match fills the registration", async () => {
  const { client } = fakeRegister([["1", "8001", "MAD", "Agrawal Ashok Kumar"], ["2", "8002", "MAD", "Agrawal Ashish"], ["3", "8003", "MAD", "Agrawal Ashok Kumar Prasad Rao"]]);
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: null });
  assert.equal(out.status, "matched");
  assert.equal("match" in out && out.match.registrationNo, "8001");
});

test("two tight matches are ambiguous and carry candidates with register detail", async () => {
  const { client } = fakeRegister([["1", "8001", "MAD", "Agrawal Ashok"], ["2", "8002", "MAD", "Ashok Agrawal"]]);
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: null });
  assert.equal(out.status, "ambiguous");
  assert.equal("candidates" in out && out.candidates.length, 2);
  assert.equal("candidates" in out && out.candidates[0].detail?.place, "Indore, M.P");
});

test("a struck-off unique match is never filled", async () => {
  const { client } = fakeRegister([["1", "8001", "MAD", "Agrawal Ashok"]], { "1": { removed_status: 1 } });
  const out = await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: "madhya-pradesh", registration: null });
  assert.equal(out.status, "removed");
});

test("single-token names and unknown states are not searched", async () => {
  const { client, calls } = fakeRegister([["1", "8001", "MAD", "Agrawal Ashok"]]);
  assert.equal((await matchOnRegister(client, { name: "Agrawal", stateSlug: "madhya-pradesh", registration: null })).status, "not_found");
  assert.equal((await matchOnRegister(client, { name: "Agrawal Ashok", stateSlug: null, registration: null })).status, "not_found");
  assert.equal(calls.filter((c) => c.includes("/indian-medical-register/search")).length, 0);
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

test("registration numbers as written on profiles are queried safely and matched exactly", async () => {
  const { registrationQuery } = await import("../../lib/enrich/nmc");
  const a = registrationQuery("MP-87 / 2007");
  assert.equal(a.queryNumber, "MP-87");
  assert.equal(a.accept("MP-87"), true);
  assert.equal(a.accept("MP-8700"), false, "prefix hits from the register are rejected");
  assert.equal(a.accept("MP-87/2007"), true);
  const b = registrationQuery("12345");
  assert.equal(b.accept("MP-12345"), true);
  assert.equal(b.accept("12345"), true);
  assert.equal(b.accept("123456"), false);
  const c = registrationQuery(" MP - 8585 ");
  assert.equal(c.queryNumber, "MP-8585");
  const d = registrationQuery("DMC/R/1053");
  assert.equal(d.queryNumber, "DMC/R/1053", "slashed numbers that are not number/year are searched whole");
  assert.equal(d.accept("DMC/R/1053"), true);
  assert.equal(d.accept("DMC/R/10536"), false);
  assert.equal(registrationQuery("TSMC / FMR / 19132").queryNumber, "TSMC/FMR/19132");
});

test("a row's council comes from its code when the register's label contradicts it", () => {
  assert.equal(rowCouncil({ state_medical_council: "Tamil Nadu Medical Council", state_code: "MAD" }), "Madhya Pradesh Medical Council");
  assert.equal(rowCouncil({ state_medical_council: "Kerala State Medical Council", state_code: "TC" }), "Kerala State Medical Council");
  assert.equal(rowCouncil({ state_medical_council: "Telangana Medical Council", state_code: "TEL" }), "Telangana Medical Council");
  assert.equal(rowCouncil({ state_medical_council: "Gujarat Medical Council", state_code: null }), "Gujarat Medical Council");
});
