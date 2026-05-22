# Task List: spec-2-005

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

## Task 1: Composite 단독 테스트

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-2-005-test-coverage`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. Composite 4종 테스트
- [ ] `StatCard/StatCard.test.tsx` — 라벨/값/변동률/trend 색상
- [ ] `Sidebar/Sidebar.test.tsx` — nav 항목 렌더링, active 상태
- [ ] `ActivityTable/ActivityTable.test.tsx` — 컬럼 헤더 + 행 데이터
- [ ] `DashboardHeader/DashboardHeader.test.tsx` — 제목 + 검색 placeholder
- [ ] 테스트 실행 → Pass 확인
- [ ] Commit: `test(spec-2-005): add composite component unit tests`

---

## Task 2: variant 전환 + i18n 레이아웃 테스트

### 2-1. LoginPage variant + i18n 테스트
- [ ] `LoginPage/LoginPage.variant.test.tsx` — page(split-screen) vs modal(Dialog) DOM 구조 차이
- [ ] `LoginPage/LoginPage.i18n.test.tsx` — ko/en 전환 시 동일 구조 + 텍스트 차이
- [ ] 테스트 실행 → Pass 확인
- [ ] Commit: `test(spec-2-005): add variant and i18n verification tests`

---

## Task 3: 통합 테스트 시나리오 자동화

### 3-1. phase-2 통합 시나리오 3개
- [ ] `src/__tests__/integration.test.tsx` — 시나리오 1(Auth 렌더링), 시나리오 2(토큰 교체), 시나리오 3(variant 전환)
- [ ] 테스트 실행 → Pass 확인
- [ ] Commit: `test(spec-2-005): add phase-2 integration test scenarios`

---

## Task 4: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 전체 테스트 실행 → 모두 PASS (기존 28 + 신규)
- [ ] `pnpm build` → 빌드 성공
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-2-005): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-2-005-test-coverage`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (3 작업 + 1 Ship) |
| **예상 commit 수** | 4 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-15 |
