import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { COUNCIL_GROUPS, councilKind } from "../../lib/data/councils";
import { REGISTERS, REGISTER_GROUPS, normalizeCouncil, registerBySlug, registerForCouncil, registerLinks, registerStrings, registerWordCount, relatedRegisters } from "../../lib/registers";
import { DESCRIPTION_MAX } from "../../lib/seo/meta";

/**
 * The register pages exist to send a patient to the right register with the
 * right expectations. The things that would make one of them wrong are all
 * checkable here: a duplicate slug or council string, a missing office or
 * website presented as fact without a source, an internal link to a route
 * that does not exist, a page claiming a check it does not do.
 */

const MIN_WORDS = 380;

function slugsIn(file: string): string[] {
  const src = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  return [...src.matchAll(/^\s*slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
}
const POST_SLUGS = new Set(readFileSync(new URL("../../lib/blog/index.ts", import.meta.url), "utf8").match(/posts\/([a-z0-9-]+)"/g)?.map((m) => m.slice(6, -1)) ?? []);
const POLICY_SLUGS = new Set(slugsIn("lib/data/policies.tsx"));
const STATIC_ROUTES = new Set(["/", "/doctors", "/specialties", "/about", "/for-doctors", "/blog", "/health-guides", "/registers"]);

test("the registry is coherent: unique slugs, unique council strings, every kind grouped", () => {
  assert.ok(REGISTERS.length >= 35, `expected at least 35 registers, found ${REGISTERS.length}`);
  const slugs = REGISTERS.map((r) => r.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  const seen = new Map<string, string>();
  for (const r of REGISTERS) {
    assert.ok(r.match.length >= 1, `${r.slug}: no match strings`);
    for (const m of r.match) {
      assert.equal(m, normalizeCouncil(m), `${r.slug}: match string not normalised — ${m}`);
      assert.ok(!seen.has(m) || seen.get(m) === r.slug, `${m} is claimed by both ${seen.get(m)} and ${r.slug}`);
      seen.set(m, r.slug);
    }
    assert.ok(REGISTER_GROUPS.some((g) => g.kind === r.kind), `${r.slug}: kind ${r.kind} has no group`);
    assert.ok(r.related?.every((s) => registerBySlug(s)), `${r.slug}: related slug does not exist`);
    assert.ok(!r.related?.includes(r.slug), `${r.slug}: related to itself`);
  }
});

test("every register has substance: length, sections, questions, dated facts", () => {
  for (const r of REGISTERS) {
    const n = registerWordCount(r);
    assert.ok(n >= MIN_WORDS, `${r.slug}: ${n} words, minimum is ${MIN_WORDS}`);
    assert.ok(r.body.filter((b) => b.k === "h2").length >= 1, `${r.slug}: no sections`);
    assert.ok(r.faqs.length >= 2, `${r.slug}: only ${r.faqs.length} questions`);
    for (const f of r.faqs) {
      assert.ok(f.q.trim().endsWith("?"), `${r.slug}: question is not a question — ${f.q}`);
      assert.ok(f.a.split(/\s+/).length >= 18, `${r.slug}: thin answer — ${f.q}`);
    }
    assert.match(r.checkedOn, /^\d{1,2} [A-Z][a-z]{2} \d{4}$/, `${r.slug}: checkedOn is not a display date`);
    assert.ok(r.standfirst.length <= DESCRIPTION_MAX, `${r.slug}: standfirst is ${r.standfirst.length} chars`);
    if (r.office || r.website || r.search) assert.ok(r.sources.length >= 1, `${r.slug}: states an office, website or search but names no source`);
    if (r.website) assert.match(r.website, /^https?:\/\//, `${r.slug}: website is not absolute`);
    if (r.search) assert.match(r.search.url, /^https?:\/\//, `${r.slug}: search url is not absolute`);
  }
});

test("every internal link resolves to a route that exists", () => {
  for (const r of REGISTERS) {
    for (const href of registerLinks(r)) {
      if (/^https?:\/\//.test(href)) continue;
      const path = href.split("#")[0];
      const ok =
        STATIC_ROUTES.has(path) ||
        (path.startsWith("/blog/") && POST_SLUGS.has(path.slice(6))) ||
        (path.startsWith("/policies/") && POLICY_SLUGS.has(path.slice(10))) ||
        (path.startsWith("/registers/") && Boolean(registerBySlug(path.slice(11))));
      assert.ok(ok, `${r.slug}: link to ${href} does not resolve`);
    }
  }
});

test("a non-medical register never claims the NMC check, and a medical one never disclaims it", () => {
  for (const r of REGISTERS) {
    const text = registerStrings(r).join(" ").toLowerCase();
    if (r.kind === "medical") {
      assert.ok(r.onNmcRegister, `${r.slug}: medical register not marked as on the NMC register`);
    } else {
      assert.ok(!r.onNmcRegister, `${r.slug}: ${r.kind} register marked as on the NMC register`);
      assert.ok(/not (on |searchable on )?(the )?(nmc|national medical commission)('s)?( medical| indian medical)? register|does not cover|do not appear on the nmc/.test(text), `${r.slug}: does not say it is off the NMC register`);
    }
    assert.ok(!/we verified|is verified by this site|guaranteed/.test(text), `${r.slug}: claims a verification the site does not make`);
  }
});

test("every state medical council in the site's council list has a register page", () => {
  const medical = COUNCIL_GROUPS.find((g) => g.kind === "medical")!.councils;
  const missing = medical.filter((name) => !registerForCouncil(name));
  // Two entries in the form's list have no NMC-listed body to write about yet.
  const tolerated = new Set(["Meghalaya Medical Council", "Chandigarh Medical Council", "Pondicherry Medical Council"]);
  assert.deepEqual(missing.filter((m) => !tolerated.has(m)), [], `councils without a register page: ${missing.join(", ")}`);
});

test("council strings resolve regardless of spelling, and the kind agrees", () => {
  assert.equal(registerForCouncil("Chattisgarh Medical Council")?.slug, "chhattisgarh-medical-council");
  assert.equal(registerForCouncil("Orissa Council of Medical Registration")?.slug, "odisha-council-of-medical-registration");
  assert.equal(registerForCouncil("Travancore Cochin Medical Council")?.slug, "kerala-state-medical-council");
  assert.equal(registerForCouncil("Indian Dental Council")?.slug, "national-dental-commission");
  assert.equal(registerForCouncil("Central Council of Indian Medicine")?.slug, "national-commission-for-indian-system-of-medicine");
  assert.equal(registerForCouncil("Council not stated"), null);
  assert.equal(registerForCouncil(""), null);
  for (const r of REGISTERS) {
    const kind = councilKind(r.name);
    assert.ok(kind === r.kind || kind === "other", `${r.slug}: councilKind says ${kind}, register says ${r.kind}`);
  }
});

test("related registers fill to three and never include the page itself", () => {
  for (const r of REGISTERS) {
    const rel = relatedRegisters(r);
    assert.equal(rel.length, 3, `${r.slug}: ${rel.length} related`);
    assert.ok(!rel.some((x) => x.slug === r.slug), `${r.slug}: related to itself`);
  }
});
