# FrontendOS

> A production-grade frontend engineering operating system — Figma + Notion + Vercel + Framer + Webflow + Datadog + Chrome DevTools, unified in one platform.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Astro Shell (Host)                       │
│  ┌──────────┬──────────┬──────────┬──────────┬────────────────┐ │
│  │  React   │   Vue    │  Svelte  │  Solid   │    Angular     │ │
│  │  Editor  │Analytics │   Docs   │ Realtime │    Legacy      │ │
│  │  Zone    │  Zone    │   Zone   │   Zone   │    Zone        │ │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴───────┬───────┘ │
│       │          │          │          │             │         │
│  ┌────┴──────────┴──────────┴──────────┴─────────────┴───────┐ │
│  │                    State Mesh (Cross-Zone)                 │ │
│  │          BroadcastChannel · Event Log · DevTools           │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌───────────┬───────────┬────────────┬──────────┬───────────┐ │
│  │ Rendering │  Styling  │    Data    │Animation │   A11y    │ │
│  │  Engine   │  Engine   │   Layer    │  Engine  │  System   │ │
│  └───────────┴───────────┴────────────┴──────────┴───────────┘ │
│  ┌───────────┬───────────┬────────────┬──────────────────────┐ │
│  │   AI UI   │  Perf     │  Plugin    │   Design Tokens      │ │
│  │  Builder  │  Engine   │  System    │                      │ │
│  └───────────┴───────────┴────────────┴──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Prerequisites: Node.js >= 20, pnpm >= 9
pnpm install
pnpm turbo dev
```

## Monorepo Structure

```
FrontendOS/
├── apps/
│   └── shell/                # Astro host application
├── packages/
│   ├── ts-config/            # Shared TypeScript configs
│   ├── eslint-config/        # Shared ESLint configs
│   ├── design-tokens/        # Design token system
│   ├── state-mesh/           # Cross-framework state coordinator
│   ├── rendering-engine/     # Hybrid rendering orchestrator
│   ├── styling-engine/       # Theme runtime & fluid typography
│   ├── data-layer/           # Unified data adapters (REST, GraphQL, WS, SSE, Offline)
│   ├── animation-engine/     # Physics-based animations & gestures
│   ├── accessibility/        # Semantic analysis, ARIA, focus management
│   ├── performance/          # Web Vitals, memory monitoring, budgets
│   ├── ai-ui/                # AI-powered component generation
│   └── plugin-system/        # Plugin registry, loader, sandbox, marketplace
├── zones/
│   ├── editor/               # React 18 — Visual editor (Zustand + Framer Motion)
│   ├── analytics-vue/        # Vue 3 — Analytics dashboard (Pinia)
│   ├── docs/                 # Svelte 4 — Documentation viewer
│   ├── analytics-solid/      # SolidJS — Real-time metrics
│   ├── widgets/              # Qwik — Embeddable widgets (resumable)
│   └── legacy/               # Angular 17 — Legacy dashboard migration
├── tools/
│   └── testing/              # Test setup, MSW handlers
├── tests/
│   └── e2e/                  # Playwright E2E tests
└── .github/
    └── workflows/            # CI/CD pipeline
