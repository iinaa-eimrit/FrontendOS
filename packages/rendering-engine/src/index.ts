// ============================================================================
// FrontendOS Rendering Engine — Hybrid Meta Rendering Orchestrator
// Manages multi-framework, multi-strategy rendering across zones
// ============================================================================

export { RenderingOrchestrator, createRenderingOrchestrator } from "./orchestrator";
export { ZoneRegistry, type ZoneConfig } from "./zone-registry";
export { HydrationController, type HydrationStrategy } from "./hydration";
export { StreamingRenderer } from "./streaming";
export type {
  RenderStrategy,
  RenderZone,
  RenderResult,
  FrameworkType,
  RenderingEngineConfig,
} from "./types";
