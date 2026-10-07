import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/clients",
        "/dashboard",
        "/files",
        "/forgot-password",
        "/invoices",
        "/login",
        "/messages",
        "/projects",
        "/reset-password",
        "/reviews",
        "/settings",
        "/signup",
        "/tasks",
      ],
    },
    sitemap: "https://souqivo.com/sitemap.xml",
  };
}
