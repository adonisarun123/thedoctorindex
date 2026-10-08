import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "postpartum-depression",
  title: "Postpartum depression: signs, help and which doctor to see",
  standfirst: "How postpartum depression differs from the baby blues, the signs to watch for, how it is treated, including while breastfeeding, and where to get help.",
  targetQuery: "postpartum depression symptoms and treatment",
  department: "psychiatry",
  specialty: "psychiatry",
  alsoSee: ["clinical-psychology", "gynaecology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Low mood", "Loss of interest", "Anxiety", "Trouble sleeping", "Feeling guilty or worthless", "Difficulty bonding with the baby"],
  tests: ["Screening questionnaire", "Blood tests"],
  treatments: ["Talking therapy", "Antidepressants", "Family support"],
  body: [
    { k: "h2", text: "What postpartum depression is" },
    {
      k: "p",
      text: "Postpartum depression, also called postnatal depression, is [depression](/conditions/depression) that develops during pregnancy or in the year after giving birth. It is a common and treatable medical condition, not a sign of weakness, a lack of love for the baby, or a failure as a mother. It can affect any woman, whatever her age, income or how much she wanted the baby, and it can follow a first child or a later one. Fathers and other partners can develop depression after a birth too.",
    },
    {
      k: "p",
      text: "In many Indian families the weeks after delivery are a time of visitors, rituals and advice, and a new mother is expected to feel only happy. When she does not, she may hide it out of shame, or others may brush it off as tiredness or \"just hormones\". Recognising postpartum depression and getting help early matters for the mother's health, for her bond with the baby, and for the whole family.",
    },

    { k: "h2", text: "Baby blues, postpartum depression and postpartum psychosis" },
    {
      k: "ul",
      items: [
        "**Baby blues** are very common in the first days after birth: tearfulness, mood swings, irritability and feeling overwhelmed. They usually ease on their own within about two weeks with rest and support.",
        "**Postpartum depression** is more intense and lasts longer than two weeks. It can start any time in the first year, and sometimes begins during pregnancy.",
        "**Postpartum psychosis** is rare but serious. It usually starts suddenly in the first weeks after birth, with confusion, seeing or hearing things others do not, strange beliefs, extreme restlessness or not sleeping at all. It is a psychiatric emergency.",
      ],
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms are similar to depression at any other time, but they can be harder to spot because some, such as tiredness and poor sleep, are expected with a newborn. Signs to watch for, lasting most of the day for two weeks or more, include:",
    },
    {
      k: "ul",
      items: [
        "Low mood, sadness, emptiness or frequent crying",
        "Loss of interest or pleasure in things, including the baby",
        "Anxiety, panic, or constant worry about the baby's health or about harming the baby by accident",
        "Trouble sleeping even when the baby sleeps, or sleeping much more than usual",
        "Feeling guilty or worthless, or that you are a bad mother",
        "Difficulty bonding with the baby, or feeling numb towards the baby",
        "Irritability or anger, poor concentration and difficulty making decisions",
        "Loss of appetite, or eating much more",
        "Withdrawing from family and friends",
        "Thoughts that the family would be better off without you, or thoughts of harming yourself or the baby",
      ],
    },
    {
      k: "p",
      text: "Unwanted, frightening thoughts about something bad happening to the baby are common in new parents and do not mean you will act on them. They are worth talking about with a doctor, who will not judge you and whose aim is to help you and keep your baby safe.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "There is no single cause. The large hormone changes after birth, lack of sleep, the physical recovery from delivery and the emotional demands of caring for a newborn all play a part. Postpartum depression is more likely with:",
    },
    {
      k: "ul",
      items: [
        "A past history of depression, [anxiety](/conditions/anxiety) or [bipolar disorder](/conditions/bipolar-disorder), or depression during pregnancy",
        "A family history of depression or postpartum mental illness",
        "Little practical or emotional support, or relationship difficulties",
        "Stressful life events, financial worries, or domestic violence",
        "A difficult pregnancy or birth, a premature or unwell baby, or a baby who needed NICU care",
        "Pressure or disappointment about the baby's sex, or feeling blamed",
        "Thyroid problems after delivery",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no blood test for postpartum depression. A doctor diagnoses it by talking with you about how you have been feeling, sleeping and coping, and for how long. Many obstetricians, paediatricians and psychiatrists use a short **screening questionnaire**, such as the Edinburgh Postnatal Depression Scale, at antenatal or postnatal visits. Answering honestly helps you get the right care. **Blood tests**, including thyroid function and haemoglobin, may be done to look for physical problems such as an underactive thyroid or anaemia that can cause tiredness and low mood.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Postpartum depression responds well to treatment, and the sooner it starts, the sooner you are likely to feel like yourself again. Treatment depends on how severe the symptoms are and on your preferences.",
    },
    {
      k: "ul",
      items: [
        "**Talking therapy** — counselling, cognitive behavioural therapy or interpersonal therapy with a psychologist or psychiatrist helps you understand and manage your thoughts, feelings and relationships. It is often the first step for mild to moderate depression and can be done in person or online.",
        "**Antidepressants** — for moderate or severe depression, or when therapy alone is not enough. Several antidepressants can be taken while breastfeeding; your psychiatrist will choose one with you, weighing the benefits for you and your baby. They take a few weeks to work and should not be stopped suddenly.",
        "**Family support** — practical help with night feeds, housework and older children, and time for the mother to sleep and rest, are part of treatment, not a luxury.",
        "Treatment in hospital is occasionally needed for severe depression or postpartum psychosis, ideally in a unit where the baby can stay with the mother if possible.",
      ],
    },
    {
      k: "p",
      text: "Some newer medicines have been approved in other countries specifically for postpartum depression; your psychiatrist can tell you whether any are available and suitable.",
    },

    { k: "h2", text: "How family members can help" },
    {
      k: "ul",
      items: [
        "Listen without judging, and do not tell her to \"just be happy\" or compare her with other mothers",
        "Take over some night feeds or settling, so she can get a stretch of unbroken sleep",
        "Help with cooking, cleaning and older children, and limit visitors if she is overwhelmed",
        "Encourage her to see a doctor, and offer to go with her",
        "Watch for warning signs, and do not leave her alone if she talks about harming herself or the baby",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "note",
      tone: "alert",
      title: "Get help now",
      text: "Thoughts of harming yourself or ending your life, or of harming your baby, are a medical emergency. Call 112, or go to the nearest emergency department, straight away. Do the same if a new mother becomes confused, sees or hears things that are not there, has strange or frightening beliefs, or stops sleeping altogether, which may be postpartum psychosis.",
    },
    {
      k: "p",
      text: "For support and advice at any time, you can call Tele-MANAS, India's national mental health helpline, on 14416. It is free and available in many Indian languages. If you are worried about someone, stay with them and help them get care.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Tell your obstetrician, listed under [gynaecology](/specialties/gynaecology), or your baby's paediatrician how you are feeling; they see many new mothers and can start the conversation and refer you. A [psychiatrist](/specialties/psychiatry) diagnoses and treats postpartum depression, including with medicines suitable during breastfeeding, and manages postpartum psychosis. A [clinical psychologist](/specialties/clinical-psychology) provides talking therapy.",
    },
    {
      k: "p",
      text: "You can [find psychiatrists in Bengaluru](/doctors/karnataka/bengaluru/psychiatrists), [clinical psychologists in Bengaluru](/doctors/karnataka/bengaluru/clinical-psychologists) or [gynaecologists in Bengaluru](/doctors/karnataka/bengaluru/gynaecologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "How do I know if it is baby blues or postpartum depression?",
      a: "Baby blues start in the first few days after birth and usually fade within about two weeks. If low mood, anxiety or tearfulness last longer than two weeks, get worse, or make it hard to cope or care for the baby, it may be postpartum depression. Talk to a doctor.",
    },
    {
      q: "Can I take antidepressants while breastfeeding?",
      a: "Many women can. Several antidepressants pass into breast milk only in small amounts and are commonly used during breastfeeding. Your psychiatrist will help you weigh the benefits and risks for you and your baby. Do not stop breastfeeding or medicines without advice.",
    },
    {
      q: "Can fathers get postpartum depression?",
      a: "Yes. Fathers and partners can develop depression in the months after a baby arrives, especially if the mother is also unwell, sleep is short, or there are money or relationship worries. The same help, including talking therapy and medicines, works for them.",
    },
    {
      q: "Will postpartum depression affect my baby?",
      a: "Getting treatment protects both you and your baby. Untreated depression can make bonding, feeding and daily care harder. With treatment and support, most mothers recover fully and go on to have a close, loving relationship with their child.",
    },
    {
      q: "Will it happen again in my next pregnancy?",
      a: "Having had postpartum depression raises the chance of it returning after another birth, but it does not mean it will. Tell your obstetrician early in the next pregnancy, so that you can plan support and, if needed, treatment in advance.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Postpartum Depression", url: "https://medlineplus.gov/postpartumdepression.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
