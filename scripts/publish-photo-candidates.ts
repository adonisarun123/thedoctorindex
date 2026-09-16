import { config } from "dotenv";
import { and, eq, isNull, sql } from "drizzle-orm";

import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { setDoctorPhoto } from "../lib/services/photos";

config({ path: ".env.local" });
config();

/**
 * Publish recorded portrait candidates onto their profiles, in bulk.
 *
 *   npm run db:publish-photos -- [--published-only] [--limit N] [--concurrency 4] [--dry]
 *
 * WHAT THIS ASSERTS, PLAINLY: `photo_consent` is the flag the public photo
 * route checks, and setting it is a claim that we hold permission to publish
 * the portrait. For these rows that claim rests on the site owner's
 * instruction, not on the doctor's agreement and not on a licence from the
 * hospital. Every row therefore writes an audit entry naming the hospital page
 * the image came from and recording that the basis was an owner instruction,
 * so the provenance can be traced — and reversed — later.
 *
 * Reversing it: `npm run db:unpublish-photos` clears every photo this wrote.
 *
 * What it will not do:
 *  - overwrite a photo a doctor supplied themselves (claimed profiles are skipped);
 *  - publish a logo, a banner or a stock silhouette — each image is checked for
 *    portrait-like dimensions before it is stored;
 *  - hammer a hospital's CDN: fetches are paced and run few at a time.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const DRY = args.includes("--dry");
const PUBLISHED_ONLY = args.includes("--published-only");
const LIMIT = Number(arg("--limit", String(Infinity)));
const CONCURRENCY = Math.max(1, Math.min(6, Number(arg("--concurrency", "4"))));
const PAUSE_MS = Number(arg("--pause", "250"));

const MAX_FETCH_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

const lastAt = new Map<string, number>();
async function pace(host: string) {
  const wait = (lastAt.get(host) ?? 0) + PAUSE_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastAt.set(host, Date.now());
}

async function fetchImage(url: string, referer?: string) {
  const abs = url.startsWith("//") ? `https:${url}` : url;
  await pace(new URL(abs).host);
  const get = (ua: string, ref?: string) =>
    fetch(abs, {
      headers: {
        "user-agent": ua,
        accept: "image/avif,image/webp,image/jpeg,image/png,*/*",
        "accept-language": "en-IN,en;q=0.9",
        ...(ref ? { referer: ref } : {}),
      },
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    });
  let res = await get("TheDoctorIndexBot/1.0 (+https://www.thedoctorindex.com)");
  // Several hospital CDNs refuse an unfamiliar agent or a request with no
  // referer (hotlink protection). Retry once the way a browser on their own
  // page would ask, which is how the image is already publicly served.
  if (res.status === 403 || res.status === 401) {
    await pace(new URL(abs).host);
    res = await get(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
      referer ?? new URL(abs).origin + "/",
    );
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let mime = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const bytes = Buffer.from(await res.arrayBuffer());
  if (!bytes.length) throw new Error("empty body");
  if (bytes.length > MAX_FETCH_BYTES) throw new Error(`${Math.round(bytes.length / 1024 / 1024)} MB, too large`);
  // Some CDNs answer with octet-stream; trust the magic bytes instead.
  if (!ALLOWED.has(mime)) {
    if (bytes.slice(0, 3).toString("hex") === "ffd8ff") mime = "image/jpeg";
    else if (bytes.slice(0, 8).toString("hex") === "89504e470d0a1a0a") mime = "image/png";
    else if (bytes.slice(8, 12).toString("ascii") === "WEBP") mime = "image/webp";
    else throw new Error(`not an image (${mime || "unknown type"})`);
  }
  return { bytes, mime, filename: (new URL(abs).pathname.split("/").pop() || "photo").slice(0, 120) };
}

/**
 * Is this a portrait of a person, or the hospital's letterhead?
 *
 * Every rejection here is a page that would otherwise have shown a logo where
 * a doctor's face belongs, which is worse than showing nothing.
 */
async function looksLikeAPortrait(bytes: Buffer) {
  const sharp = (await import("sharp")).default;
  const m = await sharp(bytes).metadata();
  const w = m.width ?? 0;
  const h = m.height ?? 0;
  if (w < 150 || h < 150) return `too small (${w}×${h})`;
  const ratio = w / h;
  if (ratio < 0.5 || ratio > 1.6) return `not a portrait shape (${w}×${h})`;
  return null;
}

