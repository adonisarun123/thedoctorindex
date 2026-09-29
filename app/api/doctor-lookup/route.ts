import { NextResponse } from "next/server";

import { getDoctorBySlug, suggestDoctors } from "@/lib/data";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";

export const dynamic = "force-dynamic";

export interface LookupDoctor {
  slug: string;
  id: string;
  name: string;
  specialty: string;
  city: string | null;
  claimed: boolean;
  photoUrl: string | null;
}

/**
 * "Find your own profile" for the doctor landing page (/for-doctors/free-profile).
 *
 * Same typo-tolerant name match as the header search, plus the one field the
 * header does not need: whether the profile is already claimed, so the page can
 * offer "Claim" or "Sign in" instead of sending a doctor into a claim that will
 * be refused. Only what the public profile pages already publish.
 */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "")
    .trim()
    .replace(/^dr\.?\s+/i, "")
    .slice(0, 80);
  const headers = { "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600" };
  if (q.length < 3) return NextResponse.json({ doctors: [] }, { headers });

  const hits = await suggestDoctors(q, 8);
  const views = await Promise.all(hits.map((h) => getDoctorBySlug(h.slug)));
  const doctors: LookupDoctor[] = [];
  hits.forEach((h, i) => {
    const v = views[i];
    if (!v) return;
    doctors.push({
      slug: v.slug,
      id: v.id,
      name: displayName(v),
      specialty: SPECIALTIES[v.specialty]?.one ?? "",
      city: h.city,
      claimed: v.claimed,
      photoUrl: v.photoUrl ?? null,
    });
  });
  return NextResponse.json({ doctors }, { headers });
}
