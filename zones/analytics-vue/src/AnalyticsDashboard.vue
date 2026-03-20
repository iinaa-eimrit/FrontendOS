<script setup lang="ts">
import { useAnalyticsStore } from "./store";
import MetricCard from "./components/MetricCard.vue";

const store = useAnalyticsStore();
const timeRanges = ["1h", "24h", "7d", "30d"] as const;
</script>

<template>
  <div class="p-8 bg-gray-950 text-gray-50 min-h-full" data-zone="analytics-vue" data-framework="vue">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-100">Analytics Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Vue + Pinia · Real-time metrics</p>
      </div>
      <div class="flex gap-1 bg-gray-900 rounded-lg p-1">
        <button
          v-for="range in timeRanges"
          :key="range"
          :class="[
            'px-3 py-1.5 text-xs rounded-md transition-colors',
            store.timeRange === range
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white',
          ]"
          @click="store.setTimeRange(range)"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <!-- User Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <MetricCard
        v-for="metric in store.userMetrics"
        :key="metric.id"
        :metric="metric"
        size="large"
      />
    </div>

    <!-- Core Web Vitals -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-gray-200">Core Web Vitals</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <h2 class="text-lg font-semibold mb-4 text-gray-200">Performance Timeline</h2>
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 h-64 flex items-center justify-center">
        <p class="text-gray-600 text-sm">Chart visualization area — Canvas API / D3</p>
      </div>
    </section>
  </div>
</template>
