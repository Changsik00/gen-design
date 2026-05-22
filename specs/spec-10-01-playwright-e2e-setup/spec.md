# spec-10-01: Playwright E2E 셋업 + 스모크 테스트

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-10-01` |
| **Phase** | `phase-10` |
| **Branch** | `spec-10-01-playwright-e2e-setup` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

CI 에 `pnpm test` (vitest 995 PASS) + `gen-design lint` 가 있지만, **실제 브라우저에서 스튜디오 웹앱이 동작하는지 검증하는 E2E 테스트가 없다.** 라우트 추가/컴포넌트 변경 시 화면이 렌더링 깨져도 CI 가 감지하지 못한다.

### 문제점

- `#/spec`, `#/chats` 등 6개 라우트가 실제 브라우저에서 JS 오류 없이 렌더링되는지 보장 수단 없음
- vitest 단위 테스트는 JSDOM 환경 — 실제 Vite dev server + 브라우저 렌더링 스택과 다름
- CI 에 E2E step 없음 → 회귀가 배포 전 감지 불가

### 해결 방안

`@playwright/test` 설치 → `studio/e2e/smoke.spec.ts` 작성 (6개 라우트 smoke) → `playwright.config.ts` (Vite dev server 자동 기동) → CI E2E job 추가.

## 🎯 요구사항

### Functional Requirements

1. `studio/playwright.config.ts` — `webServer` 로 `pnpm dev` 자동 기동 (포트 5173).
2. `studio/e2e/smoke.spec.ts` — 6개 라우트 각각:
   - 페이지 로딩 (`page.goto('/#/route')`)
   - 라우트별 식별 요소 노출 확인 (`expect(locator).toBeVisible()`)
   - JS 런타임 오류 0건 (`page.on('pageerror', ...)`)
3. `studio/package.json` 에 `"test:e2e": "playwright test"` script 추가.
4. `.github/workflows/ci.yml` 에 `e2e` job 추가 (Chromium headless, `install --with-deps chromium`).

### Non-Functional Requirements

1. E2E 전체 실행 60초 이내.
2. 기존 vitest 995 PASS 유지.

## 🚫 Out of Scope

- a11y 검증 (→ spec-10-02)
- screenshot visual regression
- 모바일 뷰포트 / Firefox / Safari (Chromium 단일)

## 📑 ADR 후보

- [x] 없음 (Playwright = 업계 표준, 결정 기록 불필요)

## ✅ Definition of Done

- [ ] `pnpm --filter studio test:e2e` → 6개 smoke test PASS (로컬)
- [ ] CI `e2e` job PASS (GitHub Actions)
- [ ] 기존 `pnpm --filter studio test --run` 995 PASS 유지
- [ ] `walkthrough.md` + `pr_description.md` ship 완료
