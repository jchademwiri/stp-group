/**
 * Tailwind v4 - theme tokens live in src/theme.css (@theme).
 * This file documents content paths; the Vite plugin is wired in each app's astro.config.mjs.
 */
export default {
  content: [
    "./src/**/*.{astro,html,js,ts}",
    "../../apps/stp/src/**/*.{astro,html,js,ts}",
    "../../apps/lme/src/**/*.{astro,html,js,ts}",
    "../../apps/lms/src/**/*.{astro,html,js,ts}",
    "../../apps/srl/src/**/*.{astro,html,js,ts}",
  ],
};
