import { NEWS_CATEGORIES, isCategory } from "@/lib/news/format";

/**
 * Instagram caption for a story's carousel. Plain, factual, no superlatives
 * — the same rules as the page. Doctors' Instagram handles are not on file,
 * so the caption leaves a marker for the person posting to tag them (and add
 * them as a collaborator) by hand.
 */
export function instagramCaption(st: { headline: string; highlights: string[]; subjectName: string; place: string; category: string; slug: string }, specialtyName?: string | null): string {
  const tag = (s: string) => `#${s.replace(/[^A-Za-z0-9]/g, "")}`;
  const city = st.place.split(",")[0]?.trim();
  const tags = ["#TheDoctorIndex", "#TDiNewsdesk", "#IndianDoctors", specialtyName ? tag(specialtyName) : "", city ? tag(city) : "", isCategory(st.category) ? tag(NEWS_CATEGORIES[st.category].label) : ""].filter(Boolean);
  return [
    st.headline,
    "",
    ...st.highlights.map((h) => `▪️ ${h}`),
    "",
    `Read the full story and see ${st.subjectName}'s verified profile on The Doctor Index — link in bio.`,
    "",
    "[Tag the doctor here and invite them as a collaborator]",
    "",
    Array.from(new Set(tags)).join(" "),
  ].join("\n");
}
