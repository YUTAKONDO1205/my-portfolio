import type { MetadataRoute } from "next";

const siteUrl = "https://kondo-yuta-my-portfolio.vercel.app";
const lastModified = new Date("2026-04-02T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/research`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
