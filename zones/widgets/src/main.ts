import { EmbedWidget } from "./EmbedWidget";

// Qwik widgets are rendered via qwikloader
// This is a placeholder dev entry point
const root = document.getElementById("app")!;
root.innerHTML = `
  <div style="padding: 2rem; font-family: system-ui;">
    <h1>FrontendOS — Qwik Widgets Zone</h1>
    <p>Qwik components are resumable and rendered server-side.</p>
    <p>See <code>src/EmbedWidget.tsx</code> for the widget source.</p>
  </div>
`;
