import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "peptic-ulcer",
  title: "Peptic ulcer: symptoms, causes, tests and treatment",
  standfirst: "What stomach and duodenal ulcers are, the two main causes — H. pylori and painkillers — how they are tested for and healed, and the danger signs.",
  targetQuery: "stomach ulcer symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Burning upper abdominal pain", "Indigestion", "Nausea", "Loss of appetite", "Black stools", "Vomiting blood"],
  tests: ["Urea breath test", "Stool antigen test", "Upper GI endoscopy", "Biopsy"],
  treatments: ["Proton pump inhibitors", "H. pylori eradication therapy", "Stopping NSAIDs", "Endoscopic treatment"],
  body: [
    { k: "h2", text: "What a peptic ulcer is" },
    {
      k: "p",
      text: "A peptic ulcer is an open sore in the lining of the stomach (a gastric ulcer) or the first part of the small intestine, the duodenum (a duodenal ulcer). The lining normally protects itself from the strong acid the stomach makes. When that protection breaks down, acid eats into the lining and an ulcer forms.",
    },
    {
      k: "p",
      text: "Most ulcers heal well with treatment, and once the cause is dealt with they usually do not come back. Left untreated, an ulcer can bleed, burn a hole through the wall (perforation) or scar and narrow the stomach outlet — all of which are serious.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Burning upper abdominal pain, in the pit of the stomach, often between meals or at night",
        "Pain that may be eased — or worsened — by food or antacids",
        "Indigestion, bloating and belching",
        "Nausea, and sometimes vomiting",
        "Loss of appetite and weight loss",
      ],
    },
    {
      k: "p",
      text: "Some ulcers cause no pain at all, particularly in older people and those taking painkillers, and are found only when they bleed. Signs of bleeding are black stools that look tarry, vomiting blood or material like coffee grounds, and tiredness or breathlessness from anaemia.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    { k: "p", text: "Two causes account for most ulcers:" },
    {
      k: "ul",
      items: [
        "**Helicobacter pylori (H. pylori)** — a bacterium that lives in the stomach lining. Infection is usually picked up in childhood and is very common in India. Most infected people never get an ulcer, but it is the main cause of duodenal ulcers.",
        "**Painkillers known as NSAIDs** — such as ibuprofen, diclofenac, naproxen and aspirin, including low-dose aspirin for the heart. These are widely available without prescription and are often taken for body pain, joint pain or headache for long periods.",
      ],
    },
    {
      k: "p",
      text: "The risk is higher if you take these painkillers with steroids or blood thinners, are older, smoke or drink heavily, or have had an ulcer before. Stress and spicy food do not cause ulcers, though they may make symptoms feel worse. Rarely, ulcers are caused by a stomach cancer or a hormone-producing tumour, which is why ulcers in the stomach are checked to make sure they heal.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Urea breath test** — you drink a solution and breathe into a bag; it detects active *H. pylori* infection.",
        "**Stool antigen test** — detects *H. pylori* in a stool sample.",
        "**Upper GI endoscopy** — a thin camera passed through the mouth under light sedation shows the ulcer directly.",
        "**Biopsy** — small samples taken during endoscopy test for *H. pylori* and rule out cancer.",
      ],
    },
    {
      k: "p",
      text: "Acid-reducing medicines and antibiotics can make *H. pylori* tests falsely negative, so your doctor may ask you to stop them for a while before testing — only do so on their advice. Blood antibody tests show past infection and are not reliable for confirming current infection. Endoscopy is advised for people with warning signs, older people with new symptoms, and those whose symptoms do not settle.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can test for and treat *H. pylori* and manage uncomplicated symptoms. A [gastroenterologist](/specialties/gastroenterology) performs endoscopy, treats bleeding ulcers, and manages ulcers that do not heal or keep coming back. Perforation or uncontrolled bleeding may need a surgeon.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment heals the ulcer and removes the cause so that it does not return.",
    },
    {
      k: "ul",
      items: [
        "**Proton pump inhibitors** strongly reduce stomach acid and let the ulcer heal, usually over several weeks.",
        "**H. pylori eradication therapy** — a combination of antibiotics with an acid-reducing medicine, taken together for one to two weeks. Take every dose exactly as prescribed: missed doses are a major reason the bacteria survive and become resistant. A test afterwards confirms that the infection has gone.",
        "**Stopping NSAIDs** where possible. If you need a painkiller, ask your doctor about safer options; if you must continue an NSAID or aspirin for your heart, your doctor may add a stomach-protecting medicine. Do not stop prescribed aspirin or blood thinners on your own.",
        "**Endoscopic treatment** to stop a bleeding ulcer, using injections, clips or heat through the endoscope. Surgery is now rarely needed except for perforation or bleeding that cannot be controlled.",
      ],
    },
    {
      k: "p",
      text: "If you live with arthritis or another painful long-term condition, do not simply switch from one painkiller to another bought over the counter. Ask your doctor to review all the pain medicines you take, including gels and combination tablets, because several common products contain NSAIDs under different brand names. Physiotherapy, exercise and other treatments can sometimes reduce the need for them.",
    },
    {
      k: "p",
      text: "A stomach ulcer is usually checked with a repeat endoscopy after treatment to confirm it has healed. Antacids and milk may ease pain briefly but do not heal ulcers.",
    },

    { k: "h2", text: "Living with an ulcer and preventing another" },
    {
      k: "ul",
      items: [
        "Complete the full *H. pylori* treatment and keep the follow-up test",
        "Avoid buying painkillers over the counter; tell every doctor and pharmacist you have had an ulcer",
        "Stop smoking and cut down on alcohol",
        "Ask whether family members with symptoms should be tested for *H. pylori*",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Vomiting blood or material that looks like coffee grounds",
        "Black, tarry or maroon stools",
        "Sudden, severe abdominal pain, especially with a rigid, board-like tummy",
        "Fainting, dizziness, a fast heartbeat or cold, clammy skin",
        "Repeated vomiting and inability to keep food down",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What caused my ulcer — *H. pylori*, painkillers, or something else?",
        "Do I need an endoscopy?",
        "How long should I take acid-reducing medicine?",
        "How will we know the *H. pylori* has gone?",
        "Which painkillers are safe for me in future?",
        "Should my other medicines, such as aspirin or blood thinners, be changed?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can spicy food or stress cause an ulcer?",
      a: "No. Most ulcers are caused by H. pylori infection or by painkillers called NSAIDs. Spicy food, stress and irregular meals can make indigestion feel worse but do not cause ulcers themselves. Treating the real cause is what prevents ulcers coming back.",
    },
    {
      q: "Will my ulcer come back?",
      a: "Once H. pylori has been cleared and NSAIDs have been stopped or protected against, ulcers rarely return. They can recur if the infection was not fully treated, if NSAIDs are restarted without protection, or if you continue to smoke.",
    },
    {
      q: "Is it safe to take acid-reducing tablets long-term?",
      a: "For healing an ulcer, they are usually taken for a few weeks. Some people, such as those who must keep taking aspirin or NSAIDs, need them longer. Long-term use should be reviewed regularly with your doctor rather than continued indefinitely on your own.",
    },
    {
      q: "Should my family be tested for H. pylori?",
      a: "Infection often spreads within families, usually in childhood. Routine testing of everyone is not usually needed, but relatives with ongoing upper abdominal symptoms, or a family history of stomach cancer, should ask their doctor about testing.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Peptic Ulcer", url: "https://medlineplus.gov/pepticulcer.html" },
    { label: "American College of Gastroenterology — Peptic Ulcer Disease", url: "https://gi.org/topics/peptic-ulcer-disease/" },
  ],
};
