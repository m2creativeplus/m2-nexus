import { MetadataRoute } from "next";
import { SITEMAP_PATHS } from "@/lib/sitemap-routes";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return SITEMAP_PATHS.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : route === "/seo-audit" ? 0.85 : 0.65,
  }));
}
