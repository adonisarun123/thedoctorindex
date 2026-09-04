import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";

export const dynamic = "force-dynamic";

/**
 * Public doctor photographs. Served only while the file is the current photo
 * of a published profile whose consent flag is on — withdrawing consent or
 * retiring the profile makes the URL 404 immediately, whatever a CDN cached
 * (max-age is kept short; the file id changes on every re-upload anyway).
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new NextResponse(null, { status: 404 });
  const db = getDb();
  const [d] = await db
    .select({ id: s.doctors.id })
    .from(s.doctors)
    .where(and(eq(s.doctors.photoFileId, id), eq(s.doctors.photoConsent, true), eq(s.doctors.status, "published")))
    .limit(1);
  if (!d) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  const [f] = await db.select({ data: s.files.data, mime: s.files.mime, size: s.files.size, sha: s.files.sha256 }).from(s.files).where(eq(s.files.id, id)).limit(1);
  if (!f?.data) return new NextResponse(null, { status: 404 });
  return new NextResponse(new Uint8Array(f.data), {
    headers: {
      "Content-Type": f.mime,
      "Content-Length": String(f.size),
      ETag: `"${f.sha.slice(0, 16)}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
