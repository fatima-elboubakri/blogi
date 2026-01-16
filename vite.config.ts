
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Le bloc define doit être ici (pas en bas)
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      "https://jsonplaceholder.typicode.com"
    ),
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/tests/setup/setup-tests.ts",
    pool: "forks",
    maxConcurrency: 1,
    maxWorkers: 1,
  },
});
