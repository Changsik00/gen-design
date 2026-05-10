# Task List: spec-7-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 백로그 업데이트 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + jsx-emitter

- [x] `git checkout -b spec-7-05-react-compiler` (base: `phase-7-design-md`)
- [x] `react/jsx-emitter.ts` — `emitJSX(node, indent, ctx)` → string
  - ComponentInstance → self-closing / paired JSX
  - props 알파벳 정렬 (결정성)
  - tokens → `style={{ "--token-key": "..." }}`
  - theme → `data-theme="..."`
  - children 재귀
- [x] `react/jsx-emitter.ts` — `emitDocument(doc, ctx)` → JSX body string (body 전체 방출)
- [x] 단위 테스트 10 case:
  - self-closing with string prop / number prop / boolean prop
  - paired with children
  - tokens prop → style attribute
  - theme → data-theme
  - Placeholder(i18n) → `{t("key")}`
  - Placeholder(token) → `{tokens["key"]}`
  - MarkdownText → `{/* text */}`
  - Comment → `{/* text */}`
  - props 알파벳 정렬 확인
  - nested 3-depth
- [x] Commit: `feat(spec-7-05): jsx-emitter core (ComponentInstance → JSX string)`

---

## Task 2: section-parser

- [x] `react/section-parser.ts` — `extractSections(doc)` → `SectionResult`
  - MarkdownText body 순회 → `## Behavior` / `## Variants` 섹션 탐지
  - behavior: `- state: name: Type = default` / `- handler: name` 파싱
  - variants: `- VariantName: prop=value[, prop=value]*` 파싱
  - 인식 불가 줄 → `rawUnknown[]`
  - `bodyWithoutSections`: ## Behavior/Variants MarkdownText 를 제거한 나머지 Block[]
- [ ] 단위 테스트 8 case:
  - state 1개 파싱
  - handler 1개 파싱
  - state + handler 혼합
  - 인식 불가 줄 → rawUnknown
  - variant 1개 파싱 (단일 prop)
  - variant 복수 props 파싱
  - Behavior 섹션 없는 경우 → null
  - Variants 섹션 없는 경우 → null
- [ ] Commit: `feat(spec-7-05): section-parser (## Behavior / ## Variants → IR)`

---

## Task 3: behavior-emitter + variant-emitter

- [x] `react/behavior-emitter.ts` — `emitHooks(behavior)` → string
  - `const [name, setName] = useState<Type>(default);`
  - `const handler = () => { /* TODO */ };`
  - `// TODO: <rawUnknown>` stub
- [ ] `react/variant-emitter.ts` — `emitVariants(variants, componentName)` → string
  - 1개 → `if (variant === "Name") return <.../>` 블록
  - 복수 → `switch (variant) { case "Name": return <.../>; }`
  - `export function <ComponentName>Variants({ variant }: { variant: string })` 래퍼
- [ ] 단위 테스트 behavior 6 case:
  - state 1개
  - handler 1개
  - state 2개 + handler 2개
  - rawUnknown stub
  - 빈 BehaviorSpec (hooks 없음)
  - 타입 + 기본값 다양 (string / number / boolean)
- [ ] 단위 테스트 variant 6 case:
  - variant 없음 → 빈 string
  - variant 1개 단일 prop
  - variant 1개 복수 props
  - variant 3개 → switch 분기
  - props 알파벳 정렬 확인
  - 컴포넌트 이름 PascalCase → 함수 이름 변환
- [ ] Commit: `feat(spec-7-05): behavior-emitter + variant-emitter (hook stubs + conditional rendering)`

---

## Task 4: registry-writer + imports builder

- [ ] `react/registry-writer.ts` — `toRegistryEntry(componentName, tsxContent, deps)` → RegistryEntry
  - `name`: PascalCase → `kebab-case` 변환
  - `type`: `"registry:block"` 고정
  - `registryDependencies`: `deps` 배열 (알파벳 정렬)
  - `files[0].path`: `registry/<kebab-name>/<kebab-name>.tsx`
  - `files[0].type`: `"registry:component"`
- [ ] `react/imports-builder.ts` — `buildImports(ctx, usedComponents)` → string
  - `usedI18nKeys.size > 0` → `import { useTranslation } from 'react-i18next'`
  - `usedTokenKeys.size > 0` → `import { tokens } from '@/lib/tokens'`
  - `usedComponents` → `import { ComponentName } from '@/components/...'` (COMPONENT_REGISTRY 경로 기반)
