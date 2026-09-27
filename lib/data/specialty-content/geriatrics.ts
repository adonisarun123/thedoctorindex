import type { SpecialtyContent } from "./types";

export const geriatrics: SpecialtyContent = {
  key: "geriatrics",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A geriatrician is a physician who specialises in the health of older adults. The speciality looks at the whole person rather than one organ, because in later life problems rarely come one at a time. In India a geriatrician usually holds an MBBS and a postgraduate degree in geriatric medicine or in general medicine with further experience in the care of older people. The speciality is still small, so many older adults are looked after by internal medicine physicians and family doctors.",
    "Much of the work is about function as well as disease: can the person walk safely, remember their medicines, eat well, sleep, and manage at home? A geriatric assessment looks at memory, mood, mobility, continence, nutrition, hearing and vision alongside the medical diagnoses. The aim is to keep people independent and comfortable for as long as possible.",
    "Medicines are a large part of it. Older adults often see several specialists, each adding prescriptions, and some medicines raise the risk of falls, confusion or kidney problems. A geriatrician will often review the whole list and stop what is no longer helping. Families are usually involved, especially when memory has changed or care at home needs planning.",
  ],
  conditions: [
    { name: "Falls and unsteadiness", note: "Finding the causes, which may include medicines, weak muscles, low blood pressure on standing, eyesight or the home itself." },
    { name: "Memory loss and dementia", note: "Assessing memory change, looking for treatable causes, and supporting the person and family." },
    { name: "Delirium", note: "Sudden confusion, often triggered by infection, dehydration, a new medicine or a hospital stay; it needs prompt medical attention." },
    { name: "Frailty", note: "Weakness, slowness and low reserves that make illness hit harder; exercise and nutrition can help." },
    { name: "Many medicines at once", note: "Reviewing long prescription lists for interactions, side effects and medicines that are no longer needed." },
    { name: "Several long-term conditions", note: "Balancing treatment for diabetes, blood pressure, heart, kidney and joint disease together." },
    { name: "Incontinence", note: "Bladder and bowel problems that are common but often treatable, and worth raising." },
    { name: "Poor appetite and weight loss", note: "Looking for medical, dental, emotional and practical causes." },
    { name: "Low mood and sleep problems", note: "Depression in later life is common and can be mistaken for memory loss or simply ageing." },
  ],
  tests: [
    { name: "Comprehensive geriatric assessment", note: "A structured review of health, medicines, memory, mood, mobility and daily activities, often over more than one visit." },
    { name: "Memory screening tests", note: "Short question-and-answer tests that show whether memory change needs further assessment." },
    { name: "Gait and balance assessment", note: "Watching how a person stands, walks and turns to judge falls risk." },
    { name: "Lying and standing blood pressure", note: "Checks whether blood pressure drops on standing, a common cause of dizziness and falls." },
    { name: "Routine blood tests", note: "Blood count, kidney function, sugar, thyroid, vitamin B12 and salts, which can all affect energy and memory." },
    { name: "Bone density scan", note: "Checks for osteoporosis in people at risk of fractures." },
    { name: "Brain imaging", note: "A CT or MRI scan may be arranged when memory or behaviour changes need investigating." },
  ],
  versus: [
    { key: "internal-medicine", text: "Internal medicine physicians treat adult illness of all ages. A geriatrician focuses on older adults, with particular attention to function, frailty, falls, memory and reducing medicines." },
    { key: "neurology", text: "For memory problems, a geriatrician often makes the first assessment and manages the wider picture. A neurologist is involved when the pattern is unusual, starts young, or comes with other nervous system signs." },
    { key: "psychiatry", text: "Low mood, anxiety and behaviour change in older age may need a psychiatrist, particularly one with an interest in old age psychiatry, working alongside the geriatrician." },
  ],
  firstVisit: [
    "Bring every medicine the person takes, in their packets, including eye drops, inhalers, supplements and traditional remedies.",
    "Bring recent reports and discharge summaries, and a list of the specialists they see.",
    "A family member or carer who knows the day-to-day picture is very helpful, especially if memory has changed.",
    "Note any falls, near-falls, changes in memory, sleep, appetite, continence or mood, and when they started.",
    "Bring glasses and hearing aids. The first visit is often longer than usual and may continue over a second appointment.",
  ],
  urgent: [
    "Sudden confusion or drowsiness, or a sudden change in behaviour",
    "A fall with a head injury, inability to get up, or pain and deformity in a hip or limb",
    "Sudden weakness of the face, arm or leg, or difficulty speaking",
    "Chest pain, severe breathlessness, or someone who cannot be woken: call 108",
  ],
  faqs: [
    {
      q: "At what age should someone see a geriatrician?",
      a: "There is no fixed age. A geriatrician is most useful when an older person has several conditions, a long list of medicines, falls, memory change or growing difficulty managing at home.",
    },
    {
      q: "Is memory loss a normal part of ageing?",
      a: "Mild forgetfulness can be. Memory loss that affects daily life, gets steadily worse, or worries family members should be assessed, because some causes are treatable.",
    },
    {
      q: "Can a geriatrician reduce the number of medicines?",
      a: "Often, yes. Reviewing the whole list and stopping medicines that no longer help is a core part of geriatric care. Changes should be made with the doctor, not by stopping medicines at home.",
    },
    {
      q: "What can be done to prevent falls?",
      a: "Reviewing medicines, checking eyesight and blood pressure, strength and balance exercise, and making the home safer can all reduce falls. A geriatrician or physiotherapist can advise on which apply.",
    },
    {
      q: "If geriatricians are hard to find, who else can help?",
      a: "An internal medicine physician or family doctor who knows the person well can manage most of the same concerns, with referral to other specialists as needed.",
    },
  ],
};
