import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * Crawl rules.
 *
 * Disallow is used for whole areas that must never be crawled — flows,
 * internal search, anything behind authentication. It is NOT used to keep a
 * thin page out of the index: a disallowed URL cannot be read, so its noindex
 * would never be seen. Pages that fail an inventory gate stay crawlable and
 * carry noindex on the page itself.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/search",
          "/add-doctor",
          "/claim-profile",
          "/dashboard",
          "/dashboard/",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
