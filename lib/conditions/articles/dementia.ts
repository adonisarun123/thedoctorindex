import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "dementia",
  title: "Dementia: early signs, diagnosis, treatment and support for carers",
  metaTitle: "Dementia: signs, diagnosis, treatment and carer support",
  standfirst: "What dementia is, how it differs from normal forgetfulness, how it is assessed, what treatment can do, and how families and carers can get support.",
  targetQuery: "dementia symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["psychiatry", "geriatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Memory loss", "Confusion", "Difficulty finding words", "Getting lost", "Changes in mood or behaviour"],
  tests: ["Cognitive assessment", "Blood tests", "MRI", "CT scan"],
  treatments: ["Cholinesterase inhibitors", "Memantine", "Cognitive stimulation", "Carer support"],
  body: [
    { k: "h2", text: "What dementia is" },
    {
      k: "p",
      text: "Dementia is a general term for a group of conditions in which memory, thinking, language and judgement decline enough to interfere with everyday life. It is caused by diseases that damage the brain over time. It is not a normal part of ageing, even though it becomes more common with age.",
    },
    {
      k: "p",
      text: "The most common cause is **Alzheimer's disease**. Others include vascular dementia, caused by reduced blood flow to the brain, often after strokes; dementia with Lewy bodies; frontotemporal dementia, which can start earlier in life and often affects behaviour first; and mixed dementia, where more than one cause is present.",
    },
    {
      k: "p",
      text: "Some forgetfulness is normal with age — misplacing keys or forgetting a name and remembering it later. In dementia, problems are more persistent and gradually worsen, for example forgetting recent conversations entirely, repeating the same questions, or struggling with tasks that were once routine.",
    },

    { k: "h2", text: "Signs and symptoms" },
    {
      k: "ul",
      items: [
        "Memory loss, especially for recent events, conversations and appointments",
        "Confusion about time, date or place",
        "Difficulty finding words or following a conversation",
        "Getting lost in familiar places",
        "Trouble handling money, cooking or managing medicines",
        "Poor judgement, such as falling for scams or dressing unsuitably for the weather",
        "Changes in mood or behaviour — irritability, suspicion, withdrawal, anxiety or low mood",
        "In later stages, difficulty walking, swallowing and recognising people",
      ],
    },
    {
      k: "p",
      text: "Families often notice changes before the person does. Early dementia is often put down to old age or stress and accepted without assessment. It is worth getting checked, because some causes of memory problems are treatable, and an early diagnosis allows planning.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "Age is the biggest risk factor, but several risk factors can be changed. Risk is higher with:" },
    {
      k: "ul",
      items: [
        "High blood pressure, diabetes and high cholesterol, particularly in middle age",
        "Smoking and heavy alcohol use",
        "Physical inactivity and obesity",
        "Hearing loss that is not treated",
        "Depression, social isolation and fewer years of formal education",
        "Head injuries and previous strokes",
        "A family history of dementia, and Down syndrome",
      ],
    },
    {
      k: "p",
      text: "Looking after blood pressure, blood sugar, hearing and physical activity is good for the brain at any age.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Diagnosis starts with a detailed history from the person and from someone who knows them well. The doctor will do a **cognitive assessment** — a set of questions and tasks that test memory, attention, language and problem-solving — and a physical examination.",
    },
    {
      k: "p",
      text: "**Blood tests** look for treatable causes or contributors, such as low thyroid, vitamin B12 deficiency, anaemia, infections, kidney or liver problems and uncontrolled sugar. A brain scan, either an **MRI** or a **CT scan**, can show strokes, shrinkage of particular areas, tumours or fluid build-up. The doctor will also review medicines, because some sleeping tablets, bladder medicines and others can cause confusion. Depression can mimic dementia in older people and needs to be considered.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A general physician can start the assessment. A [neurologist](/specialties/neurology) diagnoses the type of dementia and leads treatment. A [psychiatrist](/specialties/psychiatry), particularly one who specialises in older adults, helps with mood, anxiety, sleep and behaviour changes. A [geriatrician](/specialties/geriatrics) looks after older people with several health problems and many medicines. Many hospitals have memory clinics that bring these specialists together.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [psychiatrists](/doctors/karnataka/bengaluru/psychiatrists) and [geriatricians](/doctors/karnataka/bengaluru/geriatricians) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no cure for most types of dementia, but treatment can ease symptoms, keep people independent for longer and improve quality of life for both the person and the family.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Cholinesterase inhibitors**, such as donepezil, rivastigmine and galantamine, can modestly help memory and daily function in Alzheimer's disease and some other dementias. **Memantine** is used in moderate to severe stages. Newer antibody treatments for early Alzheimer's are available in some countries for carefully selected people; they need specialist assessment and close monitoring. For vascular dementia, controlling blood pressure, sugar and cholesterol helps slow further damage.",
    },
    {
      k: "p",
      text: "Medicines for sleep, agitation or hallucinations are used cautiously, because some can increase confusion, falls and other risks in people with dementia. Do not give sleeping tablets without advice.",
    },
    { k: "h3", text: "Non-drug approaches" },
    {
      k: "p",
      text: "**Cognitive stimulation** — activities such as discussion groups, puzzles, music and reminiscence — can help thinking and mood. A daily routine, regular exercise, social contact, and treating hearing and vision problems all make a difference. Occupational therapists can suggest changes to make the home safer.",
    },
    { k: "h3", text: "Carer support" },
    {
      k: "p",
      text: "**Carer support** is part of treatment. Caring for someone with dementia is demanding, and carers are at risk of exhaustion and depression themselves. Learn about the condition, share tasks within the family, take regular breaks, and ask the care team about counselling and day-care options. In India, the Alzheimer's and Related Disorders Society of India (ARDSI) offers helplines, counselling, day care and training for families through its chapters. The WHO's iSupport programme is a self-help course that teaches carers practical skills and ways to manage stress.",
    },

    { k: "h2", text: "Living with dementia and planning ahead" },
    {
      k: "p",
      text: "After a diagnosis, while the person can still take part, talk about future wishes for care, money and property, and who should make decisions if they no longer can. Keep important documents together. Use reminders, labelled cupboards and a large calendar. Make sure the person carries identification and a contact number in case they get lost. Review driving, cooking with gas and handling money as the condition progresses.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Sudden worsening of confusion over hours or a day or two — often caused by infection, dehydration or a medicine, and treatable",
        "Signs of a stroke: face drooping, arm weakness, slurred speech",
        "A fall with injury, or inability to get up",
        "Choking or difficulty breathing",
        "The person is missing and may be in danger",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of dementia is it, and how sure are we?",
        "Could any treatable cause or medicine be contributing?",
        "Would medicines help, and what side effects should we watch for?",
        "How is the condition likely to change, and how quickly?",
        "What support is available for carers?",
        "What should we plan for now, while decisions can still be shared?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is memory loss in old age always dementia?",
      a: "No. Mild forgetfulness is common with age and does not affect daily life. Memory problems can also be caused by depression, thyroid problems, vitamin B12 deficiency, poor sleep or medicines. A doctor can assess whether the changes suggest dementia.",
    },
    {
      q: "Can dementia be prevented?",
      a: "There is no sure way to prevent dementia, but you can lower your risk. Control blood pressure, diabetes and cholesterol, stay physically and socially active, treat hearing loss, avoid smoking and limit alcohol. These steps are useful at any age.",
    },
    {
      q: "Is dementia hereditary?",
      a: "Most dementia is not directly inherited, although having a close relative with it slightly raises the risk. A small number of families carry genes that cause Alzheimer's disease or frontotemporal dementia at a younger age. A neurologist can advise if several family members are affected.",
    },
    {
      q: "How can I cope as a carer?",
      a: "Ask for help early, share responsibilities with other family members, and take regular breaks. Talk to the care team about counselling, day care and respite. Support groups and organisations such as ARDSI can connect you with others in the same situation.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Dementia", url: "https://medlineplus.gov/dementia.html" },
    { label: "World Health Organization — Dementia fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/dementia" },
    { label: "Alzheimer's and Related Disorders Society of India (ARDSI)", url: "https://ardsi.org/" },
  ],
};
