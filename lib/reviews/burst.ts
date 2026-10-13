/**
 * Velocity hold. Three or more reviews for the same doctor from the same
 * device or network address inside a day is how a clinic desk, or someone
 * paid, seeds reviews — one happy family on one Wi-Fi is the honest version
 * and is rare. The review is still submitted; it is flagged "hold" at the
 * top of the queue and a moderator decides.
 */
export function sameSourceBurst(countFromSameSourceInDay: number, threshold = Number(process.env.REVIEW_SAME_SOURCE_BURST ?? 3)): boolean {
  return countFromSameSourceInDay >= threshold;
}
