import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";

export interface DraftManifestEntry {
  id: string;
  condition_name: string;
  slug: string;
  title: string;
  department: string;
  doctor: string;
  status: "draft";
  word_count: number;
  condition_source_word_count: number;
  source_collection: string;
  source_gaps: string[];
  review_flags: string[];
  compiled_on: string;
  primary_source: string;
  batch: number;
  content_sha256: string;
}

export interface ConditionDraft extends Omit<DraftManifestEntry, "batch" | "primary_source"> {
  publicly_available: false;
  author: null;
  medical_reviewer: null;
  reviewed_on: null;
  published_on: null;
  source_method: string;
  attribution: string;
  hpo_citation: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    items: string[];
    source_ids: string[];
    kind: "source" | "orientation";
  }>;
  sources: Array<{
    id: string;
    label: string;
    url: string;
    rights: string;
    version: string | null;
    retrieved_on: string;
  }>;
}

// Files remain outside public/. Only authenticated admin pages consume this module.
const directory = path.join(process.cwd(), "data", "condition-drafts");
let manifest: Promise<DraftManifestEntry[]> | undefined;

export function conditionDraftManifest(): Promise<DraftManifestEntry[]> {
  manifest ??= readFile(path.join(directory, "manifest.json.gz")).then((bytes) => JSON.parse(gunzipSync(bytes).toString("utf8")));
  return manifest;
}

export async function conditionDraftById(id: string): Promise<ConditionDraft | undefined> {
  if (!/^TDI-C-\d{4}$/.test(id)) return undefined;
  const entry = (await conditionDraftManifest()).find((row) => row.id === id);
  if (!entry || !Number.isInteger(entry.batch) || entry.batch < 1 || entry.batch > 25) return undefined;
  const file = `batch-${String(entry.batch).padStart(2, "0")}.json.gz`;
  const records: ConditionDraft[] = JSON.parse(gunzipSync(await readFile(path.join(directory, file))).toString("utf8"));
  return records.find((row) => row.id === id);
}

export function filterConditionDrafts(
  rows: DraftManifestEntry[],
  query: string,
  department: string,
  limited: boolean,
): DraftManifestEntry[] {
  const q = query.trim().toLocaleLowerCase();
  return rows.filter((row) =>
    (!q || `${row.condition_name} ${row.id}`.toLocaleLowerCase().includes(q)) &&
    (!department || row.department === department) &&
    (!limited || row.condition_source_word_count < 350),
  );
}
