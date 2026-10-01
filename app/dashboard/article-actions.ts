"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDashboardContext } from "@/lib/dashboard";
import { deleteDraftArticle, saveArticle, withdrawArticle } from "@/lib/services/articles";
import { paths } from "@/lib/site";

export interface ArticleFormState {
  ok?: boolean;
  error?: string;
  message?: string;
  queued?: boolean;
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "");

async function author() {
  const ctx = await getDashboardContext();
  if (ctx.asManager) throw new Error("Clinic managers cannot write articles. Only the doctor can publish under their own name.");
  return ctx;
}

function refresh(doctorSlug: string, articleSlug?: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath(paths.articles());
  if (articleSlug) revalidatePath(paths.article(articleSlug));
  revalidatePath(paths.doctor(doctorSlug));
}

export async function saveArticleAction(_prev: ArticleFormState, form: FormData): Promise<ArticleFormState> {
  let createdId: string | null = null;
  try {
    const ctx = await author();
    const id = str(form, "id") || null;
    const submit = str(form, "intent") === "submit";
    const r = await saveArticle(
      { doctorId: ctx.doctorId, userId: ctx.user.id },
      id,
      { slug: str(form, "slug"), title: str(form, "title"), description: str(form, "description"), body: str(form, "body"), sourceUrl: str(form, "sourceUrl") || null },
      submit,
    );
    refresh(ctx.doctor.slug);
    if (!id) createdId = r.id;
    else
      return {
        ok: true,
        queued: submit,
        message: r.revision
          ? submit
            ? "Edit sent for review. The published version stays live until it is approved."
            : "Edit saved. Submit it for review when it is ready; the published version is unchanged."
          : submit
            ? "Submitted for review. You will see the decision here."
            : "Draft saved.",
      };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
  redirect(`/dashboard/articles/${createdId}?saved=1`);
}

export async function withdrawArticleAction(_prev: ArticleFormState, form: FormData): Promise<ArticleFormState> {
  try {
    const ctx = await author();
    const what = str(form, "what") === "revision" ? "revision" : "article";
    const row = await withdrawArticle({ doctorId: ctx.doctorId, userId: ctx.user.id }, str(form, "id"), what);
    refresh(ctx.doctor.slug, row.slug);
    return { ok: true, message: what === "revision" ? "Pending edit discarded." : row.status === "withdrawn" ? "Article taken down from the site." : "Moved back to draft." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteArticleAction(_prev: ArticleFormState, form: FormData): Promise<ArticleFormState> {
  try {
    const ctx = await author();
    await deleteDraftArticle({ doctorId: ctx.doctorId, userId: ctx.user.id }, str(form, "id"));
    refresh(ctx.doctor.slug);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
  redirect("/dashboard/articles");
}
