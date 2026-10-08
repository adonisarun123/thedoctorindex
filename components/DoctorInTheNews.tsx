import Link from "next/link";

import { NEWS_CATEGORIES, isCategory, istDate } from "@/lib/news/format";
import { storiesForDoctor } from "@/lib/services/news";
import { paths } from "@/lib/site";

/** "In the news" on a profile: TDi Newsdesk stories linked to this doctor. Renders nothing when there are none. */
export async function DoctorInTheNews({ doctorDbId }: { doctorDbId?: string }) {
  if (!doctorDbId || !process.env.DATABASE_URL) return null;
  const rows = await storiesForDoctor(doctorDbId, 5);
  if (!rows.length) return null;
  return (
    <section className="block">
      <h2>In the news</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rows.map((r) => (
          <li key={r.slug} style={{ padding: "10px 0", borderBottom: "1px solid var(--hair)" }}>
            <span className="newstag">{isCategory(r.category) ? NEWS_CATEGORIES[r.category].label : "News"}</span>
            <div><Link href={paths.newsStory(r.slug)} style={{ fontWeight: 600 }}>{r.headline}</Link></div>
            <div style={{ fontSize: "14.5px", color: "var(--muted)", marginTop: "2px" }}>{r.publishedAt ? istDate(r.publishedAt) : ""} · TDi Newsdesk</div>
          </li>
        ))}
      </ul>
      <p className="blocknote">Reported by the TDi Newsdesk from published sources. A news story is not an endorsement.</p>
    </section>
  );
}
