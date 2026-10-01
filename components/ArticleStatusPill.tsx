import type { ArticleRow } from "@/lib/services/articles";

/** One label for an article's state, shared by the dashboard and the admin queue. */
export function ArticleStatusPill({ a }: { a: Pick<ArticleRow, "status" | "revision" | "revisionSubmittedAt"> }) {
  const label =
    a.status === "published"
      ? a.revisionSubmittedAt
        ? "published · edit in review"
        : a.revision
          ? "published · edit not submitted"
          : "published"
      : a.status === "submitted"
        ? "in review"
        : a.status;
  const tone = a.status === "published" ? "ok" : a.status === "rejected" ? "warn" : a.status === "submitted" ? "wait" : "neut";
  return <span className={`pill ${tone}`}>{label}</span>;
}
