import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "cholera",
  title: "Cholera: symptoms, causes, treatment and which doctor to see",
  standfirst: "What cholera is, how it spreads through water and food, the danger signs of dehydration, how ORS and fluids save lives, and when to get urgent care.",
  targetQuery: "cholera symptoms and treatment",
  department: "infectious-diseases",
  specialty: "infectious-diseases",
  alsoSee: ["general-practice", "paediatrics", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Watery diarrhoea", "Vomiting", "Dehydration", "Leg cramps"],
  tests: ["Stool culture", "Rapid diagnostic test"],
  treatments: ["ORS", "Intravenous fluids", "Antibiotics", "Zinc"],
  body: [
    { k: "h2", text: "What cholera is" },
    {
      k: "p",
      text: "Cholera is an infection of the small intestine caused by the bacterium Vibrio cholerae. The bacteria produce a toxin that makes the gut pour out large amounts of water and salts, which leads to sudden, profuse, watery diarrhoea. The danger in cholera is not the infection itself but the speed at which the body can lose fluid. Without replacement, severe dehydration can develop within hours and can be fatal, in adults as well as children.",
    },
    {
      k: "p",
      text: "The good news is that cholera is very treatable. Almost everyone recovers if lost fluid and salts are replaced quickly enough, most often with oral rehydration solution taken by mouth. Many people who swallow the bacteria have only mild illness or none at all, but they can still pass the bacteria in their stool for some days and spread it to others.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start suddenly, from a few hours to a few days after swallowing contaminated water or food:",
    },
    {
      k: "ul",
      items: [
        "Large amounts of watery diarrhoea, often pale and cloudy, described as looking like rice water",
        "Vomiting, sometimes repeated",
        "Leg cramps and muscle cramps caused by the loss of salts",
        "Signs of dehydration: great thirst, dry mouth, sunken eyes, passing little or no urine, a fast heartbeat, dizziness and weakness",
        "In children, unusual sleepiness, crying without tears and a sunken soft spot on a baby's head",
      ],
    },
    {
      k: "p",
      text: "Fever is uncommon in cholera, and stomach pain is usually mild. Many other infections cause diarrhoea; see our pages on [diarrhoea](/conditions/diarrhea) and [gastroenteritis](/conditions/gastroenteritis). What should raise concern about cholera is very large volumes of watery stool, rapid weakness and several people falling ill at the same time from the same water source.",
    },

    { k: "h2", text: "How cholera spreads and who is at risk in India" },
    {
      k: "p",
      text: "Cholera spreads when food or water is contaminated with the stool of an infected person. It does not usually spread through casual contact such as shaking hands or sitting next to someone. Situations that raise the risk include:",
    },
    {
      k: "ul",
      items: [
        "Drinking untreated water from wells, tanks, rivers or leaking pipelines that run close to sewage lines",
        "Flooding and waterlogging during the monsoon, when drains overflow into drinking water sources",
        "Eating raw or undercooked seafood, especially shellfish, from contaminated water",
        "Cut fruit, salads, chutneys, ice and drinks made with unsafe water, including from roadside stalls",
        "Crowded settlements and relief camps without enough clean water and toilets",
        "Not washing hands with soap after using the toilet or before cooking and eating",
      ],
    },
    {
      k: "p",
      text: "Outbreaks in India tend to be reported during the monsoon and summer months, often linked to a contaminated local water supply. Young children, older people and anyone who is already weak or malnourished become dehydrated faster and are at greater risk of serious illness.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Treatment should never wait for a test result. A doctor will start rehydration based on the symptoms and the degree of dehydration, which is judged by checking alertness, thirst, the eyes, skin elasticity, pulse and urine output. Tests help confirm the cause and track outbreaks:",
    },
    {
      k: "ul",
      items: [
        "**Stool culture** — a stool sample is grown in the laboratory to identify the cholera bacteria and see which antibiotics work against them",
        "**Rapid diagnostic test** — a dipstick test on stool used in some outbreak settings to screen for cholera quickly; positive results are usually confirmed by culture",
        "Blood tests for salts and kidney function in people who are severely ill",
      ],
    },
    {
      k: "p",
      text: "If cholera is confirmed, local health authorities are usually informed so they can check the water supply and look for other cases.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Oral rehydration" },
    {
      k: "p",
      text: "**ORS** (oral rehydration solution) is the mainstay of treatment. It contains the right balance of salts and sugar to help the gut absorb water. Packets are widely available at pharmacies and government health centres. Mix one packet with the amount of clean water printed on the packet, no more and no less, and sip it frequently. Keep giving ORS for as long as the diarrhoea continues. Babies should continue breastfeeding throughout.",
    },
    {
      k: "p",
      text: "Home-made sugar and salt drinks are not as reliable as ORS because the balance is easy to get wrong; if no ORS is available, start giving fluids anyway while you get medical help, rather than waiting. Plain water, soft drinks and fruit juices do not replace salts, and sugary drinks can make diarrhoea worse.",
    },
    { k: "h3", text: "Hospital treatment" },
    {
      k: "p",
      text: "People with severe dehydration, or who cannot keep fluids down because of vomiting, need **intravenous fluids** given through a drip in hospital, followed by ORS once they can drink. With prompt fluids, even very ill patients usually recover within a few days.",
    },
    {
      k: "p",
      text: "**Antibiotics** may be given to people with moderate or severe illness, because they can shorten the illness and reduce how long bacteria are passed in the stool. They are an addition to fluids, never a replacement, and the choice depends on local resistance patterns. For children with diarrhoea, doctors in India commonly add **zinc** for a short course, which helps recovery. Avoid medicines that stop diarrhoea unless a doctor advises them.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Drink water that has been boiled, properly filtered or chlorinated, or sealed bottled water; be especially careful during the monsoon and after floods",
        "Use safe water for brushing teeth, washing fruit and vegetables and making ice",
        "Eat food that is freshly cooked and served hot; avoid raw seafood and cut fruit or salads from roadside stalls",
        "Wash hands with soap and water after using the toilet, after cleaning a child, and before cooking and eating",
        "Use a toilet and keep latrines away from water sources",
        "If someone at home has cholera, wash their clothes and bedding separately and disinfect the toilet",
      ],
    },
    {
      k: "p",
      text: "Oral cholera vaccines exist and are used in some outbreak and high-risk settings, but they are not part of routine immunisation for most people in India and do not replace safe water and hygiene. If you are travelling to an area with an ongoing outbreak, ask your doctor whether vaccination is appropriate for you.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Cholera can become dangerous within hours. Call 112 or 108, or go to the nearest hospital or emergency department at once, if:" },
    {
      k: "ul",
      items: [
        "Diarrhoea is very heavy and watery, especially if several people in the area are ill",
        "The person cannot drink or keeps vomiting up ORS",
        "Little or no urine has been passed for several hours",
        "There is extreme weakness, dizziness on standing, confusion or drowsiness",
        "A child is unusually sleepy, floppy, has sunken eyes or cries without tears",
      ],
    },
    {
      k: "p",
      text: "While you get help, keep giving ORS in small, frequent sips, even if there is some vomiting.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Anyone with heavy watery diarrhoea and signs of dehydration needs to be seen the same day, at a government health centre, a [general physician](/specialties/general-practice) or a hospital emergency department. A [paediatrician](/specialties/paediatrics) should see infants and young children. An [infectious disease specialist](/specialties/infectious-diseases) is usually involved in hospital when illness is severe, the diagnosis is uncertain, or there is an outbreak to investigate.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can cholera be treated at home?",
      a: "Mild cases can often be managed at home with ORS, given frequently and continued while the diarrhoea lasts, under a doctor's advice. Anyone who cannot keep fluids down, passes little urine, or becomes very weak or drowsy needs hospital care straight away.",
    },
    {
      q: "How quickly does cholera become dangerous?",
      a: "Severe cholera can cause dangerous dehydration within hours of the first loose stool, because the volume of fluid lost is so large. This is why rehydration should start immediately with ORS, without waiting for a test result or a hospital appointment.",
    },
    {
      q: "Is cholera contagious from person to person?",
      a: "Cholera mostly spreads through water or food contaminated with an infected person's stool, not through casual contact. Careful handwashing, safe disposal of stool and keeping a sick person's clothes and bedding separate greatly reduce the chance of spread within a household.",
    },
    {
      q: "Can I get cholera more than once?",
      a: "Yes. Having cholera gives some protection for a while, but it is not lifelong, and reinfection is possible, particularly where water and sanitation remain unsafe. Safe drinking water, food hygiene and handwashing remain the best protection for everyone.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Cholera", url: "https://medlineplus.gov/cholera.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
