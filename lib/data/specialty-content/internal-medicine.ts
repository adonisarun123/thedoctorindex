import type { SpecialtyContent } from "./types";

export const internalMedicine: SpecialtyContent = {
  key: "internal-medicine",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An internal medicine physician, often listed as a consultant physician or MD Medicine, is a specialist in adult illness that is treated without surgery. In India this usually means an MBBS followed by a three-year postgraduate degree, MD in general medicine or DNB in general medicine. Internal medicine is also the base from which many super-specialists start: most cardiologists, nephrologists, gastroenterologists and neurologists trained in general medicine first.",
    "The distinctive skill is handling several problems at once. A patient with diabetes, kidney disease and heart failure, taking a dozen medicines prescribed by different doctors, needs someone who sees how the conditions and treatments affect each other. Internal medicine physicians also take on puzzles: a fever that will not settle, weight loss without a clear cause, or symptoms that do not point to any one organ.",
    "In most Indian hospitals the general medicine department runs the medical wards. If you are admitted with an infection, uncontrolled diabetes or an illness that is not yet diagnosed, you are likely to be under a physician who coordinates tests and calls in other specialists as needed. Many also run outpatient clinics, where the work overlaps with general practice but tends towards more complex cases.",
  ],
  conditions: [
    { name: "Diabetes with complications", note: "Diabetes affecting the kidneys, nerves, eyes or heart, or sugars that swing despite treatment." },
    { name: "High blood pressure", note: "Including blood pressure that needs several medicines, and its effects on the heart, kidneys and brain." },
    { name: "Several long-term conditions together", note: "Coordinating treatment when heart, kidney, lung and metabolic problems coexist." },
    { name: "Prolonged or unexplained fever", note: "Fever lasting weeks, investigated for infections such as tuberculosis and typhoid, and for non-infectious causes." },
    { name: "Serious infections", note: "Pneumonia, severe dengue, malaria, urinary and blood infections, often treated in hospital." },
    { name: "Anaemia", note: "Finding the cause, whether iron, vitamin deficiency, blood loss or a problem with the bone marrow." },
    { name: "Unexplained weight loss or tiredness", note: "Symptoms that need a structured search across several body systems." },
    { name: "Thyroid and other hormonal problems", note: "Often managed by physicians, with an endocrinologist involved when needed." },
    { name: "Medication review", note: "Checking a long list of medicines for duplication, interactions and side effects." },
  ],
  tests: [
    { name: "Blood counts and biochemistry", note: "Blood count, kidney and liver function, electrolytes and sugar; the foundation of most investigations." },
    { name: "HbA1c and lipid profile", note: "Long-term sugar control and cholesterol, used to guide treatment of diabetes and cardiovascular risk." },
    { name: "Fever workup", note: "Blood cultures and tests for dengue, malaria, typhoid, tuberculosis and other infections, chosen by symptoms and season." },
    { name: "Urine tests", note: "Look for infection, and for protein that can be an early sign of kidney damage." },
    { name: "ECG and chest X-ray", note: "Routine first tests for chest symptoms, breathlessness and before many treatments." },
    { name: "Ultrasound of the abdomen", note: "A painless scan of the liver, kidneys and other organs." },
    { name: "Echocardiogram, CT or other imaging", note: "Arranged when a problem needs a closer look at a particular organ." },
  ],
  versus: [
    { key: "general-practice", text: "A general physician is usually the first stop for everyday illness. An internal medicine physician has postgraduate hospital training and is the usual choice for complex adult illness, several conditions at once, or a hospital admission." },
    { key: "endocrinology", text: "Physicians manage most diabetes and thyroid disease. An endocrinologist is a super-specialist for hormonal problems that are difficult, unusual or not responding to standard treatment." },
    { key: "infectious-diseases", text: "Physicians treat most infections. An infectious disease specialist is brought in for infections that are unusual, recurrent, or resistant to the usual antibiotics." },
  ],
  firstVisit: [
    "Bring all your prescriptions and every medicine you take, ideally in their packets, including supplements and traditional remedies.",
    "Bring earlier reports and discharge summaries in date order. For a long illness, a one-page timeline of what happened when is very useful.",
    "List your diagnoses and the specialists you see, so the physician can see the whole picture.",
    "Expect a detailed history and a full examination. Blood tests are usually ordered on the day and the plan is set once results are in.",
    "Ask which doctor is coordinating your care, and whom to contact if things change.",
  ],
  urgent: [
    "Chest pain, severe breathlessness, or fainting",
    "Sudden weakness of one side of the body, confusion or difficulty speaking",
    "High fever with drowsiness, confusion, a stiff neck, or bleeding from the gums or nose",
    "Vomiting blood, black stools, or someone who has collapsed: call 108",
  ],
  faqs: [
    {
      q: "What is the difference between an MD Medicine and an MBBS doctor?",
      a: "An MBBS doctor has completed basic medical training and can practise as a general physician. An MD in general medicine has done a further three years of postgraduate training in adult medicine, much of it in hospital wards.",
    },
    {
      q: "When should I see an internal medicine physician rather than a super-specialist?",
      a: "When your problems cross several organs, or it is not yet clear what is wrong. A physician can sort out the overall picture and refer you to the right super-specialist when one organ clearly needs it.",
    },
    {
      q: "Do internal medicine physicians treat children?",
      a: "Usually not. Internal medicine is adult medicine; children are generally seen by a paediatrician.",
    },
    {
      q: "Can a physician reduce the number of medicines I take?",
      a: "A physician can review all your medicines together and may be able to stop ones that are duplicated or no longer needed. Do not stop any medicine on your own; changes should be made with the doctor who prescribed it.",
    },
    {
      q: "Who looks after me if I am admitted to hospital with a fever?",
      a: "In many Indian hospitals, adults admitted with a fever or a medical illness are under the general medicine team, who call in other specialists as needed.",
    },
  ],
};
