// src/app/robots.js
import { siteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/orders", "/signin", "/kitchen", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}