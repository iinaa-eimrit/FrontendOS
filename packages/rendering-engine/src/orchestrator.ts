// ============================================================================
// Rendering Orchestrator — Central rendering coordinator
// ============================================================================

import type { RenderingEngineConfig, RenderResult, RenderStrategy, RenderZone } from "./types";
import { ZoneRegistry } from "./zone-registry";
import { HydrationController } from "./hydration";

export class RenderingOrchestrator {
  private readonly config: Required<RenderingEngineConfig>;
  private readonly registry: ZoneRegistry;
  private readonly hydration: HydrationController;
  private activeRenders = 0;
  private metrics: Map<string, number[]> = new Map();

  constructor(config: RenderingEngineConfig) {
    this.config = {
      monitoring: true,
      adaptiveRendering: false,
      maxConcurrentRenders: 10,
      ...config,
    };
    this.registry = new ZoneRegistry();
    this.hydration = new HydrationController();
  }

  /** Register a rendering zone */
  registerZone(zone: RenderZone): void {
    this.registry.register(zone);
  }

  /** Resolve the best rendering strategy for a given route */
  resolveStrategy(route: string): { zone: RenderZone; strategy: RenderStrategy } | null {
    const zone = this.registry.matchRoute(route);
    if (!zone) return null;

    let strategy = zone.strategy;

    // Adaptive rendering: adjust based on collected metrics
    if (this.config.adaptiveRendering && zone.fallbackStrategies?.length) {
      const avgRenderTime = this.getAverageRenderTime(zone.id);
      if (avgRenderTime > 3000 && zone.fallbackStrategies[0]) {
        strategy = zone.fallbackStrategies[0];
      }
    }

    return { zone, strategy };
  }

  /** Record a render result for monitoring */
  recordRender(result: RenderResult): void {
    if (!this.config.monitoring) return;

    if (!this.metrics.has(result.zone)) {
      this.metrics.set(result.zone, []);
    }
    const times = this.metrics.get(result.zone)!;
    times.push(result.renderTime);
    // Keep last 100 measurements
    if (times.length > 100) times.shift();
  }

  /** Get the average render time for a zone */
  getAverageRenderTime(zoneId: string): number {
    const times = this.metrics.get(zoneId);
    if (!times?.length) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  /** Get all registered zones */
  getZones(): RenderZone[] {
    return this.registry.listAll();
  }

  /** Get the hydration controller */
  getHydrationController(): HydrationController {
    return this.hydration;
  }

  /** Get rendering metrics for all zones */
  getMetrics(): Record<string, { avgRenderTime: number; renderCount: number }> {
    const result: Record<string, { avgRenderTime: number; renderCount: number }> = {};
    for (const [zoneId, times] of this.metrics) {
      result[zoneId] = {
        avgRenderTime: times.reduce((a, b) => a + b, 0) / times.length,
        renderCount: times.length,
      };
    }
    return result;
  }
}

export function createRenderingOrchestrator(
  config: RenderingEngineConfig,
): RenderingOrchestrator {
  return new RenderingOrchestrator(config);
}
