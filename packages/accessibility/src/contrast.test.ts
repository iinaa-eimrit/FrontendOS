import { describe, it, expect } from "vitest";
import { ContrastChecker } from "@frontendos/accessibility";

describe("ContrastChecker", () => {
  const checker = new ContrastChecker();

  it("should calculate correct contrast ratio for black on white", () => {
    const result = checker.check("#000000", "#ffffff");
    expect(result.ratio).toBe(21);
    expect(result.aaSmall).toBe(true);
    expect(result.aaLarge).toBe(true);
    expect(result.aaaSmall).toBe(true);
    expect(result.aaaLarge).toBe(true);
  });

  it("should fail AA for low contrast", () => {
    const result = checker.check("#777777", "#888888");
    expect(result.aaSmall).toBe(false);
  });

  it("should handle 3-digit hex", () => {
    const result = checker.check("#000", "#fff");
    expect(result.ratio).toBe(21);
  });
});
