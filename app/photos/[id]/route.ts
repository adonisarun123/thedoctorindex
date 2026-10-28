import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";

export const dynamic = "force-dynamic";

/**
 * Public doctor photographs. Served only while the file is the current photo
 * of a published profile whose consent flag is on — withdrawing consent or
 * retiring the profile makes the origin 404 at once.
 *
 * Caching: Vercel's CDN holds a photo for at most an hour (browsers already
 * held it for max-age=3600 plus a day of stale-while-revalidate, unchanged
 * here), so a withdrawn photo leaves the edge within the hour. Before this, nothing was cached at the edge (Cache-Control
 * without s-maxage), so every view ran this function and streamed the bytes
 * out of Postgres. Each response is tagged photo-<id>; to pull one sooner:
 * `vercel cache dangerously-delete --tag photo-<id>`. The file id changes on
 * every re-upload, so replacements never need a purge.
 *
 * A conditional request whose ETag still matches gets a 304 without the
 * blob being read.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new NextResponse(null, { status: 404 });
  const db = getDb();
  const [d] = await db
    .select({ id: s.doctors.id })
    .from(s.doctors)
    .where(and(eq(s.doctors.photoFileId, id), eq(s.doctors.photoConsent, true), eq(s.doctors.status, "published")))
    .limit(1);
  if (!d) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  const [meta] = await db.select({ mime: s.files.mime, size: s.files.size, sha: s.files.sha256 }).from(s.files).where(eq(s.files.id, id)).limit(1);
  if (!meta) return new NextResponse(null, { status: 404 });
  const etag = `"${meta.sha.slice(0, 16)}"`;
  const headers: Record<string, string> = {
    ETag: etag,
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    "Vercel-CDN-Cache-Control": "public, max-age=3600",
    "Vercel-Cache-Tag": `photos,photo-${id}`,
    "X-Content-Type-Options": "nosniff",
  };
  const inm = req.headers.get("if-none-match");
  if (inm && inm.split(",").some((t) => t.trim().replace(/^W\//, "") === etag)) {
    return new NextResponse(null, { status: 304, headers });
  }
  const [f] = await db.select({ data: s.files.data }).from(s.files).where(eq(s.files.id, id)).limit(1);
  if (!f?.data) return new NextResponse(null, { status: 404 });
  return new NextResponse(new Uint8Array(f.data), {
    headers: { ...headers, "Content-Type": meta.mime, "Content-Length": String(meta.size) },
  });
}
