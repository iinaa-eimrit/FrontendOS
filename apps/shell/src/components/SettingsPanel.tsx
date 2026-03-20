import React, { useState } from "react";

interface SettingSection {
  id: string;
  title: string;
  icon: string;
}

const settingSections: SettingSection[] = [
  { id: "general", title: "General", icon: "⚙" },
  { id: "appearance", title: "Appearance", icon: "🎨" },
  { id: "zones", title: "Zones", icon: "📦" },
  { id: "performance", title: "Performance", icon: "⚡" },
  { id: "about", title: "About", icon: "ℹ" },
];

export default function SettingsPanel() {
  const [activeSection, setActiveSection] = useState("general");
  const [theme, setTheme] = useState("dark");
  const [animations, setAnimations] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [prefetch, setPrefetch] = useState(true);

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Sidebar */}
      <nav className="w-56 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto shrink-0">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Settings</h2>
        <ul className="space-y-1">
          {settingSections.map((section) => (
            <li key={section.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.icon}</span>
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl">
          {activeSection === "general" && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-gray-100">General Settings</h1>
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200">Telemetry</h3>
                      <p className="text-xs text-gray-500 mt-1">Send anonymous usage data to improve FrontendOS</p>
                    </div>
                    <button
                      onClick={() => setTelemetry(!telemetry)}
                      aria-label="Toggle telemetry"
                      className={`w-11 h-6 rounded-full transition-colors relative ${telemetry ? "bg-blue-600" : "bg-gray-700"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${telemetry ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200">Prefetch Links</h3>
                      <p className="text-xs text-gray-500 mt-1">Prefetch pages on hover for faster navigation</p>
                    </div>
                    <button
                      onClick={() => setPrefetch(!prefetch)}
                      aria-label="Toggle prefetch"
                      className={`w-11 h-6 rounded-full transition-colors relative ${prefetch ? "bg-blue-600" : "bg-gray-700"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${prefetch ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "appearance" && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-gray-100">Appearance</h1>
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-gray-200 mb-3">Theme</h3>
                  <div className="flex gap-3">
                    {["dark", "light", "system"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${
                          theme === t ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200">Animations</h3>
                      <p className="text-xs text-gray-500 mt-1">Enable transition animations throughout the UI</p>
                    </div>
                    <button
                      onClick={() => setAnimations(!animations)}
                      aria-label="Toggle animations"
                      className={`w-11 h-6 rounded-full transition-colors relative ${animations ? "bg-blue-600" : "bg-gray-700"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${animations ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "zones" && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-gray-100">Zone Configuration</h1>
              <div className="space-y-3">
                {[
                  { name: "Editor", framework: "React", port: 3001, status: "active" },
                  { name: "Analytics (Vue)", framework: "Vue", port: 3002, status: "active" },
                  { name: "Docs", framework: "Svelte", port: 3003, status: "active" },
                  { name: "Analytics (Solid)", framework: "SolidJS", port: 3004, status: "active" },
                  { name: "Widgets", framework: "Qwik", port: 3005, status: "idle" },
                  { name: "Legacy", framework: "Angular", port: 3006, status: "idle" },
                ].map((zone) => (
                  <div key={zone.name} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-200">{zone.name}</p>
                      <p className="text-xs text-gray-500">{zone.framework} · Port {zone.port}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      zone.status === "active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {zone.status === "active" ? "Active" : "Idle"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === "performance" && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-gray-100">Performance</h1>
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-gray-200 mb-3">Bundle Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Size", value: "142 KB", color: "text-blue-400" },
                      { label: "Gzipped", value: "45.9 KB", color: "text-violet-400" },
                      { label: "Modules", value: "25", color: "text-green-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-gray-200 mb-3">Core Web Vitals</h3>
                  <div className="space-y-3">
                    {[
                      { name: "LCP", value: "1.2s", target: "< 2.5s", pct: 48, color: "bg-green-500" },
                      { name: "FID", value: "45ms", target: "< 100ms", pct: 45, color: "bg-green-500" },
                      { name: "CLS", value: "0.05", target: "< 0.1", pct: 50, color: "bg-green-500" },
                      { name: "TTFB", value: "180ms", target: "< 800ms", pct: 23, color: "bg-green-500" },
                    ].map((vital) => (
                      <div key={vital.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{vital.name}</span>
                          <span className="text-xs text-gray-500">{vital.value} / {vital.target}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div className={`${vital.color} h-1.5 rounded-full`} style={{ width: `${vital.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "about" && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-gray-100">About FrontendOS</h1>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-xl">OS</div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100">FrontendOS</h2>
                    <p className="text-sm text-gray-500">v0.1.0 · Frontend Engineering Operating System</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Frameworks:</span> <span className="text-gray-300">8</span></div>
                  <div><span className="text-gray-500">Render Strategies:</span> <span className="text-gray-300">11</span></div>
                  <div><span className="text-gray-500">Styling Engines:</span> <span className="text-gray-300">9</span></div>
                  <div><span className="text-gray-500">Data Protocols:</span> <span className="text-gray-300">6</span></div>
                  <div><span className="text-gray-500">Build System:</span> <span className="text-gray-300">Turborepo + pnpm</span></div>
                  <div><span className="text-gray-500">Shell:</span> <span className="text-gray-300">Astro 4.15</span></div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
