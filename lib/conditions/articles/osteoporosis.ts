import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "osteoporosis",
  title: "Osteoporosis: risk, bone density test, treatment and fall prevention",
  metaTitle: "Osteoporosis: bone density test, treatment and prevention",
  standfirst: "What osteoporosis is, who is at risk, how a DEXA scan measures bone strength, how medicines and exercise prevent fractures, and which doctor to see.",
  targetQuery: "osteoporosis symptoms test and treatment",
  department: "orthopaedics",
  specialty: "orthopaedics",
  alsoSee: ["endocrinology", "gynaecology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fracture after a minor fall", "Loss of height", "Stooped posture", "Sudden back pain"],
  tests: ["DEXA scan", "FRAX", "Vitamin D", "Blood tests"],
  treatments: ["Calcium and vitamin D", "Bisphosphonates", "Denosumab", "Teriparatide", "Exercise", "Fall prevention"],
  body: [
    { k: "h2", text: "What osteoporosis is" },
    {
      k: "p",
      text: "Osteoporosis is a condition in which bones lose density and quality, becoming thinner, weaker and more likely to break. Bone is living tissue that is constantly broken down and rebuilt. After about the age of thirty, the balance slowly tips towards loss, and in osteoporosis the loss goes far enough to make bones fragile.",
    },
    {
      k: "p",
      text: "It is often called a silent disease because there are no symptoms until a bone breaks. The most common fractures are in the spine, hip and wrist. A hip fracture in an older person is serious: it usually needs surgery and can affect independence for a long time.",
    },
    {
      k: "p",
      text: "Osteopenia is a milder loss of bone density. It does not always need medicine, but it is a reason to look at risk factors and to protect bone health.",
    },

    { k: "h2", text: "Signs and symptoms" },
    { k: "p", text: "Osteoporosis usually has no warning signs. It may first show itself as:" },
    {
      k: "ul",
      items: [
        "A fracture after a minor fall from standing height or less, or even after a cough, a bump or lifting something",
        "Loss of height over the years",
        "A stooped posture or curved upper back",
        "Sudden back pain, which can be caused by a collapsed vertebra (a spinal compression fracture)",
      ],
    },
    {
      k: "p",
      text: "Many spinal fractures cause little pain and are found only on an X-ray. Any fracture from a minor fall in an adult over fifty should prompt a check for osteoporosis.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "Risk is higher if you:" },
    {
      k: "ul",
      items: [
        "Are a woman, particularly after menopause, when oestrogen levels fall; early menopause raises risk further",
        "Are older — men are affected too, usually later in life",
        "Have a parent who broke a hip",
        "Have a low body weight or a small frame",
        "Have taken steroid tablets for a long time",
        "Have conditions such as rheumatoid arthritis, an overactive thyroid or parathyroid, coeliac disease, chronic kidney or liver disease, or low testosterone",
        "Get too little calcium, vitamin D, sunlight or physical activity",
        "Smoke or drink heavily",
      ],
    },
    {
      k: "p",
      text: "Some other medicines, including certain anti-seizure medicines, breast and prostate cancer hormone treatments, and long-term high doses of acid-reducing tablets, can also affect bone. Bring a list of your medicines to the appointment.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The standard test is a **DEXA scan** (dual-energy X-ray absorptiometry). It is a quick, painless low-dose X-ray that measures bone density at the hip and spine. The result is compared with that of healthy young adults, and the doctor will explain whether it falls in the normal, osteopenia or osteoporosis range.",
    },
    {
      k: "p",
      text: "Doctors also estimate your chance of a fracture over the coming years using a tool such as **FRAX**, which combines bone density with risk factors such as age, previous fractures and steroid use. Heel ultrasound screening at health camps can suggest low bone density but does not replace a DEXA scan.",
    },
    {
      k: "p",
      text: "**Blood tests** look for causes and check that treatment is safe: calcium, kidney function, thyroid, and **vitamin D**, which is often low. A spine X-ray may be done to look for hidden fractures.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "An [orthopaedic surgeon](/specialties/orthopaedics) treats fractures and often manages osteoporosis afterwards. An [endocrinologist](/specialties/endocrinology) is the right choice when hormonal causes are suspected or osteoporosis is severe or unusual. A [gynaecologist](/specialties/gynaecology) can assess bone health around menopause. A general physician can arrange the first tests.",
    },
    {
      k: "p",
      text: "You can [find orthopaedic surgeons in Bengaluru](/doctors/karnataka/bengaluru/orthopaedic-surgeons), [endocrinologists](/doctors/karnataka/bengaluru/endocrinologists) and [gynaecologists](/doctors/karnataka/bengaluru/gynaecologists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment aims to prevent fractures. Whether you need medicine depends on your overall fracture risk, not on bone density alone. Your doctor will decide based on your scan, risk factors and any previous fractures.",
    },
    { k: "h3", text: "Calcium, vitamin D and lifestyle" },
    {
      k: "p",
      text: "Get enough **calcium and vitamin D** from diet — milk, curd, paneer, ragi, sesame, green leafy vegetables and pulses — and from supplements if your doctor advises. Sensible sun exposure helps vitamin D. **Exercise**, especially weight-bearing activity such as walking and climbing stairs, plus muscle-strengthening and balance work, keeps bones and muscles strong. Stop smoking and limit alcohol.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Bisphosphonates**, such as alendronate, risedronate and zoledronic acid, slow bone loss and are the most commonly used medicines. Tablets must be taken exactly as instructed: on an empty stomach with plain water, staying upright afterwards. **Denosumab**, an injection given at regular intervals, is another option. For very high risk, **teriparatide** and other bone-building medicines stimulate new bone. Hormone therapy may be suitable for some women around menopause.",
    },
    {
      k: "note",
      text: "Do not stop osteoporosis medicine without speaking to your doctor. In particular, missing or stopping denosumab injections without a plan can cause rapid bone loss and spinal fractures. Before major dental work, tell your dentist you take these medicines, as a rare jaw problem can occur.",
    },
    { k: "h3", text: "Fall prevention" },
    {
      k: "p",
      text: "**Fall prevention** is as important as medicine. Good lighting, non-slip mats in the bathroom, grab bars near the toilet, removing loose rugs and wires, suitable footwear, eye checks, and reviewing medicines that cause dizziness or drowsiness all reduce falls.",
    },

    { k: "h2", text: "Living with osteoporosis" },
    {
      k: "p",
      text: "Most people with osteoporosis live active lives. Keep exercising, but avoid sudden heavy lifting or deep forward bending if you have had spinal fractures. A physiotherapist can teach safe movements. Repeat DEXA scans and treatment reviews are usually done every few years. Some people are offered a planned break from bisphosphonates after several years; this is a decision for your doctor.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "A fall followed by severe hip or groin pain, being unable to stand or bear weight, or a leg that looks shorter or turned outwards",
        "Sudden severe back pain with numbness, weakness, or loss of bladder or bowel control",
        "A fall with a head injury, especially if you take blood thinners",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What is my fracture risk over the coming years?",
        "Do I need a DEXA scan, and when should it be repeated?",
        "Is there an underlying cause of my bone loss?",
        "Do I need medicine, and how long will I take it?",
        "How should I take my tablets, and what side effects should I watch for?",
        "What can I do at home to prevent falls?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can osteoporosis be reversed?",
      a: "Medicines can stop bone loss and some can rebuild bone, which lowers fracture risk substantially. Bone density may improve on treatment, although it rarely returns fully to normal. Exercise, calcium, vitamin D and fall prevention all add to the effect of medicine.",
    },
    {
      q: "Is calcium alone enough to treat osteoporosis?",
      a: "No. Calcium and vitamin D support bone health and help medicines work, but on their own they do not treat established osteoporosis. People at high fracture risk usually need a medicine such as a bisphosphonate in addition.",
    },
    {
      q: "Do men get osteoporosis?",
      a: "Yes. Men lose bone too, usually later in life than women. Long-term steroid use, low testosterone, heavy drinking, smoking and some medical conditions raise the risk. A man who breaks a bone after a minor fall should be checked.",
    },
    {
      q: "Is a heel scan at a health camp enough?",
      a: "A heel ultrasound can flag people who may have low bone density, but it is not used to diagnose osteoporosis or to decide treatment. A DEXA scan of the hip and spine is the standard test.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Osteoporosis", url: "https://medlineplus.gov/osteoporosis.html" },
    { label: "International Osteoporosis Foundation — About osteoporosis", url: "https://www.osteoporosis.foundation/patients/about-osteoporosis" },
  ],
};
