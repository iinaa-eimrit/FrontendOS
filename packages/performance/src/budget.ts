// ============================================================================
// Performance Budget — Validate metrics against configured budgets
// ============================================================================

import type {
  BudgetConfig,
  BudgetResult,
  BudgetViolation,
  WebVitalsMetrics,
  MemorySnapshot,
} from "./types";

const DEFAULT_BUDGET: Required<BudgetConfig> = {
  maxBundleSize: 250 * 1024, // 250KB
  maxChunkSize: 100 * 1024, // 100KB
  maxLCP: 2500,
  maxFID: 100,
  maxCLS: 0.1,
  maxINP: 200,
  maxTTFB: 800,
  maxDOMNodes: 1500,
  maxJSHeapSize: 50 * 1024 * 1024, // 50MB
};

export class PerformanceBudget {
  private config: Required<BudgetConfig>;

  constructor(config: Partial<BudgetConfig> = {}) {
    this.config = { ...DEFAULT_BUDGET, ...config };
  }

  /** Check web vitals against budgets */
  checkVitals(metrics: WebVitalsMetrics): BudgetResult {
    const violations: BudgetViolation[] = [];

    const checks: Array<{
      metric: string;
      actual: number | null;
      budget: number;
      severity: "warning" | "error";
    }> = [
      { metric: "LCP", actual: metrics.lcp, budget: this.config.maxLCP, severity: "error" },
      { metric: "FID", actual: metrics.fid, budget: this.config.maxFID, severity: "error" },
      { metric: "CLS", actual: metrics.cls, budget: this.config.maxCLS, severity: "error" },
      { metric: "INP", actual: metrics.inp, budget: this.config.maxINP, severity: "warning" },
      { metric: "TTFB", actual: metrics.ttfb, budget: this.config.maxTTFB, severity: "warning" },
    ];

    for (const check of checks) {
      if (check.actual !== null && check.actual > check.budget) {
        violations.push({
          metric: check.metric,
          budget: check.budget,
          actual: check.actual,
          overBy: check.actual - check.budget,
          severity: check.severity,
        });
      }
    }

    return { passed: violations.length === 0, violations };
  }

  /** Check memory against budgets */
  checkMemory(snapshot: MemorySnapshot): BudgetResult {
    const violations: BudgetViolation[] = [];

    if (snapshot.domNodes > this.config.maxDOMNodes) {
      violations.push({
        metric: "DOM Nodes",
        budget: this.config.maxDOMNodes,
        actual: snapshot.domNodes,
        overBy: snapshot.domNodes - this.config.maxDOMNodes,
        severity: "warning",
      });
    }

    if (snapshot.usedJSHeapSize > this.config.maxJSHeapSize) {
      violations.push({
        metric: "JS Heap Size",
        budget: this.config.maxJSHeapSize,
        actual: snapshot.usedJSHeapSize,
        overBy: snapshot.usedJSHeapSize - this.config.maxJSHeapSize,
        severity: "error",
      });
    }

    return { passed: violations.length === 0, violations };
  }

  /** Check bundle size against budget */
  checkBundleSize(sizeBytes: number): BudgetResult {
    const violations: BudgetViolation[] = [];

    if (sizeBytes > this.config.maxBundleSize) {
      violations.push({
        metric: "Bundle Size",
        budget: this.config.maxBundleSize,
        actual: sizeBytes,
        overBy: sizeBytes - this.config.maxBundleSize,
        severity: "error",
      });
    }

    return { passed: violations.length === 0, violations };
  }

  /** Get current budget configuration */
  getConfig(): Required<BudgetConfig> {
    return { ...this.config };
  }

  /** Update budget configuration */
  updateConfig(partial: Partial<BudgetConfig>): void {
    Object.assign(this.config, partial);
  }
}
