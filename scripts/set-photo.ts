import { readFileSync } from "node:fs";

import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { revalidateSite } from "./revalidate-site";

import { getDb } from "../lib/db/client";
import * as s from "../lib/db/schema";
import { setDoctorPhoto } from "../lib/services/photos";

config({ path: ".env.local" });
config();

/**
 * Set a doctor's photograph from the command line.
 *
 *   npm run db:photo -- --slug naveen-kumar-lv-19162b --url https://host/photo.webp --consent --note "practice website, with permission"
 *   npm run db:photo -- --slug some-doctor-abc123 --file ./photo.jpg --consent
 *
 * Goes through the same service the admin panel uses: sharp re-encodes to a
 * 512 px WebP (dropping EXIF), the bytes land in `files`, any previous photo
 * is soft-deleted and the quality score is recomputed.
 *
 * --consent is mandatory and is not a formality. The public photo route only
 * serves a file while `photo_consent` is true, so setting it asserts that we
 * hold permission to publish this portrait. Where the image came from is
 * written to the audit log, so the assertion can be traced later.
 */

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const MAX_FETCH_BYTES = 15 * 1024 * 1024;

function mimeFromPath(p: string): string {
  const ext = p.toLowerCase().split(".").pop();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "heic") return "image/heic";
  throw new Error(`Cannot tell the type of ${p} — use .jpg, .png, .webp or .heic`);
}

async function fetchImage(url: string): Promise<{ bytes: Buffer; mime: string; filename: string }> {
  const res = await fetch(url, {
    headers: {
      "user-agent": "TheDoctorIndexBot/1.0 (+https://www.thedoctorindex.com)",
      accept: "image/avif,image/webp,image/jpeg,image/png,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!mime.startsWith("image/")) throw new Error(`${url} is ${mime || "an unknown type"}, not an image`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (!bytes.length) throw new Error(`${url} returned an empty body`);
  if (bytes.length > MAX_FETCH_BYTES) throw new Error(`${url} is ${Math.round(bytes.length / 1024 / 1024)} MB — too large`);
  const filename = (new URL(url).pathname.split("/").pop() || "photo").slice(0, 120);
  return { bytes, mime, filename };
}

async function main() {
  const slug = arg("slug");
  const url = arg("url");
  const file = arg("file");
  const note = arg("note");
  const consent = process.argv.includes("--consent");

  if (!slug || (!url && !file)) {
    throw new Error("usage: npm run db:photo -- --slug <slug> (--url <https://...> | --file <path>) --consent [--note '<where it came from>']");
  }
  if (!consent) {
    throw new Error("Refusing to publish a photograph without --consent: photo_consent is a claim that we hold permission to publish it.");
  }

  const db = getDb();
  const [doctor] = await db
    .select({ id: s.doctors.id, name: s.doctors.name, status: s.doctors.status, photo: s.doctors.photoFileId })
    .from(s.doctors)
    .where(eq(s.doctors.slug, slug))
    .limit(1);
  if (!doctor) throw new Error(`No doctor with slug ${slug}`);

  const [staff] = await db
    .select({ id: s.users.id, email: s.users.email })
    .from(s.staffMembers)
    .innerJoin(s.users, eq(s.users.id, s.staffMembers.userId))
    .where(eq(s.staffMembers.active, true))
    .limit(1);

  const src = url
    ? await fetchImage(url)
    : { bytes: readFileSync(file!), mime: mimeFromPath(file!), filename: file!.split("/").pop()! };
  console.log(`source: ${url ?? file} (${src.mime}, ${Math.round(src.bytes.length / 1024)} KB)`);

  const fileId = await setDoctorPhoto(doctor.id, src, staff?.id ?? null, staff ? "staff" : "script", true);

  await db.insert(s.auditLogs).values({
    actorUserId: staff?.id ?? null,
    actorRole: staff ? "staff" : "script",
    action: "doctor.photo.source",
    entityType: "doctor",
    entityId: doctor.id,
    after: { fileId, sourceUrl: url ?? null, sourceFile: url ? null : file, note: note ?? null },
    reason: note ?? null,
  });

  const [after] = await db
    .select({ q: s.doctors.qualityScore })
    .from(s.doctors)
    .where(eq(s.doctors.id, doctor.id))
    .limit(1);
  console.log(`${doctor.name}: photo ${doctor.photo ? "replaced" : "set"} -> file ${fileId}`);
  console.log(`served at /photos/${fileId} (profile status: ${doctor.status}); quality score now ${after?.q ?? "?"}`);

  await revalidateSite();
  process.exit(0);
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exit(1);
});
