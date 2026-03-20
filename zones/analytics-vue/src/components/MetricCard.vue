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
      'bg-gray-900 border border-gray-800 rounded-xl transition-colors hover:border-gray-700',
      size === 'large' ? 'p-6' : 'p-4',
    ]"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-gray-500 uppercase tracking-wider">{{ metric.name }}</span>
      <span
        :class="[
          'text-xs px-1.5 py-0.5 rounded',
          isPositiveChange(metric)
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400',
        ]"
      >
        {{ metric.change > 0 ? "+" : "" }}{{ metric.change }}%
      </span>
    </div>
    <p :class="[size === 'large' ? 'text-3xl' : 'text-xl', 'font-bold text-gray-100']">
      {{ formatValue(metric) }}<span class="text-sm text-gray-500 ml-1">{{ metric.unit }}</span>
    </p>
  </div>
</template>
