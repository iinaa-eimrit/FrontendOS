// ============================================================================
// SSE Adapter — Server-Sent Events for one-way server push
// ============================================================================

type SSEHandler = (data: unknown) => void;

export class SSEAdapter {
  private source: EventSource | null = null;
  private handlers = new Map<string, Set<SSEHandler>>();

  connect(url: string): void {
    this.source = new EventSource(url);

    this.source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        this.handlers.get("message")?.forEach((fn) => fn(data));
      } catch {
        this.handlers.get("message")?.forEach((fn) => fn(event.data));
      }
    };

    this.source.onerror = () => {
      this.handlers.get("error")?.forEach((fn) => fn(new Error("SSE connection error")));
    };
  }

  on(event: string, handler: SSEHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // For named events, add EventSource listener
    if (this.source && event !== "message" && event !== "error") {
      this.source.addEventListener(event, (e) => {
        try {
          handler(JSON.parse((e as MessageEvent).data));
        } catch {
          handler((e as MessageEvent).data);
        }
      });
    }

    return () => this.handlers.get(event)?.delete(handler);
  }

  disconnect(): void {
    this.source?.close();
    this.source = null;
    this.handlers.clear();
  }
}
