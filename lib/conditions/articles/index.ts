import type { ConditionArticle } from "@/lib/conditions/article";

import { article as acne } from "@/lib/conditions/articles/acne";
import { article as allergy } from "@/lib/conditions/articles/allergy";
import { article as anemia } from "@/lib/conditions/articles/anemia";
import { article as ankylosingSpondylitis } from "@/lib/conditions/articles/ankylosing-spondylitis";
import { article as anxiety } from "@/lib/conditions/articles/anxiety";
import { article as appendicitis } from "@/lib/conditions/articles/appendicitis";
import { article as asthma } from "@/lib/conditions/articles/asthma";
import { article as atrialFibrillation } from "@/lib/conditions/articles/atrial-fibrillation";
import { article as attentionDeficitHyperactivityDisorder } from "@/lib/conditions/articles/attention-deficit-hyperactivity-disorder";
import { article as autismSpectrumDisorder } from "@/lib/conditions/articles/autism-spectrum-disorder";
import { article as bipolarDisorder } from "@/lib/conditions/articles/bipolar-disorder";
import { article as breastCancer } from "@/lib/conditions/articles/breast-cancer";
import { article as carpalTunnelSyndrome } from "@/lib/conditions/articles/carpal-tunnel-syndrome";
import { article as cataract } from "@/lib/conditions/articles/cataract";
import { article as cervicalCancer } from "@/lib/conditions/articles/cervical-cancer";
import { article as chikungunya } from "@/lib/conditions/articles/chikungunya";
import { article as chronicKidneyDisease } from "@/lib/conditions/articles/chronic-kidney-disease";
import { article as cirrhosis } from "@/lib/conditions/articles/cirrhosis";
import { article as colorectalCancer } from "@/lib/conditions/articles/colorectal-cancer";
import { article as constipation } from "@/lib/conditions/articles/constipation";
import { article as copd } from "@/lib/conditions/articles/copd";
import { article as coronaryArteryDisease } from "@/lib/conditions/articles/coronary-artery-disease";
import { article as dementia } from "@/lib/conditions/articles/dementia";
import { article as dengue } from "@/lib/conditions/articles/dengue";
import { article as depression } from "@/lib/conditions/articles/depression";
import { article as diabetesType1 } from "@/lib/conditions/articles/diabetes-type-1";
import { article as diabetesType2 } from "@/lib/conditions/articles/diabetes-type-2";
import { article as diabeticEyeProblems } from "@/lib/conditions/articles/diabetic-eye-problems";
import { article as diabeticFoot } from "@/lib/conditions/articles/diabetic-foot";
import { article as earInfections } from "@/lib/conditions/articles/ear-infections";
import { article as eczema } from "@/lib/conditions/articles/eczema";
import { article as endometriosis } from "@/lib/conditions/articles/endometriosis";
import { article as enlargedProstateBph } from "@/lib/conditions/articles/enlarged-prostate-bph";
import { article as epilepsy } from "@/lib/conditions/articles/epilepsy";
import { article as erectileDysfunction } from "@/lib/conditions/articles/erectile-dysfunction";
import { article as femaleInfertility } from "@/lib/conditions/articles/female-infertility";
import { article as fractures } from "@/lib/conditions/articles/fractures";
import { article as gallstones } from "@/lib/conditions/articles/gallstones";
import { article as gerd } from "@/lib/conditions/articles/gerd";
import { article as glaucoma } from "@/lib/conditions/articles/glaucoma";
import { article as gout } from "@/lib/conditions/articles/gout";
import { article as gumDisease } from "@/lib/conditions/articles/gum-disease";
import { article as hairLoss } from "@/lib/conditions/articles/hair-loss";
import { article as hayFever } from "@/lib/conditions/articles/hay-fever";
import { article as heartAttack } from "@/lib/conditions/articles/heart-attack";
import { article as heartFailure } from "@/lib/conditions/articles/heart-failure";
import { article as hemorrhoids } from "@/lib/conditions/articles/hemorrhoids";
import { article as hepatitisB } from "@/lib/conditions/articles/hepatitis-b";
import { article as hepatitisC } from "@/lib/conditions/articles/hepatitis-c";
import { article as hernia } from "@/lib/conditions/articles/hernia";
import { article as herniatedDisk } from "@/lib/conditions/articles/herniated-disk";
import { article as highBloodPressure } from "@/lib/conditions/articles/high-blood-pressure";
import { article as hives } from "@/lib/conditions/articles/hives";
import { article as hyperthyroidism } from "@/lib/conditions/articles/hyperthyroidism";
import { article as hypothyroidism } from "@/lib/conditions/articles/hypothyroidism";
import { article as insomnia } from "@/lib/conditions/articles/insomnia";
import { article as irritableBowelSyndrome } from "@/lib/conditions/articles/irritable-bowel-syndrome";
import { article as kidneyStones } from "@/lib/conditions/articles/kidney-stones";
import { article as lungCancer } from "@/lib/conditions/articles/lung-cancer";
import { article as malaria } from "@/lib/conditions/articles/malaria";
import { article as maleInfertility } from "@/lib/conditions/articles/male-infertility";
import { article as metabolicSyndrome } from "@/lib/conditions/articles/metabolic-syndrome";
import { article as migraine } from "@/lib/conditions/articles/migraine";
import { article as obesity } from "@/lib/conditions/articles/obesity";
import { article as obsessiveCompulsiveDisorder } from "@/lib/conditions/articles/obsessive-compulsive-disorder";
import { article as oralCancer } from "@/lib/conditions/articles/oral-cancer";
import { article as osteoarthritis } from "@/lib/conditions/articles/osteoarthritis";
import { article as osteoporosis } from "@/lib/conditions/articles/osteoporosis";
import { article as ovarianCysts } from "@/lib/conditions/articles/ovarian-cysts";
import { article as parkinsonSDisease } from "@/lib/conditions/articles/parkinson-s-disease";
import { article as pepticUlcer } from "@/lib/conditions/articles/peptic-ulcer";
import { article as pinkEye } from "@/lib/conditions/articles/pink-eye";
import { article as pneumonia } from "@/lib/conditions/articles/pneumonia";
import { article as polycysticOvarySyndrome } from "@/lib/conditions/articles/polycystic-ovary-syndrome";
import { article as prediabetes } from "@/lib/conditions/articles/prediabetes";
import { article as prostateCancer } from "@/lib/conditions/articles/prostate-cancer";
import { article as psoriasis } from "@/lib/conditions/articles/psoriasis";
import { article as refractiveErrors } from "@/lib/conditions/articles/refractive-errors";
import { article as rheumatoidArthritis } from "@/lib/conditions/articles/rheumatoid-arthritis";
import { article as rotatorCuffInjuries } from "@/lib/conditions/articles/rotator-cuff-injuries";
import { article as scabies } from "@/lib/conditions/articles/scabies";
import { article as schizophrenia } from "@/lib/conditions/articles/schizophrenia";
import { article as sciatica } from "@/lib/conditions/articles/sciatica";
import { article as scoliosis } from "@/lib/conditions/articles/scoliosis";
import { article as sinusitis } from "@/lib/conditions/articles/sinusitis";
import { article as sleepApnea } from "@/lib/conditions/articles/sleep-apnea";
import { article as spinalStenosis } from "@/lib/conditions/articles/spinal-stenosis";
import { article as steatoticLiverDisease } from "@/lib/conditions/articles/steatotic-liver-disease";
import { article as stroke } from "@/lib/conditions/articles/stroke";
import { article as thalassemia } from "@/lib/conditions/articles/thalassemia";
import { article as tineaInfections } from "@/lib/conditions/articles/tinea-infections";
import { article as tinnitus } from "@/lib/conditions/articles/tinnitus";
import { article as tonsillitis } from "@/lib/conditions/articles/tonsillitis";
import { article as toothDecay } from "@/lib/conditions/articles/tooth-decay";
import { article as tuberculosis } from "@/lib/conditions/articles/tuberculosis";
import { article as urinaryTractInfections } from "@/lib/conditions/articles/urinary-tract-infections";
import { article as uterineFibroids } from "@/lib/conditions/articles/uterine-fibroids";
import { article as varicoseVeins } from "@/lib/conditions/articles/varicose-veins";
import { article as vitaminDDeficiency } from "@/lib/conditions/articles/vitamin-d-deficiency";
import { article as vitiligo } from "@/lib/conditions/articles/vitiligo";

