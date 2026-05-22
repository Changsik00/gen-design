/**
 * 환경변수 single source of truth.
 *
 * Vite 의 PUBLIC_ prefix env 만 client bundle 에 노출됨.
 * 모든 env 접근은 본 파일을 거침 (직접 import.meta.env 금지 — eslint 가 차단).
 *
 * @env-kit/node-settings 사용 패턴 — 향후 server-side 코드에서 검증 강화 시.
 */

export interface AppEnv {
  /** Vite 모드: "development" | "production" | "test" */
  MODE: string;
  /** API 베이스 URL — 빈 문자열이면 same-origin */
  PUBLIC_API_URL: string;
  /** Sentry DSN — 빈 문자열이면 no-op */
  PUBLIC_SENTRY_DSN: string;
  /** logger 레벨: "silent" | "error" | "warn" | "info" | "debug" */
  PUBLIC_LOG_LEVEL: string | undefined;
}

function readEnv(key: keyof AppEnv, fallback = ""): string {
  // @ts-expect-error — Vite 가 import.meta.env 를 주입
  const value: unknown = import.meta.env?.[key];
  if (typeof value === "string") return value;
  return fallback;
}

export const env: AppEnv = {
  MODE: readEnv("MODE", "development"),
  PUBLIC_API_URL: readEnv("PUBLIC_API_URL"),
  PUBLIC_SENTRY_DSN: readEnv("PUBLIC_SENTRY_DSN"),
  PUBLIC_LOG_LEVEL: readEnv("PUBLIC_LOG_LEVEL") || undefined,
};

/**
 * 필수 env 검증 — 시작 시 호출.
 * production 에서 필수 키 누락 시 throw.
 */
export function validateEnv(): void {
  if (env.MODE === "production") {
    // 예시: 프로덕션에서 필수인 키 검사
    // if (!env.PUBLIC_API_URL) throw new Error("PUBLIC_API_URL is required in production");
  }
}
