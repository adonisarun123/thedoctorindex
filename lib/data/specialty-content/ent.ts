import type { SpecialtyContent } from "./types";

export const ent: SpecialtyContent = {
  key: "ent",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An ENT surgeon, also called an otorhinolaryngologist, is a doctor who specialises in the ear, nose, throat, and the head and neck. In India the usual training is an MBBS followed by an MS in ENT, a DNB, or the older diploma DLO. ENT surgeons both prescribe and operate, and their work runs from ear infections and blocked sinuses in the clinic to delicate ear surgery, sinus surgery and operations on the voice box and neck.",
    "Common reasons to see an ENT surgeon include hearing loss, ringing in the ears, ear discharge or pain, a blocked nose, sinusitis, nosebleeds, recurrent tonsillitis, voice change, snoring and a lump in the neck. Dizziness and balance problems can also start in the inner ear. Many problems can be diagnosed in the clinic with a small camera passed into the nose or throat.",
    "ENT surgeons often work alongside audiologists, who test hearing and fit hearing aids, and speech therapists, who help with voice and swallowing. Some ENT surgeons focus on particular areas, such as the ear, the sinuses, the voice, children's ENT, or head and neck cancer. Hoarseness that lasts more than a few weeks, especially in smokers, or a new neck lump in an adult, should be checked rather than watched.",
  ],
  conditions: [
    { name: "Ear infections and discharge", note: "Painful infections of the outer or middle ear, and long-standing discharge from a perforated eardrum." },
    { name: "Hearing loss and tinnitus", note: "Hearing that has dropped, or ringing and buzzing in the ears; causes range from wax to nerve damage." },
    { name: "Ear wax", note: "A common cause of blocked ears; best removed by a doctor rather than with cotton buds." },
    { name: "Sinusitis and blocked nose", note: "Short-lived or long-standing sinus infections, a bent nasal septum, and nasal polyps." },
    { name: "Allergic rhinitis", note: "Sneezing, a runny or blocked nose and itchy eyes triggered by dust, pollen or other allergens." },
    { name: "Tonsillitis and throat infections", note: "Repeated sore throats; tonsils are removed only when infections are frequent or severe." },
    { name: "Voice change and hoarseness", note: "From strain, nodules, reflux or growths on the vocal cords." },
    { name: "Snoring and sleep apnoea", note: "Loud snoring with pauses in breathing during sleep, which can affect health and daytime alertness." },
    { name: "Dizziness and vertigo", note: "Spinning sensations that often come from the inner ear." },
  ],
  tests: [
    { name: "Ear, nose and throat examination", note: "Using a light and small instruments, often with a microscope for the ear." },
    { name: "Nasal endoscopy", note: "A thin camera passed into the nose to see the sinuses and back of the nose; done in the clinic." },
    { name: "Laryngoscopy", note: "A camera to view the voice box and throat." },
    { name: "Hearing tests (audiometry)", note: "Usually done by an audiologist to measure hearing in each ear." },
    { name: "Tympanometry", note: "A quick test of how the eardrum moves, useful for fluid behind the eardrum." },
    { name: "CT scan of the sinuses", note: "Shows the sinuses in detail before surgery or when the diagnosis is uncertain." },
    { name: "Sleep study", note: "Records breathing and oxygen levels overnight to diagnose sleep apnoea." },
    { name: "Operations", note: "Including tonsillectomy, sinus surgery, septoplasty, eardrum repair and ear surgery for hearing." },
  ],
  versus: [
    { key: "audiology", text: "Audiologists test hearing and fit hearing aids. ENT surgeons diagnose and treat the underlying ear disease, with medicines or surgery." },
    { key: "pulmonology", text: "A cough or breathlessness usually comes from the lungs and is seen by a pulmonologist. Snoring and sleep apnoea may be managed by either, depending on the cause." },
    { key: "neurology", text: "Dizziness from the inner ear is often seen by ENT. Dizziness with other nervous system symptoms, such as weakness, double vision or difficulty speaking, may need a neurologist." },
  ],
  firstVisit: [
    "Bring earlier hearing tests, scans and reports, and a list of medicines, including nasal sprays and ear drops you have used.",
    "Note how long the problem has lasted, whether it affects one or both sides, and what makes it better or worse.",
    "Do not clean your ears with cotton buds or put drops in before the visit unless advised; it can make examination harder.",
    "For snoring, ask whoever you sleep near whether they notice pauses in your breathing.",
    "Expect an examination with a light and sometimes a small camera in the nose or throat, usually after a numbing spray.",
  ],
  urgent: [
    "Difficulty breathing, noisy breathing, or difficulty swallowing saliva: call 108",
    "Sudden hearing loss in one ear; this should be seen within a day or two",
    "A nosebleed that does not stop after pressing firmly on the soft part of the nose for fifteen minutes, or heavy bleeding after throat surgery",
    "A swallowed or inhaled object, or rapidly increasing swelling of the neck or face with fever",
  ],
  faqs: [
    {
      q: "Is it safe to clean my ears with cotton buds?",
      a: "It is best avoided. Cotton buds can push wax deeper and injure the ear canal or eardrum. If wax blocks your ears, an ENT doctor can remove it safely.",
    },
    {
      q: "Do tonsils need to be removed?",
      a: "Only in some cases, such as frequent severe throat infections, a tonsil abscess, or tonsils large enough to block breathing during sleep. Many children grow out of repeated sore throats.",
    },
    {
      q: "Is sudden hearing loss serious?",
      a: "Yes. Sudden hearing loss in one ear should be seen by an ENT doctor within a day or two, as early treatment may help.",
    },
    {
      q: "What is the difference between an ENT surgeon and an audiologist?",
      a: "An ENT surgeon is a medical doctor who diagnoses and treats ear, nose and throat conditions, including with surgery. An audiologist tests hearing and fits hearing aids.",
    },
    {
      q: "What qualifications should an ENT surgeon have?",
      a: "An MBBS and a postgraduate qualification in ENT, such as MS, DNB or the diploma DLO. Registration should be on the NMC's register or a state medical council register.",
    },
  ],
};
