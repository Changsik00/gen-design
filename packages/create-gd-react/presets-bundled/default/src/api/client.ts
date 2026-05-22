import ky from "ky";
import { env } from "@/config/env";
import { createLogger } from "@/lib/logger";

const log = createLogger("api");

/**
 * 단일 ky 인스턴스 — 모든 HTTP 요청이 이 클라이언트를 통과.
 * - 베이스 URL: PUBLIC_API_URL (빈 문자열이면 same-origin)
 * - 인증 / 텔레메트리 / 오류 처리 인터셉터 표준화
 *
 * 사용:
 *   import { api } from "@/api/client";
 *   const data = await api.get("users").json<User[]>();
 */
export const api = ky.create({
  prefixUrl: env.PUBLIC_API_URL || undefined,
  timeout: 10_000,
  retry: { limit: 2, methods: ["get", "head", "options"] },
  hooks: {
    beforeRequest: [
      (req) => {
        log.debug(`→ ${req.method} ${req.url}`);
        // 인증 헤더 주입 위치 (env / store 에서 토큰 가져오기)
        // const token = useAuthStore.getState().token;
        // if (token) req.headers.set("authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      (req, _opts, res) => {
        if (!res.ok) {
          log.warn(`← ${res.status} ${req.method} ${req.url}`);
          // Sentry 보고: Sentry.captureMessage(...);
        }
      },
    ],
    beforeError: [
      (error) => {
        log.error(`✗ ${error.message}`);
        return error;
      },
    ],
  },
});
