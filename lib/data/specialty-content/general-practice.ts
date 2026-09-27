import type { SpecialtyContent } from "./types";

export const generalPractice: SpecialtyContent = {
  key: "general-practice",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A general physician, often called a family doctor or GP, is the doctor most people in India see first. The basic qualification is an MBBS, which with registration on a state medical council or the National Medical Commission's register allows a doctor to practise. Some general physicians go on to a postgraduate degree in family medicine or general medicine; many experienced family doctors practise on an MBBS alone. What they share is breadth: they look at the whole person rather than one organ.",
    "Most everyday illness is settled at this level. A general physician treats fevers and infections, coughs and stomach upsets, aches and injuries that do not need surgery, and keeps long-term conditions such as blood pressure, diabetes and thyroid disease under steady review. They order and read first-line tests, give vaccinations and health checks, and write the certificates that work, school and insurance often ask for.",
    "Just as important is knowing when a problem needs someone else. A good general physician sends you to the right specialist with a clear note and your reports, rather than leaving you to guess which department to book. In India many people go straight to specialists, but a family doctor who knows your history over years can often save you tests, visits and expense, and will notice when something has changed.",
  ],
  conditions: [
    { name: "Fever and common infections", note: "Viral fevers, throat and chest infections, urinary infections and stomach bugs, including seasonal illnesses such as dengue and malaria that need testing." },
    { name: "High blood pressure", note: "Usually found on a routine check and managed with lifestyle changes and medicines, with regular review." },
    { name: "Type 2 diabetes", note: "Diagnosis, starting treatment, and periodic checks of sugar control, kidneys, eyes and feet." },
    { name: "Thyroid disorders", note: "An underactive or overactive thyroid is often picked up and managed in general practice, with referral if it is hard to control." },
    { name: "Coughs, colds and allergies", note: "Most settle with simple care; a cough lasting more than a few weeks needs a closer look, including for tuberculosis." },
    { name: "Stomach and bowel complaints", note: "Acidity, indigestion, diarrhoea and constipation, with referral when there are warning signs such as weight loss or bleeding." },
    { name: "Aches, pains and minor injuries", note: "Back pain, joint pain, sprains and small wounds that do not need a surgeon." },
    { name: "Anaemia and tiredness", note: "Common in India, especially in women; simple blood tests usually find the cause." },
    { name: "Preventive care", note: "Health checks, vaccinations for adults, and advice on weight, smoking and alcohol." },
  ],
  tests: [
    { name: "Blood pressure, pulse and weight", note: "Taken at most visits; changes over time matter more than a single reading." },
    { name: "Complete blood count (CBC)", note: "Looks for anaemia and signs of infection." },
    { name: "Blood sugar and HbA1c", note: "Screens for diabetes and shows average sugar control over the past few months." },
    { name: "Thyroid, kidney and liver function tests", note: "Routine blood tests used both for diagnosis and to monitor long-term treatment." },
    { name: "Lipid profile", note: "Measures cholesterol as part of assessing heart and stroke risk." },
    { name: "Urine tests", note: "Checks for infection, sugar and protein." },
    { name: "Fever tests", note: "Tests for dengue, malaria, typhoid and other infections, chosen according to the season and symptoms." },
    { name: "ECG and chest X-ray", note: "Often available at the clinic or nearby, and useful before a specialist referral." },
  ],
  versus: [
    { key: "internal-medicine", text: "The two overlap. A general physician is usually the first point of contact in the community; an internal medicine physician (MD Medicine) more often takes on complex adult cases and hospital admissions." },
    { key: "paediatrics", text: "Many family doctors see children for common illnesses, but a paediatrician is trained specifically in children's growth, development and vaccination schedules, and is the better choice for newborns and ill infants." },
    { key: "emergency-medicine", text: "A general physician is for illness that can wait for an appointment. Sudden severe symptoms or a serious injury need an emergency department, not a clinic queue." },
  ],
  firstVisit: [
    "Bring any earlier prescriptions, test reports and discharge summaries, and a list of all medicines you take, including over-the-counter and traditional remedies.",
    "Be ready to say when the problem started, how it has changed, and what you have already tried.",
    "Mention long-term conditions, allergies to medicines, and illnesses that run in the family.",
    "Expect a history, an examination including blood pressure, and sometimes a few blood or urine tests. Many problems are treated on the day; some need a follow-up once results are back.",
    "If you want a referral, ask for a short note summarising your history so the specialist does not have to start again.",
  ],
  urgent: [
    "Chest pain or pressure, especially with sweating or breathlessness",
    "Sudden weakness of the face, arm or leg, or difficulty speaking",
    "Severe breathlessness, or a high fever with confusion, a stiff neck or a rash that does not fade",
    "Heavy bleeding, a serious injury, or someone who has collapsed or cannot be woken: call 108",
  ],
  faqs: [
    {
      q: "Should I see a general physician or go straight to a specialist?",
      a: "For a new symptom you cannot place, starting with a general physician is usually quicker and cheaper. They can treat most common problems and will refer you to the right specialist with your history and first tests when it is needed.",
    },
    {
      q: "What qualification does a general physician have?",
      a: "At least an MBBS and registration with a state medical council or the National Medical Commission. Some also hold a postgraduate degree such as MD or DNB in family medicine or general medicine.",
    },
    {
      q: "Can a general physician manage diabetes and blood pressure long term?",
      a: "Yes. Most people with uncomplicated diabetes, high blood pressure or thyroid disease are looked after by a general physician, with a specialist involved if control is difficult or complications appear.",
    },
    {
      q: "Is a family doctor the same as a general physician?",
      a: "In India the terms are used almost interchangeably. Family medicine is also a postgraduate speciality, and a family physician with that training looks after all ages and the family as a whole.",
    },
    {
      q: "How often should I have a health check?",
      a: "It depends on your age, health and family history. A general physician can advise which checks make sense for you and how often, rather than repeating a large package of tests every year.",
    },
  ],
};
