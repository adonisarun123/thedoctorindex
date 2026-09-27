import type { SpecialtyContent } from "./types";

export const physiotherapy: SpecialtyContent = {
  key: "physiotherapy",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Physiotherapists help people recover movement, strength and function, and manage pain, through exercise, hands-on techniques and education. They are allied health professionals, not medical doctors, and they do not prescribe medicines. In India a physiotherapist usually holds a Bachelor of Physiotherapy (BPT), and many go on to a Master of Physiotherapy (MPT) in an area such as musculoskeletal, neurological, cardiopulmonary, sports or paediatric physiotherapy. Allied and healthcare professions, including physiotherapy, are being brought under the National Commission for Allied and Healthcare Professions.",
    "Physiotherapy is central to recovery after fractures, ligament injuries and joint replacements, after strokes and other nerve injuries, and after time in intensive care. It is also widely used for long-standing back, neck and joint pain, where a graded exercise programme and advice on activity often matter more than any single treatment session.",
    "People reach a physiotherapist on referral from an orthopaedic surgeon, neurologist, physician or rehabilitation doctor, or directly. Good physiotherapy is active: most of the benefit comes from the exercises you continue at home between sessions, so expect to be given a programme and asked how it is going.",
  ],
  conditions: [
    { name: "Back and neck pain", note: "Assessment, exercise and advice on staying active, especially for pain that keeps returning." },
    { name: "After fractures and orthopaedic surgery", note: "Restoring movement and strength after a fracture, ligament repair or joint replacement." },
    { name: "Sports injuries", note: "Sprains, strains and tendon problems, and a graded return to sport." },
    { name: "Stroke and neurological conditions", note: "Retraining movement, balance and walking after a stroke, and support in conditions such as Parkinson's disease." },
    { name: "Arthritis and joint stiffness", note: "Exercise to maintain movement and strength around painful joints." },
    { name: "Balance problems and falls", note: "Strength and balance training for older adults at risk of falling." },
    { name: "Breathing and chest conditions", note: "Chest physiotherapy and exercise for lung conditions and after surgery or intensive care." },
  ],
  tests: [
    { name: "Assessment", note: "A history and examination of movement, strength, posture and function, to set goals and a plan." },
    { name: "Exercise therapy", note: "Targeted exercises for strength, flexibility, balance and endurance, progressed over time." },
    { name: "Manual therapy", note: "Hands-on techniques such as joint mobilisation and soft-tissue work." },
    { name: "Gait and balance training", note: "Relearning to walk safely, sometimes with a stick, walker or other aid." },
    { name: "Electrotherapy", note: "Methods such as heat, TENS or ultrasound, usually used alongside exercise rather than on their own." },
    { name: "Chest physiotherapy", note: "Breathing exercises and techniques to clear the chest." },
    { name: "Home exercise programme", note: "Exercises to continue between sessions, which is where most progress is made." },
  ],
  versus: [
    { key: "orthopaedics", text: "An orthopaedic surgeon diagnoses bone and joint problems, orders scans, prescribes medicines and operates. A physiotherapist provides the rehabilitation before and after, and often manages non-surgical pain." },
    { key: "physical-medicine-rehabilitation", text: "A rehabilitation physician is a medical doctor who leads rehabilitation, prescribes medicines and devices, and coordinates a team that usually includes physiotherapists." },
    { key: "occupational-therapy", text: "Physiotherapy focuses on movement, strength and pain. Occupational therapy focuses on managing daily tasks such as dressing, cooking and working, and on adapting the home or workplace." },
  ],
  firstVisit: [
    "Bring scan reports, operation notes, discharge summaries and any instructions from your surgeon or doctor, including movement restrictions.",
    "Wear loose, comfortable clothing that lets the physiotherapist see and move the affected area.",
    "Describe what makes the pain or problem better and worse, and what you want to be able to do again.",
    "Expect an assessment and a first set of exercises; ask how often to do them and how many sessions are likely.",
  ],
  urgent: [
    "Back pain with numbness around the genitals or buttocks, or new difficulty passing urine or controlling the bowels: go to an emergency department",
    "Sudden weakness of the face, arm or leg, or difficulty speaking: call 108",
    "A hot, swollen, painful calf after surgery or a fracture, or sudden breathlessness: call 108",
  ],
  faqs: [
    {
      q: "Is a physiotherapist a doctor?",
      a: "No. Physiotherapists are allied health professionals with a degree in physiotherapy. They are not medical doctors and do not prescribe medicines.",
    },
    {
      q: "Do I need a doctor's referral for physiotherapy?",
      a: "Not always; many clinics see people directly. A referral is useful after surgery or a fracture, or when the cause of pain is not yet known, so that serious conditions are ruled out first.",
    },
    {
      q: "How many sessions will I need?",
      a: "It depends on the problem and your goals. The physiotherapist should give you an estimate after the assessment and review progress regularly.",
    },
    {
      q: "What qualifications should a physiotherapist have?",
      a: "A Bachelor of Physiotherapy (BPT), often with a Master of Physiotherapy (MPT) in a particular area. Ask about registration, as allied health registers are being set up under the National Commission for Allied and Healthcare Professions.",
    },
    {
      q: "Should physiotherapy hurt?",
      a: "Some exercises may be uncomfortable, and mild soreness afterwards can be normal. Sharp or worsening pain is worth telling your physiotherapist about so the programme can be adjusted.",
    },
  ],
};
