import type { SpecialtyContent } from "./types";

export const clinicalPsychology: SpecialtyContent = {
  key: "clinical-psychology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A clinical psychologist is a mental health professional trained to assess and treat psychological difficulties using talking therapies and structured psychological programmes. Clinical psychologists are not medical doctors and do not prescribe medication. In India, practising clinical psychologists are registered with the Rehabilitation Council of India (RCI) after an RCI-recognised professional qualification in clinical psychology, traditionally an MPhil. It is reasonable to ask to see that registration.",
    "The titles in this field can be confusing. Anyone with a degree in psychology may call themselves a psychologist or counsellor, and many counsellors do helpful work. A clinical psychologist has specific professional training in assessing and treating mental health conditions, supervised clinical experience, and RCI registration. For a diagnosed condition, or when psychological testing is needed, that training matters.",
    "Clinical psychologists use evidence-based therapies such as cognitive behavioural therapy, and work with individuals, children, couples and families. They also carry out psychological assessments, including intelligence, learning, personality and memory testing. When medication might help, they work alongside a psychiatrist, and many people see both. Therapy usually involves a series of regular sessions rather than a single visit.",
  ],
  conditions: [
    { name: "Anxiety and panic", note: "Learning to understand and manage worry, fear and panic attacks." },
    { name: "Depression", note: "Therapy for low mood, often alongside psychiatric care when symptoms are severe." },
    { name: "Obsessive-compulsive disorder", note: "Structured therapy to reduce unwanted thoughts and rituals." },
    { name: "Stress and life changes", note: "Work stress, relationship difficulties, grief and major life transitions." },
    { name: "Trauma", note: "Support after distressing or frightening experiences." },
    { name: "Children's learning and behaviour", note: "Assessment of learning difficulties, attention and developmental concerns, and support for families." },
    { name: "Relationship and family difficulties", note: "Couple and family therapy." },
    { name: "Habits and addictions", note: "Psychological support for changing substance use and other habits, often with a psychiatrist." },
    { name: "Coping with long-term illness", note: "Adjusting to chronic pain, cancer or other health conditions." },
  ],
  tests: [
    { name: "Clinical interview", note: "A detailed conversation about your difficulties, history and goals, used to plan therapy." },
    { name: "Psychometric testing", note: "Standardised questionnaires and tests of personality, mood and symptoms." },
    { name: "Intelligence and learning assessments", note: "Used to understand a child's or adult's strengths and difficulties, including for school support." },
    { name: "Neuropsychological assessment", note: "Tests of memory, attention and thinking, for example after a head injury or when memory is changing." },
    { name: "Cognitive behavioural therapy (CBT)", note: "A structured therapy that works on the link between thoughts, feelings and behaviour." },
    { name: "Other talking therapies", note: "Including family, couple and group therapy, and approaches suited to children." },
  ],
  versus: [
    { key: "psychiatry", text: "A psychiatrist is a medical doctor who can diagnose mental illness and prescribe medication. A clinical psychologist does not prescribe, and provides therapy and psychological testing. For severe symptoms, both often work together." },
    { key: "paediatrics", text: "A paediatrician may make the first assessment of a child's development or behaviour and rule out medical causes. A clinical psychologist provides detailed testing and therapy for the child and family." },
    { key: "neurology", text: "For memory or thinking problems, a neurologist looks for diseases of the brain; a clinical psychologist can carry out neuropsychological testing that measures the effect in detail." },
  ],
  firstVisit: [
    "Ask about the psychologist's qualification and RCI registration; a good practitioner will be happy to show it.",
    "Think about what you would like to change and what you hope to get from therapy. It is fine not to be sure.",
    "Bring any earlier psychiatric or psychological reports, and a list of medicines if you take any.",
    "For a child's assessment, bring school reports, earlier test results and notes from teachers if available.",
    "Expect the first session to focus on understanding your situation. Ask how many sessions are likely, how progress will be reviewed, and what the psychologist's confidentiality rules are.",
  ],
  urgent: [
    "Thoughts of ending one's life or of self-harm: seek emergency help now or call 108. Tele-MANAS is also available on 14416",
    "Severe confusion, or behaviour that puts the person or others at immediate risk",
    "Hearing or seeing things with severe distress, needing urgent psychiatric care",
  ],
  faqs: [
    {
      q: "Can a clinical psychologist prescribe medication?",
      a: "No. Clinical psychologists are not medical doctors and do not prescribe. If medication might help, they will suggest seeing a psychiatrist, and the two often work together.",
    },
    {
      q: "What is the difference between a clinical psychologist and a counsellor?",
      a: "Counselling is a broad term, and training varies widely. A clinical psychologist has specific professional training in assessing and treating mental health conditions and is registered with the Rehabilitation Council of India.",
    },
    {
      q: "How do I check a clinical psychologist's registration?",
      a: "Ask for their Rehabilitation Council of India registration number. It can be checked with the RCI.",
    },
    {
      q: "How many therapy sessions will I need?",
      a: "It varies with the difficulty and the type of therapy. Some structured therapies run over a set number of sessions; others continue longer. Your psychologist should discuss a plan and review progress with you.",
    },
    {
      q: "Is therapy confidential?",
      a: "Yes. What you discuss is confidential, with limited exceptions when there is a serious risk to your safety or someone else's. Ask your psychologist to explain their confidentiality rules at the start.",
    },
  ],
};
