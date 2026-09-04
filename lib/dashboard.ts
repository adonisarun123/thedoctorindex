import "server-only";

import { redirect } from "next/navigation";

import { requireDoctor, type SessionUser } from "@/lib/auth/session";
import { dbSource } from "@/lib/data/db-source";
import type { DoctorView } from "@/lib/types";

/**
 * Everything a dashboard page needs, resolved once per request from the
 * session: the signed-in user, the doctor record they may manage, and whether
 * they are the doctor or an authorised clinic manager with a practice scope.
 */
export interface DashboardContext {
  user: SessionUser;
  doctor: DoctorView;
  doctorId: string;
  asManager: boolean;
  scope: string[];
}

export async function getDashboardContext(): Promise<DashboardContext> {
  if (!process.env.DATABASE_URL) redirect("/dashboard/no-profile?reason=nodb");
  const { user, doctorId, asManager, scope } = await requireDoctor();
  const doctor = await dbSource.getDoctorByDbId(doctorId);
  if (!doctor) redirect("/dashboard/no-profile");
  return { user, doctor, doctorId, asManager, scope };
}
