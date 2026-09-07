import assert from "node:assert/strict";
import { test } from "node:test";

import { submitToIndexNow } from "../../lib/seo/indexnow";
import { DOCTORS_PER_FILE, doctorFileCount, doctorFilePath, escapeXml, latestLastmod, renderIndex, renderUrlset, toIsoDate } from "../../lib/seo/sitemap-xml";

test("urlset escapes loc, keeps only W3C lastmod values and carries the schema reference", () => {
  const xml = renderUrlset([
    { loc: "https://www.thedoctorindex.com/doctor/a-b?x=1&y=2", lastmod: "2026-09-06" },
    { loc: "https://www.thedoctorindex.com/doctor/c", lastmod: "06 Sep 2026" },
    { loc: "https://www.thedoctorindex.com/" + "x".repeat(2100) },
  ]);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(xml, /xsi:schemaLocation="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9 http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9\/sitemap\.xsd"/);
  assert.match(xml, /<loc>https:\/\/www\.thedoctorindex\.com\/doctor\/a-b\?x=1&amp;y=2<\/loc>\n    <lastmod>2026-09-06<\/lastmod>/);
  assert.equal((xml.match(/<lastmod>/g) ?? []).length, 1, "a display date is not a W3C date and is dropped");
  assert.equal((xml.match(/<url>/g) ?? []).length, 2, "over-long URLs are dropped");
  assert.equal(escapeXml(`a<b>&"c'`), "a&lt;b&gt;&amp;&quot;c&apos;");
  assert.equal(toIsoDate("29 Aug 2026"), "2026-08-29");
});

test("sitemap index lists files with the newest lastmod each carries", () => {
  const xml = renderIndex([{ loc: "https://x/sitemaps/doctors.xml", lastmod: "2026-09-01" }, "https://x/sitemaps/directory.xml"]);
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(xml, /siteindex\.xsd/);
  assert.match(xml, /<loc>https:\/\/x\/sitemaps\/doctors\.xml<\/loc>\n    <lastmod>2026-09-01<\/lastmod>/);
  assert.equal(latestLastmod([{ loc: "a", lastmod: "2026-01-01" }, { loc: "b", lastmod: "2026-03-01" }, { loc: "c" }]), "2026-03-01");
});

test("doctor profiles split into files under the protocol's 50,000 cap", () => {
  assert.ok(DOCTORS_PER_FILE <= 50_000 && DOCTORS_PER_FILE >= 1_000);
  assert.equal(doctorFileCount(0), 1);
  assert.equal(doctorFileCount(DOCTORS_PER_FILE), 1);
  assert.equal(doctorFileCount(DOCTORS_PER_FILE + 1), 2);
  assert.equal(doctorFilePath(1), "/sitemaps/doctors.xml");
  assert.equal(doctorFilePath(3), "/sitemaps/doctors/3");
});

test("IndexNow is a no-op without a key and batches with one when present", async () => {
  delete process.env.INDEXNOW_KEY;
  assert.deepEqual(await submitToIndexNow(["https://www.thedoctorindex.com/doctor/x"]), { submitted: 0, batches: 0, status: [], skipped: "no-key" });
  process.env.INDEXNOW_KEY = "abcdef1234567890";
  const calls: Array<{ url: string; body: { host: string; key: string; keyLocation: string; urlList: string[] } }> = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
    return new Response("", { status: 202 });
  }) as typeof fetch;
  const r = await submitToIndexNow(["https://www.thedoctorindex.com/doctor/x", "https://www.thedoctorindex.com/doctor/x", "not a url"], fetchImpl);
  assert.equal(r.submitted, 1);
  assert.deepEqual(r.status, [202]);
  assert.equal(calls[0].body.key, "abcdef1234567890");
  assert.match(calls[0].body.keyLocation, /\/indexnow-key\.txt$/);
  assert.equal(calls[0].body.urlList.length, 1);
  delete process.env.INDEXNOW_KEY;
});
