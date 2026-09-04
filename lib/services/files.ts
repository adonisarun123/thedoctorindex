import "server-only";

import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";

/**
 * Private file store. MVP keeps bytes in Postgres (bytea) so evidence works
 * with zero infrastructure; the `storageKey` column is the hook for moving to
 * object storage (STORAGE_* in .env.example) without a schema change.
 *
 * Every upload is type-checked and size-capped. A real scanner (ClamAV) plugs
 * in at `scan`; until then files are marked `skipped`, never `clean`.
 */

const ALLOWED = new Set((process.env.UPLOAD_ALLOWED_MIME_DOCUMENTS ?? "application/pdf,image/jpeg,image/png,image/webp").split(",").map((x) => x.trim()));
const MAX = Number(process.env.UPLOAD_MAX_BYTES ?? 10 * 1024 * 1024);

export async function storeFile(input: { bucket: "private" | "quarantine" | "public"; filename: string; mime: string; bytes: Buffer; uploadedByUserId: string | null }) {
  if (!ALLOWED.has(input.mime)) throw new Error(`File type ${input.mime} is not accepted. Upload a PDF, JPEG, PNG or WebP.`);
  if (input.bytes.length === 0) throw new Error("The file is empty.");
  if (input.bytes.length > MAX) throw new Error(`Keep files under ${Math.round(MAX / 1024 / 1024)} MB.`);
  const sha = createHash("sha256").update(input.bytes).digest("hex");
  const bytes = input.mime.startsWith("image/") ? stripJpegExif(input.bytes, input.mime) : input.bytes;
  const [row] = await getDb()
    .insert(s.files)
    .values({ bucket: input.bucket, filename: input.filename.slice(0, 200), mime: input.mime, size: bytes.length, sha256: sha, data: bytes, uploadedByUserId: input.uploadedByUserId, scan: process.env.UPLOAD_SCANNER_URL ? "pending" : "skipped" })
    .returning({ id: s.files.id, size: s.files.size });
  return row;
}

export async function readFile(id: string) {
  const [f] = await getDb().select().from(s.files).where(eq(s.files.id, id)).limit(1);
  if (!f || f.deletedAt) return null;
  return f;
}

export async function deleteFile(id: string) {
  await getDb().update(s.files).set({ data: null, deletedAt: new Date() }).where(eq(s.files.id, id));
}

/**
 * Minimal EXIF strip for JPEG: drops APP1 (Exif) and APP13 (Photoshop)
 * segments. PNG/WebP metadata is left as-is at this stage; a full image
 * pipeline (sharp) replaces this in production.
 */
function stripJpegExif(buf: Buffer, mime: string): Buffer {
  if (mime !== "image/jpeg" || buf[0] !== 0xff || buf[1] !== 0xd8) return buf;
  const out: Buffer[] = [buf.subarray(0, 2)];
  let i = 2;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xda) {
      out.push(buf.subarray(i));
      break;
    }
    const len = buf.readUInt16BE(i + 2);
    const segment = buf.subarray(i, i + 2 + len);
    if (marker !== 0xe1 && marker !== 0xed) out.push(segment);
    i += 2 + len;
  }
  return Buffer.concat(out);
}
