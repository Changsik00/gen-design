import { consola } from "consola";
import { env } from "@/config/env";

/**
 * 구조화 로거 — consola wrapper.
 * 환경별 레벨 자동 적용 (dev: debug / prod: warn).
 * production 빌드는 자동 silent (`__VITE_PROD__` define 으로 무력화 가능).
 */
const level = env.PUBLIC_LOG_LEVEL ?? (env.MODE === "production" ? "warn" : "debug");

export const logger = consola.create({
  level: levelToNumber(level),
  defaults: { tag: "app" },
});

export function createLogger(scope: string) {
  return logger.withTag(scope);
}

function levelToNumber(level: string): number {
  switch (level) {
    case "silent": return -999;
    case "fatal": return 0;
    case "error": return 0;
    case "warn": return 1;
    case "log": return 2;
    case "info": return 3;
    case "success": return 3;
    case "debug": return 4;
    case "trace": return 5;
    default: return 3;
  }
}