- [ ] 단위 테스트 registry-writer 4 case:
  - 기본 entry 생성 (name, type, path 확인)
  - deps 알파벳 정렬
  - PascalCase → kebab-case (복수 단어)
  - 빈 deps
- [ ] 단위 테스트 imports-builder 4 case:
  - i18n import 삽입
  - token import 삽입
  - 컴포넌트 import 삽입
  - 모두 없는 경우 → 빈 string
- [ ] Commit: `feat(spec-7-05): registry-writer + imports-builder (shadcn registry 출력)`

---

## Task 5: compile.ts 공용 API

- [ ] `react/compile.ts` — `compileToReact(input)` → CompileResult
  - `text` 있으면 parse → ast
  - `ast` 있으면 그대로
  - `extractSections(doc)` → SectionResult
  - `emitDocument(bodyWithoutSections, ctx)` → JSX body
  - `emitHooks(behavior)` → hook stubs
  - `emitVariants(variants, componentName)` → variant block
  - `buildImports(ctx, usedComponents)` → import block
  - 조립: `import block + function body + variants export` → 완성 TSX
  - `toRegistryEntry(componentName, tsx, deps)` → registry
  - 파싱 에러 시 `{ ok: false, errors }`
- [ ] 단위 테스트 5 case (end-to-end):
  - 단순 spec (ComponentInstance 1개) → tsx 확인
  - i18n placeholder → t() + import 확인
  - ## Behavior state → useState 확인
  - ## Variants 2개 → switch 확인
  - parse 에러 입력 → ok: false + errors 확인
- [ ] Commit: `feat(spec-7-05): compile.ts — compileToReact public API`

---

## Task 6: CLI spec-react

- [ ] `react/cli/spec-react.ts`
  - `parseArgs(argv)` → `{ file, out?, registry, name? }`
  - `runCompile(args)` → stdout or 파일 저장
  - `--registry` 없으면 tsx 텍스트만 stdout
  - `--registry` + `--out <dir>` 있으면 `<dir>/<name>.tsx` + `<dir>/registry.json` 저장
  - 파일 없음 / parse 에러 → stderr 출력 + exit 1
- [ ] `studio/package.json` `"spec-react"` 스크립트 추가
- [ ] 단위 테스트 4 case (함수 직접 호출):
  - 정상 파일 → tsx stdout
  - `--registry` → entry 반환 확인
  - `--name` override → 이름 반영 확인
  - 존재하지 않는 파일 → error 처리
- [ ] Commit: `feat(spec-7-05): CLI spec-react entry`

---

## Task 7: 28-fixture 결정성 벤치마크

- [ ] `react/__tests__/determinism.test.ts`
  - 28 fixture spec.md 각각 `compileToReact` 두 번 실행
  - 두 결과의 tsx 해시 비교 (SHA-256 또는 문자열 동일 비교)
  - 모두 100% 일치 → PASS
  - 결과를 `react-compile-report.md` 에 저장 (fixture 이름 + PASS/FAIL)
- [ ] **Go/No-Go**: 결정성 100% PASS / 하나라도 비결정 → FAIL + walkthrough 사유 기재
- [ ] Commit: `test(spec-7-05): 28-fixture determinism benchmark`

---

## Task 8: Ship

- [ ] `pnpm --filter studio test` 전체 PASS
- [ ] **walkthrough.md 작성** — 결정성 결과 + section-parser 설계 결정 + i18n 처리 결정 기록
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit + Push + PR 생성** (spec → `phase-7-design-md`)
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **예상 commit 수** | 8 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |

## 위험 / 주의

- **## Behavior / ## Variants 파싱 취약성**: spec-7-02 parser 가 해당 섹션을 MarkdownText 로 방출하므로 section-parser 는 휴리스틱 재파싱. 문법이 spec.md 에서 강화되면 section-parser 갱신 필요.
- **i18next 의존성**: 프로젝트에 i18next 미설치 시 `import { useTranslation }` 줄만 생성하고 런타임 에러는 소비자 책임 — 컴파일러 자체는 문자열만 방출.
- **COMPONENT_REGISTRY 이름 검증**: 레지스트리에 없는 컴포넌트 이름이 spec.md 에 있으면 그대로 방출 (lint 는 spec-7-02 의 catalog-check 에서 담당 — 본 컴파일러는 신뢰).
