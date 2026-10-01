"use server";

import { revalidatePath } from "next/cache";

import { getDashboardContext } from "@/lib/dashboard";
import { addCredential } from "@/lib/services/doctors";

export interface PubState {
  ok?: boolean;
  error?: string;
  message?: string;
}

/** Add the papers the doctor ticked as self-reported publications. */
export async function importPublicationsAction(_prev: PubState, form: FormData): Promise<PubState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Clinic managers cannot edit credentials." };
    const picked = form.getAll("paper").map((v) => {
      try {
        return JSON.parse(String(v)) as { title: string; journal: string | null; year: number | null; url: string | null };
      } catch {
        return null;
      }
    }).filter(Boolean) as Array<{ title: string; journal: string | null; year: number | null; url: string | null }>;
    if (!picked.length) return { error: "Tick the papers you wrote." };
    let added = 0;
    const skipped: string[] = [];
    for (const p of picked) {
      const title = p.title.length > 160 ? `${p.title.slice(0, 157).trimEnd()}…` : p.title;
      const url = p.url && /^https:\/\/(pubmed\.ncbi\.nlm\.nih\.gov|doi\.org)\//.test(p.url) ? p.url : null;
      try {
        await addCredential(ctx.doctorId, { kind: "publication", title, issuer: p.journal, year: p.year, url }, ctx.user.id, { indexedTitle: true });
        added++;
      } catch (e) {
        skipped.push(e instanceof Error ? e.message : "could not add");
        if (/at most 40/.test(String(e))) break;
      }
    }
    revalidatePath("/dashboard", "layout");
    revalidatePath(`/doctor/${ctx.doctor.slug}`);
    return {
      ok: added > 0,
      error: added ? undefined : skipped[0],
      message: `${added} added to your profile as self-reported publications${skipped.length ? `; ${skipped.length} skipped (${[...new Set(skipped)].join(" ")})` : ""}.`,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
