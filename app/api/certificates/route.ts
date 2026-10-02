import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { uploadCertificate } from "@/lib/services/qualification-evidence";

export const dynamic = "force-dynamic";

/**
 * One certificate per request. The form uploads each file the moment it is
 * picked and keeps only the returned id, so a doctor listing ten courses never
 * sends one oversized request. The file is private from the start; it is only
 * linked to a qualification when the form is submitted, and the server re-checks
 * that the id belongs to the submitting user.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Choose a file." }, { status: 400 });
    const row = await uploadCertificate(user.id, { name: file.name, type: file.type, bytes: Buffer.from(await file.arrayBuffer()) });
    return NextResponse.json({ id: row.id, filename: file.name, size: row.size }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed." }, { status: 400 });
  }
}
