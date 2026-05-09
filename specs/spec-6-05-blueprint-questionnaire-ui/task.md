# Task List: spec-6-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new blueprint-questionnaire-ui`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (`sdd spec new` 가 phase-6.md SPEC 표 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + 타입/데이터 상수 정의

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-6-05-blueprint-questionnaire-ui` (phase-6-studio-v1 베이스)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 타입/데이터 상수 (TDD Red)
- [x] 테스트 작성: `studio/src/features/blueprint/__tests__/generator.test.ts` (실패 상태)
- [x] Commit: `test(spec-6-05): add failing generator tests`

### 1-3. 타입/데이터 상수 구현 (TDD Green)
- [x] `studio/src/features/blueprint/types.ts` — BlueprintSession / AppType / 관련 타입
- [x] `studio/src/features/blueprint/catalog.ts` — page-catalog.md 18개 페이지 + 앱유형별 추천 세트
- [x] `studio/src/features/blueprint/generator.ts` — REQUIREMENTS.md 변환 순수 함수
- [x] 테스트 실행 → Pass 확인 (`pnpm --filter studio test -- --testPathPattern="generator"`)
- [x] Commit: `feat(spec-6-05): add blueprint types, catalog and generator`

---

## Task 2: Step 1 앱유형 선택 UI

### 2-1. Step1AppType 컴포넌트
- [ ] `studio/src/features/blueprint/steps/Step1AppType.tsx` 구현
- [ ] 6 가지 앱유형 카드 (SaaS / E-commerce / Social / Content / Utility / Custom)
- [ ] 선택 시 catalog 추천 세트 콜백
- [ ] 테스트 실행 Pass 확인
- [ ] Commit: `feat(spec-6-05): implement Step1 app type selection`

---

## Task 3: Step 1.5 NFR 체크리스트 UI

### 3-1. Step15Nfr 컴포넌트
- [ ] `studio/src/features/blueprint/steps/Step15Nfr.tsx` 구현
- [ ] 6 카테고리 13 항목, 기본값 pre-fill
- [ ] 모든 카테고리 응답 확인 후 완료 상태 (fail-fast)
- [ ] Switch / Select / Input 자체 컴포넌트 활용 (dogfooding)
- [ ] 테스트 실행 Pass 확인
- [ ] Commit: `feat(spec-6-05): implement Step1.5 NFR checklist`

---

## Task 4: Step 2 페이지 구성 UI

### 4-1. Step2Pages 컴포넌트
- [ ] `studio/src/features/blueprint/steps/Step2Pages.tsx` 구현
- [ ] 추천 페이지 필수/권장/선택 badge
- [ ] 페이지 추가 (카탈로그 전체 목록 패널) / 제거 토글
- [ ] 테스트 실행 Pass 확인
- [ ] Commit: `feat(spec-6-05): implement Step2 page selection`

---

## Task 5: Step 3 Variant/섹션 커스터마이징 UI + Output 미리보기

### 5-1. Step3Variants 컴포넌트
- [ ] `studio/src/features/blueprint/steps/Step3Variants.tsx` 구현
- [ ] 페이지별 variant radio + 선택 섹션 Switch 목록
- [ ] 일괄 기본값 적용 버튼

### 5-2. OutputPreview 컴포넌트
- [ ] `studio/src/features/blueprint/OutputPreview.tsx` 구현
- [ ] generator.ts 호출 → 미리보기 pre 블록
- [ ] Blob + URL.createObjectURL 다운로드 버튼
- [ ] 테스트 실행 Pass 확인
- [ ] Commit: `feat(spec-6-05): implement Step3 variants and output preview`

---

## Task 6: 위저드 통합 + index.tsx 교체

### 6-1. BlueprintWizard 오케스트레이터
- [ ] `studio/src/features/blueprint/BlueprintWizard.tsx` 구현
- [ ] BlueprintSession state 소유, 단계 전환 로직
- [ ] WizardHeader stepper (현재 단계 표시)

### 6-2. index.tsx stub 교체
- [ ] `studio/src/features/blueprint/index.tsx` — BlueprintWizard export 로 교체
- [ ] 전체 테스트 실행 Pass 확인 (`pnpm --filter studio test`)
- [ ] Commit: `feat(spec-6-05): wire up BlueprintWizard and replace stub`

---

## Task 7: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm --filter studio run typecheck`
- [ ] 전체 테스트 실행 → 모두 PASS: `pnpm --filter studio test`
- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-6-05): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-6-05-blueprint-questionnaire-ui`
- [ ] **PR 생성**: `/hk-pr-gh` 로 생성 (phase-6-studio-v1 타겟)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (브랜치 포함) |
| **예상 commit 수** | 6 |
| **현재 단계** | Execution — Task 2 |
| **마지막 업데이트** | 2026-05-09 |
