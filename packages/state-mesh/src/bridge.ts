// ============================================================================
// State Bridge — Connect different state management libraries to the mesh
// ============================================================================

import type { StateMeshCore } from "./core";
import type { StateSlice, StateSubscription } from "./types";

export interface BridgeConfig {
  /** Bridge identifier */
  id: string;
  /** Source framework zone */
  zone: string;
  /** State category */
  category: StateSlice["category"];
  /** Function to read external state */
  read: () => unknown;
  /** Function to write state to external system */
  write: (value: unknown) => void;
  /** Subscribe to external state changes */
  onExternalChange: (callback: (value: unknown) => void) => () => void;
}

export class StateBridge {
  private bridges = new Map<string, BridgeConfig>();
  private teardowns = new Map<string, (() => void)[]>();

  constructor(private readonly mesh: StateMeshCore) {}

  /** Connect an external state source to the mesh */
  connect(config: BridgeConfig): void {
    const { id, zone, category, read, write, onExternalChange } = config;

    this.bridges.set(id, config);
    this.teardowns.set(id, []);

    // Register slice in mesh with current external value
    this.mesh.register(id, read(), zone, category);

    // External → Mesh: when external state changes, update mesh
    const unsubExternal = onExternalChange((value) => {
      this.mesh.set(id, value, `bridge:${zone}`);
    });

    // Mesh → External: when mesh state changes, update external
    const meshSub: StateSubscription = this.mesh.subscribe(id, (event) => {
      // Only write back if the change didn't come from this bridge
      if (!(event.source === `bridge:${zone}`)) {
        const payload = event.payload as { next: unknown };
        write(payload.next);
      }
    });

    this.teardowns.get(id)!.push(unsubExternal, meshSub.unsubscribe);
  }

  /** Disconnect a bridge */
  disconnect(id: string): void {
    this.teardowns.get(id)?.forEach((fn) => fn());
    this.teardowns.delete(id);
    this.bridges.delete(id);
  }

  /** Disconnect all bridges */
  disconnectAll(): void {
    for (const id of Array.from(this.bridges.keys())) {
      this.disconnect(id);
    }
  }
}
