import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "bell-s-palsy",
  title: "Bell's palsy: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Bell's palsy: symptoms, treatment and which doctor to see",
  standfirst: "What Bell's palsy is, how it differs from a stroke, why early treatment and eye care matter, and when to see a neurologist.",
  targetQuery: "bell's palsy symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["ent", "physiotherapy", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Facial weakness", "Drooping eyelid", "Drooling", "Dry eye", "Pain behind the ear"],
  tests: ["Neurological examination", "Blood sugar", "MRI", "Nerve conduction"],
  treatments: ["Corticosteroids", "Antiviral medicines", "Eye protection", "Facial exercises"],
  body: [
    { k: "h2", text: "What Bell's palsy is" },
    {
      k: "p",
      text: "Bell's palsy is a sudden weakness or paralysis of the muscles on one side of the face. It happens when the facial nerve, which runs from the brain through a narrow bony canal near the ear to the face, becomes inflamed and swollen. Squeezed inside that canal, the nerve stops carrying signals properly, and the muscles it controls go slack.",
    },
    {
      k: "p",
      text: "It is the most common cause of one-sided facial paralysis, and it can be frightening because it appears so quickly — often noticed on waking or over a single day. The good news is that most people recover fully or nearly fully, usually over weeks to a few months. A smaller group are left with some lasting weakness or tightness of the face.",
    },
    {
      k: "p",
      text: "The name 'Bell's palsy' is used only after other causes of facial weakness have been ruled out. That matters because a stroke, an ear infection, a tumour pressing on the nerve, or shingles of the ear can all cause similar weakness and need different care.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms come on suddenly and usually reach their worst within two or three days. They can range from mild weakness to complete paralysis of one side of the face:",
    },
    {
      k: "ul",
      items: [
        "Facial weakness on one side, making it hard to smile, frown, raise the eyebrow or puff out the cheek",
        "A drooping eyelid or a drooping corner of the mouth, and difficulty closing the eye fully",
        "Drooling, or food and drink escaping from one side of the mouth",
        "Dry eye on the affected side, or the opposite — excess tearing",
        "Pain behind the ear or in the jaw, sometimes a day or two before the weakness",
        "Changes in taste on the front of the tongue",
        "Sounds seeming unusually loud in the ear on the affected side",
      ],
    },
    {
      k: "p",
      text: "In Bell's palsy the whole side of the face is affected, including the forehead. That is one of the clues doctors use to tell it apart from a stroke, which usually spares the forehead. You should never try to make that judgement yourself, though — see the emergency section below.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The exact cause is not known. Many experts think a viral infection — most often the virus that causes cold sores — reactivates and inflames the facial nerve, but this has not been proven in every case. Bell's palsy is not a stroke, and you cannot catch it from someone else.",
    },
    { k: "p", text: "It can happen at any age, but it is more likely in people who:" },
    {
      k: "ul",
      items: [
        "Have diabetes",
        "Are pregnant, especially in the last months, or have just given birth",
        "Have recently had a cold, flu or other upper respiratory infection",
        "Have high blood pressure or obesity",
        "Have had Bell's palsy before, or have a family history of it",
      ],
    },
    {
      k: "p",
      text: "A related condition called Ramsay Hunt syndrome is caused by [shingles](/conditions/shingles) affecting the facial nerve. It usually comes with a painful rash or blisters in or around the ear and can also affect hearing and balance. It is treated a little differently, so mention any rash to your doctor.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no single test that proves Bell's palsy. The diagnosis is based on how quickly the weakness came on, its pattern, and the absence of other causes. The doctor will:",
    },
    {
      k: "ul",
      items: [
        "Ask when the weakness started, whether anything else feels different, and about recent infections, rashes or injuries",
        "Do a **neurological examination**, checking the forehead, eyes and mouth, as well as the arms, legs, speech and balance",
        "Look in the ears and mouth for signs of infection or a shingles rash",
        "Check **blood sugar**, as diabetes is a common risk factor and affects treatment",
      ],
    },
    {
      k: "p",
      text: "Scans are not needed for most people with a typical picture. Your doctor may order an **MRI** or CT scan if the weakness is unusual, came on slowly, affects both sides, or does not start improving after a few weeks. **Nerve conduction** tests, which measure how well the nerve carries signals, are sometimes used in severe or slow-recovering cases to help predict recovery.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Many people improve without treatment, but early treatment helps more people recover fully. The first few days count, so see a doctor the same day the weakness appears.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Corticosteroids** (steroid tablets) reduce swelling of the nerve and are the main treatment. They work best when started early, ideally within the first three days. Your doctor will weigh this against conditions such as diabetes, where steroids raise blood sugar and monitoring may be needed. **Antiviral medicines** are sometimes added alongside steroids, especially in severe cases; the evidence that they add benefit is less certain, so practice varies between doctors.",
    },
    { k: "h3", text: "Eye protection" },
    {
      k: "p",
      text: "If the eyelid does not close properly, the eye can dry out and the clear front surface can be scratched or ulcerated without you noticing. **Eye protection** is therefore as important as any medicine:",
    },
    {
      k: "ul",
      items: [
        "Use lubricating eye drops during the day and a thicker eye ointment at night, as advised",
        "Tape the eyelid gently shut or use an eye patch at night if it does not close",
        "Wear glasses or sunglasses outdoors to keep out dust and wind",
        "See an eye doctor promptly if the eye becomes painful, red or your vision blurs",
      ],
    },
    { k: "h3", text: "Physiotherapy and longer-term care" },
    {
      k: "p",
      text: "A physiotherapist can teach gentle **facial exercises** and massage to keep the muscles supple while the nerve recovers. Avoid forceful exercises or electrical stimulation unless a specialist recommends them, because over-working the muscles can encourage unwanted movements as the nerve heals. If weakness persists after several months, a neurologist, ENT surgeon or plastic surgeon can discuss options such as targeted injections, eyelid procedures or facial reanimation surgery.",
    },

    { k: "h2", text: "Living with Bell's palsy" },
    {
      k: "ul",
      items: [
        "Chew on the unaffected side and take smaller mouthfuls; rinse the mouth after meals, as food can collect in the cheek",
        "Drink with a straw if liquids spill",
        "Protect the eye every day until it closes fully again",
        "Expect recovery to be gradual: many people notice the first signs within a few weeks, but full recovery can take months",
        "Talk to someone if the change in your face is affecting your confidence or mood — this is common and worth raising with your doctor",
      ],
    },
    {
      k: "p",
      text: "Some people develop 'synkinesis' as the nerve heals, where the eye closes when they smile, or the eye waters when they eat. Specialist physiotherapy and other treatments can help with this.",
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Facial weakness can be a sign of [stroke](/conditions/stroke). Call 112 or 108 immediately, and do not wait to see if it settles, if facial drooping comes with any of these:",
    },
    {
      k: "ul",
      items: [
        "Weakness or numbness in an arm or leg",
        "Slurred speech, difficulty finding words or understanding others",
        "Sudden confusion, loss of balance, double vision or loss of vision",
        "A sudden, severe headache",
        "Weakness affecting both sides of the face",
      ],
    },
    {
      k: "p",
      text: "If you are not sure whether it is Bell's palsy or a stroke, treat it as a stroke and go to the nearest emergency department. Stroke treatment is time-critical, and an emergency team can quickly rule it in or out.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) or emergency doctor can usually diagnose typical Bell's palsy and start treatment the same day. A [neurologist](/specialties/neurology) is worth seeing if the diagnosis is uncertain, the weakness is severe or recurrent, or it is not improving after a few weeks. An [ENT specialist](/specialties/ent) is helpful if there is ear pain, discharge, hearing loss or a rash in the ear, and a [physiotherapist](/specialties/physiotherapy) can guide facial rehabilitation.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) or [physiotherapists in Bengaluru](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Are you confident this is Bell's palsy and not something else?",
        "Should I take steroids, and do I need my blood sugar monitored while on them?",
        "How should I protect my eye, and when should an eye doctor see it?",
        "Which facial exercises are safe for me, and which should I avoid?",
        "When should I expect improvement, and when should I come back if it does not happen?",
      ],
    },
  ],
  faqs: [
    {
      q: "How long does Bell's palsy take to get better?",
      a: "Most people start to improve within a few weeks, and many recover fully within a few months. Recovery can be slower when the paralysis was complete at the start. Some people are left with mild weakness or tightness.",
    },
    {
      q: "Is Bell's palsy a type of stroke?",
      a: "No. Bell's palsy affects the facial nerve outside the brain, while a stroke affects the brain itself. But because they can look alike, sudden facial weakness should always be checked urgently, especially if any other part of the body is affected.",
    },
    {
      q: "Can Bell's palsy come back?",
      a: "It can, though most people have it only once. If it returns, or affects both sides of the face, your doctor is likely to look harder for another cause, which may include blood tests or a scan.",
    },
    {
      q: "Is Bell's palsy in pregnancy dangerous for the baby?",
      a: "Bell's palsy itself does not harm the baby, but pregnant women with it should be checked for high blood pressure and other problems. The doctor will consider pregnancy when deciding whether steroids or other medicines are appropriate.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Bell's Palsy", url: "https://medlineplus.gov/bellspalsy.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
