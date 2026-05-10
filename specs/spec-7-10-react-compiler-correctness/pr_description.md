# fix(spec-7-10): React 컴파일러 정합성 — 생성 TSX 가 실제 빌드 통과

> phase-7 ship 직전 독립 Opus 감사가 발견한 Critical 4건 + 빌드 깨짐 1건 통합 처리.

## 📋 Summary

### 배경 및 목적

phase-7 의 9 spec 모두 머지 후 phase-ship 직전 Opus 독립 감사를 수행. spec-7-09 가 C1/C2/C4/C5 를 처리했다고 PR #44 에 보고하고 phase-7 PR (#45) 본문이 "10/10 성공 기준 PASS, 99 test suite / 672 checks 모두 PASS, registry 형식 완료" 라고 기재했으나, 감사 결과:

- 생성 TSX 의 모든 import 경로가 깨짐 (C1)
- JSX 가 statement 위치에 이중 emit → syntax error (C2)
- registryDependencies 가 PascalCase → shadcn 호환 불가 (C6)
- TS6133 unused 4건 → `pnpm build` 실패 (C7) — PR 본문 미언급
- 페이지 템플릿에서 함수명-import 동일 식별자 충돌 (C9)
- TSX 유효성 테스트가 regex-only — C2 잡지 못함 (C3 부속)
- i18n 테스트가 *주석 매칭* 으로 fake-pass (C4 부속)

본 PR 은 위를 통합 처리하고, 향후 회귀를 막기 위해 `typescript` Compiler API 기반 in-process 진단 통합 테스트를 도입.

### 주요 변경 사항

- [x] **C1** `imports-builder` 가 `COMPONENT_IMPORT_PATHS` (component-registry SSOT) 로 정확한 디렉토리/casing import 생성 — Button → `@/components/ui/button`, LoginForm → `@/components/composites/LoginForm`, LoginPage → `@/components/templates/LoginPage`
- [x] **C2** `compile.ts` 의 JSX 이중 emit 제거 — function body 는 hooks 만, return 안에 JSX 한 번
- [x] **C6** `registryDependencies` kebab-case 정규화 (URL 보존), 신규 `validateShadcnRegistryItem` 컴파일러 호출 연결
- [x] **C7** TS6133 unused 4건 정리 → `pnpm --filter studio build` 통과
- [x] **C9** `excludeName` 옵션으로 root 단일 사용 컴포넌트 self-import 생략 (TS2451 회피)
- [x] **C3 부속** in-process `ts.transpileModule` + duplicate identifier 스캔 통합 테스트 추가 (28 fixture)
- [x] **C4 부속** i18n 테스트 단언 강화 — 주석 제거 후 `t("ko.submit")` 호출 매칭

### Phase 컨텍스트

- **Phase**: `phase-7` (DESIGN.md 4축 어휘 + 컴파일러)
- **본 SPEC 의 역할**: phase-7 의 핵심 산출물 (spec→React 컴파일러) 을 *외부 검증 가능* 한 상태로 회복. phase-ship 권장 No-Go → Conditional Go 로 전환하는 게이트.

## 🎯 Key Review Points

1. **`COMPONENT_IMPORT_PATHS` 단일 진실** (`paper/component-registry.ts`): 28 entry 가 동일 파일의 import 문과 1:1 일치. catalog.json 은 *어휘 정의*, registry 는 *studio 내부 매핑* — 역할 분리 유지.
2. **JSX 단일 emit** (`react/compile.ts`): function body 에서 `bodyContent = [hookLines, jsxBody]` → `[hookLines]` 로 변경. JSX 가 statement 위치에 들어가지 않음.
3. **`excludeName` 옵션** (`react/imports-builder.ts`): C9 의 의도적 회피책. componentName 변경이 아닌 컴파일러 차원의 충돌 회피.
4. **shadcn registry 검증** (`react/registry-writer.ts`): kebab-case 변환 + URL 보존 + validator 호출. 향후 외부 shadcn registry 연동 시 형식 어긋남 즉시 검출.
5. **In-process tsc 진단** (`react/__tests__/utils/ts-verifier.ts`): `noResolve: true` 로 외부 모듈은 stub. syntax/JSX/duplicate-identifier 만 critical 로 잡음. 외부 alpha 단계의 *실 빌드* 검증으로 대체할 수는 없으나 회귀 가드로 충분.

