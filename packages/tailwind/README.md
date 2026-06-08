# @repo/tailwind

Shared **Tailwind CSS v4** setup for the monorepo.

## Files

| File | Purpose |
| --- | --- |
| `src/theme.css` | **Design tokens** (`@theme`) - colors, fonts |
| `src/styles.css` | Tailwind entry + `@source` paths for all apps |
| `tailwind.config.mjs` | Content paths reference (v4 uses CSS-first theme) |
| `vite.mjs` | Re-exports `@tailwindcss/vite` plugin |
| `src/layouts/BaseLayout.astro` | Root HTML shell; imports `styles.css` |

## Use in an Astro app

**1. `package.json`**

```json
"dependencies": {
  "@repo/tailwind": "workspace:*"
}
```

**2. `astro.config.mjs`**

```js
import { tailwindcss } from "@repo/tailwind/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

**3. Layout**

```astro
---
import BaseLayout from "@repo/tailwind/layouts/BaseLayout.astro";
---
<BaseLayout title="Page title" bodyClass="bg-charcoal text-white">
  ...
</BaseLayout>
```

Site-specific layouts (e.g. `StpLayout.astro`) should wrap `BaseLayout`, not replace it.

## Customizing tokens

Edit `src/theme.css`, then use utilities like `bg-charcoal`, `text-safety`, `bg-whatsapp`.
