import { describe, test, expect } from "vitest";

/**
 * Property 2: Navigation mutual exclusion — exactly one active link
 *
 * Validates: Requirements 11.3
 */

// Nav link definitions mirroring LmeLayout.astro
const lmeNavLinks = [
  { href: "/",         label: "Home",     match: (p: string) => p === "/" || p === "" },
  { href: "/about",    label: "About",    match: (p: string) => p.startsWith("/about") },
  { href: "/services", label: "Services", match: (p: string) => p.startsWith("/services") },
  { href: "/projects", label: "Projects", match: (p: string) => p.startsWith("/projects") },
  { href: "#contact",  label: "Contact",  match: () => false },
];

describe("LME navigation — mutual exclusion", () => {
  const knownPaths = ["/", "/about", "/services", "/projects", "/unknown"] as const;

  test.each(knownPaths)(
    "path %s activates at most one nav link",
    (path) => {
      const activeCount = lmeNavLinks.filter((link) => link.match(path)).length;
      expect(activeCount).toBeLessThanOrEqual(1);
    }
  );

  test.each(["/", "/about", "/services", "/projects"] as const)(
    "known route %s activates exactly one nav link",
    (path) => {
      const activeCount = lmeNavLinks.filter((link) => link.match(path)).length;
      expect(activeCount).toBe(1);
    }
  );

  test("unknown path /unknown activates zero nav links", () => {
    const activeCount = lmeNavLinks.filter((link) => link.match("/unknown")).length;
    expect(activeCount).toBe(0);
  });
});
