import type { SpecialtyContent } from "./types";

export const orthopaedics: SpecialtyContent = {
  key: "orthopaedics",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An orthopaedic surgeon looks after bones, joints, muscles, tendons, ligaments and the spine. In India the usual route is an MBBS followed by a postgraduate surgical degree in orthopaedics, most often MS Orthopaedics or DNB Orthopaedics. Many then add fellowship training in one area, such as joint replacement, spine, sports injury, hand surgery or children's orthopaedics.",
    "The title says surgeon, but a large part of the work happens without an operation. Fractures are often treated with a plaster or brace, back pain and arthritis with exercise, weight and activity changes, pain relief and physiotherapy, and some joint and tendon problems with an injection. Surgery is usually offered when these measures have been tried and have not helped, or when an injury clearly needs fixing.",
    "People reach an orthopaedic surgeon in two main ways: after an injury, often through a hospital emergency department, or with pain and stiffness that has built up over months. For long-standing joint or back problems, a good consultation explains what the scan shows, what the options are, and what happens if you wait. A second opinion before a planned joint replacement or spine operation is reasonable and common.",
  ],
  conditions: [
    { name: "Fractures and dislocations", note: "Broken bones and joints knocked out of place, treated with a cast, a brace or an operation to fix the bone." },
    { name: "Osteoarthritis", note: "Wear of the cartilage in the knee, hip and other joints, causing pain and stiffness that often builds up over years." },
    { name: "Ligament and cartilage injuries of the knee", note: "Injuries such as a torn ACL or meniscus, common in sport and after twisting falls." },
    { name: "Back and neck pain", note: "Most settles with time and exercise; pain spreading into an arm or leg, or with weakness, needs a closer look." },
    { name: "Slipped disc and sciatica", note: "A disc in the spine pressing on a nerve, causing pain down the leg. Most improve without surgery." },
    { name: "Shoulder problems", note: "Frozen shoulder, rotator cuff tears and recurrent dislocation, which limit movement and sleep." },
    { name: "Tendon and soft-tissue problems", note: "Tennis elbow, plantar fasciitis, trigger finger and similar conditions from overuse or strain." },
    { name: "Osteoporosis-related fractures", note: "Fractures of the hip, wrist or spine after a minor fall, especially in older adults; bone strength is assessed as well." },
    { name: "Bone and joint problems in children", note: "Conditions such as club foot and hip problems at birth, usually seen by a paediatric orthopaedic surgeon." },
  ],
  tests: [
    { name: "X-ray", note: "The first test for most bone and joint problems. Shows fractures, joint space and alignment." },
    { name: "MRI scan", note: "Shows soft tissues such as ligaments, cartilage, discs and nerves. Useful when an X-ray looks normal but symptoms continue." },
    { name: "CT scan", note: "Gives detailed pictures of complex fractures and bone shape, often used to plan surgery." },
    { name: "Bone density scan (DEXA)", note: "Measures bone strength to diagnose osteoporosis, particularly after a fracture from a minor fall." },
    { name: "Blood tests", note: "Checks for infection, inflammation, vitamin D and calcium, and fitness before an operation." },
    { name: "Joint injection or aspiration", note: "Draining fluid from a swollen joint to find the cause, or injecting a joint to ease pain." },
    { name: "Arthroscopy", note: "Keyhole surgery with a small camera, used to look inside and repair the knee, shoulder or other joints." },
    { name: "Joint replacement", note: "Replacing a badly damaged hip, knee or shoulder joint with an artificial one when other treatment has not helped." },
    { name: "Fracture fixation", note: "Plates, screws, rods or wires used to hold a broken bone in place while it heals." },
  ],
  versus: [
    { key: "rheumatology", text: "Joint pain from wear or injury is orthopaedic territory. Joint pain from inflammation, such as rheumatoid arthritis, gout or lupus, is treated by a rheumatologist with medicines; the orthopaedic surgeon comes in if a joint later needs replacing." },
    { key: "physiotherapy", text: "A physiotherapist delivers exercise and hands-on treatment and is central to recovery from most orthopaedic problems. The orthopaedic surgeon diagnoses, orders scans, prescribes and operates when needed." },
    { key: "neurosurgery", text: "Both specialities operate on the spine. Orthopaedic spine surgeons and neurosurgeons treat many of the same disc and spinal problems; neurosurgeons also operate on the brain and on tumours of the spinal cord." },
  ],
  firstVisit: [
    "Bring every X-ray, MRI and CT report, and the images themselves on film or disc if you have them, with dates.",
    "Be ready to describe how the problem started, whether there was an injury, and what makes the pain better or worse.",
    "Wear loose clothing so the joint or back can be examined easily, and comfortable shoes for a walking assessment.",
    "List your medicines and any other conditions such as diabetes, which can affect healing and surgery.",
    "Expect an examination of movement and strength; an X-ray is often done the same day if you do not already have one.",
  ],
  urgent: [
    "A limb that is clearly deformed, or a bone visible through the skin after an injury",
    "Being unable to bear weight or move a limb after a fall or accident, especially in an older adult",
    "Back pain with new weakness in the legs, numbness around the genitals or buttocks, or loss of bladder or bowel control",
    "A hot, very painful, swollen joint with fever, which can mean infection",
  ],
  faqs: [
    {
      q: "Does seeing an orthopaedic surgeon mean I will need an operation?",
      a: "No. Many orthopaedic problems are treated with rest, exercise, physiotherapy, bracing or an injection. Surgery is usually considered when these have not helped or when an injury clearly needs fixing.",
    },
    {
      q: "What qualifications should an orthopaedic surgeon have?",
      a: "An MBBS followed by a postgraduate degree in orthopaedics, usually MS Orthopaedics or DNB Orthopaedics. Many add fellowship training in joint replacement, spine, sports or paediatric orthopaedics. Registration can be checked on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Should I see an orthopaedic surgeon or a physiotherapist for back pain?",
      a: "Most back pain settles with time and exercise, and a physiotherapist can help. See a doctor if the pain spreads down a leg, comes with numbness or weakness, follows an injury, or does not improve after a few weeks.",
    },
    {
      q: "When is a knee or hip replacement usually considered?",
      a: "When arthritis causes pain that limits walking or sleep, and exercise, weight management, pain relief and physiotherapy have not given enough relief. The decision depends on symptoms and daily life, not the X-ray alone.",
    },
    {
      q: "Is an MRI always needed?",
      a: "No. An X-ray and examination are enough for many problems. An MRI is usually added when soft tissues such as ligaments, cartilage or discs are suspected, or when symptoms continue despite treatment.",
    },
  ],
};
