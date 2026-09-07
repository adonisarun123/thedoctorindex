import "server-only";

import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { recomputeQuality } from "@/lib/services/doctors";
import { deleteFile } from "@/lib/services/files";

/**
 * Doctor photographs. Normalised server-side to a 512 px WebP square-ish
 * crop with sharp: re-encoding drops EXIF/GPS metadata entirely, bounds the
 * size, and means the public route only ever serves a format we produced.
 * Consent is recorded on the doctor row; the public route refuses to serve
 * a photo whose consent has been withdrawn or whose profile is not published.
 */
const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES ?? 10 * 1024 * 1024);
const ALLOWED = new Set((process.env.UPLOAD_ALLOWED_MIME_IMAGES ?? "image/jpeg,image/png,image/webp,image/heic").split(",").map((x) => x.trim()));

export async function setDoctorPhoto(doctorId: string, file: { mime: string; bytes: Buffer; filename: string }, actorUserId: string | null, actorRole: string, consent: boolean) {
  if (!ALLOWED.has(file.mime)) throw new Error("Upload a JPEG, PNG or WebP photograph.");
  if (!file.bytes.length) throw new Error("The file is empty.");
  if (file.bytes.length > MAX_BYTES) throw new Error(`Keep the photo under ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`);
  if (!consent) throw new Error("Tick the consent box: we only publish a photograph with the doctor's permission.");

  const sharp = (await import("sharp")).default;
  const out = await sharp(file.bytes, { failOn: "error" }).rotate().resize(512, 512, { fit: "cover", position: "attention" }).webp({ quality: 82 }).toBuffer();

  const db = getDb();
  const [d] = await db.select({ old: s.doctors.photoFileId }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  if (!d) throw new Error("Doctor not found.");
  const [row] = await db
    .insert(s.files)
    .values({ bucket: "public", filename: file.filename.replace(/\.[^.]+$/, "") .slice(0, 120) + ".webp", mime: "image/webp", size: out.length, sha256: createHash("sha256").update(out).digest("hex"), data: out, uploadedByUserId: actorUserId, scan: "skipped" })
    .returning({ id: s.files.id });
  await db.update(s.doctors).set({ photoFileId: row.id, photoConsent: true, updatedAt: new Date() }).where(eq(s.doctors.id, doctorId));
  if (d.old) await deleteFile(d.old);
  await audit({ actorUserId, actorRole, action: "doctor.photo.set", entityType: "doctor", entityId: doctorId, before: { fileId: d.old }, after: { fileId: row.id, bytes: out.length } });
  await recomputeQuality(doctorId);
  return row.id;
}

export async function removeDoctorPhoto(doctorId: string, actorUserId: string, actorRole: string, reason?: string) {
  const db = getDb();
  const [d] = await db.select({ old: s.doctors.photoFileId }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  if (!d) throw new Error("Doctor not found.");
  await db.update(s.doctors).set({ photoFileId: null, updatedAt: new Date() }).where(eq(s.doctors.id, doctorId));
  if (d.old) await deleteFile(d.old);
  await audit({ actorUserId, actorRole, action: "doctor.photo.removed", entityType: "doctor", entityId: doctorId, before: { fileId: d.old }, reason });
  await recomputeQuality(doctorId);
}
