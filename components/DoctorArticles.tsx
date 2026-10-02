import Link from "next/link";

import { toDisplay } from "@/lib/db/dates";
import { listPublishedArticles } from "@/lib/services/articles";
import { paths } from "@/lib/site";

/** "Articles by Dr X" on the profile. Renders nothing when there are none. */
export async function DoctorArticles({ doctorDbId, name }: { doctorDbId?: string; name: string }) {
  if (!doctorDbId || !process.env.DATABASE_URL) return null;
  const rows = await listPublishedArticles({ doctorId: doctorDbId, limit: 12 });
  if (!rows.length) return null;
  return (
    <section className="block">
      <h2>Articles by {name}</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rows.map((r) => (
          <li key={r.slug} style={{ padding: "10px 0", borderBottom: "1px solid var(--hair)" }}>
            <Link href={paths.article(r.slug)} style={{ fontWeight: 600 }}>{r.title}</Link>
            <div style={{ fontSize: "14.5px", color: "var(--ink-2)", marginTop: "2px" }}>{r.description}</div>
            <div className="mono" style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{toDisplay(r.publishedAt)}</div>
          </li>
        ))}
      </ul>
      <p className="blocknote">Written and signed by the doctor with their registration number; reviewed by The Doctor Index for authorship and content rules before publication.</p>
    </section>
  );
}
