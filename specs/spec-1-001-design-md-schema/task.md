# Task List: spec-1-001

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-1.md SPEC 표 갱신 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-1-001-design-md-schema`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: 레퍼런스 분석 보고서

### 2-1. 66개 레퍼런스 구조 스캔 및 대표 파일 정독
- [x] 전체 66개 파일의 섹션 구조 스캔 (섹션 제목 추출, 출현 빈도 집계)
- [x] 대표 파일 5~6개 정독 (stripe, linear, claude, vercel, airbnb, notion 등)
- [x] 섹션별 공통 패턴, 필수/선택 판별, 한계점 도출

### 2-2. 분석 보고서 작성
- [x] `specs/spec-1-001-design-md-schema/report.md` 작성
- [x] Commit: `docs(spec-1-001): add reference analysis report`

---

## Task 3: 확장 Schema 정의

### 3-1. 기존 9섹션 구조 정리
- [x] 각 섹션의 필수/선택, 포함 항목, 포맷 규칙 정리

### 3-2. 확장 5섹션 상세 정의
- [x] 10. Naming Convention — 중간 언어 계층
- [x] 11. Page Specifications — 페이지 목록 및 구성
- [x] 12. Composite Components — 복합 컴포넌트 참조
- [x] 13. Token Mapping — 토큰↔CSS변수↔Tailwind
- [x] 14. i18n References — 다국어 텍스트 키

### 3-3. Schema 문서 작성
- [x] `schema/design-md-schema.md` 작성
- [x] Commit: `docs(spec-1-001): define extended design-md schema`

---

## Task 4: 검증 샘플

### 4-1. stripe.md 확장 변환
- [x] 기존 `design-md-collection/stripe.md`를 확장 Schema로 변환
- [x] 확장 섹션(10~14) 내용 채우기 (stripe 기준 가상 데이터)
- [x] `schema/examples/stripe-extended.md` 생성
- [x] Commit: `docs(spec-1-001): add stripe extended schema example`

---

## Task 5: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 전체 산출물 검토 (report.md, schema, example)
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Archive Commit**: `docs(spec-1-001): archive walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-1-001-design-md-schema`
- [ ] **PR 생성**: `/hk-pr-gh` (사용자 승인 후)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 (브랜치 + 분석 + Schema + 검증 + Ship) |
| **예상 commit 수** | 4 (분석 1 + Schema 1 + 검증 1 + archive 1) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-12 |
