// ============================================================================
// GraphQL Adapter
// ============================================================================

import type { AdapterConfig, DataResponse } from "../types";

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

export class GraphQLAdapter {
  private config: AdapterConfig;

  constructor(config: AdapterConfig) {
    this.config = config;
  }

  async query<T>(request: GraphQLRequest, signal?: AbortSignal): Promise<DataResponse<T>> {
    const start = performance.now();

    const response = await fetch(this.config.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.defaultHeaders,
      },
      body: JSON.stringify({
        query: request.query,
        variables: request.variables,
        operationName: request.operationName,
      }),
      signal,
    });

    const json = (await response.json()) as { data: T; errors?: unknown[] };
    const end = performance.now();

    if (json.errors?.length) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((v, k) => { headers[k] = v; });

    return {
      data: json.data,
      status: response.status,
      headers,
      protocol: "graphql",
      cached: false,
      timing: { start, end, duration: end - start },
    };
  }

  async mutate<T>(request: GraphQLRequest, signal?: AbortSignal): Promise<DataResponse<T>> {
    return this.query<T>(request, signal);
  }
}
