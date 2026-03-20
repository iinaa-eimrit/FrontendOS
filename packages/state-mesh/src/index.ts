// ============================================================================
// FrontendOS State Mesh — Distributed State Architecture
// Coordinates server cache, UI state, workflow state across frameworks
// ============================================================================

export { StateMeshCore, createStateMesh } from "./core";
export { createStateNode, type StateNode, type StateNodeConfig } from "./node";
export { StateBridge, type BridgeConfig } from "./bridge";
export {
  createServerCacheAdapter,
  createUIStateAdapter,
  createWorkflowAdapter,
  type StateAdapter,
} from "./adapters";
export { StateMeshDevTools } from "./devtools";
export type {
  StateMeshConfig,
  StateSlice,
  StateEvent,
  StateSubscription,
  StateMeshSnapshot,
} from "./types";
