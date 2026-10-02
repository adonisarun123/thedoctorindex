import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "insomnia",
  title: "Insomnia: causes, CBT-I, sleeping pills and which doctor to see",
  metaTitle: "Insomnia: causes, treatment and which doctor to see",
  standfirst: "Why insomnia happens, how it is assessed, why CBT-I is the first treatment, why sleeping pills are for short-term use only, and when to see a doctor.",
  targetQuery: "insomnia causes and treatment",
  department: "neurology",
  specialty: "general-practice",
  alsoSee: ["psychiatry", "clinical-psychology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Difficulty falling asleep", "Waking during the night", "Waking too early", "Daytime tiredness", "Poor concentration", "Irritability"],
  tests: ["Sleep diary", "Sleep study"],
  treatments: ["CBT-I", "Sleep hygiene", "Sleeping pills"],
  body: [
    { k: "h2", text: "What insomnia is" },
    {
      k: "p",
      text: "Insomnia means having trouble falling asleep, staying asleep or waking too early, even when you have the chance to sleep, and feeling the effects during the day. Almost everyone has a bad night now and then. Insomnia becomes a problem when it happens regularly and affects your mood, energy, work or relationships.",
    },
    {
      k: "p",
      text: "Doctors separate *short-term insomnia*, which lasts days or weeks and usually follows a stressful event, illness or travel, from *chronic insomnia*, which happens on several nights a week for three months or more. Chronic insomnia often continues even after the original trigger has gone, because worry about sleep and habits around sleep keep it going.",
    },
    {
      k: "p",
      text: "How much sleep a person needs varies. What matters is whether you feel rested and function well during the day, not whether you reach a particular number of hours.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Difficulty falling asleep — lying awake for a long time after going to bed",
        "Waking during the night and finding it hard to get back to sleep",
        "Waking too early and being unable to fall asleep again",
        "Feeling unrefreshed after sleep",
        "Daytime tiredness, low energy or sleepiness",
        "Poor concentration and memory",
        "Irritability, low mood or anxiety, often including worry about sleep itself",
      ],
    },
    {
      k: "p",
      text: "Loud snoring, pauses in breathing, gasping at night or falling asleep easily during the day suggest a different problem, such as [sleep apnoea](/conditions/sleep-apnea), which needs its own assessment.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "Insomnia usually has more than one cause. Common contributors include:" },
    {
      k: "ul",
      items: [
        "Stress about work, exams, money, relationships or health",
        "Depression and anxiety, which commonly cause and are worsened by poor sleep",
        "Irregular schedules, night shifts and long-distance travel",
        "Screens and work late into the night, and an uncomfortable, noisy or bright bedroom",
        "Tea, coffee, energy drinks, tobacco or alcohol, especially later in the day",
        "Pain, breathlessness, frequent urination at night, reflux, hot flushes and thyroid problems",
        "Some medicines, including certain steroids, decongestants and antidepressants",
        "Increasing age, and being a woman",
      ],
    },

    { k: "h2", text: "How it is assessed" },
    {
      k: "p",
      text: "Insomnia is diagnosed from your sleep history. The doctor will ask about your routine, what happens when you try to sleep, how long the problem has lasted, your mood, any medical problems and everything you take, including tea and coffee, alcohol and medicines bought over the counter.",
    },
    {
      k: "p",
      text: "A **sleep diary**, kept for one to two weeks, is the most useful tool: note when you went to bed, roughly when you fell asleep, when you woke, naps, caffeine and alcohol, and how you felt the next day. A **sleep study** (polysomnography) is not needed for most people with insomnia. It is used when another sleep disorder, such as sleep apnoea, restless legs or unusual behaviour in sleep, is suspected. Blood tests may be done if a medical cause, such as thyroid disease, is possible.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) is the right starting point: they can look for medical causes, review your medicines and start treatment. A [psychiatrist](/specialties/psychiatry) can help when insomnia comes with depression, anxiety or other mental health conditions. A [clinical psychologist](/specialties/clinical-psychology) trained in CBT-I can deliver the main talking treatment. A sleep specialist, often a neurologist or chest physician, is involved if another sleep disorder is suspected.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [psychiatrists](/doctors/karnataka/bengaluru/psychiatrists) and [clinical psychologists](/doctors/karnataka/bengaluru/clinical-psychologists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "CBT-I: the first-line treatment" },
    {
      k: "p",
      text: "**CBT-I** (cognitive behavioural therapy for insomnia) is the recommended first treatment for chronic insomnia. It usually runs over several weekly sessions with a trained therapist, in a group, or through structured online programmes. It works on the habits and thoughts that keep insomnia going, using techniques such as:",
    },
    {
      k: "ul",
      items: [
        "**Stimulus control** — using the bed only for sleep, and getting up if you cannot sleep rather than lying awake",
        "**Sleep restriction** — temporarily limiting time in bed to match the sleep you are getting, then gradually extending it",
        "**Cognitive techniques** — changing anxious beliefs about sleep",
        "**Relaxation methods** — breathing and muscle relaxation",
      ],
    },
    {
      k: "p",
      text: "CBT-I can feel harder than taking a tablet at first, but its benefits tend to last after treatment ends.",
    },
    { k: "h3", text: "Sleep hygiene" },
    {
      k: "p",
      text: "**Sleep hygiene** supports CBT-I but is rarely enough on its own for chronic insomnia. Keep the same wake-up time every day, including weekends; get daylight in the morning; avoid tea, coffee and energy drinks after midday; avoid alcohol and heavy meals late at night; keep the bedroom dark, quiet and cool; and put screens away for some time before bed. Regular exercise helps, but not just before sleep.",
    },
    { k: "h3", text: "Sleeping pills" },
    {
      k: "p",
      text: "**Sleeping pills** are for short-term use only — for a few nights or a short period during severe insomnia, or when other treatment has not worked. Most can cause next-day drowsiness, falls, memory problems and dependence, and their effect fades with regular use. They are particularly risky for older adults. Other medicines, such as some antidepressants, are sometimes used when insomnia comes with depression or anxiety; your doctor will decide based on your situation.",
    },
    {
      k: "note",
      text: "Do not buy sleeping pills without a prescription, borrow them from family members, or mix them with alcohol. If you have been taking them regularly, do not stop suddenly — ask your doctor how to reduce them gradually.",
    },

    { k: "h2", text: "Living with insomnia" },
    {
      k: "p",
      text: "Avoid long naps, keep to a regular wake-up time even after a poor night, and try not to check the clock repeatedly. Treat underlying problems such as pain, reflux, depression or anxiety. If you are a shift worker, discuss a plan with your doctor. Most people improve with a combination of CBT-I and steady habits, though it can take several weeks.",
    },

    { k: "h2", text: "When it is urgent" },
    {
      k: "p",
      text: "Insomnia itself is not an emergency. Call 112 or 108 for someone who is very drowsy, confused or breathing slowly after taking sleeping tablets, especially with alcohol. If poor sleep comes with thoughts of harming yourself, get help immediately: call 112 or the free Tele-MANAS mental health helpline on 14416. Do not drive or operate machinery when you are very sleepy.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Could a medical problem or any of my medicines be affecting my sleep?",
        "Could this be sleep apnoea or another sleep disorder?",
        "How can I get CBT-I, in person or online?",
        "Is a sleeping pill appropriate for me, and for how long?",
        "How do I reduce a sleeping pill I have been taking for a long time?",
        "When should I come back if things do not improve?",
      ],
    },
  ],
  faqs: [
    {
      q: "Are sleeping pills safe for long-term use?",
      a: "Most sleeping pills are recommended only for short periods. With regular use they tend to work less well, and they can cause dependence, next-day drowsiness, memory problems and falls. CBT-I is the preferred long-term treatment. Ask your doctor before starting or stopping any sleeping medicine.",
    },
    {
      q: "What is CBT-I and does it really work?",
      a: "CBT-I is a structured talking therapy for insomnia that changes the habits and thoughts that keep poor sleep going. It is the recommended first-line treatment for chronic insomnia, and its benefits usually last longer than those of sleeping pills.",
    },
    {
      q: "Is melatonin a good sleeping aid?",
      a: "Melatonin can help with jet lag and some circadian rhythm problems, and is used in some older adults. Its effect on ordinary chronic insomnia is modest. Speak to your doctor before taking it, especially if you are pregnant, take other medicines or are giving it to a child.",
    },
    {
      q: "How much sleep do I really need?",
      a: "Most adults need about seven to nine hours, but this varies. The best guide is how you feel during the day. Worrying about reaching a set number of hours can make insomnia worse, so focus on regular timing and feeling rested.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Insomnia", url: "https://medlineplus.gov/insomnia.html" },
    { label: "NHS — Insomnia", url: "https://www.nhs.uk/conditions/insomnia/" },
    { label: "Press Information Bureau, Government of India — Tele-MANAS launched with 24/7 toll-free helpline 14416", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1866498" },
  ],
};
