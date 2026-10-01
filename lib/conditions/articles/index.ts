import type { ConditionArticle } from "@/lib/conditions/article";

import { article as acne } from "@/lib/conditions/articles/acne";
import { article as anemia } from "@/lib/conditions/articles/anemia";
import { article as anxiety } from "@/lib/conditions/articles/anxiety";
import { article as asthma } from "@/lib/conditions/articles/asthma";
import { article as coronaryArteryDisease } from "@/lib/conditions/articles/coronary-artery-disease";
import { article as dengue } from "@/lib/conditions/articles/dengue";
import { article as depression } from "@/lib/conditions/articles/depression";
import { article as diabetesType2 } from "@/lib/conditions/articles/diabetes-type-2";
import { article as gerd } from "@/lib/conditions/articles/gerd";
import { article as hemorrhoids } from "@/lib/conditions/articles/hemorrhoids";
import { article as herniatedDisk } from "@/lib/conditions/articles/herniated-disk";
import { article as highBloodPressure } from "@/lib/conditions/articles/high-blood-pressure";
import { article as hypothyroidism } from "@/lib/conditions/articles/hypothyroidism";
import { article as kidneyStones } from "@/lib/conditions/articles/kidney-stones";
import { article as migraine } from "@/lib/conditions/articles/migraine";
import { article as osteoarthritis } from "@/lib/conditions/articles/osteoarthritis";
import { article as polycysticOvarySyndrome } from "@/lib/conditions/articles/polycystic-ovary-syndrome";
import { article as psoriasis } from "@/lib/conditions/articles/psoriasis";
import { article as rheumatoidArthritis } from "@/lib/conditions/articles/rheumatoid-arthritis";
import { article as sinusitis } from "@/lib/conditions/articles/sinusitis";
import { article as steatoticLiverDisease } from "@/lib/conditions/articles/steatotic-liver-disease";
import { article as tuberculosis } from "@/lib/conditions/articles/tuberculosis";
import { article as urinaryTractInfections } from "@/lib/conditions/articles/urinary-tract-infections";
import { article as uterineFibroids } from "@/lib/conditions/articles/uterine-fibroids";
import { article as vitaminDDeficiency } from "@/lib/conditions/articles/vitamin-d-deficiency";

/**
 * Original condition articles, one module per slug. Phase B of the condition
 * library adds these in batches; the registry is the only place a condition
 * can become eligible for indexing (see lib/conditions/gate.ts).
 *
 * Batch 1 (01 Oct 2026): 25 common conditions, written for India, awaiting
 * clinical review. None is indexable until a named reviewer signs it off.
 */
export const ARTICLES: ConditionArticle[] = [
  acne, anemia, anxiety, asthma, coronaryArteryDisease, dengue, depression, diabetesType2, gerd, hemorrhoids, herniatedDisk, highBloodPressure, hypothyroidism, kidneyStones, migraine, osteoarthritis, polycysticOvarySyndrome, psoriasis, rheumatoidArthritis, sinusitis, steatoticLiverDisease, tuberculosis, urinaryTractInfections, uterineFibroids, vitaminDDeficiency,
];

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

export function articleBySlug(slug: string): ConditionArticle | null {
  return BY_SLUG.get(slug) ?? null;
}
