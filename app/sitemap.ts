import type { MetadataRoute } from "next";
import { projectSlugs } from "./portfolio-data";
import { siteUrl } from "./site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/research`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectSlugs.map((slug) => ({
      url: `${siteUrl}/research/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
