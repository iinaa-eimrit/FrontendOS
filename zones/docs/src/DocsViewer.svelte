<script lang="ts">
  interface DocSection {
    id: string;
    title: string;
    content: string;
    subsections?: { id: string; title: string }[];
  }

  const sections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: "FrontendOS is a production-grade frontend engineering operating system. It demonstrates every rendering paradigm, state model, styling approach, and infrastructure pattern used in modern frontend development.",
      subsections: [
        { id: "installation", title: "Installation" },
        { id: "quick-start", title: "Quick Start" },
        { id: "architecture", title: "Architecture Overview" },
      ],
    },
    {
      id: "rendering",
      title: "Rendering Engine",
      content: "The Rendering Orchestrator manages multi-framework, multi-strategy rendering across zones. It supports CSR, SSR, SSG, ISR, Streaming SSR, RSC, Islands, Resumable rendering, Edge SSR, and Progressive Hydration.",
      subsections: [
        { id: "strategies", title: "Rendering Strategies" },
        { id: "zones", title: "Zone Configuration" },
        { id: "hydration", title: "Hydration Control" },
      ],
    },
    {
      id: "state-mesh",
      title: "State Mesh",
      content: "The distributed State Mesh coordinates server cache, UI state, and workflow state across frameworks. It bridges React Query, Zustand, XState, Jotai, Pinia, and NgRx into a unified system.",
      subsections: [
        { id: "core", title: "Mesh Core" },
        { id: "bridges", title: "Framework Bridges" },
        { id: "adapters", title: "State Adapters" },
      ],
    },
    {
      id: "design-system",
      title: "Design System",
      content: "Tokens → Foundations → Primitives → Components → Patterns → Templates. A comprehensive design token pipeline with multi-brand theming, fluid typography, and runtime token injection.",
    },
    {
      id: "data-layer",
      title: "Data Layer",
      content: "Unified Data Adapter supporting REST, GraphQL, gRPC-web, WebSockets, SSE, and offline-first patterns with Dexie + IndexedDB. Includes optimistic UI, conflict resolution, and CRDT collaboration.",
    },
  ];

  let activeSection = sections[0];

  function setActive(section: DocSection) {
    activeSection = section;
  }
</script>

<div class="flex h-full bg-gray-950 text-gray-50" data-zone="docs" data-framework="svelte">
  <!-- Sidebar -->
  <nav class="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto shrink-0">
    <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Documentation</h2>
    <ul class="space-y-1">
      {#each sections as section}
        <li>
          <button
            class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors {activeSection?.id === section.id ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}"
            on:click={() => setActive(section)}
          >
            {section.title}
          </button>
          {#if section.subsections && activeSection?.id === section.id}
            <ul class="ml-4 mt-1 space-y-0.5">
              {#each section.subsections as sub}
                <li>
                  <button class="w-full text-left px-3 py-1 text-xs text-gray-500 hover:text-gray-300 rounded transition-colors">
                    {sub.title}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Content -->
  <main class="flex-1 p-8 overflow-y-auto">
    {#if activeSection}
      <article class="max-w-3xl">
        <h1 class="text-3xl font-bold mb-4 text-gray-100">{activeSection.title}</h1>
        <p class="text-gray-400 leading-relaxed text-base">{activeSection.content}</p>

        {#if activeSection.subsections}
          <div class="mt-8 space-y-4">
            {#each activeSection.subsections as sub}
              <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-200">{sub.title}</h3>
                <p class="text-xs text-gray-500 mt-1">Section content for {sub.title}</p>
              </div>
            {/each}
          </div>
        {/if}
      </article>
    {/if}

    <footer class="mt-12 pt-4 border-t border-gray-800">
      <p class="text-xs text-gray-600">FrontendOS Docs · Svelte + CSS Modules · SSG</p>
    </footer>
  </main>
</div>
