// @ts-check
import { defineConfig } from "astro/config";
import { tailwindcss } from "@repo/tailwind/vite";

export default defineConfig({
  site: "https://sithembe.co.za",
  server: { port: 4321 },
  preview: { port: 4321 },
  vite: {
    plugins: [tailwindcss()],
  },
});
