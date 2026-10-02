import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "schizophrenia",
  title: "Schizophrenia: symptoms, treatment, recovery and support for families",
  metaTitle: "Schizophrenia: symptoms, treatment and family support",
  standfirst: "What schizophrenia is and is not, early signs, how it is diagnosed and treated, why continuing treatment matters, and how families can support recovery.",
  targetQuery: "schizophrenia symptoms and treatment",
  department: "psychiatry",
  specialty: "psychiatry",
  alsoSee: ["clinical-psychology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Hallucinations", "Delusions", "Disorganised speech", "Social withdrawal", "Lack of motivation"],
  tests: ["Clinical assessment", "Blood tests", "Brain scan"],
  treatments: ["Antipsychotic medicines", "Clozapine", "Cognitive behavioural therapy", "Family intervention", "Psychosocial rehabilitation"],
  body: [
    {
      k: "note",
      text: "If someone is at risk of harming themselves or others, or talks about suicide, get help now. Call 112 in an emergency, or call Tele-MANAS, the government's free mental health helpline, on 14416 at any time of day or night.",
    },
    { k: "h2", text: "What schizophrenia is" },
    {
      k: "p",
      text: "Schizophrenia is a long-term mental health condition that affects how a person thinks, perceives the world, feels and behaves. During periods of illness, called psychosis, people may hear or see things that others do not, or hold strong beliefs that are not based in reality. It also affects motivation, emotions and thinking skills such as memory and attention.",
    },
    {
      k: "p",
      text: "Schizophrenia is not a split personality, and most people with schizophrenia are not violent; they are more likely to be victims of harm than to harm others. It is not caused by bad parenting, black magic, spirits or personal weakness. It is a medical condition of the brain that responds to treatment, and many people recover well enough to work, study and live independently.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms are often grouped into three kinds. Early signs, sometimes months before psychosis, can include withdrawing from friends, falling behind at school or work, sleeping poorly, suspiciousness and unusual ideas.",
    },
    {
      k: "ul",
      items: [
        "Hallucinations — most often hearing voices that others cannot hear, sometimes commenting on or criticising the person",
        "Delusions — fixed false beliefs, such as being followed, poisoned, controlled or having special powers",
        "Disorganised speech and thinking — jumping between topics, or speech that is hard to follow",
        "Social withdrawal, flat emotions and reduced speech",
        "Lack of motivation and difficulty starting or completing tasks, including self-care",
        "Problems with memory, attention and planning",
      ],
    },
    {
      k: "p",
      text: "A person experiencing psychosis may not recognise that anything is wrong, which can make it hard for them to accept help.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "There is no single cause. A combination of genes, brain development and life events is involved. Risk is higher with:",
    },
    {
      k: "ul",
      items: [
        "A close relative with schizophrenia or another psychotic illness",
        "Complications in pregnancy or birth",
        "Heavy cannabis use, especially starting in the teenage years, and use of other drugs such as stimulants",
        "Stressful life events, migration and social adversity",
      ],
    },
    {
      k: "p",
      text: "Schizophrenia usually begins in late adolescence or early adulthood, often a little earlier in men than in women.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A psychiatrist diagnoses schizophrenia through a **clinical assessment**: a detailed conversation with the person and, with their consent, family members, about symptoms, how long they have lasted, how daily life has changed, substance use and risks. Symptoms usually need to be present for several months before the diagnosis is made.",
    },
    {
      k: "p",
      text: "There is no single test. **Blood tests** and sometimes a **brain scan** are used to rule out other causes of psychosis, such as thyroid problems, infections, epilepsy, drug effects or brain conditions, and to check that medicines are safe. Early assessment matters: the sooner psychosis is treated, the better the outcome tends to be.",
    },

    { k: "h2", text: "Which professional to see" },
    {
      k: "p",
      text: "A [psychiatrist](/specialties/psychiatry) diagnoses schizophrenia and leads treatment. A [clinical psychologist](/specialties/clinical-psychology) provides psychological therapies and family work. Social workers, occupational therapists and community mental health teams help with rehabilitation, work and daily living. Spiritual or traditional healing may bring comfort to some families, but it should not replace or delay medical treatment.",
    },
    {
      k: "p",
      text: "You can [find psychiatrists in Bengaluru](/doctors/karnataka/bengaluru/psychiatrists) and [clinical psychologists](/doctors/karnataka/bengaluru/clinical-psychologists) on The Doctor Index. The Mental Healthcare Act, 2017 gives every person in India a right to access mental health care and treatment from services run or funded by the government, including government hospitals.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Antipsychotic medicines** are the main treatment for psychosis. They reduce hallucinations and delusions and lower the chance of relapse. Common examples include risperidone, olanzapine, aripiprazole and haloperidol. Some are available as long-acting injections given every few weeks, which some people find easier than daily tablets. **Clozapine** is used when at least two other antipsychotics have not worked; it is very effective but needs regular blood tests to check the white cell count.",
    },
    {
      k: "p",
      text: "Side effects can include weight gain, raised sugar and cholesterol, sleepiness, stiffness or restlessness. Tell your psychiatrist about side effects, as there is usually a way to reduce them. Regular checks of weight, blood pressure, sugar and cholesterol are part of good care.",
    },
    {
      k: "note",
      text: "Do not stop antipsychotic medicines suddenly or on your own, even if you feel well. Stopping is the most common reason for relapse. If side effects are a problem, talk to your psychiatrist about changing the medicine or dose.",
    },
    { k: "h3", text: "Psychological and social treatments" },
    {
      k: "p",
      text: "**Cognitive behavioural therapy** for psychosis helps people cope with distressing symptoms. **Family intervention** gives families information and skills to support recovery and reduces relapse. **Psychosocial rehabilitation**, including social skills training, supported education and supported employment, helps people return to study, work and community life.",
    },

    { k: "h2", text: "Living with schizophrenia" },
    {
      k: "p",
      text: "Recovery is possible, and it often happens gradually. Keep taking medicines, attend follow-up, avoid cannabis and other drugs, keep a regular routine and sleep pattern, and stay connected with people. Learn your early warning signs of relapse and agree a plan with your psychiatrist. Look after your physical health: exercise, eat well and stop smoking.",
    },
    {
      k: "p",
      text: "Families play a big part. Learn about the condition, stay calm and supportive, avoid criticism and blame, and look after your own health and rest. Carer support groups can help.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Get help immediately — call 112, go to the nearest emergency department, or call Tele-MANAS on 14416 — if someone:" },
    {
      k: "ul",
      items: [
        "Talks about suicide, has a plan, or has harmed themselves",
        "Is threatening to harm others, or acting on voices telling them to do something dangerous",
        "Has stopped eating or drinking, or is unable to look after their basic needs",
        "Develops high fever, severe stiffness and confusion after starting or changing an antipsychotic",
        "Has a high fever, sore throat or mouth ulcers while taking clozapine",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What is the diagnosis, and how sure are we?",
        "Which medicine do you recommend, and what side effects should we watch for?",
        "Would a long-acting injection suit me?",
        "Which physical health checks do I need?",
        "What are my early warning signs, and what is the crisis plan?",
        "What support is available for work, study and for my family?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can people with schizophrenia recover?",
      a: "Yes. Many people have long periods without symptoms, and a good number recover substantially, especially when treatment starts early and continues. Recovery can mean returning to work, study and relationships, even if some support or medicine is still needed.",
    },
    {
      q: "Are people with schizophrenia dangerous?",
      a: "Most are not. People with schizophrenia are more likely to be harmed by others than to harm anyone. The risk of violence rises mainly with untreated psychosis and drug or alcohol use, which is another reason why steady treatment matters.",
    },
    {
      q: "Is schizophrenia caused by black magic or spirits?",
      a: "No. Schizophrenia is a medical condition involving the brain, influenced by genes, development and life events. It responds to medical treatment. Faith can be a source of comfort for families, but delaying medical care can make recovery harder.",
    },
    {
      q: "Can someone with schizophrenia marry and have children?",
      a: "Many people with schizophrenia marry and have children. Planning with the psychiatrist is important, especially for pregnancy, as medicines may need review and the period after childbirth needs close support. Honest discussion with a partner is also important.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Schizophrenia", url: "https://medlineplus.gov/schizophrenia.html" },
    { label: "World Health Organization — Schizophrenia fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/schizophrenia" },
    { label: "Press Information Bureau, Government of India — Tele-MANAS launched with 24/7 toll-free helpline 14416", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1866498" },
    { label: "India Code — The Mental Healthcare Act, 2017", url: "https://www.indiacode.nic.in/bitstream/123456789/2249/1/A2017-10.pdf" },
  ],
};
