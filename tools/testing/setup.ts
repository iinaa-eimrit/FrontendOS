// ============================================================================
// Global Test Setup
// ============================================================================

import { afterEach } from "vitest";

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = "";
  document.head.querySelectorAll("style, link").forEach((el) => el.remove());
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

// Mock requestIdleCallback
Object.defineProperty(window, "requestIdleCallback", {
  writable: true,
  value: (cb: () => void) => setTimeout(cb, 0),
});

Object.defineProperty(window, "cancelIdleCallback", {
  writable: true,
  value: (id: number) => clearTimeout(id),
});
