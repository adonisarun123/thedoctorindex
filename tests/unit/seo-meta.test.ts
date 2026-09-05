import assert from "node:assert/strict";
import { test } from "node:test";

import { DESCRIPTION_MAX, TITLE_MAX, clamp, fullTitle, pageMeta } from "../../lib/seo/meta";
import { isoDate, openingHoursLd, parseDays, parseHours } from "../../lib/seo/structured-data";

test("titles fit the snippet budget, shrinking the brand before the page title", () => {
  assert.equal(fullTitle("About and ownership"), "About and ownership | The Doctor Index");
  const t = fullTitle("Dr Padmanabhan Venkataraman – Orthopaedic surgeon in Bengaluru");
  assert.ok(t.length <= TITLE_MAX, t);
  assert.ok(!t.endsWith("| The Doctor Index"));
  const short = fullTitle("Verified Cardiologists in Indiranagar, Bengaluru");
  assert.ok(short.length <= TITLE_MAX, short);
});

test("descriptions are clamped on a word boundary", () => {
  const long = "word ".repeat(60).trim();
  const c = clamp(long, DESCRIPTION_MAX);
  assert.ok(c.length <= DESCRIPTION_MAX);
  assert.ok(c.endsWith("…"));
  assert.ok(!c.includes("wor…"));
  assert.equal(clamp("short", 20), "short");
});

test("pageMeta emits the complete Open Graph block every time", () => {
  const m = pageMeta({ title: "Verified doctors in Bengaluru", description: "x".repeat(40), path: "/doctors/karnataka/bengaluru" });
  const og = m.openGraph as Record<string, unknown>;
  assert.equal(og.siteName, "The Doctor Index");
  assert.equal(og.locale, "en_IN");
  assert.equal(og.type, "website");
  assert.ok(String(og.url).endsWith("/doctors/karnataka/bengaluru"));
  assert.ok(Array.isArray(og.images) && (og.images as unknown[]).length === 1);
  assert.equal((m.twitter as Record<string, unknown>).card, "summary_large_image");
  assert.equal((m.alternates as Record<string, unknown>).canonical, og.url);
  const seg = pageMeta({ title: "t", description: "d", path: "/x", image: "segment" });
  assert.equal((seg.openGraph as Record<string, unknown>).images, undefined);
});

test("opening hours parse into OpeningHoursSpecification", () => {
  assert.deepEqual(parseDays("Mon–Fri"), ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  assert.deepEqual(parseDays("Mon, Wed, Fri"), ["Monday", "Wednesday", "Friday"]);
  assert.deepEqual(parseDays("Sat-Sun"), ["Saturday", "Sunday"]);
  assert.equal(parseDays("Weekdays"), null);
  assert.deepEqual(parseHours("10:00–13:00, 17:00–19:30"), [{ opens: "10:00", closes: "13:00" }, { opens: "17:00", closes: "19:30" }]);
  assert.deepEqual(parseHours("9:30–13:00"), [{ opens: "09:30", closes: "13:00" }]);
  assert.equal(parseHours("by appointment"), null);
  const spec = openingHoursLd({ days: "Tue–Sat", hours: "11:00–15:00" });
  assert.equal(spec?.length, 1);
  assert.deepEqual(spec?.[0].dayOfWeek, ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  assert.equal(openingHoursLd({ days: "varies", hours: "11:00–15:00" }), undefined);
});

test("display dates become ISO dates", () => {
  assert.equal(isoDate("12 Aug 2026"), "2026-08-12");
  assert.equal(isoDate("2026-08-12T10:00:00Z"), "2026-08-12");
  assert.equal(isoDate("soon"), undefined);
});
