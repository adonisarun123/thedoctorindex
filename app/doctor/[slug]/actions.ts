"use server";

import { headers } from "next/headers";

import { getSessionUser } from "@/lib/auth/session";
import { getDoctorBySlug } from "@/lib/data";
import { createEnquiry, reportProfile, submitCorrection } from "@/lib/services/cases";
import { track } from "@/lib/services/events";
import { reportReview, submitReview } from "@/lib/services/reviews";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

async function ip(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0] ?? null;
}

async function doctorOr404(slug: string) {
  const d = await getDoctorBySlug(slug);
  if (!d?.dbId) throw new Error("This action needs the database. Set DATABASE_URL.");
  return d;
}

export async function submitReviewAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in to write a review." };
    const doctor = await doctorOr404(String(form.get("slug")));
    const file = form.get("evidence");
    let evidence: { filename: string; mime: string; bytes: Buffer } | null = null;
    if (file instanceof File && file.size > 0) {
      evidence = { filename: file.name, mime: file.type, bytes: Buffer.from(await file.arrayBuffer()) };
    }
    const res = await submitReview(
      user.id,
      doctor.dbId!,
      {
        forWhom: form.get("who") === "family" ? "family" : "self",
        visitMonth: String(form.get("month") ?? ""),
        mode: form.get("mode") === "Online" ? "Online" : "In person",
        communication: Number(form.get("communication")),
        explanation: Number(form.get("explanation")),
        waitTime: Number(form.get("wait")),
        facility: Number(form.get("facility")),
        text: String(form.get("text") ?? ""),
        attestation: form.get("attest") === "on",
      },
      evidence,
      { ip: await ip() },
    );
    await track("review_submitted", { doctorId: doctor.dbId });
    return {
      ok: true,
      message:
        res.risk.flags.length > 0
          ? `Submitted for moderation. Automated checks flagged ${res.risk.flags.length} item(s) for a person to look at; that is normal and does not mean rejection.`
          : "Submitted for moderation. A person reads every review before it appears, usually within 48 hours.",
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function reportAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    const doctor = await doctorOr404(String(form.get("slug")));
    const reason = String(form.get("reason") ?? "");
    if (!reason) return { error: "Choose what is wrong." };
    const detail = String(form.get("detail") ?? "").trim() || null;
    const contact = String(form.get("contact") ?? "").trim() || null;
    if (form.get("about") === "review" && form.get("reviewId")) {
      await reportReview(String(form.get("reviewId")), user?.id ?? null, reason, detail, contact);
      await track("review_reported", { doctorId: doctor.dbId });
    } else {
      await reportProfile(doctor.dbId!, user?.id ?? null, reason, detail, contact, await ip());
    }
    return { ok: true, message: "Report received. Identity and safety reports get an initial assessment within 4 hours; everything else within 48 hours." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function correctionAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    const doctor = await doctorOr404(String(form.get("slug")));
    await submitCorrection(
      doctor.dbId!,
      user?.id ?? null,
      {
        field: String(form.get("field") ?? ""),
        currentValue: String(form.get("current") ?? "").trim() || null,
        proposedValue: String(form.get("proposed") ?? "").trim(),
        sourceNote: String(form.get("source") ?? "").trim() || null,
        isDoctorOrStaff: form.get("isdoc") === "yes",
        contact: String(form.get("contact") ?? "").trim() || null,
      },
      await ip(),
    );
    await track("correction_submitted", { doctorId: doctor.dbId });
    return { ok: true, message: "Correction submitted. A verification officer checks it against the practice or the register and updates the page within 3 business days." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function enquiryAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await getSessionUser();
    if (!user) return { error: "Sign in so the practice can reach you." };
    const doctor = await doctorOr404(String(form.get("slug")));
    const practiceId = String(form.get("practice") ?? "") || null;
    await createEnquiry(doctor.dbId!, user.id, {
      practiceId,
      contact: user.phone ?? user.email ?? "",
      preferredDay: String(form.get("day") ?? "") || null,
      forWhom: form.get("for") === "other" ? "other" : "self",
      note: String(form.get("note") ?? "").trim() || null,
      consentToShare: form.get("consent") === "on",
    });
    await track("enquiry_submitted", { doctorId: doctor.dbId, practiceId });
    return { ok: true, message: "Enquiry sent to the practice. They contact you to confirm a time. If you do not hear back in two working days, the profile's call button reaches them directly." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
