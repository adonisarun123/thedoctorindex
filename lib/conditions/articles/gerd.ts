import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "gerd",
  title: "Acid reflux (GERD): symptoms, causes, tests and treatment",
  standfirst: "What acid reflux and GERD are, why heartburn happens, which symptoms need a scope, how it is treated, and when to see a gastroenterologist.",
  targetQuery: "acid reflux GERD symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Heartburn", "Regurgitation", "Sour taste in the mouth", "Chronic cough", "Hoarseness", "Difficulty swallowing"],
  tests: ["Upper GI endoscopy", "pH monitoring", "Oesophageal manometry"],
  treatments: ["Lifestyle changes", "Antacids", "H2 blockers", "Proton pump inhibitors", "Fundoplication"],
  body: [
    { k: "h2", text: "What acid reflux and GERD are" },
    {
      k: "p",
      text: "Where the food pipe (oesophagus) joins the stomach there is a ring of muscle that normally stays closed except when you swallow. If it relaxes at the wrong time or is weak, stomach contents — including acid — flow back up into the oesophagus. This is acid reflux, and most people have it occasionally, for example after a large, late or oily meal.",
    },
    {
      k: "p",
      text: "When reflux happens often, causes troublesome symptoms or damages the lining of the oesophagus, doctors call it gastro-oesophageal reflux disease, usually shortened to GERD (or GORD in British usage). It is a long-term condition, but in most people it is well controlled with changes to daily habits and medicine.",
    },
    {
      k: "p",
      text: "Left untreated for years, repeated acid exposure can inflame and scar the oesophagus, narrow it, or change its lining into a type called Barrett's oesophagus, which carries a small risk of cancer. That is why persistent reflux deserves a proper assessment rather than years of self-treatment.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "The common symptoms are:" },
    {
      k: "ul",
      items: [
        "Heartburn — a burning feeling behind the breastbone, often after meals or when lying down",
        "Regurgitation — food or sour liquid coming back up into the throat or mouth",
        "A sour taste in the mouth, especially in the morning",
        "Belching, bloating or a feeling of fullness",
        "Chronic cough, a frequent need to clear the throat, or hoarseness",
        "Difficulty swallowing, or a feeling of food sticking",
      ],
    },
    {
      k: "p",
      text: "Many people in India describe these symptoms as 'gas' or 'acidity'. Not every burning chest is reflux. Chest pain from the heart can feel very similar, particularly in people with diabetes, so new chest pain should never be assumed to be acidity without a doctor's assessment.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "Reflux is more likely if you:" },
    {
      k: "ul",
      items: [
        "Carry extra weight, particularly around the waist",
        "Eat large meals, eat late at night or lie down soon after eating",
        "Smoke or chew tobacco, or drink alcohol",
        "Have a hiatus hernia, where part of the stomach slides up through the diaphragm",
        "Are pregnant",
        "Take certain medicines, including some painkillers, some blood pressure medicines and some sleeping tablets — never stop a prescribed medicine on your own, but do ask about it",
      ],
    },
    {
      k: "p",
      text: "Spicy, fried and fatty foods, tea, coffee, chocolate, citrus and fizzy drinks trouble some people and not others. Rather than giving up whole groups of food, it is more useful to notice which ones affect you. Long gaps between meals followed by a heavy dinner, a common pattern for people with long working days, often make symptoms worse.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "If you have typical heartburn and regurgitation and no warning signs, a doctor will often diagnose reflux from your symptoms and start a trial of treatment. Tests are used when symptoms do not settle, are unusual, or come with warning signs:",
    },
    {
      k: "ul",
      items: [
        "**Upper GI endoscopy** — a thin flexible camera passed through the mouth, usually under light sedation, to look at the oesophagus, stomach and first part of the small intestine and take biopsies if needed.",
        "**pH monitoring** — a thin tube through the nose or a small capsule attached in the oesophagus records how often acid flows back, usually over a day or more.",
        "**Oesophageal manometry** — measures the pressure and movement of the oesophagus, mainly before surgery or when swallowing is a problem.",
      ],
    },
    {
      k: "p",
      text: "Your doctor may also test for *Helicobacter pylori*, a stomach infection that is common in India and can cause similar upper abdominal symptoms, and may suggest an ECG if there is any doubt about the heart.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Occasional reflux is usually managed by a [general physician](/specialties/general-practice). See a [gastroenterologist](/specialties/gastroenterology) when:",
    },
    {
      k: "ul",
      items: [
        "Symptoms continue despite treatment, or return every time you stop",
        "You have any of the warning signs listed below",
        "You have needed regular acid-reducing medicine for a long time",
        "You are being considered for surgery or an endoscopic procedure",
      ],
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Lifestyle changes" },
    {
      k: "p",
      text: "**Lifestyle changes** help everyone with reflux and are sometimes enough on their own: smaller meals, finishing dinner a few hours before bed, raising the head end of the bed (blocks under the legs work better than extra pillows), losing weight if you carry extra, and stopping tobacco in all forms. Loose clothing around the waist also helps.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Antacids** neutralise acid and give quick, short relief. **H2 blockers** reduce acid production. **Proton pump inhibitors** reduce it more strongly and are the main treatment for GERD and for healing an inflamed oesophagus. They work best taken before a meal, as your doctor directs.",
    },
    {
      k: "p",
      text: "Acid-reducing medicines are widely available over the counter in India, and many people take them for years without review. Long-term use should be a decision made with your doctor, who will aim for the lowest treatment that controls your symptoms. Equally, do not stop a prescribed course abruptly without advice, because symptoms can rebound.",
    },
    { k: "h3", text: "Procedures" },
    {
      k: "p",
      text: "For a minority — people with a large hiatus hernia, severe reflux that medicine does not control, or who do not want lifelong medicine — surgery may be offered. The usual operation is **fundoplication**, in which the top of the stomach is wrapped around the lower oesophagus to strengthen the valve, usually done by keyhole surgery. Some centres offer endoscopic procedures as well. Your gastroenterologist and surgeon will decide based on test results.",
    },

    { k: "h2", text: "Living with reflux" },
    {
      k: "ul",
      items: [
        "Keep a short diary of meals, timing and symptoms for a couple of weeks to spot your own triggers",
        "Avoid lying down, bending or exercising hard straight after eating",
        "Ask before taking painkillers regularly, as some irritate the stomach and oesophagus",
        "If you have Barrett's oesophagus, keep to the endoscopy follow-up your doctor recommends",
      ],
    },

    { k: "h2", text: "Warning signs and emergencies" },
    { k: "p", text: "See a doctor promptly — do not keep treating yourself — if you have:" },
    {
      k: "ul",
      items: [
        "Difficulty swallowing or food sticking",
        "Weight loss you cannot explain, or loss of appetite",
        "Repeated vomiting",
        "Anaemia, or black, tarry stools",
        "New reflux symptoms for the first time in later life",
      ],
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Chest pain with breathlessness, sweating, or pain spreading to the jaw, neck or arm — treat it as a possible heart attack",
        "Vomiting blood or material that looks like coffee grounds",
        "Food stuck in the gullet so that you cannot swallow your own saliva",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this reflux, or could it be something else such as the heart or *H. pylori*?",
        "Do I need an endoscopy, and why or why not?",
        "How long should I take this medicine, and how do I come off it?",
        "Which of my other medicines could be making reflux worse?",
        "What changes to my eating and sleeping would help most?",
        "Am I a candidate for surgery if this does not settle?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is acidity the same as GERD?",
      a: "'Acidity' is a loose everyday word that people use for heartburn, gas, bloating and indigestion. GERD is a specific diagnosis: reflux that is frequent, troublesome or has damaged the oesophagus. A doctor can tell which you have and whether tests are needed.",
    },
    {
      q: "Is it safe to take acid-reducing tablets for a long time?",
      a: "For many people with GERD, long-term treatment is appropriate and the benefits outweigh the risks. But it should be reviewed regularly, at the lowest dose that works, rather than continued indefinitely without a doctor's advice. Do not stop suddenly without checking with your doctor.",
    },
    {
      q: "Can GERD cause a cough or a hoarse voice?",
      a: "Yes. Acid reaching the throat can cause a long-lasting cough, frequent throat clearing or hoarseness, sometimes without much heartburn. Other causes such as asthma or a voice-box problem also need to be considered, so an ENT or chest specialist may be involved.",
    },
    {
      q: "Do I have to give up spicy food?",
      a: "Not necessarily. Spicy food triggers symptoms in some people and not others. Meal size and timing, weight and tobacco usually matter more. Notice what affects you and adjust that, rather than following a long list of banned foods.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — GERD", url: "https://medlineplus.gov/gerd.html" },
    { label: "American College of Gastroenterology — Acid Reflux/GERD", url: "https://gi.org/topics/acid-reflux/" },
  ],
};
