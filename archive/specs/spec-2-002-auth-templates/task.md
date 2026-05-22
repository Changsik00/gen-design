# Task List: spec-2-002

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-2.md SPEC 표 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 테스트 환경 + i18n 헬퍼

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-2-002-auth-templates`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 테스트 의존성 + i18n 헬퍼
- [x] `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` 설치
- [x] `studio/src/lib/i18n.ts` 작성 — JSON → flat texts 변환 함수
- [x] `studio/src/lib/i18n.test.ts` 작성 — 변환 정확성 테스트 (6/6 PASS)
- [x] 테스트 실행 → Pass 확인
- [x] Commit: `feat(spec-2-002): add i18n helper with tests`

---

## Task 2: Composite 컴포넌트 구현

### 2-1. BrandHeader + SocialAuthBlock
- [x] `studio/src/components/composites/BrandHeader/index.tsx` 작성
- [x] `studio/src/components/composites/SocialAuthBlock/index.tsx` 작성
- [x] `studio/src/components/composites/index.ts` 업데이트 (re-export)
- [x] Commit: `feat(spec-2-002): add BrandHeader and SocialAuthBlock composites`

### 2-2. LoginForm + SignupForm
- [x] `studio/src/components/composites/LoginForm/index.tsx` 작성
- [x] `studio/src/components/composites/SignupForm/index.tsx` 작성
- [x] `studio/src/components/composites/index.ts` 업데이트
- [x] Commit: `feat(spec-2-002): add LoginForm and SignupForm composites`

---

## Task 3: Page Template 구현

### 3-1. VariantWrapper + LoginPage
- [x] `studio/src/components/templates/VariantWrapper.tsx` 작성
- [x] `studio/src/components/templates/LoginPage/index.tsx` 작성
- [x] LoginPage 렌더링 테스트 작성 + Pass 확인 (3/3)
- [x] Commit: `feat(spec-2-002): implement LoginPage template with variant support`

### 3-2. SignupPage
- [x] `studio/src/components/templates/SignupPage/index.tsx` 작성
- [x] SignupPage 렌더링 테스트 작성 + Pass 확인 (3/3)
- [x] `studio/src/components/templates/index.ts` 업데이트 (re-export)
- [x] Commit: `feat(spec-2-002): implement SignupPage template`

---

## Task 4: App.tsx 교체

### 4-1. App 교체
- [x] `studio/src/App.tsx` 수정 — LoginPage 컴포넌트 사용
- [x] `pnpm build` → 빌드 성공 확인
- [x] Commit: `refactor(spec-2-002): replace hardcoded login with LoginPage template`

---

## Task 5: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm build` + `pnpm lint`
- [ ] 전체 테스트 실행 → 모두 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-2-002): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-2-002-auth-templates`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 (4 작업 + 1 Ship) |
| **예상 commit 수** | 7 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-14 |