```

## Core Packages

### State Mesh (`@frontendos/state-mesh`)
Cross-framework state coordinator using `BroadcastChannel` for cross-tab sync, with middleware support (validate/transform), event logging, and time-travel debugging.

### Rendering Engine (`@frontendos/rendering-engine`)
Manages 11 rendering strategies per zone: CSR, SSR, SSG, ISR, Streaming SSR, React Server Components, Islands Architecture, Resumable, Edge SSR, Partial Hydration, Progressive Hydration. Includes adaptive rendering that auto-adjusts strategy based on performance metrics.

### Styling Engine (`@frontendos/styling-engine`)
Theme runtime with light/dark/system mode detection, CSS custom property injection, fluid typography with `clamp()`, and per-zone strategy orchestration.

### Data Layer (`@frontendos/data-layer`)
Unified data access across 6 protocols:
- **REST** — Full CRUD with headers/auth
- **GraphQL** — Query & mutation support
- **WebSocket** — Auto-reconnect with exponential backoff
- **SSE** — Server-Sent Events with named event routing
- **Offline** — IndexedDB persistence
- **Orchestrator** — Route requests to the right adapter

### Animation Engine (`@frontendos/animation-engine`)
- **Web Animations API** orchestrator with reduced-motion detection
- **Spring physics** engine with presets (gentle, wobbly, stiff, slow, molasses)
- **Scroll-driven** animations with scrub support
- **Gesture** recognition (drag, swipe, hover, long-press)
- **Transition** manager with built-in presets (fade, slide, scale, cross-fade)

### Accessibility (`@frontendos/accessibility`)
- **Semantic Analyzer** — Audits DOM for WCAG violations (img-alt, button-name, heading-order, link-name, form-label, landmarks)
- **Keyboard Engine** — Global shortcut management with scopes
- **ARIA Manager** — Auto-inject ARIA attributes, manage live regions
- **Focus Trap** — Modal/dialog focus containment
- **Contrast Checker** — WCAG AA/AAA contrast ratio validation with suggestions
- **Screen Reader Announcer** — Programmatic polite/assertive announcements

### Performance (`@frontendos/performance`)
- **Web Vitals Monitor** — LCP, FID, CLS, INP, TTFB, FCP tracking
- **Memory Monitor** — Heap usage tracking with leak detection
- **Bundle Analyzer** — Runtime bundle size analysis
- **Prefetch Engine** — Idle/viewport/hover/intent-based resource prefetching
- **Performance Budget** — Configurable metric thresholds with violation reporting

### AI UI Builder (`@frontendos/ai-ui`)
- **Component Generator** — AI-powered component scaffolding
- **Layout Suggester** — Content-aware layout template recommendation
- **Engine** — Orchestrates generation with variant support

### Plugin System (`@frontendos/plugin-system`)
- **Registry** — Plugin lifecycle management with permission-gated contexts
- **Loader** — Load from manifests or URLs with validation
- **Sandbox** — Isolated execution with scoped storage, network, and DOM access
- **Marketplace** — Browse, search, and install community plugins

## Micro-Frontend Zones

| Zone | Framework | Port | Purpose |
|------|-----------|------|---------|
| Editor | React 18 + Zustand | 3001 | Visual canvas editor with element manipulation |
| Analytics (Vue) | Vue 3 + Pinia | 3002 | Core Web Vitals dashboard with time ranges |
| Docs | Svelte 4 | 3003 | Documentation viewer with section navigation |
| Analytics (Solid) | SolidJS 1.8 | 3004 | Real-time metrics with live sparklines |
| Widgets | Qwik 1.7 | 3005 | Embeddable resumable widgets |
| Legacy | Angular 17 | 3006 | Legacy dashboard with migration tracking |

## Development

```bash
# Run all zones in dev mode
pnpm turbo dev

# Run specific zone
pnpm turbo dev --filter=@frontendos/shell
pnpm turbo dev --filter=editor

# Build all packages
pnpm turbo build

# Type checking
pnpm turbo typecheck

# Lint
pnpm turbo lint

# Unit tests
pnpm turbo test

# E2E tests
npx playwright test

# Generate design tokens
pnpm --filter @frontendos/design-tokens generate
```

## Testing

- **Unit Tests**: Vitest with jsdom environment, V8 coverage
- **E2E Tests**: Playwright across Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Mocking**: MSW (Mock Service Worker) handlers for API mocking
- **Performance**: Lighthouse CI with budgets (performance ≥ 0.8, accessibility ≥ 0.9)

## CI/CD

GitHub Actions pipeline with:
1. **Lint & Format** — ESLint + Prettier
2. **Type Check** — Full TypeScript validation
3. **Unit Tests** — Vitest with coverage
4. **Build** — Turborepo optimized build
5. **E2E Tests** — Playwright matrix (3 browsers)
6. **Lighthouse Audit** — Performance budgets
7. **Preview Deploy** — On pull requests
8. **Production Deploy** — On main branch (after all gates pass)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm |
| Host | Astro 4.15 |
| UI Frameworks | React 18, Vue 3, Svelte 4, SolidJS, Qwik, Angular 17 |
| Build | Vite 5.4, tsup, SWC |
| Styling | Tailwind CSS, CSS Custom Properties |
| State | Zustand, Pinia, NgRx, Jotai, Custom State Mesh |
| TypeScript | 5.5 with strict mode |
| Testing | Vitest, Playwright, MSW |
| CI/CD | GitHub Actions |

## License

Private — All rights reserved.
