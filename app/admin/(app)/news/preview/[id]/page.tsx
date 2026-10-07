import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/ArticleBody";
import { NewsDoctorCard } from "@/components/NewsDoctorCard";
import { parseArticleBody } from "@/lib/articles/format";
import { requireStaff } from "@/lib/auth/session";
import { NEWS_CATEGORIES, NEWS_DESK, isCategory, istDateTime, readingMinutes } from "@/lib/news/format";
import { getStoryForPreview, storyNumbers, storySources } from "@/lib/services/news";

export const metadata = { title: "Story preview", robots: { index: false, follow: false } };

/** Staff preview of a story in any state, laid out as the public page will be. */
export default async function StoryPreview({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff("content_editor");
  const row = await getStoryForPreview((await params).id);
  if (!row) notFound();
  const st = row.story;
  const sources = storySources(st);
  const numbers = storyNumbers(st);
  return (
    <div className="post">
      <p className="notice" style={{ marginBottom: "16px" }}>
        <b>Preview — status: {st.status}.</b> <Link href={`/admin/news#${st.id}`}>Back to the queue</Link>
      </p>
      <header className="storyhead">
        <span className="newstag">{isCategory(st.category) ? NEWS_CATEGORIES[st.category].label : "News"}{st.place ? <><span className="sep">·</span><span>{st.place}</span></> : null}</span>
        <h1>{st.headline}</h1>
        <p className="standfirst">{st.dek}</p>
        <div className="byline">
          <span>By <b>{NEWS_DESK}</b></span>
          <span>{istDateTime(st.publishedAt ?? new Date())}</span>
          <span>{readingMinutes(st.body)} min read</span>
          <span>{sources.length} source{sources.length === 1 ? "" : "s"}</span>
        </div>
      </header>
      <div className="postgrid">
        <div className="postbody doc">
          <section className="highlights"><h2>Key highlights</h2><ol>{st.highlights.map((h) => <li key={h}>{h}</li>)}</ol></section>
          {numbers.length ? <section className="numbers">{numbers.map((n) => <div key={n.label}><div className="nv">{n.value}</div><div className="nl">{n.label}</div></div>)}</section> : null}
          <ArticleBody blocks={parseArticleBody(st.body)} />
          <section className="whymatters"><h2>Why it matters for patients</h2><p>{st.whyItMatters}</p></section>
          <section className="sources"><h2>Sources</h2><ol>{sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener nofollow">{s.title}</a> <span className="pub">— {s.publisher}</span></li>)}</ol></section>
        </div>
        <aside className="rail">
          {row.doctors.map((d) => <NewsDoctorCard key={d.id} d={d} subjectRole={d.primary ? st.subjectRole : undefined} />)}
          {!row.doctors.length ? <div className="railcard"><div className="eyebrow">In this story</div><p><b>{st.subjectName}</b>{st.subjectRole ? <><br />{st.subjectRole}</> : null}</p><p>No TDi profile linked.</p></div> : null}
        </aside>
      </div>
    </div>
  );
}
