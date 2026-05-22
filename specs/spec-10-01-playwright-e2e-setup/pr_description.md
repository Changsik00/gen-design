# spec-10-01: Playwright E2E 셋업 + 스모크 테스트

## 요약

- `@playwright/test` 1.60.0 설치 + `playwright.config.ts` (webServer: Vite dev)
- `studio/e2e/smoke.spec.ts` — 스튜디오 6개 라우트 smoke test (6 PASS, 2.0s)
- CI `.github/workflows/ci.yml` 에 `e2e` job 추가 (test job 과 병렬)
- Vitest 가 e2e 파일을 픽업하지 않도록 `vitest.config.ts` `exclude` 추가

## 변경 파일

| 파일 | 변경 | 설명 |
|---|---|---|
| `studio/playwright.config.ts` | NEW | Playwright 설정 (webServer, Chromium, retries) |
| `studio/e2e/smoke.spec.ts` | NEW | 6개 라우트 smoke test |
| `studio/package.json` | MODIFY | `test:e2e` script 추가 |
| `studio/vitest.config.ts` | MODIFY | `exclude: ["**/e2e/**"]` 추가 |
| `.github/workflows/ci.yml` | MODIFY | `e2e` job 추가 |

## 검증

```bash
pnpm --filter studio test --run   # 995 PASS
pnpm --filter studio test:e2e     # 6 PASS (2.0s)
```

## 주요 발견

- `#/design`, `#/tokens` 라우트에 `<nav>` 2개 존재 (sidebar nav + 내부 섹션 nav) → `page.locator('aside nav').first()` 로 sidebar 명시 지정
- `reuseExistingServer: !process.env.CI` 로 로컬 개발 중 다른 서버가 5173 포트 점유 시 충돌 가능 — 개발 시 주의

🤖 Generated with [Claude Code](https://claude.com/claude-code)
