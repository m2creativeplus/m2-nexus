import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://m2-nexus.vercel.app";
  const routes = [
    "/",
    "/dashboard",
    "/agents",
    "/automations",
    "/analytics",
    "/settings",
  ];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : 0.7,
  }));
}
