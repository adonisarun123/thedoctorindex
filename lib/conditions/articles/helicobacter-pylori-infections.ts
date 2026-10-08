import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "helicobacter-pylori-infections",
  title: "H. pylori infection: symptoms, tests, treatment and which doctor to see",
  metaTitle: "H. pylori infection: symptoms, tests and treatment",
  standfirst: "What H. pylori is, how it causes gastritis and ulcers, the breath, stool and endoscopy tests, how combination treatment works, and when to see a doctor.",
  targetQuery: "h pylori infection symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "internal-medicine", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Burning stomach pain", "Bloating", "Nausea", "Loss of appetite"],
  tests: ["Urea breath test", "Stool antigen test", "Endoscopy", "Biopsy"],
  treatments: ["Antibiotics", "Acid-reducing medicines", "Repeat testing"],
  body: [
    { k: "h2", text: "What H. pylori infection is" },
    {
      k: "p",
      text: "Helicobacter pylori, usually called H. pylori, is a spiral-shaped bacterium that can live in the lining of the stomach. Most bacteria cannot survive stomach acid, but H. pylori protects itself by burrowing into the mucus layer and neutralising the acid around it. Once there, it can stay for many years, often for life unless it is treated.",
    },
    {
      k: "p",
      text: "Infection is very common worldwide and especially in developing countries, including India, where many people pick it up in childhood. Most people who carry H. pylori never have any symptoms or problems. In some, though, the infection causes long-term inflammation of the stomach lining, called gastritis, and it is a leading cause of [peptic ulcers](/conditions/peptic-ulcer) in the stomach and the first part of the small intestine. Over many years, long-standing infection also raises the risk of stomach cancer and a rare stomach lymphoma, which is one reason doctors treat it when it is found.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "H. pylori itself usually causes no symptoms. When it leads to gastritis or an ulcer, people may notice:",
    },
    {
      k: "ul",
      items: [
        "Burning stomach pain or a dull ache in the upper abdomen, which may be worse when the stomach is empty and may ease after eating",
        "Bloating and frequent burping",
        "Nausea, and sometimes vomiting",
        "Loss of appetite, or feeling full quickly",
        "Unexplained weight loss",
      ],
    },
    {
      k: "p",
      text: "These symptoms overlap with ordinary [indigestion](/conditions/indigestion) and with acid reflux ([GERD](/conditions/gerd)), and most people with indigestion do not have an ulcer. Some symptoms, however, suggest bleeding or a more serious problem and need urgent attention; they are listed below.",
    },

    { k: "h2", text: "How it spreads and who is at risk" },
    {
      k: "p",
      text: "Exactly how H. pylori passes from person to person is not fully understood. It is thought to spread through saliva, through contact with vomit or stool, and through contaminated food or water. Infection is more common where:",
    },
    {
      k: "ul",
      items: [
        "Families live in crowded homes and share sleeping space",
        "Clean drinking water is not reliably available",
        "Other members of the household have the infection",
        "Hygiene, such as handwashing after using the toilet and before eating, is difficult",
      ],
    },
    {
      k: "p",
      text: "Infection usually begins in childhood. Factors such as smoking, regular use of painkillers like ibuprofen or aspirin, and alcohol can add to the damage in a stomach that is already inflamed, and make ulcers more likely. Spicy food and stress do not cause H. pylori infection or ulcers, although some people find they worsen symptoms.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Your doctor will ask about your symptoms, medicines (especially painkillers) and family history. Testing is usually advised for people with an ulcer now or in the past, persistent indigestion, a family history of stomach cancer, or certain other conditions. The main tests are:",
    },
    {
      k: "ul",
      items: [
        "**Urea breath test** — you drink a special solution and breathe into a bag; if H. pylori is present it breaks down the solution and releases a gas that the test detects",
        "**Stool antigen test** — a small stool sample is checked for proteins from the bacteria",
        "**Endoscopy** — a thin, flexible camera is passed through the mouth into the stomach under light sedation or a throat spray. The doctor can look for gastritis or ulcers and take a small **biopsy** to test for the bacteria",
        "Blood antibody tests show past exposure but cannot tell whether infection is still active, so they are not usually recommended for diagnosis",
      ],
    },
    {
      k: "p",
      text: "Acid-reducing medicines, antibiotics and bismuth can make breath and stool tests falsely negative, so your doctor may ask you to stop some of them for a period before testing. Do this only on medical advice. An endoscopy is usually advised straight away for people with warning signs, people above a certain age with new symptoms, or those whose symptoms do not improve.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "H. pylori is treated with a combination of medicines taken together for one to two weeks. A typical course includes two or more **antibiotics** along with **acid-reducing medicines**, usually a proton pump inhibitor; some regimens also include bismuth. Taking several medicines at once improves the chance of clearing the bacteria and helps prevent resistance.",
    },
    {
      k: "p",
      text: "It is important to take every dose for the full course, even if you feel better early. Side effects such as a metallic taste, nausea, loose stools or darkened stools with bismuth are common and usually mild; tell your doctor if they are troublesome rather than stopping on your own. Antibiotic resistance is a growing problem, so your doctor will choose the combination based on local patterns and any antibiotics you have taken before.",
    },
    {
      k: "p",
      text: "**Repeat testing**, usually with a breath or stool test at least a few weeks after finishing treatment, is advised to confirm the infection has gone. If it has not, a different combination of medicines is used. Ulcers are also treated with acid-reducing medicines for a longer period to let them heal.",
    },

    { k: "h2", text: "Prevention and living with it" },
    {
      k: "ul",
      items: [
        "Wash hands with soap after using the toilet and before cooking or eating",
        "Drink safe water and eat food that has been prepared hygienically",
        "Avoid regular use of painkillers such as ibuprofen, diclofenac or aspirin without medical advice, especially if you have had an ulcer",
        "Stop smoking and limit alcohol, both of which slow ulcer healing",
        "If a family member is diagnosed and you have symptoms, ask your doctor whether you should be tested too",
      ],
    },
    {
      k: "p",
      text: "There is no vaccine against H. pylori. Reinfection after successful treatment is possible, so the hygiene steps above still matter once the infection has cleared.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if you have:" },
    {
      k: "ul",
      items: [
        "Vomit that contains blood or looks like coffee grounds",
        "Black, tarry or bloody stools",
        "Sudden, severe stomach pain that does not go away, especially if the abdomen is hard",
        "Dizziness, fainting or a racing heartbeat along with stomach symptoms",
      ],
    },
    {
      k: "p",
      text: "See a doctor soon, rather than as an emergency, if you have difficulty swallowing, persistent vomiting, unexplained weight loss, or indigestion that keeps coming back despite treatment.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Many people are tested and treated for H. pylori by a [general physician](/specialties/general-practice) or an [internal medicine specialist](/specialties/internal-medicine). A [gastroenterologist](/specialties/gastroenterology) is the specialist to see if you need an endoscopy, have an ulcer or warning signs, have a family history of stomach cancer, or if the infection has not cleared after treatment. Children with persistent stomach symptoms should see a [paediatrician](/specialties/paediatrics).",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is H. pylori infection contagious?",
      a: "It can pass between people, most likely through saliva, vomit, stool, or contaminated food and water, and it often spreads within families during childhood. Good handwashing and safe drinking water reduce the risk. Partners and family members are not routinely tested unless they have symptoms.",
    },
    {
      q: "Can H. pylori go away on its own?",
      a: "Rarely. Once established, the infection usually persists for years unless it is treated with a combination of antibiotics and acid-reducing medicines. Home remedies and supplements have not been shown to clear it reliably, so speak to your doctor about proper treatment.",
    },
    {
      q: "Does H. pylori mean I will get stomach cancer?",
      a: "No. Most people with H. pylori never develop stomach cancer. Long-standing infection does increase the risk somewhat, which is why doctors recommend treating it once it is found, especially if stomach cancer runs in your family.",
    },
    {
      q: "Why do I need another test after treatment?",
      a: "Treatment does not always clear the bacteria, often because of antibiotic resistance. A breath or stool test some weeks after finishing the medicines confirms whether the infection is gone. If it is still present, your doctor will prescribe a different combination.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Helicobacter pylori Infections", url: "https://medlineplus.gov/helicobacterpyloriinfections.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
