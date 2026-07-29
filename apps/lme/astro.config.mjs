// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { tailwindcss } from "@repo/tailwind/vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://livhuandmusa.co.za",
  redirects: {
    "/about": "/#about",
    "/services": "/#services",
    "/projects": "/#projects",
  },
  server: { port: 4322 },
  preview: { port: 4322 },
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
