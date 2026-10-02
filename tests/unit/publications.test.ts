import assert from "node:assert/strict";
import { test } from "node:test";

import { parseOrcidId, parseOrcidWorks, parsePubmedSummary, pubmedAuthor, pubmedTerm, withoutExisting } from "../../lib/publications";

test("names become PubMed author strings", () => {
  assert.equal(pubmedAuthor("Dr. Ananya K. Rao"), "Rao AK");
  assert.equal(pubmedAuthor("Devi Prasad Shetty MS FRCS"), "Shetty DP");
  assert.equal(pubmedAuthor("Rao"), "Rao");
});

test("search term carries author and every affiliation word", () => {
  assert.equal(pubmedTerm("Rao AK", "India, Bengaluru"), 'Rao AK[Author] AND "India"[Affiliation] AND "Bengaluru"[Affiliation]');
  assert.equal(pubmedTerm("Rao AK", ""), "Rao AK[Author]");
});

test("ORCID iDs are validated by check digit", () => {
  assert.equal(parseOrcidId("https://orcid.org/0000-0002-1825-0097"), "0000-0002-1825-0097");
  assert.equal(parseOrcidId("0000000218250097"), "0000-0002-1825-0097");
  assert.equal(parseOrcidId("0000-0002-1825-0098"), null);
  assert.equal(parseOrcidId("0000-0001-5109-3700"), "0000-0001-5109-3700");
});

test("esummary and ORCID works parse into papers", () => {
  const pm = parsePubmedSummary({ result: { uids: ["1"], "1": { uid: "1", title: "Fever in <i>children</i>.", fulljournalname: "Indian Pediatr", pubdate: "2024 Mar", authors: [{ name: "Rao AK" }] } } });
  assert.deepEqual(pm, [{ key: "pmid:1", title: "Fever in children", journal: "Indian Pediatr", year: 2024, url: "https://pubmed.ncbi.nlm.nih.gov/1/", authors: ["Rao AK"] }]);
  const oc = parseOrcidWorks({ group: [{ "work-summary": [{ title: { title: { value: "A trial" } }, "journal-title": { value: "BMJ" }, "publication-date": { year: { value: "2021" } }, "external-ids": { "external-id": [{ "external-id-type": "doi", "external-id-value": "10.1/ABC" }] } }] }] });
  assert.equal(oc[0].url, "https://doi.org/10.1/ABC");
  assert.equal(oc[0].key, "doi:10.1/abc");
});

test("papers already on the profile are hidden", () => {
  const found = [{ key: "a", title: "Fever in children", journal: null, year: null, url: "https://pubmed.ncbi.nlm.nih.gov/1/", authors: [] }, { key: "b", title: "Other", journal: null, year: null, url: null, authors: [] }];
  assert.deepEqual(withoutExisting(found, [{ title: "FEVER in children." }]).map((p) => p.key), ["b"]);
});
