// ============================================================================
// State Mesh Types
// ============================================================================

export interface StateMeshConfig {
  /** Unique mesh identifier */
  id: string;
  /** Enable cross-tab synchronization via BroadcastChannel */
  crossTab?: boolean;
  /** Enable devtools integration */
  devtools?: boolean;
  /** Maximum event history for time-travel debugging */
  maxHistory?: number;
}

export interface StateSlice<T = unknown> {
  /** Slice identifier */
  id: string;
  /** Current value */
  value: T;
  /** Owning framework zone */
  zone: string;
  /** State category */
  category: "server-cache" | "ui-state" | "workflow" | "url" | "form";
  /** Last updated timestamp */
  updatedAt: number;
  /** Version for optimistic updates / conflict resolution */
  version: number;
}

export interface StateEvent<T = unknown> {
  type: string;
  payload: T;
  source: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}

export interface StateSubscription {
  unsubscribe: () => void;
}

export interface StateMeshSnapshot {
  meshId: string;
  timestamp: number;
  slices: Record<string, StateSlice>;
  eventLog: StateEvent[];
}
