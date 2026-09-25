import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { QUALIFICATIONS, QUALIFICATION_GROUPS, branchesOf, normalizeDegree, qualificationBySlug, qualificationForDegree, qualificationLinks, qualificationStrings, qualificationWordCount, relatedQualifications, tidyBranch } from "../../lib/qualifications";
import { registerBySlug } from "../../lib/registers";
import { DESCRIPTION_MAX } from "../../lib/seo/meta";

/**
 * A qualification page that is wrong is worse than none: it would tell a
 * patient that a society membership is a degree, or send them to the wrong
 * register. Everything that would make one wrong is checkable here, and the
 * matching patterns — which decide the counts and the profile links — are
 * exercised against the spellings the source data actually uses.
 */

const MIN_WORDS = 300;

function slugsIn(file: string): string[] {
  const src = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  return [...src.matchAll(/^\s*slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
}
const POST_SLUGS = new Set(readFileSync(new URL("../../lib/blog/index.ts", import.meta.url), "utf8").match(/posts\/([a-z0-9-]+)"/g)?.map((m) => m.slice(6, -1)) ?? []);
const POLICY_SLUGS = new Set(slugsIn("lib/data/policies.tsx"));
const SPECIALTY_KEYS = new Set((readFileSync(new URL("../../lib/data/specialties.ts", import.meta.url), "utf8").match(/key: "([a-z-]+)"/g) ?? []).map((m) => m.slice(6, -1)));
const STATIC_ROUTES = new Set(["/", "/doctors", "/specialties", "/about", "/blog", "/health-guides", "/registers", "/qualifications"]);

test("the registry is coherent: unique slugs, valid parents, registers and specialities that exist", () => {
  assert.ok(QUALIFICATIONS.length >= 55, `expected at least 55 qualifications, found ${QUALIFICATIONS.length}`);
  const slugs = QUALIFICATIONS.map((q) => q.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  for (const q of QUALIFICATIONS) {
    assert.ok(QUALIFICATION_GROUPS.some((g) => g.kind === q.kind), `${q.slug}: kind ${q.kind} has no group`);
    assert.ok(registerBySlug(q.registerSlug), `${q.slug}: register ${q.registerSlug} does not exist`);
    if (q.parent) assert.ok(qualificationBySlug(q.parent) && !qualificationBySlug(q.parent)!.parent, `${q.slug}: parent ${q.parent} is missing or is itself a branch`);
    if (q.specialty) assert.ok(SPECIALTY_KEYS.has(q.specialty), `${q.slug}: speciality ${q.specialty} does not exist`);
    assert.ok(q.related?.every((s) => qualificationBySlug(s)), `${q.slug}: a related slug does not exist`);
    assert.doesNotThrow(() => new RegExp(q.pattern), `${q.slug}: pattern does not compile`);
  }
});

test("every qualification has substance and dated facts", () => {
  for (const q of QUALIFICATIONS) {
    const n = qualificationWordCount(q);
    assert.ok(n >= MIN_WORDS, `${q.slug}: ${n} words, minimum is ${MIN_WORDS}`);
    assert.ok(q.body.filter((b) => b.k === "h2").length >= 1, `${q.slug}: no sections`);
    assert.ok(q.faqs.length >= 1, `${q.slug}: no questions`);
    for (const f of q.faqs) {
      assert.ok(f.q.trim().endsWith("?"), `${q.slug}: question is not a question — ${f.q}`);
      assert.ok(f.a.split(/\s+/).length >= 18, `${q.slug}: thin answer — ${f.q}`);
    }
    assert.match(q.checkedOn, /^\d{1,2} [A-Z][a-z]{2} \d{4}$/, `${q.slug}: checkedOn is not a display date`);
    assert.ok(q.standfirst.length <= DESCRIPTION_MAX, `${q.slug}: standfirst is ${q.standfirst.length} chars`);
    assert.ok(q.awardedBy.length > 3, `${q.slug}: no awarding body`);
  }
});

test("every internal link resolves to a route that exists", () => {
  for (const q of QUALIFICATIONS) {
    for (const href of qualificationLinks(q)) {
      if (/^https?:\/\//.test(href)) continue;
      const path = href.split("#")[0];
      const ok =
        STATIC_ROUTES.has(path) ||
        (path.startsWith("/blog/") && POST_SLUGS.has(path.slice(6))) ||
        (path.startsWith("/policies/") && POLICY_SLUGS.has(path.slice(10))) ||
        (path.startsWith("/registers/") && Boolean(registerBySlug(path.slice(11)))) ||
        (path.startsWith("/qualifications/") && Boolean(qualificationBySlug(path.slice(16)))) ||
        (path.startsWith("/specialties/") && SPECIALTY_KEYS.has(path.slice(13)));
      assert.ok(ok, `${q.slug}: link to ${href} does not resolve`);
    }
  }
});

test("memberships and society fellowships never present themselves as degrees", () => {
  for (const q of QUALIFICATIONS) {
    const text = qualificationStrings(q).join(" ").toLowerCase();
    if (q.kind === "membership") {
      assert.ok(/not (a|an) (recognised|examined|statutory)|not on any schedule|not a qualification|not a degree|not a specialist qualification|membership of/.test(text), `${q.slug}: does not say it is a membership rather than a qualification`);
    }
    assert.ok(!/we verified|guaranteed|is verified by this site/.test(text), `${q.slug}: claims a verification the site does not make`);
  }
});

test("patterns match the spellings the data uses, and the most specific page wins", () => {
  const cases: Array<[string, string | null]> = [
    ["MBBS", "mbbs"],
    ["M B B S", "mbbs"],
    ["M.D", "md"],
    ["MD ( Medicine)", "md-general-medicine"],
    ["M.D (General Medicine)", "md-general-medicine"],
    ["M.D. (Internal Medicine)", "md-general-medicine"],
    ["MD (PAEDIATRICS)", "md-paediatrics"],
    ["M.D. (Psychiatry)", "md-psychiatry"],
    ["MD (Anaesthesia)", "md-anaesthesiology"],
    ["MD ( Pathology )", "md-pathology"],
    ["MD (RADIO DIAGNOSIS)", "md-radiodiagnosis"],
    ["MD (SKIN & VD)", "md-dermatology"],
    ["MD (OBS & GYN)", "md-ms-obstetrics-gynaecology"],
    ["MS (gynaecology)", "md-ms-obstetrics-gynaecology"],
    ["MS (GEN. SURG.)", "ms-general-surgery"],
    ["M.S ( General surgery)", "ms-general-surgery"],
    ["M.S. (Ortho)", "ms-orthopaedics"],
    ["MS (orthopaedic)", "ms-orthopaedics"],
    ["M.S (ENT)", "ms-ent"],
    ["MS (ophthal)", "ms-ophthalmology"],
    ["MS (anatomy)", "ms"],
    ["DM (Cardiology)", "dm-cardiology"],
    ["D. M (Neurology)", "dm-neurology"],
    ["DM", "dm"],
    ["M.Ch (Neurosurgery)", "mch-neurosurgery"],
    ["M.Ch (Urology)", "mch-urology"],
    ["M. Ch. (Plastic Surgery)", "mch-plastic-surgery"],
    ["MCH (CVTS)", "mch-cvts"],
    ["M.CH", "mch"],
    ["DNB (Urology)", "dnb"],
    ["DrNB (Cardiology)", "drnb"],
    ["MDS (ORTHODONTICS)", "mds-orthodontics"],
    ["MDS", "mds"],
    ["D.CH.", "dch"],
    ["DGO", "dgo"],
    ["D.A", "da"],
    ["D Ortho", "d-ortho"],
    ["D.ORTH", "d-ortho"],
    ["DOMS", "doms"],
    ["DO", "doms"],
    ["DCP", "dcp"],
    ["DPB", "dcp"],
    ["DVD", "dvd"],
    ["DDVL", "dvd"],
    ["B.D.S", "bds"],
    ["BAMS", "bams"],
    ["BHMS", "bhms"],
    ["F.MAS", "fmas"],
    ["FRCS (Orth)", "frcs"],
    ["MRCP (UK)", "mrcp"],
    ["MRCPCH", null],
    ["M.D. Physician", null],
    ["MD (PHYSICIAN)", null],
    ["MD (Ayurveda)", null],
    ["MD (AM)", null],
    ["PH.D", "phd"],
    ["RMP", null],
    ["", null],
  ];
  for (const [degree, slug] of cases) {
    assert.equal(qualificationForDegree(degree)?.slug ?? null, slug, `"${degree}" (${normalizeDegree(degree)}) → expected ${slug}`);
  }
});

test("branches hang off a base degree and the base lists them", () => {
  for (const q of QUALIFICATIONS.filter((x) => x.parent)) {
    assert.ok(branchesOf(q.parent!).some((b) => b.slug === q.slug), `${q.slug}: not listed under ${q.parent}`);
    assert.ok(q.specialty, `${q.slug}: a branch must name its speciality`);
  }
});

test("related qualifications fill to three and never include the page itself", () => {
  for (const q of QUALIFICATIONS) {
    const rel = relatedQualifications(q);
    assert.equal(rel.length, 3, `${q.slug}: ${rel.length} related`);
    assert.ok(!rel.some((x) => x.slug === q.slug), `${q.slug}: related to itself`);
  }
});

test("branch labels are tidied without losing short abbreviations", () => {
  assert.equal(tidyBranch("PSYCHIATRY"), "Psychiatry");
  assert.equal(tidyBranch("gynaecology"), "Gynaecology");
  assert.equal(tidyBranch("OBS & GYN"), "OBS & GYN");
  assert.equal(tidyBranch("General Medicine"), "General Medicine");
  assert.equal(tidyBranch("RADIO DIAGNOSIS"), "Radio Diagnosis");
});
