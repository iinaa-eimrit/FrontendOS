import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess() })],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FosDocs",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["svelte"],
    },
  },
  server: { port: 3003 },
});
