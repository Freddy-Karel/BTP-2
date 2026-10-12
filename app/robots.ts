import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alliance-mobtp.ga";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gestion-alliance", "/gestion-alliance/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
