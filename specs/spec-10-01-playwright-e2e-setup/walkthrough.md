# Walkthrough: spec-10-01-playwright-e2e-setup

## 실행 순서

### Task 1: 브랜치 생성

```bash
git checkout -b spec-10-01-playwright-e2e-setup
```

`phase-09-gen-design-live` 에서 분기.

---

### Task 2: Playwright 설치 + 설정

```bash
pnpm add -D @playwright/test            # 1.60.0 설치
pnpm exec playwright install chromium   # Chromium 바이너리 설치
```

- `studio/playwright.config.ts` 신규 작성 — `webServer: pnpm dev (port 5173)`, Chromium 단일, retries CI=1
- `studio/package.json` `"test:e2e": "playwright test"` 추가

---

### Task 3: smoke.spec.ts 작성 + TDD

**초기 실패 원인 및 해결**:

1. **포트 5173 충돌** — `reuseExistingServer: true` 가 다른 서버("Content Monitor")를 재사용. 포트 해제 후 정상 동작.

2. **strict mode 위반** — `#/design`, `#/tokens` 라우트에 `<nav>` 가 2개 (sidebar + 내부 섹션 nav). `getByRole('navigation')` → `page.locator('aside nav').first()` 로 수정.

**최종 테스트 결과**:

```bash
pnpm test:e2e
# Running 6 tests using 6 workers
# ✓ Chats 라우트 로딩
# ✓ Spec Editor 라우트 로딩
# ✓ Export 라우트 로딩
# ✓ New Spec 라우트 로딩
# ✓ Design MD 라우트 로딩
# ✓ Tokens 라우트 로딩
# 6 passed (2.0s)
```

**vitest 충돌 수정**: Vitest 가 `e2e/smoke.spec.ts` 를 픽업해 실패. `vitest.config.ts` 에 `exclude: ["**/e2e/**"]` 추가.

---

### Task 4: CI 통합

`.github/workflows/ci.yml` 에 `e2e` job 추가:
- `actions/checkout` → `setup-node (24)` → `pnpm/action-setup` → `install` → `playwright install --with-deps chromium` → `test:e2e`
- 기존 `test` job 과 병렬 실행

---

### 최종 검증

```bash
pnpm --filter studio test --run   # 995 PASS (131 files)
pnpm --filter studio test:e2e     # 6 PASS (2.0s)
```
