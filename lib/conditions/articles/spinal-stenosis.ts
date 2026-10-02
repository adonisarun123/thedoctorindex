import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "spinal-stenosis",
  title: "Spinal stenosis: symptoms, tests, treatment and which doctor to see",
  metaTitle: "Spinal stenosis: symptoms, treatment and which doctor",
  standfirst: "What spinal stenosis is, why walking can bring on leg pain, how it is diagnosed, what helps without surgery, when surgery is considered, and warning signs.",
  targetQuery: "spinal stenosis symptoms and treatment",
  department: "orthopaedics",
  specialty: "orthopaedics",
  alsoSee: ["neurosurgery", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Leg pain on walking", "Back pain", "Numbness", "Leg weakness", "Clumsy hands"],
  tests: ["Neurological examination", "MRI", "CT scan", "X-ray"],
  treatments: ["Physiotherapy", "Pain relief", "Epidural steroid injection", "Decompression surgery"],
  body: [
    { k: "h2", text: "What spinal stenosis is" },
    {
      k: "p",
      text: "Spinal stenosis means narrowing of the spaces inside the spine through which the spinal cord and nerves pass. When the space becomes tight, the nerves can be squeezed, causing pain, numbness or weakness. It most often affects the lower back (lumbar stenosis), where it causes symptoms in the legs, and the neck (cervical stenosis), where it can affect the arms, hands and walking.",
    },
    {
      k: "p",
      text: "In most people it develops slowly with age as discs lose height, joints in the spine thicken with arthritis, and ligaments stiffen and bulge. Some people are born with a narrower spinal canal. Many people have narrowing on a scan without symptoms; treatment is guided by symptoms, not by the scan alone.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "h3", text: "Lumbar spinal stenosis" },
    {
      k: "ul",
      items: [
        "Leg pain on walking — aching, heaviness, cramping or tingling in the buttocks and legs that comes on with standing or walking and eases with sitting or bending forward",
        "Being able to walk shorter distances over time, and leaning on a shopping trolley or stick helps",
        "Back pain, often milder than the leg symptoms",
        "Numbness or pins and needles in the legs or feet",
        "Leg weakness or a foot that slaps or catches when walking",
      ],
    },
    {
      k: "p",
      text: "Many people find walking uphill or cycling easier than walking downhill, because bending forward opens the spinal canal.",
    },
    { k: "h3", text: "Cervical spinal stenosis" },
    {
      k: "ul",
      items: [
        "Neck pain and stiffness, sometimes with arm pain",
        "Clumsy hands — dropping things, difficulty with buttons or writing",
        "Unsteady walking or poor balance",
        "Numbness in the hands or arms",
      ],
    },
    {
      k: "p",
      text: "Cervical stenosis that presses on the spinal cord (myelopathy) can slowly worsen and needs specialist assessment.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "ul",
      items: [
        "Age — it is most common over fifty",
        "Osteoarthritis of the spine, with bone spurs",
        "Bulging or herniated discs",
        "Thickened ligaments in the spine",
        "A vertebra slipping forward on the one below (spondylolisthesis)",
        "Previous spinal injury or surgery",
        "A naturally narrow spinal canal",
      ],
    },
    {
      k: "p",
      text: "Poor circulation in the legs can cause similar pain on walking. In that case, pain eases with standing still rather than sitting or bending, and foot pulses may be weak. Diabetes-related nerve damage can also cause numbness. Tell your doctor about smoking, diabetes and heart disease so these can be considered.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask about your symptoms and how far you can walk, and do a **neurological examination** of strength, sensation, reflexes and walking. They may check the pulses in your feet to rule out a circulation problem.",
    },
    {
      k: "p",
      text: "An **MRI** is the main test: it shows the spinal canal, nerves, discs and ligaments. A **CT scan** may be used if MRI is not possible. An **X-ray**, sometimes taken while bending forwards and backwards, shows alignment, slipping of vertebrae and arthritis. Nerve conduction studies may help when the cause of numbness is unclear.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A general physician can start the assessment. An [orthopaedic surgeon](/specialties/orthopaedics) who focuses on the spine, or a [neurosurgeon](/specialties/neurosurgery), is the right specialist when symptoms are limiting walking, getting worse, or affect the hands or balance. Both offer non-surgical treatment as well as surgery.",
    },
    {
      k: "p",
      text: "[Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, help with exercise and walking. You can [find orthopaedic surgeons in Bengaluru](/doctors/karnataka/bengaluru/orthopaedic-surgeons), [neurosurgeons](/doctors/karnataka/bengaluru/neurosurgeons) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Lumbar stenosis often stays stable for years, and many people manage well without surgery. Cervical stenosis with spinal cord pressure is more likely to need surgery.",
    },
    { k: "h3", text: "Physiotherapy and activity" },
    {
      k: "p",
      text: "**Physiotherapy** focuses on core and leg strength, flexibility, posture and walking tolerance. Exercises that bend the spine forward, cycling on a stationary bike and water exercise are often easier than walking. Walking in short spells with rests can gradually build distance. Keeping a healthy weight reduces load on the spine.",
    },
    { k: "h3", text: "Pain relief" },
    {
      k: "p",
      text: "**Pain relief** may include paracetamol, anti-inflammatory medicines for short periods, or medicines for nerve pain prescribed by a doctor. Older people are more prone to side effects, so do not take anti-inflammatory tablets regularly without medical advice.",
    },
    { k: "h3", text: "Injections" },
    {
      k: "p",
      text: "An **epidural steroid injection** may relieve leg pain for a time in some people, though the benefit is often modest and temporary. Your doctor will decide based on your symptoms.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "**Decompression surgery**, such as laminectomy, removes bone or ligament to make more space for the nerves. If the spine is unstable, fusion may be added. Surgery tends to help leg pain and walking more than back pain. It is considered when symptoms seriously limit daily life despite non-surgical care, when weakness is getting worse, or when there is spinal cord pressure in the neck.",
    },

    { k: "h2", text: "Living with spinal stenosis" },
    {
      k: "p",
      text: "Keep active within your limits. Use a walking stick or a trolley if leaning forward helps. Plan rests during walks, and sit to do tasks that need standing for long. Reduce fall risks at home, especially if your legs feel weak or numb. Return to your doctor if your walking distance shrinks, your hands become clumsy, or you notice new weakness.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Numbness around the genitals, inner thighs or back passage",
        "New difficulty passing urine, or loss of bladder or bowel control",
        "Rapidly worsening weakness in the legs or arms",
        "Sudden severe neck or back pain after a fall or injury",
        "Fever with back pain, or back pain with a history of cancer",
      ],
    },
    {
      k: "p",
      text: "The first two can be signs of cauda equina syndrome, which needs urgent scanning and often surgery.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Where is the narrowing, and is it pressing on the spinal cord or nerves?",
        "Could poor circulation or diabetes be adding to my symptoms?",
        "Which exercises are safe and helpful for me?",
        "Would an injection help, and for how long?",
        "What are the likely benefits and risks of surgery for me?",
        "Which symptoms mean I should come back urgently?",
      ],
    },
  ],
  faqs: [
    {
      q: "Does spinal stenosis always get worse?",
      a: "Not always. Many people with lumbar stenosis stay stable or improve with exercise and physiotherapy for years. Some worsen slowly. Cervical stenosis pressing on the spinal cord is more likely to progress and is watched closely.",
    },
    {
      q: "Why does my leg pain ease when I sit or bend forward?",
      a: "Bending forward slightly opens up the spinal canal and takes pressure off the nerves. Standing upright and walking narrow it. That is why many people with lumbar stenosis can walk further when leaning on a trolley or cycling.",
    },
    {
      q: "Am I too old for spinal surgery?",
      a: "Age alone does not rule out surgery. Your overall health, how much symptoms limit your life and the expected benefit matter more. Your surgeon will discuss the risks and likely results based on your health and your scans.",
    },
    {
      q: "Is spinal stenosis the same as a slipped disc?",
      a: "No, although a bulging disc can contribute to stenosis. A slipped disc usually affects younger people and comes on more suddenly. Stenosis develops gradually with age from a combination of disc, joint and ligament changes.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Spinal Stenosis", url: "https://medlineplus.gov/spinalstenosis.html" },
    { label: "American Academy of Orthopaedic Surgeons OrthoInfo — Lumbar spinal stenosis", url: "https://www.orthoinfo.org/diseases--conditions/lumbar-spinal-stenosis" },
  ],
};
