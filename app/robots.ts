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
          "/account",
          "/account/",
          "/sign-in",
          "/admin",
          "/admin/",
          "/api/",
          // Per-doctor flows and generated images. Oct 2026: crawlers walking
          // every profile followed these into ~19,000 form renders and QR-card
          // rasterisations a day — the largest compute line on the account.
          // The pages are noindex anyway; the images carry X-Robots-Tag.
          "/doctor/*/report",
          "/doctor/*/review",
          "/doctor/*/enquire",
          "/doctor/*/book",
          "/doctor/*/correct",
          "/d/*/card",
          "/d/*/badge",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
