import type { SpecialtyContent } from "./types";

export const neurosurgery: SpecialtyContent = {
  key: "neurosurgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A neurosurgeon operates on the brain, spinal cord, spine and peripheral nerves. In India the usual route is an MBBS, a postgraduate degree in general surgery, and then a super-speciality degree such as MCh Neurosurgery or DrNB Neurosurgery; some institutions offer a longer integrated MCh course straight after MBBS. It is one of the longest surgical trainings.",
    "Neurosurgeons treat brain and spinal tumours, bleeding in and around the brain, head and spinal injuries, disc and spinal problems pressing on nerves, hydrocephalus, and some cases of epilepsy, pain and movement disorder that have not responded to medicines. Some concentrate on the spine, on children, on blood vessels of the brain, or on functional surgery for conditions such as Parkinson's disease.",
    "Most people meet a neurosurgeon on referral, from a neurologist, orthopaedic surgeon or physician, or after a scan has shown something that may need surgery. Head and spine injuries are the main exception and arrive through the emergency department. A neurosurgical consultation often ends with the advice that an operation is not needed yet, or at all, and that is a useful answer. For planned surgery, asking about the aims, the risks and the alternative of waiting is reasonable, and a second opinion is common.",
  ],
  conditions: [
    { name: "Brain tumours", note: "Growths in or around the brain, both cancerous and non-cancerous, which may be removed, sampled or monitored." },
    { name: "Spinal tumours", note: "Growths affecting the spinal cord, nerves or bones of the spine." },
    { name: "Head injury", note: "Bleeding or swelling inside the skull after an accident or fall, sometimes needing urgent surgery." },
    { name: "Bleeding in the brain", note: "Haemorrhage from a burst blood vessel, including aneurysms and abnormal vessel tangles (AVMs)." },
    { name: "Slipped disc and sciatica", note: "A disc pressing on a nerve root in the neck or lower back. Most settle without surgery." },
    { name: "Spinal stenosis and cervical myelopathy", note: "Narrowing of the spinal canal that squeezes the nerves or spinal cord, causing leg pain, clumsiness or weakness." },
    { name: "Hydrocephalus", note: "Build-up of fluid in the brain, often treated with a shunt or an endoscopic procedure." },
    { name: "Trigeminal neuralgia and nerve compression", note: "Severe facial pain, or trapped nerves such as in carpal tunnel syndrome." },
    { name: "Epilepsy and movement disorders not controlled by medicines", note: "Selected patients may be assessed for surgery or deep brain stimulation." },
  ],
  tests: [
    { name: "CT scan", note: "Fast imaging used after head injury and to look for bleeding in the brain." },
    { name: "MRI of the brain or spine", note: "Detailed pictures of tumours, discs, nerves and the spinal cord; the main planning scan for most operations." },
    { name: "Angiography of brain vessels", note: "CT, MR or catheter imaging of the blood vessels to find aneurysms and malformations." },
    { name: "Nerve conduction studies and EMG", note: "Show which nerves are affected and how badly, for example in a trapped nerve." },
    { name: "Biopsy", note: "A small sample of a tumour taken to find out exactly what it is before treatment is planned." },
    { name: "Craniotomy", note: "An operation in which part of the skull is opened to reach the brain, then replaced." },
    { name: "Spine surgery", note: "Removing a disc or bone pressing on nerves, and sometimes fixing vertebrae together with screws and rods." },
    { name: "Shunt surgery", note: "A thin tube placed to drain excess fluid from the brain into the abdomen." },
  ],
  versus: [
    { key: "neurology", text: "Neurologists diagnose and treat brain and nerve disorders with medicines and other non-surgical care. Neurosurgeons operate. A neurologist is usually the right first stop for headaches, seizures, numbness or weakness, and will refer when surgery might help." },
    { key: "orthopaedics", text: "Spinal problems such as slipped discs and stenosis are treated by both neurosurgeons and orthopaedic spine surgeons. Either can be appropriate; experience with the particular operation matters more than the title." },
  ],
  firstVisit: [
    "Bring the scan images themselves on disc or through an online link, not only the written reports; the surgeon will want to look at them directly.",
    "Bring notes from the neurologist or other doctor who referred you, and a list of your current medicines, especially blood thinners.",
    "Be ready to describe how the symptoms have changed over time, including any new weakness, numbness, balance or bladder problems.",
    "Write down your questions beforehand: what the operation aims to do, the main risks, the recovery time, and what happens if you wait.",
    "Expect a neurological examination. Further scans may be needed before any decision on surgery.",
  ],
  urgent: [
    "After a head injury: drowsiness, confusion, repeated vomiting, a seizure, or clear fluid from the nose or ears. Call 108",
    "Sudden, very severe headache, the worst ever, especially with vomiting or a stiff neck",
    "Sudden weakness of the face, arm or leg, or trouble speaking, which may be a stroke",
    "Back pain with new leg weakness, numbness around the genitals or buttocks, or loss of bladder or bowel control",
  ],
  faqs: [
    {
      q: "Does seeing a neurosurgeon mean I need brain or spine surgery?",
      a: "No. Many consultations end with advice to continue non-surgical treatment or to repeat a scan later. The neurosurgeon's job is to judge whether surgery would help, not only to operate.",
    },
    {
      q: "What is the difference between a neurosurgeon and a neurologist?",
      a: "A neurosurgeon operates on the brain, spine and nerves. A neurologist diagnoses and treats nervous system conditions without surgery. They often work together on the same patient.",
    },
    {
      q: "Should I see a neurosurgeon or an orthopaedic surgeon for a slipped disc?",
      a: "Both specialities treat disc problems, and most discs settle without an operation. If surgery is being considered, choose a surgeon who regularly performs spine surgery and can explain the options clearly.",
    },
    {
      q: "What qualifications should a neurosurgeon have?",
      a: "An MBBS followed by a super-speciality degree in neurosurgery, usually MCh Neurosurgery or DrNB Neurosurgery, either after MS General Surgery or through an integrated course. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Is a second opinion before brain or spine surgery a good idea?",
      a: "For planned, non-emergency surgery, yes. It is common and reasonable, and a good surgeon will not be offended. Bring the scan images so the second surgeon can review them directly.",
    },
  ],
};
