import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TradeOff - Premium Luxury Fashion Marketplace",
    short_name: "TradeOff",
    description:
      "Nigeria's premier luxury fashion marketplace. Buy and sell authenticated designer fashion.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-1.png",
        sizes: "540x720",
        form_factor: "narrow",
        type: "image/png",
      },
      {
        src: "/screenshot-2.png",
        sizes: "1280x720",
        form_factor: "wide",
        type: "image/png",
      },
    ],
    categories: ["shopping", "lifestyle"],
    prefer_related_applications: false,
  };
}
