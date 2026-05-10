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
- [ ] `studio/src/lib/paper-inference/cli/paper-to-spec.ts:66` `msg` 처리
- [ ] `studio/src/lib/spec-md-compiler/react/__tests__/cli.test.ts:1` `vi`, `beforeEach` 정리
- [ ] `studio/src/lib/spec-md-compiler/react/__tests__/imports-builder.test.ts:8` `components` 정리

### 1-2. 빌드 검증
- [ ] `pnpm --filter studio build` 실행 → exit 0 확인
- [ ] Commit: `fix(spec-7-10): clean unused vars to restore studio build`

---

## Task 2: component-registry 디렉토리 메타 노출

### 2-1. 메타 export 추가 (TDD Red)
- [ ] 신규 테스트: `studio/src/lib/spec-md-compiler/paper/__tests__/component-registry.test.ts` (또는 기존 위치) — `COMPONENT_IMPORT_PATHS` 의 28 항목 단언 (Button=ui, *Form/Card=composites, *Page=templates).
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-7-10): assert component import paths metadata`

### 2-2. 메타 export 구현 (TDD Green)
- [ ] `component-registry.ts` 에 `COMPONENT_IMPORT_PATHS` 추가 (동일 파일의 import 문과 1:1 일치).
- [ ] 테스트 실행 → Pass 확인
- [ ] Commit: `feat(spec-7-10): expose COMPONENT_IMPORT_PATHS metadata`

---

## Task 3: imports-builder 디렉토리 인식 (C1)

### 3-1. 테스트 (TDD Red)
- [ ] 신규: `studio/src/lib/spec-md-compiler/react/__tests__/imports-builder.directory.test.ts`
  - Button → `@/components/ui/button`
  - LoginForm → `@/components/composites/LoginForm`
  - LoginPage → `@/components/templates/LoginPage`
  - `excludeName` 옵션: 일치 시 import 생략
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-7-10): add directory-aware imports test (RED)`

### 3-2. 구현 (TDD Green)
- [ ] `imports-builder.ts` 가 `COMPONENT_IMPORT_PATHS` 를 lookup. 미등록은 fallback (경고 + ui/{lower}).
- [ ] `excludeName?: string` 옵션 추가.
- [ ] 테스트 실행 → Pass.
- [ ] Commit: `fix(spec-7-10): imports-builder uses registry directory metadata`

---

## Task 4: compile.ts JSX 단일 emit (C2 + C9)

### 4-1. 테스트 (TDD Red)
- [ ] 신규: `studio/src/lib/spec-md-compiler/react/__tests__/jsx-single-emit.test.ts`
  - `<Button />` 컴파일 결과에서 함수 body (return 이전) 에 `<Button` substring 0회.
  - return `<>...</>` 안에는 1회.
  - `<LoginPage />` (componentName=LoginPage) 컴파일: import 에 `LoginPage` 없음 (excludeName 적용).
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-7-10): assert single JSX emit + name-collision avoidance (RED)`

### 4-2. 구현 (TDD Green)
- [ ] `compile.ts:72` 의 `bodyContent` 를 `hookLines` 만으로 변경. `jsxBody` 는 return 안에만.
- [ ] root 단일 사용 컴포넌트 검출 → `buildImports(..., { excludeName: input.componentName })`.
- [ ] 테스트 실행 → Pass.
- [ ] Commit: `fix(spec-7-10): emit JSX once and avoid name-self-import collision`

---

## Task 5: registry kebab-case + 검증 호출 (C6)

### 5-1. 테스트 (TDD Red)
- [ ] `studio/src/lib/spec-md-compiler/react/__tests__/registry-writer.test.ts` 갱신
  - deps `["Button", "LoginForm"]` → `registryDependencies = ["button", "login-form"]` 단언.
  - 결과 `name` kebab.
- [ ] 신규 케이스: `compile.test.ts` — invalid name (예: 빈 deps + 잘못된 component name) 시 `result.ok=false`.
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-7-10): registry kebab-case + validator wired (RED)`

### 5-2. 구현 (TDD Green)
- [ ] `registry-writer.ts`: `registryDependencies` 에 `toKebabCase` 적용.
- [ ] `validateShadcnRegistryItem` (없으면 신규: name kebab + deps 모두 kebab) 정의.
- [ ] `compile.ts`: validator 호출, 실패 시 `result.ok=false`.
- [ ] 테스트 실행 → Pass.
- [ ] Commit: `fix(spec-7-10): registry deps kebab-case and validator hookup`

---

## Task 6: in-process TSX 진단 (Integration Test)

### 6-1. ts-verifier 유틸 (TDD Red)
- [ ] 신규: `studio/src/lib/spec-md-compiler/react/__tests__/utils/ts-verifier.ts`
  - `verifyTsx(tsx, opts?)` → `{ ok, diagnostics }`. `paths` 별칭 + 외부 모듈 stub.
- [ ] 신규: `studio/src/lib/spec-md-compiler/react/__tests__/ts-diagnose.test.ts`
  - 28-fixture 모두 `verifyTsx` → 0 critical error 단언.
- [ ] 테스트 실행 → 현 컴파일러 출력 (이미 Task 4 까지 수정 됨) 으로 Pass 또는 잔존 결함 발견 시 Red.
- [ ] Commit: `test(spec-7-10): in-process TSX diagnostics for 28 fixtures`

### 6-2. 진단 통과까지 보정
- [ ] 진단에서 발견된 잔존 결함 fix (예: import 누락, 잘못된 hook export).
- [ ] 28/28 PASS 확인.
- [ ] Commit (필요 시): `fix(spec-7-10): resolve remaining TS diagnostics in fixtures`

---

## Task 7: fake-pass 테스트 정정 (C4)

### 7-1. 강화된 단언
- [ ] `compile.test.ts` 의 i18n 케이스: `expect(result.tsx).toMatch(/\bt\(\s*['"]ko\.submit['"]\s*\)/)` + 함수 본문 내 위치 단언.
- [ ] `tsx-validity.test.ts` 의 BANNED_IMPORTS 외에 `verifyTsx` 호출 추가 (또는 ts-diagnose 로 위임 명시).
- [ ] 전체 테스트 실행 → Pass.
- [ ] Commit: `test(spec-7-10): tighten i18n assertions to avoid comment fake-pass`

---

## Task 8: 28-fixture 결정성 + 회귀 검증

### 8-1. 결정성 + 빌드
- [ ] `pnpm test` 전체 → 모두 PASS.
- [ ] `pnpm --filter studio build` → exit 0.
- [ ] (필요 시) fixture `expected/*.tsx` 갱신 — 사유 walkthrough 명시.
- [ ] Commit (필요 시): `chore(spec-7-10): refresh expected fixtures after compiler fix`

---

## Task 9: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm --filter studio lint` (있으면) + `pnpm --filter studio build`
- [ ] 전체 테스트 실행 → 모두 PASS
- [ ] 통합 테스트: ts-diagnose.test.ts 28/28 PASS
- [ ] **walkthrough.md 작성** (감사 ID 별 fix 증거 + fixture 갱신 사유)
- [ ] **pr_description.md 작성** (템플릿 준수, 외부 검증 명령어 첨부)
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
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
