import { NextResponse, type NextRequest } from "next/server";

import { sha256 } from "@/lib/auth/hash";
import { track, type EventKind } from "@/lib/services/events";

const KINDS = new Set<EventKind>([
  "search_started", "search_completed", "zero_results", "filter_applied", "profile_viewed",
  "call_clicked", "directions_clicked", "website_clicked", "whatsapp_clicked",
  "profile_started", "claim_started", "review_started",
]);

/**
 * First-party analytics beacon. Accepts a kind and a doctor id, nothing that
 * identifies a person. The session hash is derived from a first-party cookie
 * the client sets, salted server-side, and cannot be reversed.
 */
export async function POST(req: NextRequest) {
  let body: { kind?: string; doctorId?: string; practiceId?: string; path?: string; query?: string; localityKey?: string; sid?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body.kind || !KINDS.has(body.kind as EventKind)) return NextResponse.json({ ok: false }, { status: 400 });
  await track(body.kind as EventKind, {
    doctorId: body.doctorId ?? null,
    practiceId: body.practiceId ?? null,
    path: body.path ?? null,
    query: body.query ?? null,
    localityKey: body.localityKey ?? null,
    sessionHash: body.sid ? sha256(body.sid, process.env.CONTACT_HASH_PEPPER ?? "tdi").slice(0, 32) : null,
  });
  return NextResponse.json({ ok: true });
}
