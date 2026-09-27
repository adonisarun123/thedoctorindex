import type { SpecialtyContent } from "./types";

export const physicalMedicineRehabilitation: SpecialtyContent = {
  key: "physical-medicine-rehabilitation",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Physical medicine and rehabilitation (often shortened to PMR) is the medical speciality concerned with restoring function and independence after illness, injury or surgery. Its doctors, called rehabilitation physicians or physiatrists, are medically qualified: in India the usual route is an MBBS followed by a postgraduate degree such as MD Physical Medicine and Rehabilitation or DNB in the subject.",
    "The focus is less on curing a disease and more on what a person can do: walk, use their hands, speak, swallow, look after themselves and return to work or school. A rehabilitation physician examines, diagnoses, prescribes medicines, gives certain injections, orders splints, orthoses, wheelchairs and artificial limbs, and sets goals for a team that usually includes physiotherapists, occupational therapists, speech therapists, prosthetists and psychologists.",
    "Rehabilitation can happen on a ward, soon after a stroke or major surgery, in a dedicated rehabilitation unit, or as outpatient visits over months. PMR departments are found mainly in larger hospitals and medical colleges. Where there is no rehabilitation physician nearby, a neurologist, orthopaedic surgeon or physiotherapist often leads recovery instead, but complex cases such as spinal cord injury benefit from a specialist-led team.",
  ],
  conditions: [
    { name: "Recovery after stroke", note: "Regaining movement, balance, speech, swallowing and self-care after a stroke." },
    { name: "Spinal cord injury", note: "Long-term planning for mobility, bladder and bowel care, skin protection and equipment after damage to the spinal cord." },
    { name: "Traumatic brain injury", note: "Rehabilitation of movement, thinking, behaviour and communication after a head injury." },
    { name: "Amputation", note: "Preparing the limb, fitting an artificial limb and training to use it." },
    { name: "Cerebral palsy and childhood disability", note: "Therapy, splinting and equipment planning for children with movement disorders." },
    { name: "Spasticity", note: "Muscle stiffness after stroke, brain or spinal injury, treated with stretching, splints, medicines or injections." },
    { name: "Chronic back, neck and joint pain", note: "Non-surgical treatment of long-standing pain that limits daily life, including exercise programmes and injections." },
    { name: "Recovery after major surgery or critical illness", note: "Rebuilding strength and independence after joint replacement, heart surgery or a long stay in intensive care." },
    { name: "Neuromuscular conditions", note: "Maintaining function in conditions such as muscular dystrophy and nerve disorders." },
  ],
  tests: [
    { name: "Functional assessment", note: "A structured look at walking, balance, hand use and self-care, used to set goals and measure progress." },
    { name: "Nerve conduction studies and EMG", note: "Tests of the nerves and muscles, done by some rehabilitation physicians, to find where weakness or numbness comes from." },
    { name: "Gait analysis", note: "Watching or recording how a person walks to plan therapy, footwear or braces." },
    { name: "Spasticity injections", note: "Injections into stiff muscles to relax them and make stretching and movement easier." },
    { name: "Joint and soft-tissue injections", note: "Injections for pain in joints, tendons and the spine, sometimes guided by ultrasound." },
    { name: "Orthoses and splints", note: "Braces and splints prescribed to support weak joints, prevent deformity or improve walking." },
    { name: "Prosthetic prescription and training", note: "Choosing, fitting and learning to use an artificial limb." },
    { name: "Bladder and bowel assessment", note: "Planning safe bladder and bowel routines after spinal cord or brain injury." },
  ],
  versus: [
    { key: "physiotherapy", text: "Physiotherapists deliver exercise and hands-on therapy and are at the heart of rehabilitation. A rehabilitation physician is a medical doctor who diagnoses, prescribes medicines, gives injections, orders equipment and coordinates the whole team." },
    { key: "neurology", text: "A neurologist diagnoses and treats the disease itself, such as stroke or multiple sclerosis. A rehabilitation physician focuses on getting back the function the disease has taken away." },
    { key: "orthopaedics", text: "An orthopaedic surgeon treats bone and joint problems and operates when needed. A rehabilitation physician treats musculoskeletal pain without surgery and plans recovery after an operation or amputation." },
  ],
  firstVisit: [
    "Bring discharge summaries, scan reports and operation notes from the illness or injury that led to the referral.",
    "Bring a family member or carer if possible, since they often know best how daily activities are going at home.",
    "Think about the goals that matter most to you, such as walking to the bathroom, climbing stairs, using a phone or returning to work.",
    "Bring any splints, braces, walking aids or artificial limb you already use, so their fit can be checked.",
    "Expect a detailed examination of movement, strength, sensation and daily function, and a plan that involves several therapists.",
  ],
  urgent: [
    "Sudden weakness of the face, arm or leg, or trouble speaking, which may be a new stroke: call 108",
    "Pounding headache, sweating above the level of injury and a sudden rise in blood pressure in someone with a high spinal cord injury",
    "A hot, swollen, painful calf or sudden breathlessness in someone with limited mobility, which can mean a blood clot",
    "Fever with a deep, discharging pressure sore",
  ],
  faqs: [
    {
      q: "What is a physiatrist?",
      a: "Another name for a rehabilitation physician: a medical doctor specialising in physical medicine and rehabilitation, who helps people recover function after illness, injury or surgery.",
    },
    {
      q: "Is a rehabilitation physician the same as a physiotherapist?",
      a: "No. A rehabilitation physician is a medical doctor who can diagnose, prescribe and give injections. A physiotherapist is a therapist who delivers exercise and hands-on treatment. They usually work together.",
    },
    {
      q: "When should rehabilitation start after a stroke or injury?",
      a: "Usually as soon as the person is medically stable, often while still in hospital. The team adjusts the intensity to what the person can manage.",
    },
    {
      q: "What qualifications does a rehabilitation physician have?",
      a: "An MBBS followed by a postgraduate degree in the speciality, usually MD Physical Medicine and Rehabilitation or DNB. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Can a rehabilitation physician help with long-standing back pain?",
      a: "Yes. Treating chronic musculoskeletal pain without surgery, through exercise plans, medicines and injections, is a regular part of the speciality.",
    },
  ],
};
