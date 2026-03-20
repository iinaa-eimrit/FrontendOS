// ============================================================================
// Plugin System Types
// ============================================================================

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license?: string;
  main: string;
  permissions: PluginPermission[];
  hooks: string[];
  dependencies?: Record<string, string>;
  zones?: string[];
  icon?: string;
}

export type PluginPermission =
  | "state:read"
  | "state:write"
  | "dom:read"
  | "dom:write"
  | "network:fetch"
  | "storage:read"
  | "storage:write"
  | "theme:read"
  | "theme:write";

export type PluginState = "installed" | "active" | "disabled" | "error";

export interface Plugin {
  manifest: PluginManifest;
  state: PluginState;
  activate: (context: PluginContext) => Promise<void> | void;
  deactivate?: () => Promise<void> | void;
}

export interface PluginContext {
  pluginId: string;
  /** Emit an event to the plugin system */
  emit: (event: string, data?: unknown) => void;
  /** Subscribe to plugin system events */
  on: (event: string, handler: (data: unknown) => void) => () => void;
  /** Get a value from shared state (requires state:read) */
  getState: (key: string) => unknown;
  /** Set a value in shared state (requires state:write) */
  setState: (key: string, value: unknown) => void;
  /** Register a UI contribution */
  registerUI: (slot: string, component: unknown) => void;
  /** Log a message */
  log: (level: "info" | "warn" | "error", message: string) => void;
}

export type PluginHook =
  | "onInit"
  | "onRouteChange"
  | "onZoneMount"
  | "onZoneUnmount"
  | "onStateChange"
  | "onThemeChange"
  | "onRender"
  | "onError";

export interface MarketplaceEntry {
  id: string;
  manifest: PluginManifest;
  downloads: number;
  rating: number;
  verified: boolean;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
}
