# Task List: spec-10-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 백로그 업데이트 (phase-10.md SPEC 표 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 및 의존성 설치

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-10-02-a11y-auto-check`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. @axe-core/playwright 설치 (TDD Red)
- [ ] `pnpm --filter studio add -D @axe-core/playwright`
- [ ] `studio/e2e/a11y.spec.ts` 작성 (6 라우트 axe 스캔, critical/serious 게이트)
- [ ] `pnpm --filter studio test:a11y` 실행 → 스크립트 없어서 실패 확인 (또는 violations 있으면 실패)
- [ ] Commit: `test(spec-10-02): add a11y axe scan for 6 routes`

### 1-3. test:a11y 스크립트 추가 (TDD Green)
- [ ] `studio/package.json` 에 `"test:a11y": "playwright test e2e/a11y.spec.ts"` 추가
- [ ] `pnpm --filter studio test:a11y` → 6개 PASS 확인
- [ ] Commit: `feat(spec-10-02): add test:a11y script to package.json`

---

## Task 2: CI a11y job 추가

### 2-1. CI workflow 수정
- [ ] `.github/workflows/ci.yml` 에 `a11y` job 추가 (e2e 와 병렬)
- [ ] Commit: `ci(spec-10-02): add a11y job parallel to e2e`

---

## Task 3: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm --filter studio lint`
- [ ] 단위 테스트: `pnpm --filter studio test --run` (995 PASS 유지)
- [ ] 통합 테스트: `pnpm --filter studio test:a11y` (6 PASS)
- [ ] 기존 smoke: `pnpm --filter studio test:e2e` (6 PASS)
- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-10-02): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-10-02-a11y-auto-check`
- [ ] **PR 생성**: `gh pr create --base phase-10-verification-automation`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 3 |
| **예상 commit 수** | 4 (pre-flight 1 + task 3) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
