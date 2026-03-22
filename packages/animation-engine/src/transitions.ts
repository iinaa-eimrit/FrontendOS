// ============================================================================
// Transition Manager — Named transitions and route-based animations
// ============================================================================

import type { AnimationConfig, EasingFunction, Transition } from "./types";

const DEFAULT_DURATION = 300;
const DEFAULT_EASING: EasingFunction = "ease-in-out";

export class TransitionManager {
  private transitions = new Map<string, Transition>();

  /** Register a named transition */
  register(name: string, transition: Transition): void {
    this.transitions.set(name, transition);
  }

  /** Run a named transition on an element */
  run(name: string, element: HTMLElement): Animation | null {
    const transition = this.transitions.get(name);
    if (!transition) return null;

    const keyframes = [transition.from, transition.to] as globalThis.Keyframe[];

    return element.animate(keyframes, {
      duration: transition.config.duration,
      easing: transition.config.easing ?? DEFAULT_EASING,
      fill: transition.config.fill ?? "forwards",
    });
  }

  /** Fade in an element */
  fadeIn(element: HTMLElement, duration = DEFAULT_DURATION): Animation {
    return element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      easing: DEFAULT_EASING,
      fill: "forwards",
    });
  }

  /** Fade out an element */
  fadeOut(element: HTMLElement, duration = DEFAULT_DURATION): Animation {
    return element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration,
      easing: DEFAULT_EASING,
      fill: "forwards",
    });
  }

  /** Slide element from a direction */
  slideIn(
    element: HTMLElement,
    direction: "left" | "right" | "top" | "bottom" = "left",
    duration = DEFAULT_DURATION,
  ): Animation {
    const offsets: Record<string, globalThis.Keyframe> = {
      left: { transform: "translateX(-100%)" },
      right: { transform: "translateX(100%)" },
      top: { transform: "translateY(-100%)" },
      bottom: { transform: "translateY(100%)" },
    };

    return element.animate([offsets[direction]!, { transform: "translate(0)" }], {
      duration,
      easing: DEFAULT_EASING,
      fill: "forwards",
    });
  }

  /** Scale element in */
  scaleIn(element: HTMLElement, duration = DEFAULT_DURATION): Animation {
    return element.animate(
      [
        { transform: "scale(0.8)", opacity: 0 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration, easing: DEFAULT_EASING, fill: "forwards" },
    );
  }

  /** Cross-fade between two elements */
  crossFade(
    outElement: HTMLElement,
    inElement: HTMLElement,
    duration = DEFAULT_DURATION,
  ): Promise<void> {
    return new Promise((resolve) => {
      const fadeOutAnim = this.fadeOut(outElement, duration);
      this.fadeIn(inElement, duration);
      fadeOutAnim.addEventListener("finish", () => resolve());
    });
  }

  /** Built-in page transition configs */
  static presets: Record<string, AnimationConfig> = {
    fade: {
      duration: 300,
      easing: "ease-in-out",
      fill: "both",
      keyframes: [
        { offset: 0, properties: { opacity: 0 } },
        { offset: 1, properties: { opacity: 1 } },
      ],
    },
    slideLeft: {
      duration: 400,
      easing: "ease-out",
      fill: "both",
      keyframes: [
        { offset: 0, properties: { transform: "translateX(100%)" as unknown as number } },
        { offset: 1, properties: { transform: "translateX(0)" as unknown as number } },
      ],
    },
    scaleUp: {
      duration: 350,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      fill: "both",
      keyframes: [
        { offset: 0, properties: { opacity: 0, transform: "scale(0.9)" as unknown as number } },
        { offset: 1, properties: { opacity: 1, transform: "scale(1)" as unknown as number } },
      ],
    },
  };
}
