import type { SpecialtyContent } from "./types";

export const audiology: SpecialtyContent = {
  key: "audiology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Audiologists assess hearing and balance and help people manage hearing loss, including selecting and fitting hearing aids and programming cochlear implants. Speech-language pathologists assess and treat difficulties with speech, language, voice, fluency and swallowing. In India the two are often trained together, through a Bachelor in Audiology and Speech-Language Pathology (BASLP) and a Master's (MASLP). They are allied health professionals, not medical doctors. Audiologists and speech-language pathologists are registered with the Rehabilitation Council of India, and allied and healthcare professions are also being brought under the National Commission for Allied and Healthcare Professions.",
    "Audiologists work closely with ENT surgeons, who diagnose and treat the medical and surgical causes of hearing loss, and with paediatricians, since hearing matters for a child's speech and language development. Speech-language pathologists work with paediatricians, neurologists and ENT surgeons, and in stroke and head and neck cancer rehabilitation.",
    "People reach an audiologist or speech-language pathologist on referral or directly. For sudden hearing loss, ear pain, discharge or dizziness, see a doctor first, usually an ENT surgeon, so that a medical cause is not missed.",
  ],
  conditions: [
    { name: "Age-related hearing loss", note: "Gradual difficulty hearing speech, especially in noise, often helped by hearing aids." },
    { name: "Noise-related hearing loss", note: "Hearing damage from loud work or leisure noise; prevention and hearing protection are part of care." },
    { name: "Hearing concerns in babies and children", note: "Following up newborn hearing screening, or a child who does not respond to sounds." },
    { name: "Tinnitus", note: "Ringing or buzzing in the ears; assessment and strategies to manage it." },
    { name: "Balance problems", note: "Tests of the inner ear balance system, alongside the ENT surgeon or neurologist." },
    { name: "Delayed or unclear speech in children", note: "Assessment and therapy for speech and language development." },
    { name: "Stammering and voice problems", note: "Therapy for fluency, and for hoarseness or voice strain after ENT assessment." },
    { name: "Swallowing difficulty", note: "Assessment and therapy after a stroke, head and neck cancer treatment, or in neurological conditions." },
  ],
  tests: [
    { name: "Pure tone audiometry", note: "Beeps at different pitches through headphones to measure hearing levels in each ear." },
    { name: "Tympanometry", note: "A quick test of how the eardrum and middle ear move." },
    { name: "OAE and BERA", note: "Tests that do not need a response from the person, used for newborns and young children." },
    { name: "Hearing aid trial and fitting", note: "Choosing, fitting and fine-tuning a hearing aid, with follow-up adjustments." },
    { name: "Cochlear implant programming", note: "Setting up and adjusting the implant after surgery, with auditory training." },
    { name: "Speech and language assessment", note: "Standardised assessment of understanding, expression and speech sounds." },
    { name: "Speech, voice and swallowing therapy", note: "Regular sessions with exercises and strategies to practise at home." },
  ],
  versus: [
    { key: "ent", text: "An ENT surgeon is a medical doctor who diagnoses and treats ear disease, prescribes medicines and operates. An audiologist measures hearing and provides hearing aids and rehabilitation. Sudden or one-sided hearing loss should be seen by a doctor first." },
    { key: "paediatrics", text: "A paediatrician looks after a child's overall health and development and may refer for hearing or speech assessment when there are concerns." },
  ],
  firstVisit: [
    "Bring any earlier hearing tests, ENT reports and letters, with dates.",
    "Note when the problem started, whether it affects one or both ears, and any ringing, dizziness, pain or discharge.",
    "For a child, bring the newborn screening result if available, and notes on speech milestones and concerns from school.",
    "Avoid loud noise for a day before a hearing test if possible; it can affect the result temporarily.",
  ],
  urgent: [
    "Sudden hearing loss in one or both ears: see an ENT doctor the same day or go to an emergency department, as early treatment matters",
    "Dizziness with weakness, numbness, difficulty speaking or a severe headache: call 108",
    "Choking or repeated coughing when swallowing with breathing difficulty: seek emergency care",
  ],
  faqs: [
    {
      q: "Is an audiologist a doctor?",
      a: "No. Audiologists are allied health professionals who test hearing and provide hearing aids and rehabilitation. Medical and surgical treatment of ear disease is done by an ENT surgeon.",
    },
    {
      q: "When should a child's hearing be tested?",
      a: "Newborn hearing screening is offered in many hospitals. Any child who does not respond to sounds, or whose speech is delayed, should have a hearing test at any age.",
    },
    {
      q: "Will a hearing aid restore normal hearing?",
      a: "Hearing aids make sounds easier to hear but do not restore normal hearing. Most people need a period of adjustment and several fine-tuning visits.",
    },
    {
      q: "What qualifications should an audiologist or speech therapist have?",
      a: "Usually a BASLP, and often an MASLP. Ask for their Rehabilitation Council of India registration.",
    },
    {
      q: "Can speech therapy help adults?",
      a: "Yes. Speech-language pathologists work with adults after a stroke or head injury, with voice and fluency problems, and with swallowing difficulties.",
    },
  ],
};
