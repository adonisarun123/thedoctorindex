import type { SpecialtyContent } from "./types";

export const haematology: SpecialtyContent = {
  key: "haematology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A haematologist specialises in diseases of the blood and bone marrow: the red cells that carry oxygen, the white cells that fight infection, the platelets and clotting proteins that stop bleeding, and the marrow that makes them. Clinical haematologists in India usually have an MBBS, a postgraduate degree in medicine or paediatrics (MD or DNB), and a super-speciality degree in clinical haematology (DM or DrNB). Pathologists also work in laboratory haematology, reporting blood counts and marrow samples.",
    "The field covers both non-cancerous and cancerous conditions. On one side are anaemias, inherited conditions such as thalassaemia and sickle cell disease, bleeding disorders such as haemophilia, and problems with clotting. On the other are blood cancers: leukaemia, lymphoma and myeloma. Some haematologists focus on these cancers and describe themselves as haemato-oncologists, and larger centres run bone marrow transplant programmes.",
    "People usually reach a haematologist after an abnormal blood test, often picked up routinely, or through a physician, paediatrician or obstetrician. Many blood conditions are long-term, so continuity matters: keeping blood count reports together, with dates, lets the haematologist see the trend rather than a single number.",
  ],
  conditions: [
    { name: "Anaemia", note: "Low haemoglobin from many causes. Iron deficiency is common, but anaemia that does not respond or has no clear cause needs further assessment." },
    { name: "Thalassaemia", note: "An inherited condition affecting haemoglobin. Carrier testing before or during pregnancy matters for families." },
    { name: "Sickle cell disease", note: "An inherited condition that causes pain episodes and anaemia, needing long-term care." },
    { name: "Bleeding disorders", note: "Haemophilia and similar conditions, and low platelet counts, which cause easy bruising or prolonged bleeding." },
    { name: "Blood clots", note: "Clots in the legs or lungs, especially when they recur or occur at a young age." },
    { name: "Abnormal blood counts", note: "Unexplained high or low white cells, platelets or red cells found on a routine test." },
    { name: "Leukaemia", note: "Cancers of the blood-forming cells, treated by haematologists or haemato-oncologists." },
    { name: "Lymphoma and myeloma", note: "Cancers of lymphocytes and plasma cells, often causing swollen glands, bone pain or abnormal blood tests." },
  ],
  tests: [
    { name: "Complete blood count and smear", note: "The basic test of red cells, white cells and platelets, with a look at the cells under the microscope." },
    { name: "Iron studies, B12 and folate", note: "Help find the cause of anaemia." },
    { name: "Haemoglobin electrophoresis or HPLC", note: "Identifies thalassaemia and sickle cell traits." },
    { name: "Clotting tests", note: "Check how well blood clots, for bleeding problems or before procedures." },
    { name: "Bone marrow aspiration and biopsy", note: "A sample of marrow, usually from the back of the hip bone under local anaesthetic, to see how blood is being made." },
    { name: "Flow cytometry and genetic tests", note: "Specialised tests on blood or marrow that classify blood cancers." },
    { name: "Blood transfusion", note: "Regular transfusions are part of care for some conditions, such as thalassaemia major." },
    { name: "Bone marrow (stem cell) transplant", note: "Used for selected blood cancers and some inherited blood disorders, in specialised centres." },
  ],
  versus: [
    { key: "pathology", text: "A pathologist reports your blood count, smear or marrow sample in the laboratory. A clinical haematologist sees you, puts the results together, and treats the condition." },
    { key: "medical-oncology", text: "Medical oncologists treat solid tumours such as breast or lung cancer with medicines. Blood cancers are often treated by haematologists or haemato-oncologists." },
    { key: "internal-medicine", text: "Most straightforward anaemia is managed by a physician. A haematologist is involved when the cause is unclear, it does not respond to treatment, or a blood disorder or cancer is suspected." },
  ],
  firstVisit: [
    "Bring all your blood count reports with dates, as far back as you have them. Trends often matter more than one result.",
    "Bring a list of your medicines, including iron, supplements, blood thinners and AYUSH or herbal products.",
    "Mention any family history of anaemia, thalassaemia, sickle cell disease, bleeding problems or clots, and any previous transfusions.",
    "Note symptoms such as tiredness, breathlessness, bruising, heavy periods, night sweats, weight loss or swollen glands, and when they began.",
    "Expect repeat blood tests on the day; a bone marrow test, if needed, is usually planned for a separate visit.",
  ],
  urgent: [
    "Bleeding that will not stop, vomiting or coughing blood, or black stools: call 108",
    "Fever during treatment for a blood cancer or with a known low white cell count: go to an emergency department immediately",
    "Sudden breathlessness, chest pain, or a painful swollen leg, which can mean a clot: call 108",
    "In sickle cell disease, severe pain, chest pain, breathing difficulty or weakness on one side: seek emergency care",
  ],
  faqs: [
    {
      q: "Is a haematologist a cancer doctor?",
      a: "Partly. Haematologists treat blood cancers such as leukaemia, lymphoma and myeloma, but a large part of their work is non-cancerous conditions such as anaemia, thalassaemia and bleeding disorders. Being referred to one does not mean cancer is suspected.",
    },
    {
      q: "Should I get tested for thalassaemia before marriage or pregnancy?",
      a: "Carrier testing is often advised in India, particularly where there is a family history, because two carriers can have a child with thalassaemia major. Ask your doctor or a haematologist about the test and what the result means.",
    },
    {
      q: "Is a bone marrow test painful?",
      a: "It is done under local anaesthetic, sometimes with sedation. Most people feel pressure and brief discomfort, and some soreness afterwards for a day or two.",
    },
    {
      q: "What qualifications should a haematologist have?",
      a: "An MBBS, a postgraduate degree in medicine or paediatrics (MD or DNB), and a super-speciality degree in clinical haematology, usually DM or DrNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Why was I referred when I only have anaemia?",
      a: "Anaemia is common, but when it has no obvious cause, returns, or does not improve with treatment, a haematologist can look for less common causes and decide on further tests.",
    },
  ],
};
