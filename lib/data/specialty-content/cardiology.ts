import type { SpecialtyContent } from "./types";

export const cardiology: SpecialtyContent = {
  key: "cardiology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A cardiologist is a physician who specialises in the heart and blood vessels. In India that means an MBBS, a postgraduate degree in general medicine or paediatrics, and then a further three-year super-speciality degree in cardiology — so most cardiologists have trained for well over a decade before they practise independently. Cardiologists diagnose and treat with medicines, tests and catheter-based procedures; open-heart operations such as bypass surgery and valve replacement are done by cardiothoracic surgeons, often in the same hospital team.",
    "Within cardiology there are narrower interests. Interventional cardiologists do angiography, angioplasty and stenting through a thin tube passed from the wrist or groin. Electrophysiologists treat rhythm problems and fit pacemakers and defibrillators. Others concentrate on heart failure, on imaging, or on heart disease in children — paediatric cardiology is a field of its own.",
    "Most people see a cardiologist on referral from a general physician, after a raised blood pressure reading, an abnormal ECG or a symptom on exertion. A referral is common but not required, and many hospitals in India take direct appointments. Continuity matters in heart disease: a cardiologist you can return to, with your reports kept together, is worth more than a different specialist at each visit.",
  ],
  conditions: [
    { name: "Coronary artery disease", note: "Narrowed arteries supplying the heart muscle; the cause of angina and most heart attacks." },
    { name: "Heart attack (myocardial infarction)", note: "An artery blocks and part of the heart muscle is damaged. Emergency treatment first, then long-term follow-up with a cardiologist." },
    { name: "High blood pressure that is hard to control", note: "Most hypertension is managed by a general physician; a cardiologist sees it when several medicines have not brought it down or the heart is already affected." },
    { name: "Heart failure", note: "The heart does not pump as well as it should, causing breathlessness, tiredness and swollen ankles. Managed with medicines, monitoring and sometimes devices." },
    { name: "Arrhythmias", note: "Heart rhythm problems — atrial fibrillation, fast or slow heartbeats, palpitations. Some need medication, some a procedure or a pacemaker." },
    { name: "Valve disease", note: "Narrowed or leaking heart valves. In India, rheumatic heart disease after childhood throat infections is still a common cause." },
    { name: "Cardiomyopathy", note: "Disease of the heart muscle itself, sometimes inherited; family members may be offered screening." },
    { name: "Congenital heart disease", note: "Heart defects present from birth, seen by paediatric cardiologists in children and by adult congenital specialists later in life." },
    { name: "High cholesterol and cardiovascular risk", note: "Assessing and lowering risk in people with diabetes, a strong family history, or a previous heart event." },
  ],
  tests: [
    { name: "ECG (electrocardiogram)", note: "A few minutes of recording the heart's electrical activity. The first test for chest pain or palpitations." },
    { name: "Echocardiogram (echo)", note: "An ultrasound of the heart showing how well it pumps and how the valves work. Painless, no radiation." },
    { name: "Treadmill test (TMT) or stress test", note: "An ECG recorded while you walk on a treadmill, to see how the heart copes with exertion." },
    { name: "Holter monitor", note: "A small recorder worn for a day or more to catch rhythm problems that come and go." },
    { name: "Blood tests", note: "Cholesterol, sugar and kidney function for risk; troponin when a heart attack is suspected." },
    { name: "CT coronary angiogram", note: "A CT scan with contrast that shows the coronary arteries without a catheter." },
    { name: "Coronary angiography", note: "Contrast dye injected through a thin catheter to see blockages directly; if one is found, angioplasty can often follow in the same sitting." },
    { name: "Angioplasty and stenting", note: "A balloon opens a narrowed artery and a small mesh tube (stent) keeps it open." },
    { name: "Pacemaker and defibrillator implantation", note: "A small device placed under the skin to correct a slow heart rate or treat dangerous rhythms." },
  ],
  versus: [
    { key: "general-practice", text: "Start with a general physician for a first raised blood pressure, a routine check or a vague symptom; they will refer to a cardiologist when the heart needs a closer look." },
    { key: "cardiothoracic-surgery", text: "Cardiologists treat with medicines and catheter procedures. When the answer is an operation — bypass grafting, valve replacement, surgery on the aorta — a cardiothoracic surgeon does it." },
    { key: "pulmonology", text: "Breathlessness can come from the heart or the lungs. A cardiologist looks at the heart; a pulmonologist at the lungs. Often one refers to the other after the first tests." },
  ],
  firstVisit: [
    "Bring every earlier ECG, echo and blood report you have, with dates, and a list of the medicines you take — or the strips themselves.",
    "Note when the symptom happens, how long it lasts, and what brings it on or eases it. Exertion, rest, meals and lying flat all mean different things.",
    "Mention family history: heart attacks or sudden deaths in parents or siblings, particularly at a young age.",
    "Expect a blood-pressure check, an examination and usually an ECG on the day. An echo or treadmill test may be done the same day or booked separately.",
    "Wear something that makes it easy to place ECG leads on the chest; comfortable shoes if a treadmill test is likely.",
  ],
  urgent: [
    "Chest pain or pressure lasting more than a few minutes, especially with sweating, nausea, or pain spreading to the arm, jaw or back",
    "Sudden severe breathlessness, or breathlessness at rest",
    "Fainting, or a very fast or very slow heartbeat with dizziness",
    "Sudden weakness of the face, arm or leg, or difficulty speaking — possible stroke",
  ],
  faqs: [
    {
      q: "Do I need a referral to see a cardiologist in India?",
      a: "No. A referral from a general physician is common and useful, because it arrives with your history and first tests, but most hospitals and clinics take direct appointments with a cardiologist.",
    },
    {
      q: "What is the difference between a cardiologist and a cardiac surgeon?",
      a: "A cardiologist diagnoses and treats heart disease with medicines, tests and catheter-based procedures such as angiography and stenting. A cardiothoracic (cardiac) surgeon performs open operations such as bypass surgery and valve replacement.",
    },
    {
      q: "What qualifications should a cardiologist have?",
      a: "An MBBS, a postgraduate degree (usually MD in general medicine, or in paediatrics for a paediatric cardiologist), and then a super-speciality degree in cardiology — DM Cardiology, or DNB or DrNB Cardiology from the National Board of Examinations. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Is an angiogram the same as an angioplasty?",
      a: "No. An angiogram is a test that shows whether the heart's arteries are narrowed. An angioplasty is a treatment that opens a narrowed artery, usually by placing a stent. They are often done in the same sitting when the angiogram finds a blockage that needs it.",
    },
    {
      q: "Which cardiology tests are usually done first?",
      a: "An ECG and a clinical examination, followed in most cases by an echocardiogram and blood tests. A treadmill test, Holter monitor or CT coronary angiogram is added depending on the symptom.",
    },
  ],
};
