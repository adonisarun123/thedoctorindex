import type { SpecialtyContent } from "./types";

export const radiationOncology: SpecialtyContent = {
  key: "radiation-oncology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A radiation oncologist is a doctor who treats cancer, and some non-cancerous conditions, with carefully targeted radiation. In India the usual route is an MBBS followed by a postgraduate degree in radiation oncology or radiotherapy (MD or DNB). They work with medical physicists, who check the dose calculations and the machines, and with radiation therapists (technologists), who deliver the daily treatment.",
    "Radiotherapy is planned for each person. A planning CT or MRI scan is taken in the position you will be treated in, the radiation oncologist outlines the tumour and the healthy organs nearby, and the plan is shaped to give the intended dose to the target while limiting it elsewhere. Treatment is usually given as a course of short daily sessions over several weeks, though some courses are much shorter. Brachytherapy, where a radiation source is placed inside or next to the tumour for a short time, is used for some cancers, especially cervical cancer.",
    "Radiotherapy is often one part of a wider plan agreed at a tumour board with surgical and medical oncologists. It may be given instead of surgery, before or after an operation, alongside chemotherapy, or to relieve symptoms such as pain from cancer that has spread to bone. Radiation oncologists also manage the side effects during the course and follow patients up afterwards.",
  ],
  conditions: [
    { name: "Head and neck cancers", note: "Radiotherapy is a main treatment, often with chemotherapy, and needs careful support for eating and mouth care during the course." },
    { name: "Breast cancer", note: "Often given after surgery to lower the chance of the cancer returning in the breast or chest wall." },
    { name: "Cervical and other gynaecological cancers", note: "Commonly treated with external radiotherapy and brachytherapy together." },
    { name: "Lung and oesophageal cancers", note: "Used on its own or with chemotherapy, depending on the stage." },
    { name: "Prostate and other pelvic cancers", note: "Radiotherapy is one of the treatment options discussed alongside surgery." },
    { name: "Brain tumours", note: "Used after surgery or on its own, sometimes with highly focused techniques." },
    { name: "Pain from cancer spread to bone", note: "Short courses of radiotherapy are often used to ease pain and protect bones." },
    { name: "Symptom relief in advanced cancer", note: "Radiotherapy can help with bleeding, blockage or pressure symptoms." },
  ],
  tests: [
    { name: "Planning scan (simulation)", note: "A CT or MRI in the treatment position. Small skin marks or a mask may be made so you are positioned the same way each day." },
    { name: "Treatment planning", note: "The doctor and physicist design the dose; this takes some days before treatment starts." },
    { name: "External beam radiotherapy", note: "Treatment from a machine outside the body, usually a few minutes of beam time per session. It is painless while it is given." },
    { name: "Image-guided and conformal techniques", note: "Methods such as IMRT and IGRT shape the dose closely around the target and check position before treatment." },
    { name: "Brachytherapy", note: "A radiation source placed inside or next to the tumour for a short time, then removed." },
    { name: "Stereotactic radiotherapy", note: "Very precise, high-dose treatment in a few sessions for selected small tumours." },
    { name: "Weekly review during treatment", note: "A check on side effects, weight and blood counts, with support for skin, mouth or bowel symptoms." },
  ],
  versus: [
    { key: "medical-oncology", text: "A medical oncologist treats cancer with medicines; a radiation oncologist with radiotherapy. When the two are combined, they plan the timing together." },
    { key: "surgical-oncology", text: "A surgical oncologist removes the cancer by operation. Radiotherapy may replace surgery for some cancers, or be given before or after it." },
    { key: "nuclear-medicine", text: "Nuclear medicine uses radioactive substances taken into the body, such as radioiodine. Radiation oncology mainly uses external beams and brachytherapy sources placed temporarily." },
  ],
  firstVisit: [
    "Bring biopsy and pathology reports, scan reports and images, operation notes and discharge summaries, with dates.",
    "Tell the doctor if you have had radiotherapy before, have a pacemaker or other implant, have a connective tissue disease, or are or might be pregnant.",
    "Ask how many sessions are planned, how long each visit takes, and what side effects to expect for the area being treated.",
    "Bring a list of all medicines, including AYUSH and herbal products, and ask before using any creams on the treated skin.",
    "Plan transport and time for daily visits over the course; ask the department about scheduling if you travel from far.",
  ],
  urgent: [
    "Fever with chills while also having chemotherapy: contact the treating team or go to an emergency department",
    "Being unable to swallow fluids, or vomiting or diarrhoea that stops you keeping fluids down: seek urgent care",
    "Sudden weakness in the legs, or loss of bladder or bowel control, in someone with cancer: go to an emergency department or call 108",
    "Breathing difficulty or chest pain: call 108",
  ],
  faqs: [
    {
      q: "Does radiotherapy hurt?",
      a: "The treatment itself is painless and you do not feel the beam. Side effects such as skin soreness or tiredness build up gradually over the course and are managed by the team.",
    },
    {
      q: "Will I be radioactive after treatment?",
      a: "External beam radiotherapy does not make you radioactive, and it is safe to be with family, including children. Some forms of brachytherapy or internal treatment have specific precautions, which the team will explain.",
    },
    {
      q: "Why does radiotherapy take several weeks?",
      a: "Splitting the dose into many small daily sessions gives healthy tissue time to recover between them. Some treatments use fewer, larger sessions where that is appropriate.",
    },
    {
      q: "What qualifications should a radiation oncologist have?",
      a: "An MBBS and a postgraduate degree in radiation oncology or radiotherapy, usually MD or DNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Can I miss a session?",
      a: "Try not to. The plan is designed as a complete course, and gaps can affect it. If you are unwell or cannot attend, tell the department so they can advise.",
    },
  ],
};
