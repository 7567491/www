import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0", // 允许外部访问
    port: 15080,
    open: false, // 禁用自动打开浏览器
    cors: true, // 启用CORS
  },
  preview: {
    host: "0.0.0.0",
    port: 15080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router", "pinia"],
          api: ["axios"],
        },
      },
    },
  },
});