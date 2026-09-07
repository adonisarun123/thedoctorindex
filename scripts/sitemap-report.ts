import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * `npm run seo:sitemap` — what the live sitemap would contain right now,
 * counted the same way the routes build it. Run it after an import or a gate
 * change to see how many URLs are actually being submitted, instead of
 * reading it back out of Search Console days later.
 */
async function main() {
  // The guides module is .tsx; under tsx's classic JSX transform its elements
  // need a React global at module scope.
  (globalThis as unknown as { React?: unknown }).React = (await import("react")).default;
  const { directoryEntries, doctorEntries, editorialEntries, indexEntries } = await import("../lib/seo/sitemap");
  const [index, doctors, directory, editorial] = await Promise.all([indexEntries(), doctorEntries(), directoryEntries(), Promise.resolve(editorialEntries())]);
  const kind = (loc: string) => {
    const path = new URL(loc).pathname;
    const parts = path.split("/").filter(Boolean);
    if (path === "/") return "home";
    if (parts[0] === "specialties") return parts.length === 1 ? "specialties root" : "national speciality";
    if (parts[0] !== "doctors") return path;
    return ["doctors root", "state", "city", "city x speciality", "locality x speciality"][parts.length - 1] ?? "other";
  };
  const byKind: Record<string, number> = {};
  for (const e of directory) byKind[kind(e.loc)] = (byKind[kind(e.loc)] ?? 0) + 1;

  console.log(`sitemap index files : ${index.length}`);
  console.log(`doctor profiles     : ${doctors.length}`);
  console.log(`editorial           : ${editorial.length}`);
  console.log(`directory           : ${directory.length}`);
  for (const [k, n] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(18)}: ${n}`);
  console.log(`TOTAL URLs          : ${doctors.length + editorial.length + directory.length}`);
  console.log("\nsample directory URLs:");
  for (const e of directory.slice(0, 5)) console.log(`  ${e.loc}`);
  for (const e of directory.slice(-5)) console.log(`  ${e.loc}`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
