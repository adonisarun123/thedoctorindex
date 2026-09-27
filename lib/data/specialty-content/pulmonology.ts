import type { SpecialtyContent } from "./types";

export const pulmonology: SpecialtyContent = {
  key: "pulmonology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A pulmonologist, often called a chest physician in India, is a doctor who specialises in the lungs and airways. The usual route is an MBBS followed by a postgraduate degree in respiratory medicine (earlier called tuberculosis and respiratory diseases), as MD or DNB. Some go on to super-speciality training, such as DM Pulmonary Medicine or pulmonary critical care, or to interests in sleep medicine or interventional procedures.",
    "Pulmonologists treat with medicines, inhalers, oxygen, breathing programmes and procedures such as bronchoscopy. They do not usually operate; lung surgery is done by thoracic or cardiothoracic surgeons. Many pulmonologists also work in intensive care, looking after patients on ventilators.",
    "Tuberculosis remains an important part of chest medicine in India, and TB diagnosis and treatment is available free through the government's national TB programme; a pulmonologist can help you enter it. Air pollution, smoking, biomass cooking fuel and dusty workplaces all affect lung health, so a pulmonologist will ask about home and work as well as symptoms. Asthma and COPD are long-term conditions where regular review and correct inhaler technique make a real difference.",
  ],
  conditions: [
    { name: "Asthma", note: "Narrowing of the airways causing wheeze, cough and breathlessness that come and go; usually well controlled with inhalers." },
    { name: "COPD", note: "Long-term lung damage, usually from smoking or smoke exposure, causing breathlessness and cough that worsen over time." },
    { name: "Tuberculosis", note: "A bacterial infection, most often of the lungs, cured with a full course of treatment taken without breaks." },
    { name: "Pneumonia and chest infections", note: "Infection of the lungs, sometimes needing hospital care, especially in older adults." },
    { name: "Interstitial lung disease", note: "Scarring or inflammation of the lung tissue causing a dry cough and gradually increasing breathlessness." },
    { name: "Sleep apnoea", note: "Breathing pauses during sleep, with loud snoring and daytime sleepiness." },
    { name: "Bronchiectasis", note: "Widened, damaged airways that collect mucus and lead to repeated infections." },
    { name: "Lung nodules and suspected lung cancer", note: "Spots found on a scan that need assessment and sometimes a biopsy." },
    { name: "Pleural effusion", note: "Fluid around the lungs, which has many causes including TB, infection, heart failure and cancer." },
  ],
  tests: [
    { name: "Chest X-ray", note: "The first imaging test for most lung symptoms." },
    { name: "Spirometry and lung function tests", note: "Breathing into a machine to measure how well the lungs move air; used to diagnose asthma and COPD." },
    { name: "Sputum tests", note: "Samples of phlegm tested for TB and other infections, including rapid molecular tests." },
    { name: "Pulse oximetry and blood gases", note: "Measure how much oxygen is in the blood." },
    { name: "CT scan of the chest", note: "Detailed images of the lungs, used for nodules, scarring and unexplained symptoms." },
    { name: "Bronchoscopy", note: "A thin flexible tube passed into the airways under sedation to look inside and take samples." },
    { name: "Sleep study", note: "Monitoring breathing and oxygen overnight, at home or in a sleep lab, to diagnose sleep apnoea." },
    { name: "Pleural tap", note: "Drawing fluid from around the lung with a needle to find its cause and ease breathlessness." },
  ],
  versus: [
    { key: "cardiology", text: "Breathlessness and chest discomfort can come from the heart or the lungs. A cardiologist examines the heart and a pulmonologist the lungs; after the first tests, one often refers to the other." },
    { key: "ent", text: "Snoring and nasal blockage may be an ENT problem in the nose and throat. When snoring comes with daytime sleepiness or pauses in breathing, a pulmonologist or sleep specialist assesses for sleep apnoea." },
    { key: "cardiothoracic-surgery", text: "Pulmonologists diagnose and treat lung disease without operating. When part of a lung needs removing, for example for cancer, a thoracic or cardiothoracic surgeon operates." },
  ],
  firstVisit: [
    "Bring all chest X-rays and CT scans, with the images if possible, and earlier lung function and sputum reports.",
    "Bring your inhalers with you; the doctor may watch how you use them, as technique matters a great deal.",
    "Be ready to talk about smoking, cooking fuel at home, pets, and dust or chemicals at work, now and in the past.",
    "Note how far you can walk or how many stairs you can climb before stopping, and whether symptoms are worse at night or in certain seasons.",
    "Expect a chest examination and oxygen check; spirometry is often done on the day, so avoid a heavy meal just before.",
  ],
  urgent: [
    "Severe breathlessness, or being unable to speak in full sentences: call 108",
    "Blue or grey lips or face, or confusion with breathing difficulty",
    "Coughing up more than a small streak of blood",
    "An asthma attack that is not easing with the usual reliever inhaler",
  ],
  faqs: [
    {
      q: "Is a chest physician the same as a pulmonologist?",
      a: "Yes. In India the terms are used interchangeably for a doctor who specialises in lung and breathing conditions.",
    },
    {
      q: "When should a cough be checked by a specialist?",
      a: "A cough lasting more than three weeks should be checked, especially with fever, weight loss, night sweats or blood in the phlegm, which can point to TB or another serious cause.",
    },
    {
      q: "Is tuberculosis curable?",
      a: "Yes, in most cases, with a complete course of treatment taken regularly. Stopping early can lead to drug-resistant TB. Treatment is available free through the government's national TB programme.",
    },
    {
      q: "What qualifications should a pulmonologist have?",
      a: "An MBBS followed by a postgraduate degree in respiratory or pulmonary medicine, usually MD or DNB. Some also hold a super-speciality degree such as DM in pulmonary medicine or critical care. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "What is a lung function test?",
      a: "A simple test where you breathe hard into a machine that measures how much air your lungs hold and how fast you can blow it out. It helps diagnose asthma and COPD and track them over time.",
    },
  ],
};
