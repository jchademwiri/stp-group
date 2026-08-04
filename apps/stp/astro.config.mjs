// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { tailwindcss } from "@repo/tailwind/vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://sithembe.co.za",
  output: "static",
  integrations: [sitemap()],
  redirects: {
    "/plant-hire": "/services#plant-hire",
    "/about": "/#about",
    "/projects": "/#projects",
  },
  server: { port: 4321 },
  preview: { port: 4321 },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(root, "./src"),
        "@repo/tailwind": path.resolve(root, "../../packages/tailwind"),
      },
    },
  },
});
