import type { ConditionArticle } from "@/lib/conditions/article";

import { article as abscess } from "@/lib/conditions/articles/abscess";
import { article as acne } from "@/lib/conditions/articles/acne";
import { article as acuteBronchitis } from "@/lib/conditions/articles/acute-bronchitis";
import { article as allergy } from "@/lib/conditions/articles/allergy";
import { article as alzheimerSDisease } from "@/lib/conditions/articles/alzheimer-s-disease";
import { article as anemia } from "@/lib/conditions/articles/anemia";
import { article as angina } from "@/lib/conditions/articles/angina";
import { article as ankylosingSpondylitis } from "@/lib/conditions/articles/ankylosing-spondylitis";
import { article as anxiety } from "@/lib/conditions/articles/anxiety";
import { article as aorticAneurysm } from "@/lib/conditions/articles/aortic-aneurysm";
import { article as appendicitis } from "@/lib/conditions/articles/appendicitis";
import { article as arrhythmia } from "@/lib/conditions/articles/arrhythmia";
import { article as arthritis } from "@/lib/conditions/articles/arthritis";
import { article as asthma } from "@/lib/conditions/articles/asthma";
import { article as atherosclerosis } from "@/lib/conditions/articles/atherosclerosis";
import { article as athleteSFoot } from "@/lib/conditions/articles/athlete-s-foot";
import { article as atrialFibrillation } from "@/lib/conditions/articles/atrial-fibrillation";
import { article as attentionDeficitHyperactivityDisorder } from "@/lib/conditions/articles/attention-deficit-hyperactivity-disorder";
import { article as autismSpectrumDisorder } from "@/lib/conditions/articles/autism-spectrum-disorder";
import { article as bellSPalsy } from "@/lib/conditions/articles/bell-s-palsy";
import { article as bipolarDisorder } from "@/lib/conditions/articles/bipolar-disorder";
import { article as breastCancer } from "@/lib/conditions/articles/breast-cancer";
import { article as bursitis } from "@/lib/conditions/articles/bursitis";
import { article as cardiomyopathy } from "@/lib/conditions/articles/cardiomyopathy";
import { article as carpalTunnelSyndrome } from "@/lib/conditions/articles/carpal-tunnel-syndrome";
import { article as cataract } from "@/lib/conditions/articles/cataract";
import { article as celiacDisease } from "@/lib/conditions/articles/celiac-disease";
import { article as cellulitis } from "@/lib/conditions/articles/cellulitis";
import { article as cerebralPalsy } from "@/lib/conditions/articles/cerebral-palsy";
import { article as cervicalCancer } from "@/lib/conditions/articles/cervical-cancer";
import { article as chickenpox } from "@/lib/conditions/articles/chickenpox";
import { article as chikungunya } from "@/lib/conditions/articles/chikungunya";
import { article as cholera } from "@/lib/conditions/articles/cholera";
import { article as chronicBronchitis } from "@/lib/conditions/articles/chronic-bronchitis";
import { article as chronicKidneyDisease } from "@/lib/conditions/articles/chronic-kidney-disease";
import { article as chronicPain } from "@/lib/conditions/articles/chronic-pain";
import { article as cirrhosis } from "@/lib/conditions/articles/cirrhosis";
import { article as colonicPolyps } from "@/lib/conditions/articles/colonic-polyps";
import { article as colorectalCancer } from "@/lib/conditions/articles/colorectal-cancer";
import { article as commonCold } from "@/lib/conditions/articles/common-cold";
import { article as concussion } from "@/lib/conditions/articles/concussion";
import { article as congenitalHeartDefects } from "@/lib/conditions/articles/congenital-heart-defects";
import { article as constipation } from "@/lib/conditions/articles/constipation";
import { article as copd } from "@/lib/conditions/articles/copd";
import { article as coronaryArteryDisease } from "@/lib/conditions/articles/coronary-artery-disease";
import { article as covid19CoronavirusDisease2019 } from "@/lib/conditions/articles/covid-19-coronavirus-disease-2019";
import { article as crohnSDisease } from "@/lib/conditions/articles/crohn-s-disease";
import { article as deepVeinThrombosis } from "@/lib/conditions/articles/deep-vein-thrombosis";
import { article as dementia } from "@/lib/conditions/articles/dementia";
import { article as dengue } from "@/lib/conditions/articles/dengue";
import { article as depression } from "@/lib/conditions/articles/depression";
import { article as diabetesType1 } from "@/lib/conditions/articles/diabetes-type-1";
import { article as diabetesType2 } from "@/lib/conditions/articles/diabetes-type-2";
import { article as diabeticEyeProblems } from "@/lib/conditions/articles/diabetic-eye-problems";
import { article as diabeticFoot } from "@/lib/conditions/articles/diabetic-foot";
import { article as diabeticHeartDisease } from "@/lib/conditions/articles/diabetic-heart-disease";
import { article as diabeticKidneyProblems } from "@/lib/conditions/articles/diabetic-kidney-problems";
import { article as diabeticNerveProblems } from "@/lib/conditions/articles/diabetic-nerve-problems";
import { article as diarrhea } from "@/lib/conditions/articles/diarrhea";
import { article as diphtheria } from "@/lib/conditions/articles/diphtheria";
import { article as dislocatedShoulder } from "@/lib/conditions/articles/dislocated-shoulder";
import { article as diverticulosisAndDiverticulitis } from "@/lib/conditions/articles/diverticulosis-and-diverticulitis";
import { article as earInfections } from "@/lib/conditions/articles/ear-infections";
import { article as ectopicPregnancy } from "@/lib/conditions/articles/ectopic-pregnancy";
import { article as eczema } from "@/lib/conditions/articles/eczema";
import { article as emphysema } from "@/lib/conditions/articles/emphysema";
import { article as encephalitis } from "@/lib/conditions/articles/encephalitis";
import { article as endometriosis } from "@/lib/conditions/articles/endometriosis";
import { article as enlargedProstateBph } from "@/lib/conditions/articles/enlarged-prostate-bph";
import { article as epilepsy } from "@/lib/conditions/articles/epilepsy";
import { article as erectileDysfunction } from "@/lib/conditions/articles/erectile-dysfunction";
import { article as femaleInfertility } from "@/lib/conditions/articles/female-infertility";
import { article as fibromyalgia } from "@/lib/conditions/articles/fibromyalgia";
import { article as flu } from "@/lib/conditions/articles/flu";
import { article as foodborneIllness } from "@/lib/conditions/articles/foodborne-illness";
import { article as fractures } from "@/lib/conditions/articles/fractures";
import { article as gallstones } from "@/lib/conditions/articles/gallstones";
import { article as gastroenteritis } from "@/lib/conditions/articles/gastroenteritis";
import { article as gastrointestinalBleeding } from "@/lib/conditions/articles/gastrointestinal-bleeding";
import { article as gerd } from "@/lib/conditions/articles/gerd";
import { article as glaucoma } from "@/lib/conditions/articles/glaucoma";
import { article as gout } from "@/lib/conditions/articles/gout";
import { article as guillainBarreSyndrome } from "@/lib/conditions/articles/guillain-barre-syndrome";
import { article as gumDisease } from "@/lib/conditions/articles/gum-disease";
import { article as hairLoss } from "@/lib/conditions/articles/hair-loss";
import { article as hayFever } from "@/lib/conditions/articles/hay-fever";
import { article as headLice } from "@/lib/conditions/articles/head-lice";
import { article as heartAttack } from "@/lib/conditions/articles/heart-attack";
import { article as heartFailure } from "@/lib/conditions/articles/heart-failure";
import { article as helicobacterPyloriInfections } from "@/lib/conditions/articles/helicobacter-pylori-infections";
import { article as hemorrhagicStroke } from "@/lib/conditions/articles/hemorrhagic-stroke";
import { article as hemorrhoids } from "@/lib/conditions/articles/hemorrhoids";
import { article as hepatitisA } from "@/lib/conditions/articles/hepatitis-a";
import { article as hepatitisB } from "@/lib/conditions/articles/hepatitis-b";
import { article as hepatitisC } from "@/lib/conditions/articles/hepatitis-c";
import { article as hernia } from "@/lib/conditions/articles/hernia";
import { article as herniatedDisk } from "@/lib/conditions/articles/herniated-disk";
import { article as hiatalHernia } from "@/lib/conditions/articles/hiatal-hernia";
import { article as highBloodPressure } from "@/lib/conditions/articles/high-blood-pressure";
import { article as highBloodPressureInPregnancy } from "@/lib/conditions/articles/high-blood-pressure-in-pregnancy";
import { article as hiv } from "@/lib/conditions/articles/hiv";
import { article as hives } from "@/lib/conditions/articles/hives";
import { article as hyperglycemia } from "@/lib/conditions/articles/hyperglycemia";
import { article as hyperthyroidism } from "@/lib/conditions/articles/hyperthyroidism";
import { article as hypoglycemia } from "@/lib/conditions/articles/hypoglycemia";
import { article as hypothyroidism } from "@/lib/conditions/articles/hypothyroidism";
import { article as impetigo } from "@/lib/conditions/articles/impetigo";
import { article as indigestion } from "@/lib/conditions/articles/indigestion";
import { article as infectiousMononucleosis } from "@/lib/conditions/articles/infectious-mononucleosis";
import { article as insomnia } from "@/lib/conditions/articles/insomnia";
import { article as irritableBowelSyndrome } from "@/lib/conditions/articles/irritable-bowel-syndrome";
import { article as ischemicStroke } from "@/lib/conditions/articles/ischemic-stroke";
import { article as jaundice } from "@/lib/conditions/articles/jaundice";
import { article as juvenileArthritis } from "@/lib/conditions/articles/juvenile-arthritis";
import { article as kidneyFailure } from "@/lib/conditions/articles/kidney-failure";
import { article as kidneyStones } from "@/lib/conditions/articles/kidney-stones";
import { article as lactoseIntolerance } from "@/lib/conditions/articles/lactose-intolerance";
import { article as leishmaniasis } from "@/lib/conditions/articles/leishmaniasis";
import { article as lowBloodPressure } from "@/lib/conditions/articles/low-blood-pressure";
import { article as lungCancer } from "@/lib/conditions/articles/lung-cancer";
import { article as lupus } from "@/lib/conditions/articles/lupus";
import { article as malaria } from "@/lib/conditions/articles/malaria";
import { article as maleInfertility } from "@/lib/conditions/articles/male-infertility";
import { article as measles } from "@/lib/conditions/articles/measles";
import { article as meningitis } from "@/lib/conditions/articles/meningitis";
import { article as metabolicSyndrome } from "@/lib/conditions/articles/metabolic-syndrome";
import { article as migraine } from "@/lib/conditions/articles/migraine";
import { article as miscarriage } from "@/lib/conditions/articles/miscarriage";
import { article as mitralValveProlapse } from "@/lib/conditions/articles/mitral-valve-prolapse";
import { article as multipleSclerosis } from "@/lib/conditions/articles/multiple-sclerosis";
import { article as mumps } from "@/lib/conditions/articles/mumps";
import { article as muscleCramps } from "@/lib/conditions/articles/muscle-cramps";
import { article as obesity } from "@/lib/conditions/articles/obesity";
import { article as obsessiveCompulsiveDisorder } from "@/lib/conditions/articles/obsessive-compulsive-disorder";
import { article as oralCancer } from "@/lib/conditions/articles/oral-cancer";
import { article as osteoarthritis } from "@/lib/conditions/articles/osteoarthritis";
import { article as osteoporosis } from "@/lib/conditions/articles/osteoporosis";
import { article as ovarianCysts } from "@/lib/conditions/articles/ovarian-cysts";
import { article as overactiveBladder } from "@/lib/conditions/articles/overactive-bladder";
import { article as pancreatitis } from "@/lib/conditions/articles/pancreatitis";
import { article as panicDisorder } from "@/lib/conditions/articles/panic-disorder";
import { article as parkinsonSDisease } from "@/lib/conditions/articles/parkinson-s-disease";
import { article as pelvicInflammatoryDisease } from "@/lib/conditions/articles/pelvic-inflammatory-disease";
import { article as pepticUlcer } from "@/lib/conditions/articles/peptic-ulcer";
import { article as peripheralArterialDisease } from "@/lib/conditions/articles/peripheral-arterial-disease";
import { article as pinkEye } from "@/lib/conditions/articles/pink-eye";
import { article as pneumonia } from "@/lib/conditions/articles/pneumonia";
import { article as polycysticOvarySyndrome } from "@/lib/conditions/articles/polycystic-ovary-syndrome";
import { article as postpartumDepression } from "@/lib/conditions/articles/postpartum-depression";
import { article as prediabetes } from "@/lib/conditions/articles/prediabetes";
import { article as premenstrualSyndrome } from "@/lib/conditions/articles/premenstrual-syndrome";
import { article as prostateCancer } from "@/lib/conditions/articles/prostate-cancer";
import { article as psoriasis } from "@/lib/conditions/articles/psoriasis";
import { article as psoriaticArthritis } from "@/lib/conditions/articles/psoriatic-arthritis";
import { article as pulmonaryEmbolism } from "@/lib/conditions/articles/pulmonary-embolism";
import { article as pulmonaryFibrosis } from "@/lib/conditions/articles/pulmonary-fibrosis";
import { article as pulmonaryHypertension } from "@/lib/conditions/articles/pulmonary-hypertension";
import { article as rabies } from "@/lib/conditions/articles/rabies";
import { article as refractiveErrors } from "@/lib/conditions/articles/refractive-errors";
import { article as restlessLegs } from "@/lib/conditions/articles/restless-legs";
import { article as rheumatoidArthritis } from "@/lib/conditions/articles/rheumatoid-arthritis";
import { article as rosacea } from "@/lib/conditions/articles/rosacea";
import { article as rotatorCuffInjuries } from "@/lib/conditions/articles/rotator-cuff-injuries";
import { article as rotavirusInfections } from "@/lib/conditions/articles/rotavirus-infections";
import { article as scabies } from "@/lib/conditions/articles/scabies";
import { article as schizophrenia } from "@/lib/conditions/articles/schizophrenia";
import { article as sciatica } from "@/lib/conditions/articles/sciatica";
import { article as scoliosis } from "@/lib/conditions/articles/scoliosis";
import { article as seizures } from "@/lib/conditions/articles/seizures";
import { article as sepsis } from "@/lib/conditions/articles/sepsis";
import { article as shingles } from "@/lib/conditions/articles/shingles";
import { article as sickleCellDisease } from "@/lib/conditions/articles/sickle-cell-disease";
import { article as sinusitis } from "@/lib/conditions/articles/sinusitis";
import { article as sleepApnea } from "@/lib/conditions/articles/sleep-apnea";
import { article as spinalStenosis } from "@/lib/conditions/articles/spinal-stenosis";
import { article as sprainsAndStrains } from "@/lib/conditions/articles/sprains-and-strains";
import { article as steatoticLiverDisease } from "@/lib/conditions/articles/steatotic-liver-disease";
import { article as stroke } from "@/lib/conditions/articles/stroke";
import { article as suddenCardiacArrest } from "@/lib/conditions/articles/sudden-cardiac-arrest";
import { article as tendinitis } from "@/lib/conditions/articles/tendinitis";
import { article as tetanus } from "@/lib/conditions/articles/tetanus";
import { article as thalassemia } from "@/lib/conditions/articles/thalassemia";
import { article as tineaInfections } from "@/lib/conditions/articles/tinea-infections";
import { article as tinnitus } from "@/lib/conditions/articles/tinnitus";
import { article as tonsillitis } from "@/lib/conditions/articles/tonsillitis";
import { article as toothDecay } from "@/lib/conditions/articles/tooth-decay";
import { article as transientIschemicAttack } from "@/lib/conditions/articles/transient-ischemic-attack";
import { article as trigeminalNeuralgia } from "@/lib/conditions/articles/trigeminal-neuralgia";
import { article as tuberculosis } from "@/lib/conditions/articles/tuberculosis";
import { article as ulcerativeColitis } from "@/lib/conditions/articles/ulcerative-colitis";
import { article as urinaryIncontinence } from "@/lib/conditions/articles/urinary-incontinence";
import { article as urinaryTractInfections } from "@/lib/conditions/articles/urinary-tract-infections";
import { article as uterineFibroids } from "@/lib/conditions/articles/uterine-fibroids";
import { article as vaginitis } from "@/lib/conditions/articles/vaginitis";
import { article as varicoseVeins } from "@/lib/conditions/articles/varicose-veins";
import { article as vitaminDDeficiency } from "@/lib/conditions/articles/vitamin-d-deficiency";
import { article as vitiligo } from "@/lib/conditions/articles/vitiligo";
import { article as warts } from "@/lib/conditions/articles/warts";
import { article as whoopingCough } from "@/lib/conditions/articles/whooping-cough";
import { article as yeastInfections } from "@/lib/conditions/articles/yeast-infections";

