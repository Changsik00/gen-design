/**
 * 환경변수 single source of truth — `@env-kit/node-settings` 의 `defineClientEnv()` 사용.
 *
 * ref: https://github.com/changsik00/node-settings
 *
 * 정책:
 * - Vite 의 `PUBLIC_` prefix env 만 client bundle 에 노출됨 (vite.config.ts envPrefix)
 * - prefix 는 *definition 시점* 에 enforce — 스키마가 prefix 위반 키 포함 시 거부
 * - zod schema 로 *런타임 검증* — 필수 키 누락 시 시작 거부 (NodeSettingsError)
 * - 모든 env 접근은 본 파일을 거침 (직접 `import.meta.env.X` 금지 — eslint 로 차단 가능)
 *
 * 사용:
 *   import { env, MODE } from "@/config/env";
 *   if (env.PUBLIC_SENTRY_DSN) { ... }
 */

import { z } from "zod";
import { defineClientEnv } from "@env-kit/node-settings";

const clientEnvSchema = z.object({
  /** API 베이스 URL — 빈 문자열이면 same-origin */
  PUBLIC_API_URL: z.string().default(""),

  /** Sentry DSN — 빈 문자열이면 `initSentry()` 가 no-op */
  PUBLIC_SENTRY_DSN: z.string().default(""),

  /** logger 레벨 (consola): "silent" | "error" | "warn" | "info" | "debug" */
  PUBLIC_LOG_LEVEL: z.enum(["silent", "error", "warn", "info", "debug"]).optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * 1단계: definition — prefix + schema 검증
 *   prefix 가 schema 키와 일치하지 않으면 build-time error.
 */
const getClientEnv = defineClientEnv({
  prefix: "PUBLIC_",
  schema: clientEnvSchema,
});

/**
 * 2단계: 실 호출 — Vite 가 주입한 import.meta.env 를 source 로 전달.
 *   zod 검증 + 기본값 적용 → frozen client env 객체.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawEnv = (import.meta as any).env as Record<string, string | undefined>;

export const env: ClientEnv = getClientEnv(rawEnv);

/**
 * Vite 모드 — "development" | "production" | "test" (자동 주입, schema 검증 대상 아님).
 */
export const MODE: string = rawEnv?.MODE ?? "development";
