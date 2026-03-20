// ============================================================================
// Web Vitals Monitor — Core Web Vitals tracking
// ============================================================================

import type { WebVitalsMetrics } from "./types";

type VitalsCallback = (metrics: WebVitalsMetrics) => void;

export class WebVitalsMonitor {
  private metrics: WebVitalsMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    inp: null,
    ttfb: null,
    fcp: null,
  };
  private subscribers = new Set<VitalsCallback>();
  private observers: PerformanceObserver[] = [];

  /** Start monitoring Web Vitals */
  start(): void {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeINP();
    this.observeTTFB();
    this.observeFCP();
  }

  /** Stop monitoring */
  stop(): void {
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers = [];
  }

  /** Subscribe to metric updates */
  subscribe(callback: VitalsCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /** Get current metrics snapshot */
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  private notify(): void {
    const snapshot = this.getMetrics();
    for (const cb of this.subscribers) cb(snapshot);
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          this.metrics.lcp = last.startTime;
          this.notify();
        }
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      this.observers.push(observer);
    } catch {
      // Not supported
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0] as PerformanceEventTiming | undefined;
        if (entry) {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.notify();
        }
      });
      observer.observe({ type: "first-input", buffered: true });
      this.observers.push(observer);
    } catch {
      // Not supported
    }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
        this.notify();
      });
      observer.observe({ type: "layout-shift", buffered: true });
      this.observers.push(observer);
    } catch {
      // Not supported
    }
  }

  private observeINP(): void {
    try {
      let maxINP = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.duration;
          if (duration > maxINP) {
            maxINP = duration;
            this.metrics.inp = duration;
            this.notify();
          }
        }
      });
      observer.observe({ type: "event", buffered: true });
      this.observers.push(observer);
    } catch {
      // Not supported
    }
  }

  private observeTTFB(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const nav = list.getEntries()[0] as PerformanceNavigationTiming | undefined;
        if (nav) {
          this.metrics.ttfb = nav.responseStart - nav.requestStart;
          this.notify();
        }
      });
      observer.observe({ type: "navigation", buffered: true });
      this.observers.push(observer);
    } catch {
      // Not supported
    }
  }

  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            this.metrics.fcp = entry.startTime;
            this.notify();
          }
        }
      });
      observer.observe({ type: "paint", buffered: true });
      this.observers.push(observer);
    } catch {
      // Not supported
    }
  }
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}
