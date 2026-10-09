"use server";

import { getSessionUser } from "@/lib/auth/session";
import { revalidateDoctors } from "@/lib/data/revalidate";
import { rateLimit } from "@/lib/security/rate-limit";
import { track } from "@/lib/services/events";
import { goLiveFromRegister, type GoLiveOutcome } from "@/lib/services/instant-onboard";
import { recordReferral, settleReferralsForDoctor } from "@/lib/services/tribe";

export interface GoLiveState {
  outcome?: GoLiveOutcome;
  error?: string;
}

/** "This is me — go live": one register entry, one tick box, one click. */
export async function goLiveAction(_prev: GoLiveState, form: FormData): Promise<GoLiveState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in first." };
    if (!user.profileComplete) return { error: "Complete your account details first." };
    if (form.get("confirm") !== "on") return { error: "Tick the box to confirm this registration is yours." };
    const entry = Number(form.get("entry"));
    if (!Number.isSafeInteger(entry) || entry <= 0) return { error: "Pick your entry again." };
    const rl = await rateLimit(`golive:${user.id}`, 5, 86400);
    if (!rl.ok) return { error: "Too many attempts today. Contact us and we will help." };

    const outcome = await goLiveFromRegister(user.id, entry);
    if (outcome.kind === "live") {
      // Grow Your Tribe: credit the colleague whose invite brought this doctor here.
      await recordReferral({ refereeUserId: user.id, doctorId: outcome.doctorId, kind: "claim" });
      await settleReferralsForDoctor(outcome.doctorId);
      await track("claim_approved", { doctorId: outcome.doctorId, query: outcome.created ? "instant:created" : "instant:claimed" });
      revalidateDoctors();
    } else if (outcome.kind === "review") {
      await track("claim_started", { query: `instant:review:${outcome.reason}` });
    }
    return { outcome };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
