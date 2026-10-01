THE DOCTOR INDEX — 2,500 ARTICLE DRAFTS
Compiled: 2026-10-01

Open index.html after extracting this ZIP. It works locally without an internet connection; source links require internet access.

CONTENTS
2,500 complete HTML drafts; 25 JSON import batches of 100 records; searchable index; CSV and JSON manifests; validation report.
Every article body is at least 750 words. Total: 2,759,319 body words.
Titles, section headings, notices, references, attributions and editorial notes are excluded from the body count.

WHAT THESE FILES ARE
Automated, attributed source compilations with shared consultation guidance. They are not 2,500 independently written or medically reviewed articles. Much of the clinical text reproduces reusable MedlinePlus and Orphadata material. HPO definitions are reproduced intact and labelled as terminology, not diagnostic rules.
404 drafts have fewer than 350 words of condition-specific source material. These are explicitly flagged for substantial research and rewriting; meeting 700 words does not make them publication-ready.
No qualified author, reviewer, registration number, review date or publication date has been invented.

EDITORIAL WORK NEEDED
Confirm each condition's scope and synonyms; independently check clinical facts and referral mapping; fill diagnostic, treatment, prevention and prognosis gaps; check Indian guidelines and local availability; rewrite technical and repetitive material for patients; arrange named author and separate medical review. Preserve source dates and citations. Retrieval on 2026-10-01 is not clinical review on that date.
The website's current /policies/editorial page excludes bulk-generated condition pages. Public publication needs a deliberate editorial decision consistent with the site's stated policy.

IMPORT
import/batch-01.json through batch-25.json use a structured section model (paragraphs and list items), avoiding executable HTML. Use id as the stable upsert key and content_sha256 to detect changes. Proposed /conditions/ paths are proposals only; they are not live URLs. Import as status=draft with publicly_available=false and null author/reviewer/publication fields. Do not emit public medical-review structured data for these drafts.
Manifest fields include department, relevant doctor category, total words, condition-source words, gaps and per-record review flags.

RIGHTS
Source: MedlinePlus, National Library of Medicine. Only public-domain health-topic/Genetics summaries are reproduced, not A.D.A.M. encyclopedia or licensed drug monographs. See https://medlineplus.gov/about/using/usingcontent/ .
Orphadata Science: Free access data from Orphanet. © INSERM 1999. Available at https://sciences.orphadata.com/ . July 2026 data, extracted 2026-06-23. CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ . Selection, arrangement and surrounding explanatory text are adaptations; no endorsement is implied.
This product uses the Human Phenotype Ontology (hp/releases/2026-09-01). Definitions are reproduced without alteration. Licence information: https://human-phenotype-ontology.github.io/license.html ; https://hpo.jax.org/app/license (current linked endpoint returned 404 at retrieval). See the plain-text HPO licence provenance note in audit. HPO citation is included in every draft. Do not change HPO vocabulary records or their logical relationships.

LIMITATIONS
The source corpus overrepresents genetic and rare conditions. It is not an India prevalence ranking or a complete catalogue of disease. Some entries are condition families or manifestations. HPO frequencies describe features among affected people, not the probability of diagnosis. Source-word counts include definitions, and are not a clinical quality score. Generic warning signs and consultation questions are editorial additions, not a validated triage system or a prescribed investigation pathway.

REPOSITORY STORAGE
For the website, the manifest and batches are stored as .json.gz and decompressed only by server code after the page requires staff authentication. The downloadable import package retains ordinary JSON. No files are placed in public/.
