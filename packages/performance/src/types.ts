// ============================================================================
// Performance Engine Types
// ============================================================================

export interface WebVitalsMetrics {
  lcp: number | null; // Largest Contentful Paint (ms)
  fid: number | null; // First Input Delay (ms)
  cls: number | null; // Cumulative Layout Shift
  inp: number | null; // Interaction to Next Paint (ms)
  ttfb: number | null; // Time to First Byte (ms)
  fcp: number | null; // First Contentful Paint (ms)
}

export interface PerformanceEntry {
  name: string;
  type: string;
  startTime: number;
  duration: number;
  metadata?: Record<string, unknown>;
}

export interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  domNodes: number;
  eventListeners: number;
}

export interface BundleReport {
  totalSize: number;
  gzipSize: number;
  chunks: BundleChunk[];
  duplicates: string[];
}

export interface BundleChunk {
  name: string;
  size: number;
  gzipSize: number;
  modules: number;
}

export interface BudgetConfig {
  maxBundleSize?: number; // bytes
  maxChunkSize?: number; // bytes
  maxLCP?: number; // ms
  maxFID?: number; // ms
  maxCLS?: number;
  maxINP?: number; // ms
  maxTTFB?: number; // ms
  maxDOMNodes?: number;
  maxJSHeapSize?: number; // bytes
}

export interface BudgetResult {
  passed: boolean;
  violations: BudgetViolation[];
}

export interface BudgetViolation {
  metric: string;
  budget: number;
  actual: number;
  overBy: number;
  severity: "warning" | "error";
}

export type PrefetchStrategy = "viewport" | "idle" | "hover" | "intent";