/**
 * Original condition articles, one module per slug. The registry is the only
 * place a condition can become eligible for indexing (see lib/conditions/gate.ts).
 *
 * 100 common conditions written for India (batch 1 on 01 Oct 2026, batches 2–4
 * on 02–03 Oct 2026). All await clinical review; none is indexable until a
 * named reviewer signs it off.
 */
export const ARTICLES: ConditionArticle[] = [
  acne,
  allergy,
  anemia,
  ankylosingSpondylitis,
  anxiety,
  appendicitis,
  asthma,
  atrialFibrillation,
  attentionDeficitHyperactivityDisorder,
  autismSpectrumDisorder,
  bipolarDisorder,
  breastCancer,
  carpalTunnelSyndrome,
  cataract,
  cervicalCancer,
  chikungunya,
  chronicKidneyDisease,
  cirrhosis,
  colorectalCancer,
  constipation,
  copd,
  coronaryArteryDisease,
  dementia,
  dengue,
  depression,
  diabetesType1,
  diabetesType2,
  diabeticEyeProblems,
  diabeticFoot,
  earInfections,
  eczema,
  endometriosis,
  enlargedProstateBph,
  epilepsy,
  erectileDysfunction,
  femaleInfertility,
  fractures,
  gallstones,
  gerd,
  glaucoma,
  gout,
  gumDisease,
  hairLoss,
  hayFever,
  heartAttack,
  heartFailure,
  hemorrhoids,
  hepatitisB,
  hepatitisC,
  hernia,
  herniatedDisk,
  highBloodPressure,
  hives,
  hyperthyroidism,
  hypothyroidism,
  insomnia,
  irritableBowelSyndrome,
  kidneyStones,
  lungCancer,
  malaria,
  maleInfertility,
  metabolicSyndrome,
  migraine,
  obesity,
  obsessiveCompulsiveDisorder,
  oralCancer,
  osteoarthritis,
  osteoporosis,
  ovarianCysts,
  parkinsonSDisease,
  pepticUlcer,
  pinkEye,
  pneumonia,
  polycysticOvarySyndrome,
  prediabetes,
  prostateCancer,
  psoriasis,
  refractiveErrors,
  rheumatoidArthritis,
  rotatorCuffInjuries,
  scabies,
  schizophrenia,
  sciatica,
  scoliosis,
  sinusitis,
  sleepApnea,
  spinalStenosis,
  steatoticLiverDisease,
  stroke,
  thalassemia,
  tineaInfections,
  tinnitus,
  tonsillitis,
  toothDecay,
  tuberculosis,
  urinaryTractInfections,
  uterineFibroids,
  varicoseVeins,
  vitaminDDeficiency,
  vitiligo,
];

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

export function articleBySlug(slug: string): ConditionArticle | null {
  return BY_SLUG.get(slug) ?? null;
}
