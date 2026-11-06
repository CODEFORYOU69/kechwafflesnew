import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kech Waffles Marrakech",
    short_name: "Kech Waffles",
    description:
      "Café de spécialité, croffles du jour et pâtisseries maison à Marrakech. Mardis et jeudis Girls Only, Café IA pour les étudiants.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0B08",
    theme_color: "#0F0B08",
    icons: [
      {
        src: "/brand/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/brand/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
