import { describe, test, expect } from "vitest";

// ---------------------------------------------------------------------------
// WCAG relative luminance utility (local to this test file)
// Spec: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
// ---------------------------------------------------------------------------

function linearise(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/**
 * Compute the WCAG contrast ratio between two hex colours.
 * Returns a value in the range [1, 21].
 */
function wcagContrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Tests
// Requirements: 4.1, 4.2, 4.3, 4.4
// ---------------------------------------------------------------------------

describe("wcagContrastRatio — key brand colour pairs", () => {
  test("#ff9f1c (STP safety-orange) on #1e1e24 (charcoal) ≥ 3.0 — large text / icon threshold", () => {
    // Actual ratio ≈ 8.08 — comfortably above 3.0 (large-text / UI component AA)
    expect(wcagContrastRatio("#ff9f1c", "#1e1e24")).toBeGreaterThanOrEqual(3.0);
  });

  test("#0898c8 (LME teal-blue) on #1e1e24 (charcoal) ≥ 3.0 — UI component threshold", () => {
    // Actual ratio ≈ 5.00 — passes 3.0 (UI component) and 4.5 (small text) thresholds
    expect(wcagContrastRatio("#0898c8", "#1e1e24")).toBeGreaterThanOrEqual(3.0);
  });

  test("#f59e0b (amber accent) on #1e1e24 (charcoal) ≥ 4.5 — CTA button background", () => {
    // Actual ratio ≈ 7.72
    expect(wcagContrastRatio("#f59e0b", "#1e1e24")).toBeGreaterThanOrEqual(4.5);
  });

  test("#1e1e24 (charcoal text) on #f59e0b (amber button) ≥ 4.5 — text on amber CTA", () => {
    // Contrast is symmetric — same ratio ≈ 7.72
    expect(wcagContrastRatio("#1e1e24", "#f59e0b")).toBeGreaterThanOrEqual(4.5);
  });

  test("#a3a3a3 (neutral-400) on #1e1e24 (charcoal) ≥ 4.5 — body text on charcoal", () => {
    // Actual ratio ≈ 6.57
    expect(wcagContrastRatio("#a3a3a3", "#1e1e24")).toBeGreaterThanOrEqual(4.5);
  });

  test("#a3a3a3 (neutral-400) on #2a2a32 (slate) ≥ 4.5 — body text on slate", () => {
    // Actual ratio ≈ 5.64 — passes 4.5:1 small-text AA threshold
    expect(wcagContrastRatio("#a3a3a3", "#2a2a32")).toBeGreaterThanOrEqual(4.5);
  });

  test("#ffffff (white) on #1e1e24 (charcoal) ≥ 4.5 — white text on charcoal", () => {
    // Actual ratio ≈ 16.58
    expect(wcagContrastRatio("#ffffff", "#1e1e24")).toBeGreaterThanOrEqual(4.5);
  });
});
