// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { tailwindcss } from "@repo/tailwind/vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: { port: 4322 },
  preview: { port: 4322 },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@repo/tailwind": path.resolve(root, "../../packages/tailwind"),
      },
    },
  },
});
