// ============================================================================
// WebSocket Adapter — Real-time bidirectional communication
// ============================================================================

type MessageHandler = (data: unknown) => void;

export class WebSocketAdapter {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<MessageHandler>>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts: number;
  private readonly url: string;

  constructor(url: string, options?: { maxReconnectAttempts?: number }) {
    this.url = url;
    this.maxReconnectAttempts = options?.maxReconnectAttempts ?? 5;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as { type: string; payload: unknown };
          this.handlers.get(message.type)?.forEach((fn) => fn(message.payload));
          this.handlers.get("*")?.forEach((fn) => fn(message));
        } catch {
          // Non-JSON messages
          this.handlers.get("*")?.forEach((fn) => fn(event.data));
        }
      };

      this.ws.onerror = () => reject(new Error("WebSocket connection failed"));

      this.ws.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
          setTimeout(() => this.connect(), delay);
        }
      };
    });
  }

  send(type: string, payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  disconnect(): void {
    this.maxReconnectAttempts; // prevent reconnect
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}
