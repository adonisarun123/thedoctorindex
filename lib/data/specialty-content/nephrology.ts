import type { SpecialtyContent } from "./types";

export const nephrology: SpecialtyContent = {
  key: "nephrology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A nephrologist is a physician who specialises in the kidneys: how well they filter the blood, balance salts and fluids, and help control blood pressure. In India the usual route is an MBBS, a postgraduate degree in general medicine or paediatrics, and then a super-speciality degree such as DM Nephrology or DrNB Nephrology. Nephrologists treat with medicines, diet and dialysis; they do not operate.",
    "Kidney disease is often silent until it is advanced, so many people first hear of it through a routine blood test showing a raised creatinine, or a urine test showing protein. Diabetes and high blood pressure are the commonest causes, which is why people with these conditions are advised to have their kidneys checked regularly. Nephrologists also treat inflammation of the kidneys, inherited kidney disease, and sudden kidney injury in hospital.",
    "When the kidneys fail, a nephrologist plans and supervises dialysis, either haemodialysis at a centre or peritoneal dialysis at home, and prepares patients for a kidney transplant, looking after them afterwards alongside the transplant surgeon. Because kidney disease is usually long-term, continuity matters: a nephrologist who follows your results over years can spot a change early.",
  ],
  conditions: [
    { name: "Chronic kidney disease (CKD)", note: "A gradual loss of kidney function over months or years, often from diabetes or high blood pressure." },
    { name: "Acute kidney injury", note: "A sudden drop in kidney function, often during another illness, dehydration or after certain medicines." },
    { name: "Diabetic kidney disease", note: "Kidney damage from long-standing diabetes, often first seen as protein in the urine." },
    { name: "High blood pressure related to the kidneys", note: "Blood pressure that is hard to control, or that is caused or worsened by kidney disease." },
    { name: "Glomerulonephritis and nephrotic syndrome", note: "Inflammation or leakiness of the kidney filters, causing protein or blood in the urine and swelling." },
    { name: "Polycystic kidney disease", note: "An inherited condition in which cysts grow in the kidneys; family members may be offered screening." },
    { name: "Electrolyte disorders", note: "Abnormal sodium, potassium or other salt levels in the blood." },
    { name: "Kidney failure", note: "When the kidneys can no longer keep the body in balance and dialysis or a transplant is needed." },
    { name: "Care after kidney transplant", note: "Long-term monitoring of the transplanted kidney and the medicines that protect it." },
  ],
  tests: [
    { name: "Serum creatinine and eGFR", note: "Blood tests that estimate how well the kidneys are filtering." },
    { name: "Urine tests for protein and blood", note: "Including a urine albumin or protein ratio, an early marker of kidney damage." },
    { name: "Electrolytes", note: "Blood levels of sodium, potassium and other salts that the kidneys control." },
    { name: "Ultrasound of the kidneys", note: "Shows kidney size, cysts, stones and blockage." },
    { name: "Kidney biopsy", note: "A small sample of kidney taken with a needle to find the exact cause of some kidney diseases." },
    { name: "Blood pressure monitoring", note: "Regular or 24-hour readings, since blood pressure control protects the kidneys." },
    { name: "Haemodialysis", note: "Blood is cleaned by a machine, usually several times a week at a dialysis centre." },
    { name: "Peritoneal dialysis", note: "Dialysis done at home using fluid placed in the abdomen through a soft tube." },
  ],
  versus: [
    { key: "urology", text: "A nephrologist treats how well the kidneys work and manages dialysis, with medicines rather than surgery. A urologist operates on the urinary tract, for stones, blockages, the prostate and tumours. The two refer to each other often." },
    { key: "transplant-surgery", text: "The nephrologist prepares a patient for a kidney transplant and manages the long-term care afterwards. The transplant surgeon performs the operation, and the two work as one team." },
  ],
  firstVisit: [
    "Bring every creatinine, urine and ultrasound report you have, with dates; the trend over time matters more than any single result.",
    "Bring a list of all medicines, including painkillers, supplements and traditional remedies, since some can affect the kidneys.",
    "Bring home blood pressure readings and, if you have diabetes, recent sugar and HbA1c reports.",
    "Mention any family history of kidney disease or dialysis.",
    "Expect blood and urine tests on the day, and advice on salt, fluids and diet that may be adjusted as results come in.",
  ],
  urgent: [
    "Passing very little or no urine, especially with swelling or breathlessness",
    "Severe breathlessness or chest pain in someone with kidney failure or on dialysis: call 108",
    "Confusion, extreme drowsiness, severe weakness or palpitations in someone with kidney disease, which can mean dangerous salt levels",
    "Fever, pain or redness at a dialysis catheter or access site, or pain and reduced urine over a transplanted kidney",
  ],
  faqs: [
    {
      q: "My creatinine is slightly high. Should I worry?",
      a: "A single result can be affected by dehydration, muscle mass and other factors. A nephrologist or physician will usually repeat it, check urine tests and look at the trend before deciding what it means.",
    },
    {
      q: "Does kidney disease always lead to dialysis?",
      a: "No. Many people with chronic kidney disease never need dialysis, especially when blood pressure, diabetes and other risks are well controlled and the disease is found early.",
    },
    {
      q: "What is the difference between a nephrologist and a urologist?",
      a: "A nephrologist is a physician who treats kidney function and kidney disease and manages dialysis. A urologist is a surgeon who treats stones, blockages, the prostate and other structural problems of the urinary tract.",
    },
    {
      q: "What qualifications should a nephrologist have?",
      a: "An MBBS, a postgraduate degree usually in general medicine, and then a super-speciality degree such as DM Nephrology or DrNB Nephrology. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Should people with diabetes see a nephrologist?",
      a: "Not routinely, but they should have kidney blood and urine tests regularly. A nephrologist is usually involved when these show declining function or rising protein in the urine.",
    },
  ],
};
