// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { tailwindcss } from "@repo/tailwind/vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: { port: 4323 },
  preview: { port: 4323 },
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
