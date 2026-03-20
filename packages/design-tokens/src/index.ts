// ============================================================================
// FrontendOS Design Tokens
// Tokens → Foundations → Primitives → Components → Patterns → Templates
// ============================================================================

// ---- Color Primitives ----
export const colorPrimitives = {
  // Neutral
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#030712",
  },
  // Primary — Electric Blue
  blue: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },
  // Accent — Violet
  violet: {
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6",
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
    950: "#2E1065",
  },
  // Success
  green: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
    950: "#052E16",
  },
  // Warning
  amber: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
    950: "#451A03",
  },
  // Error
  red: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
    950: "#450A0A",
  },
} as const;

// ---- Semantic Color Tokens ----
export const colorTokens = {
  light: {
    bg: {
      primary: colorPrimitives.white,
      secondary: colorPrimitives.gray[50],
      tertiary: colorPrimitives.gray[100],
      inverse: colorPrimitives.gray[900],
      brand: colorPrimitives.blue[600],
      accent: colorPrimitives.violet[600],
    },
    fg: {
      primary: colorPrimitives.gray[900],
      secondary: colorPrimitives.gray[600],
      tertiary: colorPrimitives.gray[400],
      inverse: colorPrimitives.white,
      brand: colorPrimitives.blue[600],
      accent: colorPrimitives.violet[600],
      link: colorPrimitives.blue[600],
    },
    border: {
      primary: colorPrimitives.gray[200],
      secondary: colorPrimitives.gray[100],
      focus: colorPrimitives.blue[500],
      error: colorPrimitives.red[500],
    },
    status: {
      success: colorPrimitives.green[600],
      warning: colorPrimitives.amber[500],
      error: colorPrimitives.red[600],
      info: colorPrimitives.blue[600],
    },
  },
  dark: {
    bg: {
      primary: colorPrimitives.gray[950],
      secondary: colorPrimitives.gray[900],
      tertiary: colorPrimitives.gray[800],
      inverse: colorPrimitives.gray[50],
      brand: colorPrimitives.blue[500],
      accent: colorPrimitives.violet[500],
    },
    fg: {
      primary: colorPrimitives.gray[50],
      secondary: colorPrimitives.gray[400],
      tertiary: colorPrimitives.gray[500],
      inverse: colorPrimitives.gray[900],
      brand: colorPrimitives.blue[400],
      accent: colorPrimitives.violet[400],
      link: colorPrimitives.blue[400],
    },
    border: {
      primary: colorPrimitives.gray[700],
      secondary: colorPrimitives.gray[800],
      focus: colorPrimitives.blue[400],
      error: colorPrimitives.red[400],
    },
    status: {
      success: colorPrimitives.green[400],
      warning: colorPrimitives.amber[400],
      error: colorPrimitives.red[400],
      info: colorPrimitives.blue[400],
    },
  },
} as const;

// ---- Typography ----
export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Consolas, monospace',
    display: '"Cal Sans", Inter, sans-serif',
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// ---- Spacing (4px grid) ----
export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
} as const;

// ---- Border Radius ----
export const radius = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

// ---- Shadows ----
export const shadows = {
  sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
  md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
  "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
  inner: "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
  none: "none",
} as const;

// ---- Z-Index ----
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
  devtools: 9000,
} as const;

// ---- Breakpoints ----
export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ---- Motion / Animation ----
export const motion = {
  duration: {
    instant: "50ms",
    faster: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
    slowest: "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

// ---- Combined Token Export ----
export const tokens = {
  color: colorPrimitives,
  semantic: colorTokens,
  typography,
  spacing,
  radius,
  shadows,
  zIndex,
  breakpoints,
  motion,
} as const;

export type DesignTokens = typeof tokens;
export type ColorTheme = keyof typeof colorTokens;
