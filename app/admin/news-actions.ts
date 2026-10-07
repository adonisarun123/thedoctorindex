"use server";

import { revalidatePath } from "next/cache";

import type { AdminState } from "@/app/admin/actions";
import { requireStaff } from "@/lib/auth/session";
import type { NewsNumber } from "@/lib/news/format";
import { type StoryDecision, decideStory, editStory, linkDoctor, publishDue, unlinkDoctor } from "@/lib/services/news";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

function refresh(slug?: string) {
  for (const p of ["/admin/news", "/news", "/news/feed.xml", "/sitemaps/news.xml", "/sitemaps/newsroom.xml", "/sitemap.xml"]) revalidatePath(p);
  if (slug) revalidatePath(`/news/${slug}`);
}

export async function decideStoryAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("content_editor");
    const decision = str(f, "decision") as StoryDecision;
    const row = await decideStory(str(f, "id"), decision, u.id, str(f, "note") || undefined);
    refresh(row.slug);
    const msg: Record<StoryDecision, string> = {
      approve: "Approved — it goes live in the next free daily slot.",
      publish: "Published now.",
      reject: "Rejected.",
      withdraw: "Withdrawn — the page now returns 404.",
      restore: "Restored to the review queue.",
    };
    return { ok: true, message: msg[decision] };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function editStoryAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("content_editor");
    const numbers: NewsNumber[] = str(f, "numbers")
      .split("\n")
      .map((l) => l.split("|").map((x) => x.trim()))
      .filter((p) => p.length === 2 && p[0] && p[1])
      .map(([value, label]) => ({ value, label }));
    const row = await editStory(
      str(f, "id"),
      {
        headline: str(f, "headline"),
        dek: str(f, "dek"),
        highlights: [str(f, "h1"), str(f, "h2"), str(f, "h3")],
        whyItMatters: str(f, "whyItMatters"),
        body: String(f.get("body") ?? ""),
        numbers,
        category: str(f, "category"),
        subjectName: str(f, "subjectName"),
        subjectRole: str(f, "subjectRole"),
        place: str(f, "place"),
        correction: str(f, "correction") || undefined,
      },
      u.id,
    );
    refresh(row.slug);
    return { ok: true, message: "Saved." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function linkDoctorAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("content_editor");
    const doctor = str(f, "doctor");
    if (str(f, "op") === "unlink") await unlinkDoctor(str(f, "id"), doctor, u.id);
    else {
      const { getDb } = await import("@/lib/db/client");
      const s = await import("@/lib/db/schema");
      const { eq, or } = await import("drizzle-orm");
      const slug = doctor.replace(/^https?:\/\/[^/]+\/doctor\//, "").replace(/\/$/, "");
      const [d] = await getDb().select({ id: s.doctors.id }).from(s.doctors).where(or(eq(s.doctors.slug, slug), eq(s.doctors.tdiId, slug.toUpperCase()))).limit(1);
      if (!d) throw new Error("No profile with that URL, slug or TDi ID.");
      await linkDoctor(str(f, "id"), d.id, f.get("primary") === "on", u.id);
    }
    refresh();
    return { ok: true, message: "Profile link updated." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function publishDueAction(_p: AdminState, _f: FormData): Promise<AdminState> {
  try {
    await requireStaff("content_editor");
    const out = await publishDue();
    for (const r of out) refresh(r.slug);
    refresh();
    return { ok: true, message: out.length ? `Published ${out.length} from the buffer.` : "Today's slots are already filled, or the buffer is empty." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
