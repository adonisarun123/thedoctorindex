import type { SpecialtyContent } from "./types";

export const criticalCare: SpecialtyContent = {
  key: "critical-care",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An intensivist is a doctor who specialises in caring for critically ill patients in the intensive care unit (ICU). Patients in the ICU may need a machine to help them breathe, medicines to support their blood pressure, dialysis for failing kidneys, or close monitoring after major surgery. In India intensivists usually come to critical care after a postgraduate degree in medicine, anaesthesiology, respiratory medicine or emergency medicine, followed by super-speciality or fellowship training in critical care, for example a DM or DrNB in critical care medicine.",
    "Intensive care is team work. The intensivist leads a team of ICU doctors, specialist nurses, physiotherapists and others, and works with the specialists whose patient it is, such as the surgeon or cardiologist. Patients are usually monitored around the clock, with a nurse caring for only one or two patients at a time. Many units hold a daily round where the plan for each patient is reviewed.",
    "Nobody books an intensivist. Patients reach the ICU from the emergency department, the operating theatre or a hospital ward. For families, the intensivist is often the person who explains what is happening, what the treatment is trying to achieve, and what decisions may lie ahead. Those conversations can be hard, and it is reasonable to ask for them to be repeated, slowed down or held with other family members present.",
  ],
  conditions: [
    { name: "Respiratory failure", note: "When the lungs cannot supply enough oxygen, from severe pneumonia, asthma, lung disease or other causes; may need a ventilator." },
    { name: "Sepsis and septic shock", note: "A severe body-wide reaction to infection that can cause low blood pressure and organ failure." },
    { name: "Shock", note: "Blood pressure too low to supply the organs, from infection, bleeding, heart problems or severe allergy." },
    { name: "Multiple organ failure", note: "When several organs, such as the kidneys, liver and lungs, are failing at once." },
    { name: "Care after major surgery", note: "Close monitoring and support after heart, brain, transplant or other major operations." },
    { name: "Severe injuries", note: "Head injuries and multiple injuries after road accidents or falls." },
    { name: "Severe poisoning", note: "Poisoning with pesticides, medicines or other substances that affects breathing or circulation." },
    { name: "Severe complications of common illnesses", note: "Such as severe dengue, malaria, diabetic emergencies or kidney failure." },
    { name: "Coma and prolonged fits", note: "Including after stroke, brain infection or cardiac arrest." },
  ],
  tests: [
    { name: "Continuous monitoring", note: "Heart rhythm, blood pressure, oxygen level and breathing watched constantly on bedside screens." },
    { name: "Mechanical ventilation", note: "A machine that breathes for or with the patient, through a tube in the windpipe or a tight-fitting mask." },
    { name: "Central lines and arterial lines", note: "Thin tubes in large veins or an artery to give medicines and measure pressure accurately." },
    { name: "Blood gas tests", note: "Frequent blood samples to check oxygen, carbon dioxide and acid levels." },
    { name: "Dialysis in the ICU", note: "Continuous or intermittent support when the kidneys fail." },
    { name: "Bedside ultrasound and X-rays", note: "Imaging done in the ICU without moving the patient." },
    { name: "Tracheostomy", note: "A small opening in the front of the neck for a breathing tube, used when ventilation is needed for longer." },
    { name: "Nutrition support", note: "Feeding through a tube in the nose or stomach, or by vein, when a patient cannot eat." },
  ],
  versus: [
    { key: "emergency-medicine", text: "Emergency physicians receive and stabilise patients when they first arrive. Intensivists take over when a patient needs ongoing organ support in the ICU." },
    { key: "anaesthesiology", text: "Anaesthesiologists keep patients safe during operations. Many intensivists trained first in anaesthesiology, but critical care is a separate speciality focused on the ICU." },
    { key: "pulmonology", text: "Pulmonologists treat lung disease in outpatients and wards. When lung failure needs a ventilator, the intensivist leads that care, often together with a pulmonologist." },
  ],
  firstVisit: [
    "Share an up-to-date list of the patient's medicines, allergies, long-term illnesses and recent reports with the ICU team as early as possible.",
    "Agree on one or two family members who will be the main contact and receive updates, and give the team reliable phone numbers.",
    "Ask when the daily family update usually happens and who gives it. Write down questions in advance and ask what the goals of treatment are.",
    "If the patient has ever said what treatment they would or would not want if seriously ill, tell the team. Hard decisions are easier when the patient's own wishes are known.",
    "Follow the unit's visiting and hand-washing rules; they protect very vulnerable patients from infection. Ask the staff how you can help, such as talking to the patient even if they cannot respond.",
  ],
  urgent: [
    "Severe difficulty breathing, choking, or lips turning blue",
    "Collapse, unconsciousness or a fit that does not stop",
    "Chest pain, or sudden weakness of the face, arm or leg",
    "A serious injury, heavy bleeding or a suspected poisoning: call 108",
  ],
  faqs: [
    {
      q: "Can I book an appointment with an intensivist?",
      a: "No. Intensivists care for patients already admitted to hospital. Patients reach the ICU through the emergency department, the operating theatre or a ward.",
    },
    {
      q: "Why are visiting hours limited in the ICU?",
      a: "ICU patients are very ill and at high risk of infection, and staff need space to work quickly. Most units allow family visits at set times and will usually make exceptions when a patient is very unwell.",
    },
    {
      q: "Does being on a ventilator mean the patient will not recover?",
      a: "No. A ventilator supports breathing while the underlying illness is treated. Many patients recover and come off the ventilator; the outlook depends on the illness and the person's overall health.",
    },
    {
      q: "Who should I ask about my relative's condition?",
      a: "Ask the ICU team when the doctor usually speaks with families. It helps to have one family member as the main contact, so information is passed on consistently.",
    },
    {
      q: "What qualifications does an intensivist have?",
      a: "Usually an MBBS, a postgraduate degree in medicine, anaesthesiology, respiratory medicine or emergency medicine, and then super-speciality or fellowship training in critical care. Registration should be on the NMC's register or a state medical council register.",
    },
  ],
};
