import { describe, it, expect } from "vitest";
import { PerformanceBudget } from "@frontendos/performance";

describe("PerformanceBudget", () => {
  it("should pass when metrics are within budget", () => {
    const budget = new PerformanceBudget();
    const result = budget.checkVitals({
      lcp: 1000,
      fid: 50,
      cls: 0.05,
      inp: 100,
      ttfb: 200,
      fcp: 800,
    });
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("should report violations when metrics exceed budget", () => {
    const budget = new PerformanceBudget({ maxLCP: 1000 });
    const result = budget.checkVitals({
      lcp: 3000,
      fid: null,
      cls: null,
      inp: null,
      ttfb: null,
      fcp: null,
    });
    expect(result.passed).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0]!.metric).toBe("LCP");
    expect(result.violations[0]!.overBy).toBe(2000);
  });

  it("should check bundle size", () => {
    const budget = new PerformanceBudget({ maxBundleSize: 100000 });
    const result = budget.checkBundleSize(150000);
    expect(result.passed).toBe(false);
  });
});
