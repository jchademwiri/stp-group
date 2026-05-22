// @ts-check
import { defineConfig } from "astro/config";
import { tailwindcss } from "@repo/tailwind/vite";

export default defineConfig({
  server: { port: 4322 },
  preview: { port: 4322 },
  vite: {
    plugins: [tailwindcss()],
  },
});
