import assert from "node:assert/strict";
import { test } from "node:test";

import { articleLinks, articleWordCount } from "../../lib/conditions/article";
import { ARTICLES } from "../../lib/conditions/articles";
import { LETTERS, letterOf } from "../../lib/conditions/browse";
import { cleanCondition, sectionBlocks, splitOtherNames, type RawCondition } from "../../lib/conditions/clean";
import { DEPARTMENTS, departmentByName, departmentSlug } from "../../lib/conditions/departments";
import { articleIndexable } from "../../lib/conditions/gate";
import { SPECIALTIES } from "../../lib/data/taxonomy";
import { DESCRIPTION_MAX } from "../../lib/seo/meta";
import { conditionLd } from "../../lib/seo/structured-data";

/**
 * The condition library's rules, enforced:
 *   - the importer's repairs do what the comments say,
 *   - every department routes somewhere real,
 *   - nothing becomes indexable without a named reviewer,
 *   - markup never claims a review or clinical content that is not on the page,
 *   - original articles meet the editorial bar.
 */

const IMPORT_DEPARTMENTS = [
  "Allergy and Immunology", "Cardiology", "Clinical Genetics", "Dentistry", "Dermatology", "Diabetology", "ENT", "Emergency Medicine",
  "Endocrinology", "Gastroenterology", "General Medicine", "General Surgery", "Haematology", "Hepatology", "Infectious Diseases",
  "Metabolic Medicine", "Nephrology", "Neurology", "Neurosurgery", "Obstetrics and Gynaecology", "Oncology", "Ophthalmology",
  "Oral and Maxillofacial Surgery", "Orthopaedics", "Paediatrics", "Psychiatry", "Pulmonology", "Reproductive Medicine",
  "Rheumatology", "Urology", "Vascular Medicine",
];

test("every department in the 1 Oct import is mapped, and maps to a real speciality or says none", () => {
  for (const name of IMPORT_DEPARTMENTS) {
    const d = departmentByName(name);
    assert.ok(d, `unmapped department ${name}`);
    if (d.basis === "none") assert.equal(d.specialty, null);
    else assert.ok(d.specialty && SPECIALTIES[d.specialty], `${name} → ${d.specialty} is not a speciality`);
  }
  assert.equal(new Set(DEPARTMENTS.map((d) => d.slug)).size, DEPARTMENTS.length);
  assert.equal(departmentSlug("Obstetrics and Gynaecology"), "obstetrics-and-gynaecology");
});

test("a detached list goes back under its single lead-in", () => {
  const notes: string[] = [];
  const blocks = sectionBlocks({ heading: "H", kind: "source", source_ids: ["S1"], paragraphs: ["Each type has a job:", "Later paragraph."], items: ["One", "Two"] }, notes);
  assert.deepEqual(blocks.map((b) => b.k), ["p", "ul", "p"]);
  assert.ok(notes[0].startsWith("Re-attached"));
});

test("two lead-ins: list stays at the end and is flagged for an editor", () => {
  const notes: string[] = [];
  const blocks = sectionBlocks({ heading: "H", kind: "source", source_ids: ["S1"], paragraphs: ["Treatments include:", "Two phases:", "Last."], items: ["A"] }, notes);
  assert.equal(blocks[blocks.length - 1].k, "ul");
  assert.ok(notes.some((n) => n.startsWith("List order uncertain")));
});

test("stray agency bylines and US race risk factors are removed and noted", () => {
  const notes: string[] = [];
  const blocks = sectionBlocks({ heading: "Risk", kind: "source", source_ids: ["S1"], paragraphs: ["Risk factors include:", "NIH: National Cancer Institute"], items: ["Being male", "Being white", "Are Black or African American"] }, notes);
  assert.equal(blocks.length, 2);
  assert.deepEqual((blocks[1] as { items: string[] }).items, ["Being male"]);
  assert.equal(notes.filter((n) => n.startsWith("Removed US")).length, 2);
  assert.ok(notes.some((n) => n.startsWith("Dropped")));
});

test("HPO term sections fold into one term list", () => {
  const raw = {
    condition_name: "X syndrome",
    other_names: "X syndrome; Y syndrome; Y syndrome",
    sources: [
      { id: "S1", label: "Orphanet — X", url: "https://www.orpha.net/en/disease/detail/261323", rights: "", version: null, retrieved_on: null },
      { id: "S2", label: "Human Phenotype Ontology Consortium — terms", url: "https://hpo.jax.org/", rights: "", version: null, retrieved_on: null },
    ],
    sections: [
      { heading: "What it is", paragraphs: ["A rare syndrome."], items: [], source_ids: ["S1"], kind: "source" },
      { heading: "Reported clinical features and what the terms mean", paragraphs: ["Intro."], items: [], source_ids: ["S1", "S2"], kind: "orientation" },
      { heading: "Thrombocytopenia", paragraphs: ["Reported frequency: Very frequent (99-80%).", "A reduction in platelets."], items: [], source_ids: ["S1", "S2"], kind: "source" },
      { heading: "Short stature", paragraphs: ["Reported frequency: Frequent (79-30%)."], items: [], source_ids: ["S1"], kind: "source" },
      { heading: "Which doctor should you see?", paragraphs: ["…"], items: [], source_ids: [], kind: "orientation" },
    ],
  } as unknown as RawCondition;
  const c = cleanCondition(raw);
  assert.equal(c.sections.length, 3);
  assert.deepEqual(c.sections[1].terms?.map((t) => t.term), ["Thrombocytopenia", "Short stature"]);
  assert.equal(c.sections[1].terms?.[0].frequency, "Very frequent (99-80%)");
  assert.equal(c.sections[1].terms?.[1].definition, null);
  assert.equal(c.orphaCode, "261323");
  assert.deepEqual(c.otherNames, ["Y syndrome"]);
  assert.deepEqual(splitOtherNames(null, "X"), []);
});

