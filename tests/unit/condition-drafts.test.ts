import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";

import { conditionDraftById, conditionDraftManifest, filterConditionDrafts, type ConditionDraft } from "../../lib/content/condition-drafts";

test("draft catalogue and every batch preserve the content and unpublished status", async () => {
  const manifest = await conditionDraftManifest();
  assert.equal(manifest.length, 2500);
  assert.equal(new Set(manifest.map((row) => row.id)).size, 2500);
  assert.equal(new Set(manifest.map((row) => row.slug)).size, 2500);
  let count = 0;
  for (let batch = 1; batch <= 25; batch++) {
    const rows: ConditionDraft[] = JSON.parse(gunzipSync(await readFile(path.join(process.cwd(), "data/condition-drafts", `batch-${String(batch).padStart(2, "0")}.json.gz`))).toString("utf8"));
    assert.equal(rows.length, 100);
    for (const row of rows) {
      count++;
      assert.equal(row.status, "draft", row.id);
      assert.equal(row.publicly_available, false, row.id);
      assert.equal(row.medical_reviewer, null, row.id);
      assert.equal(row.published_on, null, row.id);
      const text = row.sections.map((section) => [...section.paragraphs, ...section.items].join("\n")).join("\n\n");
      const wordCount = (text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length;
      assert.ok(wordCount >= 700, `${row.id}: ${wordCount}`);
      assert.equal(wordCount, row.word_count, row.id);
      assert.equal(createHash("sha256").update(text).digest("hex"), row.content_sha256);
      assert.ok(row.sources.length > 0);
      const sourceIds = new Set(row.sources.map((source) => source.id));
      for (const section of row.sections) for (const source of section.source_ids) assert.ok(sourceIds.has(source), `${row.id}: unknown source ${source}`);
      for (const source of row.sources) assert.match(source.url, /^https:\/\//);
      assert.equal(manifest.find((entry) => entry.id === row.id)?.batch, batch);
    }
  }
  assert.equal(count, 2500);
});

test("unknown IDs cannot become file paths; search supports department and research filters", async () => {
  assert.equal(await conditionDraftById("../../package.json"), undefined);
  assert.equal(await conditionDraftById("TDI-C-9999"), undefined);
  const rows = await conditionDraftManifest();
  const asthma = rows.find((row) => row.condition_name === "Asthma")!;
  assert.equal((await conditionDraftById(asthma.id))?.condition_name, "Asthma");
  assert.deepEqual(filterConditionDrafts(rows, ` ${asthma.id.toLowerCase()} `, asthma.department, false).map((row) => row.id), [asthma.id]);
  assert.ok(filterConditionDrafts(rows, "", "", true).every((row) => row.condition_source_word_count < 350));
});

test("both draft pages enforce staff authentication before reading article data", async () => {
  for (const file of ["page.tsx", "[id]/page.tsx"]) {
    const code = await readFile(path.join(process.cwd(), "app/admin/(app)/condition-drafts", file), "utf8");
    assert.ok(code.indexOf("await requireStaff()") < code.indexOf("await conditionDraft"), file);
    assert.match(code, /privateMeta\(/);
    assert.doesNotMatch(code, /dangerouslySetInnerHTML/);
  }
});
