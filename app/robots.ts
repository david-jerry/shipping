import type { MetadataRoute } from "next"

import { siteUrl, toAbsoluteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/auth/", "/become-admin"],
      },
    ],
    sitemap: [toAbsoluteUrl("/sitemap.xml")],
    host: siteUrl,
  }
}