test("letters", () => {
  assert.equal(letterOf("10q26 deletion syndrome"), "0-9");
  assert.equal(letterOf(" asthma"), "a");
  assert.equal(LETTERS.length, 27);
});

const base = {
  slug: "asthma",
  title: "Asthma",
  standfirst: "s",
  targetQuery: "asthma",
  department: "pulmonology",
  specialty: "pulmonology" as const,
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  symptoms: [],
  tests: [],
  treatments: [],
  body: [],
  faqs: [],
  sources: [],
};

test("no reviewer, no index — a date alone or a role alone is not a review", () => {
  assert.equal(articleIndexable(null), false);
  assert.equal(articleIndexable({ ...base, reviewer: null, reviewedOn: "01 Oct 2026" }), false);
  assert.equal(articleIndexable({ ...base, reviewer: { name: "Dr A", qualification: "MD", council: "KMC", registration: "" }, reviewedOn: "01 Oct 2026" }), false);
  assert.equal(articleIndexable({ ...base, reviewer: { name: "Dr A", qualification: "MD", council: "KMC", registration: "12345" }, reviewedOn: "" }), false);
  assert.equal(articleIndexable({ ...base, reviewer: { name: "Dr A", qualification: "MD", council: "KMC", registration: "12345" }, reviewedOn: "01 Oct 2026" }), true);
});

test("draft markup: identity only — no clinical claims, no reviewer", () => {
  const ld = conditionLd({ path: "/conditions/x", name: "X", title: "X", description: "d", otherNames: ["Y"], specialtyKey: "neurology", orphaCode: "1", basedOn: ["https://a"], article: null });
  const json = JSON.stringify(ld);
  assert.ok(!json.includes("reviewedBy") && !json.includes("lastReviewed"));
  assert.ok(!json.includes("signOrSymptom") && !json.includes("possibleTreatment"));
  assert.ok(json.includes("MedicalCondition") && json.includes("ORPHA:1"));
});

test("unreviewed article markup carries clinical entities but no review claim", () => {
  const ld = conditionLd({ path: "/conditions/x", name: "X", title: "X", description: "d", otherNames: [], specialtyKey: null, orphaCode: null, basedOn: [], article: { writtenOn: "01 Oct 2026", updatedOn: "01 Oct 2026", wordCount: 1, symptoms: ["Cough"], tests: [], treatments: [], reviewed: null } });
  const json = JSON.stringify(ld);
  assert.ok(json.includes("signOrSymptom"));
  assert.ok(!json.includes("reviewedBy"));
});

// ---- Editorial bar for original articles (Phase B) --------------------------

const MIN_WORDS = 1000;
const BANNED = [/\b\d+(\.\d+)?\s?mg\b/i, /\bguarantee/i, /\bcure[sd]?\b(?! rate)/i, /\bbest (doctor|hospital)/i, /₹\s?\d/];

for (const a of ARTICLES) {
  test(`article ${a.slug}: editorial bar`, () => {
    assert.ok(articleWordCount(a) >= MIN_WORDS, `${a.slug}: ${articleWordCount(a)} words`);
    assert.ok(a.standfirst.length <= DESCRIPTION_MAX, `${a.slug}: standfirst too long`);
    assert.ok(a.body.filter((b) => b.k === "h2").length >= 5, `${a.slug}: needs ≥5 sections`);
    assert.ok(a.faqs.length >= 3, `${a.slug}: needs ≥3 questions`);
    assert.ok(DEPARTMENTS.some((d) => d.slug === a.department), `${a.slug}: unknown department`);
    assert.ok(SPECIALTIES[a.specialty], `${a.slug}: unknown specialty`);
    assert.ok(a.sources.length >= 2, `${a.slug}: needs ≥2 sources`);
    if (a.reviewedOn) assert.ok(a.reviewer, `${a.slug}: review date without a reviewer`);
    for (const href of articleLinks(a)) if (href.startsWith("/")) assert.match(href, /^\/(conditions|specialties|doctors|health-guides|blog)\//, `${a.slug}: link ${href}`);
    const text = JSON.stringify(a.body) + JSON.stringify(a.faqs);
    for (const re of BANNED) assert.ok(!re.test(text), `${a.slug}: banned pattern ${re}`);
    for (const n of [...a.symptoms, ...a.tests, ...a.treatments]) assert.ok(text.toLowerCase().includes(n.toLowerCase()), `${a.slug}: markup entity "${n}" not on page`);
  });
}

test("article slugs are unique", () => {
  assert.equal(new Set(ARTICLES.map((a) => a.slug)).size, ARTICLES.length);
});
