import assert from "node:assert/strict";
import { test } from "node:test";

import {
  analyticsCookieDeletions,
  analyticsCookieNames,
  consentCookie,
  cookieDomains,
  readConsent,
} from "../../lib/consent";

const V = "2026-09-23";

test("no cookie, or an unrelated one, is no decision", () => {
  assert.equal(readConsent("", "tdi_consent", V), null);
  assert.equal(readConsent("tdi_session=abc", "tdi_consent", V), null);
});

test("a choice round-trips through the cookie it writes", () => {
  for (const choice of ["granted", "denied"] as const) {
    const pair = consentCookie("tdi_consent", V, choice, true).split(";")[0];
    assert.equal(readConsent(`a=1; ${pair}; b=2`, "tdi_consent", V), choice);
  }
});

test("a choice made under an older version asks again", () => {
  const pair = consentCookie("tdi_consent", "2026-08-28", "granted", true).split(";")[0];
  assert.equal(readConsent(pair, "tdi_consent", V), null);
});

test("garbage values are no decision, never a grant", () => {
  assert.equal(readConsent("tdi_consent=yes", "tdi_consent", V), null);
  assert.equal(readConsent(`tdi_consent=${V}.maybe`, "tdi_consent", V), null);
  assert.equal(readConsent("tdi_consent=%E0%A4%A", "tdi_consent", V), null);
});

test("the consent cookie is Lax, site-wide, 180 days, Secure only on https", () => {
  const c = consentCookie("tdi_consent", V, "granted", true);
  assert.match(c, /Path=\//);
  assert.match(c, /SameSite=Lax/);
  assert.match(c, /Max-Age=15552000/);
  assert.match(c, /Secure/);
  assert.doesNotMatch(consentCookie("tdi_consent", V, "granted", false), /Secure/);
});

test("finds every GA cookie and nothing else", () => {
  const names = analyticsCookieNames("_ga=GA1.1.1; _ga_VC636R0Y49=GS1; tdi_session=x; _gid=1; gallery=2");
  assert.deepEqual(names.sort(), ["_ga", "_ga_VC636R0Y49", "_gid"]);
});

test("deletion covers the host and every parent domain gtag could have used", () => {
  assert.deepEqual(cookieDomains("www.thedoctorindex.com"), [".www.thedoctorindex.com", ".thedoctorindex.com"]);
  assert.deepEqual(cookieDomains("localhost"), []);
  const del = analyticsCookieDeletions("_ga=1; tdi_consent=x", "www.thedoctorindex.com");
  assert.ok(del.includes("_ga=; Path=/; Max-Age=0"));
  assert.ok(del.includes("_ga=; Path=/; Domain=.thedoctorindex.com; Max-Age=0"));
  assert.ok(del.every((c) => c.startsWith("_ga=")), "never touches the consent or session cookie");
});
