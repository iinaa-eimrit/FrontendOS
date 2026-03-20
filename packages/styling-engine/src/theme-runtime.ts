// ============================================================================
// Theme Runtime — Dynamic theme switching and CSS custom property management
// ============================================================================

import { colorTokens, type ColorTheme } from "@frontendos/design-tokens";

import type { ThemeMode, BrandConfig } from "./types";

export class ThemeRuntime {
  private currentMode: ThemeMode = "system";
  private currentBrand: BrandConfig | null = null;
  private listeners = new Set<(mode: ThemeMode) => void>();
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.mediaQuery.addEventListener("change", () => {
        if (this.currentMode === "system") {
          this.applyTheme(this.resolveMode());
        }
      });
    }
  }

  /** Set theme mode */
  setMode(mode: ThemeMode): void {
    this.currentMode = mode;
    this.applyTheme(this.resolveMode());
    this.listeners.forEach((fn) => fn(mode));
  }

  /** Get current resolved mode (light or dark) */
  getResolvedMode(): "light" | "dark" {
    return this.resolveMode();
  }

  /** Set brand for multi-brand theming */
  setBrand(brand: BrandConfig): void {
    this.currentBrand = brand;
    this.applyBrandTokens(brand);
  }

  /** Subscribe to theme changes */
  onModeChange(listener: (mode: ThemeMode) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Get current semantic tokens for the resolved theme */
  getSemanticTokens(): (typeof colorTokens)["light"] | (typeof colorTokens)["dark"] {
    return colorTokens[this.resolveMode()];
  }

  private resolveMode(): "light" | "dark" {
    if (this.currentMode === "system") {
      return this.mediaQuery?.matches ? "dark" : "light";
    }
    return this.currentMode as "light" | "dark";
  }

  private applyTheme(mode: ColorTheme): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);

    const tokens = colorTokens[mode];
    this.applyTokensToCSS(tokens, "fos");
  }

  private applyBrandTokens(brand: BrandConfig): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-brand", brand.id);

    for (const [key, value] of Object.entries(brand.tokens)) {
      root.style.setProperty(`--fos-brand-${key}`, value);
    }
  }

  private applyTokensToCSS(obj: Record<string, unknown>, prefix: string): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const flatten = (o: Record<string, unknown>, p: string): void => {
      for (const [key, value] of Object.entries(o)) {
        const prop = `--${p}-${key}`;
        if (typeof value === "string") {
          root.style.setProperty(prop, value);
        } else if (typeof value === "object" && value !== null) {
          flatten(value as Record<string, unknown>, `${p}-${key}`);
        }
      }
    };

    flatten(obj, prefix);
  }
}

export function createThemeRuntime(): ThemeRuntime {
  return new ThemeRuntime();
}
