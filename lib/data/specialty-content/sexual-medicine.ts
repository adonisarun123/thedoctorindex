import type { SpecialtyContent } from "./types";

export const sexualMedicine: SpecialtyContent = {
  key: "sexual-medicine",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Sexual medicine deals with sexual function and sexual health in men and women: difficulties with erection or ejaculation, low desire, pain during intercourse, and sexually transmitted infections, along with the effect of these on relationships and fertility. Sexual problems are common, often have physical as well as emotional causes, and are treatable in many cases. Consultations are confidential.",
    "The field overlaps with several specialities. Urologists assess erection and ejaculation problems and the male reproductive organs; gynaecologists assess pain and other symptoms in women; endocrinologists look at hormone and diabetes-related causes; psychiatrists and psychologists address anxiety, depression, relationship factors and sex therapy; and dermatologists and venereologists treat many sexually transmitted infections. A sexual medicine specialist often coordinates between them.",
    "In India, 'sexologist' is not a protected title, and the field attracts unqualified practice and advertising that promises quick cures. Before booking, check that the person has a recognised medical degree, at least an MBBS and usually a postgraduate qualification in a related field, and a registration number on the NMC's Indian Medical Register or a state medical council register. Be wary of anyone who sells unlabelled medicines or insists on long, costly packages.",
  ],
  conditions: [
    { name: "Erectile difficulty", note: "Trouble getting or keeping an erection. It can be linked to diabetes, blood pressure, heart disease, medicines or stress, so a medical check is part of care." },
    { name: "Premature or delayed ejaculation", note: "Common concerns that often respond to a combination of advice, techniques and sometimes treatment." },
    { name: "Low sexual desire", note: "Reduced interest in sex, which can have hormonal, medical, emotional or relationship causes." },
    { name: "Pain during intercourse", note: "Pain or difficulty with penetration in women, including vaginismus, needs a gentle medical assessment." },
    { name: "Sexually transmitted infections", note: "Testing, treatment and advice on partner notification and prevention." },
    { name: "Sexual concerns with long-term illness", note: "Changes in sexual function with diabetes, heart disease, after surgery or with some medicines." },
    { name: "Fertility concerns linked to sexual function", note: "When difficulty with intercourse contributes to difficulty conceiving." },
  ],
  tests: [
    { name: "Confidential history", note: "A private discussion of the problem, general health, medicines and relationships. You can ask for a same-sex doctor or a chaperone where available." },
    { name: "Physical examination", note: "Done only with your consent, to look for physical causes." },
    { name: "Blood tests", note: "Sugar, cholesterol and hormone levels, depending on the problem." },
    { name: "STI testing", note: "Blood, urine or swab tests for infections." },
    { name: "Penile Doppler ultrasound", note: "Sometimes used to assess blood flow in erectile difficulty." },
    { name: "Counselling and sex therapy", note: "Individual or couple sessions addressing anxiety, communication and technique." },
    { name: "Medical treatment", note: "Prescribed only after assessment; do not buy medicines for sexual problems without a prescription." },
  ],
  versus: [
    { key: "urology", text: "Urologists are surgeons of the urinary tract and male reproductive organs. They assess erection and ejaculation problems and perform procedures when needed." },
    { key: "gynaecology", text: "Gynaecologists assess pain during intercourse, vaginal symptoms and hormonal changes in women, and often manage these directly." },
    { key: "psychiatry", text: "When anxiety, depression, past experiences or relationship factors play a large part, a psychiatrist or clinical psychologist may lead or share care." },
  ],
  firstVisit: [
    "Check the doctor's medical degree and registration number before booking.",
    "Bring a list of your medicines and any recent blood reports, particularly sugar and cholesterol.",
    "Think about when the problem started, whether it is constant or situational, and anything that makes it better or worse.",
    "You can attend alone or with a partner; some parts of the assessment are often done together.",
  ],
  urgent: [
    "An erection lasting more than four hours: go to an emergency department immediately, as delay can cause permanent damage",
    "Sudden severe pain or swelling in a testicle: go to an emergency department straight away",
    "Chest pain during or after sexual activity: stop and call 108",
  ],
  faqs: [
    {
      q: "Is a sexologist a real doctor?",
      a: "Not always. 'Sexologist' is not a protected title in India. Look for a medical degree, at least an MBBS, and a registration number on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Is erectile difficulty a sign of another health problem?",
      a: "It can be. It is sometimes linked to diabetes, high blood pressure, high cholesterol or heart disease, so a doctor will usually check for these.",
    },
    {
      q: "Can I buy medicines for sexual problems without a prescription?",
      a: "It is safer not to. Some medicines are unsafe with heart conditions or other drugs, and unlabelled products may contain undeclared ingredients. See a registered doctor first.",
    },
    {
      q: "Is the consultation confidential?",
      a: "Yes. Registered doctors are bound by professional confidentiality, and you can ask how your records are kept.",
    },
    {
      q: "Which doctor should a woman see for pain during intercourse?",
      a: "A gynaecologist is a good first step, and may involve a sexual medicine specialist, physiotherapist or psychologist depending on the cause.",
    },
  ],
};
