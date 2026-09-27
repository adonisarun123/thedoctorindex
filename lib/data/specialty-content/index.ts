import type { SpecialtyKey } from "@/lib/types";

import { cardiology } from "./cardiology";
import type { SpecialtyContent } from "./types";

export type { SpecialtyContent } from "./types";

const CONTENT: Partial<Record<SpecialtyKey, SpecialtyContent>> = { cardiology };

export function specialtyContent(key: SpecialtyKey): SpecialtyContent | null {
  return CONTENT[key] ?? null;
}

export const SPECIALTY_CONTENT_KEYS = Object.keys(CONTENT) as SpecialtyKey[];
