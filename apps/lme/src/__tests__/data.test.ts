import { describe, test, expect } from "vitest";
import { LME, contractCategories } from "../data/site";

/**
 * Unit tests for contractCategories coverage.
 * Requirements: 10.3
 */
describe("contractCategories — coverage of LME.contracts", () => {
  const allCategorisedContracts = Object.values(contractCategories).flat();

  test("every LME.contracts item appears in at least one category", () => {
    for (const contract of LME.contracts) {
      expect(
        allCategorisedContracts,
        `Contract not found in any category: "${contract}"`
      ).toContain(contract);
    }
  });

  test("contractCategories has at least one category", () => {
    expect(Object.keys(contractCategories).length).toBeGreaterThan(0);
  });

  test("no LME.contracts item is missing from all categories", () => {
    const missing = LME.contracts.filter(
      (c) => !allCategorisedContracts.includes(c)
    );
    expect(missing).toHaveLength(0);
  });
});
