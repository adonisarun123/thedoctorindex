import type { SpecialtyContent } from "./types";

export const dentistry: SpecialtyContent = {
  key: "dentistry",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Dentists care for the teeth, gums and mouth. In India the basic qualification is the BDS, a five-year degree including an internship, and dentists register with a state dental council. The National Dental Commission is now the national regulator, replacing the Dental Council of India. Dentists are a separate profession from medical doctors, with their own training and registers, though they work closely with doctors when mouth problems are linked to general health.",
    "A general dentist handles most everyday care: check-ups and cleaning, fillings, extractions, root canal treatment, crowns and dentures. Dentists with an MDS, a three-year postgraduate degree, specialise further. Specialities include orthodontics (braces and aligners), endodontics (root canals), periodontics (gums), prosthodontics (crowns, bridges, dentures and implants), oral and maxillofacial surgery, paediatric dentistry, and oral medicine and radiology.",
    "Much dental disease is preventable, and much of it is painless until it is advanced. Regular check-ups catch decay and gum disease early, when treatment is simpler. In India, tobacco chewing and smoking are major causes of gum disease and mouth cancer, and a dentist is often the first to notice a suspicious patch or ulcer. Any mouth ulcer or patch that has not healed within a few weeks should be checked.",
  ],
  conditions: [
    { name: "Tooth decay", note: "Cavities caused by bacteria and sugar; treated with fillings, or root canal treatment if the nerve is affected." },
    { name: "Toothache and sensitivity", note: "Pain from decay, cracked teeth, worn enamel or receding gums." },
    { name: "Gum disease", note: "Bleeding, swollen or receding gums; left untreated it can loosen teeth." },
    { name: "Tooth infections and abscesses", note: "A painful swelling near a tooth that needs prompt treatment." },
    { name: "Missing teeth", note: "Replaced with bridges, dentures or implants." },
    { name: "Crooked teeth and bite problems", note: "Corrected with braces or aligners, usually by an orthodontist." },
    { name: "Wisdom tooth problems", note: "Partly erupted or impacted wisdom teeth that cause pain or infection." },
    { name: "Mouth ulcers and patches", note: "Most heal on their own; one that lasts more than a few weeks, or a white or red patch, needs examination." },
    { name: "Children's teeth", note: "Decay in milk teeth, protective sealants, and guidance on brushing and diet." },
  ],
  tests: [
    { name: "Dental check-up", note: "An examination of teeth, gums and mouth, often including a screen for mouth cancer." },
    { name: "Dental X-rays", note: "Small X-rays of individual teeth, or a full-mouth X-ray (OPG), to find hidden decay and check roots and jaws." },
    { name: "Scaling and cleaning", note: "Removal of hardened deposits from the teeth to treat and prevent gum disease." },
    { name: "Fillings", note: "Repair of cavities with tooth-coloured or other materials." },
    { name: "Root canal treatment", note: "Removal of infected or inflamed nerve tissue from inside a tooth, usually followed by a crown." },
    { name: "Extraction", note: "Removal of a tooth that cannot be saved, including surgical removal of wisdom teeth." },
    { name: "Crowns, bridges and dentures", note: "Caps and replacements for damaged or missing teeth." },
    { name: "Dental implants", note: "A metal post placed in the jawbone to support a replacement tooth." },
    { name: "Braces and aligners", note: "Gradual movement of teeth into a better position over months." },
  ],
  versus: [
    { key: "ent", text: "Pain around the jaw or face can come from the teeth or from the sinuses. A dentist checks the teeth first; an ENT surgeon looks at the sinuses, nose and throat." },
    { key: "surgical-oncology", text: "A dentist may find a suspicious patch or ulcer in the mouth. If cancer is suspected, care usually moves to an oral and maxillofacial surgeon or a head and neck cancer surgeon." },
    { key: "plastic-surgery", text: "Oral and maxillofacial surgeons, who are dentists with surgical training, and plastic surgeons both treat face and jaw injuries and deformities, depending on the hospital." },
  ],
  firstVisit: [
    "Bring earlier dental X-rays and records, and tell the dentist about medicines you take, especially blood thinners, and conditions such as diabetes or heart disease.",
    "Mention if you are pregnant, have any allergies, or have had problems with local anaesthetic before.",
    "Note which tooth hurts, when, and whether hot, cold or biting sets it off.",
    "Expect an examination and often X-rays. Ask what the treatment options are, how many visits are needed, and what the alternatives are, including doing nothing for now.",
    "If you are anxious about dental treatment, say so; dentists can explain each step and take breaks.",
  ],
  urgent: [
    "Swelling of the face or neck from a tooth infection, especially with fever or difficulty opening the mouth",
    "Difficulty breathing or swallowing with a dental swelling: call 108",
    "Bleeding after an extraction that does not stop with firm pressure on gauze",
    "A knocked-out adult tooth: keep it moist, ideally in milk, without scrubbing the root, and see a dentist at once",
  ],
  faqs: [
    {
      q: "What is the difference between BDS and MDS?",
      a: "BDS is the basic degree that qualifies a person to practise as a dentist. MDS is a three-year postgraduate degree in a particular branch of dentistry, such as orthodontics, root canal treatment or oral surgery.",
    },
    {
      q: "How often should I see a dentist?",
      a: "Many people benefit from a check-up about once or twice a year, but the right interval depends on your teeth and gums. Your dentist can advise what suits you.",
    },
    {
      q: "Is a root canal treatment painful?",
      a: "It is done under local anaesthetic, and most people find it no more uncomfortable than a filling. It often relieves the pain of an infected tooth.",
    },
    {
      q: "Do bleeding gums need treatment?",
      a: "Yes. Bleeding gums are often an early sign of gum disease, which is treatable. See a dentist rather than brushing less.",
    },
    {
      q: "How do I check a dentist's registration?",
      a: "Dentists register with a state dental council, under the National Dental Commission. You can ask the dentist for their registration number and check it with the relevant state dental council.",
    },
  ],
};
