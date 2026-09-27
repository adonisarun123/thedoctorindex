import type { SpecialtyContent } from "./types";

export const acupuncture: SpecialtyContent = {
  key: "acupuncture",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Acupuncture involves inserting very fine needles into the skin at defined points on the body. It comes from traditional Chinese medicine, and some practitioners also use variations such as electroacupuncture, where a mild current is passed through the needles, or acupressure, where points are pressed rather than needled. It is most commonly sought for pain.",
    "There is no single statutory national register for acupuncturists in India of the kind that exists for medical doctors or AYUSH practitioners. People offering acupuncture include medical doctors, physiotherapists and AYUSH practitioners who have taken additional training, as well as practitioners trained only in acupuncture. Training varies widely, so it is worth asking directly where and how long a practitioner trained, and what their main professional qualification is.",
    "Acupuncture is best thought of as something some people try alongside medical care rather than instead of it. For new, severe or unexplained pain, get a medical diagnosis first, so that a condition that needs other treatment is not missed.",
  ],
  conditions: [
    { name: "Back and neck pain", note: "One of the most common reasons people seek acupuncture." },
    { name: "Joint pain", note: "People with knee and other joint pain sometimes try it alongside exercise and medical care." },
    { name: "Headaches", note: "People with tension headaches or migraine sometimes seek it, ideally after a doctor has assessed the headache." },
    { name: "Muscle pain and stiffness", note: "Shoulder, neck and other muscle aches." },
    { name: "Nausea", note: "Some people seek acupuncture or acupressure for nausea, alongside their doctor's treatment." },
    { name: "Stress and general wellbeing", note: "Some people use it for relaxation or as part of a wider approach to stress." },
  ],
  tests: [
    { name: "Consultation", note: "A history of the problem, your general health and medicines, before any needling." },
    { name: "Acupuncture session", note: "Fine needles are inserted and left in place for a period, usually with you lying comfortably." },
    { name: "Electroacupuncture", note: "A mild electrical current is passed between needles; not suitable for everyone, such as people with pacemakers." },
    { name: "Acupressure", note: "Pressure on points with fingers or devices instead of needles." },
    { name: "Course of treatment", note: "Usually several sessions; ask how many are planned and how progress will be judged." },
  ],
  versus: [
    { key: "physiotherapy", text: "Physiotherapists treat pain and movement problems mainly with exercise and hands-on techniques. Some also offer acupuncture or dry needling as one part of a wider programme." },
    { key: "ayush", text: "AYUSH systems such as Ayurveda and Homoeopathy have their own statutory registers under NCISM and NCH. Acupuncture is a separate practice without an equivalent national register." },
  ],
  firstVisit: [
    "Ask about the practitioner's training and main professional qualification.",
    "Check that sterile, single-use disposable needles are used and opened in front of you.",
    "Tell the practitioner if you take blood thinners, have a bleeding disorder, a pacemaker, diabetes, or are or might be pregnant.",
    "Bring any relevant scan or doctor's reports, and keep your doctor informed; do not stop prescribed medicines.",
  ],
  urgent: [
    "Sudden breathlessness or chest pain during or after a session, especially after needling on the chest or upper back: call 108",
    "Fainting that does not recover quickly, or signs of infection such as spreading redness, heat or pus at a needle site: seek medical care",
    "Any new severe pain, weakness or numbness should be seen by a doctor before acupuncture, not treated with it",
  ],
  faqs: [
    {
      q: "Does acupuncture hurt?",
      a: "The needles are much finer than those used for injections. Most people feel a brief prick or a dull ache at the point, and many find the session relaxing.",
    },
    {
      q: "Is acupuncture safe?",
      a: "Serious problems are uncommon when a trained practitioner uses sterile single-use needles. Minor bruising or soreness can occur. Tell the practitioner about your health conditions and medicines beforehand.",
    },
    {
      q: "Who can practise acupuncture in India?",
      a: "Practitioners come from different backgrounds, including medical doctors, physiotherapists and AYUSH practitioners with extra training, and people trained only in acupuncture. There is no single national statutory register, so ask about training directly.",
    },
    {
      q: "Can acupuncture replace my medicines?",
      a: "No. Do not stop prescribed medicines without speaking to the doctor who prescribed them. Acupuncture is usually used alongside medical care.",
    },
    {
      q: "How many sessions will I need?",
      a: "It varies. Ask the practitioner how many sessions they suggest and agree a point at which you will review whether it is helping.",
    },
  ],
};
