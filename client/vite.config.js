import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), eslint()],
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //   },
  // },
  build: {
    sourcemap: true,
  },
});
