import { requireStaff } from "@/lib/auth/session";
import { audit } from "@/lib/services/audit";
import { listPatients, patientsCsv } from "@/lib/services/patients";

export const dynamic = "force-dynamic";

/** The patients table as CSV. Audited: it is a bulk read of contact details. */
export async function GET(req: Request) {
  const user = await requireStaff();
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.slice(0, 80) ?? "";
  const onlyRaw = url.searchParams.get("only");
  const only = onlyRaw === "active" || onlyRaw === "incomplete" ? onlyRaw : undefined;
  const rows = await listPatients({ q, only, limit: 5000 });
  await audit({ actorUserId: user.id, actorRole: user.role, action: "patients.exported", entityType: "user", entityId: user.id, after: { rows: rows.length, q: q || undefined, only } });
  const day = new Date().toISOString().slice(0, 10);
  return new Response(patientsCsv(rows), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="tdi-patients-${day}.csv"`, "cache-control": "no-store" },
  });
}
