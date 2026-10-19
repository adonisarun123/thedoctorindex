/**
 * Readable "has a session" flag, set and cleared by middleware.ts in step with
 * the httpOnly session cookie. It carries no secret and grants nothing: it
 * only lets client components skip the /api/me round trip for visitors who
 * have no session at all. /api/me remains the authority for everyone else.
 */
export const SESSION_HINT_COOKIE = "tdi_signed_in";
