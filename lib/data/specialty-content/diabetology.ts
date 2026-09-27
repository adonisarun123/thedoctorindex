import type { SpecialtyContent } from "./types";

export const diabetology: SpecialtyContent = {
  key: "diabetology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A diabetologist is a doctor who concentrates on diabetes: diagnosing it, controlling blood sugar, and preventing and treating the problems it can cause in the eyes, kidneys, nerves, feet, heart and blood vessels. Diabetes is very common in India, and many doctors focus their practice on it. Diabetologists usually come from general medicine, with an MBBS and an MD or DNB in general medicine, and add further training, diplomas or fellowships in diabetes; some are endocrinologists who have chosen to focus on diabetes. Training routes vary, so it is worth checking a doctor's degrees and registration.",
    "The difference from endocrinology is scope. A diabetologist focuses on diabetes alone, while an endocrinologist covers all the hormone glands, diabetes included. Diabetologists treat with lifestyle advice, tablets, insulin and other injectable medicines, and they usually work with dietitians, diabetes educators, eye specialists and foot-care teams.",
    "Diabetes care is mostly about the long run. Good control lowers the risk of complications, and regular checks of the eyes, kidneys and feet catch problems early, often before there are symptoms. A diabetologist is especially useful at diagnosis, when starting or adjusting insulin, when readings will not settle, in pregnancy, and when complications appear. Many people with straightforward type 2 diabetes are looked after well by a general physician.",
  ],
  conditions: [
    { name: "Type 2 diabetes", note: "The commonest form, linked with weight, activity and family history, usually managed with lifestyle change and medicines." },
    { name: "Type 1 diabetes", note: "The body stops making insulin, usually starting in childhood or young adulthood; insulin is needed for life." },
    { name: "Prediabetes", note: "Blood sugar higher than normal but below the diabetes range, where lifestyle change can delay or prevent diabetes." },
    { name: "Diabetes in pregnancy", note: "Diabetes first found in pregnancy, or pre-existing diabetes needing tight control, managed with the obstetrician." },
    { name: "Diabetic foot problems", note: "Numbness, ulcers and infections of the feet, which need early attention to prevent serious damage." },
    { name: "Diabetic nerve damage", note: "Tingling, burning or numbness in the feet and hands from long-standing high sugar." },
    { name: "Diabetic kidney disease", note: "Kidney damage from diabetes, first seen as protein in the urine." },
    { name: "Diabetic eye disease", note: "Damage to the retina that may have no symptoms early, found through regular eye checks." },
    { name: "Low blood sugar (hypoglycaemia)", note: "Sugar dropping too low, usually from diabetes medicines, meals missed or unusual exercise." },
  ],
  tests: [
    { name: "Fasting and post-meal blood sugar", note: "Standard tests for diagnosing and monitoring diabetes." },
    { name: "HbA1c", note: "A blood test reflecting average blood sugar over the past two to three months." },
    { name: "Home glucose monitoring", note: "Finger-prick checks with a glucometer, to guide day-to-day treatment." },
    { name: "Continuous glucose monitoring", note: "A small sensor worn on the skin that tracks sugar levels through the day and night." },
    { name: "Kidney tests", note: "Creatinine and urine albumin, checked regularly to catch kidney damage early." },
    { name: "Lipid profile", note: "Cholesterol levels, since diabetes raises the risk of heart disease." },
    { name: "Eye examination", note: "A dilated check of the retina, usually by an ophthalmologist, at regular intervals." },
    { name: "Foot examination", note: "Checking sensation, pulses and skin to spot risk of ulcers." },
  ],
  versus: [
    { key: "endocrinology", text: "A diabetologist concentrates on diabetes and its complications. An endocrinologist covers all hormone glands, including the thyroid, pituitary and adrenals, as well as diabetes; for diabetes linked with another hormone problem, an endocrinologist is often the better fit." },
    { key: "internal-medicine", text: "A general physician can diagnose diabetes and manage many people with straightforward type 2 diabetes. A diabetologist is useful when control is difficult, insulin is being started, or complications appear." },
    { key: "dietetics", text: "Diet is central to diabetes care. A dietitian builds a practical eating plan around your food habits, while the diabetologist decides on medicines and monitoring." },
  ],
  firstVisit: [
    "Bring all sugar and HbA1c reports with dates, and your glucometer or a written log of home readings.",
    "Bring every medicine and insulin you use, including the pen or vial, and say exactly how and when you take them.",
    "Bring kidney, cholesterol and eye check reports if you have them.",
    "Mention any episodes of low sugar, such as shakiness, sweating or confusion, and what you did about them.",
    "Expect your feet to be examined, so wear footwear that is easy to remove.",
  ],
  urgent: [
    "Confusion, sweating, shaking, unusual behaviour or drowsiness in someone on diabetes treatment, which can mean low blood sugar. If they cannot swallow safely or do not recover quickly, call 108",
    "Unconsciousness or a seizure in someone with diabetes",
    "Vomiting, abdominal pain, deep rapid breathing, great thirst and drowsiness, which can mean dangerously high sugar",
    "A foot that is red, hot, swollen or blackened, or a foot wound with fever",
  ],
  faqs: [
    {
      q: "What is the difference between a diabetologist and an endocrinologist?",
      a: "A diabetologist concentrates on diabetes and its complications. An endocrinologist treats all hormone disorders, including diabetes, thyroid, pituitary and adrenal conditions.",
    },
    {
      q: "What qualifications should a diabetologist have?",
      a: "Training routes vary. Many diabetologists have an MBBS and an MD or DNB in general medicine with further diabetes training; some are endocrinologists with a DM or DrNB. Check the degrees listed and the registration with the NMC or a state medical council.",
    },
    {
      q: "Does starting insulin mean my diabetes is very bad?",
      a: "Not necessarily. Insulin is needed in type 1 diabetes and often in pregnancy, and many people with type 2 diabetes need it at some stage. It is a treatment choice, not a failure.",
    },
    {
      q: "What are the signs of low blood sugar?",
      a: "Shakiness, sweating, a fast heartbeat, hunger, confusion, unusual behaviour and drowsiness. Your doctor will explain what to do; if the person cannot swallow safely or does not recover quickly, call 108.",
    },
    {
      q: "How often should someone with diabetes have eye and kidney checks?",
      a: "Usually at least once a year, or more often if problems are found. Your doctor will advise a schedule based on your results.",
    },
  ],
};
