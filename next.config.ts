import type { NextConfig } from "next";

const mediaCdn = process.env.NEXT_PUBLIC_MEDIA_CDN_URL;
let remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (mediaCdn) {
  try {
    const u = new URL(mediaCdn);
    remotePatterns = [{ protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname }];
  } catch {
    // An unparsable CDN URL is a configuration error; fail loudly at build.
    throw new Error(`NEXT_PUBLIC_MEDIA_CDN_URL is not a valid URL: ${mediaCdn}`);
  }
}

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    // Only the media CDN may serve doctor photographs through next/image.
    remotePatterns,
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  // Trailing slashes are a canonical decision, not a cosmetic one. We pick "no
  // trailing slash" once here so internal links, canonicals, redirects and
  // sitemap entries cannot disagree with each other.
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default config;
