// ============================================================================
// Animation Orchestrator — Manages all active animations
// ============================================================================

import type {
  AnimationConfig,
  AnimationInstance,
  AnimationState,
  Keyframe,
} from "./types";

export class AnimationOrchestrator {
  private instances = new Map<string, ManagedAnimation>();
  private idCounter = 0;
  private prefersReducedMotion = false;

  constructor() {
    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.prefersReducedMotion = mql.matches;
      mql.addEventListener("change", (e) => {
        this.prefersReducedMotion = e.matches;
        if (e.matches) this.cancelAll();
      });
    }
  }

  /** Create and start an animation on an element */
  animate(
    element: HTMLElement,
    config: AnimationConfig,
  ): AnimationInstance {
    if (this.prefersReducedMotion) {
      return this.createNoopInstance();
    }

    const id = `anim_${++this.idCounter}`;
    const wapiKeyframes = config.keyframes.map(this.toWAPIKeyframe);

    const animation = element.animate(wapiKeyframes, {
      duration: config.duration,
      delay: config.delay ?? 0,
      easing: config.easing ?? "ease",
      iterations: config.iterations ?? 1,
      direction: config.direction ?? "normal",
      fill: config.fill ?? "none",
    });

    const managed = new ManagedAnimation(id, animation);
    this.instances.set(id, managed);

    animation.addEventListener("finish", () => {
      this.instances.delete(id);
    });

    return managed;
  }

  /** Pause all running animations */
  pauseAll(): void {
    for (const instance of this.instances.values()) {
      instance.pause();
    }
  }

  /** Resume all paused animations */
  resumeAll(): void {
    for (const instance of this.instances.values()) {
      instance.play();
    }
  }

  /** Cancel all animations */
  cancelAll(): void {
    for (const instance of this.instances.values()) {
      instance.cancel();
    }
    this.instances.clear();
  }

  /** Get count of active animations */
  get activeCount(): number {
    return this.instances.size;
  }

  private toWAPIKeyframe(kf: Keyframe): globalThis.Keyframe {
    return {
      offset: kf.offset,
      easing: kf.easing,
      ...kf.properties,
    } as globalThis.Keyframe;
  }

  private createNoopInstance(): AnimationInstance {
    return {
      id: "noop",
      state: "finished",
      progress: 1,
      play: () => {},
      pause: () => {},
      reverse: () => {},
      cancel: () => {},
      finish: () => {},
      onComplete: (cb) => cb(),
    };
  }
}

class ManagedAnimation implements AnimationInstance {
  private completionCallbacks: Array<() => void> = [];

  constructor(
    public readonly id: string,
    private animation: Animation,
  ) {
    this.animation.addEventListener("finish", () => {
      for (const cb of this.completionCallbacks) cb();
    });
  }

  get state(): AnimationState {
    switch (this.animation.playState) {
      case "running":
        return "running";
      case "paused":
        return "paused";
      case "finished":
        return "finished";
      default:
        return "idle";
    }
  }

  get progress(): number {
    const timing = this.animation.effect?.getComputedTiming();
    return (timing?.progress as number) ?? 0;
  }

  play(): void {
    this.animation.play();
  }

  pause(): void {
    this.animation.pause();
  }

  reverse(): void {
    this.animation.reverse();
  }

  cancel(): void {
    this.animation.cancel();
  }

  finish(): void {
    this.animation.finish();
  }

  onComplete(callback: () => void): void {
    this.completionCallbacks.push(callback);
  }
}
