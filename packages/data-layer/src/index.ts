// ============================================================================
// FrontendOS Data Layer — Unified Data Adapter
// REST | GraphQL | gRPC-web | WebSocket | SSE | Offline-first
// ============================================================================

export { RestAdapter } from "./adapters/rest";
export { GraphQLAdapter } from "./adapters/graphql";
export { WebSocketAdapter } from "./adapters/websocket";
export { SSEAdapter } from "./adapters/sse";
export { OfflineAdapter } from "./adapters/offline";
export { DataOrchestrator, createDataOrchestrator } from "./orchestrator";
export { OptimisticManager } from "./optimistic";
export type {
  DataProtocol,
  RequestConfig,
  DataResponse,
  AdapterConfig,
  CacheStrategy,
} from "./types";
