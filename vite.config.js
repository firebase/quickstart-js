import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        storage: "./storage/index.html",
      },
    },
  },
});
