import type { SpecialtyContent } from "./types";

export const infectiousDiseases: SpecialtyContent = {
  key: "infectious-diseases",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An infectious disease specialist is a physician who concentrates on infections caused by bacteria, viruses, fungi and parasites. In India the usual route is an MBBS, a postgraduate degree in general medicine or a related field, and then super-speciality or fellowship training in infectious diseases, for example a DM or DrNB in the subject. It is a relatively young speciality in India, and most infections are still treated well by general physicians and internal medicine specialists.",
    "The specialist is usually called in when an infection is severe, unusual, keeps coming back, or does not respond to standard treatment. Typical examples are a fever that has lasted weeks without a diagnosis, tuberculosis that is complicated or drug-resistant, long-term care of HIV or viral hepatitis, and infections in people whose immunity is weakened by cancer treatment, transplant or other medicines.",
    "Much of the work happens behind the scenes in hospitals. Infectious disease specialists advise other doctors on which antibiotic to use and for how long, help run infection control, and try to limit the spread of antibiotic resistance, which is a serious problem in India. For patients, this often means fewer, better-chosen antibiotics rather than more.",
  ],
  conditions: [
    { name: "Prolonged fever without a cause", note: "Fever lasting weeks, investigated systematically for hidden infection and for non-infectious causes." },
    { name: "Tuberculosis", note: "Including TB outside the lungs, TB that is resistant to standard medicines, and TB alongside other illnesses." },
    { name: "HIV", note: "Long-term treatment and monitoring; with regular care, people with HIV can live long and healthy lives." },
    { name: "Viral hepatitis", note: "Hepatitis B and C, often managed together with a gastroenterologist or hepatologist." },
    { name: "Drug-resistant infections", note: "Infections that have not responded to the usual antibiotics and need careful choice of treatment." },
    { name: "Infections after surgery or in hospital", note: "Wound, bone, joint, implant and bloodstream infections." },
    { name: "Infections in weakened immunity", note: "In people having cancer treatment, after a transplant, or on medicines that suppress the immune system." },
    { name: "Tropical and seasonal infections", note: "Severe or complicated dengue, malaria, typhoid, scrub typhus, leptospirosis and similar illnesses." },
    { name: "Travel health", note: "Advice and vaccines before travel, and assessment of illness after returning." },
  ],
  tests: [
    { name: "Blood and urine cultures", note: "Grow bacteria from samples to identify the infection and which antibiotics will work." },
    { name: "Blood tests for specific infections", note: "Tests for dengue, malaria, typhoid, scrub typhus, HIV, hepatitis and others, chosen by symptoms." },
    { name: "TB tests", note: "Sputum tests, including rapid molecular tests that can also detect drug resistance, and sometimes tissue samples." },
    { name: "Viral load and CD4 count", note: "Used to monitor HIV and hepatitis treatment." },
    { name: "Imaging", note: "X-ray, ultrasound, CT or other scans to find where a hidden infection is." },
    { name: "Biopsy or fluid sampling", note: "A small sample of tissue or fluid from a joint, the chest or the spine to identify an infection directly." },
  ],
  versus: [
    { key: "internal-medicine", text: "Internal medicine physicians treat most infections, including most fevers that need admission. An infectious disease specialist is brought in when the infection is unusual, severe, recurrent or resistant to treatment." },
    { key: "pulmonology", text: "Tuberculosis of the lungs is often managed by pulmonologists and physicians. An infectious disease specialist is more often involved when TB is drug-resistant, outside the lungs, or combined with HIV or other conditions." },
    { key: "gastroenterology", text: "Hepatitis B and C may be managed by either specialist; liver damage and its complications usually involve a gastroenterologist or hepatologist." },
  ],
  firstVisit: [
    "Bring all earlier reports in date order, especially culture results, scans and any biopsy reports.",
    "List every antibiotic and other medicine you have taken for this illness, with dates if possible. Packets or prescriptions help.",
    "Keep a record of your temperature readings, with times, if fever is the problem.",
    "Mention recent travel, contact with animals, occupation, and anyone around you with a similar illness.",
    "Expect a detailed history and examination; further tests are common before a diagnosis is made.",
  ],
  urgent: [
    "Fever with confusion, drowsiness, a stiff neck or a fit",
    "Fever with bleeding from the gums or nose, a rash that does not fade, or severe abdominal pain",
    "Fever with fast breathing, cold hands and feet, or very little urine",
    "Anyone who is very unwell with a fever and difficult to wake: call 108",
  ],
  faqs: [
    {
      q: "When should a fever be seen by an infectious disease specialist?",
      a: "Most fevers are handled well by a general physician. A specialist is worth seeing when a fever has lasted weeks without a diagnosis, keeps returning, or has not responded to treatment.",
    },
    {
      q: "Why won't the doctor just give me a stronger antibiotic?",
      a: "Many fevers are viral, and antibiotics do not help them. Using broad antibiotics without a clear reason adds side effects and drives resistance. A specialist tries to find the cause first so treatment can be targeted.",
    },
    {
      q: "Is HIV treatment lifelong?",
      a: "Yes, HIV treatment is usually taken for life. With regular treatment and monitoring, most people with HIV stay well.",
    },
    {
      q: "What qualifications should an infectious disease specialist have?",
      a: "Usually an MBBS, a postgraduate degree in medicine, and super-speciality or fellowship training in infectious diseases, for example a DM or DrNB. Registration should be on the NMC's register or a state medical council register.",
    },
    {
      q: "Can I stop TB medicines when I feel better?",
      a: "No. TB treatment must be completed as prescribed, even after symptoms improve. Stopping early can bring the illness back and make it resistant to treatment.",
    },
  ],
};
