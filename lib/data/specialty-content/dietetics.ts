import type { SpecialtyContent } from "./types";

export const dietetics: SpecialtyContent = {
  key: "dietetics",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A dietitian turns a medical condition into practical advice about what, when and how much to eat. Dietitians are allied health professionals, not medical doctors, and they usually hold a degree in nutrition or dietetics. Allied and healthcare professions, including dietetics and nutrition, are being brought under the National Commission for Allied and Healthcare Professions. The title 'nutritionist' is not protected in India, so it is worth asking about the qualification behind it.",
    "Clinical dietitians work in hospitals, clinics and outpatient departments with doctors. They plan diets for people with diabetes, kidney, liver and heart disease, for pregnancy and breastfeeding, for infants and children, for food allergies and intolerances, and for patients who are underweight, recovering from surgery, or fed through a tube. Good advice fits the person's usual foods, budget, culture and routine rather than replacing them with an unfamiliar plan.",
    "Most people see a dietitian on referral from a physician, diabetologist, nephrologist, paediatrician or obstetrician, or directly. For a medical condition, dietary advice works best alongside the treating doctor's plan, not instead of it. Be cautious of any programme that promises rapid results, sells its own supplements as essential, or advises stopping prescribed medicines.",
  ],
  conditions: [
    { name: "Diabetes and prediabetes", note: "Meal planning, portion sizes and timing that fit around medicines and daily routine." },
    { name: "High cholesterol, blood pressure and heart disease", note: "Changes to fats, salt and overall diet as part of lowering cardiovascular risk." },
    { name: "Kidney disease", note: "Diets that adjust protein, salt, potassium, phosphorus or fluid, depending on the stage and on dialysis." },
    { name: "Liver and digestive conditions", note: "Dietary support in liver disease, coeliac disease, irritable bowel symptoms and after gut surgery." },
    { name: "Pregnancy and breastfeeding", note: "Nutrition for mother and baby, including in gestational diabetes." },
    { name: "Infant and child nutrition", note: "Feeding concerns, poor growth, and weaning, working with the paediatrician." },
    { name: "Weight management under medical supervision", note: "Realistic, sustainable changes for people whose doctors have advised weight change." },
    { name: "Malnutrition and poor appetite during illness", note: "Keeping up nutrition during cancer treatment, after surgery or in older adults." },
  ],
  tests: [
    { name: "Nutritional assessment", note: "Weight, height, body measurements, usual diet, and relevant blood reports." },
    { name: "Diet history", note: "A detailed account of what, when and how much you usually eat and drink." },
    { name: "Individual diet plan", note: "Advice tailored to the condition, preferences, budget and routine." },
    { name: "Follow-up and adjustment", note: "Reviews to see what is working, adjusted with changes in blood results or treatment." },
    { name: "Therapeutic and tube feeding plans", note: "In hospitals, planning special feeds for patients who cannot eat normally." },
    { name: "Group and family education", note: "Sessions for families, especially where one person cooks for the household." },
  ],
  versus: [
    { key: "diabetology", text: "A diabetologist diagnoses diabetes and prescribes medicines. A dietitian helps with the food side of the plan; the two work best together." },
    { key: "endocrinology", text: "An endocrinologist is a doctor who investigates and treats hormone conditions, including those affecting weight. A dietitian provides nutrition advice but does not diagnose or prescribe." },
  ],
  firstVisit: [
    "Bring recent blood reports such as sugar, HbA1c, lipids and kidney tests, and any letter from your doctor.",
    "Bring a list of your medicines and supplements, since some interact with food.",
    "Keep a simple record of what you eat and drink for a few days beforehand, including timings.",
    "If someone else cooks for you, take them along.",
    "Expect questions about work, sleep, activity and food preferences; the plan should fit your life.",
  ],
  urgent: [
    "Swelling of the lips, face or throat, or breathing difficulty after eating: call 108",
    "Symptoms of very low blood sugar in diabetes, such as confusion, sweating or drowsiness that does not improve after taking sugar: call 108",
    "Rapid unexplained weight loss, or being unable to eat or drink: see a doctor promptly",
  ],
  faqs: [
    {
      q: "What is the difference between a dietitian and a nutritionist?",
      a: "In India the terms are often used interchangeably, and 'nutritionist' is not a protected title. A clinical dietitian usually has a degree in nutrition or dietetics and works with patients who have medical conditions. Ask about the qualification.",
    },
    {
      q: "Is a dietitian a doctor?",
      a: "No. Dietitians are allied health professionals. They do not diagnose conditions or prescribe medicines, and they work alongside your treating doctor.",
    },
    {
      q: "Do I need supplements?",
      a: "Many people meet their needs from food. Supplements are useful in specific situations, such as proven deficiency or pregnancy, and should be advised by your doctor or dietitian rather than bought as a package.",
    },
    {
      q: "What qualifications should a dietitian have?",
      a: "A degree in nutrition or dietetics, ideally with clinical experience in a hospital. Ask about registration, as allied health registers are being set up under the National Commission for Allied and Healthcare Professions.",
    },
    {
      q: "Can diet alone manage my diabetes?",
      a: "For some people with early diabetes, diet and activity changes are the first step. Others also need medicines. Do not stop prescribed medicines without speaking to your doctor.",
    },
  ],
};
