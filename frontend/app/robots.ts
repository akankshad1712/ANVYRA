import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/account/", "/orders/", "/checkout/", "/cart/"],
    },
    sitemap: "https://anvyra-klb2.vercel.app/sitemap.xml",
  };
}
