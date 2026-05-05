import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // alias 는 array 형식 — 정의 순서 우선 (더 specific 한 매칭 먼저)
    alias: [
      // studio 패키지 source 진입 (workspace path import)
      {
        find: /^studio\//,
        replacement: path.resolve(__dirname, "../../studio/src/") + "/",
      },
      // studio 안의 자기참조 `@/components/*`, `@/lib/*` 를 studio/src 로 매핑
      {
        find: /^@\/components\//,
        replacement: path.resolve(__dirname, "../../studio/src/components/") + "/",
      },
      {
        find: /^@\/lib\//,
        replacement: path.resolve(__dirname, "../../studio/src/lib/") + "/",
      },
      // app-b 자체 src 참조
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
