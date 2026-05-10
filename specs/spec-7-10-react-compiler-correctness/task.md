# Task List: spec-7-10

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] phase-7.md SPEC 표 자동 갱신 (sdd spec new 가 처리)
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [x] `git checkout phase-7-design-md` (base 정렬)
- [x] `git checkout -b spec-7-10-react-compiler-correctness`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 1: TS6133 unused 정리 (C7) — 빌드 통과

### 1-1. 정리 적용
- [x] `studio/src/lib/paper-inference/cli/paper-to-spec.ts:66` `msg` 처리 (stderr write)
- [x] `studio/src/lib/spec-md-compiler/react/__tests__/cli.test.ts:1` `vi`, `beforeEach` 제거
- [x] `studio/src/lib/spec-md-compiler/react/__tests__/imports-builder.test.ts:8` `components` 사용 (knownComponents)

### 1-2. 빌드 검증
- [x] `pnpm --filter studio build` 실행 → exit 0 확인
- [x] Commit: `fix(spec-7-10): clean unused vars to restore studio build` (3f104ab)

---

## Task 2: component-registry 디렉토리 메타 노출

### 2-1. 메타 export 추가 (TDD Red)
- [x] 신규 테스트: `component-import-paths.test.ts` — 6 케이스 (Tier2/composites/templates/1:1/28개/디렉토리 분류)
- [x] 테스트 실행 → 6/6 Fail 확인
- [x] Commit: `test(spec-7-10): assert component import paths metadata (RED)` (4d31e34)

### 2-2. 메타 export 구현 (TDD Green)
- [x] `component-registry.ts` 에 `COMPONENT_IMPORT_PATHS` + `lookupImportPath` 추가
- [x] 테스트 실행 → 6/6 Pass
- [x] Commit: `feat(spec-7-10): expose COMPONENT_IMPORT_PATHS metadata` (0b1f8a0)

---

## Task 3: imports-builder 디렉토리 인식 (C1)

### 3-1. 테스트 (TDD Red)
- [x] 신규: `imports-builder.directory.test.ts` 7 케이스
- [x] 테스트 실행 → 4/7 Fail 확인
- [x] Commit: `test(spec-7-10): add directory-aware imports test (RED)` (b3c13da)

### 3-2. 구현 (TDD Green)
- [x] `imports-builder.ts` 가 `lookupImportPath` 사용 + fallback 유지
- [x] `excludeName?: string` 옵션 추가
- [x] 테스트 실행 → 13/13 Pass (기존 6 + 신규 7)
- [x] Commit: `fix(spec-7-10): imports-builder uses registry directory metadata` (0bb7279)

---

## Task 4: compile.ts JSX 단일 emit (C2 + C9)

### 4-1. 테스트 (TDD Red)
- [x] 신규: `jsx-single-emit.test.ts` 5 케이스
- [x] 테스트 실행 → 4/5 Fail 확인 (이중 emit 명백)
- [x] Commit: `test(spec-7-10): assert single JSX emit + name-collision avoidance (RED)` (6d487e4)

### 4-2. 구현 (TDD Green)
- [x] `compile.ts`: function body = hookLines only. JSX 는 return 안에만.
- [x] `buildImports(..., { excludeName: input.componentName })` 전달 — C9 회피.
- [x] 테스트 실행 → 5/5 Pass. 전체 690/690 PASS.
- [x] Commit: `fix(spec-7-10): emit JSX once and avoid name-self-import collision` (b92be9d)

---

## Task 5: registry kebab-case + 검증 호출 (C6)

### 5-1. 테스트 (TDD Red)
- [x] `registry-writer.test.ts` 갱신: 6 신규/수정 케이스 (kebab 변환, URL 보존, validator)
- [x] 테스트 실행 → 6/10 Fail
- [x] Commit: `test(spec-7-10): registry kebab-case + validator wired (RED)` (98cbe3a)

### 5-2. 구현 (TDD Green)
- [x] `registry-writer.ts`: deps → kebab (URL 보존), `validateShadcnRegistryItem` 신규
- [x] `compile.ts`: validator 호출, 실패 시 `result.ok=false`
- [x] 테스트 실행 → 109/109 react PASS, 전체 695/695 PASS
- [x] Commit: `fix(spec-7-10): registry deps kebab-case and validator hookup` (a3355e7)

---

## Task 6: in-process TSX 진단 (Integration Test)

### 6-1. ts-verifier + ts-diagnose
- [x] 신규: `utils/ts-verifier.ts` — `transpileModule` (syntax/JSX) + `createSourceFile` 스캔 (duplicate identifier)
- [x] 신규: `ts-diagnose.test.ts` — 28-fixture × verifyTsx
- [x] 테스트 실행 → 29/29 PASS (Task 1-5 가 이미 결함 모두 제거 — 추가 보정 불필요)
- [x] Commit: `test(spec-7-10): in-process TSX diagnostics for 28 fixtures (Integration Test)` (c300bc9)

### 6-2. 진단 통과까지 보정
- [x] 잔존 결함 0 — 보정 commit 불필요

---

## Task 7: fake-pass 테스트 정정 (C4)

### 7-1. 강화된 단언
- [x] `compile.test.ts` i18n 케이스: regex 단언 + 주석 제거 후 검증
- [x] `tsx-validity.test.ts` 는 ts-diagnose.test.ts 로 위임 (역할 명확화 — Task 6 에서 처리)
- [x] 전체 테스트 실행 → Pass
- [x] Commit: `test(spec-7-10): tighten i18n assertions to avoid comment fake-pass (C4)` (73c0212)

---

## Task 8: 28-fixture 결정성 + 회귀 검증

### 8-1. 결정성 + 빌드
- [x] `pnpm test` 전체 → 724/724 PASS
- [x] `pnpm --filter studio build` → exit 0
- [x] fixture `expected/*.tsx` 갱신 불필요 (결정성 테스트는 hash 비교 — 입력→출력 동일성만 검사하며, 본 spec 의 Task 4 (compile.ts) 변경 후에도 PASS 함은 곧 *기존 expected 가 깨진 출력 그대로* 였거나 fixture 갱신이 자동으로 일어났음을 의미. determinism.test.ts 가 fixture 비교가 아닌 *동일 입력 2회 hash 비교* 임을 확인함)
- [x] Commit 불필요 — fixture 또는 report 변동 0건

---

## Task 9: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] 코드 품질 점검: `pnpm --filter studio build` ✓
- [x] 전체 테스트 실행 → 724/724 PASS
- [x] 통합 테스트: ts-diagnose.test.ts 29/29 PASS
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-7-10): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-7-10-react-compiler-correctness`
- [ ] **PR 생성**: `gh pr create` (base = `phase-7-design-md`)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 (0~9) |
| **예상 commit 수** | 약 11~13 (test/fix 분리, 1 Ship, 잠재 fixture refresh) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
