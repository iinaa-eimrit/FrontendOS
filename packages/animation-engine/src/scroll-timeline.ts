// ============================================================================
// Scroll Timeline — Scroll-driven animations
// ============================================================================

import type { ScrollTimelineConfig, Keyframe } from "./types";

interface ScrollAnimation {
  id: string;
  element: HTMLElement;
  config: ScrollTimelineConfig;
  keyframes: Keyframe[];
  cleanup: () => void;
}

export class ScrollTimeline {
  private animations = new Map<string, ScrollAnimation>();
  private idCounter = 0;

  /** Create a scroll-driven animation */
  create(element: HTMLElement, keyframes: Keyframe[], config: ScrollTimelineConfig): string {
    const id = `scroll_${++this.idCounter}`;
    const triggerEl = document.querySelector(config.trigger);
    if (!triggerEl) return id;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.updateElement(element, keyframes, entry.intersectionRatio);
          }
        }
      },
      { threshold: this.generateThresholds() },
    );

    observer.observe(triggerEl);

    const scrollHandler = config.scrub
      ? () => this.handleScrub(element, keyframes, triggerEl as HTMLElement, config)
      : undefined;

    if (scrollHandler) {
      window.addEventListener("scroll", scrollHandler, { passive: true });
    }

    const cleanup = () => {
      observer.disconnect();
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
    };

    this.animations.set(id, { id, element, config, keyframes, cleanup });
    return id;
  }

  /** Remove a scroll animation */
  remove(id: string): void {
    const anim = this.animations.get(id);
    if (anim) {
      anim.cleanup();
      this.animations.delete(id);
    }
  }

  /** Remove all scroll animations */
  destroy(): void {
    for (const anim of this.animations.values()) {
      anim.cleanup();
    }
    this.animations.clear();
  }

  private handleScrub(
    element: HTMLElement,
    keyframes: Keyframe[],
    trigger: HTMLElement,
    _config: ScrollTimelineConfig,
  ): void {
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.max(
      0,
      Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)),
    );
    this.updateElement(element, keyframes, progress);
  }

  private updateElement(element: HTMLElement, keyframes: Keyframe[], progress: number): void {
    // Find surrounding keyframes
    let startKf = keyframes[0]!;
    let endKf = keyframes[keyframes.length - 1]!;

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i]!.offset && progress <= keyframes[i + 1]!.offset) {
        startKf = keyframes[i]!;
        endKf = keyframes[i + 1]!;
        break;
      }
    }

    const localProgress =
      endKf.offset === startKf.offset
        ? 1
        : (progress - startKf.offset) / (endKf.offset - startKf.offset);

    for (const prop of Object.keys(endKf.properties)) {
      const startVal = startKf.properties[prop];
      const endVal = endKf.properties[prop];
      if (typeof startVal === "number" && typeof endVal === "number") {
        const current = startVal + (endVal - startVal) * localProgress;
        element.style.setProperty(prop, String(current));
      }
    }
  }

  private generateThresholds(): number[] {
    const steps = 20;
    return Array.from({ length: steps + 1 }, (_, i) => i / steps);
  }
}
