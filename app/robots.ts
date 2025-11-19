import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/checkout/",
          "/cart/",
          "/account/private/",
          "/*?*sort=", // Disallow sorted pages to avoid duplicate content
          "/*?*page=", // Disallow paginated pages (let canonical handle it)
        ],
      },
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
    ],
    sitemap: "https://tradeoff.ng/sitemap.xml",
  };
}
