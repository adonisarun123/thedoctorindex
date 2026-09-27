import type { SpecialtyContent } from "./types";

export const ayush: SpecialtyContent = {
  key: "ayush",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "AYUSH is the Indian umbrella term for Ayurveda, Yoga and Naturopathy, Unani, Siddha, Sowa-Rigpa and Homoeopathy. Each is a separate system with its own ideas about health and illness, its own methods of examination and its own treatments. Practitioners train in one system, not all of them, so an Ayurvedic physician and a homoeopath, for example, have quite different qualifications and approaches.",
    "Qualified practitioners hold a degree in their system: BAMS for Ayurveda, BUMS for Unani, BSMS for Siddha and BHMS for Homoeopathy, and some go on to postgraduate study. Practitioners of Ayurveda, Unani, Siddha and Sowa-Rigpa register under the National Commission for Indian System of Medicine (NCISM); homoeopaths register under the National Commission for Homoeopathy (NCH). A registration number on the relevant register is the most direct way to check that someone is qualified.",
    "People consult AYUSH practitioners for many reasons, often for long-standing conditions, lifestyle and diet guidance, or alongside conventional treatment. If you do, tell every doctor you see about all the treatments you are taking, from any system, because some preparations can interact with other medicines or affect tests. Do not stop medicines prescribed by another doctor without speaking to that doctor first, and do not delay seeing a doctor for new, severe or worsening symptoms.",
  ],
  conditions: [
    { name: "Long-standing joint and back pain", note: "People often consult for ongoing aches and stiffness, frequently alongside other care." },
    { name: "Digestive complaints", note: "People consult for acidity, bloating, constipation and similar symptoms." },
    { name: "Skin conditions", note: "People consult for long-standing skin complaints such as eczema or acne." },
    { name: "Stress, sleep and general wellbeing", note: "People seek diet, routine and lifestyle guidance within a traditional system." },
    { name: "Recurrent coughs, colds and allergies", note: "People consult for frequent colds, coughs and allergy symptoms, after a medical check where symptoms are persistent." },
    { name: "Support alongside long-term conditions", note: "People with diabetes, high blood pressure or other conditions sometimes consult alongside their regular doctor, who should be kept informed." },
    { name: "Women's health concerns", note: "People consult for period problems and other gynaecological symptoms, ideally after a medical assessment." },
  ],
  tests: [
    { name: "Consultation and examination", note: "A detailed history and examination according to the system, such as pulse examination in Ayurveda or detailed case-taking in homoeopathy." },
    { name: "Prescribed preparations", note: "Herbal, mineral or homoeopathic preparations dispensed or prescribed by the practitioner. Ask what is in them." },
    { name: "Panchakarma", note: "A set of Ayurvedic cleansing and therapeutic procedures, usually over several days under supervision." },
    { name: "External therapies", note: "Oil massage, fomentation and similar procedures used in Ayurveda, Siddha and Unani." },
    { name: "Yoga", note: "Postures, breathing practices and relaxation, taught as part of a routine." },
    { name: "Diet and lifestyle guidance", note: "Advice on food, daily routine and seasonal habits according to the system." },
    { name: "Modern investigations", note: "Many practitioners also look at blood tests and scans, especially to monitor a long-term condition." },
  ],
  versus: [
    { key: "general-practice", text: "A general physician (MBBS) diagnoses and treats with modern medicine and can arrange tests and referrals. For new, severe or unexplained symptoms, it is sensible to get a medical diagnosis first, whatever treatment you then choose." },
    { key: "acupuncture", text: "Acupuncture is a separate practice with its own training routes. It is not one of the systems regulated by NCISM or NCH." },
  ],
  firstVisit: [
    "Check the practitioner's degree (such as BAMS, BUMS, BSMS or BHMS) and their registration with NCISM or NCH.",
    "Bring a list of every medicine and supplement you take, from any system, and your recent reports.",
    "Ask what each preparation contains, how long to take it, and what to do if you notice side effects.",
    "Tell your other doctors about AYUSH treatment, and do not stop prescribed medicines without speaking to the doctor who prescribed them.",
  ],
  urgent: [
    "Chest pain, breathing difficulty, sudden weakness or confusion, heavy bleeding, or a high fever in a young child are emergencies: call 108 and go to an emergency department",
    "Yellowing of the eyes or skin, dark urine, or a rash after starting any new preparation: stop and see a doctor promptly",
  ],
  faqs: [
    {
      q: "How do I check that an AYUSH practitioner is qualified?",
      a: "Ask for their degree and registration number. Ayurveda, Unani, Siddha and Sowa-Rigpa practitioners register under the National Commission for Indian System of Medicine, and homoeopaths under the National Commission for Homoeopathy.",
    },
    {
      q: "Can I take AYUSH medicines along with my regular medicines?",
      a: "Tell both your AYUSH practitioner and your other doctors everything you take. Some preparations can interact with other medicines or affect blood tests. Do not stop a prescribed medicine without discussing it with the doctor who prescribed it.",
    },
    {
      q: "Are AYUSH practitioners doctors?",
      a: "They are registered practitioners of their own system, with degrees such as BAMS or BHMS. They are distinct from doctors with an MBBS, who practise modern medicine and register with the National Medical Commission or a state medical council.",
    },
    {
      q: "Are herbal or natural medicines always safe?",
      a: "Not always. Natural products can still have side effects and interactions, and quality varies. Buy from reliable sources, ask what a preparation contains, and report any new symptoms.",
    },
    {
      q: "What is Panchakarma?",
      a: "A set of Ayurvedic procedures intended for cleansing and therapy, usually carried out over several days. It should be done under the supervision of a qualified Ayurvedic practitioner, who will assess whether it is suitable for you.",
    },
  ],
};
