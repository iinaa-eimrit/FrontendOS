import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export const useAnalyticsStore = defineStore("analytics", () => {
  const metrics = ref<AnalyticsMetric[]>([
    { id: "users", name: "Active Users", value: 24893, change: 12.5, unit: "", trend: "up" },
    { id: "sessions", name: "Sessions", value: 58432, change: 8.3, unit: "", trend: "up" },
    { id: "lcp", name: "LCP", value: 1.2, change: -5.2, unit: "s", trend: "down" },
    { id: "cls", name: "CLS", value: 0.05, change: -2.1, unit: "", trend: "down" },
    { id: "fid", name: "FID", value: 45, change: -8.7, unit: "ms", trend: "down" },
    { id: "ttfb", name: "TTFB", value: 180, change: -3.4, unit: "ms", trend: "down" },
  ]);

  const timeRange = ref<"1h" | "24h" | "7d" | "30d">("24h");
  const isLoading = ref(false);

  const coreWebVitals = computed(() =>
    metrics.value.filter((m) => ["lcp", "cls", "fid", "ttfb"].includes(m.id)),
  );

  const userMetrics = computed(() =>
    metrics.value.filter((m) => ["users", "sessions"].includes(m.id)),
  );

  function setTimeRange(range: typeof timeRange.value) {
    timeRange.value = range;
  }

  return {
    metrics,
    timeRange,
    isLoading,
    coreWebVitals,
    userMetrics,
    setTimeRange,
  };
});
