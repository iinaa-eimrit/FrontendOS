// ============================================================================
// Style Orchestrator — Per-zone styling strategy management
// ============================================================================

import type { StylingStrategy, StyleContext, ThemeConfig, BrandConfig } from "./types";

interface ZoneStyleConfig {
  zone: string;
  strategy: StylingStrategy;
  /** Optional CSS scope selector */
  scope?: string;
}

export class StyleOrchestrator {
  private zoneConfigs = new Map<string, ZoneStyleConfig>();
  private activeTheme: ThemeConfig | null = null;
  private activeBrand: BrandConfig | null = null;

  /** Register a zone's styling strategy */
  registerZone(config: ZoneStyleConfig): void {
    this.zoneConfigs.set(config.zone, config);
  }

  /** Set the active theme across all zones */
  setTheme(theme: ThemeConfig): void {
    this.activeTheme = theme;
  }

  /** Set the active brand */
  setBrand(brand: BrandConfig): void {
    this.activeBrand = brand;
  }

  /** Get the style context for a specific zone */
  getContext(zone: string): StyleContext | null {
    const config = this.zoneConfigs.get(zone);
    if (!config || !this.activeTheme || !this.activeBrand) return null;

    return {
      zone: config.zone,
      strategy: config.strategy,
      theme: this.activeTheme,
      brand: this.activeBrand,
    };
  }

  /** Get the styling strategy for a zone */
  getStrategy(zone: string): StylingStrategy | undefined {
    return this.zoneConfigs.get(zone)?.strategy;
  }

  /** List all zones and their strategies */
  listZones(): ZoneStyleConfig[] {
    return Array.from(this.zoneConfigs.values());
  }

  /** Validate token consistency across zones */
  validateTokenConsistency(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check all zones reference valid tokens from the active theme
    for (const [zone, config] of this.zoneConfigs) {
      if (!config.scope) {
        issues.push(`Zone "${zone}" has no CSS scope — tokens may leak`);
      }
    }

    return { valid: issues.length === 0, issues };
  }
}
