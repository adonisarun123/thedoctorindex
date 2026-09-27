import type { SpecialtyContent } from "./types";

export const rheumatology: SpecialtyContent = {
  key: "rheumatology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A rheumatologist is a physician who treats inflammatory and autoimmune disease of the joints, muscles, bones and connective tissue. In autoimmune conditions the immune system attacks the body's own tissues, and the effects can reach the skin, kidneys, lungs, eyes and blood vessels as well as the joints. In India the usual route is an MBBS, a postgraduate degree in general medicine (or paediatrics for children's rheumatology), and then a super-speciality degree such as DM Rheumatology or DrNB Rheumatology.",
    "Rheumatologists do not operate. They diagnose, often by piecing together symptoms, examination and blood tests, and treat with medicines that calm inflammation and protect joints from lasting damage. Many of these medicines need regular blood tests to check they are safe, so rheumatology is usually a long-term relationship with steady follow-up rather than a single visit.",
    "Early diagnosis matters in inflammatory arthritis, because damage to the joints can build up in the first months to years. People often reach a rheumatologist after a general physician or orthopaedic surgeon notices swelling in several joints, long morning stiffness, or a positive blood test. There are fewer rheumatologists in India than many other specialists, so if you are referred, keep the appointment even if the symptoms ease for a while.",
  ],
  conditions: [
    { name: "Rheumatoid arthritis", note: "Inflammation of many joints, often the small joints of the hands and feet, with morning stiffness." },
    { name: "Ankylosing spondylitis and axial spondyloarthritis", note: "Inflammation of the spine and pelvis, typically back pain in younger adults that is worse after rest and better with movement." },
    { name: "Psoriatic arthritis", note: "Joint inflammation linked with the skin condition psoriasis." },
    { name: "Gout", note: "Sudden, very painful swelling of a joint caused by uric acid crystals, often starting at the big toe." },
    { name: "Systemic lupus erythematosus (lupus)", note: "An autoimmune disease that can affect the joints, skin, kidneys, blood and other organs." },
    { name: "Sjögren's syndrome and scleroderma", note: "Connective tissue diseases causing dry eyes and mouth, or thickening of the skin and internal organs." },
    { name: "Vasculitis", note: "Inflammation of blood vessels, which can affect many organs and sometimes needs urgent treatment." },
    { name: "Myositis", note: "Inflammation of the muscles, causing weakness, especially of the shoulders and thighs." },
    { name: "Osteoporosis", note: "Thin, fragile bones that break easily, assessed and treated to lower the risk of further fractures." },
  ],
  tests: [
    { name: "Inflammatory markers (ESR and CRP)", note: "Blood tests showing whether there is active inflammation in the body." },
    { name: "Rheumatoid factor and anti-CCP", note: "Antibody tests that support a diagnosis of rheumatoid arthritis. A positive result alone does not make the diagnosis." },
    { name: "ANA and related antibody tests", note: "Screening for autoimmune disease such as lupus. Many healthy people have a low positive ANA, so it is read alongside symptoms." },
    { name: "Uric acid", note: "Measured in gout, though levels can be normal during an attack." },
    { name: "Joint fluid aspiration", note: "Fluid drawn from a swollen joint with a needle and examined for crystals or infection." },
    { name: "X-ray and ultrasound of joints", note: "Show joint damage, and on ultrasound, active inflammation that may not be obvious on examination." },
    { name: "MRI of the spine or pelvis", note: "Used to look for early inflammation in suspected spondyloarthritis." },
    { name: "Bone density scan (DEXA)", note: "Measures bone strength in osteoporosis." },
    { name: "Monitoring blood and urine tests", note: "Regular checks of blood counts, liver and kidney function while on long-term treatment." },
  ],
  versus: [
    { key: "orthopaedics", text: "A rheumatologist treats joint disease caused by inflammation or the immune system, with medicines. An orthopaedic surgeon treats injuries and wear-and-tear problems, and operates, for example to replace a joint already damaged by arthritis." },
    { key: "internal-medicine", text: "A general physician is a good first stop for joint pain and fever and can start tests. A rheumatologist takes over when an autoimmune or inflammatory condition is likely or confirmed." },
  ],
  firstVisit: [
    "Bring all blood test reports, especially antibody and inflammatory marker results, with dates, and any joint X-rays or scans.",
    "Make a list of the joints affected, how long morning stiffness lasts, and whether there have been rashes, mouth ulcers, dry eyes, fever or hair loss.",
    "Bring a list of every medicine you take or have tried, including painkillers, steroids and any traditional remedies.",
    "Photos of swollen joints or rashes taken when they were at their worst can help if they have settled by the day of the visit.",
    "Expect a full joint examination and several blood tests. A firm diagnosis may take more than one visit.",
  ],
  urgent: [
    "A single hot, swollen, very painful joint with fever, which can mean infection in the joint",
    "Sudden loss of vision, or a new severe headache with scalp tenderness in an older adult",
    "Severe breathlessness, chest pain, or coughing up blood in someone with a known autoimmune disease",
    "Rapidly increasing weakness, difficulty swallowing, or very little urine in someone with lupus, vasculitis or myositis",
  ],
  faqs: [
    {
      q: "What does a rheumatologist treat?",
      a: "Inflammatory and autoimmune conditions of the joints, muscles, bones and connective tissue, including rheumatoid arthritis, ankylosing spondylitis, gout, lupus, vasculitis and osteoporosis.",
    },
    {
      q: "My ANA test is positive. Does that mean I have lupus?",
      a: "Not necessarily. A low positive ANA is found in many healthy people. A rheumatologist interprets it alongside your symptoms, examination and other tests before making any diagnosis.",
    },
    {
      q: "What qualifications should a rheumatologist have?",
      a: "An MBBS, a postgraduate degree usually in general medicine, and then a super-speciality degree such as DM Rheumatology or DrNB Rheumatology. Some clinical immunologists also treat these conditions. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Why do I need so many blood tests during treatment?",
      a: "Several medicines used in rheumatology can affect the blood count, liver or kidneys. Regular tests let the rheumatologist catch problems early and adjust treatment safely.",
    },
    {
      q: "Is arthritis just part of getting older?",
      a: "Wear-related osteoarthritis becomes more common with age, but inflammatory arthritis can start at any age, including in young adults and children. Joint swelling with long morning stiffness should be checked rather than put down to age.",
    },
  ],
};
