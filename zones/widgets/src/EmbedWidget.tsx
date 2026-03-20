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
      class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
      data-zone="widgets"
      data-framework="qwik"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-gray-200">Resumable Widget</h3>
          <span class="px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 rounded">
            Qwik
          </span>
        </div>
        <p class="text-xs text-gray-500 mb-4">
          Zero hydration cost · Resumes from server-serialized state
        </p>

        <div class="flex items-center gap-4 mb-4">
          <button
            onClick$={increment}
            class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-500 transition-colors"
          >
            Count: {count.value}
          </button>
          <button
            onClick$={toggleExpand}
            class="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isExpanded.value ? "Collapse" : "Expand"} Details
          </button>
        </div>

        {isExpanded.value && (
          <div class="bg-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1">
            <p>Framework: Qwik (Resumable)</p>
            <p>Rendering: O(1) startup</p>
            <p>Hydration: None (serialized state)</p>
            <p>Last interaction: {lastUpdate.value}</p>
          </div>
        )}
      </div>

      <div class="px-4 py-2 bg-gray-800/50 border-t border-gray-800">
        <p class="text-[10px] text-gray-600">
          FrontendOS · Embeddable Widget · {lastUpdate.value}
        </p>
      </div>
    </div>
  );
});
