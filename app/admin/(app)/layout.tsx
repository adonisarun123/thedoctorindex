import { redirect } from "next/navigation";

import { AdminNav } from "@/components/AdminNav";
import { RouteMeta } from "@/components/RouteMeta";
import { queueCounts } from "@/lib/admin";
import { requireStaff } from "@/lib/auth/session";
import { absoluteUrl } from "@/lib/site";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  if (!process.env.DATABASE_URL) redirect("/admin/sign-in");
  const user = await requireStaff();
  const counts = await queueCounts();
  return (
    <>
      <RouteMeta data={{ route: "Admin console (authenticated)", title: "Admin | The Doctor Index", canonical: absoluteUrl("/admin"), index: false, structuredData: "None" }} />
      <div className="wrap">
        <div className="dash admin">
          <AdminNav email={user.email ?? user.phone ?? user.id} roles={user.staffRoles} counts={counts} />
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
