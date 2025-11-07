import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kech Waffles Marrakech",
    short_name: "Kech Waffles",
    description:
      "Restaurant à Marrakech spécialisé en gaufres tiramisu, pancakes, milkshakes et desserts gourmands",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    icons: [
      {
        src: "/images/menu-items/TransparentBlack.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/menu-items/TransparentBlack.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
