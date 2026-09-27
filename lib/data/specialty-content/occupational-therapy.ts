import type { SpecialtyContent } from "./types";

export const occupationalTherapy: SpecialtyContent = {
  key: "occupational-therapy",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Occupational therapists help people do the everyday activities that illness, injury, disability or development have made difficult: dressing, eating, writing, cooking, studying, working and looking after themselves. They are allied health professionals, not medical doctors. In India an occupational therapist usually holds a Bachelor of Occupational Therapy (BOT), and some have a Master of Occupational Therapy (MOT). Allied and healthcare professions, including occupational therapy, are being brought under the National Commission for Allied and Healthcare Professions.",
    "The approach starts with what matters to the person. An occupational therapist looks at the task, the person's abilities and the environment, then works on all three: retraining skills, teaching new ways to do things, recommending equipment such as splints or grab rails, and suggesting changes at home, school or work.",
    "Adults usually see an occupational therapist after a stroke, head injury or hand surgery, or with arthritis or another long-term condition. Children are often referred for developmental delay, autism, handwriting or sensory difficulties. Occupational therapy often runs alongside physiotherapy and speech therapy.",
  ],
  conditions: [
    { name: "Stroke and brain injury", note: "Relearning daily tasks and managing changes in movement, memory or attention." },
    { name: "Hand injuries and hand surgery", note: "Hand therapy, splinting and exercises to restore grip and fine movement." },
    { name: "Arthritis", note: "Joint protection, energy conservation and aids that make daily tasks easier." },
    { name: "Developmental delay in children", note: "Support with play, self-care, fine motor skills and school readiness." },
    { name: "Autism and sensory processing difficulties", note: "Help with daily routines, participation at school and sensory needs, working with the family." },
    { name: "Older adults and falls", note: "Home assessment and changes that make everyday life safer." },
    { name: "Mental health conditions", note: "Building routines, skills and confidence for daily life and work." },
  ],
  tests: [
    { name: "Functional assessment", note: "Watching how you manage everyday tasks to identify what is difficult and why." },
    { name: "Activities of daily living training", note: "Practising tasks such as dressing, bathing and cooking, often with new techniques." },
    { name: "Splinting", note: "Custom splints to support, protect or position a hand or other joint." },
    { name: "Home and workplace assessment", note: "Recommendations such as rails, ramps, seating or changes to how tasks are done." },
    { name: "Assistive equipment", note: "Advice on aids that make tasks easier, from adapted cutlery to wheelchairs." },
    { name: "Paediatric therapy", note: "Play-based sessions on motor skills, handwriting, attention and sensory needs." },
  ],
  versus: [
    { key: "physiotherapy", text: "Physiotherapy focuses on movement, strength and pain. Occupational therapy focuses on managing daily activities and adapting the environment. After a stroke, many people see both." },
    { key: "physical-medicine-rehabilitation", text: "A rehabilitation physician is a medical doctor who leads the rehabilitation plan and prescribes medicines and devices; the occupational therapist is part of that team." },
  ],
  firstVisit: [
    "Bring discharge summaries, scan reports and any letters from your doctor, surgeon or paediatrician.",
    "Think about which daily tasks are hardest and what you most want to be able to do again.",
    "For a child, bring school reports or teacher's notes if relevant, and be ready to describe routines at home.",
    "Expect an assessment on the first visit and a plan with goals; home practice is usually part of it.",
  ],
  urgent: [
    "Sudden weakness of the face, arm or leg, or difficulty speaking: call 108",
    "A splinted hand or arm that becomes very painful, pale, cold or numb: remove the splint if you can and seek urgent medical care",
  ],
  faqs: [
    {
      q: "Is occupational therapy only about work?",
      a: "No. Occupation here means any everyday activity, including self-care, study, play and household tasks, as well as paid work.",
    },
    {
      q: "Is an occupational therapist a doctor?",
      a: "No. Occupational therapists are allied health professionals with a degree in occupational therapy. They do not prescribe medicines.",
    },
    {
      q: "Can occupational therapy help my child?",
      a: "Children are often referred for developmental delay, handwriting, sensory or attention difficulties, or autism. A paediatrician or developmental specialist can advise whether an assessment is worthwhile.",
    },
    {
      q: "What qualifications should an occupational therapist have?",
      a: "A Bachelor of Occupational Therapy (BOT), sometimes with a Master of Occupational Therapy (MOT). Ask about registration, as allied health registers are being set up under the National Commission for Allied and Healthcare Professions.",
    },
    {
      q: "How is it different from physiotherapy?",
      a: "A physiotherapist works mainly on movement, strength and pain. An occupational therapist works on getting everyday tasks done, including by changing how they are done or the environment they are done in.",
    },
  ],
};
