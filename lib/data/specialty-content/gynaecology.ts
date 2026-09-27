import type { SpecialtyContent } from "./types";

export const gynaecology: SpecialtyContent = {
  key: "gynaecology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Obstetrics and gynaecology cover two linked areas: obstetrics is the care of pregnancy and childbirth, and gynaecology is the care of the female reproductive system at every age. In India most specialists train in both, through an MBBS followed by an MS or MD in obstetrics and gynaecology, a DNB, or the older diploma DGO. Many practise both halves throughout their career; some limit their work to one, or narrow further into infertility, high-risk pregnancy or gynaecological cancer.",
    "Gynaecologists see women and girls for periods that are heavy, painful or irregular, pelvic pain, discharge, fibroids, polycystic ovary syndrome, contraception, difficulty conceiving, menopause and cervical screening. They both prescribe and operate, from minor procedures in the clinic to keyhole surgery and hysterectomy.",
    "Antenatal care in India usually runs through one obstetrician from the first confirmation of pregnancy to delivery, with regular check-ups, scans and blood tests along the way. It is worth choosing a doctor who delivers at a hospital you can reach quickly, with facilities for emergencies and care of newborns. Some warning signs in pregnancy cannot wait for the next check-up, and these are listed below.",
  ],
  conditions: [
    { name: "Pregnancy and antenatal care", note: "Regular check-ups, scans and blood tests from confirmation of pregnancy to delivery and after." },
    { name: "High-risk pregnancy", note: "Pregnancy with high blood pressure, diabetes, twins, previous complications or other conditions that need closer care." },
    { name: "Period problems", note: "Heavy, painful, irregular or absent periods, and bleeding between periods or after sex." },
    { name: "Polycystic ovary syndrome (PCOS)", note: "Irregular periods, acne, excess hair and difficulty conceiving, often linked to weight and insulin resistance." },
    { name: "Fibroids and ovarian cysts", note: "Common non-cancerous growths; many need only monitoring, some need treatment." },
    { name: "Endometriosis", note: "Tissue like the womb lining growing elsewhere, causing painful periods and pelvic pain." },
    { name: "Infertility", note: "Assessment of both partners when pregnancy has not happened, and treatment or referral to a fertility specialist." },
    { name: "Vaginal infections and discharge", note: "Common and usually easy to treat once the cause is found." },
    { name: "Menopause", note: "Hot flushes, sleep and mood changes, and bone health around and after the end of periods." },
  ],
  tests: [
    { name: "Pelvic examination", note: "An internal examination, always with consent and usually with a female attendant present. You can ask for one." },
    { name: "Pap smear or HPV test", note: "Cervical screening that looks for early changes that could lead to cancer." },
    { name: "Pelvic ultrasound", note: "Through the abdomen or vagina, to look at the womb and ovaries." },
    { name: "Pregnancy scans", note: "Ultrasound at set stages of pregnancy to check dating, the baby's development and growth." },
    { name: "Antenatal blood tests", note: "Blood group, haemoglobin, sugar, thyroid and infection screening, among others." },
    { name: "Hormone tests", note: "Used to investigate irregular periods, PCOS, infertility and menopause." },
    { name: "Hysteroscopy and laparoscopy", note: "A thin camera passed into the womb or through small cuts in the abdomen to diagnose and treat problems." },
    { name: "Caesarean section and hysterectomy", note: "Operations for delivering a baby through the abdomen and for removing the womb, when needed." },
  ],
  versus: [
    { key: "general-practice", text: "A general physician can help with many common concerns and routine checks. For pregnancy, period problems that persist, pelvic pain or a lump, a gynaecologist is the right specialist." },
    { key: "endocrinology", text: "Gynaecologists manage most PCOS and menopause care. An endocrinologist may be involved when hormonal problems are complex or affect other glands such as the thyroid or adrenals." },
    { key: "surgical-oncology", text: "Suspected cancers of the womb, cervix or ovary may be treated by a gynaecological oncologist or surgical oncologist, working with the gynaecologist who first found the problem." },
  ],
  firstVisit: [
    "Note the date your last period started and whether your periods are regular. A period tracking app or diary is useful.",
    "Bring earlier scans, blood reports and any records of previous pregnancies, deliveries or operations.",
    "List your medicines, including contraceptives and supplements, and any conditions such as thyroid disease or diabetes.",
    "It is fine to bring a family member or friend, and to ask for a female attendant during any examination.",
    "Expect questions about periods, pregnancies and contraception. They are routine, and honest answers lead to the right tests.",
  ],
  urgent: [
    "Heavy bleeding in pregnancy, or bleeding soaking a pad an hour at any time",
    "Severe abdominal pain in pregnancy, or sudden severe one-sided pain with a missed period",
    "Reduced or absent baby movements in the later months of pregnancy",
    "A fit, severe headache, blurred vision or sudden swelling of the face and hands in pregnancy: call 108",
  ],
  faqs: [
    {
      q: "Is an obstetrician the same as a gynaecologist?",
      a: "Obstetrics is care of pregnancy and childbirth; gynaecology is care of the female reproductive system. In India most specialists are trained in both and are listed as obstetricians and gynaecologists.",
    },
    {
      q: "When should I start antenatal care?",
      a: "As soon as you know you are pregnant. Early visits confirm the pregnancy, check your health, and plan the scans and tests that follow.",
    },
    {
      q: "How often should I have a cervical screening test?",
      a: "The starting age and interval depend on your age, the type of test used and your earlier results. Ask your gynaecologist which schedule suits you, and keep a copy of each report.",
    },
    {
      q: "Do I need a gynaecologist for irregular periods?",
      a: "Occasional irregularity is common. Periods that are consistently irregular, very heavy, very painful, or that stop without pregnancy are worth assessing with a gynaecologist.",
    },
    {
      q: "What qualifications should a gynaecologist have?",
      a: "An MBBS and a postgraduate qualification in obstetrics and gynaecology, such as MS or MD, DNB, or the diploma DGO. Registration should be on the NMC's register or a state medical council register.",
    },
  ],
};
