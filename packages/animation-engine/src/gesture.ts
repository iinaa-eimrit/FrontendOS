// ============================================================================
// Gesture Engine — Touch & pointer gesture recognition
// ============================================================================

import type { GestureConfig, GestureState } from "./types";

type GestureHandler = (state: GestureState) => void;

export class GestureEngine {
  private activeGestures = new Map<string, () => void>();
  private idCounter = 0;

  /** Bind a gesture to an element */
  bind(element: HTMLElement, config: GestureConfig, handler: GestureHandler): string {
    const id = `gesture_${++this.idCounter}`;

    switch (config.type) {
      case "drag":
        this.bindDrag(id, element, config, handler);
        break;
      case "swipe":
        this.bindSwipe(id, element, config, handler);
        break;
      case "hover":
        this.bindHover(id, element, handler);
        break;
      case "press":
        this.bindPress(id, element, config, handler);
        break;
      default:
        break;
    }

    return id;
  }

  /** Unbind a gesture */
  unbind(id: string): void {
    const cleanup = this.activeGestures.get(id);
    if (cleanup) {
      cleanup();
      this.activeGestures.delete(id);
    }
  }

  /** Unbind all gestures */
  destroy(): void {
    for (const cleanup of this.activeGestures.values()) cleanup();
    this.activeGestures.clear();
  }

  private bindDrag(
    id: string,
    element: HTMLElement,
    config: GestureConfig,
    handler: GestureHandler,
  ): void {
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let active = false;

    const onPointerDown = (e: PointerEvent) => {
      active = true;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      element.setPointerCapture(e.pointerId);
      handler({
        active: true,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        velocityX: 0,
        velocityY: 0,
        scale: 1,
        rotation: 0,
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;

      let dx = e.clientX - startX;
      let dy = e.clientY - startY;

      if (config.axis === "x") dy = 0;
      if (config.axis === "y") dx = 0;

      if (config.bounds) {
        dx = Math.max(
          config.bounds.left ?? -Infinity,
          Math.min(config.bounds.right ?? Infinity, dx),
        );
        dy = Math.max(
          config.bounds.top ?? -Infinity,
          Math.min(config.bounds.bottom ?? Infinity, dy),
        );
      }

      const velocityX = e.clientX - lastX;
      const velocityY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      handler({
        active: true,
        x: dx,
        y: dy,
        dx: e.clientX - lastX,
        dy: e.clientY - lastY,
        velocityX,
        velocityY,
        scale: 1,
        rotation: 0,
      });
    };

    const onPointerUp = () => {
      if (!active) return;
      active = false;
      handler({
        active: false,
        x: lastX - startX,
        y: lastY - startY,
        dx: 0,
        dy: 0,
        velocityX: 0,
        velocityY: 0,
        scale: 1,
        rotation: 0,
      });
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);

    this.activeGestures.set(id, () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
    });
  }

  private bindSwipe(
    id: string,
    element: HTMLElement,
    config: GestureConfig,
    handler: GestureHandler,
  ): void {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    const threshold = config.threshold ?? 50;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]!;
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]!;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const elapsed = Date.now() - startTime;

      if (elapsed > 500) return; // too slow for a swipe

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        handler({
          active: false,
          x: dx,
          y: dy,
          dx,
          dy,
          velocityX: dx / elapsed,
          velocityY: dy / elapsed,
          scale: 1,
          rotation: 0,
        });
      }
    };

    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });

    this.activeGestures.set(id, () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
    });
  }

  private bindHover(id: string, element: HTMLElement, handler: GestureHandler): void {
    const base: GestureState = {
      active: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      velocityX: 0,
      velocityY: 0,
      scale: 1,
      rotation: 0,
    };

    const onEnter = (e: PointerEvent) =>
      handler({ ...base, active: true, x: e.clientX, y: e.clientY });
    const onLeave = (e: PointerEvent) =>
      handler({ ...base, active: false, x: e.clientX, y: e.clientY });

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);

    this.activeGestures.set(id, () => {
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
    });
  }

  private bindPress(
    id: string,
    element: HTMLElement,
    config: GestureConfig,
    handler: GestureHandler,
  ): void {
    const threshold = config.threshold ?? 500;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const base: GestureState = {
      active: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      velocityX: 0,
      velocityY: 0,
      scale: 1,
      rotation: 0,
    };

    const onDown = (e: PointerEvent) => {
      timer = setTimeout(() => {
        handler({ ...base, active: true, x: e.clientX, y: e.clientY });
      }, threshold);
    };

    const onUp = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      handler(base);
    };

    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);

    this.activeGestures.set(id, () => {
      if (timer) clearTimeout(timer);
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
    });
  }
}
