// ============================================================================
// Streaming Renderer — Streaming SSR support
// ============================================================================

import type { RenderResult, RenderZone } from "./types";

export class StreamingRenderer {
  /** Create a streaming render result for a zone */
  async *stream(
    zone: RenderZone,
    renderChunk: (chunkId: string) => Promise<string>,
    chunks: string[],
  ): AsyncGenerator<string, void, unknown> {
    const startTime = performance.now();

    // Shell first
    yield `<!-- fos:zone:${zone.id}:start -->`;
    yield `<div data-zone="${zone.id}" data-framework="${zone.framework}" data-strategy="streaming">`;

    // Stream chunks
    for (const chunkId of chunks) {
      const html = await renderChunk(chunkId);
      yield `<div data-chunk="${chunkId}">${html}</div>`;
    }

    yield `</div>`;
    yield `<!-- fos:zone:${zone.id}:end:${(performance.now() - startTime).toFixed(1)}ms -->`;
  }

  /** Collect a streaming render into a full result */
  async collect(
    zone: RenderZone,
    renderChunk: (chunkId: string) => Promise<string>,
    chunks: string[],
  ): Promise<RenderResult> {
    const startTime = performance.now();
    const parts: string[] = [];

    for await (const part of this.stream(zone, renderChunk, chunks)) {
      parts.push(part);
    }

    return {
      html: parts.join(""),
      zone: zone.id,
      strategy: "streaming",
      renderTime: performance.now() - startTime,
    };
  }
}
