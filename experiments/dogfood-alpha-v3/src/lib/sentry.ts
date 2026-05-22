import * as Sentry from "@sentry/react";
import { env, MODE } from "@/config/env";
import { logger } from "./logger";

/**
 * Sentry 초기화 — DSN 환경변수 없으면 no-op (로컬 dev 마찰 0).
 * production 빌드 시 자동으로 DSN 주입.
 */
export function initSentry(): void {
  const dsn = env.PUBLIC_SENTRY_DSN;
  if (!dsn) {
    logger.debug("Sentry DSN 미설정 — no-op 모드");
    return;
  }

  Sentry.init({
    dsn,
    environment: MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
  });
  logger.info("Sentry 초기화 완료");
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
