// ============================================================================
// Spring Engine — Physics-based spring animations
// ============================================================================

import type { SpringConfig } from "./types";

const DEFAULT_SPRING: SpringConfig = {
  mass: 1,
  stiffness: 100,
  damping: 10,
  initialVelocity: 0,
  restThreshold: 0.01,
  restVelocityThreshold: 0.01,
};

export class SpringEngine {
  private config: SpringConfig;

  constructor(config: Partial<SpringConfig> = {}) {
    this.config = { ...DEFAULT_SPRING, ...config };
  }

  /** Generate spring values from 0 to 1, calling onUpdate each frame */
  animate(
    onUpdate: (value: number) => void,
    onComplete?: () => void,
  ): () => void {
    const { mass, stiffness, damping, initialVelocity, restThreshold, restVelocityThreshold } =
      this.config;

    let position = 0;
    let velocity = initialVelocity ?? 0;
    let rafId: number | null = null;
    let lastTime: number | null = null;

    const step = (timestamp: number) => {
      if (lastTime === null) {
        lastTime = timestamp;
        rafId = requestAnimationFrame(step);
        return;
      }

      const dt = Math.min((timestamp - lastTime) / 1000, 0.064); // cap at 64ms
      lastTime = timestamp;

      // Spring force: F = -k * (x - 1) - c * v
      const springForce = -stiffness * (position - 1);
      const dampingForce = -damping * velocity;
      const acceleration = (springForce + dampingForce) / mass;

      velocity += acceleration * dt;
      position += velocity * dt;

      onUpdate(position);

      const isAtRest =
        Math.abs(position - 1) < restThreshold! &&
        Math.abs(velocity) < restVelocityThreshold!;

      if (isAtRest) {
        onUpdate(1);
        onComplete?.();
        return;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }

  /** Common spring presets */
  static presets = {
    gentle: new SpringEngine({ mass: 1, stiffness: 120, damping: 14 }),
    wobbly: new SpringEngine({ mass: 1, stiffness: 180, damping: 12 }),
    stiff: new SpringEngine({ mass: 1, stiffness: 300, damping: 20 }),
    slow: new SpringEngine({ mass: 2, stiffness: 120, damping: 20 }),
    molasses: new SpringEngine({ mass: 3, stiffness: 80, damping: 25 }),
  } as const;
}
