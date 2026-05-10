# Walkthrough: spec-7-05

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| JSX 생성 방식 | React.createElement (runtime) vs 순수 문자열 조작 | **순수 문자열** | spec-7-03 의 react-builder.ts 는 SSR 렌더링 전용. 정적 파일 출력에는 런타임 불필요 |
| ## Behavior 파싱 위치 | spec-7-02 parser 확장 vs React 컴파일러 내 재파싱 | **React 컴파일러 내 section-parser** | spec-7-02 parser 는 이미 merge 됨. 휴리스틱 재파싱으로 MVP 충분 — 향후 parser first-class 확장 시 교체 가능 |
| i18n import 방식 | `useTranslation` 삽입 vs 플레이스홀더만 방출 | **`useTranslation` import 자동 삽입** | 생성 TSX 가 바로 동작하는 형태여야 shadcn registry 배포 시 사용성이 있음 |
| props 정렬 | 입력 순서 유지 vs 알파벳 정렬 | **알파벳 정렬** | 결정성(determinism) 보장 — Map/Object 키 순서는 엔진/버전마다 다를 수 있음 |
| component-registry 재사용 | 이름 목록 복사 vs `registeredNames()` import | **`registeredNames()` import** | DRY — spec-7-03 에서 컴포넌트 추가 시 자동 반영 |
| CLI main() 실행 guard | 모듈 진입 시 즉시 실행 vs import.meta.url check | **import.meta.url check** | vitest 가 모듈을 import 시 main() 실행되어 process.exit() 호출 → 테스트 중단. 동일 패턴 paper-to-spec CLI 에서 이미 적용 |

## 💬 사용자 협의

- **주제**: spec-7-05 아키텍처 설명
  - **사용자 의견**: "spec → react 가 바로 가능한 건 SSOT 때문인건가? 나중에 paper 를 생각 가능하고?"
  - **합의**: spec.md 가 SSOT 이므로 Paper 와 React 는 병렬 소비자. `spec → Paper → React` (디자이너 워크플로) 와 `spec → React` (개발자 워크플로) 두 경로가 공존. 둘 다 React 입력은 항상 spec.md 이므로 SSOT 유지.

## 🧪 검증 결과

### 1. 단위 테스트

| 파일 | 테스트 수 | 결과 |
|---|:---:|:---:|
| `jsx-emitter.test.ts` | 13 | ✅ PASS |
| `section-parser.test.ts` | 9 | ✅ PASS |
| `behavior-emitter.test.ts` | 6 | ✅ PASS |
| `variant-emitter.test.ts` | 5 | ✅ PASS |
| `registry-writer.test.ts` | 5 | ✅ PASS |
| `imports-builder.test.ts` | 4 | ✅ PASS |
| `compile.test.ts` | 5 | ✅ PASS |
| `cli.test.ts` | 5 | ✅ PASS |

### 2. 28-fixture 결정성 벤치마크

- **명령**: `pnpm --filter studio test src/lib/spec-md-compiler/react/__tests__/determinism.test.ts`
- **결과**: ✅ **28/28 PASS — 결정성 100%**
- 상세 결과: `react-compile-report.md` 참조

### 3. 전체 회귀 테스트

- **명령**: `pnpm --filter studio test`
- **결과**: ✅ **615 tests PASS** (91 test files) — 신규 81개 포함

## 🔍 발견 사항

- **## Behavior / ## Variants 파싱 취약성**: MarkdownText 를 줄 단위로 재파싱하는 구조라 spec.md 문법이 강화되면 교체 필요. MVP 수준에서는 충분.
- **component-registry.ts 의 React import 오염**: `COMPONENT_REGISTRY` 는 실제 React ComponentType 을 import 하므로 Node 환경에서 import 시 React context 없이도 동작 가능한지 확인 필요. 현재는 `registeredNames()` 만 사용하므로 문제 없음.
- **variants switch 의 JSX 반환**: 현재 `<ComponentName prop="value" />` 형태로 방출되나, children 이 있는 컴포넌트는 paired 형태가 필요 — 단순 prop-only 케이스만 MVP 지원.

## 🚧 이월 항목

- **실 Paper round-trip 검증** — spec-7-04 이월 항목과 연계. spec.md → React 로 생성된 코드가 Paper 에서 렌더링되는지 시각 확인.
- **TypeScript 정밀 prop 타입** — 현재 생성 TSX 의 컴포넌트 props 는 `Record<string, unknown>` 고정. 향후 catalog.json axis 정보 기반 정밀 타입 생성 고려.
- **## Behavior 복잡 케이스** — async/await, reducer, 복수 state 의존성 → 후속 spec.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (claude-sonnet-4-6) + dennis |
| **작성 기간** | 2026-05-10 |
| **결정성 결과** | ✅ PASS (28/28, 100%) |
| **전체 테스트** | ✅ 615 tests PASS |
