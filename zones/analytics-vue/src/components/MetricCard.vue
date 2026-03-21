<script setup lang="ts">
import type { AnalyticsMetric } from "../store";

const props = defineProps<{
  metric: AnalyticsMetric;
  size?: "small" | "large";
}>();

const isPositiveChange = (metric: AnalyticsMetric) => {
  // For performance metrics (lower is better), negative change is good
  if (["lcp", "cls", "fid", "ttfb"].includes(metric.id)) {
    return metric.change < 0;
  }
  return metric.change > 0;
};

const formatValue = (metric: AnalyticsMetric) => {
  if (metric.value >= 1000) {
    return `${(metric.value / 1000).toFixed(1)}k`;
  }
  return metric.value.toString();
};
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-gray-800 bg-gray-900 transition-colors hover:border-gray-700',
      size === 'large' ? 'p-6' : 'p-4',
    ]"
  >
    <div class="mb-2 flex items-center justify-between">
      <span class="text-xs uppercase tracking-wider text-gray-500">{{ metric.name }}</span>
      <span
        :class="[
          'rounded px-1.5 py-0.5 text-xs',
          isPositiveChange(metric)
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400',
        ]"
      >
        {{ metric.change > 0 ? "+" : "" }}{{ metric.change }}%
      </span>
    </div>
    <p :class="[size === 'large' ? 'text-3xl' : 'text-xl', 'font-bold text-gray-100']">
      {{ formatValue(metric) }}<span class="ml-1 text-sm text-gray-500">{{ metric.unit }}</span>
    </p>
  </div>
</template>
