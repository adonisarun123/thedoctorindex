import type { SpecialtyContent } from "./types";

export const anaesthesiology: SpecialtyContent = {
  key: "anaesthesiology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An anaesthesiologist, also called an anaesthetist, is the doctor responsible for your safety and comfort during an operation or procedure. In India the usual training is an MBBS followed by a postgraduate degree in anaesthesiology (MD or DNB). Some go on to further training in critical care, pain medicine, cardiac, neuro or paediatric anaesthesia.",
    "The work starts before surgery with a pre-anaesthetic check: your health, medicines, allergies, previous anaesthetics and any breathing or heart problems. During the operation the anaesthesiologist gives the anaesthetic, watches breathing, heart rate, blood pressure and oxygen levels continuously, and manages fluids and blood loss. Afterwards they oversee recovery and pain relief. Many anaesthesiologists also work in intensive care units and pain clinics, and they provide epidurals for pain relief in labour.",
    "Patients rarely choose their own anaesthesiologist; the hospital or surgical team assigns one. The pre-anaesthetic consultation is the right time to raise concerns, mention a past problem with anaesthesia, or ask which type of anaesthetic is planned and why.",
  ],
  conditions: [
    { name: "Planned surgery", note: "Assessment of fitness for anaesthesia and a plan for the operation and recovery." },
    { name: "Emergency surgery", note: "Rapid assessment and anaesthesia when an operation cannot wait." },
    { name: "Long-standing medical conditions before surgery", note: "Heart disease, lung disease, diabetes, obesity and sleep apnoea all affect the anaesthetic plan." },
    { name: "A past problem with anaesthesia", note: "A previous reaction, difficult breathing tube placement, or severe sickness after surgery is worth mentioning early." },
    { name: "Labour pain", note: "Epidural pain relief, and anaesthesia for a caesarean section." },
    { name: "Chronic pain", note: "Pain clinics run by anaesthesiologists offer assessment, nerve blocks and other procedures for selected long-standing pain." },
    { name: "Critical illness", note: "Many intensive care units are led or staffed by anaesthesiologists trained in critical care." },
  ],
  tests: [
    { name: "Pre-anaesthetic check-up", note: "A history, examination and review of your reports, usually a few days before planned surgery." },
    { name: "Pre-operative investigations", note: "Blood tests, ECG, chest X-ray or an echo, depending on your age, health and the operation." },
    { name: "General anaesthesia", note: "You are fully asleep, and breathing is supported through a mask or tube while the anaesthesiologist monitors you." },
    { name: "Spinal and epidural anaesthesia", note: "An injection near the spine numbs the lower body while you stay awake or lightly sedated." },
    { name: "Nerve blocks", note: "Local anaesthetic around a nerve numbs an arm, leg or other area, and can help pain relief after surgery." },
    { name: "Sedation", note: "Medicines that make you relaxed and drowsy for shorter procedures such as endoscopy." },
    { name: "Post-operative pain management", note: "A plan for pain relief after the operation, adjusted in the recovery area and on the ward." },
  ],
  versus: [
    { key: "critical-care", text: "Critical care specialists run intensive care units. Many trained first in anaesthesiology; the anaesthesiologist in the operating theatre and the intensivist in the ICU may be the same department but different roles." },
    { key: "physical-medicine-rehabilitation", text: "Both may see people with chronic pain. Anaesthesiologists in pain clinics focus on interventions such as nerve blocks; rehabilitation physicians focus on restoring function through therapy and exercise." },
  ],
  firstVisit: [
    "Bring a full list of your medicines, including blood thinners, diabetes medicines, and any herbal or AYUSH preparations, and ask which to stop or continue before surgery.",
    "Mention allergies, any previous anaesthetic and how it went, loose or capped teeth, snoring or sleep apnoea, and any family history of problems with anaesthesia.",
    "Follow the fasting instructions given by the hospital exactly. Eating or drinking too close to anaesthesia can be dangerous, and surgery may be postponed.",
    "Bring recent reports: blood tests, ECG, echo and any letters from your physician or cardiologist.",
    "Tell the team if you smoke, drink alcohol regularly, or are or might be pregnant.",
  ],
  urgent: [
    "Breathing difficulty, chest pain or confusion after discharge from surgery: call 108",
    "Severe headache, new weakness or numbness in the legs, or loss of bladder control after a spinal or epidural: contact the hospital urgently",
    "Signs of a severe allergic reaction, such as swelling of the face or throat and difficulty breathing: call 108",
  ],
  faqs: [
    {
      q: "Can I choose between general and spinal anaesthesia?",
      a: "Sometimes. The choice depends on the operation, your health and the surgeon's needs. The anaesthesiologist will explain the options at the pre-anaesthetic check, and your preferences are part of that discussion.",
    },
    {
      q: "Why must I fast before surgery?",
      a: "Anaesthesia relaxes the reflexes that stop stomach contents entering the lungs. An empty stomach reduces that risk. The hospital will tell you when to stop food and drinks.",
    },
    {
      q: "Should I stop my regular medicines before an operation?",
      a: "Do not stop anything on your own. Some medicines, such as certain blood thinners and diabetes medicines, may need to be paused or adjusted; others should be continued. The anaesthesiologist and surgeon will advise.",
    },
    {
      q: "What qualifications should an anaesthesiologist have?",
      a: "An MBBS and a postgraduate degree in anaesthesiology, usually MD or DNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Will I wake up during surgery?",
      a: "Being aware during general anaesthesia is uncommon. You are monitored continuously throughout the operation, and you can discuss any worries about this at the pre-anaesthetic check.",
    },
  ],
};
