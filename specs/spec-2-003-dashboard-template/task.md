# Task List: spec-2-003

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

## Task 1: 타입 확장 + i18n 확장

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-2-003-dashboard-template`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. DashboardPageTexts 확장 + i18n JSON + 헬퍼
- [ ] `studio/src/components/templates/types.ts` — `DashboardPageTexts` 필드 확장
- [ ] `studio/src/components/templates/types.test.ts` — 확장된 타입에 맞게 수정
- [ ] `studio/src/i18n/ko.json`, `en.json` — dashboard 섹션 확장
- [ ] `studio/src/lib/i18n.ts` — `getDashboardPageTexts()` 헬퍼 추가
- [ ] `studio/src/lib/i18n.test.ts` — dashboard 헬퍼 테스트 추가
- [ ] 테스트 실행 → Pass 확인
- [ ] Commit: `feat(spec-2-003): extend DashboardPageTexts and i18n`

---

## Task 2: Composite 컴포넌트

### 2-1. Sidebar + DashboardHeader
- [ ] `studio/src/components/composites/Sidebar/index.tsx` 작성
- [ ] `studio/src/components/composites/DashboardHeader/index.tsx` 작성
- [ ] `studio/src/components/composites/index.ts` 업데이트
- [ ] Commit: `feat(spec-2-003): add Sidebar and DashboardHeader composites`

### 2-2. StatCard + ActivityTable
- [ ] `studio/src/components/composites/StatCard/index.tsx` 작성
- [ ] `studio/src/components/composites/ActivityTable/index.tsx` 작성
- [ ] `studio/src/components/composites/index.ts` 업데이트
- [ ] Commit: `feat(spec-2-003): add StatCard and ActivityTable composites`

---

## Task 3: DashboardPage 구현 + 테스트

### 3-1. DashboardPage + 테스트
- [ ] `studio/src/components/templates/DashboardPage/index.tsx` 작성
- [ ] `studio/src/components/templates/DashboardPage/DashboardPage.test.tsx` 작성
- [ ] `studio/src/components/templates/index.ts` 업데이트 (re-export)
- [ ] 테스트 실행 → Pass 확인
- [ ] Commit: `feat(spec-2-003): implement DashboardPage template`

---

## Task 4: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm build`
- [ ] 전체 테스트 실행 → 모두 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-2-003): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-2-003-dashboard-template`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (3 작업 + 1 Ship) |
| **예상 commit 수** | 5 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-15 |
