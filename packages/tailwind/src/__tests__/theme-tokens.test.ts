import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test, expect } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "..");

const themeCss = readFileSync(resolve(srcDir, "theme.css"), "utf-8");
const stylesCss = readFileSync(resolve(srcDir, "styles.css"), "utf-8");

/**
 * Smoke tests for shared design token existence.
 * Requirements: 1.3, 1.5, 1.6
 */
describe("theme.css — shared token existence", () => {
  test("contains --color-charcoal", () => {
    expect(themeCss).toContain("--color-charcoal");
  });

  test("contains --color-slate", () => {
    expect(themeCss).toContain("--color-slate");
  });

  test("contains --color-whatsapp", () => {
    expect(themeCss).toContain("--color-whatsapp");
  });

  test("contains --font-sans", () => {
    expect(themeCss).toContain("--font-sans");
  });

  test("contains --max-w-content", () => {
    expect(themeCss).toContain("--max-w-content");
  });

  test("contains --color-brand", () => {
    expect(themeCss).toContain("--color-brand");
  });
});

describe("theme.css — site-specific colours must NOT be present", () => {
  test("does NOT contain STP safety-orange #ff9f1c", () => {
    expect(themeCss).not.toContain("#ff9f1c");
  });

  test("does NOT contain LME teal-blue #0898c8", () => {
    expect(themeCss).not.toContain("#0898c8");
  });
});

describe("styles.css — @source directives cover both apps", () => {
  test("@source covers apps/stp/src", () => {
    expect(stylesCss).toMatch(/apps\/stp\/src/);
  });

  test("@source covers apps/lme/src", () => {
    expect(stylesCss).toMatch(/apps\/lme\/src/);
  });
});
