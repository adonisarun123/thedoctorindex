import type { SpecialtyContent } from "./types";

export const neurology: SpecialtyContent = {
  key: "neurology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A neurologist is a physician who specialises in the brain, spinal cord, nerves and muscles. In India the usual route is an MBBS, a postgraduate degree in general medicine or paediatrics, and then a super-speciality degree such as DM Neurology or DrNB Neurology. Neurologists diagnose and treat with medicines, rehabilitation and some procedures, but they do not operate; when surgery is needed, a neurosurgeon does it.",
    "Much of neurology is careful diagnosis. A neurologist spends time on the story of the symptoms and on a detailed examination of strength, reflexes, sensation, coordination, speech and memory, and then uses scans and nerve tests to confirm what the examination suggests. Some neurologists concentrate on one area, such as stroke, epilepsy, movement disorders, headache, memory, or conditions of the nerves and muscles, and child neurology is a field of its own.",
    "Many people reach a neurologist through a general physician after headaches, numbness, blackouts or a tremor. Stroke is different: it is an emergency, and sudden weakness of the face, arm or leg, trouble speaking or a sudden severe headache means calling 108 and going to a hospital that can treat stroke, not booking an appointment. For long-term conditions such as epilepsy or Parkinson's disease, a neurologist you can return to with your records is worth a great deal.",
  ],
  conditions: [
    { name: "Stroke and mini-stroke (TIA)", note: "A blocked or bleeding blood vessel in the brain. Emergency treatment first, then prevention and recovery." },
    { name: "Epilepsy and seizures", note: "Recurrent fits or blackouts, diagnosed from the history and tests and usually controlled with medicines." },
    { name: "Migraine and other headaches", note: "Recurring headaches, most not dangerous, but a change in pattern or a sudden severe headache needs assessment." },
    { name: "Parkinson's disease and movement disorders", note: "Tremor, stiffness, slowness of movement and related conditions." },
    { name: "Dementia and memory problems", note: "Assessment of memory loss and changes in thinking or behaviour, often in older adults." },
    { name: "Peripheral neuropathy", note: "Damage to the nerves of the hands and feet, causing numbness, tingling or pain; diabetes is a common cause." },
    { name: "Multiple sclerosis and related conditions", note: "Inflammation affecting the brain, spinal cord or optic nerves, with symptoms that can come and go." },
    { name: "Muscle and nerve-muscle disorders", note: "Conditions such as myasthenia gravis and muscular dystrophy that cause weakness." },
    { name: "Infections of the brain", note: "Meningitis and encephalitis, which are emergencies, and their longer-term effects." },
  ],
  tests: [
    { name: "Neurological examination", note: "A hands-on check of strength, reflexes, sensation, balance, eye movements and speech; often the most informative step." },
    { name: "CT scan of the brain", note: "Quick imaging used in emergencies, especially to look for bleeding in suspected stroke." },
    { name: "MRI of the brain or spine", note: "More detailed pictures of the brain and spinal cord, used for many long-term conditions." },
    { name: "EEG (electroencephalogram)", note: "Records the brain's electrical activity through small discs on the scalp; used in epilepsy." },
    { name: "Nerve conduction studies and EMG", note: "Measure how well nerves and muscles work, to diagnose neuropathy and muscle disease." },
    { name: "Lumbar puncture", note: "A small sample of fluid from around the spinal cord, taken from the lower back, to look for infection or inflammation." },
    { name: "Blood tests", note: "Check sugar, vitamins such as B12, thyroid function and other causes of nerve symptoms." },
    { name: "Carotid Doppler", note: "An ultrasound of the neck arteries after a stroke or mini-stroke, to look for narrowing." },
  ],
  versus: [
    { key: "neurosurgery", text: "Neurologists diagnose and treat brain and nerve conditions without surgery. Neurosurgeons operate, for example on brain tumours, bleeding in the brain or a disc pressing on the spinal cord. Many patients see a neurologist first." },
    { key: "psychiatry", text: "Memory loss, mood change and unusual behaviour can come from the brain's structure or from mental illness. A neurologist looks for conditions such as dementia or epilepsy; a psychiatrist treats mental health conditions. The two often work together." },
    { key: "general-practice", text: "A general physician is the right first stop for most headaches, dizziness and tingling, and will refer to a neurologist when symptoms point to the nervous system or do not settle." },
  ],
  firstVisit: [
    "Bring all earlier scan reports and the images on disc, EEG and nerve test reports, and a list of current medicines.",
    "If you have blackouts or seizures, bring someone who has seen one, or a phone video of an episode; this is often the most useful single piece of information.",
    "Keep a simple diary of headaches or episodes before the visit: date, time, how long, what you were doing and what helped.",
    "For memory problems, bring a family member who knows how things have changed over time.",
    "Expect a detailed examination. Scans or nerve tests are often booked for a later date rather than done on the day.",
  ],
  urgent: [
    "Sudden weakness or numbness of the face, arm or leg, especially on one side: call 108, as stroke treatment is time-critical",
    "Sudden difficulty speaking or understanding, or sudden loss of vision",
    "A sudden, very severe headache, the worst ever, or headache with fever, stiff neck and confusion",
    "A seizure lasting more than five minutes, or seizures one after another without waking in between",
  ],
  faqs: [
    {
      q: "What is the difference between a neurologist and a neurosurgeon?",
      a: "A neurologist diagnoses and treats disorders of the brain, spinal cord, nerves and muscles with medicines and other non-surgical treatment. A neurosurgeon operates on the brain, spine and nerves when surgery is needed.",
    },
    {
      q: "What are the warning signs of a stroke?",
      a: "Sudden weakness or drooping of the face, weakness of an arm or leg, and trouble speaking. A sudden severe headache can also be a warning sign. Call 108 straight away; every minute counts.",
    },
    {
      q: "Should I see a neurologist for headaches?",
      a: "Most headaches are managed well by a general physician. See a neurologist if headaches change in pattern, become more frequent or severe, or come with other symptoms such as weakness or vision change.",
    },
    {
      q: "What qualifications should a neurologist have?",
      a: "An MBBS, a postgraduate degree usually in general medicine or paediatrics, and then a super-speciality degree such as DM Neurology or DrNB Neurology. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Can epilepsy be controlled?",
      a: "In many people, yes, with regular medicines taken exactly as prescribed. A neurologist will also discuss driving, pregnancy, work and safety, and what to do if seizures continue.",
    },
  ],
};
