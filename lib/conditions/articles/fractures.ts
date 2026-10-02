import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "fractures",
  title: "Fractures (broken bones): signs, first aid, treatment and recovery",
  metaTitle: "Broken bones: signs, first aid, treatment and recovery",
  standfirst: "How to tell if a bone may be broken, first aid while you get help, how fractures are diagnosed and treated, and what recovery and physiotherapy involve.",
  targetQuery: "fracture symptoms first aid and treatment",
  department: "orthopaedics",
  specialty: "orthopaedics",
  alsoSee: ["emergency-medicine", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Severe pain", "Swelling", "Bruising", "Deformity", "Unable to bear weight"],
  tests: ["X-ray", "CT scan", "MRI", "Bone density scan"],
  treatments: ["Cast or splint", "Reduction", "Internal fixation", "Physiotherapy"],
  body: [
    { k: "h2", text: "What a fracture is" },
    {
      k: "p",
      text: "A fracture is a break in a bone. Fracture, break and crack all mean the same thing. Bones can break in many ways: a hairline crack, a clean break straight across, a break into several pieces, or one where the broken ends shift out of line. In an *open* (compound) fracture, the bone breaks through the skin or a wound reaches the bone; this needs emergency care because of the risk of infection.",
    },
    {
      k: "p",
      text: "Most fractures are caused by a fall, a road accident or a sports injury. Some happen with little force in bones weakened by osteoporosis, and *stress fractures* develop gradually from repeated strain, such as long-distance running or marching. Children's bones are more flexible and can bend or partially break; injuries near the growth plates need careful follow-up.",
    },

    { k: "h2", text: "Signs of a broken bone" },
    {
      k: "ul",
      items: [
        "Severe pain at the injured spot, which is worse when you move or press on it",
        "Swelling, often coming on quickly",
        "Bruising or a change in colour",
        "Deformity — the limb looks bent, shortened or out of shape",
        "Unable to bear weight on a leg, or to use an arm or hand normally",
        "A snap or grinding sound at the time of injury",
        "Numbness, tingling or a cold, pale limb beyond the injury",
      ],
    },
    {
      k: "p",
      text: "A bad sprain can look very similar. If you are unsure, get it checked — some fractures, such as a small wrist bone or a hip fracture in an older person, are easily missed.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "Anyone can break a bone, but the risk is higher with:" },
    {
      k: "ul",
      items: [
        "Riding two-wheelers, especially without a helmet or protective gear",
        "Contact sports and work at heights",
        "Older age, falls and poor balance",
        "Osteoporosis, long-term steroid use and some other medical conditions",
        "Smoking and heavy drinking, which also slow healing",
        "Sudden increases in running, training or marching distance (stress fractures)",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A doctor will examine the injured area, check the skin, and test the blood supply and nerves beyond the injury. An **X-ray** is the standard test and is usually taken from at least two angles. Some fractures are hard to see at first, so a repeat X-ray may be done after a week or two.",
    },
    {
      k: "p",
      text: "A **CT scan** gives a detailed picture of complex fractures, especially around joints, the pelvis and the spine, and helps plan surgery. An **MRI** can show hidden fractures, stress fractures and injuries to ligaments and soft tissue. If a fracture happened after a minor fall in an adult over fifty, a **bone density scan** may be advised to check for osteoporosis.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A suspected fracture should be seen the same day. Serious injuries go to an emergency department, where [emergency physicians](/specialties/emergency-medicine) assess them first. An [orthopaedic surgeon](/specialties/orthopaedics) treats fractures, decides whether surgery is needed and follows healing. [Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, help restore movement and strength afterwards.",
    },
    {
      k: "p",
      text: "You can [find orthopaedic surgeons in Bengaluru](/doctors/karnataka/bengaluru/orthopaedic-surgeons), [emergency physicians](/doctors/karnataka/bengaluru/emergency-physicians) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },
    {
      k: "note",
      text: "Avoid traditional bone-setting, massage or tight herbal bandaging for a suspected fracture. Without an X-ray the bone may heal out of line, and tight wrapping can cut off blood supply to the limb. Orthopaedic surgeons in India regularly see serious complications after such treatment.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "The aim is to get the broken ends in the right position and hold them still while the bone heals. The approach depends on which bone is broken, how it has broken, your age and your activity.",
    },
    { k: "h3", text: "Cast, splint or brace" },
    {
      k: "p",
      text: "Many fractures heal well in a **cast or splint** made of plaster or fibreglass, or in a removable brace or boot. Keep the cast dry, do not push objects inside to scratch, and keep the limb raised in the first days to reduce swelling.",
    },
    { k: "h3", text: "Reduction" },
    {
      k: "p",
      text: "If the bone has moved out of place, the doctor may perform a **reduction**: moving the pieces back into line, usually with pain relief or anaesthesia, before applying a cast.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "**Internal fixation** uses plates, screws, rods or wires to hold the bone in place. It is often needed for unstable fractures, fractures involving joints, open fractures and many hip fractures. Sometimes an external frame outside the skin holds the bone. Hip fractures in older people are usually operated on quickly, because early surgery helps people get moving again.",
    },
    { k: "h3", text: "Physiotherapy and rehabilitation" },
    {
      k: "p",
      text: "**Physiotherapy** starts as soon as it is safe — sometimes while the cast is still on — to keep nearby joints moving and muscles working, and continues after the cast comes off to rebuild strength and confidence.",
    },
    {
      k: "p",
      text: "Pain relief such as paracetamol is often enough. Take medicines as prescribed and ask before using anti-inflammatory tablets for long periods.",
    },

    { k: "h2", text: "Recovery and living with it" },
    {
      k: "p",
      text: "Bones take weeks to months to heal, depending on the bone, your age and your health. Children heal faster; smokers, people with diabetes and older adults heal more slowly. Keep follow-up appointments for X-rays to check healing, and do not take weight on a limb before your doctor says you can. Stiffness and weakness are normal after a cast; regular exercises help. Eat enough protein, calcium and vitamin D, and stop smoking. If the fracture followed a minor fall, ask about bone health and fall prevention.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108 for:" },
    {
      k: "ul",
      items: [
        "Bone visible through the skin, or a wound over a suspected fracture",
        "A badly deformed limb, or a limb that is numb, cold, pale or blue",
        "Heavy bleeding",
        "A suspected neck, back, pelvis or thigh-bone fracture — do not move the person unless they are in danger",
        "An injury with a head injury, breathing difficulty or confusion",
      ],
    },
    {
      k: "p",
      text: "While you wait, support the injured limb in the position you found it, stop bleeding with gentle pressure using a clean cloth, apply a cold pack wrapped in cloth, remove rings and bangles from an injured arm before swelling starts, and do not give food or drink in case surgery is needed. After a cast is applied, get urgent care for pain that keeps increasing, numbness, or fingers or toes that turn pale or blue.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of fracture is it, and is it in a good position?",
        "Does it need a cast, surgery or both?",
        "How long will healing take, and when will I have follow-up X-rays?",
        "When can I put weight on it, drive or return to work?",
        "What exercises should I do, and when should I start physiotherapy?",
        "Should my bone strength be checked?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can I walk on a broken bone?",
      a: "Sometimes people can walk on a small fracture, so being able to walk does not rule one out. Walking on an untreated fracture can make it worse. If you have pain, swelling or difficulty bearing weight after an injury, get an X-ray before putting full weight on it.",
    },
    {
      q: "Is it safe to go to a traditional bone setter?",
      a: "It is not advisable for a suspected fracture. Without imaging the bone may heal in the wrong position, and tight bandaging can damage blood vessels and nerves. An orthopaedic surgeon can assess alignment with an X-ray and choose the right treatment.",
    },
    {
      q: "How long does a fracture take to heal?",
      a: "It depends on the bone, the type of break, your age and your general health. A small bone in a child may heal within weeks, while a thigh-bone fracture in an adult can take months. Your doctor will track healing with follow-up X-rays.",
    },
    {
      q: "Will the metal plate need to be removed?",
      a: "Usually not. Plates, screws and rods are commonly left in place for life. They may be removed if they cause pain, irritation or infection, or in some younger patients. Your surgeon will advise based on the type of implant and your symptoms.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Fractures", url: "https://medlineplus.gov/fractures.html" },
    { label: "American Academy of Orthopaedic Surgeons OrthoInfo — Fractures (broken bones)", url: "https://www.orthoinfo.org/diseases--conditions/fractures-broken-bones" },
    { label: "Indian Journal of Orthopaedics Surgery — Mismanagement by native bone setters and its complications", url: "https://ijos.co.in/archive/volume/6/issue/4/article/17005" },
  ],
};
