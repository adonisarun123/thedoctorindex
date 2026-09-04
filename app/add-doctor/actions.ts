"use server";

import { findByRegistration } from "@/lib/data";
import type { DoctorView } from "@/lib/types";

/**
 * Duplicate check, run on the server so the directory never ships to the
 * browser. Identity is council + registration number, never the name.
 */
export async function lookupRegistration(registrationNumber: string): Promise<DoctorView | null> {
  return findByRegistration(registrationNumber);
}
