import React, { useState } from "react";

interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections?: { id: string; title: string; content: string }[];
}

const sections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content:
      "FrontendOS is a production-grade frontend engineering operating system. It demonstrates every rendering paradigm, state model, styling approach, and infrastructure pattern used in modern frontend development.",
    subsections: [
      { id: "installation", title: "Installation", content: "Clone the repo, install dependencies with pnpm install, and start the dev server with pnpm turbo dev." },
      { id: "quick-start", title: "Quick Start", content: "Run the Astro shell on port 4321. Each micro-frontend zone has its own dev server and can be developed independently." },
      { id: "architecture", title: "Architecture Overview", content: "Turborepo monorepo with pnpm workspaces. An Astro shell hosts micro-frontend zones built with React, Vue, Svelte, SolidJS, Qwik, and Angular." },
    ],
  },
  {
    id: "rendering",
    title: "Rendering Engine",
    content:
      "The Rendering Orchestrator manages multi-framework, multi-strategy rendering across zones. It supports CSR, SSR, SSG, ISR, Streaming SSR, RSC, Islands, Resumable rendering, Edge SSR, and Progressive Hydration.",
    subsections: [
      { id: "strategies", title: "Rendering Strategies", content: "Each zone can choose its own rendering strategy. The orchestrator coordinates hydration, streaming, and static generation across frameworks." },
      { id: "zones", title: "Zone Configuration", content: "Zones are configured via vite.config.ts and package.json. Each zone declares its framework, entry point, and rendering strategy." },
      { id: "hydration", title: "Hydration Control", content: "Islands architecture enables selective hydration. Only interactive components ship JavaScript to the client." },
    ],
  },
  {
    id: "state-mesh",
    title: "State Mesh",
    content:
      "The distributed State Mesh coordinates server cache, UI state, and workflow state across frameworks. It bridges React Query, Zustand, XState, Jotai, Pinia, and NgRx into a unified system.",
    subsections: [
      { id: "core", title: "Mesh Core", content: "The core mesh provides pub/sub event channels, shared stores, and cross-framework state synchronization." },
      { id: "bridges", title: "Framework Bridges", content: "Each framework has a bridge adapter that translates its native state management into the mesh protocol." },
      { id: "adapters", title: "State Adapters", content: "Adapters handle serialization, conflict resolution, and optimistic updates across the distributed state graph." },
    ],
  },
  {
    id: "design-system",
    title: "Design System",
    content:
      "Tokens → Foundations → Primitives → Components → Patterns → Templates. A comprehensive design token pipeline with multi-brand theming, fluid typography, and runtime token injection.",
    subsections: [
      { id: "tokens", title: "Design Tokens", content: "CSS custom properties generated from a JSON token spec. Supports light/dark themes, brand variants, and responsive scales." },
      { id: "components", title: "Component Library", content: "Framework-agnostic primitives that work across React, Vue, Svelte, Solid, and Angular." },
    ],
  },
  {
    id: "data-layer",
    title: "Data Layer",
    content:
      "Unified Data Adapter supporting REST, GraphQL, gRPC-web, WebSockets, SSE, and offline-first patterns with Dexie + IndexedDB. Includes optimistic UI, conflict resolution, and CRDT collaboration.",
    subsections: [
      { id: "adapters", title: "Protocol Adapters", content: "Pluggable adapters for REST, GraphQL, gRPC-web, and WebSocket protocols with unified request/response types." },
      { id: "offline", title: "Offline Support", content: "IndexedDB-backed offline storage with automatic sync, conflict resolution, and CRDT-based collaborative editing." },
    ],
  },
];

export default function DocsViewer() {
  const [activeId, setActiveId] = useState(sections[0]!.id);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const active = sections.find((s) => s.id === activeId)!;

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto shrink-0">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Documentation
        </h2>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeId === section.id
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => { setActiveId(section.id); setActiveSubId(null); }}
              >
                {section.title}
              </button>
              {section.subsections && activeId === section.id && (
                <ul className="ml-4 mt-1 space-y-0.5">
                  {section.subsections.map((sub) => (
                    <li key={sub.id}>
                      <button
                        className={`w-full text-left px-3 py-1 text-xs rounded transition-colors ${
                          activeSubId === sub.id
                            ? "text-blue-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveSubId(sub.id)}
                      >
                        {sub.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <article className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-100">{active.title}</h1>
          <p className="text-gray-400 leading-relaxed text-base">{active.content}</p>

          {active.subsections && (
            <div className="mt-8 space-y-4">
              {active.subsections.map((sub) => (
                <div
                  key={sub.id}
                  className={`bg-gray-900 border rounded-xl p-4 transition-colors ${
                    activeSubId === sub.id ? "border-blue-500/50" : "border-gray-800"
                  }`}
                >
                  <h3 className="text-sm font-medium text-gray-200">{sub.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{sub.content}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <footer className="mt-12 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-600">FrontendOS Docs · Svelte + CSS Modules · SSG</p>
        </footer>
      </main>
    </div>
  );
}
