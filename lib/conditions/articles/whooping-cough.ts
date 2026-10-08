import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "whooping-cough",
  title: "Whooping cough (pertussis): symptoms, treatment and vaccination",
  metaTitle: "Whooping cough (pertussis): symptoms and treatment",
  standfirst: "How whooping cough starts like a cold, why it is dangerous for babies, the tests and antibiotics used, the vaccines that protect, and when to get help.",
  targetQuery: "whooping cough symptoms in babies and children",
  department: "infectious-diseases",
  specialty: "paediatrics",
  alsoSee: ["general-practice", "pulmonology", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Runny nose", "Mild fever", "Coughing fits", "Whoop", "Vomiting after coughing", "Pauses in breathing"],
  tests: ["Nose or throat swab", "Blood tests", "Chest X-ray"],
  treatments: ["Antibiotics", "Hospital care", "Fluids", "Vaccination"],
  body: [
    { k: "h2", text: "What whooping cough is" },
    {
      k: "p",
      text: "Whooping cough, or **pertussis**, is a highly contagious bacterial infection of the airways caused by *Bordetella pertussis*. It causes severe fits of coughing that can last for weeks. The name comes from the 'whoop' sound some people make as they gasp for breath after a coughing fit. It is sometimes called the 'hundred-day cough' because of how long the cough can last.",
    },
    {
      k: "p",
      text: "Anyone can get whooping cough, including adults, but it is most dangerous for **babies**, especially those too young to have completed their vaccines. Many babies with whooping cough need hospital care, and it can be life-threatening for them. Older children and adults often have a milder illness, but they can pass the infection to infants at home.",
    },

    { k: "h2", text: "How it spreads" },
    {
      k: "p",
      text: "The bacteria spread through droplets when an infected person coughs, sneezes or breathes close to others, and sometimes from touching contaminated surfaces and then the nose or mouth. People are most infectious in the early, cold-like stage and in the first weeks of the cough. Antibiotics shorten the time a person can spread it.",
    },
    {
      k: "p",
      text: "Protection from vaccination or from having had the illness wears off over the years, so teenagers and adults can catch it again. A brother, sister, parent or grandparent with a 'lingering cough' is often how a baby is infected.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually begin about one to two weeks after exposure, though sometimes later. The illness often develops in stages:",
    },
    {
      k: "ul",
      items: [
        "**Early stage (one to two weeks):** runny nose, mild fever and an occasional mild cough — much like a common cold.",
        "**Coughing stage:** coughing fits of many rapid coughs in a row, followed by a high-pitched whoop as the person breathes in. The face may turn red or blue. Vomiting after coughing is common, and the person is often exhausted afterwards. Fits are frequently worse at night and can continue for weeks.",
        "**Recovery stage:** the cough slowly becomes milder and less frequent. Coughing fits can return with later colds, even months afterwards.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Babies may not whoop at all",
      text: "Young babies may cough only a little or not at all. Instead they may have pauses in breathing (apnoea), struggle to breathe, gag, or turn blue or grey. A baby with any pause in breathing or a change in colour needs emergency care.",
    },
    {
      k: "p",
      text: "Between fits, the person may look quite well, which can make the illness easy to underestimate. Adults and teenagers may have only a long-lasting, nagging cough.",
    },

    { k: "h2", text: "Complications" },
    {
      k: "p",
      text: "In babies, whooping cough can cause [pneumonia](/conditions/pneumonia), dangerous pauses in breathing, dehydration and weight loss from vomiting and poor feeding, seizures and, rarely, brain damage. In older children and adults, the force of coughing can cause broken blood vessels in the eyes, rib pain or a cracked rib, hernias, poor sleep and loss of bladder control.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Doctors often suspect whooping cough from the typical coughing fits, the whoop, vomiting after coughing, or a cough lasting more than two weeks, especially if a baby is unwell or someone at home has a long cough. Tests that may be used include:",
    },
    {
      k: "ul",
      items: [
        "**Nose or throat swab** — a sample of mucus from the back of the nose is tested for the bacteria, usually by a PCR test or culture. It works best in the first few weeks of the illness.",
        "**Blood tests** — to look for antibodies, or for a raised white cell count, which is common in babies with pertussis.",
        "**Chest X-ray** — to check for pneumonia.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Antibiotics** are the main treatment. Started early, they can make the illness less severe and stop it spreading. Given later in the illness, they mainly reduce spread, because the cough is caused by damage the bacteria have already done. Complete the full course.",
        "**Hospital care** is often needed for babies, and for anyone with breathing pauses, blue spells, severe fits, dehydration or pneumonia. Treatment may include oxygen, suction of mucus, and feeding support.",
        "**Fluids** and small, frequent feeds or meals, since coughing can trigger vomiting.",
        "Rest in a calm, smoke-free room; avoid triggers such as smoke, dust and strong smells.",
      ],
    },
    {
      k: "p",
      text: "Cough syrups and cold medicines do not help the coughing fits and may be unsafe for young children, so avoid them unless a doctor advises. Stay away from school, crèche or work until your doctor says you are no longer infectious. Your doctor may also recommend antibiotics for close contacts, especially households with a baby or a pregnant woman, even if they have no symptoms.",
    },

    { k: "h2", text: "Prevention and vaccination" },
    {
      k: "p",
      text: "**Vaccination** is the most effective protection. In India, pertussis vaccine is given as part of combination vaccines, such as the pentavalent and DPT vaccines, in the national immunisation schedule. Babies receive a series of doses in the first months of life, followed by boosters in early childhood. Make sure each dose is given on time, and check your child's immunisation card with your paediatrician if any were missed.",
    },
    {
      k: "p",
      text: "Because protection fades with age, some doctors recommend a pertussis booster for older children, adults or pregnant women to help protect newborns; guidance varies, so ask your doctor or obstetrician whether it is advised for you. Other ways to protect babies:",
    },
    {
      k: "ul",
      items: [
        "Keep babies away from anyone with a cough, cold or fever",
        "Wash hands often with soap and water, and cover coughs and sneezes with a tissue or sleeve",
        "Have anyone at home with a cough lasting more than two weeks checked by a doctor",
        "Keep the home free of tobacco smoke",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest hospital straight away, if:" },
    {
      k: "ul",
      items: [
        "A baby has any pause in breathing, or turns blue or grey",
        "Anyone struggles to breathe or cannot catch their breath after a coughing fit",
        "A child is very drowsy, floppy, or has a seizure",
        "A baby is not feeding, or there are signs of dehydration such as very few wet nappies",
        "There is high fever with fast breathing, which may mean pneumonia",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Babies and children with a possible whooping cough should see a [paediatrician](/specialties/paediatrics), and young babies often need hospital assessment. Adults with a long-lasting cough can see a [general physician](/specialties/general-practice); a [pulmonologist](/specialties/pulmonology) may help when a cough persists or other lung conditions such as [asthma](/conditions/asthma) need to be ruled out.",
    },
    {
      k: "p",
      text: "You can [find paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Does this cough need a swab test for whooping cough?",
        "Should other people at home, especially a baby or pregnant woman, take antibiotics?",
        "Which signs mean we should go to hospital?",
        "When can my child return to school or crèche?",
        "Are my child's vaccinations, and mine, up to date?",
      ],
    },
  ],
  faqs: [
    {
      q: "How long does whooping cough last?",
      a: "The cough can last for many weeks, which is why it is sometimes called the hundred-day cough. Coughing fits are usually worst in the first few weeks, then gradually ease. Later colds can bring the fits back for a while, even months after the infection has cleared.",
    },
    {
      q: "Can adults get whooping cough if they were vaccinated as children?",
      a: "Yes. Protection from childhood vaccines and from past infection fades over time. Adults often have a milder illness, sometimes just a stubborn cough, but they can still pass it to babies. A doctor can test for it and advise whether a booster is suitable.",
    },
    {
      q: "Why do antibiotics not stop the cough straight away?",
      a: "By the time coughing fits begin, the bacteria have already damaged the lining of the airways. Antibiotics clear the bacteria and stop the infection spreading, but the airways need weeks to heal, so the cough continues even after a full course.",
    },
    {
      q: "Is whooping cough the same as diphtheria?",
      a: "No. They are different bacterial infections, though both can affect the airways and both are prevented by the same combination vaccines given in infancy. [Diphtheria](/conditions/diphtheria) typically causes a sore throat with a grey coating, while whooping cough causes long coughing fits.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Whooping Cough", url: "https://medlineplus.gov/whoopingcough.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
