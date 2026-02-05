import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kibazzikraft.com";
  const routes = [
    "",
    "/about",
    "/portfolio",
    "/services",
    "/apprenticeships",
    "/blog",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
