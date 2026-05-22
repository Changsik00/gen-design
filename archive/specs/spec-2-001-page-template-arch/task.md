# Task List: spec-2-001

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

## Task 1: 디렉토리 구조 및 아키텍처 문서 작성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-2-001-page-template-arch`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 디렉토리 생성 + ARCHITECTURE.md 작성
- [x] `studio/src/components/composites/` 디렉토리 생성
- [x] `studio/src/components/templates/` 디렉토리 생성
- [x] `studio/src/components/ARCHITECTURE.md` 작성 — 3계층 구조 정의, 각 계층 책임, 네이밍 규칙, 슬롯 가이드
- [x] Commit: `docs(spec-2-001): add page template 3-layer architecture guide`

---

## Task 2: 슬롯 인터페이스 타입 정의

### 2-1. 타입 정의
- [x] `studio/src/components/templates/types.ts` 작성 — `PageTemplateVariant`, `BaseTemplateProps`, i18n 텍스트 타입
- [x] `studio/src/components/composites/index.ts` 작성 (빈 re-export 파일)
- [x] `studio/src/components/templates/index.ts` 작성 (타입 re-export)
- [x] Commit: `feat(spec-2-001): define page template slot interfaces`

### 2-2. 타입 검증 테스트
- [x] `studio/src/components/templates/types.test.ts` 작성 — 타입 안전성 검증 (9/9 PASS)
- [x] 테스트 실행 → Pass 확인
- [x] Commit: `test(spec-2-001): add type-level tests for template slots`

---

## Task 3: ADR-002 작성

### 3-1. ADR 작성
- [x] `docs/decisions/ADR-003-headless-ui-selection.md` 작성 — shadcn/ui(Radix) 확정 결정문
- [x] Commit: `docs(spec-2-001): add ADR-003 headless UI selection`

---

## Task 4: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm build` (타입 에러 없음)
- [ ] 전체 테스트 실행 → 모두 PASS
- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Archive Commit**: `docs(spec-2-001): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-2-001-page-template-arch`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (3 작업 + 1 Ship) |
| **예상 commit 수** | 5 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-14 |
