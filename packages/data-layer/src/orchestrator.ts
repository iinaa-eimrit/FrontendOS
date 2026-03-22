// ============================================================================
// Data Orchestrator — Manages multiple data adapters and routing
// ============================================================================

import type { DataProtocol, DataResponse, RequestConfig } from "./types";
import { RestAdapter } from "./adapters/rest";
import { GraphQLAdapter } from "./adapters/graphql";

interface OrchestratorConfig {
  rest?: { baseUrl: string; headers?: Record<string, string> };
  graphql?: { baseUrl: string; headers?: Record<string, string> };
}

export class DataOrchestrator {
  private readonly rest: RestAdapter | null;
  private readonly graphql: GraphQLAdapter | null;

  constructor(config: OrchestratorConfig) {
    this.rest = config.rest ? new RestAdapter(config.rest) : null;
    this.graphql = config.graphql ? new GraphQLAdapter(config.graphql) : null;
  }

  /** Execute a REST request */
  async restRequest<T>(config: RequestConfig): Promise<DataResponse<T>> {
    if (!this.rest) throw new Error("REST adapter not configured");
    return this.rest.request<T>(config);
  }

  /** Execute a GraphQL query */
  async graphqlQuery<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<DataResponse<T>> {
    if (!this.graphql) throw new Error("GraphQL adapter not configured");
    return this.graphql.query<T>({ query, variables });
  }

  /** Get available protocols */
  getAvailableProtocols(): DataProtocol[] {
    const protocols: DataProtocol[] = [];
    if (this.rest) protocols.push("rest");
    if (this.graphql) protocols.push("graphql");
    return protocols;
  }
}

export function createDataOrchestrator(config: OrchestratorConfig): DataOrchestrator {
  return new DataOrchestrator(config);
}
