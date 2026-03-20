// ============================================================================
// Bundle Analyzer — Runtime bundle analysis
// ============================================================================

import type { BundleReport, BundleChunk } from "./types";

export class BundleAnalyzer {
  /** Analyze currently loaded scripts */
  analyze(): BundleReport {
    const scripts = this.getLoadedScripts();
    const chunks: BundleChunk[] = scripts.map((script) => ({
      name: this.extractName(script.name),
      size: script.transferSize,
      gzipSize: script.encodedBodySize,
      modules: 1,
    }));

    const totalSize = chunks.reduce((sum, c) => sum + c.size, 0);
    const gzipSize = chunks.reduce((sum, c) => sum + c.gzipSize, 0);
    const duplicates = this.findDuplicateModules(chunks);

    return { totalSize, gzipSize, chunks, duplicates };
  }

  /** Get transfer sizes for all loaded resources */
  getResourceSizes(): Array<{ name: string; type: string; size: number }> {
    if (typeof performance === "undefined") return [];

    return performance
      .getEntriesByType("resource")
      .map((entry) => {
        const resource = entry as PerformanceResourceTiming;
        return {
          name: resource.name,
          type: resource.initiatorType,
          size: resource.transferSize,
        };
      })
      .filter((r) => r.size > 0);
  }

  /** Check if a particular vendor library is loaded */
  detectLibrary(name: string): boolean {
    const resources = performance.getEntriesByType("resource");
    return resources.some((r) => r.name.toLowerCase().includes(name.toLowerCase()));
  }

  private getLoadedScripts(): PerformanceResourceTiming[] {
    if (typeof performance === "undefined") return [];
    return performance
      .getEntriesByType("resource")
      .filter((e) => (e as PerformanceResourceTiming).initiatorType === "script") as PerformanceResourceTiming[];
  }

  private extractName(url: string): string {
    try {
      const parsed = new URL(url);
      const segments = parsed.pathname.split("/");
      return segments[segments.length - 1] || url;
    } catch {
      return url;
    }
  }

  private findDuplicateModules(chunks: BundleChunk[]): string[] {
    const names = chunks.map((c) => c.name);
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const name of names) {
      if (seen.has(name)) duplicates.add(name);
      seen.add(name);
    }
    return [...duplicates];
  }
}
