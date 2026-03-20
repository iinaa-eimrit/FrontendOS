// ============================================================================
// MSW Handlers — Mock API handlers for testing
// ============================================================================

import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/zones", () => {
    return HttpResponse.json([
      { id: "editor", name: "Editor", status: "active", framework: "react" },
      { id: "analytics", name: "Analytics", status: "active", framework: "vue" },
      { id: "docs", name: "Documentation", status: "active", framework: "svelte" },
      { id: "widgets", name: "Widgets", status: "active", framework: "qwik" },
      { id: "legacy", name: "Legacy", status: "migrating", framework: "angular" },
    ]);
  }),

  http.get("/api/metrics", () => {
    return HttpResponse.json({
      lcp: 1200,
      fid: 45,
      cls: 0.05,
      ttfb: 200,
      activeUsers: 1247,
      sessions: 3891,
    });
  }),

  http.get("/api/analytics/:timeRange", ({ params }) => {
    return HttpResponse.json({
      timeRange: params.timeRange,
      dataPoints: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - i * 3600000,
        value: Math.random() * 100,
      })),
    });
  }),

  http.post("/api/ai/generate", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: "gen_001",
      component: {
        name: "GeneratedComponent",
        code: '<div class="generated">Placeholder</div>',
        framework: body.framework ?? "react",
      },
    });
  }),

  http.get("/api/plugins", () => {
    return HttpResponse.json({
      plugins: [],
      total: 0,
    });
  }),
];
