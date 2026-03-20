// ============================================================================
// Plugin Registry — Manages plugin lifecycle
// ============================================================================

import type { Plugin, PluginContext, PluginManifest, PluginState } from "./types";

export class PluginRegistry {
  private plugins = new Map<string, Plugin>();
  private eventHandlers = new Map<string, Set<(data: unknown) => void>>();
  private sharedState = new Map<string, unknown>();
  private uiSlots = new Map<string, Array<{ pluginId: string; component: unknown }>>();

  /** Register a plugin */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.manifest.id)) {
      throw new Error(`Plugin "${plugin.manifest.id}" is already registered`);
    }
    this.plugins.set(plugin.manifest.id, { ...plugin, state: "installed" });
  }

  /** Activate a plugin */
  async activate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found`);
    if (plugin.state === "active") return;

    const context = this.createContext(pluginId, plugin.manifest.permissions);

    try {
      await plugin.activate(context);
      plugin.state = "active";
    } catch (error) {
      plugin.state = "error";
      throw error;
    }
  }

  /** Deactivate a plugin */
  async deactivate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || plugin.state !== "active") return;

    await plugin.deactivate?.();
    plugin.state = "disabled";

    // Clean up event handlers for this plugin
    for (const [, handlers] of this.eventHandlers) {
      // Handlers from this plugin would need to be tracked separately
      // for precise cleanup; simplified here
    }

    // Clean up UI contributions
    for (const [slot, entries] of this.uiSlots) {
      this.uiSlots.set(
        slot,
        entries.filter((e) => e.pluginId !== pluginId),
      );
    }
  }

  /** Get all registered plugins */
  getAll(): Plugin[] {
    return [...this.plugins.values()];
  }

  /** Get a plugin by ID */
  get(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /** Get UI components for a slot */
  getUISlot(slot: string): unknown[] {
    return (this.uiSlots.get(slot) ?? []).map((e) => e.component);
  }

  /** Emit an event to all listeners */
  emit(event: string, data?: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) handler(data);
    }
  }

  private createContext(pluginId: string, permissions: string[]): PluginContext {
    const hasPermission = (perm: string) => permissions.includes(perm);

    return {
      pluginId,

      emit: (event, data) => {
        this.emit(`plugin:${event}`, data);
      },

      on: (event, handler) => {
        const fullEvent = `plugin:${event}`;
        if (!this.eventHandlers.has(fullEvent)) {
          this.eventHandlers.set(fullEvent, new Set());
        }
        this.eventHandlers.get(fullEvent)!.add(handler);
        return () => this.eventHandlers.get(fullEvent)?.delete(handler);
      },

      getState: (key) => {
        if (!hasPermission("state:read")) {
          throw new Error(`Plugin "${pluginId}" lacks state:read permission`);
        }
        return this.sharedState.get(key);
      },

      setState: (key, value) => {
        if (!hasPermission("state:write")) {
          throw new Error(`Plugin "${pluginId}" lacks state:write permission`);
        }
        this.sharedState.set(key, value);
        this.emit("state:change", { key, value, pluginId });
      },

      registerUI: (slot, component) => {
        if (!hasPermission("dom:write")) {
          throw new Error(`Plugin "${pluginId}" lacks dom:write permission`);
        }
        if (!this.uiSlots.has(slot)) {
          this.uiSlots.set(slot, []);
        }
        this.uiSlots.get(slot)!.push({ pluginId, component });
      },

      log: (level, message) => {
        const prefix = `[Plugin:${pluginId}]`;
        switch (level) {
          case "info":
            console.info(prefix, message);
            break;
          case "warn":
            console.warn(prefix, message);
            break;
          case "error":
            console.error(prefix, message);
            break;
        }
      },
    };
  }
}
