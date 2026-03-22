// ============================================================================
// Prefetch Engine — Predictive resource loading
// ============================================================================

import type { PrefetchStrategy } from "./types";

interface PrefetchEntry {
  url: string;
  priority: "high" | "low";
  status: "pending" | "loading" | "loaded" | "error";
}

export class PrefetchEngine {
  private entries = new Map<string, PrefetchEntry>();
  private observer: IntersectionObserver | null = null;
  private strategy: PrefetchStrategy;

  constructor(strategy: PrefetchStrategy = "idle") {
    this.strategy = strategy;
  }

  /** Register a URL for prefetching */
  register(url: string, priority: "high" | "low" = "low"): void {
    if (this.entries.has(url)) return;
    this.entries.set(url, { url, priority, status: "pending" });
  }

  /** Start prefetching based on strategy */
  start(): void {
    switch (this.strategy) {
      case "idle":
        this.prefetchOnIdle();
        break;
      case "viewport":
        this.prefetchOnViewport();
        break;
      case "hover":
        this.prefetchOnHover();
        break;
      case "intent":
        this.prefetchOnIntent();
        break;
    }
  }

  /** Stop prefetching and cleanup */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  /** Force prefetch a specific URL */
  async prefetch(url: string): Promise<void> {
    const entry = this.entries.get(url);
    if (!entry || entry.status === "loaded" || entry.status === "loading") return;

    entry.status = "loading";

    try {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = url;
      link.as = this.inferResourceType(url);
      document.head.appendChild(link);
      entry.status = "loaded";
    } catch {
      entry.status = "error";
    }
  }

  /** Get status of all registered URLs */
  getStatus(): Map<string, PrefetchEntry> {
    return new Map(this.entries);
  }

  private prefetchOnIdle(): void {
    const pending = [...this.entries.values()]
      .filter((e) => e.status === "pending")
      .sort((a, b) => (a.priority === "high" ? -1 : 1));

    const prefetchNext = () => {
      const next = pending.shift();
      if (!next) return;
      this.prefetch(next.url).then(() => {
        if (pending.length > 0) {
          if ("requestIdleCallback" in window) {
            (window as any).requestIdleCallback(prefetchNext);
          } else {
            setTimeout(prefetchNext, 100);
          }
        }
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetchNext);
    } else {
      setTimeout(prefetchNext, 200);
    }
  }

  private prefetchOnViewport(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const url = (entry.target as HTMLElement).dataset.prefetch;
            if (url) this.prefetch(url);
          }
        }
      },
      { rootMargin: "200px" },
    );

    // Observe all links
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && this.entries.has(href)) {
        (link as HTMLElement).dataset.prefetch = href;
        this.observer!.observe(link);
      }
    });
  }

  private prefetchOnHover(): void {
    let hoverTimer: ReturnType<typeof setTimeout> | null = null;

    document.addEventListener(
      "pointerenter",
      (e) => {
        const link = (e.target as HTMLElement).closest("a[href]");
        if (!link) return;
        const href = link.getAttribute("href");
        if (href && this.entries.has(href)) {
          hoverTimer = setTimeout(() => this.prefetch(href), 65);
        }
      },
      { capture: true, passive: true },
    );

    document.addEventListener(
      "pointerleave",
      (e) => {
        const link = (e.target as HTMLElement).closest("a[href]");
        if (link && hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
      },
      { capture: true, passive: true },
    );
  }

  private prefetchOnIntent(): void {
    // Combine idle + hover strategies
    this.prefetchOnIdle();
    this.prefetchOnHover();
  }

  private inferResourceType(url: string): string {
    if (url.endsWith(".js") || url.endsWith(".mjs")) return "script";
    if (url.endsWith(".css")) return "style";
    if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url)) return "image";
    if (url.endsWith(".woff2") || url.endsWith(".woff")) return "font";
    return "fetch";
  }
}
