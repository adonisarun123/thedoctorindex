import assert from "node:assert/strict";
import { test } from "node:test";

import { autoGate, fingerprint, independentSourceCount, istDateTime, istDay, newsSlug, publisherDomain, storyProblems, type StoryInput } from "../../lib/news/format";
import { instagramCaption } from "../../lib/news/caption";

const body = Array.from({ length: 30 }, () => "The surgeon and her team completed the procedure at the hospital this week.").join(" ");
const good: StoryInput = {
  headline: "Bengaluru cardiologist receives national award for heart-failure research",
  dek: "The award recognises fifteen years of work on low-cost heart-failure clinics in district hospitals across Karnataka.",
  highlights: ["Awarded the national prize on 5 October.", "Research covered 12 district hospitals.", "Clinics cut readmissions, the study reports."],
  whyItMatters: "Heart failure is often managed late in India; district clinics bring follow-up care closer to patients' homes.",
  body,
  numbers: [{ value: "12", label: "district hospitals" }],
  category: "award",
  subjectName: "Dr Asha Rao",
  sources: [
    { url: "https://www.thehindu.com/a", publisher: "The Hindu", title: "A", publishedOn: new Date().toISOString().slice(0, 10) },
    { url: "https://timesofindia.indiatimes.com/b", publisher: "TOI", title: "B" },
  ],
};

test("a well-formed story has no problems", () => {
  assert.deepEqual(storyProblems(good), []);
});

test("superlatives in our own voice are refused, quoted ones allowed", () => {
  assert.ok(storyProblems({ ...good, headline: "India's best cardiologist receives a national award for research" }).some((p) => p.includes("best")));
  assert.deepEqual(storyProblems({ ...good, dek: "Colleagues called her “the best teacher we had” as she received the national award for research." }), []);
});

test("highlights must be exactly three", () => {
  assert.ok(storyProblems({ ...good, highlights: good.highlights.slice(0, 2) }).length > 0);
});

test("syndicated outlets of one group count once", () => {
  assert.equal(publisherDomain("https://timesofindia.indiatimes.com/x"), "times");
  assert.equal(publisherDomain("https://m.economictimes.com/y"), "times");
  assert.equal(publisherDomain("https://www.pib.gov.in/z"), "pib.gov.in");
  assert.equal(independentSourceCount([{ url: "https://timesofindia.indiatimes.com/a", publisher: "", title: "" }, { url: "https://economictimes.indiatimes.com/b", publisher: "", title: "" }]), 1);
});

test("auto gate (option C): 2 sources + matched doctor + claims ok", () => {
  assert.equal(autoGate({ sources: good.sources, matchedDoctor: true, claimsOk: true, problems: [] }).eligible, true);
  assert.equal(autoGate({ sources: good.sources.slice(0, 1), matchedDoctor: true, claimsOk: true, problems: [] }).eligible, false);
  assert.equal(autoGate({ sources: good.sources, matchedDoctor: false, claimsOk: true, problems: [] }).eligible, false);
  assert.equal(autoGate({ sources: good.sources, matchedDoctor: true, claimsOk: false, problems: [] }).eligible, false);
});

test("fingerprint ignores honorifics and word order", () => {
  assert.equal(fingerprint("Dr. Asha Rao", "national award heart failure"), fingerprint("Asha Rao", "heart failure national award"));
});

test("slug is ascii, hyphenated, at most 80 chars", () => {
  const s = newsSlug("Dr. Ráo’s team performs India’s first robotic surgery — a milestone for public hospitals in Karnataka and beyond");
  assert.ok(s.length <= 80 && /^[a-z0-9-]+$/.test(s) && !s.endsWith("-"));
});

test("IST day boundary", () => {
  assert.equal(istDay(new Date("2026-10-07T18:29:00Z")), "2026-10-07");
  assert.equal(istDay(new Date("2026-10-07T18:31:00Z")), "2026-10-08");
  assert.equal(istDateTime(new Date("2026-10-07T00:35:00Z")), "7 Oct 2026, 6:05 am IST");
});

test("caption carries highlights and a tag marker", () => {
  const c = instagramCaption({ ...good, place: "Bengaluru, Karnataka", slug: "x" }, "Cardiology");
  assert.ok(c.includes("▪️ Awarded") && c.includes("#Bengaluru") && c.includes("[Tag the doctor"));
});

test("stale or undated stories need an editor", () => {
  const old = good.sources.map((x) => ({ ...x, publishedOn: "2026-01-24" }));
  assert.equal(autoGate({ sources: old, matchedDoctor: true, claimsOk: true, problems: [], now: new Date("2026-10-07") }).eligible, false);
  const undated = good.sources.map((x) => ({ ...x, publishedOn: null }));
  assert.equal(autoGate({ sources: undated, matchedDoctor: true, claimsOk: true, problems: [] }).eligible, false);
});

test("a body that narrates its sourcing is flagged", () => {
  assert.ok(storyProblems({ ...good, body: good.body + " The report does not give their hospitals." }).some((p) => p.includes("comments on its sources")));
});
