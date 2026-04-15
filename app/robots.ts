import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://easevotegh.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/sign-in", "/sign-up", "/unauthorized"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
