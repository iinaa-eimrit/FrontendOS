// ============================================================================
// Plugin Marketplace — Browse and install plugins
// ============================================================================

import type { MarketplaceEntry, PluginManifest } from "./types";

export class PluginMarketplace {
  private apiBase: string;
  private cache = new Map<string, MarketplaceEntry[]>();

  constructor(apiBase = "/api/plugins") {
    this.apiBase = apiBase;
  }

  /** Search for plugins */
  async search(
    query: string,
    options?: { tags?: string[]; page?: number; limit?: number },
  ): Promise<{
    results: MarketplaceEntry[];
    total: number;
    page: number;
  }> {
    const params = new URLSearchParams();
    params.set("q", query);
    if (options?.tags?.length) params.set("tags", options.tags.join(","));
    params.set("page", String(options?.page ?? 1));
    params.set("limit", String(options?.limit ?? 20));

    const response = await fetch(`${this.apiBase}/search?${params}`);
    if (!response.ok) throw new Error("Marketplace search failed");
    return response.json();
  }

  /** Get featured plugins */
  async getFeatured(): Promise<MarketplaceEntry[]> {
    if (this.cache.has("featured")) return this.cache.get("featured")!;

    const response = await fetch(`${this.apiBase}/featured`);
    if (!response.ok) throw new Error("Failed to fetch featured plugins");
    const entries: MarketplaceEntry[] = await response.json();
    this.cache.set("featured", entries);
    return entries;
  }

  /** Get a single plugin's details */
  async getPlugin(pluginId: string): Promise<MarketplaceEntry | null> {
    const response = await fetch(`${this.apiBase}/${encodeURIComponent(pluginId)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch plugin details");
    return response.json();
  }

  /** Get a plugin's manifest */
  async getManifest(pluginId: string): Promise<PluginManifest | null> {
    const response = await fetch(`${this.apiBase}/${encodeURIComponent(pluginId)}/manifest`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch plugin manifest");
    return response.json();
  }

  /** Get popular plugins */
  async getPopular(limit = 10): Promise<MarketplaceEntry[]> {
    const response = await fetch(`${this.apiBase}/popular?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch popular plugins");
    return response.json();
  }

  /** Get categories/tags */
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${this.apiBase}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  }

  /** Clear cache */
  clearCache(): void {
    this.cache.clear();
  }
}
