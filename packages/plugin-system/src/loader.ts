// ============================================================================
// Plugin Loader — Load plugins from URLs or manifests
// ============================================================================

import type { Plugin, PluginManifest } from "./types";

export class PluginLoader {
  private cache = new Map<string, Plugin>();

  /** Load a plugin from a manifest + module */
  async loadFromManifest(manifest: PluginManifest, module: any): Promise<Plugin> {
    if (this.cache.has(manifest.id)) {
      return this.cache.get(manifest.id)!;
    }

    this.validateManifest(manifest);

    const plugin: Plugin = {
      manifest,
      state: "installed",
      activate: module.activate ?? (() => {}),
      deactivate: module.deactivate,
    };

    this.cache.set(manifest.id, plugin);
    return plugin;
  }

  /** Load a plugin from a URL */
  async loadFromURL(manifestUrl: string): Promise<Plugin> {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(`Failed to load plugin manifest from ${manifestUrl}`);
    }

    const manifest: PluginManifest = await response.json();
    this.validateManifest(manifest);

    // Resolve the module URL relative to the manifest URL
    const baseUrl = new URL(manifestUrl);
    const moduleUrl = new URL(manifest.main, baseUrl).href;

    const module = await import(/* @vite-ignore */ moduleUrl);

    return this.loadFromManifest(manifest, module);
  }

  /** Check if a plugin is loaded */
  isLoaded(pluginId: string): boolean {
    return this.cache.has(pluginId);
  }

  /** Clear the loader cache */
  clearCache(): void {
    this.cache.clear();
  }

  private validateManifest(manifest: PluginManifest): void {
    if (!manifest.id) throw new Error("Plugin manifest missing 'id'");
    if (!manifest.name) throw new Error("Plugin manifest missing 'name'");
    if (!manifest.version) throw new Error("Plugin manifest missing 'version'");
    if (!manifest.main) throw new Error("Plugin manifest missing 'main'");

    // Validate version format
    if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
      throw new Error(`Invalid version format: ${manifest.version}`);
    }

    // Validate permissions
    const validPermissions = [
      "state:read",
      "state:write",
      "dom:read",
      "dom:write",
      "network:fetch",
      "storage:read",
      "storage:write",
      "theme:read",
      "theme:write",
    ];

    for (const perm of manifest.permissions) {
      if (!validPermissions.includes(perm)) {
        throw new Error(`Unknown permission: ${perm}`);
      }
    }
  }
}
