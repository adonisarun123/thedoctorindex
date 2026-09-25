import type { Block, Faq } from "@/lib/blog/types";
import { article, normalizeCouncil, withArticle, type RegisterEntry, type RegisterSource } from "@/lib/registers/types";

/**
 * Builders for the register entries. The state medical councils share one
 * checking procedure — the NMC Indian Medical Register is the single public
 * search that covers all of them — so that procedure is written once here and
 * parametrised, and each entry supplies only what is particular to that body:
 * where it sits, what its website is, what its own register search offers,
 * and anything else we saw on the record.
 *
 * Nothing here invents a fact. `office` and `website` are copied from the NMC's
 * own list of state medical councils; entries whose body we could not find on
 * that list, or whose site we did not open, simply omit the field.
 */

export const NMC_IMR_URL = "https://www.nmc.org.in/information-desk/indian-medical-register/";
export const NMC_COUNCIL_LIST_URL = "https://nmc.org.in/list-of-state-medical-councils/";
export const NMC_BLACKLIST_URL = "https://nmc.org.in/indian-medical-register/black-list-doctors";

export const NMC_LIST_SOURCE: RegisterSource = {
  label: "National Medical Commission — List of State Medical Councils",
  url: NMC_COUNCIL_LIST_URL,
};
export const NMC_IMR_SOURCE: RegisterSource = {
  label: "National Medical Commission — Indian Medical Register search",
  url: NMC_IMR_URL,
};

export interface StateCouncilInput {
  slug: string;
  name: string;
  short?: string;
  state: { name: string; slug: string };
  /** As listed by the NMC. */
  office?: string;
  website?: string;
  search?: { url: string; note: string };
  /** Additional spellings seen in the data (already normalised or not). */
  aliases?: string[];
  /** One or two paragraphs particular to this council. Required — no entry without something specific to say. */
  about: string[];
  /** Blocks appended after the shared procedure (renewal rules, historical notes). */
  extra?: Block[];
  extraFaqs?: Faq[];
  checkedOn: string;
  extraSources?: RegisterSource[];
  related?: string[];
}

function checkSteps(name: string, short: string, search?: { url: string; note: string }): Block {
  const items: Array<{ title: string; text: string }> = [
    {
      title: "Open the NMC's Indian Medical Register search",
      text: `The [Indian Medical Register](${NMC_IMR_URL}) is the National Medical Commission's public search across every state medical council. It offers five ways in: doctor name, year of registration, registration number, state medical council, and an "advance" search that combines them. Choose **State Medical Council** and pick "${name}" from the list, or use the registration number on its own.`,
    },
    {
      title: "Match the record, not just the number",
      text: `${article(short) === "an" ? "An" : "A"} ${short} number is unique inside the ${short} register, but the same digits exist in other state registers. Confirm that the name on the record is the doctor you are checking and that the year of registration is plausible for their age and qualification. If the number returns a different name, treat the number you were given as wrong until the practice explains it.`,
    },
    {
      title: "Check the list of doctors removed from the register",
      text: `The NMC also publishes a [Black List](${NMC_BLACKLIST_URL}) of doctors whose names have been removed or suspended. A number that searches cleanly on the register can still appear there, so check both.`,
    },
  ];
  if (search) {
    items.push({
      title: `Cross-check on the ${short}'s own register`,
      text: `${search.note} Use it as a second source: the council's own copy of its register is updated by the council itself, while the NMC copy is compiled from what councils send in and carries the note "This data is being updated".`,
    });
  } else {
    items.push({
      title: "If the record is missing, ask the council",
      text: `Registers are not perfectly synchronised. A recent registration, a transfer from another state or a name spelt differently on the certificate can all be missing from the NMC copy. Before concluding anything, ask the ${short} office directly with the number and the name as they appear on the certificate.`,
    });
  }
  return { k: "steps", items };
}

/** A state medical council: modern-medicine registrations, searchable on the NMC register. */
export function stateMedicalCouncil(input: StateCouncilInput): RegisterEntry {
  const short = input.short ?? input.name;
  const body: Block[] = [
    ...input.about.map((text): Block => ({ k: "p", text })),
    { k: "h2", text: `How to check ${withArticle(short)} registration number` },
    checkSteps(input.name, short, input.search),
    { k: "h2", text: `What ${withArticle(short)} number on this site looks like` },
    {
      k: "p",
      text: `The formats below are measured from the profiles on this site that cite the ${input.name}, not copied from a rulebook. Councils change their numbering over time — a five-digit number and a year-stamped alphanumeric one can both be genuine — so the point of the table is to show you what "normal" looks like for this council, and to make an odd-looking number stand out.`,
    },
    { k: "h2", text: `Practising outside ${input.state.name}` },
    {
      k: "p",
      text: `A doctor registered with the ${short} is on the Indian Medical Register, and a doctor on that register may practise anywhere in India. Many doctors who move states also take an additional registration with the new state's council, so it is normal to find a doctor practising in ${input.state.name} whose primary number was issued elsewhere, or a ${short}-registered doctor practising in another state. What matters for you is that at least one current registration exists and that the doctor's name is not on the removed list.`,
    },
    ...(input.extra ?? []),
  ];
  const faqs: Faq[] = [
    {
      q: `How do I verify ${withArticle(short)} registration number?`,
      a: `Search the number on the National Medical Commission's Indian Medical Register, selecting "${input.name}" as the state medical council, and confirm that the name and year on the record match the doctor. Then check the NMC's list of removed doctors.${input.search ? ` The council's own register search is a second source.` : ""}`,
    },
    {
      q: `Does ${withArticle(short)} registration mean the doctor is competent?`,
      a: `No. Registration means the council has accepted that the doctor holds a recognised medical qualification and has entered them on the register. It is a licence to practise, not a measure of skill or of outcomes. Qualifications beyond the primary degree, and experience, are separate facts and are checked separately on this site.`,
    },
    {
      q: `A doctor in ${input.state.name} has a number from another state's council. Is that a problem?`,
      a: `Not by itself. Registration with any state medical council places the doctor on the Indian Medical Register, which is valid across India. Check that number on the NMC register in the same way, under the council that issued it.`,
    },
    ...(input.extraFaqs ?? []),
  ];
  return {
    slug: input.slug,
    name: input.name,
    short: input.short,
    kind: "medical",
    profession: "doctors",
    state: input.state,
    office: input.office,
    website: input.website,
    search: input.search,
    onNmcRegister: true,
    match: [normalizeCouncil(input.name), ...(input.aliases ?? []).map(normalizeCouncil)],
    standfirst: `Checking ${withArticle(short)} registration on the NMC register, what its numbers look like, and who on this site cites it.`,
    body,
    faqs,
    checkedOn: input.checkedOn,
    sources: [NMC_LIST_SOURCE, NMC_IMR_SOURCE, ...(input.extraSources ?? [])],
    related: input.related,
  };
}
