import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mario Crespo — Software Engineer",
    short_name: "Mao Crespo",
    description:
      "Portafolio de Mario Crespo, Software Engineer especializado en React y Next.js.",
    start_url: "/es",
    display: "standalone",
    // Literals, because the OS reads this JSON to paint the installed-app
    // icon and splash long before any stylesheet exists. From lib/brand.ts
    // so they can't drift from globals.css unnoticed.
    background_color: brand.paper,
    theme_color: brand.graphite,
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
