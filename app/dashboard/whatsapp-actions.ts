"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDashboardContext } from "@/lib/dashboard";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/services/audit";
import { normaliseWhatsappNumber, sendEnquiryWhatsapp, whatsappConfigured } from "@/lib/whatsapp";
import { displayName } from "@/lib/display-name";
import { absoluteUrl } from "@/lib/site";

export interface WaState {
  ok?: boolean;
  error?: string;
  message?: string;
}

/** Turn WhatsApp enquiry alerts on (number + consent) or off. */
export async function whatsappAlertsAction(_prev: WaState, form: FormData): Promise<WaState> {
  try {
    const ctx = await getDashboardContext();
    if (ctx.asManager) return { error: "Only the doctor can set up WhatsApp alerts for their own number." };
    const db = getDb();
    if (form.get("off")) {
      await db.update(s.users).set({ whatsappOptInAt: null }).where(eq(s.users.id, ctx.user.id));
      await audit({ actorUserId: ctx.user.id, action: "user.whatsapp_opt_out", entityType: "user", entityId: ctx.user.id });
      revalidatePath("/dashboard/enquiries");
      return { ok: true, message: "WhatsApp alerts turned off. Email alerts continue." };
    }
    const number = normaliseWhatsappNumber(String(form.get("number") ?? ""));
    if (!number) return { error: "Enter a 10-digit Indian mobile number, or an international number starting with +." };
    if (!form.get("consent")) return { error: "Tick the box to agree to receive WhatsApp alerts." };
    await db.update(s.users).set({ whatsappNumber: number, whatsappOptInAt: new Date() }).where(eq(s.users.id, ctx.user.id));
    await audit({ actorUserId: ctx.user.id, action: "user.whatsapp_opt_in", entityType: "user", entityId: ctx.user.id, after: { number: `${number.slice(0, 5)}…${number.slice(-2)}` } });
    revalidatePath("/dashboard/enquiries");
    if (form.get("test") && whatsappConfigured()) {
      const r = await sendEnquiryWhatsapp(number, displayName(ctx.doctor), "this is a test", absoluteUrl("/dashboard/enquiries"));
      return r.delivered ? { ok: true, message: "Saved. A test message is on its way." } : { error: `Saved, but the test message failed (${r.error ?? "unknown"}).` };
    }
    return { ok: true, message: whatsappConfigured() ? "Saved. New enquiries will reach you on WhatsApp as well as email." : "Saved. WhatsApp alerts start as soon as The Doctor Index switches them on; until then you get email." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
