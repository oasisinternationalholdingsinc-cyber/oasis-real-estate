// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://oasis-real-estate.vercel.app"; // same note: update later

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/partington`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Add more routes here later (e.g. /about, /contact)
  ];
}
