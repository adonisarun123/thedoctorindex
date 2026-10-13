"use server";

import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";

import { sha256 } from "@/lib/auth/hash";
import { getSessionUser } from "@/lib/auth/session";
import { getDoctorBySlug } from "@/lib/data";
import { createEnquiry, reportProfile, submitCorrection } from "@/lib/services/cases";
import { track } from "@/lib/services/events";
import { completeRegistration } from "@/lib/services/registration";
import { reportReview, submitReview } from "@/lib/services/reviews";
import { questionsForSpecialty } from "@/lib/reviews/questions";
import { parseRatings } from "@/lib/reviews/score";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

async function ip(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0] ?? null;
}

/**
 * A first-party device id for the review velocity check (reviews.device_hash):
 * set on the first review from a browser, kept for a year, httpOnly, never
 * read for anything else. A strictly-necessary fraud-prevention cookie — it
 * carries no identity and is not used for analytics or advertising. Only its
 * hash is stored. A clinic desk seeding reviews from one browser across
 * several accounts shares it; incognito windows do not, which is what the
 * IP hash is for.
 */
const DEVICE_COOKIE = "tdi_d";
async function deviceHash(): Promise<string | null> {
  try {
    const jar = await cookies();
    let id = jar.get(DEVICE_COOKIE)?.value ?? null;
    if (!id || !/^[a-f0-9]{32}$/.test(id)) {
      id = randomBytes(16).toString("hex");
      jar.set(DEVICE_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 365 * 86_400 });
    }
    return sha256(id, process.env.CONTACT_HASH_PEPPER ?? "tdi").slice(0, 32);
  } catch {
    return null;
  }
}

async function doctorOr404(slug: string) {
  const d = await getDoctorBySlug(slug);
  if (!d?.dbId) throw new Error("This action needs the database. Set DATABASE_URL.");
  return d;
}

export async function submitReviewAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  try {
    let user = await getSessionUser();
    if (!user) return { error: "Sign in to write a review." };
    // First review on a new account: name, contact and area are on this same
    // form, saved before the review — no separate setup step.
    if (!user.profileComplete) {
      const reg = await completeRegistration(user, form, { forceAccountType: user.accountType ?? "patient" });
      if ("error" in reg) return { error: reg.error };
      user = (await getSessionUser()) ?? user;
      if (!user.profileComplete) return { error: "Could not save your details. Try again." };
    }
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
        ratings: parseRatings(await questionsForSpecialty(doctor.specialty), (k) => {
          const v = form.get(`q:${k}`);
          return typeof v === "string" ? v : null;
        }),
        text: String(form.get("text") ?? ""),
        attestation: form.get("attest") === "on",
        anonymous: form.get("anonymous") === "on",
        bookingRef: String(form.get("booking") ?? "").trim() || null,
      },
      evidence,
      { ip: await ip(), deviceHash: await deviceHash() },
    );
    await track("review_submitted", { doctorId: doctor.dbId, query: res.verifiedByBooking ? "verified:booking" : null });
    const verified = res.verifiedByBooking ? " It is tied to your TDi booking, so it carries the Verified visit badge." : "";
    return {
      ok: true,
      message:
        res.risk.flags.length > 0
          ? `Submitted for moderation.${verified} Automated checks flagged ${res.risk.flags.length} item(s) for a person to look at; that is normal and does not mean rejection.`
          : `Submitted for moderation.${verified} A person reads every review before it appears, usually within 48 hours.`,
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
    if (!user.profileComplete) return { error: "Complete your account details first so the practice can reach you." };
    const doctor = await doctorOr404(String(form.get("slug")));
    const practiceId = String(form.get("practice") ?? "") || null;
    await createEnquiry(doctor.dbId!, user.id, {
      practiceId,
      contact: `${user.displayName ?? ""} · ${user.phone ?? user.email ?? ""}`.replace(/^ · /, ""),
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
