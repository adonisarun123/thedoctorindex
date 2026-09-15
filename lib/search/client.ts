import type { SuggestItem } from "@/components/SuggestInput";
import { specialtyByKey } from "@/lib/data/taxonomy";

/**
 * The two fetchers behind the search boxes. Module-level constants so the
 * combobox's effect sees a stable function and does not refetch on render.
 */
export async function loadWhat(q: string, signal: AbortSignal, loc = ""): Promise<SuggestItem[]> {
  const r = await fetch(`/api/suggest?q=${encodeURIComponent(q)}${loc.trim() ? `&in=${encodeURIComponent(loc.trim())}` : ""}`, { signal });
  if (!r.ok) return [];
  const j = (await r.json()) as {
    specialties: Array<{ key: string; name: string; plural: string; slug: string }>;
    doctors: Array<{ slug: string; name: string; specialty: string; city: string | null; href: string }>;
  };
  return [
    ...j.specialties.map((s) => ({ id: `s:${s.key}`, group: "Specialities", label: s.plural, detail: s.name, text: s.plural })),
    ...j.doctors.map((d) => ({
      id: `d:${d.slug}`,
      group: "Doctors",
      label: d.name,
      detail: [specialtyByKey(d.specialty)?.one, d.city].filter(Boolean).join(" · "),
      text: d.name,
      href: d.href,
    })),
  ];
}

export async function loadWhere(q: string, signal: AbortSignal): Promise<SuggestItem[]> {
  const r = await fetch(`/api/suggest?loc=${encodeURIComponent(q)}`, { signal });
  if (!r.ok) return [];
  const j = (await r.json()) as { places: Array<{ kind: string; name: string; detail: string; text: string }> };
  return j.places.map((p) => ({ id: `p:${p.text}`, group: "Places", label: p.name, detail: p.detail, text: p.text }));
}
