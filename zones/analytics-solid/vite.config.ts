import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "FosAnalyticsSolid",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web"],
    },
  },
  server: { port: 3004 },
});
