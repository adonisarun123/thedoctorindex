import type { SpecialtyContent } from "./types";

export const emergencyMedicine: SpecialtyContent = {
  key: "emergency-medicine",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Emergency physicians work in hospital emergency departments, sometimes still called casualty. They see anyone who arrives acutely unwell or injured, of any age and with any problem, and their job is to recognise what is dangerous, stabilise it and decide what happens next. In India emergency medicine is a recognised postgraduate speciality, usually an MD or DNB in emergency medicine after an MBBS, though many emergency departments are also staffed by doctors from other backgrounds.",
    "Emergency care works by priority, not by arrival time. On arrival a nurse or doctor quickly assesses how sick each person is, a process called triage, and those in greatest danger are seen first. Someone with a sprained ankle may wait while a person with chest pain or breathing difficulty goes straight in. This can feel unfair in a busy department, but it is how lives are saved.",
    "An emergency physician does not replace the specialists. After initial treatment they decide whether you can go home, need a period of observation, should be admitted under a particular team, need an operation, or need intensive care. Emergency physicians are not booked by appointment. If you think someone is having an emergency, call 108 or go to the nearest emergency department; this listing is to show who works where, not whom to call.",
  ],
  conditions: [
    { name: "Chest pain", note: "Assessed quickly for heart attack and other serious causes." },
    { name: "Stroke symptoms", note: "Sudden weakness, facial droop or difficulty speaking; some treatments work only within hours, so speed matters." },
    { name: "Breathing difficulty", note: "Severe asthma, lung infections, heart failure and allergic reactions." },
    { name: "Serious injuries", note: "Road accidents, falls, burns, cuts and suspected fractures." },
    { name: "Poisoning and bites", note: "Swallowed medicines or chemicals, pesticide exposure, and snake or animal bites." },
    { name: "Severe infections and sepsis", note: "High fever with low blood pressure, confusion or signs that organs are struggling." },
    { name: "Fits, collapse and unconsciousness", note: "Anyone who has had a seizure, fainted or cannot be woken." },
    { name: "Severe abdominal pain", note: "Including possible appendicitis, bowel obstruction, bleeding and pregnancy-related emergencies." },
    { name: "Acute problems in children", note: "Children with breathing difficulty, dehydration, high fever with drowsiness, or injuries." },
  ],
  tests: [
    { name: "Triage assessment", note: "A quick check of breathing, pulse, blood pressure, oxygen level and consciousness to decide priority." },
    { name: "ECG", note: "Done within minutes for chest pain and many other symptoms." },
    { name: "Point-of-care blood tests", note: "Rapid sugar, blood gas and other tests that give results at the bedside." },
    { name: "Bedside ultrasound", note: "A quick scan done in the department to look for internal bleeding, fluid around the heart or other urgent problems." },
    { name: "X-ray and CT scan", note: "For injuries, suspected stroke and other serious conditions." },
    { name: "Resuscitation", note: "Support for breathing and circulation, including oxygen, fluids, medicines and, if needed, a breathing tube." },
    { name: "Wound care and splinting", note: "Stitching cuts, cleaning wounds and supporting suspected fractures before specialist care." },
  ],
  versus: [
    { key: "general-practice", text: "A general physician is for illness that can wait for an appointment. An emergency department is for sudden, severe or life-threatening problems, at any hour." },
    { key: "critical-care", text: "Emergency physicians receive and stabilise patients at the front door. Intensivists take over when a patient needs prolonged support in the ICU, such as a ventilator or support for failing organs." },
    { key: "general-surgery", text: "An emergency physician assesses and stabilises abdominal pain and injuries. When an operation is needed, a surgeon takes over." },
  ],
  firstVisit: [
    "If possible, bring the person's current medicines or a photo of their prescriptions, and any recent reports or discharge summaries.",
    "Tell staff straight away about allergies, long-term conditions such as diabetes, heart or kidney disease, pregnancy, and any blood thinners.",
    "Say clearly what happened, when symptoms started, and what has changed. For stroke symptoms, the time the person was last seen well is especially important.",
    "In poisoning, bring the container, packet or a photo of it. For a bite, a description or photo of the animal helps, but do not try to catch it.",
    "Carry identification and a phone number for a family member. Expect to wait if others are sicker; tell staff at once if the person gets worse.",
  ],
  urgent: [
    "Chest pain or pressure, especially with sweating, breathlessness or pain spreading to the arm or jaw",
    "Sudden weakness of the face, arm or leg, difficulty speaking, or sudden confusion",
    "Severe difficulty breathing, choking, or lips turning blue",
    "Unconsciousness, a fit, heavy bleeding, a serious injury, or a suspected poisoning or snake bite: call 108",
  ],
  faqs: [
    {
      q: "Should I call 108 or drive to the hospital myself?",
      a: "For chest pain, stroke symptoms, severe breathlessness, serious injury or unconsciousness, calling 108 is usually safer, because treatment can begin on the way. For less severe problems, going to the nearest emergency department yourself is reasonable.",
    },
    {
      q: "Why was someone who arrived after me seen first?",
      a: "Emergency departments see patients by how urgent their condition is, not by the order they arrive. Someone who looks well may be seen after someone in greater danger.",
    },
    {
      q: "Is casualty the same as an emergency department?",
      a: "Yes. Casualty is the older name still used in many Indian hospitals. Larger hospitals increasingly have a dedicated emergency department staffed by doctors trained in emergency medicine.",
    },
    {
      q: "Can I book an appointment with an emergency physician?",
      a: "No. Emergency physicians see people as they arrive in the emergency department. For a problem that can wait, book a general physician or the relevant specialist.",
    },
    {
      q: "What happens after the emergency department?",
      a: "You may be sent home with advice and follow-up, kept for observation, admitted under a specialist team, taken for surgery, or moved to intensive care, depending on what is found.",
    },
  ],
};
