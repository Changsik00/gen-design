# spec-08-07: chat → React 컴파일러 — shell inherit + scene 통합 TSX

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-08-07` |
| **Phase** | `phase-08` (chat-agent-flow) |
| **Branch** | `spec-08-07-chat-react-compiler` |
| **상태** | Planning |
| **타입** | Feature (compile pipeline + CLI) |
| **Integration Test Required** | yes (PoC scene + shell → TSX round-trip) |
| **작성일** | 2026-05-12 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- spec-08-04 — chat.md frontmatter 의 `shell.{inherit, exclude}` 와 Placeholder kind `scene` (예: `{{scene.content}}`) parse 가능
- 기존 `compileToReact()` — 단일 chat.md → 단일 TSX (component 단위). scene + shell 합성 X
- PoC `playground/chats/_shell.chat.md` 와 `playground/chats/scenes/login.chat.md` 이미 존재 — *grammar 레벨* 만 인식, 실제 TSX 출력 0

### 문제점

1. **scene 의 *통짜 페이지* 출력 0**: scene 의 Structure body 가 shell 의 외각 안에 inject 되어야 하지만 *해석기* 없음
2. **shell.exclude 무력**: scene 의 frontmatter `shell.exclude: [BrandHeader]` 가 *기록만* 됨 — 실제 shell 의 BrandHeader 가 출력에 들어감
3. **`{{scene.content}}` placeholder 처리 0**: shell 의 Structure body 안 `{{scene.content}}` 가 *해석되지 않고 JSX expression 으로 그대로* 흘러감
4. **dogfooding 출력 측 미완성**: phase-8 의 핵심 흐름 (Paper → chat → React) 의 *마지막 단계* 가 비어있음. 외부 alpha 검증 (08-11) 의 전제

### 해결 방안 (요약)

`compileScene(sceneSlug, opts)` 신규 — chats/scenes/<slug>.chat.md + chats/_shell.chat.md → 합성 TSX:

1. scene chat parse → scene AST
2. shell chat parse → shell AST
3. scene.frontmatter.shell.inherit 체크 — false 면 scene 단독 컴파일
4. shell.exclude 적용 — shell.Structure 안 ComponentInstance 제거
5. `{{scene.content}}` Placeholder 위치에 scene.Structure.body inject
6. 합성 AST → 기존 `compileToReact` 의 JSX/imports emitter 재사용
7. 결과: 단일 TSX 파일 (LoginScene.tsx)

`gen-design react <scene-slug>` 서브커맨드 — CLI 진입점.

> spec-08-04 grammar 의 *기록* 한 의미 정보 (shell.inherit / exclude / scene placeholder) 를 *해석* 으로 승격. ADR-010 D-2 (shell 승격) 의 *컴파일* 측 호응.

## 🎯 요구사항

### Functional Requirements

#### F-1: `compileScene(sceneSlug, opts)` 함수

```ts
interface CompileSceneOptions {
  chatRoot: string;     // chats/ 디렉토리 절대 경로
  catalog?: CatalogMap;
}

interface CompileSceneResult {
  ok: boolean;
  tsx?: string;
  registry?: RegistryEntry;   // 기존 compileToReact 와 동일
  errors: CompileError[];
}

export function compileScene(sceneSlug: string, opts: CompileSceneOptions): CompileSceneResult;
```

동작:
- `<chatRoot>/scenes/<sceneSlug>.chat.md` 로드
- frontmatter.shell.inherit === true 이면 `<chatRoot>/_shell.chat.md` 도 로드
- 합성 → TSX

#### F-2: shell.inherit 해석

- `shell.inherit: false` 또는 부재 → scene 단독 컴파일 (기존 compileToReact 와 동등)
- `shell.inherit: true` → shell merge 적용

#### F-3: shell.exclude 적용

- scene.frontmatter.shell.exclude = `[ComponentName, ...]` (PascalCase)
- shell.Structure.body 의 ComponentInstance 중 *이름이 exclude 에 있으면* 제거 (재귀 walk)
- 제거된 component 의 자식은 함께 사라짐

#### F-4: `{{scene.content}}` Placeholder substitution

- shell.Structure.body 의 *모든 Placeholder (kind="scene", path="content")* 를 scene.Structure.body 로 *교체*
- Placeholder 가 *없으면* 경고 (shell 이 scene content inject 위치 미지정 — 컴파일 실패 X, 단 scene body 누락)
- 다중 placeholder 는 *동일 scene body* 로 모두 교체 (변형 후 동작은 후속 spec)

#### F-5: `gen-design react <scene-slug>` 서브커맨드

```
gen-design react <scene-slug> [options]

Options:
  --chat-root <path>      chats/ 디렉토리 (기본: 현재 디렉토리의 chats)
  --output <path>         TSX 파일 저장 (기본: stdout)
  --registry <path>       shadcn registry.json 도 저장 (옵션)
  --no-shell              shell.inherit 무시 (scene 단독 컴파일)
  --help, -h
```

#### F-6: 결정성

- 같은 chat 군 → 같은 TSX 출력 (deep equal)
- shell 변경 → scene TSX 출력에 즉시 반영
- imports 정렬 결정 (기존 imports-builder 활용)

### Non-Functional Requirements

1. **회귀 0**: 기존 `compileToReact` (단일 component) 영향 0 — `compileScene` 별도
2. **재사용**: 기존 jsx-emitter / imports-builder / variant-emitter / behavior-emitter / registry-writer 재사용
3. **결정성 테스트**: 2회 호출 hash 비교
4. **테스트 커버리지**: shell merge 8+ / placeholder substitute 4+ / CLI 5+ / 통합 (dogfood login) 3+

## 🚫 Out of Scope

- **shell 안 dynamic prop pass-through** — 후속 spec
- **scene 의 *부분* shell** (특정 영역만 inherit) — 후속 spec
- **Studio runtime 의 scene 렌더링** — phase-9 후보
- **catalog 어휘 매칭의 회귀 모드** — phase-9
- **shell 의 *상속 깊이 2+*** (shell-of-shell) — 후속 spec (PoC 미발생)

## ✅ Definition of Done

- [ ] `studio/src/lib/chat-md-compiler/react/compile-scene.ts` 신규 — `compileScene()`
- [ ] shell merge 알고리즘 (exclude + placeholder substitute) 단위 테스트 8+
- [ ] CLI `studio/scripts/gen-design/react.ts` — `parseReactArgs` + `runReact`
- [ ] gen-design router 에 `react` 추가
- [ ] CLI 단위 테스트 5+
- [ ] 통합 테스트 — dogfood `playground/chats/scenes/login.chat.md` + `_shell.chat.md` → TSX:
  - [ ] BrandHeader 미포함 (shell.exclude 적용)
  - [ ] AppFooter 포함 (inherit)
  - [ ] LoginForm 본문 inject
  - [ ] 결정성 (2회 hash 동일)
- [ ] `pnpm test` 회귀 0 (≥ 887, 신규 +)
- [ ] `pnpm --filter studio build` exit 0
- [ ] manual CLI: `pnpm gen-design react login --chat-root playground/chats` → 의도된 TSX
- [ ] walkthrough.md + pr_description.md ship commit
- [ ] PR 생성 + 사용자 검토
