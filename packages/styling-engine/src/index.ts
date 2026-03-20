// ============================================================================
// FrontendOS Styling Engine — Universal Styling Runtime
// Switches styling strategies per micro-frontend, enforces token consistency
// ============================================================================

export { ThemeRuntime, createThemeRuntime } from "./theme-runtime";
export { StyleOrchestrator } from "./orchestrator";
export { FluidTypography } from "./fluid-typography";
export type {
  StylingStrategy,
  ThemeConfig,
  ThemeMode,
  BrandConfig,
  StyleContext,
} from "./types";
