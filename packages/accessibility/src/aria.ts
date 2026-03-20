// ============================================================================
// ARIA Manager — Auto-inject and manage ARIA attributes
// ============================================================================

import type { AriaLiveRegion } from "./types";

export class AriaManager {
  private liveRegions = new Map<string, HTMLElement>();

  /** Ensure element has required ARIA attributes for its role */
  ensureAttributes(element: HTMLElement): void {
    const role = element.getAttribute("role") || this.inferRole(element);
    if (!role) return;

    switch (role) {
      case "button":
        if (!element.getAttribute("tabindex") && element.tagName !== "BUTTON") {
          element.setAttribute("tabindex", "0");
        }
        break;
      case "dialog":
        if (!element.getAttribute("aria-modal")) {
          element.setAttribute("aria-modal", "true");
        }
        if (!element.getAttribute("aria-labelledby") && !element.getAttribute("aria-label")) {
          const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
          if (heading?.id) {
            element.setAttribute("aria-labelledby", heading.id);
          }
        }
        break;
      case "tablist":
        this.setupTabList(element);
        break;
      case "menu":
        element.setAttribute("aria-orientation", element.getAttribute("aria-orientation") ?? "vertical");
        break;
      case "progressbar":
        if (!element.getAttribute("aria-valuemin")) element.setAttribute("aria-valuemin", "0");
        if (!element.getAttribute("aria-valuemax")) element.setAttribute("aria-valuemax", "100");
        break;
    }
  }

  /** Create or get a live region for announcements */
  createLiveRegion(config: AriaLiveRegion): HTMLElement {
    const existing = this.liveRegions.get(config.id);
    if (existing) return existing;

    const region = document.createElement("div");
    region.id = config.id;
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", config.politeness);
    if (config.atomic) region.setAttribute("aria-atomic", "true");
    if (config.relevant) region.setAttribute("aria-relevant", config.relevant);

    // Visually hidden but accessible to screen readers
    Object.assign(region.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    });

    document.body.appendChild(region);
    this.liveRegions.set(config.id, region);
    return region;
  }

  /** Remove a live region */
  removeLiveRegion(id: string): void {
    const region = this.liveRegions.get(id);
    if (region) {
      region.remove();
      this.liveRegions.delete(id);
    }
  }

  /** Destroy all managed live regions */
  destroy(): void {
    for (const region of this.liveRegions.values()) {
      region.remove();
    }
    this.liveRegions.clear();
  }

  private inferRole(element: HTMLElement): string | null {
    const tag = element.tagName.toLowerCase();
    const roleMap: Record<string, string> = {
      nav: "navigation",
      main: "main",
      aside: "complementary",
      header: "banner",
      footer: "contentinfo",
      form: "form",
      section: "region",
    };
    return roleMap[tag] ?? null;
  }

  private setupTabList(tablist: HTMLElement): void {
    const tabs = tablist.querySelectorAll('[role="tab"]');
    tabs.forEach((tab, i) => {
      if (!tab.getAttribute("tabindex")) {
        tab.setAttribute("tabindex", i === 0 ? "0" : "-1");
      }
    });
  }
}
