// ============================================================================
// Styling Engine Types
// ============================================================================

export type StylingStrategy =
  | "vanilla-extract"
  | "panda-css"
  | "tailwind"
  | "styled-components"
  | "emotion"
  | "css-modules"
  | "scss"
  | "css-houdini"
  | "vanilla";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  brand: string;
  tokens: Record<string, string>;
  customProperties: Record<string, string>;
}

export interface BrandConfig {
  id: string;
  name: string;
  tokens: Record<string, string>;
  logo?: string;
}

export interface StyleContext {
  zone: string;
  strategy: StylingStrategy;
  theme: ThemeConfig;
  brand: BrandConfig;
}
