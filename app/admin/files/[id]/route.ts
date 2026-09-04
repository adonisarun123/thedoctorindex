import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { audit } from "@/lib/services/audit";
import { readFile } from "@/lib/services/files";

export const dynamic = "force-dynamic";

/**
 * Staff-only download of a private file (review evidence, claim documents).
 * Never cached, never indexed, always audited. Files live in the database
 * for the MVP; when `storage_key` is set the bytes are expected in object
 * storage and this route should redirect to a short-lived signed URL.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "staff" || user.staffRoles.length === 0 || (user.mfaEnrolled && !user.mfaVerified)) {
    return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const { id } = await ctx.params;
  const f = await readFile(id);
  if (!f) return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  if (f.scan === "infected") return new NextResponse("File quarantined", { status: 423 });
  if (!f.data) return new NextResponse("File stored externally; signed-URL delivery not configured", { status: 501 });

  await audit({ actorUserId: user.id, actorRole: "staff", action: "file.viewed", entityType: "file", entityId: f.id, after: { filename: f.filename, bucket: f.bucket } });

  const safeName = f.filename.replace(/[^\w.\- ]+/g, "_");
  return new NextResponse(new Uint8Array(f.data), {
    status: 200,
    headers: {
      "Content-Type": f.mime,
      "Content-Length": String(f.size),
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
