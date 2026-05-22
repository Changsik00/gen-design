# spec-08-07: chat → React 컴파일러 — shell inherit + scene 통합 TSX

## 🎯 목적

spec-08-04 의 grammar 가 *기록* 한 `shell.{inherit, exclude}` + `{{scene.content}}` 를 *해석* 으로 승격 → **단일 scene TSX 출력**. phase-8 dogfooding 흐름 (Paper → chat → React) 마지막 단계 완성.

## 🔄 Before / After

### Before
- `shell.inherit / exclude / {{scene.content}}` 의미 *기록* 만
- 기존 `compileToReact()` 는 단일 component 단위 (scene + shell 합성 X)
- phase-8 dogfooding 흐름의 *마지막 단계* 비어있음

### After
- `compileScene(slug, opts)` — chat 디렉토리에서 scene + shell 로드 + merge
- `mergeShellAndScene` — exclude 적용 + placeholder substitute
- `gen-design react <slug>` — slug 기반 CLI
- dogfood: BrandHeader 제외 ✓ AppFooter 포함 ✓ LoginForm inject ✓ 결정성 ✓

## 📌 핵심 변경

| 파일 | 변경 |
|---|---|
| `studio/src/lib/chat-md-compiler/react/shell-merge.ts` | 신규 — `mergeShellAndScene()` (exclude + placeholder substitute) |
| `studio/src/lib/chat-md-compiler/react/compile-scene.ts` | 신규 — `compileScene(slug, opts)` 진입점 |
| `studio/scripts/gen-design/react.ts` | 신규 — `parseReactArgs` + `runReact` |
| `studio/scripts/gen-design.ts` | router 에 `react` 추가 |
| `studio/src/lib/chat-md-compiler/react/__tests__/` | shell-merge / compile-scene / dogfood (3 신규) |
| `studio/scripts/gen-design/__tests__/` | react-args / react-runtime (2 신규) |
| `studio/scripts/__tests__/gen-design.test.ts` | router 테스트 +2 |

## 🔑 8 핵심 결정

1. **shell 해석 위치 = AST 합성 (compile *전*)** — 기존 emit 파이프라인 재사용 극대화
2. **shell.exclude = 통째 제거 (재귀)** — 단순 + 디자이너 의도 일치
3. **`{{scene.content}}` → scene.structure.body 교체** — grammar 의미 정보 1:1 활용
4. **다중 placeholder = 동일 body 복제** — 단순. 변형은 후속
5. **shell.inherit ≠ true → scene 단독** — 기존 compileToReact 동등
6. **CLI = slug 입력** — dogfooding 자연 명령형
7. **catalog 위임** — 일관성 + 회귀 0
8. **`structuredClone`** — AST aliasing 위험 차단

## ✅ 검증

- **신규 테스트**: **32/32 PASS** (shell-merge 7 / compile-scene 6 / react-args 6 / react-runtime 5 / router +2 / dogfood 6)
- **전체 회귀**: 887 → **919/919 PASS**
- **`pnpm --filter studio build`**: exit 0
- **manual CLI**:
  - `pnpm gen-design react login --chat-root playground/chats` → TSX 출력 (BrandHeader 태그 X, AppFooter O, LoginForm O)
  - 2회 실행 동일 (결정성 PASS)

## 🔗 후속 spec 영향

- **spec-08-08** gen-design merge — shell 승격 휴리스틱
- **spec-08-09** gen-design lint — scene + shell 정합성 검증
- **spec-08-10** studio runtime — compileScene 결과 라이브 inject
- **spec-08-11** 외부 alpha — 최종 TSX 산출물 검증

## 📦 Commits

1. `test(spec-08-07): add failing tests for shell-merge`
2. `feat(spec-08-07): implement shell-merge algorithm`
3. `feat(spec-08-07): implement compileScene entry`
4. `feat(spec-08-07): add gen-design react subcommand`
5. `test(spec-08-07): add dogfood integration for login scene compile`
6. `docs(spec-08-07): ship walkthrough and pr description`

## 🛡️ Rollback

단일 PR. `git revert` 안전 — 신규 파일만 + router 1 행 추가. 기존 `compileToReact` / `chat-react` CLI 영향 0.

## 📚 References

- [walkthrough.md](walkthrough.md) — 8 핵심 결정 + 후속 영향 + 교훈
- [ADR-010 chat 승격 정책](../../docs/decisions/ADR-010-chat-promotion-policy.md) — D-2 (shell 승격) 의 *컴파일* 측 호응