export const ARTICLES: ConditionArticle[] = [
  abscess,
  acne,
  acuteBronchitis,
  allergy,
  alzheimerSDisease,
  anemia,
  angina,
  ankylosingSpondylitis,
  anxiety,
  aorticAneurysm,
  appendicitis,
  arrhythmia,
  arthritis,
  asthma,
  atherosclerosis,
  athleteSFoot,
  atrialFibrillation,
  attentionDeficitHyperactivityDisorder,
  autismSpectrumDisorder,
  bellSPalsy,
  bipolarDisorder,
  breastCancer,
  bursitis,
  cardiomyopathy,
  carpalTunnelSyndrome,
  cataract,
  celiacDisease,
  cellulitis,
  cerebralPalsy,
  cervicalCancer,
  chickenpox,
  chikungunya,
  cholera,
  chronicBronchitis,
  chronicKidneyDisease,
  chronicPain,
  cirrhosis,
  colonicPolyps,
  colorectalCancer,
  commonCold,
  concussion,
  congenitalHeartDefects,
  constipation,
  copd,
  coronaryArteryDisease,
  covid19CoronavirusDisease2019,
  crohnSDisease,
  deepVeinThrombosis,
  dementia,
  dengue,
  depression,
  diabetesType1,
  diabetesType2,
  diabeticEyeProblems,
  diabeticFoot,
  diabeticHeartDisease,
  diabeticKidneyProblems,
  diabeticNerveProblems,
  diarrhea,
  diphtheria,
  dislocatedShoulder,
  diverticulosisAndDiverticulitis,
  earInfections,
  ectopicPregnancy,
  eczema,
  emphysema,
  encephalitis,
  endometriosis,
  enlargedProstateBph,
  epilepsy,
  erectileDysfunction,
  femaleInfertility,
  fibromyalgia,
  flu,
  foodborneIllness,
  fractures,
  gallstones,
  gastroenteritis,
  gastrointestinalBleeding,
  gerd,
  glaucoma,
  gout,
  guillainBarreSyndrome,
  gumDisease,
  hairLoss,
  hayFever,
  headLice,
  heartAttack,
  heartFailure,
  helicobacterPyloriInfections,
  hemorrhagicStroke,
  hemorrhoids,
  hepatitisA,
  hepatitisB,
  hepatitisC,
  hernia,
  herniatedDisk,
  hiatalHernia,
  highBloodPressure,
  highBloodPressureInPregnancy,
  hiv,
  hives,
  hyperglycemia,
  hyperthyroidism,
  hypoglycemia,
  hypothyroidism,
  impetigo,
  indigestion,
  infectiousMononucleosis,
  insomnia,
  irritableBowelSyndrome,
  ischemicStroke,
  jaundice,
  juvenileArthritis,
  kidneyFailure,
  kidneyStones,
  lactoseIntolerance,
  leishmaniasis,
  lowBloodPressure,
  lungCancer,
  lupus,
  malaria,
  maleInfertility,
  measles,
  meningitis,
  metabolicSyndrome,
  migraine,
  miscarriage,
  mitralValveProlapse,
  multipleSclerosis,
  mumps,
  muscleCramps,
  obesity,
  obsessiveCompulsiveDisorder,
  oralCancer,
  osteoarthritis,
  osteoporosis,
  ovarianCysts,
  overactiveBladder,
  pancreatitis,
  panicDisorder,
  parkinsonSDisease,
  pelvicInflammatoryDisease,
  pepticUlcer,
  peripheralArterialDisease,
  pinkEye,
  pneumonia,
  polycysticOvarySyndrome,
  postpartumDepression,
  prediabetes,
  premenstrualSyndrome,
  prostateCancer,
  psoriasis,
  psoriaticArthritis,
  pulmonaryEmbolism,
  pulmonaryFibrosis,
  pulmonaryHypertension,
  rabies,
  refractiveErrors,
  restlessLegs,
  rheumatoidArthritis,
  rosacea,
  rotatorCuffInjuries,
  rotavirusInfections,
  scabies,
  schizophrenia,
  sciatica,
  scoliosis,
  seizures,
  sepsis,
  shingles,
  sickleCellDisease,
  sinusitis,
  sleepApnea,
  spinalStenosis,
  sprainsAndStrains,
  steatoticLiverDisease,
  stroke,
  suddenCardiacArrest,
  tendinitis,
  tetanus,
  thalassemia,
  tineaInfections,
  tinnitus,
  tonsillitis,
  toothDecay,
  transientIschemicAttack,
  trigeminalNeuralgia,
  tuberculosis,
  ulcerativeColitis,
  urinaryIncontinence,
  urinaryTractInfections,
  uterineFibroids,
  vaginitis,
  varicoseVeins,
  vitaminDDeficiency,
  vitiligo,
  warts,
  whoopingCough,
  yeastInfections,
];

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

export function articleBySlug(slug: string): ConditionArticle | null {
  return BY_SLUG.get(slug) ?? null;
}
