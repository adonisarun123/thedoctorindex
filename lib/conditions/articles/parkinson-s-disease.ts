import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "parkinson-s-disease",
  title: "Parkinson's disease: early signs, diagnosis, treatment and support",
  metaTitle: "Parkinson's disease: signs, treatment and which doctor",
  standfirst: "What Parkinson's disease is, the early signs beyond tremor, how a neurologist diagnoses it, how medicines and therapy help, and living well with it.",
  targetQuery: "parkinson's disease symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["physiotherapy", "geriatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tremor", "Slowness of movement", "Stiffness", "Balance problems", "Loss of smell", "Constipation"],
  tests: ["Neurological examination", "MRI", "Levodopa response"],
  treatments: ["Levodopa", "Dopamine agonists", "Physiotherapy", "Deep brain stimulation"],
  body: [
    { k: "h2", text: "What Parkinson's disease is" },
    {
      k: "p",
      text: "Parkinson's disease is a long-term condition in which nerve cells in a part of the brain that controls movement gradually stop working and die. These cells make dopamine, a chemical messenger that helps movements run smoothly. As dopamine falls, movement becomes slower, stiffer and less steady.",
    },
    {
      k: "p",
      text: "Parkinson's is progressive, meaning it changes slowly over years, but the pace differs a great deal between people. It is not only a movement condition: it can also affect sleep, mood, memory, the bowel, the bladder and blood pressure. There is no cure yet, but treatment can control symptoms well for many years.",
    },
    {
      k: "p",
      text: "Not every tremor is Parkinson's. A common condition called essential tremor causes shaking of the hands when they are being used, and several other conditions can look like Parkinson's. Getting the diagnosis right matters because the treatments differ.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually begin on one side of the body and come on gradually. The main movement symptoms are:" },
    {
      k: "ul",
      items: [
        "Tremor — shaking, usually of one hand, that is most noticeable at rest and settles when the hand is used",
        "Slowness of movement — tasks such as buttoning clothes, writing or turning in bed take longer; handwriting becomes small",
        "Stiffness of the muscles, sometimes felt as aching in the shoulder or arm",
        "Balance problems and a shuffling walk with smaller steps and less arm swing, usually later in the condition",
        "A softer voice and a less expressive face",
      ],
    },
    {
      k: "p",
      text: "Other symptoms can appear years before the movement problems. They include loss of smell, constipation, acting out dreams during sleep, low mood or anxiety, and dizziness on standing. Later, some people develop memory and thinking problems, swallowing difficulties or hallucinations.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The cause in most people is not known. It is thought to involve a combination of ageing, inherited tendency and environmental factors. Risk is higher with:",
    },
    {
      k: "ul",
      items: [
        "Increasing age — it usually starts after the age of fifty, although young-onset Parkinson's occurs",
        "Being male",
        "A close relative with Parkinson's; a small number of cases are caused by specific genes",
        "Long-term exposure to some pesticides and chemicals",
        "Repeated head injuries",
      ],
    },
    {
      k: "p",
      text: "Some medicines, including certain anti-sickness tablets and antipsychotics, can cause Parkinson-like symptoms, which usually improve when the medicine is stopped by a doctor. Bring a list of all your medicines to the appointment.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no single blood test or scan that proves Parkinson's disease. The diagnosis is clinical: a neurologist takes a detailed history and does a **neurological examination**, looking for slowness, stiffness, tremor and changes in walking and balance.",
    },
    {
      k: "p",
      text: "An **MRI** of the brain is usually normal in Parkinson's but may be done to rule out other causes, such as small strokes or fluid on the brain. The **levodopa response** — clear improvement after starting levodopa — supports the diagnosis. In uncertain cases, a specialised scan of the brain's dopamine system may be arranged. The diagnosis is reviewed over time, because some similar conditions show their differences only as they progress.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [neurologist](/specialties/neurology), ideally one with an interest in movement disorders, should confirm the diagnosis and lead treatment. A [geriatrician](/specialties/geriatrics) can help older people with several conditions, falls or many medicines. [Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, are key to keeping walking, balance and strength. Speech and language therapists, occupational therapists and dietitians help as needs change.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [geriatricians](/doctors/karnataka/bengaluru/geriatricians) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Levodopa**, usually combined with carbidopa, is converted into dopamine in the brain and is the most effective medicine for movement symptoms. **Dopamine agonists**, which act like dopamine, and MAO-B inhibitors are other options, particularly in younger people or early on. Other medicines can be added to smooth out the effect through the day.",
    },
    {
      k: "p",
      text: "Over the years, the effect of each dose may wear off sooner, and some people develop extra, involuntary movements. These can usually be managed by adjusting the timing and combination of medicines. Dopamine agonists can occasionally cause compulsive behaviour such as gambling, shopping or overeating; families should tell the doctor if they notice this.",
    },
    {
      k: "note",
      text: "Take Parkinson's medicines at the times prescribed, and never stop them suddenly — this can cause a serious reaction with high fever and severe stiffness. If you are admitted to hospital, make sure the staff know your medicine timings.",
    },
    { k: "h3", text: "Therapy and exercise" },
    {
      k: "p",
      text: "**Physiotherapy** and regular exercise — walking, cycling, dancing, yoga or tai chi — improve walking, balance and mood, and are recommended from the time of diagnosis. Speech therapy helps a soft voice and swallowing problems.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "**Deep brain stimulation** involves placing fine electrodes in the brain, connected to a device under the skin of the chest. It can help selected people whose symptoms fluctuate a lot or who have troublesome involuntary movements despite good medicine adjustments. Your neurologist will decide whether you are suitable.",
    },

    { k: "h2", text: "Living with Parkinson's" },
    {
      k: "p",
      text: "Stay active and keep doing the things you enjoy. Reduce fall risks at home with good lighting, grab bars and removing loose rugs. Eat fibre and drink enough fluids for constipation. Protein-rich meals can affect how well levodopa is absorbed in some people; ask your doctor whether timing doses away from meals would help. Low mood, sleep problems and memory changes are part of the condition and treatable, so mention them. Regular reviews let the team adjust treatment as needs change.",
    },
    {
      k: "p",
      text: "Family members and carers often take on a lot. Ask the team about practical help, and look after your own health and rest too.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "High fever, severe stiffness and confusion, especially after missing or stopping medicines",
        "A fall with a head injury, or inability to get up after a fall",
        "Choking, or coughing and breathlessness after eating, which can suggest food going into the lungs",
        "Sudden weakness on one side, slurred speech or other stroke signs",
        "Sudden severe confusion or hallucinations",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is Parkinson's disease?",
        "Which medicine should I start with, and why?",
        "How should I time my doses around meals?",
        "What exercise or physiotherapy should I be doing?",
        "Which side effects should I report straight away?",
        "What support is available for my family?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is every tremor a sign of Parkinson's disease?",
      a: "No. Many tremors have other causes, such as essential tremor, an overactive thyroid, anxiety, caffeine or some medicines. A Parkinson's tremor typically appears at rest and comes with slowness and stiffness. A neurologist can tell the difference.",
    },
    {
      q: "Does levodopa stop working after a few years?",
      a: "Levodopa keeps working, but as Parkinson's progresses each dose may last for a shorter time and the response may become less steady. Doctors manage this by changing dose timing and adding other medicines. Delaying levodopa does not protect its future effect.",
    },
    {
      q: "Is Parkinson's disease hereditary?",
      a: "Most people with Parkinson's do not have an affected relative. A small number of cases are linked to particular genes, more often when it starts at a young age or several family members are affected. Your neurologist can advise on whether genetic testing is useful.",
    },
    {
      q: "Can exercise really help Parkinson's?",
      a: "Yes. Regular exercise improves walking, balance, flexibility, strength and mood in people with Parkinson's disease. A physiotherapist can design a safe programme, and activities such as walking, dancing, yoga and cycling can be continued for years.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Parkinson's Disease", url: "https://medlineplus.gov/parkinsonsdisease.html" },
    { label: "World Health Organization — Parkinson disease fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/parkinson-disease" },
  ],
};
