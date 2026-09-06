import "server-only";

/**
 * Build-time database readiness.
 *
 * `next build` prerenders the home page, the hubs, the sitemaps and the
 * social cards, and each of those reads the database. A deploy must not fail
 * because the database is empty, unreachable from the build machine, or not
 * yet migrated — the first deploy of a new environment is exactly that case.
 *
 * So, during the build phase only, the data layer asks once whether the
 * database can answer and has been migrated. When it cannot, readers fall
 * back to an empty source: the build succeeds, pages are prerendered with no
 * records, and every such page carries `revalidate`, so it regenerates from
 * the live database within an hour of the first request. At runtime nothing
 * is swallowed; a database error surfaces as an error.
 */

export function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

let probe: Promise<boolean> | undefined;

function warn(reason: string): void {
  console.warn(`[thedoctorindex] Building without the database: ${reason}. Pages that read it are prerendered empty and regenerate from the database within an hour of the first request once it is ready.`);
}

/** True when the database answers and the core tables exist. Cached per process; build phase only. */
export function databaseReadyForBuild(): Promise<boolean> {
  if (!probe) {
    probe = (async () => {
      try {
        const [{ getDb }, { sql }] = await Promise.all([import("@/lib/db/client"), import("drizzle-orm")]);
        const rows = (await getDb().execute(sql`select (to_regclass('public.doctors') is not null and to_regclass('public.localities') is not null) as ok`)) as unknown as Array<{ ok: boolean }>;
        const ok = Boolean(rows[0]?.ok);
        if (!ok) warn("the schema has not been migrated (run `npm run db:migrate` against DIRECT_URL)");
        return ok;
      } catch (e) {
        warn(`it could not be reached (${e instanceof Error ? e.message : String(e)})`);
        return false;
      }
    })();
  }
  return probe;
}
