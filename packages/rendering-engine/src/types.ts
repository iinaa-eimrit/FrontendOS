// ============================================================================
// Rendering Engine Types
// ============================================================================

export type FrameworkType =
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "solid"
  | "qwik"
  | "astro"
  | "web-component"
  | "vanilla";

export type RenderStrategy =
  | "csr" // Client-Side Rendering
  | "ssr" // Server-Side Rendering
  | "ssg" // Static Site Generation
  | "isr" // Incremental Static Regeneration
  | "streaming" // Streaming SSR
  | "rsc" // React Server Components
  | "islands" // Islands Architecture
  | "resumable" // Resumable (Qwik)
  | "edge-ssr" // Edge SSR
  | "partial-hydration" // Partial Hydration
  | "progressive-hydration"; // Progressive Hydration

export interface RenderZone {
  /** Zone identifier */
  id: string;
  /** Display name */
  name: string;
  /** Framework used in this zone */
  framework: FrameworkType;
  /** Primary rendering strategy */
  strategy: RenderStrategy;
  /** Fallback strategies in priority order */
  fallbackStrategies?: RenderStrategy[];
  /** Route pattern for this zone */
  routePattern: string;
  /** Whether this zone is an island (can be independently hydrated) */
  island?: boolean;
  /** Priority for resource loading (lower = higher priority) */
  priority?: number;
  /** Module federation remote entry URL */
  remoteEntry?: string;
  /** Exposed module path */
  exposedModule?: string;
}

export interface RenderResult {
  html: string;
  zone: string;
  strategy: RenderStrategy;
  renderTime: number;
  hydrationData?: unknown;
  headers?: Record<string, string>;
}

export interface RenderingEngineConfig {
  /** Default rendering strategy */
  defaultStrategy: RenderStrategy;
  /** Enable performance monitoring */
  monitoring?: boolean;
  /** Auto-switch strategy based on Core Web Vitals */
  adaptiveRendering?: boolean;
  /** Maximum concurrent renders */
  maxConcurrentRenders?: number;
}
