import DocsViewer from "./DocsViewer.svelte";

const app = new DocsViewer({
  target: document.getElementById("app")!,
});

export default app;
