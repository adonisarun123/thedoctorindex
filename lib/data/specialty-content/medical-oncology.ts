import type { SpecialtyContent } from "./types";

export const medicalOncology: SpecialtyContent = {
  key: "medical-oncology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A medical oncologist is a physician who treats cancer with medicines. These include chemotherapy, targeted therapy that acts on particular features of cancer cells, immunotherapy that helps the immune system recognise cancer, and hormone treatment for cancers that depend on hormones. In India the usual route is an MBBS, a postgraduate degree in general medicine (MD or DNB), and then a super-speciality degree in medical oncology (DM, or DrNB).",
    "Medical oncologists often coordinate the overall cancer plan. In most cancer centres, cases are discussed at a tumour board, where medical, surgical and radiation oncologists, radiologists and pathologists agree the treatment and its order together. Medicines may be given before surgery, after it, alongside radiotherapy, or on their own. The medical oncologist also manages side effects, supportive care, and follow-up once treatment ends.",
    "Treatment is usually given in cycles, often as a day-care visit, with blood tests before each cycle to check it is safe to continue. Many people keep working or carry on with much of daily life during treatment, though this varies a great deal. Palliative care, which focuses on comfort and quality of life, can be part of care at any stage and does not mean treatment has stopped.",
  ],
  conditions: [
    { name: "Breast cancer", note: "Treatment may include chemotherapy, hormone treatment or targeted therapy, alongside surgery and radiotherapy." },
    { name: "Lung cancer", note: "Many lung cancers are now tested for particular features that guide the choice of medicines." },
    { name: "Gastrointestinal cancers", note: "Cancers of the bowel, stomach, oesophagus, pancreas and liver, often treated with surgery and medicines together." },
    { name: "Head and neck cancers", note: "Medicines are often given alongside radiotherapy." },
    { name: "Gynaecological and genitourinary cancers", note: "Ovarian, cervical, prostate, kidney and bladder cancers, treated jointly with surgeons and radiation oncologists." },
    { name: "Cancer that has spread or returned", note: "Treatment aims to control the cancer and its symptoms and to keep quality of life as good as possible." },
    { name: "Side effects of treatment", note: "Nausea, infections, tiredness, low blood counts and other effects are managed throughout treatment." },
    { name: "Blood cancers", note: "Leukaemia, lymphoma and myeloma are often treated by haematologists or haemato-oncologists, and by some medical oncologists." },
  ],
  tests: [
    { name: "Biopsy and pathology review", note: "The tissue diagnosis, including special tests on the tumour, guides which medicines are suitable." },
    { name: "Staging scans", note: "CT, MRI or PET-CT show the extent of the cancer before treatment and how it responds during treatment." },
    { name: "Blood tests", note: "Blood counts, kidney and liver function before each cycle, and tumour markers for some cancers." },
    { name: "Tumour board discussion", note: "The multidisciplinary team agrees the plan and the order of treatments." },
    { name: "Chemotherapy and other systemic treatment", note: "Given by drip, injection or tablets, usually in cycles with rest periods between." },
    { name: "Central lines and ports", note: "A small tube or device under the skin can be placed to make repeated drips easier." },
    { name: "Genetic counselling and testing", note: "Offered when a family history or tumour features suggest an inherited risk." },
  ],
  versus: [
    { key: "surgical-oncology", text: "A surgical oncologist removes cancer by operation; a medical oncologist treats it with medicines. The order of the two is agreed at the tumour board." },
    { key: "radiation-oncology", text: "A radiation oncologist treats cancer with radiotherapy. Medicines and radiotherapy are often given together or one after the other, so the two work closely." },
    { key: "haematology", text: "Blood cancers such as leukaemia, lymphoma and myeloma are often treated by haematologists or haemato-oncologists, who also run bone marrow transplant programmes." },
  ],
  firstVisit: [
    "Bring every report: biopsy and pathology reports, scan reports and images, blood tests, operation notes and discharge summaries, with dates.",
    "Bring a list of all the medicines you take, including AYUSH, herbal and over-the-counter products, as some interact with cancer treatment.",
    "Take someone with you and write your questions down: the aim of treatment, how it is given, how long it lasts, likely side effects, and who to call if problems arise.",
    "Ask about the practical side: how often you need to visit, whether treatment is day care, and what to do in an emergency at night or at weekends.",
    "A second opinion on a treatment plan is reasonable and common; take all reports and slides with you.",
  ],
  urgent: [
    "Fever or chills during chemotherapy, which can mean a serious infection when blood counts are low: contact the treating team immediately or go to an emergency department",
    "Breathing difficulty, chest pain, or swelling of the face or throat, especially during or soon after a treatment: call 108",
    "Vomiting or diarrhoea that stops you keeping fluids down, bleeding, or new confusion: seek urgent care",
    "Sudden weakness in the legs or loss of bladder or bowel control: go to an emergency department",
  ],
  faqs: [
    {
      q: "What is the difference between chemotherapy, targeted therapy and immunotherapy?",
      a: "Chemotherapy acts on cells that divide quickly. Targeted therapy acts on particular features found in some cancers. Immunotherapy helps the body's immune system recognise and attack cancer. Which one is suitable depends on the cancer type and tests on the tumour.",
    },
    {
      q: "Will I lose my hair?",
      a: "Some treatments cause hair loss and many do not. Your oncologist can tell you what to expect from the specific plan, and hair usually grows back after treatments that cause it.",
    },
    {
      q: "Can I take herbal or AYUSH medicines during chemotherapy?",
      a: "Tell your oncologist about everything you take before starting. Some products can interact with cancer medicines or affect the liver and blood counts, so do not start anything new without discussing it.",
    },
    {
      q: "What qualifications should a medical oncologist have?",
      a: "An MBBS, a postgraduate degree in medicine (MD or DNB), and a super-speciality degree in medical oncology, usually DM or DrNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "What is palliative care?",
      a: "Care focused on comfort, symptom control and quality of life. It can be given alongside active cancer treatment at any stage, not only at the end of life.",
    },
  ],
};
