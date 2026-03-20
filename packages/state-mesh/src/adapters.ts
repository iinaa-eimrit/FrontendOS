// ============================================================================
// State Adapters — Pre-built bridges for common state management libraries
// ============================================================================

export interface StateAdapter {
  id: string;
  type: "server-cache" | "ui-state" | "workflow" | "url" | "form";
  read: () => unknown;
  write: (value: unknown) => void;
  subscribe: (callback: (value: unknown) => void) => () => void;
}

/**
 * Creates an adapter for server cache state (React Query, SWR, Apollo, etc.)
 * This is a generic adapter — specific library integrations wrap this.
 */
export function createServerCacheAdapter(config: {
  id: string;
  queryKey: string[];
  getCacheData: () => unknown;
  setCacheData: (data: unknown) => void;
  onCacheChange: (callback: (data: unknown) => void) => () => void;
}): StateAdapter {
  return {
    id: config.id,
    type: "server-cache",
    read: config.getCacheData,
    write: config.setCacheData,
    subscribe: config.onCacheChange,
  };
}

/**
 * Creates an adapter for UI state (Zustand, Jotai, signals, etc.)
 */
export function createUIStateAdapter(config: {
  id: string;
  getState: () => unknown;
  setState: (value: unknown) => void;
  onStateChange: (callback: (value: unknown) => void) => () => void;
}): StateAdapter {
  return {
    id: config.id,
    type: "ui-state",
    read: config.getState,
    write: config.setState,
    subscribe: config.onStateChange,
  };
}

/**
 * Creates an adapter for workflow/machine state (XState, etc.)
 */
export function createWorkflowAdapter(config: {
  id: string;
  getContext: () => unknown;
  send: (event: unknown) => void;
  onTransition: (callback: (state: unknown) => void) => () => void;
}): StateAdapter {
  return {
    id: config.id,
    type: "workflow",
    read: config.getContext,
    write: config.send,
    subscribe: config.onTransition,
  };
}
