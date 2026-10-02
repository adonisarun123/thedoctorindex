import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "scoliosis",
  title: "Scoliosis: signs in children and adults, tests, bracing and surgery",
  metaTitle: "Scoliosis: signs, tests, bracing and which doctor to see",
  standfirst: "What scoliosis is, how to spot a curve in a growing child, how it is measured, when bracing or surgery is needed, and what life with scoliosis looks like.",
  targetQuery: "scoliosis symptoms and treatment",
  department: "orthopaedics",
  specialty: "orthopaedics",
  alsoSee: ["paediatrics", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Uneven shoulders", "Uneven waist", "Rib hump", "Leaning to one side", "Back pain"],
  tests: ["Forward bend test", "X-ray", "MRI"],
  treatments: ["Observation", "Bracing", "Physiotherapy", "Spinal fusion"],
  body: [
    { k: "h2", text: "What scoliosis is" },
    {
      k: "p",
      text: "Scoliosis is a sideways curve of the spine. Seen from behind, a healthy spine runs straight down the middle of the back. In scoliosis it bends into a C or S shape, and the bones of the spine also twist slightly, which can make one side of the rib cage or back stand out more than the other.",
    },
    {
      k: "p",
      text: "The most common type is *adolescent idiopathic scoliosis*, which appears in children around the start of puberty and has no known cause. Others include *congenital* scoliosis, from spinal bones that formed differently before birth; *neuromuscular* scoliosis, linked to conditions such as cerebral palsy or muscular dystrophy; and *degenerative* scoliosis, which develops in adults as discs and joints wear.",
    },
    {
      k: "p",
      text: "Most curves are mild and need only monitoring. Scoliosis is not caused by carrying a heavy school bag, poor posture or sleeping position.",
    },

    { k: "h2", text: "Signs and symptoms" },
    {
      k: "p",
      text: "Scoliosis in children is usually painless, so it is often first noticed by a parent, a tailor or a teacher. Look for:",
    },
    {
      k: "ul",
      items: [
        "Uneven shoulders, or one shoulder blade sticking out more",
        "An uneven waist, or one hip higher than the other",
        "A rib hump on one side of the back when the child bends forward",
        "Leaning to one side, or the head not centred over the pelvis",
        "Clothes that hang unevenly, such as a kurta or skirt hem that dips on one side",
      ],
    },
    {
      k: "p",
      text: "Back pain is not typical of adolescent scoliosis; significant pain, night pain or neurological symptoms should prompt a search for another cause. In adults with degenerative scoliosis, back pain and leg pain from nerve pressure are common.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "ul",
      items: [
        "Girls are more likely than boys to have curves that progress",
        "A parent, brother or sister with scoliosis",
        "A growth spurt — curves are most likely to worsen while a child is growing fast",
        "Neuromuscular conditions, spinal cord abnormalities and some genetic conditions",
        "Ageing and arthritis of the spine in adults",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will look at the back with the child standing and do the **forward bend test**: the child bends forward with arms hanging, and the doctor looks for a rib hump. A simple device called a scoliometer may be used to measure the twist. The doctor also checks leg length, nerves and reflexes.",
    },
    {
      k: "p",
      text: "A standing **X-ray** of the whole spine confirms scoliosis and measures the size of the curve, called the Cobb angle. The X-ray also helps judge how much growing the child still has to do. Repeat X-rays track whether the curve is changing. An **MRI** is done if there are unusual features, such as pain, an unusual curve pattern, very early onset or abnormal neurological signs, to look for a problem in the spinal cord.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "An [orthopaedic surgeon](/specialties/orthopaedics), ideally a spine or paediatric orthopaedic specialist, diagnoses and manages scoliosis. A [paediatrician](/specialties/paediatrics) often notices a curve first and can refer a child. [Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, help with exercises, posture and recovery after surgery.",
    },
    {
      k: "p",
      text: "You can [find orthopaedic surgeons in Bengaluru](/doctors/karnataka/bengaluru/orthopaedic-surgeons), [paediatricians](/doctors/karnataka/bengaluru/paediatricians) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the size of the curve, the type, the child's age and how much growth remains. Your doctor will decide based on these factors and how the curve behaves over time.",
    },
    { k: "h3", text: "Observation" },
    {
      k: "p",
      text: "**Observation** with regular check-ups and X-rays is the usual approach for mild curves. Many never progress. Checks are more frequent during growth spurts.",
    },
    { k: "h3", text: "Bracing" },
    {
      k: "p",
      text: "**Bracing** is used for moderate curves in children who are still growing. A brace does not straighten the spine, but it can stop the curve from getting worse. It works best when worn for the number of hours the doctor prescribes each day, usually until growth finishes. Braces are made to measure and can be worn under clothes.",
    },
    { k: "h3", text: "Physiotherapy" },
    {
      k: "p",
      text: "**Physiotherapy** and specific scoliosis exercises may help posture, core strength and comfort, and are often used alongside bracing. Exercises alone have not been shown to reliably correct a significant curve, so they should not replace bracing or surgery when those are advised.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "Surgery is considered for large curves or curves that keep progressing. **Spinal fusion** uses rods and screws to straighten the spine and joins the affected vertebrae so they grow together as one bone. In very young children, growing rods may be used to control the curve while allowing growth. Adults with degenerative scoliosis may need surgery to relieve nerve pressure. Most people return to normal activities after recovery.",
    },
    {
      k: "p",
      text: "Be wary of anyone who promises to straighten a curve with massage, oils or manipulation alone.",
    },

    { k: "h2", text: "Living with scoliosis" },
    {
      k: "p",
      text: "Most children and adults with scoliosis lead normal, active lives, including sports, work, marriage and pregnancy. Keep regular check-ups during growth. If your child wears a brace, encourage them to keep up activities and talk about how they feel; wearing a brace can be hard for teenagers. Adults with scoliosis benefit from staying active and keeping core muscles strong.",
    },

    { k: "h2", text: "When it is urgent" },
    {
      k: "p",
      text: "Scoliosis is rarely an emergency. Call 112 or 108, or go to an emergency department, for sudden weakness or numbness in the legs, loss of bladder or bowel control, or severe breathlessness. See a doctor promptly if a curve seems to be changing quickly, if a child has significant back pain or night pain, or after spinal surgery if there is fever, wound redness or discharge.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of scoliosis is this, and how large is the curve?",
        "How likely is it to get worse, and how often should it be checked?",
        "Is bracing needed, and for how many hours a day?",
        "Which exercises or activities are safe or helpful?",
        "At what point would surgery be considered?",
        "Should other family members be checked?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can carrying a heavy school bag cause scoliosis?",
      a: "No. Heavy bags can cause back ache and poor posture, but they do not cause scoliosis. The most common type has no known cause and tends to run in families. Poor posture or sleeping position does not cause it either.",
    },
    {
      q: "Can exercises or yoga cure scoliosis?",
      a: "Exercises can improve posture, strength and comfort, but they have not been shown to reliably straighten a significant curve. For moderate curves in growing children, a brace is the main way to stop progression. Discuss any exercise plan with your doctor.",
    },
    {
      q: "Will my child need surgery?",
      a: "Most children with scoliosis do not. Mild curves are watched, and moderate curves in growing children are often braced. Surgery is considered for large curves or curves that continue to worsen despite bracing. Your orthopaedic surgeon will explain the options.",
    },
    {
      q: "Can a woman with scoliosis have a normal pregnancy?",
      a: "Yes. Most women with scoliosis, including those who have had spinal fusion, have normal pregnancies and deliveries. Tell your obstetrician and anaesthetist about your scoliosis and any surgery, as it can affect spinal anaesthesia planning.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Scoliosis", url: "https://medlineplus.gov/scoliosis.html" },
    { label: "National Institute of Arthritis and Musculoskeletal and Skin Diseases — Scoliosis", url: "https://www.niams.nih.gov/health-topics/scoliosis" },
  ],
};