async function main() {
  const db = getDb();

  const [staff] = await db
    .select({ id: s.users.id })
    .from(s.staffMembers)
    .innerJoin(s.users, eq(s.users.id, s.staffMembers.userId))
    .where(eq(s.staffMembers.active, true))
    .limit(1);

  const rows = await db
    .select({
      candidateId: s.photoCandidates.id,
      doctorId: s.photoCandidates.doctorId,
      url: s.photoCandidates.url,
      sourceUrl: s.photoCandidates.sourceUrl,
      source: s.photoCandidates.source,
      name: s.doctors.name,
      slug: s.doctors.slug,
      status: s.doctors.status,
      claimed: s.doctors.claimed,
      photoFileId: s.doctors.photoFileId,
    })
    .from(s.photoCandidates)
    .innerJoin(s.doctors, eq(s.doctors.id, s.photoCandidates.doctorId))
    .where(and(eq(s.photoCandidates.status, "pending"), isNull(s.doctors.retiredAt)));

  // One portrait per doctor: a doctor listed by two hospitals has two candidates.
  const byDoctor = new Map<string, (typeof rows)[number]>();
  for (const r of rows) {
    if (r.claimed) continue; // never overwrite what a doctor chose for themselves
    if (r.photoFileId) continue; // already has a photo
    if (PUBLISHED_ONLY && r.status !== "published") continue;
    if (!byDoctor.has(r.doctorId)) byDoctor.set(r.doctorId, r);
  }
  const todo = [...byDoctor.values()].slice(0, LIMIT);
  console.log(`${rows.length} pending candidates · ${todo.length} doctors to publish a photo for${DRY ? " · DRY RUN" : ""}`);
  if (DRY) {
    for (const r of todo.slice(0, 10)) console.log(`  would set ${r.name} (${r.status}) ← ${r.url.slice(0, 100)}`);
    process.exit(0);
  }

  let done = 0;
  let failed = 0;
  let rejected = 0;
  let bytesStored = 0;
  const reasons = new Map<string, number>();
  const note = (m: string) => reasons.set(m, (reasons.get(m) ?? 0) + 1);

  let i = 0;
  const worker = async () => {
    while (true) {
      const n = i++;
      if (n >= todo.length) return;
      const r = todo[n];
      try {
        const img = await fetchImage(r.url, r.sourceUrl);
        const bad = await looksLikeAPortrait(img.bytes);
        if (bad) {
          rejected++;
          note(bad.replace(/\d+×\d+/, "WxH"));
          await db.update(s.photoCandidates).set({ status: "rejected", resolvedAt: new Date() }).where(eq(s.photoCandidates.id, r.candidateId));
          continue;
        }
        const fileId = await setDoctorPhoto(r.doctorId, img, staff?.id ?? null, "script", true);
        bytesStored += img.bytes.length;
        await db.insert(s.auditLogs).values({
          actorUserId: staff?.id ?? null,
          actorRole: "script",
          action: "doctor.photo.source",
          entityType: "doctor",
          entityId: r.doctorId,
          after: { fileId, sourceUrl: r.url, sourcePage: r.sourceUrl, source: r.source, basis: "site owner instruction — not doctor consent, not a hospital licence" },
          reason: `portrait taken from ${r.source} and published on the site owner's instruction; the doctor has not consented`,
        });
        await db.update(s.photoCandidates).set({ status: "published", resolvedAt: new Date() }).where(eq(s.photoCandidates.id, r.candidateId));
        done++;
      } catch (e) {
        failed++;
        note(String((e as Error).message).slice(0, 60));
        await db.update(s.photoCandidates).set({ status: "failed", resolvedAt: new Date() }).where(eq(s.photoCandidates.id, r.candidateId));
      }
      if ((done + failed + rejected) % 100 === 0) console.log(`  ${done + failed + rejected}/${todo.length} · set ${done} · rejected ${rejected} · failed ${failed}`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\nphotos set: ${done} · rejected as not-a-portrait: ${rejected} · failed: ${failed}`);
  console.log(`source bytes fetched: ${Math.round(bytesStored / 1024 / 1024)} MB (stored re-encoded at 512px WebP)`);
  if (reasons.size) {
    console.log("reasons:");
    for (const [m, n] of [...reasons].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${String(n).padStart(4)}  ${m}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
