import type { BlogPost, Category, CategoryKey } from "@/lib/blog/types";

import { post as chooseADoctor } from "@/lib/blog/posts/how-to-choose-a-doctor-in-india";
import { post as spotAFake } from "@/lib/blog/posts/how-to-spot-a-fake-doctor-in-india";
import { post as consultationFees } from "@/lib/blog/posts/doctor-consultation-fees-in-india";
import { post as onlineRules } from "@/lib/blog/posts/online-doctor-consultation-rules-in-india";
import { post as patientRights } from "@/lib/blog/posts/patient-rights-in-india";
import { post as medicalRecords } from "@/lib/blog/posts/how-to-get-your-medical-records-in-india";
import { post as complain } from "@/lib/blog/posts/how-to-complain-about-a-doctor-in-india";
import { post as secondOpinion } from "@/lib/blog/posts/getting-a-second-opinion-in-india";
import { post as registries } from "@/lib/blog/posts/healthcare-professionals-registry-hpr-explained";
import { post as whereToBeTreated } from "@/lib/blog/posts/clinic-nursing-home-or-hospital-in-india";

export * from "@/lib/blog/types";

/**
 * The blog (as distinct from /health-guides).
 *
 * Health guides orient a reader towards a kind of doctor and, where they touch
 * symptoms, wait on a named registered reviewer. The blog is the non-clinical
 * half of the same argument: registers, credentials, costs, records, rights and
 * process. Nothing here makes a medical claim, which is why it carries no
 * reviewer line and needs none — and why it could be published now rather than
 * waiting on one.
 *
 * Categories group the index. They are deliberately NOT routes: three or four
 * posts do not make a page worth submitting, and a thin category page on a
 * domain with this little authority costs more in crawl budget than it returns.
 * If a category passes a dozen posts, that trade changes.
 */

export const BLOG_CATEGORIES: Record<CategoryKey, Category> = {
  checking: {
    key: "checking",
    name: "Checking a doctor",
    blurb: "Registers, registration numbers, credentials and what to do when a check fails.",
  },
  choosing: {
    key: "choosing",
    name: "Choosing and paying for care",
    blurb: "Picking a doctor and a place, what it costs, and what the fee should include.",
  },
  rights: {
    key: "rights",
    name: "Rights and rules",
    blurb: "What you are entitled to as a patient, and the rules that govern how you are treated.",
  },
};

export const CATEGORY_ORDER: CategoryKey[] = ["checking", "choosing", "rights"];

/** Published posts, newest first. Order here is the order on the index. */
export const POSTS: BlogPost[] = [
  chooseADoctor,
  spotAFake,
  consultationFees,
  patientRights,
  medicalRecords,
  onlineRules,
  complain,
  secondOpinion,
  registries,
  whereToBeTreated,
];

export function postBySlug(slug: string): BlogPost | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export function postsIn(category: CategoryKey): BlogPost[] {
  return POSTS.filter((p) => p.category === category);
}

/**
 * Posts to read next. The post names its own choices; anything missing is
 * topped up from the same category so the block is never short, and the post
 * itself is never suggested.
 */
export function relatedTo(post: BlogPost, count = 3): BlogPost[] {
  const picked: BlogPost[] = [];
  const add = (p: BlogPost | null) => {
    if (p && p.slug !== post.slug && !picked.some((q) => q.slug === p.slug)) picked.push(p);
  };
  post.related.forEach((slug) => add(postBySlug(slug)));
  postsIn(post.category).forEach(add);
  POSTS.forEach(add);
  return picked.slice(0, count);
}
