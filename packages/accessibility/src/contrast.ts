// ============================================================================
// Contrast Checker — WCAG color contrast validation
// ============================================================================

import type { ContrastResult } from "./types";

export class ContrastChecker {
  /** Check contrast ratio between two hex colors */
  check(foreground: string, background: string): ContrastResult {
    const fgLum = this.relativeLuminance(this.parseHex(foreground));
    const bgLum = this.relativeLuminance(this.parseHex(background));

    const lighter = Math.max(fgLum, bgLum);
    const darker = Math.min(fgLum, bgLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      foreground,
      background,
      ratio: Math.round(ratio * 100) / 100,
      aaSmall: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaSmall: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }

  /** Check contrast for a DOM element against its background */
  checkElement(element: HTMLElement): ContrastResult | null {
    if (typeof window === "undefined") return null;

    const styles = window.getComputedStyle(element);
    const fg = styles.color;
    const bg = this.getEffectiveBackground(element);

    if (!fg || !bg) return null;

    return this.check(this.rgbToHex(fg), this.rgbToHex(bg));
  }

  /** Suggest a passing foreground color given a background */
  suggestForeground(background: string, targetRatio = 4.5): string {
    const bgRgb = this.parseHex(background);
    const bgLum = this.relativeLuminance(bgRgb);

    // Try dark and light foreground, pick the one that meets ratio
    const darkResult = this.check("#000000", background);
    if (darkResult.ratio >= targetRatio) return "#000000";

    const lightResult = this.check("#ffffff", background);
    if (lightResult.ratio >= targetRatio) return "#ffffff";

    // Binary search for a gray that meets the ratio
    if (bgLum > 0.5) {
      // Dark foreground needed
      return this.findPassingGray(background, targetRatio, 0, 128);
    } else {
      // Light foreground needed
      return this.findPassingGray(background, targetRatio, 128, 255);
    }
  }

  private findPassingGray(bg: string, target: number, low: number, high: number): string {
    let best = low;
    for (let i = 0; i < 8; i++) {
      const mid = Math.round((low + high) / 2);
      const hex = `#${mid.toString(16).padStart(2, "0").repeat(3)}`;
      const result = this.check(hex, bg);
      if (result.ratio >= target) {
        best = mid;
        // Try to get closer to the background (less harsh contrast)
        if (this.relativeLuminance(this.parseHex(bg)) > 0.5) {
          low = mid;
        } else {
          high = mid;
        }
      } else {
        // Need more contrast
        if (this.relativeLuminance(this.parseHex(bg)) > 0.5) {
          high = mid;
        } else {
          low = mid;
        }
      }
    }
    return `#${best.toString(16).padStart(2, "0").repeat(3)}`;
  }

  private parseHex(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const expanded =
      clean.length === 3
        ? clean[0]! + clean[0]! + clean[1]! + clean[1]! + clean[2]! + clean[2]!
        : clean;
    return [
      parseInt(expanded.slice(0, 2), 16),
      parseInt(expanded.slice(2, 4), 16),
      parseInt(expanded.slice(4, 6), 16),
    ];
  }

  private relativeLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    }) as [number, number, number];
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private getEffectiveBackground(element: HTMLElement): string | null {
    let current: HTMLElement | null = element;
    while (current) {
      const bg = window.getComputedStyle(current).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        return bg;
      }
      current = current.parentElement;
    }
    return "rgb(255, 255, 255)";
  }

  private rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return "#000000";
    return (
      "#" +
      match
        .slice(0, 3)
        .map((n) => parseInt(n).toString(16).padStart(2, "0"))
        .join("")
    );
  }
}
