import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";

/**
 * Qwik Embed Widget — Resumable architecture
 * O(1) startup: no hydration needed, resumes from serialized state
 */
export const EmbedWidget = component$(() => {
  const count = useSignal(0);
  const isExpanded = useSignal(false);
  const lastUpdate = useSignal("");

  useVisibleTask$(() => {
    lastUpdate.value = new Date().toLocaleTimeString();
  });

  const increment = $(() => {
    count.value++;
    lastUpdate.value = new Date().toLocaleTimeString();
  });

  const toggleExpand = $(() => {
    isExpanded.value = !isExpanded.value;
  });

  return (
    <div
      class="overflow-hidden rounded-xl border border-gray-800 bg-gray-900"
      data-zone="widgets"
      data-framework="qwik"
    >
      <div class="p-4">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-200">Resumable Widget</h3>
          <span class="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-400">Qwik</span>
        </div>
        <p class="mb-4 text-xs text-gray-500">
          Zero hydration cost · Resumes from server-serialized state
        </p>

        <div class="mb-4 flex items-center gap-4">
          <button
            onClick$={increment}
            class="rounded-lg bg-purple-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-purple-500"
          >
            Count: {count.value}
          </button>
          <button
            onClick$={toggleExpand}
            class="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-700"
          >
            {isExpanded.value ? "Collapse" : "Expand"} Details
          </button>
        </div>

        {isExpanded.value && (
          <div class="space-y-1 rounded-lg bg-gray-800 p-3 text-xs text-gray-400">
            <p>Framework: Qwik (Resumable)</p>
            <p>Rendering: O(1) startup</p>
            <p>Hydration: None (serialized state)</p>
            <p>Last interaction: {lastUpdate.value}</p>
          </div>
        )}
      </div>

      <div class="border-t border-gray-800 bg-gray-800/50 px-4 py-2">
        <p class="text-[10px] text-gray-600">FrontendOS · Embeddable Widget · {lastUpdate.value}</p>
      </div>
    </div>
  );
});
