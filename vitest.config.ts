/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "packages/*/src/**/*.{test,spec}.{ts,tsx}",
      "zones/*/src/**/*.{test,spec}.{ts,tsx}",
      "apps/*/src/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",
      include: [
        "packages/*/src/**/*.{ts,tsx}",
        "zones/*/src/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/index.ts",
        "**/types.ts",
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
    setupFiles: ["./tools/testing/setup.ts"],
    typecheck: {
      enabled: true,
    },
  },
});
