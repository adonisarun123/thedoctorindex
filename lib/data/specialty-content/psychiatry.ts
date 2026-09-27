import type { SpecialtyContent } from "./types";

export const psychiatry: SpecialtyContent = {
  key: "psychiatry",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A psychiatrist is a medical doctor who specialises in mental health. In India the usual training is an MBBS followed by an MD in psychiatry, a DNB, or the older diploma DPM. Because psychiatrists are doctors, they can examine physical health, order tests, diagnose mental illness and prescribe medication. Many also provide talking therapy, and they often work alongside clinical psychologists, who provide therapy and assessment but do not prescribe.",
    "Psychiatrists see people with depression, anxiety and panic, obsessive-compulsive disorder, bipolar disorder, psychosis and schizophrenia, alcohol and substance dependence, sleep problems and memory change. Some focus on children and adolescents, older adults, addiction, or mental health around pregnancy. Treatment is usually a combination of medication where it helps, therapy, and practical support, and it is adjusted over time.",
    "Many people in India put off seeing a psychiatrist because of stigma or worry about medication. Seeking help for mental health is no different from seeing a doctor for any other illness, and a first visit does not commit you to any treatment. Consultations are confidential. If you would rather talk to someone before booking, Tele-MANAS, the government's free mental health helpline, is available on 14416.",
  ],
  conditions: [
    { name: "Depression", note: "Low mood, loss of interest, poor sleep and energy lasting weeks; very treatable." },
    { name: "Anxiety and panic disorder", note: "Worry, fear or panic attacks that interfere with daily life." },
    { name: "Obsessive-compulsive disorder", note: "Unwanted repeated thoughts and the urge to perform rituals to relieve them." },
    { name: "Bipolar disorder", note: "Episodes of depression alternating with periods of unusually high mood or energy." },
    { name: "Psychosis and schizophrenia", note: "Hearing or believing things others do not; early treatment helps." },
    { name: "Alcohol and substance dependence", note: "Including tobacco, with support for safe withdrawal and staying off." },
    { name: "Sleep problems", note: "Persistent difficulty sleeping, often linked to mood, anxiety or habits." },
    { name: "Memory problems and dementia", note: "Assessment and support, often with a neurologist or geriatrician." },
    { name: "Mental health in children and adolescents", note: "Attention difficulties, behaviour problems, and emotional difficulties in young people." },
  ],
  tests: [
    { name: "Psychiatric assessment", note: "A detailed conversation about symptoms, history, life circumstances and family background; the main diagnostic tool." },
    { name: "Mental state examination", note: "The psychiatrist's structured observation of mood, thinking and perception during the interview." },
    { name: "Rating scales and questionnaires", note: "Standard questionnaires to measure how severe symptoms are and track change over time." },
    { name: "Blood tests", note: "To rule out physical causes such as thyroid problems or anaemia, and to monitor some medications." },
    { name: "Brain imaging or ECG", note: "Occasionally, when a physical cause needs excluding or before certain medicines." },
    { name: "Medication", note: "Prescribed and adjusted over time; changes should be made with the psychiatrist, not stopped suddenly." },
    { name: "Psychotherapy", note: "Talking therapy, provided by the psychiatrist or a psychologist working with them." },
  ],
  versus: [
    { key: "clinical-psychology", text: "A psychiatrist is a medical doctor who can diagnose and prescribe. A clinical psychologist provides therapy and psychological testing but does not prescribe, and is registered with the Rehabilitation Council of India. Many people see both." },
    { key: "neurology", text: "Neurologists treat diseases of the brain and nerves such as epilepsy, stroke and Parkinson's. Psychiatrists treat disorders of mood, thinking and behaviour. Memory problems may involve either." },
    { key: "general-practice", text: "A general physician can recognise and treat some common mental health problems and refer on. A psychiatrist is needed when symptoms are severe, not improving, or need specialist treatment." },
  ],
  firstVisit: [
    "Write down your main concerns, when they started, and how they affect sleep, appetite, work and relationships.",
    "Bring a list of all medicines and any earlier psychiatric or medical reports and prescriptions.",
    "Be honest about alcohol, tobacco and other substance use; it affects diagnosis and treatment, and it is confidential.",
    "You may bring a family member or friend, and you can also ask to speak to the psychiatrist alone for part of the visit.",
    "Expect the first visit to be longer than later ones and mostly conversation. Ask what the diagnosis means and what the options are, including therapy.",
  ],
  urgent: [
    "Thoughts of ending one's life or of self-harm: seek emergency help now or call 108. Tele-MANAS is also available on 14416",
    "Severe confusion, agitation, or behaviour that puts the person or others at risk",
    "Hearing or seeing things with severe distress, or not eating or drinking",
    "Severe withdrawal symptoms after stopping alcohol, such as shaking, confusion or a fit: call 108",
  ],
  faqs: [
    {
      q: "What is the difference between a psychiatrist and a psychologist?",
      a: "A psychiatrist is a medical doctor who can diagnose mental illness and prescribe medication. A clinical psychologist is trained in psychological assessment and talking therapy but does not prescribe. They often work together.",
    },
    {
      q: "Will I have to take medication for life?",
      a: "Not usually. Many people take medication for a period and then stop under guidance. Some conditions need longer treatment; your psychiatrist will discuss this with you.",
    },
    {
      q: "Are psychiatric medicines addictive?",
      a: "Most medicines used for depression and anxiety are not addictive, though some should not be stopped suddenly. A few, such as certain sleeping tablets, can cause dependence and are usually used for short periods. Ask your psychiatrist about the specific medicine.",
    },
    {
      q: "Is what I tell a psychiatrist confidential?",
      a: "Yes. Consultations are confidential. The main exception is when there is a serious risk to your safety or someone else's, when the psychiatrist may need to involve others.",
    },
    {
      q: "What qualifications should a psychiatrist have?",
      a: "An MBBS and a postgraduate qualification in psychiatry, such as MD, DNB or the diploma DPM. Registration should be on the NMC's register or a state medical council register.",
    },
  ],
};
