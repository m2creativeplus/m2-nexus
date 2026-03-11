import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/dashboard/"],
      },
    ],
    sitemap: "https://m2-nexus.vercel.app/sitemap.xml",
  };
}
