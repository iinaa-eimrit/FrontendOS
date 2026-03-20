// ============================================================================
// REST Adapter
// ============================================================================

import type { AdapterConfig, DataResponse, RequestConfig } from "../types";

export class RestAdapter {
  private config: AdapterConfig;

  constructor(config: AdapterConfig) {
    this.config = config;
  }

  async request<T>(reqConfig: RequestConfig): Promise<DataResponse<T>> {
    const start = performance.now();
    const url = new URL(reqConfig.url, this.config.baseUrl);

    if (reqConfig.params) {
      for (const [key, value] of Object.entries(reqConfig.params)) {
        url.searchParams.set(key, value);
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...this.config.defaultHeaders,
      ...reqConfig.headers,
    };

    const response = await fetch(url.toString(), {
      method: reqConfig.method ?? "GET",
      headers,
      body: reqConfig.body ? JSON.stringify(reqConfig.body) : undefined,
      signal: reqConfig.signal,
    });

    const data = (await response.json()) as T;
    const end = performance.now();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      data,
      status: response.status,
      headers: responseHeaders,
      protocol: "rest",
      cached: false,
      timing: { start, end, duration: end - start },
    };
  }

  async get<T>(url: string, config?: Partial<RequestConfig>): Promise<DataResponse<T>> {
    return this.request<T>({ url, method: "GET", ...config });
  }

  async post<T>(url: string, body: unknown, config?: Partial<RequestConfig>): Promise<DataResponse<T>> {
    return this.request<T>({ url, method: "POST", body, ...config });
  }

  async put<T>(url: string, body: unknown, config?: Partial<RequestConfig>): Promise<DataResponse<T>> {
    return this.request<T>({ url, method: "PUT", body, ...config });
  }

  async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<DataResponse<T>> {
    return this.request<T>({ url, method: "DELETE", ...config });
  }
}
