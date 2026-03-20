// ============================================================================
// Animation Engine Types
// ============================================================================

export type EasingFunction =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`;

export interface Keyframe {
  offset: number; // 0–1
  properties: Record<string, string | number>;
  easing?: EasingFunction;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: EasingFunction;
  iterations?: number;
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fill?: "none" | "forwards" | "backwards" | "both";
  keyframes: Keyframe[];
}

export interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
  initialVelocity?: number;
  restThreshold?: number;
  restVelocityThreshold?: number;
}

export interface ScrollTimelineConfig {
  trigger: string; // CSS selector
  start?: string; // e.g. "top bottom"
  end?: string; // e.g. "bottom top"
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

export interface GestureConfig {
  type: "drag" | "pinch" | "rotate" | "swipe" | "hover" | "press";
  threshold?: number;
  axis?: "x" | "y" | "both";
  bounds?: { left?: number; right?: number; top?: number; bottom?: number };
  rubberBand?: boolean;
  rubberBandFactor?: number;
}

export interface Transition {
  id: string;
  from: Record<string, string | number>;
  to: Record<string, string | number>;
  config: AnimationConfig;
}

export type AnimationState = "idle" | "running" | "paused" | "finished";

export interface AnimationInstance {
  id: string;
  state: AnimationState;
  progress: number;
  play: () => void;
  pause: () => void;
  reverse: () => void;
  cancel: () => void;
  finish: () => void;
  onComplete: (callback: () => void) => void;
}

export interface GestureState {
  active: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  velocityX: number;
  velocityY: number;
  scale: number;
  rotation: number;
}
