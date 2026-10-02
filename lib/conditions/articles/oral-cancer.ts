import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "oral-cancer",
  title: "Oral (mouth) cancer: early signs, causes, tests, treatment and which doctor to see",
  metaTitle: "Oral cancer: early signs, tests and treatment",
  standfirst: "The early signs of mouth cancer, why tobacco, gutka and areca nut are the main causes in India, free screening, the tests and the treatment options.",
  targetQuery: "mouth cancer symptoms and treatment",
  department: "oncology",
  specialty: "surgical-oncology",
  alsoSee: ["dentistry", "ent"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Mouth ulcer that does not heal", "White patch", "Red patch", "Difficulty opening the mouth", "Lump in the neck", "Loose teeth", "Difficulty swallowing"],
  tests: ["Oral examination", "Biopsy", "CT scan", "MRI", "PET-CT"],
  treatments: ["Surgery", "Reconstructive surgery", "Radiotherapy", "Chemotherapy", "Tobacco cessation"],
  body: [
    { k: "h2", text: "What oral cancer is" },
    {
      k: "p",
      text: "Oral cancer, or mouth cancer, is cancer of the lips, tongue, gums, cheek lining, floor of the mouth or palate. Most are squamous cell cancers, which start in the thin cells lining the mouth. In India the inside of the cheek and the tongue are common sites, often where tobacco or a betel quid is held.",
    },
    {
      k: "p",
      text: "Oral cancer usually develops from visible changes that have been present for some time — white or red patches or stiffening of the cheeks — called oral potentially malignant disorders. Because the mouth is easy to examine, these changes and early cancers can often be spotted by a doctor, a dentist or even yourself. Found early, oral cancer is much easier to treat, with smaller operations and better recovery of speech and swallowing.",
    },

    { k: "h2", text: "Early signs and symptoms" },
    { k: "p", text: "See a doctor or dentist if any of these lasts more than two weeks:" },
    {
      k: "ul",
      items: [
        "A mouth ulcer that does not heal",
        "A white patch (leukoplakia) or red patch (erythroplakia) on the gums, tongue or cheek lining",
        "Difficulty opening the mouth, or stiff, pale, leathery cheeks — signs of oral submucous fibrosis",
        "A lump or thickening in the mouth, or a lump in the neck",
        "Loose teeth without gum disease, or dentures that no longer fit",
        "Pain or difficulty swallowing, chewing or moving the tongue",
        "Numbness in the mouth or lip, unexplained bleeding, or ear pain",
      ],
    },
    {
      k: "p",
      text: "Early oral cancer is often painless, so a sore that does not hurt is not reassuring.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "p",
      text: "Tobacco, alcohol and areca nut are the leading causes of oral cancer. In India the main risk comes from smokeless tobacco and areca nut products:",
    },
    {
      k: "ul",
      items: [
        "Chewing tobacco, khaini, gutka, mawa and zarda",
        "Paan with tobacco, and areca nut (supari) on its own or in paan masala — even without tobacco",
        "Smoking cigarettes and bidis",
        "Drinking alcohol, which multiplies the risk from tobacco",
        "Sharp, broken teeth or ill-fitting dentures that rub the same spot for years",
        "Infection with some types of HPV, particularly for cancers at the back of the throat",
      ],
    },
    {
      k: "p",
      text: "The risk falls after stopping tobacco and areca nut, so it is never too late to quit. The National Tobacco Quit Line (1800-112-356) offers free counselling, including in regional languages.",
    },

    { k: "h2", text: "Screening and diagnosis" },
    {
      k: "p",
      text: "Under the national programme for non-communicable diseases, people aged 30 and above can be screened for oral, breast and cervical cancers at government health facilities, including Ayushman Arogya Mandirs. Oral screening is a simple visual **oral examination** of the mouth. If anything abnormal is seen, the next steps are:",
    },
    {
      k: "ul",
      items: [
        "**Biopsy** — a small piece of the area is removed under local anaesthetic and examined, which is the only way to confirm cancer or precancer",
        "**CT scan** or **MRI** of the face and neck to see the size of the tumour, bone involvement and lymph nodes",
        "**PET-CT** in some people, to check for spread",
        "A chest scan, dental assessment and an endoscopy of the throat",
      ],
    },

    {
      k: "p",
      text: "A dentist or doctor may suggest a short course of observation for a patch that could be caused by a sharp tooth or a burn, after removing the cause. If the patch is still there after about two weeks, a biopsy should not be delayed. Ask for a referral rather than accepting repeated courses of ointments or mouthwashes for a sore that is not healing.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [dentist](/specialties/dentistry) is often the first to notice a suspicious patch and can refer you. An [ENT surgeon](/specialties/ent) or oral and maxillofacial surgeon can examine and biopsy the area. A head and neck [surgical oncologist](/specialties/surgical-oncology) leads cancer surgery, working with radiation and medical oncologists, reconstructive surgeons, speech and swallowing therapists, dietitians and dentists.",
    },
    {
      k: "p",
      text: "You can [find surgical oncologists in Bengaluru](/doctors/karnataka/bengaluru/surgical-oncologists), [ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) or [dentists in Bengaluru](/doctors/karnataka/bengaluru/dentists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Precancerous changes" },
    {
      k: "p",
      text: "White or red patches with abnormal cells may be removed surgically or by laser and need regular checks. **Tobacco cessation** and stopping areca nut are essential; some patches shrink after quitting. Oral submucous fibrosis is managed with quitting, mouth-opening exercises and medical or surgical treatment.",
    },
    { k: "h3", text: "Cancer" },
    {
      k: "ul",
      items: [
        "**Surgery** — removal of the tumour with a margin of healthy tissue, and usually of lymph nodes in the neck. Part of the jaw may need to be removed if bone is involved.",
        "**Reconstructive surgery** — tissue from the forearm, thigh or leg bone is used to rebuild the mouth or jaw, helping speech, swallowing and appearance.",
        "**Radiotherapy** — after surgery for many people, or as the main treatment in some.",
        "**Chemotherapy** — often given with radiotherapy; targeted therapy and immunotherapy are used in some cases.",
      ],
    },
    {
      k: "p",
      text: "Dental checks before radiotherapy reduce later problems. Do not delay or replace treatment with unproven remedies; delays allow the cancer to grow.",
    },

    { k: "h2", text: "Living with it: recovery and follow-up" },
    {
      k: "ul",
      items: [
        "Regular follow-up examinations, more often in the first years",
        "Speech and swallowing therapy, and nutritional support",
        "Careful dental care for life, especially after radiotherapy",
        "Staying off tobacco, areca nut and alcohol, which lowers the risk of a new cancer",
        "Support for appearance, mood and returning to work",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Noisy or difficult breathing",
        "Heavy bleeding from the mouth or neck",
        "Being unable to swallow fluids",
        "Fever or chills during chemotherapy",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this patch precancerous or cancer, and do I need a biopsy?",
        "What stage is the cancer, and has it spread to my neck?",
        "What surgery do I need, and will I need reconstruction?",
        "How will treatment affect my speech, eating and appearance?",
        "Do I need radiotherapy or chemotherapy?",
        "What support is available to help me quit tobacco and areca nut?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is paan or supari without tobacco safe?",
      a: "No. Areca nut (supari) itself causes oral submucous fibrosis and raises the risk of mouth cancer, even without tobacco. Sweetened paan masala and supari mixes are not a safe alternative to gutka. Stopping all of them lowers the risk.",
    },
    {
      q: "What does an early mouth cancer look like?",
      a: "It may be a painless ulcer that does not heal, a white or red patch, a lump, or a rough area on the cheek, tongue or gums. Any such change lasting more than two weeks should be examined by a doctor or dentist.",
    },
    {
      q: "Is oral cancer curable?",
      a: "Early oral cancer can often be treated successfully, frequently with surgery alone. Outcomes are much better when it is found early, which is why screening, self-examination and prompt biopsy of suspicious patches matter so much.",
    },
    {
      q: "Can I check my own mouth for cancer?",
      a: "Yes. Once a month, in good light with a mirror, look at your lips, gums, cheeks, tongue (including the sides and underneath), the floor of the mouth and the palate. Feel your neck for lumps. Report anything new that lasts more than two weeks.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Oral Cancer", url: "https://medlineplus.gov/oralcancer.html" },
    { label: "World Health Organization — Oral health fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/oral-health" },
    { label: "National Tobacco Control Programme, MoHFW — National Tobacco Quit Line Services", url: "https://ntcp.mohfw.gov.in/national_tobacco_quit_line_services" },
    { label: "DD News — Government launches intensified NCD screening campaign for all citizens aged 30 and above", url: "https://ddnews.gov.in/en/government-launches-intensified-ncd-screening-campaign-to-cover-all-citizens-aged-30-and-above/" },
  ],
};
