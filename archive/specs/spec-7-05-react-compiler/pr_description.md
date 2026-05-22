# feat(spec-7-05): spec.md → React 컴파일러

## 📋 Summary

### 배경 및 목적

spec.md AST 를 입력받아 **결정성 있는(deterministic) React TSX 파일**을 생성하는 컴파일러입니다.
spec-7-03 (spec→Paper) 과 병렬 경로로, spec.md SSOT 에서 React 코드를 직접 출력합니다.

- `spec → React` — 개발자 워크플로 (spec.md 직접 편집 → 코드 생성)
- `spec → Paper → spec(재추출) → React` — 디자이너 워크플로 (Paper 수정 → spec-7-04 역추출 → 코드 재생성)

출력은 **shadcn registry 형식** (`{ name, type: "registry:block", files: [...] }`) 으로 배포 가능합니다.

### 주요 변경 사항

- [x] `studio/src/lib/spec-md-compiler/react/` 라이브러리 신규 생성 (8개 모듈)
- [x] **component-registry.ts 재사용 (DRY)**: `registeredNames()` import — 이름 목록 복사 없음
- [x] **결정성 100%**: 동일 spec.md → 동일 TSX 출력 (props 알파벳 정렬)
- [x] **28-fixture 벤치마크**: 결정성 Go/No-Go PASS (28/28)
- [x] CLI `pnpm --filter studio spec-react <spec.md> [--registry] [--out <dir>]`

### Phase 컨텍스트

- **Phase**: `phase-7` (Design FRONT.md 시스템 — spec.md ↔ Paper ↔ React 양방향 파이프라인)
- **본 SPEC 의 역할**: spec-7-03/04 의 Paper 경로와 병렬로 React 코드 출력 경로 완성. phase-7 의 "spec.md → 동작하는 React" 마지막 단계.

## 🎯 Key Review Points

1. **section-parser (spec-7-02 parser 의존 없음)**: `## Behavior` / `## Variants` 섹션을 MarkdownText 에서 재파싱. spec-7-02 parser 가 이들을 first-class 노드로 지원하면 교체 예정.

2. **결정성 보장 전략**: props 키를 알파벳 정렬 (`Object.keys().sort()`) — Map/Object 순서가 엔진마다 다를 수 있으므로 명시 정렬. `sha256(tsx_run1) === sha256(tsx_run2)` 로 28 fixture 검증.

3. **compile.ts 파이프라인**: `parse → extractSections → emitDocument → emitHooks → emitVariants → buildImports → assemble` 순서. 각 단계가 독립 모듈이라 교체 가능.

4. **CLI main() guard**: `import.meta.url.endsWith(process.argv[1])` 로 vitest import 시 main() 실행 방지 — paper-to-spec CLI 와 동일 패턴.

## 🧪 Verification

### 자동 테스트

```bash
# react 컴파일러 단위 테스트
pnpm --filter studio test src/lib/spec-md-compiler/react/

# 28-fixture 결정성 벤치마크
pnpm --filter studio test src/lib/spec-md-compiler/react/__tests__/determinism.test.ts

# 전체 회귀
pnpm --filter studio test
```

**결과 요약**:
- ✅ `jsx-emitter.test.ts`: 13/13 PASS
- ✅ `section-parser.test.ts`: 9/9 PASS
- ✅ `behavior-emitter.test.ts`: 6/6 PASS
- ✅ `variant-emitter.test.ts`: 5/5 PASS
- ✅ `registry-writer.test.ts`: 5/5 PASS
- ✅ `imports-builder.test.ts`: 4/4 PASS
- ✅ `compile.test.ts`: 5/5 PASS
- ✅ `cli.test.ts`: 5/5 PASS
- ✅ `determinism.test.ts`: 28/28 PASS (결정성 100%)
- ✅ 전체 회귀: 615 tests PASS

### 수동 검증 시나리오

```bash
echo '<Button variant="primary" />' > /tmp/t.spec.md
pnpm --filter studio spec-react /tmp/t.spec.md
# → export function T() { return (<> <Button variant="primary" /> </>); }
```

## 📦 Files Changed

### 🆕 New Files

- `studio/src/lib/spec-md-compiler/react/jsx-emitter.ts`: `emitJSX()` — ComponentInstance → JSX string
- `studio/src/lib/spec-md-compiler/react/section-parser.ts`: `extractSections()` — ## Behavior/Variants 재파싱
- `studio/src/lib/spec-md-compiler/react/behavior-emitter.ts`: `emitHooks()` — useState + handler stubs
- `studio/src/lib/spec-md-compiler/react/variant-emitter.ts`: `emitVariants()` — switch 분기
- `studio/src/lib/spec-md-compiler/react/registry-writer.ts`: `toRegistryEntry()` — shadcn registry JSON
- `studio/src/lib/spec-md-compiler/react/imports-builder.ts`: `buildImports()` — import block 생성
- `studio/src/lib/spec-md-compiler/react/compile.ts`: `compileToReact()` — 공용 API
- `studio/src/lib/spec-md-compiler/react/cli/spec-react.ts`: CLI entry
- `studio/src/lib/spec-md-compiler/react/__tests__/*.test.ts`: 8개 테스트 파일
- `react-compile-report.md`: 28-fixture 결정성 벤치마크 결과

### 🛠 Modified Files

- `studio/package.json`: `spec-react` 스크립트 추가

**Total**: 10 new files, 1 modified

## ✅ Definition of Done

- [x] 모든 단위 테스트 PASS (615 tests)
- [x] 28-fixture 결정성 벤치마크 PASS (100%)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 전체 회귀 테스트 PASS

## 🔗 관련 자료

- Phase: `backlog/phase-7.md`
- Walkthrough: `specs/spec-7-05-react-compiler/walkthrough.md`
- Benchmark: `react-compile-report.md`
- 병렬 경로 (Paper): `specs/spec-7-03-spec-to-paper/`, `specs/spec-7-04-paper-to-spec/`
