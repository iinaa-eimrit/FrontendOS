// ============================================================================
// Plugin Sandbox — Isolated execution environment for plugins
// ============================================================================

import type { PluginPermission } from "./types";

interface SandboxConfig {
  permissions: PluginPermission[];
  timeout?: number;
}

export class PluginSandbox {
  private permissions: Set<PluginPermission>;
  private timeout: number;

  constructor(config: SandboxConfig) {
    this.permissions = new Set(config.permissions);
    this.timeout = config.timeout ?? 5000;
  }

  /** Create a sandboxed proxy for the fetch API */
  createFetchProxy(): typeof fetch | undefined {
    if (!this.permissions.has("network:fetch")) return undefined;

    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(input, {
          ...init,
          signal: controller.signal,
        });
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    };
  }

  /** Create a sandboxed proxy for localStorage */
  createStorageProxy(pluginId: string): Storage | undefined {
    if (!this.permissions.has("storage:read") && !this.permissions.has("storage:write")) {
      return undefined;
    }

    const prefix = `plugin:${pluginId}:`;
    const canRead = this.permissions.has("storage:read");
    const canWrite = this.permissions.has("storage:write");

    return {
      get length() {
        if (!canRead) return 0;
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
          if (localStorage.key(i)?.startsWith(prefix)) count++;
        }
        return count;
      },
      key(index: number) {
        if (!canRead) return null;
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) {
            if (count === index) return key.slice(prefix.length);
            count++;
          }
        }
        return null;
      },
      getItem(key: string) {
        if (!canRead) return null;
        return localStorage.getItem(prefix + key);
      },
      setItem(key: string, value: string) {
        if (!canWrite) throw new Error("Storage write not permitted");
        localStorage.setItem(prefix + key, value);
      },
      removeItem(key: string) {
        if (!canWrite) throw new Error("Storage write not permitted");
        localStorage.removeItem(prefix + key);
      },
      clear() {
        if (!canWrite) throw new Error("Storage write not permitted");
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) keysToRemove.push(key);
        }
        for (const key of keysToRemove) localStorage.removeItem(key);
      },
    };
  }

  /** Create a sandboxed DOM proxy */
  createDOMProxy(container: HTMLElement):
    | {
        querySelector: typeof container.querySelector;
        querySelectorAll: typeof container.querySelectorAll;
        createElement: typeof document.createElement;
        appendChild: typeof container.appendChild;
      }
    | undefined {
    if (!this.permissions.has("dom:read") && !this.permissions.has("dom:write")) {
      return undefined;
    }

    const canWrite = this.permissions.has("dom:write");

    return {
      querySelector: container.querySelector.bind(container),
      querySelectorAll: container.querySelectorAll.bind(container),
      createElement: canWrite
        ? document.createElement.bind(document)
        : () => {
            throw new Error("DOM write not permitted");
          },
      appendChild: canWrite
        ? container.appendChild.bind(container)
        : () => {
            throw new Error("DOM write not permitted");
          },
    };
  }

  /** Check if a permission is granted */
  hasPermission(permission: PluginPermission): boolean {
    return this.permissions.has(permission);
  }
}
