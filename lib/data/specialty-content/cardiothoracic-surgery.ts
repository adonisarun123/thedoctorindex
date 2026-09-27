import type { SpecialtyContent } from "./types";

export const cardiothoracicSurgery: SpecialtyContent = {
  key: "cardiothoracic-surgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A cardiothoracic surgeon operates on the heart, lungs, oesophagus and other organs of the chest, and in India often on the major blood vessels as well, which is why the speciality is frequently called cardiothoracic and vascular surgery (CTVS). The usual route is an MBBS, MS General Surgery or DNB, and then a super-speciality degree such as MCh Cardiothoracic and Vascular Surgery or DrNB in the subject. Some institutions offer a longer integrated course after MBBS.",
    "The most familiar operations are coronary artery bypass grafting, valve repair and replacement, and surgery for congenital heart defects in children and adults. Thoracic work includes removing part of a lung for cancer or infection and operations on the chest wall and oesophagus. Vascular work covers aneurysms of the aorta, blocked leg arteries and varicose veins; in some hospitals separate vascular surgeons do this.",
    "Patients almost always come on referral, usually from a cardiologist after an angiogram, or from a pulmonologist or oncologist after a scan and biopsy. The decision to operate is usually made jointly, weighing surgery against catheter-based treatment or medicines. For a planned operation, it is reasonable to ask why surgery is preferred over the alternatives, what recovery involves, and to seek a second opinion.",
  ],
  conditions: [
    { name: "Coronary artery disease needing bypass", note: "Narrowed heart arteries where bypass grafting is judged better than stenting, often when several arteries are involved." },
    { name: "Heart valve disease", note: "Narrowed or leaking valves, including rheumatic valve disease, repaired or replaced surgically." },
    { name: "Congenital heart disease", note: "Heart defects present from birth, operated on in infancy, childhood or later life." },
    { name: "Aortic aneurysm and dissection", note: "Widening or tearing of the body's main artery, which may need planned or emergency surgery." },
    { name: "Lung cancer and lung nodules", note: "Removal of part of a lung, often by keyhole (VATS) surgery, after assessment by a team." },
    { name: "Empyema and chest infections", note: "Pus collecting around the lung that needs drainage or surgery." },
    { name: "Oesophageal disease", note: "Tumours and some benign conditions of the oesophagus, treated by thoracic or GI surgeons depending on the hospital." },
    { name: "Peripheral arterial disease", note: "Blocked arteries in the legs causing pain on walking or non-healing wounds." },
    { name: "Varicose veins", note: "Swollen leg veins causing aching, swelling or skin changes." },
  ],
  tests: [
    { name: "Coronary angiography", note: "Usually done by a cardiologist, showing which heart arteries are blocked and helping decide between stenting and bypass." },
    { name: "Echocardiogram", note: "An ultrasound of the heart to assess the valves and pumping." },
    { name: "CT scan of the chest", note: "Imaging of the lungs, aorta and chest organs, used to plan surgery." },
    { name: "Lung function tests", note: "Show whether the lungs can cope with the removal of part of a lung." },
    { name: "Doppler ultrasound", note: "Scans of the arteries and veins of the legs and neck." },
    { name: "Coronary artery bypass grafting (CABG)", note: "Using a vein or artery from elsewhere in the body to carry blood around a blocked heart artery." },
    { name: "Valve repair or replacement", note: "Mending a damaged valve or replacing it with a mechanical or tissue valve." },
    { name: "VATS (keyhole chest surgery)", note: "Lung and chest operations done through small cuts with a camera." },
  ],
  versus: [
    { key: "cardiology", text: "A cardiologist diagnoses heart disease and treats it with medicines and catheter procedures such as angioplasty and stenting. A cardiothoracic surgeon performs open or keyhole operations such as bypass and valve surgery. Most patients see a cardiologist first." },
    { key: "pulmonology", text: "A pulmonologist diagnoses and treats lung disease without surgery. When part of a lung must be removed, or fluid and infection around the lung need an operation, a thoracic or cardiothoracic surgeon takes over." },
  ],
  firstVisit: [
    "Bring the angiogram CD or link, echo and CT reports and images, and the referring cardiologist's or physician's letter.",
    "Bring a list of all medicines, especially blood thinners, which usually need a plan before surgery.",
    "Mention other health conditions such as diabetes, kidney disease and lung disease, as they affect surgical risk.",
    "Ask what the operation involves, why it is recommended over other options, how long the hospital stay usually is, and what recovery and rehabilitation look like.",
    "A family member attending with you helps, as there is a lot of information to take in.",
  ],
  urgent: [
    "Chest pain or pressure lasting more than a few minutes, especially with sweating or breathlessness: call 108",
    "Sudden, severe tearing pain in the chest or back",
    "Fever, spreading redness or discharge from a chest wound, or breathlessness getting worse, after heart or lung surgery",
    "A cold, pale, painful leg that has come on suddenly",
  ],
  faqs: [
    {
      q: "What is the difference between a cardiologist and a cardiothoracic surgeon?",
      a: "A cardiologist treats heart disease with medicines and catheter procedures such as angioplasty. A cardiothoracic surgeon performs operations on the heart, lungs and chest, such as bypass and valve surgery.",
    },
    {
      q: "Is bypass surgery better than a stent?",
      a: "It depends on how many arteries are blocked, where the blockages are, and other health conditions such as diabetes. The cardiologist and surgeon usually decide together, and the choice is specific to each patient.",
    },
    {
      q: "What qualifications should a cardiothoracic surgeon have?",
      a: "An MBBS followed by a super-speciality degree such as MCh Cardiothoracic and Vascular Surgery or DrNB, usually after MS General Surgery. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Is keyhole surgery possible for the heart and lungs?",
      a: "Many lung operations are now done by keyhole (VATS) surgery, and some heart operations through smaller incisions. Whether it suits you depends on the condition and the surgeon's assessment.",
    },
    {
      q: "What happens after heart surgery?",
      a: "Usually a short stay in intensive care, then a ward stay, followed by gradual recovery at home over weeks, often with cardiac rehabilitation. Long-term follow-up with a cardiologist continues.",
    },
  ],
};
