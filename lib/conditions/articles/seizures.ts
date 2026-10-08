import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "seizures",
  title: "Seizures (fits): causes, first aid, tests and which doctor to see",
  metaTitle: "Seizures (fits): causes, first aid, tests and treatment",
  standfirst: "What a seizure or fit is, the common causes in adults and children, what to do when someone has one, the tests that follow, and when to see a neurologist.",
  targetQuery: "seizure causes and first aid",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["emergency-medicine", "paediatrics", "neurosurgery"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Jerking movements", "Loss of consciousness", "Staring spells", "Confusion afterwards"],
  tests: ["EEG", "MRI", "CT scan", "Blood tests"],
  treatments: ["Seizure first aid", "Anti-seizure medicines", "Treating the underlying cause"],
  body: [
    { k: "h2", text: "What a seizure is" },
    {
      k: "p",
      text: "A seizure, often called a fit, is a sudden burst of abnormal electrical activity in the brain. The brain's nerve cells normally send signals in an orderly way; during a seizure, many of them fire together, which can change movement, sensation, awareness or behaviour for a short time. Most seizures last from a few seconds to a couple of minutes and stop on their own.",
    },
    {
      k: "p",
      text: "A seizure is a symptom, not a diagnosis. It can be a one-off event triggered by something else, such as a high fever in a young child or very low blood sugar. When a person has repeated seizures that are not triggered by such a cause, the condition is called [epilepsy](/conditions/epilepsy). Having a single seizure does not necessarily mean you have epilepsy.",
    },

    { k: "h2", text: "Types and symptoms" },
    {
      k: "p",
      text: "What a seizure looks like depends on where in the brain it starts and how far it spreads.",
    },
    {
      k: "ul",
      items: [
        "Tonic-clonic seizures — the type most people picture. The person may cry out, have loss of consciousness, fall, stiffen, and then have rhythmic jerking movements of the arms and legs. They may bite the tongue or wet themselves, and breathing may look noisy or irregular.",
        "Focal seizures — start in one area of the brain. The person may stay aware but have twitching of one limb, a strange smell or taste, a rising feeling in the stomach or a sense of déjà vu; or awareness may be affected, with blank staring, lip smacking, fumbling with clothes or wandering.",
        "Absence seizures — mostly in children: brief staring spells of a few seconds, often mistaken for daydreaming, which can happen many times a day.",
        "Myoclonic and atonic seizures — sudden jerks, or a sudden loss of muscle tone causing a drop.",
      ],
    },
    {
      k: "p",
      text: "After a larger seizure, it is common to have confusion afterwards, drowsiness, headache and aching muscles for minutes to hours. Some people feel a warning, called an aura, just before a seizure.",
    },

    { k: "h2", text: "Causes" },
    {
      k: "ul",
      items: [
        "Epilepsy, which may be linked to genetic factors, brain injury at birth, or no identifiable cause",
        "Febrile seizures in young children with a high temperature, usually harmless but frightening",
        "Infections of the brain such as [meningitis](/conditions/meningitis) and [encephalitis](/conditions/encephalitis), and in India, neurocysticercosis — tapeworm cysts in the brain from pork tapeworm eggs swallowed through contaminated food or water",
        "Head injury, [stroke](/conditions/stroke) and brain tumours",
        "Very low blood sugar, for example in people on diabetes medicines, and low sodium or calcium",
        "Alcohol withdrawal, or some recreational drugs and medicines",
        "Eclampsia, a serious complication of high blood pressure in pregnancy",
        "Lack of sleep, which can trigger seizures in people who are prone to them",
      ],
    },
    {
      k: "p",
      text: "Some events can look like seizures but are not, such as fainting, heart rhythm problems, and non-epileptic attacks linked to stress. A careful description from someone who saw the event is very helpful to the doctor.",
    },

    { k: "h2", text: "What to do when someone has a seizure" },
    {
      k: "p",
      text: "**Seizure first aid** is simple, and the most important thing is to keep the person safe until it stops.",
    },
    {
      k: "steps",
      items: [
        { title: "Stay calm and time it", text: "Note when the seizure starts. Stay with the person." },
        { title: "Protect them", text: "Move hard or sharp objects away, cushion the head with something soft, and loosen anything tight around the neck. Do not hold them down." },
        { title: "Nothing in the mouth", text: "Do not put a spoon, finger, water or anything else in the mouth. A person cannot swallow their tongue. Do not make them smell onions or shoes, and do not put keys in their hand; these do not help." },
        { title: "Turn them on their side", text: "When the jerking stops, roll them gently onto their side in the recovery position so saliva can drain and the airway stays open." },
        { title: "Stay until they recover", text: "Speak calmly and stay until they are fully awake. Do not give food or drink until they can swallow normally." },
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108 if:" },
    {
      k: "ul",
      items: [
        "It is the person's first seizure",
        "The seizure lasts more than five minutes, or one seizure follows another without the person waking in between",
        "The person does not start to wake up, or has difficulty breathing afterwards",
        "The seizure happened in water, or the person was injured",
        "The person is pregnant, has diabetes, or has a high fever, severe headache, stiff neck or rash",
        "The person has had a head injury",
      ],
    },
    {
      k: "p",
      text: "People with known epilepsy who have a usual, short seizure and recover fully may not need hospital, but should follow their own seizure plan.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will want a detailed account from you and from anyone who saw the event: what you were doing, any warning, what your body did, how long it lasted, and how you were afterwards. A video taken on a phone by a family member can be very useful. Tests then look for the cause:",
    },
    {
      k: "ul",
      items: [
        "**Blood tests** — sugar, sodium, calcium, kidney and liver function, and signs of infection",
        "**CT scan** — often done first in the emergency department to look for bleeding, injury or a mass",
        "**MRI** — gives a more detailed picture of the brain and can show scarring, malformations, tumours and cysts such as those of neurocysticercosis",
        "**EEG** (electroencephalogram) — records the brain's electrical activity through small discs on the scalp. It can show patterns that suggest epilepsy and help classify the type, but a normal EEG does not rule epilepsy out.",
        "An ECG, to check the heart rhythm if fainting is possible; and sometimes a lumbar puncture if infection is suspected",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "**Treating the underlying cause** comes first: correcting low sugar or sodium, treating infection, controlling fever, managing alcohol withdrawal, or treating eclampsia urgently. If the cause is removed, the seizures may not come back.",
    },
    {
      k: "p",
      text: "If you have had more than one unprovoked seizure, or tests show a high chance of further seizures, your neurologist may recommend **anti-seizure medicines**. Many people become seizure-free with the right medicine. They work only if taken every day; missing doses is one of the commonest reasons seizures return. Never stop them suddenly without advice, as this can trigger severe seizures. Tell your doctor if you are pregnant or planning a pregnancy, as some medicines need to be changed in advance.",
    },
    {
      k: "p",
      text: "Neurocysticercosis is treated with specific medicines and steroids, chosen by the neurologist, along with anti-seizure medicines. For a few people whose seizures continue despite medicines, specialist epilepsy centres may consider surgery, a special diet or a nerve stimulator. Doctors may also prescribe a rescue medicine that family members can give if a seizure goes on too long.",
    },

    { k: "h2", text: "Staying safe" },
    {
      k: "ul",
      items: [
        "Keep a seizure diary with dates, possible triggers and missed doses, and take it to every appointment",
        "Sleep regularly and limit alcohol",
        "Do not swim alone, and prefer showers to baths; avoid heights and unguarded fires or stoves",
        "Do not drive until your doctor confirms it is safe and the legal requirements are met",
        "Let family, colleagues or teachers know what to do during a seizure",
        "Lower the risk of neurocysticercosis by washing raw vegetables and fruit well, drinking safe water and washing hands with soap before eating; cooking pork thoroughly also prevents the gut tapeworm that spreads the eggs",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "After a first seizure, people are usually seen in an [emergency medicine](/specialties/emergency-medicine) department and then referred to a [neurologist](/specialties/neurology), who investigates the cause and decides on treatment. Children are seen by a [paediatrician](/specialties/paediatrics) or paediatric neurologist. A [neurosurgeon](/specialties/neurosurgery) is involved when there is a brain injury, tumour, or when epilepsy surgery is considered.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Does one seizure mean I have epilepsy?",
      a: "Not necessarily. Many people have a single seizure with a clear trigger, such as low sugar, high fever or alcohol withdrawal, and never have another. Epilepsy is usually diagnosed after two or more unprovoked seizures, or one seizure with tests showing a high risk of more.",
    },
    {
      q: "Should I put something in the mouth during a fit?",
      a: "No. Never put a spoon, finger or anything else in the mouth of someone having a seizure. They cannot swallow their tongue, and objects can break teeth or block the airway. Cushion the head, time the seizure, and turn them on their side afterwards.",
    },
    {
      q: "Are febrile seizures in children dangerous?",
      a: "Most febrile seizures are brief, stop on their own, and do not cause brain damage or lead to epilepsy. A child should still be checked by a doctor after the first one to look for the cause of the fever, especially to rule out meningitis.",
    },
    {
      q: "Can I stop my seizure medicine if I have been fit-free?",
      a: "Only with your neurologist's advice. Some people who have been seizure-free for a long time can slowly come off medicine, but stopping suddenly can trigger severe seizures. Your doctor will weigh your type of epilepsy, EEG and history before deciding.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Seizures", url: "https://medlineplus.gov/seizures.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
