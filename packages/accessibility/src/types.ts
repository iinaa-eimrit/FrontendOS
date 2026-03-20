// ============================================================================
// Accessibility System Types
// ============================================================================

export type A11ySeverity = "critical" | "serious" | "moderate" | "minor";

export interface A11yIssue {
  id: string;
  severity: A11ySeverity;
  element: string; // CSS selector or description
  rule: string;
  message: string;
  wcagCriteria: string;
  fix?: string;
}

export interface A11yReport {
  timestamp: number;
  url: string;
  issues: A11yIssue[];
  score: number; // 0–100
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}

export interface FocusTrapConfig {
  container: HTMLElement;
  initialFocus?: HTMLElement | string;
  returnFocusOnDeactivate?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  allowOutsideClick?: boolean;
}

export interface KeyBinding {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: string;
  handler: (event: KeyboardEvent) => void;
  description?: string;
  scope?: string;
}

export interface AriaLiveRegion {
  id: string;
  politeness: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: string;
}

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  aaSmall: boolean;
  aaLarge: boolean;
  aaaSmall: boolean;
  aaaLarge: boolean;
}
