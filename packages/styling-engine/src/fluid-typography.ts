// ============================================================================
// Fluid Typography — Responsive type scaling engine
// ============================================================================

export class FluidTypography {
  /**
   * Generate a CSS clamp() value for fluid typography
   * @param minSize - Minimum font size in rem
   * @param maxSize - Maximum font size in rem
   * @param minViewport - Minimum viewport width in px (default: 375)
   * @param maxViewport - Maximum viewport width in px (default: 1440)
   */
  static clamp(minSize: number, maxSize: number, minViewport = 375, maxViewport = 1440): string {
    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    const intercept = minSize - slope * minViewport;
    const slopeVw = +(slope * 100).toFixed(4);
    const interceptRem = +intercept.toFixed(4);

    return `clamp(${minSize}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxSize}rem)`;
  }

  /** Generate a full fluid type scale */
  static generateScale(config?: {
    minViewport?: number;
    maxViewport?: number;
  }): Record<string, string> {
    const mv = config?.minViewport ?? 375;
    const xv = config?.maxViewport ?? 1440;

    return {
      xs: FluidTypography.clamp(0.625, 0.75, mv, xv),
      sm: FluidTypography.clamp(0.75, 0.875, mv, xv),
      base: FluidTypography.clamp(0.875, 1, mv, xv),
      lg: FluidTypography.clamp(1, 1.125, mv, xv),
      xl: FluidTypography.clamp(1.125, 1.25, mv, xv),
      "2xl": FluidTypography.clamp(1.25, 1.5, mv, xv),
      "3xl": FluidTypography.clamp(1.5, 1.875, mv, xv),
      "4xl": FluidTypography.clamp(1.875, 2.25, mv, xv),
      "5xl": FluidTypography.clamp(2.25, 3, mv, xv),
      "6xl": FluidTypography.clamp(3, 3.75, mv, xv),
      "7xl": FluidTypography.clamp(3.75, 4.5, mv, xv),
    };
  }

  /** Apply fluid type scale as CSS custom properties */
  static applyToDocument(): void {
    if (typeof document === "undefined") return;
    const scale = FluidTypography.generateScale();
    const root = document.documentElement;
    for (const [key, value] of Object.entries(scale)) {
      root.style.setProperty(`--fos-fluid-${key}`, value);
    }
  }
}
