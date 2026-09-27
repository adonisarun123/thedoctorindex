import type { SpecialtyContent } from "./types";

export const surgicalOncology: SpecialtyContent = {
  key: "surgical-oncology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A surgical oncologist is a surgeon who specialises in operating on cancer: removing the tumour with a margin of healthy tissue, and where needed the lymph nodes that drain the area. In India the usual route is an MBBS, a postgraduate degree in general surgery (MS or DNB), and then a super-speciality degree in surgical oncology (MCh, or DrNB). Some surgical oncologists focus on one area, such as head and neck, breast, gynaecological or gastrointestinal cancers.",
    "Cancer treatment is rarely planned by one doctor. In most cancer centres the case is discussed at a tumour board, a regular meeting where surgical, medical and radiation oncologists, radiologists and pathologists look at the scans and biopsy together and agree a plan. That plan sets the order of treatment: some people have surgery first, others have chemotherapy or radiotherapy before the operation to shrink the tumour, and some do not need surgery at all.",
    "People usually reach a surgical oncologist after a lump, a scan finding or a biopsy result. The first consultation is about understanding the diagnosis, what further tests are needed to stage the cancer, and whether surgery is part of the plan. It is reasonable to ask whether your case has been or will be discussed at a tumour board, and to take time and a family member to the appointment.",
  ],
  conditions: [
    { name: "Breast cancer", note: "Operations range from removing the lump alone to removing the breast, with lymph node surgery as needed; reconstruction may be discussed." },
    { name: "Head and neck cancers", note: "Cancers of the mouth, tongue, throat and voice box, often treated jointly with radiotherapy and reconstructive surgery." },
    { name: "Gastrointestinal cancers", note: "Cancers of the oesophagus, stomach, bowel, liver and pancreas." },
    { name: "Gynaecological cancers", note: "Cancers of the ovary, uterus and cervix, sometimes operated on by gynaecological oncologists." },
    { name: "Thyroid cancer", note: "Removal of part or all of the thyroid, with follow-up by an endocrinologist and sometimes nuclear medicine." },
    { name: "Soft tissue and bone tumours", note: "Sarcomas and similar tumours, usually treated in centres with a dedicated team." },
    { name: "Skin cancers", note: "Removal of skin cancers that need wider surgery or lymph node assessment." },
    { name: "Suspicious lumps needing a diagnosis", note: "Assessment and biopsy when a lump or scan finding might be cancer." },
  ],
  tests: [
    { name: "Biopsy", note: "A sample of the lump or tissue, taken with a needle or at a small operation, is what confirms a cancer and its type." },
    { name: "Staging scans", note: "CT, MRI or PET-CT show the size of the tumour and whether it has spread, which guides the plan." },
    { name: "Endoscopy", note: "A camera examination of the food pipe, stomach or bowel, often with a biopsy." },
    { name: "Tumour board discussion", note: "The case is reviewed by the multidisciplinary team before treatment begins." },
    { name: "Cancer surgery", note: "Open, laparoscopic (keyhole) or robotic surgery depending on the cancer and the centre." },
    { name: "Lymph node surgery", note: "Removal or sampling of nearby lymph nodes to check for spread and guide further treatment." },
    { name: "Follow-up and surveillance", note: "Regular reviews, examinations and scans after treatment, on a schedule the team sets." },
  ],
  versus: [
    { key: "medical-oncology", text: "A surgical oncologist removes the cancer by operation. A medical oncologist treats it with medicines such as chemotherapy, hormone treatment or immunotherapy. Many patients see both, in an order agreed at the tumour board." },
    { key: "radiation-oncology", text: "Radiation oncologists treat cancer with targeted radiotherapy, sometimes instead of surgery and sometimes before or after it." },
    { key: "general-surgery", text: "General surgeons operate on a wide range of conditions, including some cancers. Surgical oncologists have additional training focused on cancer operations and work within a cancer team." },
  ],
  firstVisit: [
    "Bring every report you have: biopsy reports, scan reports and images, blood tests and any discharge summaries, with dates. If a biopsy was done elsewhere, ask for the slides and blocks as well.",
    "Take a family member or friend if you can. There is a lot of information at a first cancer consultation, and it helps to have someone else listening and taking notes.",
    "Write down your questions beforehand: what stage the cancer is, what the treatment options are, what order they come in, and what recovery from surgery involves.",
    "Mention other health conditions and all the medicines you take, including blood thinners and any AYUSH or herbal treatments.",
    "It is reasonable to seek a second opinion before a major operation, and most doctors expect that some patients will.",
  ],
  urgent: [
    "Heavy bleeding, fever with chills, or severe pain after cancer surgery: contact the hospital or call 108",
    "Sudden breathlessness, chest pain or a painful swollen leg after surgery, which can be signs of a clot: call 108",
    "Vomiting that will not stop or a swollen, painful abdomen after abdominal surgery: go to an emergency department",
  ],
  faqs: [
    {
      q: "Will I need chemotherapy or radiotherapy as well as surgery?",
      a: "It depends on the type and stage of cancer. Some people need surgery alone, others a combination. The plan is usually agreed at a tumour board, and your surgeon or oncologist will explain what is advised for you and why.",
    },
    {
      q: "Does a biopsy make cancer spread?",
      a: "Biopsies are planned so that the tissue can be examined safely, and the information they give is needed to choose the right treatment. If you are worried, ask the surgeon how the biopsy will be done.",
    },
    {
      q: "What qualifications should a surgical oncologist have?",
      a: "An MBBS, a postgraduate degree in general surgery (MS or DNB), and a super-speciality degree in surgical oncology, usually MCh or DrNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "What is a tumour board?",
      a: "A regular meeting where surgeons, medical and radiation oncologists, radiologists and pathologists review a patient's case together and agree a treatment plan, so the decision does not rest on one speciality alone.",
    },
    {
      q: "Should I get a second opinion before cancer surgery?",
      a: "A second opinion is common and reasonable before a major operation, particularly when the plan is complex. Take all your reports, images and biopsy slides so the second team can review the same information.",
    },
  ],
};
