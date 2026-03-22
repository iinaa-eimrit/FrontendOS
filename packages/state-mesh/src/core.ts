// ============================================================================
// State Mesh Core — Central coordinator for distributed state
// ============================================================================

import type {
  StateMeshConfig,
  StateSlice,
  StateEvent,
  StateSubscription,
  StateMeshSnapshot,
} from "./types";

type Listener = (event: StateEvent) => void;

export class StateMeshCore {
  private readonly config: Required<StateMeshConfig>;
  private slices = new Map<string, StateSlice>();
  private listeners = new Map<string, Set<Listener>>();
  private globalListeners = new Set<Listener>();
  private eventLog: StateEvent[] = [];
  private channel: BroadcastChannel | null = null;

  constructor(config: StateMeshConfig) {
    this.config = {
      crossTab: false,
      devtools: false,
      maxHistory: 1000,
      ...config,
    };

    if (this.config.crossTab && typeof globalThis.BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel(`fos-mesh-${this.config.id}`);
      this.channel.onmessage = (e: MessageEvent) => {
        const event = e.data as StateEvent;
        this.handleRemoteEvent(event);
      };
    }
  }

  /** Register a state slice */
  register<T>(id: string, initialValue: T, zone: string, category: StateSlice["category"]): void {
    if (this.slices.has(id)) return;
    this.slices.set(id, {
      id,
      value: initialValue,
      zone,
      category,
      updatedAt: Date.now(),
      version: 0,
    });
  }

  /** Get current value of a slice */
  get<T>(id: string): T | undefined {
    return this.slices.get(id)?.value as T | undefined;
  }

  /** Set value of a slice */
  set<T>(id: string, value: T, source: string): void {
    const slice = this.slices.get(id);
    if (!slice) {
      throw new Error(`[StateMesh] Slice "${id}" not registered`);
    }

    const prevValue = slice.value;
    slice.value = value;
    slice.updatedAt = Date.now();
    slice.version++;

    const event: StateEvent = {
      type: `${id}:update`,
      payload: { prev: prevValue, next: value },
      source,
      timestamp: Date.now(),
    };

    this.emit(id, event);
    this.channel?.postMessage(event);
  }

  /** Subscribe to a specific slice */
  subscribe(sliceId: string, listener: Listener): StateSubscription {
    if (!this.listeners.has(sliceId)) {
      this.listeners.set(sliceId, new Set());
    }
    this.listeners.get(sliceId)!.add(listener);
    return {
      unsubscribe: () => this.listeners.get(sliceId)?.delete(listener),
    };
  }

  /** Subscribe to all events across the mesh */
  subscribeAll(listener: Listener): StateSubscription {
    this.globalListeners.add(listener);
    return {
      unsubscribe: () => this.globalListeners.delete(listener),
    };
  }

  /** Take a snapshot for debugging / time-travel */
  snapshot(): StateMeshSnapshot {
    return {
      meshId: this.config.id,
      timestamp: Date.now(),
      slices: Object.fromEntries(this.slices),
      eventLog: [...this.eventLog],
    };
  }

  /** List all registered slices */
  listSlices(): StateSlice[] {
    return Array.from(this.slices.values());
  }

  /** Destroy mesh and clean up resources */
  destroy(): void {
    this.slices.clear();
    this.listeners.clear();
    this.globalListeners.clear();
    this.eventLog = [];
    this.channel?.close();
    this.channel = null;
  }

  private emit(sliceId: string, event: StateEvent): void {
    this.eventLog.push(event);
    if (this.eventLog.length > this.config.maxHistory) {
      this.eventLog.shift();
    }

    this.listeners.get(sliceId)?.forEach((fn) => fn(event));
    this.globalListeners.forEach((fn) => fn(event));
  }

  private handleRemoteEvent(event: StateEvent): void {
    // Extract slice ID from event type (format: "sliceId:update")
    const colonIdx = event.type.indexOf(":");
    if (colonIdx === -1) return;
    const sliceId = event.type.substring(0, colonIdx);
    const slice = this.slices.get(sliceId);
    if (!slice) return;

    const payload = event.payload as { next: unknown };
    slice.value = payload.next;
    slice.updatedAt = event.timestamp;
    slice.version++;

    this.emit(sliceId, { ...event, source: `${event.source}:remote` });
  }
}

/** Factory function */
export function createStateMesh(config: StateMeshConfig): StateMeshCore {
  return new StateMeshCore(config);
}
