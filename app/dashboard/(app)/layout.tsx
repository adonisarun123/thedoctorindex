import { DashboardNav } from "@/components/DashboardNav";
import { RouteMeta } from "@/components/RouteMeta";
import { getDashboardContext } from "@/lib/dashboard";
import { listEnquiries } from "@/lib/services/cases";
import { listChangesForDoctor } from "@/lib/services/workflow";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Dashboard shell. The signed-in user's doctor record is resolved once here;
 * every page beneath calls getDashboardContext() again (cheap, same request
 * cache) so no page can render another doctor's data.
 */
export default async function DashboardShell({ children }: { children: React.ReactNode }) {
  const ctx = await getDashboardContext();
  const unreplied = ctx.doctor.reviews.filter((r) => !r.reply).length;
  const pendingChanges = (await listChangesForDoctor(ctx.doctorId)).filter((c) => c.status === "pending").length;
  const newEnquiries = (await listEnquiries({ doctorId: ctx.doctorId, status: "new" })).length;

  return (
    <>
      <RouteMeta
        data={{
          route: "Doctor dashboard (authenticated)",
          title: "Doctor dashboard | The Doctor Index",
          canonical: absoluteUrl("/dashboard"),
          index: false,
          structuredData: "None",
          notes: [{ label: "Why noindex, nofollow", text: "Authenticated. Excluded by page robots and by robots.txt." }],
        }}
      />
      <div className="wrap">
        {ctx.asManager ? (
          <div className="notice" style={{ marginTop: "16px" }}>
            <b>You are signed in as a clinic manager for Dr {ctx.doctor.name}.</b> You can update hours, fees and contact details for the practices you were given; identity, credentials and reviews are the doctor&rsquo;s alone.
          </div>
        ) : null}
        <div className="dash">
          <DashboardNav name={ctx.doctor.name} id={ctx.doctor.id} registration={ctx.doctor.registration.number} counts={{ reviews: unreplied, changes: pendingChanges, enquiries: newEnquiries }} />
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
