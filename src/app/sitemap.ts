import type { MetadataRoute } from "next";

// Stable date for lastModified — update manually when content changes.
const LAST_MODIFIED = new Date("2026-04-16");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://lefog.me",
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://lefog.me/about",
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://lefog.me/contact",
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
