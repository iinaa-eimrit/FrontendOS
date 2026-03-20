import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

export default defineConfig({
  output: "hybrid",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    tailwind(),
  ],
  vite: {
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
});
