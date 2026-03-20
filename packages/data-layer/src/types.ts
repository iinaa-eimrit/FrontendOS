// ============================================================================
// Data Layer Types
// ============================================================================

export type DataProtocol = "rest" | "graphql" | "grpc" | "websocket" | "sse" | "offline";

export type CacheStrategy =
  | "no-cache"
  | "cache-first"
  | "network-first"
  | "stale-while-revalidate"
  | "cache-only";

export interface RequestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  timeout?: number;
  cache?: CacheStrategy;
  retries?: number;
  signal?: AbortSignal;
}

export interface DataResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  protocol: DataProtocol;
  cached: boolean;
  timing: {
    start: number;
    end: number;
    duration: number;
  };
}

export interface AdapterConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: CacheStrategy;
}