## 🧪 Verification

### 자동 테스트
```bash
cd studio && pnpm test
```

**결과 요약**:
- ✅ 전체: `103 test files, 724 tests passed`
- ✅ react 컴파일러: `13 files, 109 tests passed`
- ✅ in-process tsc 진단: `29/29 (28 fixtures + sanity)`
- ✅ 결정성 (28 fixture × 2회): hash 동일

### 통합 테스트
```bash
cd studio && pnpm test src/lib/spec-md-compiler/react/__tests__/ts-diagnose.test.ts
```

### 빌드
```bash
pnpm --filter studio build
# ✓ built in 208ms (TS6133 0 건)
```

### 수동 검증 시나리오
1. `<LoginPage />` + componentName=LoginPage → 생성 TSX 가 `import { LoginPage }` 생략 + `export function LoginPage()` (C9 회피)
2. `<Button />` 컴파일 → 함수 body 에 JSX 0회, return 안에 1회 (C2 회피)
3. registryDependencies = `["Button", "LoginForm"]` 입력 → `["button", "login-form"]` 출력 (C6)
4. 빌드 재실행 → exit 0 (C7)

## 📦 Files Changed

### 🆕 New Files

- `studio/src/lib/spec-md-compiler/paper/__tests__/component-import-paths.test.ts` (+40): COMPONENT_IMPORT_PATHS 1:1 매핑 검증 (28 entry, 디렉토리 분류).
- `studio/src/lib/spec-md-compiler/react/__tests__/imports-builder.directory.test.ts` (+70): directory-aware import + excludeName.
- `studio/src/lib/spec-md-compiler/react/__tests__/jsx-single-emit.test.ts` (+86): JSX 단일 emit + 함수명 충돌 회피.
- `studio/src/lib/spec-md-compiler/react/__tests__/ts-diagnose.test.ts` (+34): 28-fixture in-process tsc 진단 (Integration Test).
- `studio/src/lib/spec-md-compiler/react/__tests__/utils/ts-verifier.ts` (+89): typescript Compiler API 진단 유틸.

### 🛠 Modified Files

- `studio/src/lib/spec-md-compiler/paper/component-registry.ts` (+46): `COMPONENT_IMPORT_PATHS` + `lookupImportPath` export.
- `studio/src/lib/spec-md-compiler/react/imports-builder.ts` (+15, -2): registry lookup + `excludeName` 옵션.
- `studio/src/lib/spec-md-compiler/react/compile.ts` (+11, -8): JSX 단일 emit + validator 호출 + excludeName 전달.
- `studio/src/lib/spec-md-compiler/react/registry-writer.ts` (+44, -2): kebab-case 정규화 + `validateShadcnRegistryItem`.
- `studio/src/lib/spec-md-compiler/react/__tests__/registry-writer.test.ts` (+66, -3): kebab + URL + validator 케이스.
- `studio/src/lib/spec-md-compiler/react/__tests__/compile.test.ts` (+15, -3): i18n fake-pass 정정.
- `studio/src/lib/spec-md-compiler/react/__tests__/cli.test.ts` (-1 import): TS6133 정리.
- `studio/src/lib/spec-md-compiler/react/__tests__/imports-builder.test.ts` (+1, -1): TS6133 정리.
- `studio/src/lib/paper-inference/cli/paper-to-spec.ts` (+1): TS6133 정리 + stderr 메시지 복구.

**Total**: 30 files changed (`git diff --shortstat`: +2054 / -17, spec/plan/task 등 산출물 포함)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (724/724)
- [x] 통합 테스트 통과 (28/28 fixture × in-process tsc)
- [x] `pnpm --filter studio build` 통과
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 결정성 테스트 28-fixture PASS (회귀 0)
- [ ] 사용자 검토 + 머지

## 🔗 관련 자료

- Phase: `backlog/phase-7.md`
- Walkthrough: `specs/spec-7-10-react-compiler-correctness/walkthrough.md`
- 감사 보고서: phase-7 ship 직전 Opus 독립 감사 (`/hk-phase-review` 결과)
- 처리 범위 외 (phase-8 후보): C5 paper-inference self-referential, C8 paper-normalizer 통합, W2/W3/W5/W9/W10
