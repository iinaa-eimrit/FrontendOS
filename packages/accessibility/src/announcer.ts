// ============================================================================
// Screen Reader Announcer — Programmatic live region announcements
// ============================================================================

export class ScreenReaderAnnouncer {
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  constructor() {
    if (typeof document !== "undefined") {
      this.politeRegion = this.createRegion("frontendos-sr-polite", "polite");
      this.assertiveRegion = this.createRegion("frontendos-sr-assertive", "assertive");
    }
  }

  /** Make a polite announcement (queued after current speech) */
  announce(message: string): void {
    this.setMessage(this.politeRegion, message);
  }

  /** Make an assertive announcement (interrupts current speech) */
  announceUrgent(message: string): void {
    this.setMessage(this.assertiveRegion, message);
  }

  /** Clean up DOM elements */
  destroy(): void {
    this.politeRegion?.remove();
    this.assertiveRegion?.remove();
    this.politeRegion = null;
    this.assertiveRegion = null;
  }

  private setMessage(region: HTMLElement | null, message: string): void {
    if (!region) return;
    // Clear then set to trigger announcement even for same message
    region.textContent = "";
    requestAnimationFrame(() => {
      region.textContent = message;
    });
  }

  private createRegion(id: string, politeness: "polite" | "assertive"): HTMLElement {
    const existing = document.getElementById(id);
    if (existing) return existing;

    const region = document.createElement("div");
    region.id = id;
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");

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
    return region;
  }
}
