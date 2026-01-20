
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/tests/setup/setup-tests.ts",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      "https://jsonplaceholder.typicode.com"
    ),
  },
});
