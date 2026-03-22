// ============================================================================
// Hydration Controller — Manages hydration strategies across zones
// ============================================================================

export type HydrationStrategy =
  | "full" // Standard full hydration
  | "partial" // Only hydrate interactive parts
  | "progressive" // Hydrate in priority order
  | "lazy" // Hydrate on interaction/visibility
  | "none"; // Static, no hydration (SSG/Islands)

interface HydrationTask {
  zoneId: string;
  strategy: HydrationStrategy;
  priority: number;
  hydrate: () => Promise<void>;
}

export class HydrationController {
  private queue: HydrationTask[] = [];
  private hydrated = new Set<string>();
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (typeof IntersectionObserver !== "undefined") {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const zoneId = (entry.target as HTMLElement).dataset.zone;
              if (zoneId) this.hydrateZone(zoneId);
            }
          }
        },
        { rootMargin: "200px" },
      );
    }
  }

  /** Schedule a zone for hydration */
  schedule(task: HydrationTask): void {
    if (this.hydrated.has(task.zoneId)) return;

    switch (task.strategy) {
      case "full":
        // Hydrate immediately
        void task.hydrate().then(() => this.hydrated.add(task.zoneId));
        break;
      case "progressive":
        // Add to priority queue
        this.queue.push(task);
        this.queue.sort((a, b) => a.priority - b.priority);
        this.processQueue();
        break;
      case "lazy":
        // Observe for visibility
        this.observeZone(task);
        break;
      case "partial":
      case "none":
        // Mark as handled
        this.hydrated.add(task.zoneId);
        break;
    }
  }

  /** Check if a zone is hydrated */
  isHydrated(zoneId: string): boolean {
    return this.hydrated.has(zoneId);
  }

  /** Force hydrate a specific zone */
  async hydrateZone(zoneId: string): Promise<void> {
    const task = this.queue.find((t) => t.zoneId === zoneId);
    if (task && !this.hydrated.has(zoneId)) {
      await task.hydrate();
      this.hydrated.add(zoneId);
      this.queue = this.queue.filter((t) => t.zoneId !== zoneId);
    }
  }

  /** Destroy observer and clean up */
  destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.queue = [];
    this.hydrated.clear();
  }

  private async processQueue(): Promise<void> {
    // Use requestIdleCallback if available, otherwise setTimeout
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback
        : (fn: () => void) => setTimeout(fn, 1);

    for (const task of this.queue) {
      if (this.hydrated.has(task.zoneId)) continue;
      await new Promise<void>((resolve) => {
        schedule(async () => {
          await task.hydrate();
          this.hydrated.add(task.zoneId);
          resolve();
        });
      });
    }
  }

  private observeZone(task: HydrationTask): void {
    if (!this.observer) {
      // Fallback: just add to queue
      this.queue.push(task);
      return;
    }

    const element = document.querySelector(`[data-zone="${task.zoneId}"]`);
    if (element) {
      this.queue.push(task);
      this.observer.observe(element);
    }
  }
}
