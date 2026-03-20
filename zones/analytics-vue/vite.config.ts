import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FosAnalyticsVue",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "vue-router", "pinia"],
    },
  },
  server: { port: 3002 },
});
