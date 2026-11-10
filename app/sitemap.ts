import { SITE_URL } from "@/lib/site-content";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    images: route.images?.map((path) => `${SITE_URL}${path}`),
    ...(route.bilingual ? { alternates: { languages: LANGUAGES } } : {}),
  }));
}

type Route = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  /** Real photos only: image search is how « croffle Marrakech » finds the café. */
  images?: string[];
  /** Home and `/en` translate each other. */
  bilingual?: boolean;
};

const LANGUAGES = { fr: SITE_URL, en: `${SITE_URL}/en` };

// Ordered by weight in the strategy: coffee and croffles first, the rest behind.
const ROUTES: Route[] = [
  {
    path: "",
    changeFrequency: "daily",
    priority: 1,
    bilingual: true,
    images: [
      "/images/site/facade-night.jpg",
      "/images/site/barista-counter-2.jpg",
      "/images/site/espresso-latte.jpg",
      "/images/site/cappuccino-top.jpg",
    ],
  },
  {
    path: "/menu",
    changeFrequency: "daily",
    priority: 0.9,
    images: [
      "/images/site/croffle-caramel.jpg",
      "/images/site/croffle-fraise.jpg",
      "/images/site/croffle-3chocolats.jpg",
      "/images/site/croffle-nature.jpg",
    ],
  },
  {
    path: "/en",
    changeFrequency: "weekly",
    priority: 0.9,
    bilingual: true,
    images: ["/images/site/facade-night.jpg", "/images/site/croffle-caramel.jpg"],
  },
  { path: "/girls-only", changeFrequency: "weekly", priority: 0.9 },
  { path: "/cafe-ia", changeFrequency: "weekly", priority: 0.9 },
  {
    path: "/location",
    changeFrequency: "monthly",
    priority: 0.8,
    images: ["/images/site/facade-night.jpg"],
  },
  { path: "/prestations", changeFrequency: "monthly", priority: 0.7 },
  { path: "/notre-histoire", changeFrequency: "monthly", priority: 0.6 },
  { path: "/product", changeFrequency: "monthly", priority: 0.5 },
];
