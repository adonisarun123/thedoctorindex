import type { SpecialtyContent } from "./types";

export const transplantSurgery: SpecialtyContent = {
  key: "transplant-surgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Organ transplantation replaces a failed organ with a healthy one from a donor. It is carried out by teams rather than a single doctor: transplant surgeons, who perform the operation, work with physicians such as nephrologists, hepatologists, cardiologists and pulmonologists, who assess patients beforehand and manage their care afterwards, along with anaesthetists, intensive care doctors, transplant coordinators and counsellors. Transplant surgeons usually come from urology, GI surgery, cardiothoracic surgery or general surgery, with further training in transplantation.",
    "The organs most often transplanted in India are the kidney and the liver, and some centres also transplant the heart, lungs, pancreas and other organs. Organs may come from a living donor, often a close relative, or from a deceased donor after brain death. Both routes are regulated under the Transplantation of Human Organs and Tissues Act, which sets out who may donate, and living donation requires approval from an authorisation committee before surgery can go ahead.",
    "Transplantation is a lifelong commitment. Recipients take medicines every day to stop the body rejecting the new organ, and need regular blood tests and clinic visits for life. Living donors are also assessed carefully beforehand and followed up afterwards. A transplant is not the right option for everyone, and the team's assessment of whether it is safe and likely to help is an important part of the process.",
  ],
  conditions: [
    { name: "Kidney failure", note: "End-stage kidney disease, where a transplant can be an alternative to long-term dialysis." },
    { name: "Liver failure and advanced cirrhosis", note: "Chronic liver disease that has progressed despite treatment, or sudden liver failure." },
    { name: "Liver cancer in selected patients", note: "Some liver tumours, in carefully chosen patients, may be treated with a transplant." },
    { name: "Advanced heart failure", note: "Severe heart failure not controlled by medicines or devices, assessed at heart transplant centres." },
    { name: "End-stage lung disease", note: "Advanced lung conditions where a lung transplant may be considered at specialised centres." },
    { name: "Diabetes with kidney failure", note: "In selected patients, a combined kidney and pancreas transplant may be considered." },
    { name: "Living donor assessment", note: "Careful checks of a person offering to donate a kidney or part of their liver, to make sure it is safe for them." },
    { name: "Long-term care after transplant", note: "Monitoring the new organ, adjusting medicines, and watching for rejection and infection." },
  ],
  tests: [
    { name: "Transplant evaluation", note: "A series of tests and consultations to check whether a transplant is safe and suitable." },
    { name: "Blood group and tissue typing", note: "Tests that check how well a donor and recipient are matched." },
    { name: "Crossmatch", note: "A test mixing donor and recipient blood samples to look for antibodies that could cause rejection." },
    { name: "Imaging", note: "Scans of the organs and blood vessels of both donor and recipient to plan surgery." },
    { name: "Heart, lung and infection screening", note: "Checks that the recipient can safely undergo major surgery and will tolerate the medicines afterwards." },
    { name: "Transplant surgery", note: "The operation to place the donor organ and, for living donors, to remove the donated kidney or part of the liver." },
    { name: "Drug level monitoring", note: "Regular blood tests to keep anti-rejection medicines at the right level." },
    { name: "Transplant biopsy", note: "A small sample of the transplanted organ, taken if rejection is suspected." },
  ],
  versus: [
    { key: "nephrology", text: "Nephrologists manage kidney disease and dialysis, decide with the patient whether a kidney transplant is suitable, and lead long-term care afterwards. The transplant surgeon performs the operation. For most kidney transplant patients the nephrologist is the doctor they see most often." },
    { key: "gastroenterology", text: "Gastroenterologists and hepatologists treat liver disease and identify when a transplant is needed. The liver transplant surgeon performs the operation, and care afterwards is shared between both." },
  ],
  firstVisit: [
    "Bring all reports relating to the failing organ: blood tests, scans, biopsy results and discharge summaries, with dates.",
    "Bring a family member; transplant decisions involve the family, especially where a relative is considering donation.",
    "Bring a full list of medicines and details of dialysis if you are on it.",
    "Expect the first visit to be one of several. Evaluation usually includes many tests, other specialists, and meetings with a transplant coordinator.",
    "Ask about the legal and documentation requirements for your situation, as living and deceased donation each follow a defined process.",
  ],
  urgent: [
    "Fever, chills or feeling generally very unwell after a transplant: contact the transplant team at once",
    "Pain or swelling over the transplanted organ, passing much less urine, or new yellowing of the eyes",
    "Vomiting or diarrhoea that stops you taking anti-rejection medicines",
    "Severe breathlessness, chest pain, confusion or collapse: call 108",
  ],
  faqs: [
    {
      q: "Who can be a living organ donor in India?",
      a: "Living donation is regulated under the Transplantation of Human Organs and Tissues Act, which sets out who may donate. Donation usually involves close relatives, and every living donation needs approval from an authorisation committee. The transplant team will explain the process for your situation.",
    },
    {
      q: "What is the difference between living and deceased donation?",
      a: "In living donation, a healthy person donates a kidney or part of the liver. In deceased donation, organs come from a person who has died, usually after brain death, with the family's consent. Both are regulated by law.",
    },
    {
      q: "Is a transplant a cure?",
      a: "It can greatly improve health and quality of life, but it is a treatment rather than a cure. Recipients take anti-rejection medicines for life and need regular follow-up.",
    },
    {
      q: "Is it safe to donate a kidney?",
      a: "Donors are assessed carefully beforehand to make sure donation is as safe as possible for them, and are followed up afterwards. Any major surgery carries some risk, which the team will explain in detail.",
    },
    {
      q: "Which doctors are part of a transplant team?",
      a: "Transplant surgeons, physicians such as nephrologists or hepatologists, anaesthetists, intensive care doctors, transplant coordinators and counsellors, among others.",
    },
  ],
};
