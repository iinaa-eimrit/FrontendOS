import { createSignal, createEffect, onCleanup, For, type Component } from "solid-js";

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  color: string;
}

export const RealTimeMetrics: Component = () => {
  const [metrics, setMetrics] = createSignal<LiveMetric[]>([
    { id: "rps", name: "Requests/sec", value: 12450, unit: "", color: "#3B82F6" },
    { id: "latency", name: "P99 Latency", value: 23, unit: "ms", color: "#8B5CF6" },
    { id: "errors", name: "Error Rate", value: 0.02, unit: "%", color: "#EF4444" },
    { id: "throughput", name: "Throughput", value: 847, unit: "MB/s", color: "#22C55E" },
    { id: "connections", name: "Active Connections", value: 3284, unit: "", color: "#F59E0B" },
    { id: "cpu", name: "CPU Usage", value: 42, unit: "%", color: "#06B6D4" },
  ]);

  const [tickCount, setTickCount] = createSignal(0);

  // Simulated real-time data stream
  createEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: +(m.value * (0.97 + Math.random() * 0.06)).toFixed(
            m.unit === "%" || m.unit === "ms" ? 2 : 0,
          ),
        })),
      );
      setTickCount((c) => c + 1);
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div
      class="min-h-full bg-gray-950 p-8 text-gray-50"
      data-zone="analytics-solid"
      data-framework="solid"
    >
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-100">Real-Time Analytics</h1>
          <p class="mt-1 text-sm text-gray-500">
            SolidJS · Fine-grained reactivity · Streaming · Tick #{tickCount()}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span class="text-xs text-green-400">Live</span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={metrics()}>
          {(metric) => (
            <div class="rounded-xl border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs uppercase tracking-wider text-gray-500">{metric.name}</span>
                <div class="h-2 w-2 rounded-full" style={{ "background-color": metric.color }} />
              </div>
              <p class="text-3xl font-bold" style={{ color: metric.color }}>
                {typeof metric.value === "number" && metric.value >= 1000
                  ? `${(metric.value / 1000).toFixed(1)}k`
                  : metric.value}
                <span class="ml-1 text-sm text-gray-500">{metric.unit}</span>
              </p>
              {/* Mini sparkline placeholder */}
              <div class="mt-3 flex h-8 items-end gap-px overflow-hidden rounded bg-gray-800">
                <For each={Array.from({ length: 20 })}>
                  {(_, i) => (
                    <div
                      class="flex-1 rounded-t"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        "background-color": metric.color,
                        opacity: 0.3 + (i() / 20) * 0.7,
                      }}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
