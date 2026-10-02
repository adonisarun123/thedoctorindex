"use server";

import { revalidatePath } from "next/cache";

import type { AdminState } from "@/app/admin/actions";
import { requireStaff } from "@/lib/auth/session";
import { audit } from "@/lib/services/audit";
import { saveQuestion } from "@/lib/reviews/questions";

export async function saveReviewQuestionAction(_p: AdminState, f: FormData): Promise<AdminState> {
  try {
    const u = await requireStaff("review_moderator");
    const input = {
      key: String(f.get("key") ?? ""),
      label: String(f.get("label") ?? ""),
      help: String(f.get("help") ?? ""),
      specialtyKey: String(f.get("specialtyKey") ?? "").trim() || null,
      sort: Number(f.get("sort") ?? 0) || 0,
      active: f.get("active") === "on",
    };
    await saveQuestion(input);
    await audit({ actorUserId: u.id, actorRole: "staff", action: "review_question.saved", entityType: "review_question", entityId: input.key, after: input });
    revalidatePath("/admin/reviews/questions");
    return { ok: true, message: `Saved "${input.label}".` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
