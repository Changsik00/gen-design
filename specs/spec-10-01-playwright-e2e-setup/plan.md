# Implementation Plan: spec-10-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-10-01-playwright-e2e-setup`
- 시작 지점: `phase-09-gen-design-live` (현재 브랜치)
- PR 타깃: `phase-10-verification-automation` (hk-ship 시 자동 생성)

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] `pnpm --filter studio add -D @playwright/test` — devDependency 추가. `pnpm-lock.yaml` 변경됨.
> - [ ] `pnpm exec playwright install chromium` — Chromium 바이너리 로컬 설치 (~200MB). `.gitignore` 에 자동 제외됨.
> - [ ] CI 에 `playwright/action@v1` step 추가 — Actions 실행 시간 +2~3분 예상.

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
Playwright Test Runner
  └─ webServer: { command: "pnpm dev", port: 5173 }   ← Vite dev 자동 기동
  └─ e2e/smoke.spec.ts
       ├─ test("#/spec 로딩")   → <h1> 또는 nav 노출 확인
       ├─ test("#/new 로딩")
       ├─ test("#/design 로딩")
       ├─ test("#/tokens 로딩")
       ├─ test("#/export 로딩")
       └─ test("#/chats 로딩")
```

### 주요 결정

| 항목 | 결정 | 이유 |
|:---:|:---|:---|
| **테스트 위치** | `studio/e2e/` (vitest 와 분리) | Playwright 는 별도 runner — vitest `__tests__/` 와 혼용 금지 |
| **브라우저** | Chromium 단일 | CI 시간 최소화. Firefox/Safari 는 spec-10-02+ 후보 |
| **webServer** | `pnpm dev` (포트 5173) | Vite dev server 가 chatApiPlugin 포함 — prod build 대비 dev 가 현실적 |
| **JS 오류 감지** | `page.on('pageerror')` + `errors` 배열 수집 | 렌더링 후 silently fail 하는 오류 감지 |

### 📑 ADR 후보

- [x] 없음

## 📂 Proposed Changes

#### [NEW] `studio/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

#### [NEW] `studio/e2e/smoke.spec.ts`

6개 라우트 각각:
- `page.goto('/#/route')`
- `expect(page.locator('nav, [role=navigation]')).toBeVisible()`
- `errors` 배열 0건

#### [MODIFY] `studio/package.json`

`"test:e2e": "playwright test"` script 추가.

#### [MODIFY] `.github/workflows/ci.yml`

`e2e` job 추가:
```yaml
e2e:
  name: E2E Smoke
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 24 }
    - uses: pnpm/action-setup@v4
    - run: pnpm --filter studio install --frozen-lockfile
    - run: pnpm --filter studio exec playwright install --with-deps chromium
    - run: pnpm --filter studio test:e2e
```

## 🧪 검증 계획

### 통합 테스트 (E2E)
```bash
cd studio && pnpm test:e2e
# → 6개 smoke test PASS
```

### 단위 테스트 (회귀 확인)
```bash
pnpm --filter studio test --run
# → 995 PASS (변화 없음)
```

### 수동 검증
1. `pnpm --filter studio dev` → 브라우저에서 6개 라우트 직접 확인

## 🔁 Rollback Plan

- `pnpm --filter studio remove @playwright/test` → devDependency 제거
- `studio/e2e/`, `studio/playwright.config.ts` 삭제
- `ci.yml` e2e job 제거

## 📦 Deliverables 체크

- [x] task.md 작성
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
