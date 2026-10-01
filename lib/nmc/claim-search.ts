import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { coreTokens } from "@/lib/enrich/names";

/**
 * Claim-funnel search over the offline council register: a doctor types a name
 * (or a registration number) and finds their own entry, whether or not the site
 * has a profile for it yet. The register is public information; the search
 * returns exactly the fields the councils publish and nothing else.
 */

export type ClaimAction =
  | { kind: "claim-published"; slug: string }
  | { kind: "claim-draft" }
  | { kind: "claimed"; slug: string | null }
  | { kind: "unavailable" }
  | { kind: "create" }
  | { kind: "removed" };

export interface RegisterHit {
  id: number;
  name: string;
  council: string;
  number: string;
  qualification: string | null;
  qualificationYear: number | null;
  specialtyKey: string | null;
  category: string;
  action: ClaimAction;
}

export type ParsedQuery =
  | { kind: "name"; tokens: string[] }
  | { kind: "number"; number: string }
  | { kind: "invalid"; reason: string };

export const MIN_NAME_TOKENS = 2;

/** One box, two shapes: "Anil Kumar Rao" is a name; "KMC-58412" or "58412" is a registration number. */
export function parseQuery(raw: string): ParsedQuery {
  const q = raw.trim().replace(/\s+/g, " ");
  if (q.length < 3) return { kind: "invalid", reason: "Type your full name or your registration number." };
  const digitCount = (q.match(/\d/g) ?? []).length;
  if (digitCount >= 3 && digitCount >= q.replace(/[^A-Za-z0-9]/g, "").length / 2) {
    const number = q.toUpperCase().replace(/[^A-Z0-9]/g, "");
    return number.length >= 3 ? { kind: "number", number } : { kind: "invalid", reason: "That registration number is too short." };
  }
  const tokens = coreTokens(q.replace(/^dr\.?\s+/i, ""));
  if (tokens.length < MIN_NAME_TOKENS) return { kind: "invalid", reason: "Type at least two parts of your name, as the council records it, or use your registration number." };
  return { kind: "name", tokens: tokens.slice(0, 5) };
}

const CATEGORY_ORDER = sql`case ${s.nmcRegister.category}
  when 'superspecialist' then 0 when 'specialist' then 1 when 'diploma-specialist' then 2 when 'pg-unspecified' then 3 when 'mbbs-only' then 4 else 5 end`;

export const RESULT_LIMIT = 10;

export async function searchRegister(q: ParsedQuery, stateSlug?: string | null): Promise<RegisterHit[]> {
  if (q.kind === "invalid") return [];
  const db = getDb();
  const base = [
    sql`${s.nmcRegister.category} not in ('name-unusable','no-number')`,
    // Cross-council duplicates of one person are kept in the table but marked; show the kept entry only.
    sql`(${s.nmcRegister.matchKind} is null or ${s.nmcRegister.matchKind} not like 'duplicate:%')`,
  ];
  const where =
    q.kind === "name"
      ? and(
          sql`${s.nmcRegister.nameTokens} @> ${sql.raw(`'{${q.tokens.map((t) => `"${t.replace(/[^a-z]/g, "")}"`).join(",")}}'::text[]`)}`,
          stateSlug ? eq(s.nmcRegister.stateSlug, stateSlug) : undefined,
          ...base,
        )
      : and(eq(s.nmcRegister.numberNormalized, q.number), ...base);

  const rows = await db
    .select({
      id: s.nmcRegister.sourceRecordId,
      name: s.nmcRegister.name,
      nameClean: s.nmcRegister.nameClean,
      council: s.nmcRegister.council,
      number: s.nmcRegister.number,
      qualification: s.nmcRegister.qualification,
      qualificationYear: s.nmcRegister.qualificationYear,
      specialtyKey: s.nmcRegister.specialtyKey,
      category: s.nmcRegister.category,
      removed: s.nmcRegister.removed,
      doctorId: s.nmcRegister.doctorId,
    })
    .from(s.nmcRegister)
    .where(where)
    // Fewest extra name parts first: "Sanjay Jain" before "Shubham Sanjay Sangeeta Jain".
    .orderBy(sql`cardinality(${s.nmcRegister.nameTokens}) asc`, CATEGORY_ORDER, sql`${s.nmcRegister.eraYear} desc nulls last`)
    .limit(RESULT_LIMIT);

  const ids = rows.map((r) => r.doctorId).filter((x): x is string => Boolean(x));
  const docs = ids.length
    ? await db.select({ id: s.doctors.id, slug: s.doctors.slug, status: s.doctors.status, claimed: s.doctors.claimed, mergedIntoId: s.doctors.mergedIntoId }).from(s.doctors).where(inArray(s.doctors.id, ids))
    : [];
  const byId = new Map(docs.map((d) => [d.id, d]));

  return rows.map((r) => ({
    id: r.id,
    name: r.nameClean ?? r.name,
    council: r.council,
    number: r.number,
    qualification: r.qualification,
    qualificationYear: r.qualificationYear,
    specialtyKey: r.specialtyKey,
    category: r.category,
    action: actionFor(r.removed, r.doctorId ? byId.get(r.doctorId) ?? null : null),
  }));
}

export function actionFor(
  removed: boolean,
  doc: { slug: string; status: string; claimed: boolean; mergedIntoId: string | null } | null,
): ClaimAction {
  // A struck-off entry is never offered for claiming, whatever profile exists.
  if (removed) return { kind: "removed" };
  if (!doc) return { kind: "create" };
  if (doc.claimed) return { kind: "claimed", slug: doc.status === "published" ? doc.slug : null };
  if (doc.status === "published") return { kind: "claim-published", slug: doc.slug };
  if (doc.status === "draft") return { kind: "claim-draft" };
  // suspended, retired or merged: nothing for the doctor to claim from here.
  return { kind: "unavailable" };
}
