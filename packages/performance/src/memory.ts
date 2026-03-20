// ============================================================================
// Memory Monitor — Track heap usage and detect potential leaks
// ============================================================================

import type { MemorySnapshot } from "./types";

type MemoryCallback = (snapshot: MemorySnapshot) => void;

export class MemoryMonitor {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private snapshots: MemorySnapshot[] = [];
  private maxSnapshots = 100;
  private subscribers = new Set<MemoryCallback>();

  /** Start periodic memory monitoring */
  start(intervalMs = 5000): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      const snapshot = this.takeSnapshot();
      if (snapshot) {
        this.snapshots.push(snapshot);
        if (this.snapshots.length > this.maxSnapshots) {
          this.snapshots.shift();
        }
        for (const cb of this.subscribers) cb(snapshot);
      }
    }, intervalMs);
  }

  /** Stop monitoring */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** Subscribe to memory updates */
  subscribe(callback: MemoryCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /** Get current memory snapshot */
  takeSnapshot(): MemorySnapshot | null {
    if (typeof window === "undefined") return null;

    const memory = (performance as any).memory;
    return {
      timestamp: Date.now(),
      usedJSHeapSize: memory?.usedJSHeapSize ?? 0,
      totalJSHeapSize: memory?.totalJSHeapSize ?? 0,
      jsHeapSizeLimit: memory?.jsHeapSizeLimit ?? 0,
      domNodes: document.querySelectorAll("*").length,
      eventListeners: this.estimateEventListeners(),
    };
  }

  /** Detect if memory is trending upward (potential leak) */
  detectLeak(windowSize = 10): { leaking: boolean; growthRate: number } {
    if (this.snapshots.length < windowSize) {
      return { leaking: false, growthRate: 0 };
    }

    const recent = this.snapshots.slice(-windowSize);
    const first = recent[0]!.usedJSHeapSize;
    const last = recent[recent.length - 1]!.usedJSHeapSize;
    const growthRate = (last - first) / first;

    // Consider it a leak if heap grew >20% consistently
    const allGrowing = recent.every(
      (s, i) => i === 0 || s.usedJSHeapSize >= recent[i - 1]!.usedJSHeapSize,
    );

    return {
      leaking: allGrowing && growthRate > 0.2,
      growthRate,
    };
  }

  /** Get all collected snapshots */
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  private estimateEventListeners(): number {
    // Use getEventListeners if available (Chrome DevTools), otherwise estimate from DOM
    return document.querySelectorAll("[onclick], [onchange], [oninput], [onkeydown], [onkeyup]")
      .length;
  }
}
