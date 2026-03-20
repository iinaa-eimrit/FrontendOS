import React, { useState, useEffect } from "react";

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: "up" | "down";
}

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  color: string;
}

const initialMetrics: AnalyticsMetric[] = [
  { id: "users", name: "Active Users", value: 24893, change: 12.5, unit: "", trend: "up" },
  { id: "sessions", name: "Sessions", value: 58432, change: 8.3, unit: "", trend: "up" },
  { id: "lcp", name: "LCP", value: 1.2, change: -5.2, unit: "s", trend: "down" },
  { id: "cls", name: "CLS", value: 0.05, change: -2.1, unit: "", trend: "down" },
  { id: "fid", name: "FID", value: 45, change: -8.7, unit: "ms", trend: "down" },
  { id: "ttfb", name: "TTFB", value: 180, change: -3.4, unit: "ms", trend: "down" },
];

const liveMetrics: LiveMetric[] = [
  { id: "rps", name: "Requests/sec", value: 12450, unit: "", color: "#3B82F6" },
  { id: "latency", name: "P99 Latency", value: 23, unit: "ms", color: "#8B5CF6" },
  { id: "errors", name: "Error Rate", value: 0.02, unit: "%", color: "#EF4444" },
  { id: "throughput", name: "Throughput", value: 847, unit: "MB/s", color: "#22C55E" },
  { id: "connections", name: "Active Connections", value: 3284, unit: "", color: "#F59E0B" },
  { id: "cpu", name: "CPU Usage", value: 42, unit: "%", color: "#06B6D4" },
];

const timeRanges = ["1h", "24h", "7d", "30d"] as const;

function isGoodChange(metric: AnalyticsMetric) {
  if (["lcp", "cls", "fid", "ttfb"].includes(metric.id)) return metric.change < 0;
  return metric.change > 0;
}

function formatValue(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

function MetricCard({ metric, large }: { metric: AnalyticsMetric; large?: boolean }) {
  const good = isGoodChange(metric);
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl transition-colors hover:border-gray-700 ${large ? "p-6" : "p-4"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{metric.name}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${good ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
          {metric.change > 0 ? "+" : ""}{metric.change}%
        </span>
      </div>
      <p className={`${large ? "text-3xl" : "text-xl"} font-bold text-gray-100`}>
        {formatValue(metric.value)}<span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
      </p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [live, setLive] = useState(liveMetrics);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLive((prev) =>
        prev.map((m) => ({
          ...m,
          value: +(m.value * (0.97 + Math.random() * 0.06)).toFixed(
            m.unit === "%" || m.unit === "ms" ? 2 : 0,
          ),
        })),
      );
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const userMetrics = initialMetrics.filter((m) => ["users", "sessions"].includes(m.id));
  const webVitals = initialMetrics.filter((m) => ["lcp", "cls", "fid", "ttfb"].includes(m.id));

  return (
    <div className="p-8">
      {/* Header + Time Range */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vue + Pinia · SolidJS · Real-time metrics</p>
        </div>
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${timeRange === range ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {userMetrics.map((m) => <MetricCard key={m.id} metric={m} large />)}
      </div>

      {/* Core Web Vitals */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Core Web Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {webVitals.map((m) => <MetricCard key={m.id} metric={m} />)}
        </div>
      </section>

      {/* Real-Time Metrics */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Real-Time Metrics</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Live · Tick #{tick}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {live.map((metric) => (
            <div key={metric.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{metric.name}</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
              </div>
              <p className="text-3xl font-bold" style={{ color: metric.color }}>
                {metric.value >= 1000 ? `${(metric.value / 1000).toFixed(1)}k` : metric.value}
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </p>
              <div className="mt-3 h-8 bg-gray-800 rounded flex items-end gap-px overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      backgroundColor: metric.color,
                      opacity: 0.3 + (i / 20) * 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart placeholder */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Performance Timeline</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-64 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Chart visualization area — Canvas API / D3</p>
        </div>
      </section>
    </div>
  );
}
