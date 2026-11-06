import { SITE_URL } from "@/lib/site-content";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

type Route = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

// Ordered by weight in the strategy: coffee and croffles first, the rest behind.
const ROUTES: Route[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/menu", changeFrequency: "daily", priority: 0.9 },
  { path: "/girls-only", changeFrequency: "weekly", priority: 0.9 },
  { path: "/cafe-ia", changeFrequency: "weekly", priority: 0.9 },
  { path: "/location", changeFrequency: "monthly", priority: 0.8 },
  { path: "/prestations", changeFrequency: "monthly", priority: 0.7 },
  { path: "/notre-histoire", changeFrequency: "monthly", priority: 0.6 },
  { path: "/product", changeFrequency: "monthly", priority: 0.5 },
];
