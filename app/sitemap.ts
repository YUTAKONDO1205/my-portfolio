import type { MetadataRoute } from "next";
import { projectSlugs } from "./portfolio-data";

const siteUrl = "https://kondo-yuta-my-portfolio.vercel.app";
const lastModified = new Date("2026-04-08T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
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
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${siteUrl}/research/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
