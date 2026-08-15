import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mario Crespo — Software Engineer",
    short_name: "Mao Crespo",
    description:
      "Portafolio de Mario Crespo, Software Engineer especializado en React y Next.js.",
    start_url: "/es",
    display: "standalone",
    background_color: "#f5f5f2",
    theme_color: "#0a0a0c",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
