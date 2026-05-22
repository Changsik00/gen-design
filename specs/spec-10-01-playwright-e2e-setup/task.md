# Task List: spec-10-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-10.md SPEC 표 자동 갱신 by sdd)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [x] `git checkout -b spec-10-01-playwright-e2e-setup`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: Playwright 설치 + 설정

- [x] `pnpm --filter studio add -D @playwright/test`
- [x] `studio/playwright.config.ts` 작성 (webServer + Chromium)
- [x] `studio/package.json` 에 `"test:e2e": "playwright test"` 추가
- [x] `pnpm --filter studio exec playwright install chromium`
- [x] Commit: `feat(spec-10-01): install playwright and add config`

---

## Task 3: smoke.spec.ts 작성 + TDD

- [x] `studio/e2e/smoke.spec.ts` 작성 (6개 라우트)
- [x] `pnpm --filter studio test:e2e` → 6 PASS 확인
- [x] Commit: `test(spec-10-01): add smoke e2e tests for 6 routes`

---

## Task 4: CI 통합

- [x] `.github/workflows/ci.yml` 에 `e2e` job 추가
- [x] Commit: `ci(spec-10-01): add playwright e2e job`

---

## Task 5: Ship

> `/hk-ship` 절차를 따릅니다.

- [ ] `pnpm --filter studio test --run` → 995 PASS
- [ ] `pnpm --filter studio test:e2e` → 6 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-10-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-10-01-playwright-e2e-setup`
- [ ] **PR 생성**: `phase-10-verification-automation` 브랜치 대상
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (+ Ship) |
| **예상 commit 수** | 4 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
