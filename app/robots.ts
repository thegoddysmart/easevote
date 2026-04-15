import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://easevotegh.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/super-admin/", "/organizer/", "/sign-in", "/sign-up"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
