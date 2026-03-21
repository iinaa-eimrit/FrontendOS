<script setup lang="ts">
import { useAnalyticsStore } from "./store";
import MetricCard from "./components/MetricCard.vue";

const store = useAnalyticsStore();
const timeRanges = ["1h", "24h", "7d", "30d"] as const;
</script>

<template>
  <div
    class="min-h-full bg-gray-950 p-8 text-gray-50"
    data-zone="analytics-vue"
    data-framework="vue"
  >
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-100">Analytics Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Vue + Pinia · Real-time metrics</p>
      </div>
      <div class="flex gap-1 rounded-lg bg-gray-900 p-1">
        <button
          v-for="range in timeRanges"
          :key="range"
          :class="[
            'rounded-md px-3 py-1.5 text-xs transition-colors',
            store.timeRange === range ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white',
          ]"
          @click="store.setTimeRange(range)"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <!-- User Metrics -->
    <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <MetricCard
        v-for="metric in store.userMetrics"
        :key="metric.id"
        :metric="metric"
        size="large"
      />
    </div>

    <!-- Core Web Vitals -->
    <section class="mb-8">
      <h2 class="mb-4 text-lg font-semibold text-gray-200">Core Web Vitals</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          v-for="metric in store.coreWebVitals"
          :key="metric.id"
          :metric="metric"
          size="small"
        />
      </div>
    </section>

    <!-- Chart placeholder -->
    <section>
      <h2 class="mb-4 text-lg font-semibold text-gray-200">Performance Timeline</h2>
      <div
        class="flex h-64 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <p class="text-sm text-gray-600">Chart visualization area — Canvas API / D3</p>
      </div>
    </section>
  </div>
</template>
