// ============================================================================
// Zone Registry — Manages rendering zones and route matching
// ============================================================================

import type { RenderZone } from "./types";

export interface ZoneConfig {
  zones: RenderZone[];
}

export class ZoneRegistry {
  private zones = new Map<string, RenderZone>();

  register(zone: RenderZone): void {
    this.zones.set(zone.id, zone);
  }

  unregister(id: string): void {
    this.zones.delete(id);
  }

  get(id: string): RenderZone | undefined {
    return this.zones.get(id);
  }

  /** Match a route to a zone using route patterns */
  matchRoute(route: string): RenderZone | null {
    // Sort by priority (lower = higher priority), then by specificity
    const sorted = Array.from(this.zones.values()).sort((a, b) => {
      const pA = a.priority ?? 100;
      const pB = b.priority ?? 100;
      if (pA !== pB) return pA - pB;
      // More specific patterns first (longer pattern = more specific)
      return b.routePattern.length - a.routePattern.length;
    });

    for (const zone of sorted) {
      if (this.matchPattern(route, zone.routePattern)) {
        return zone;
      }
    }
    return null;
  }

  listAll(): RenderZone[] {
    return Array.from(this.zones.values());
  }

  private matchPattern(route: string, pattern: string): boolean {
    // Convert route pattern to regex
    // Supports: /path, /path/:param, /path/*, /path/**
    const regexStr = pattern
      .replace(/\*\*/g, ".*")
      .replace(/\*/g, "[^/]*")
      .replace(/:[\w]+/g, "[^/]+");
    const regex = new RegExp(`^${regexStr}$`);
    return regex.test(route);
  }
}
