import { getDoctorBySlug } from "@/lib/data";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og";
import { SITE } from "@/lib/site";
import { registrationState } from "@/lib/verification";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

/**
 * Doctor profile card. Shows only what the public page shows: name,
 * speciality, city, verification facts. No phone, no photo (photos are
 * consent-gated and served separately), no rating stars.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDoctorBySlug(slug);
  if (!d) return ogCard({ title: SITE.tagline, kicker: "Verified directory", eyebrow: "India" });
  const sp = SPECIALTIES[d.specialty];
  const initials = d.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const verifiedDegrees = d.qualifications.filter((q) => q.state === "verified").map((q) => q.degree);
  const chips = [
    d.registration.checkedOn && d.registration.checkedOn !== "—" ? `Reg. ${d.registration.council} · checked ${d.registration.checkedOn}` : "Registration not yet checked",
    verifiedDegrees.length ? verifiedDegrees.slice(0, 2).join(", ") : "Qualification submitted",
    `${d.yearsOfExperience}+ years`,
    d.practices[0] ? d.practices[0].facility : "India",
  ];
  return ogCard({
    eyebrow: `${sp.one} · ${d.practices[0]?.city || "India"}`,
    title: `Dr ${d.name}`,
    subtitle: d.subspecialties.length ? d.subspecialties.slice(0, 3).join(" · ") : sp.name,
    chips,
    initials,
    kicker: registrationState(d) === "verified" ? (d.claimed ? "Register-verified · claimed profile" : "Register-verified profile") : d.claimed ? "Claimed profile · registration check pending" : "Profile · registration check pending",
  });
}
