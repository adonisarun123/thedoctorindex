import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "concussion",
  title: "Concussion: symptoms, warning signs, recovery and doctors",
  standfirst: "What a concussion is, the symptoms after a head injury, danger signs that need a scan, how recovery works, and when to see a neurologist.",
  targetQuery: "concussion symptoms and recovery",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["emergency-medicine", "neurosurgery", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Headache", "Confusion", "Dizziness", "Nausea", "Memory problems"],
  tests: ["Neurological examination", "CT scan", "MRI"],
  treatments: ["Relative rest", "Gradual return to activity", "Symptom management"],
  body: [
    { k: "h2", text: "What a concussion is" },
    {
      k: "p",
      text: "A concussion is a mild traumatic brain injury. It happens when a blow to the head, or a jolt to the body that whips the head back and forth, makes the brain move inside the skull. This movement can stretch nerve cells and upset how the brain works for a while. Doctors call it mild because it is not usually life-threatening, but the effects can be real and can last days or weeks.",
    },
    {
      k: "p",
      text: "You do not have to be knocked out to have a concussion. Many people never lose consciousness. Common causes in India include two-wheeler and road accidents, falls at home or from a height, falls in older people, sports such as cricket, football and kabaddi, and assaults. Scans are usually normal after a concussion, because the injury affects how brain cells work rather than causing bleeding or visible damage.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms may appear straight away, or only become obvious hours or a day or two later. They include:",
    },
    {
      k: "ul",
      items: [
        "Headache or a feeling of pressure in the head",
        "Confusion, feeling dazed, or being slow to answer",
        "Dizziness or problems with balance",
        "Nausea or vomiting",
        "Memory problems, especially about the injury and the minutes around it",
        "Blurred or double vision, and sensitivity to light or noise",
        "Trouble concentrating, feeling foggy, irritability or low mood",
        "Sleeping much more or much less than usual",
      ],
    },
    {
      k: "p",
      text: "Young children cannot always describe how they feel. Watch for crying that will not settle, a change in feeding or sleeping, loss of interest in favourite toys, or loss of newly learned skills such as walking or toilet training.",
    },

    { k: "h2", text: "Danger signs: when it is an emergency" },
    {
      k: "p",
      text: "Most concussions get better on their own, but a head injury can also cause bleeding inside the skull, which needs urgent surgery. Call 112 or 108, or go straight to the nearest emergency department, if after a head injury the person:",
    },
    {
      k: "ul",
      items: [
        "Was knocked out, even briefly, or cannot be woken easily",
        "Has a headache that gets worse and does not go away",
        "Vomits more than once",
        "Has a seizure (fit)",
        "Has slurred speech, weakness, numbness or clumsiness in an arm or leg",
        "Becomes more confused, restless, agitated or behaves strangely",
        "Has one pupil larger than the other",
        "Has clear fluid or blood coming from the nose or ears, or bruising behind the ears",
        "Is elderly, or takes blood-thinning medicines, even if they seem well",
        "Is a baby or young child who will not stop crying or will not feed",
      ],
    },
    {
      k: "p",
      text: "If the injury involved the neck, for example a fall from a height or a road accident, do not move the person unless they are in danger; wait for the ambulance team.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Concussion is diagnosed from what happened and from the person's symptoms. The doctor will ask how the injury occurred, whether there was any loss of consciousness or memory loss, and how symptoms have changed since. A **neurological examination** checks alertness, memory, speech, vision, pupils, strength, sensation, reflexes, balance and coordination. Sports doctors may use standard symptom checklists and memory questions.",
    },
    {
      k: "p",
      text: "A **CT scan** of the head is not needed for every bump. It is done when there are danger signs, a high-risk injury, older age or blood-thinner use, to look for bleeding or a skull fracture. An **MRI** is sometimes used later if symptoms are not improving as expected. A normal scan does not mean there was no concussion; it means there is no bleeding or other injury that needs surgery.",
    },

    { k: "h2", text: "Treatment and recovery" },
    {
      k: "p",
      text: "There is no medicine that heals a concussion. The brain recovers with time, and treatment is about giving it the right conditions to do so. Most adults feel better within a couple of weeks; children and teenagers can take longer.",
    },
    { k: "h3", text: "The first day or two" },
    {
      k: "p",
      text: "**Relative rest** is advised: quiet activity at home, less screen time, no heavy exercise and no alcohol. Complete rest in a dark room for days is no longer recommended, as it may slow recovery. Someone should stay with the injured person for the first day or so and watch for the danger signs above. It is fine to sleep; if you are unsure whether someone is too drowsy, seek medical advice.",
    },
    { k: "h3", text: "Getting back to normal" },
    {
      k: "p",
      text: "After the first day or two, a **gradual return to activity** helps. Start with light walking and short periods of reading or screen work, and increase step by step as long as symptoms do not get clearly worse. Students may need shorter school days or extra time for assignments at first. Return to sport should follow a staged plan, ideally guided by a doctor, and only once symptoms have settled. Returning to contact sport too early risks a second injury while the brain is still recovering, which can be serious.",
    },
    { k: "h3", text: "Managing symptoms" },
    {
      k: "p",
      text: "**Symptom management** may include simple painkillers such as paracetamol for headache, as advised by your doctor. Avoid painkillers that thin the blood unless a doctor says they are safe. Do not drive until you can concentrate fully and your doctor agrees. Regular sleep, meals and fluids help.",
    },
    { k: "h3", text: "When symptoms last" },
    {
      k: "p",
      text: "Some people have headaches, dizziness, poor concentration, low mood or sleep problems that last for weeks or months. This is sometimes called persistent post-concussion symptoms. It is real, and it is treatable: a neurologist may suggest specific headache treatment, vestibular physiotherapy for dizziness and balance, a structured exercise plan, and help with sleep, mood and anxiety. Repeated concussions, especially in sport, need specialist advice about whether and when to return.",
    },

    { k: "h2", text: "Preventing head injuries" },
    {
      k: "ul",
      items: [
        "Wear a properly fastened helmet on every two-wheeler ride, as rider and as pillion, and put a helmet on children too",
        "Use seat belts and age-appropriate car seats for children",
        "Use protective gear and follow head-injury rules in sport",
        "Reduce falls at home for older people: good lighting, grab bars in the bathroom, no loose mats, and a review of medicines that cause dizziness",
        "Fit window and balcony guards and stair gates where small children live",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Anyone with danger signs needs an [emergency medicine](/specialties/emergency-medicine) team first. If a scan shows bleeding, a [neurosurgeon](/specialties/neurosurgery) will decide whether surgery is needed. For an uncomplicated concussion, a [general physician](/specialties/general-practice) or a [paediatrician](/specialties/paediatrics) for children can guide recovery. A [neurologist](/specialties/neurology) is the right specialist if symptoms are not improving after a couple of weeks, if there have been repeated concussions, or if there is any doubt about the diagnosis. Some people also benefit from a [physiotherapist](/specialties/physiotherapy) trained in vestibular rehabilitation.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [neurosurgeons in Bengaluru](/doctors/karnataka/bengaluru/neurosurgeons) or [emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians) on The Doctor Index, each with a registration you can check. If a head injury has led to fits, read about [seizures](/conditions/seizures); persistent headaches can sometimes resemble [migraine](/conditions/migraine).",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Do I need a scan, and if not, why not?",
        "Which warning signs mean I should come back straight away?",
        "When can I go back to work, school, driving and sport?",
        "What can I take for the headache?",
        "What should I do if symptoms are not better in two weeks?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is it safe to sleep after a head injury?",
      a: "Yes, sleep is part of recovery and there is no need to keep someone awake all night. What matters is that a responsible adult is nearby for the first day or so, and that anyone who is hard to wake, confused or vomiting repeatedly is taken to hospital.",
    },
    {
      q: "Do I need a CT scan after hitting my head?",
      a: "Not always. Doctors decide based on danger signs such as loss of consciousness, repeated vomiting, worsening headache, confusion, age and blood-thinner use. Many people with a mild concussion do not need a scan, but anyone with danger signs should be assessed in an emergency department.",
    },
    {
      q: "How long does concussion take to heal?",
      a: "Most adults feel back to normal within a couple of weeks, while children and teenagers often take a little longer. A minority have symptoms for weeks or months. If you are not improving, see a doctor rather than waiting it out.",
    },
    {
      q: "When can my child go back to cricket or football?",
      a: "Only after symptoms have fully settled and after a step-by-step return that starts with light activity and builds up to full contact play. A doctor should clear a child before any return to contact sport. Returning too early risks a second, more serious injury.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Concussion", url: "https://medlineplus.gov/concussion.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
